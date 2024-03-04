import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { PlusCircleIcon } from 'lucide-react'
import { v4 } from "uuid";

type Props = {}

const CreateNewChatButton = (props: Props) => {
    return (
        <Link href={`/`}>
            <Button title='create new chat' className='w-full'>
                    <PlusCircleIcon className='mr-2 w-4 h-4' />
                    New chat
            </Button>
        </Link>
    )
}

export default CreateNewChatButton;