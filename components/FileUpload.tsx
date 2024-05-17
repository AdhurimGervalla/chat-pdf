'use client';
import { uploadToS3 } from '@/lib/s3';
import { useMutation } from '@tanstack/react-query';
import { Inbox, Loader2 } from 'lucide-react';
import React from 'react';
import {useDropzone} from 'react-dropzone';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { DrizzleWorkspace } from '@/lib/db/schema';
import { UserContext } from '@/context/UserContext';

type Props = {
    refetchCb?: any;
    workspace: DrizzleWorkspace;
}

const FileUpload = ({workspace, refetchCb}: Props) => {
    const [uploading, setUploading] = React.useState(false);
    const {user} = React.useContext(UserContext);
    const {mutate, isPending} = useMutation({
        mutationFn: async ({file_key, file_name}: {file_key: string, file_name: string}) => {
            if (!user || !user.apiKey) {
                toast.error('API Key not found');
                return;
            }
            const response = await axios.post('/api/upload-file-to-workspace', {
                file_key, file_name, workspaceIdentifier: workspace.identifier, workspaceId: workspace.id, apiKey: user.apiKey
            });
            refetchCb();
            return response.data;
        }
    });

    const {getRootProps, getInputProps} = useDropzone({
        accept: {'application/pdf': ['.pdf']},
        maxFiles: 1,
        onDrop: async (acceptedFiles) => {
            setUploading(true);
            const file = acceptedFiles[0];
            if (file.size > 50 * 1024 * 1024) {
                toast.error('File size must be less than 50MB');
                setUploading(false);
                return;
            }

            try {
                const data = await uploadToS3(file);
                if (!data?.file_key || !data?.file_name) {
                    toast.error('Something went wrong');
                    return;
                }
                mutate(data, {
                    onSuccess: ({chat_id}) => {
                        toast.success('PDF added to Context');
                        // router.push(`/chats/${chat_id}`);
                    },
                    onError: (error) => {
                        toast.error('Couldn\'t add PDF to Context');
                        console.log(error);
                    }
                });
            } catch (error) {
                toast.error('Something went wrong');
                console.log(error);
            } finally {
                setUploading(false);
                // setOpenNewChatCb(false);
            }
            
        }
    });
    return (
        <div className={`rounded-xl w-full`}>
            <div {...getRootProps({
                className: 'border-dashed border-2 cursor-pointer bg-gray-100 flex justify-center items-center flex-col w-full py-3'
            })}>
                <input {...getInputProps()} />
                {(uploading || isPending) ? 
                    <>
                        <Loader2 className='h-10 w-10 text-blue-500 animate-spin' />
                        <p className='mt-2 text-sm text-slate-400 dark:text-white'>Preparing context information</p>
                    </>
                    :
                    <>
                        <Inbox className='w-10 h-10 text-blue-500' />
                        <p className='mt-2 text-sm text-slate-400'>Drop pdf here</p>
                    </>
                }
            </div>
        </div>
    )
}

export default FileUpload