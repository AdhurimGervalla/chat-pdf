import React from 'react'
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import { DrizzleChat } from '@/lib/db/schema'

type Props = {
  setBookmarked: any;
  bookmarked: boolean;
}

const ToggleBookmarkedComponent = ({bookmarked, setBookmarked}: Props) => {
  
  return (
    <Button className={`transition-all hover:bg-green-500 ${bookmarked ? 'bg-green-500 hover:bg-black': ''}`} onClick={() => setBookmarked(!bookmarked)}><Bookmark /></Button>
  )
}

export default ToggleBookmarkedComponent;