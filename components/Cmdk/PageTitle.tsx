import React from 'react'

type Props = {
    children: React.ReactNode | React.ReactNode[]; 
}

const PageTitle = ({children}: Props) => {
  return (
    <h3 className='text-lg mb-5'>{children}</h3>
  )
}

export default PageTitle