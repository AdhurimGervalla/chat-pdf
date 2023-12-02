import React from 'react'
import { WorkspaceContext } from '@/context/WorkspaceContext'
import { DrizzleWorkspace } from '@/lib/db/schema'

type Props = {
    workspaces: DrizzleWorkspace[];
    theme?: 'light' | 'dark';
}

const Select = ({workspaces, theme = 'dark'}: Props) => {
  const {workspace, setWorkspace} = React.useContext(WorkspaceContext);
  const [selected, setSelected] = React.useState(workspace?.id.toString() || "");

  const onWorkspaceChangeHandler = (id: any) => {
    const ws = workspaces.find(el => el.id === parseInt(id));
    if (ws) {
      setWorkspace(ws);
    } else {
      setWorkspace(null);
    }
    
  }

  const handleChange = (event:any) => {
    onWorkspaceChangeHandler(event.target.value);
  };

  const themeClasses = {
    light: 'bg-white dark:bg-black text-gray-900 dark:text-gray-100',
    dark: 'bg-transparent text-white'
  }

  React.useEffect(() => {
    setSelected(workspace?.id.toString() || "");
  }, [workspace]);

  return (
    <div>
      {<select
        value={selected}
        id="location"
        name="location"
        className={"block w-full rounded-md border-0 py-1.5 pl-3 pr-10 sm:text-sm sm:leading-6"}
        onChange={handleChange}
      >
        <option value="0">no workspace selected</option>
        {workspaces.map((ws) => (
          <option key={ws.id} value={ws.id}>
            {ws.name}
          </option>
        ))}
      </select>}
    </div>
  )
}

export default Select