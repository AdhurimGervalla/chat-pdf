import React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { UserContext } from "@/context/UserContext";
import LoaderSpinner from "./LoaderSpinner";

type Props = {};

const ApiKeyField = (props: Props) => {
  const [apiKey, setApiKey] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const { refetch } = React.useContext(UserContext);

  const saveApiKey = async () => {
    if (!apiKey) {
      return;
    }
    setLoading(true);
    await fetch("/api/update-user-with-api-key", {
      method: "PUT",
      body: JSON.stringify({ apiKey }),
    });
    
    refetch(() => setLoading(false));
  };

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full sm:w-[fit-content] lg:w-auto">
      <div className="max-w-4xl  w-full mx-auto relative">
        {!loading ? (
          <div className="flex justify-center items-center gap-5">
            <Input
              id="api-key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Please enter your Chat-GPT API Key"
            />
            <Button onClick={saveApiKey}>Save API Key</Button>
          </div>
        ) : (
          <LoaderSpinner />
        )}
      </div>
    </div>
  );
};

export default ApiKeyField;
