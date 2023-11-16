import { DrizzleWorkspace } from '@/lib/db/schema';
import {useState, useEffect} from 'react';

const useGetCurrentWorkspace = () => {
    const [currentWorkspace, setCurrenWorkspace] = useState<DrizzleWorkspace | null>(null);

    useEffect(() => {
        console.log('useGetCurrentWorkspace inside', currentWorkspace);
    }, [currentWorkspace]);
    return {currentWorkspace, setCurrenWorkspace};
}

export default useGetCurrentWorkspace;
