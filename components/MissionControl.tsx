import { ShieldCloseIcon, X } from 'lucide-react'
import React from 'react'

type Props = {}

const MissionControl = (props: Props) => {
  return (
    <div className='w-[400px] h-[400px] bg-black rounded-full relative overflow-hidden'><Core/>
        <OuterSquare className='right-1/2'>
            <Square className='bg-transparent top-0 border-b-2 border-r-2 border-white'>
                <Label name={"Chats"}  className='bottom-[30%] right-[15%] text-white' />
            </Square>
            <Square className='bg-transparent bottom-0 botder-b-2'>
                <Label name={"Workspaces"} className='top-[30%] right-[15%] text-white' />
            </Square>
        </OuterSquare>
        <OuterSquare className='left-1/2'>
            <Square className='bg-transparent top-0 border-b-2 border-white'>
                <Label name={"Settings"}  className='bottom-[30%] left-[15%] text-white' />
            </Square>
            <Square className='bg-transparent bottom-0 border-l-2 border-white'>
                <Label name={"Search"} className='top-[30%] left-[15%] text-white' />
            </Square>
        </OuterSquare>
    </div>
  )
}

const Core = () => {
    return (
        <div className='w-[20%] h-[20%] bg-white z-10 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
            <span className='top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 absolute'>
                <X size={50} />
            </span>
        </div>
    )
}

const Label = ({name, className}: {name: string, className?: string}) => {
    return <span className={`absolute ${className}`}>{name}</span>;
}

const Square = ({children, className}: {children: JSX.Element | JSX.Element[], className: string} ) => {
    return (
        <div className={`w-full h-[50%] absolute ${className}`}>
            {children}
        </div>
    )
};

const OuterSquare = ({children, className}: {children: JSX.Element | JSX.Element[], className?: string} ) => {
    return (
        <div className={`w-full h-full absolute ${className}`}>
            {children}
        </div>
    )
}

export default MissionControl