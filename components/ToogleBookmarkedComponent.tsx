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
    <Button title='Show bookmarked chats' className={`transition-all ${bookmarked ? 'bg-primary': 'dark:bg-white dark:hover:bg-green-200'}`} onClick={() => setBookmarked(!bookmarked)}><Bookmark /></Button>
  )
}

export default ToggleBookmarkedComponent;