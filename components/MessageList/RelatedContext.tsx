import { DrizzleChat } from "@/lib/db/schema";
import { RelatedFile } from "@/lib/types/types";
import axios from "axios";
import { Info, Link, Loader2, MoreHorizontal } from "lucide-react";
import React from "react";
import RelatedChats from "./RelatedChats";

type Props = {
  messageId: string;
  relatedChatIds: string[] | null;
};

type DataD = {
  [key: string]: RelatedFile[];
};
const getRelatedContext = async (messageId: string): Promise<RelatedFile[]> => {
  try {
    const { data } = await axios.post(`/api/get-related-data/`, {
      messageId: messageId,
    });
    const grouped: DataD = data.data.reduce(
      (r: any, a: RelatedFile, index: number) => {
        r[index] = [...(r[index] || []), a];
        return r;
      },
      {}
    );
    const result = Object.values(grouped).flat();
    return result;
  } catch (e) {
    console.log(e);
  }
  return [];
};

const RelatedContext = ({ messageId, relatedChatIds }: Props) => {
  const [relatedContext, setRelatedContext] = React.useState<RelatedFile[]>();
  const [showRelatedContext, setShowRelatedContext] =
    React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const handle = async () => {
    setShowRelatedContext(!showRelatedContext);
    if (!relatedContext) {
      setIsLoading(true);
      const relatedContext = await getRelatedContext(messageId);
      setRelatedContext(relatedContext);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <p
        className="flex gap-2 cursor-pointer hover:text-green-500 transition-colors"
        onClick={handle}
      >
        <Info className="w-5 h-5" />
        {!showRelatedContext && <span>more infos</span>}
      </p>
      <div className="flex gap-x-2 items-start flex-wrap flex-col">
        {showRelatedContext && relatedContext && (
          <div>
            {relatedChatIds && (
              <RelatedChats
                relatedChatIds={relatedChatIds}
              />
            )}
            {relatedContext.map((context: RelatedFile, index: number) => (
              <React.Fragment key={index}>
                <div className="flex gap-2">
                  <span className=" font-bold">{context.fileName}:</span>
                  {context.pageNumbers.map((page: number, i: number) => (
                    <LinkItem
                      key={i}
                      url={context.url + "#page=" + page}
                      title={context.fileName + " Page " + page}
                    >
                      Page {page}
                    </LinkItem>
                  ))}
                </div>
              </React.Fragment>
            ))}
          </div>
        )}
        {showRelatedContext &&
          relatedContext &&
          relatedContext.length === 0 && <span>No context from files</span>}
        {isLoading && (
          <span className="mt-0">
            <Loader2 className="animate-spin w-4 h-4" />
          </span>
        )}
      </div>
    </div>
  );
};

export const LinkItem = ({
  url,
  children,
  title,
}: {
  url: string;
  children: any;
  title: string;
}) => {
  return (
    <a
      className="mt-0 hover:text-green-500 transition-colors flex items-center gap-1 mr-2"
      target="_blank"
      href={url}
      title={title}
    >
      <Link className="w-3 h-3" /> {children}
    </a>
  );
};

export default RelatedContext;
