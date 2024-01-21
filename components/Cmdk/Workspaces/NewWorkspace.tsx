import { Command } from "cmdk";
import React from "react";
import { Button } from "../../ui/button";
import { CrossIcon, Save, XIcon } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";
import { cn } from "@/lib/utils";

type Props = {
  refetchWorkspaces: () => void;
  reset: () => void;
};

const NewWorkspace = ({ refetchWorkspaces, reset }: Props) => {
  const [workspaceName, setWorkspaceName] = React.useState<string>("");
  const workspaceNameInputRef = React.useRef<HTMLInputElement>(null);

  setTimeout(() => {
    if (workspaceNameInputRef.current) {
      workspaceNameInputRef.current.focus();
    }
  }, 100);

  const createWorkspace = async () => {
    if (workspaceName.length > 0) {
      try {
        toast
          .promise(
            axios.post(`/api/create-workspace`, {
              workspaceName,
            }),
            {
              loading: "Creating new workspace...",
              success: "Saved workspace",
              error: "Couldn't save workspace",
            }
          )
          .then(() => {
            refetchWorkspaces();
            reset();
          });
      } catch (error: any) {
        // check if error status is 409
        // if so, then set workspaceName to ''
        // else, console.log(error)
        if (error.response.status === 409) {
          toast.error("Chat already exists in this workspace");
        }
      }
    }
  };

  return (
    <>
      <XIcon className={cn('absolute right-2 w-6 h-6 top-2 cursor-pointer transition-colors  dark:text-white hover:text-red-500 dark:hover:text-red-500')} onClick={reset} />

      <Command.Group className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-max">
        <div className="flex items-center justify-center relative">
          <input
            ref={workspaceNameInputRef}
            onChange={(e) => setWorkspaceName(e.target.value)}
            value={workspaceName}
            type="text"
            name="workspaceName"
            id="workspaceName"
            className="mr-3 rounded-md border-0 py-1.5 dark:text-white bg-transparent shadow-sm ring-1 ring-inset ring-transparent placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-transparent sm:text-sm sm:leading-6"
            placeholder="enter a name"
          />
          <Button className="h-[30px]" onClick={() => createWorkspace()}>
            <Save className="w-4 h-4 mr-2" /> Save
          </Button>
        </div>
      </Command.Group>
    </>
  );
};

export default NewWorkspace;
