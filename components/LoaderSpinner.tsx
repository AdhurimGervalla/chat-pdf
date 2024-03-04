import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react'
import React from 'react'

type Props = {
    width?: string;
    height?: string;
}

const LoaderSpinner = ({width = '50px', height = '50px'}:Props) => {
  return (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
    <Loader2 className={`animate-spin w-[${width}] h-[${height}]`} />
  </div>
  )
}

export default LoaderSpinner