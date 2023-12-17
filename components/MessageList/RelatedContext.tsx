import { RelatedFile } from '@/lib/types/types';
import axios from 'axios';
import React from 'react'

type Props = {
    messageId: string;
}
const getRelatedContext = async (messageId: string): Promise<RelatedFile[]> => {
    try {
        const {data} = await axios.post(`/api/get-related-data/`, { messageId: messageId });
        return data.data as RelatedFile[];
    } catch (e) {
        console.log(e);
    }
    return [];
}

const RelatedContext = ({messageId}: Props) => {
    const [relatedContext, setRelatedContext] = React.useState<RelatedFile[]>();

    const handle = async () => {
        const relatedContext = await getRelatedContext(messageId);
        console.log(relatedContext);
        setRelatedContext(relatedContext);
    }

    return (
        <>
            <p onClick={handle}>load related context da</p>
            {relatedContext && relatedContext.map((context: RelatedFile, index: number) => context.pageNumbers.map((page: number) => {
                return <a key={index} target='_blank' href={`${context.url}#page=${page}`}>Seite {page}</a>
            }))}
        </>

    )
}

export default RelatedContext