'use client';
import React from 'react'
import { Button } from './ui/button'
import { LightBulbIcon } from '@heroicons/react/20/solid';
import { Sun } from 'lucide-react';

type Props = {}

const DarkModeSwitch = (props: Props) => {
    const [darkMode, setDarkMode] = React.useState<boolean>(() => {
        if (typeof window !== 'undefined') {
            const localDarkMode = localStorage.getItem('darkMode');
            return localDarkMode === 'true';
          }
        return false;
    });

    React.useEffect(() => {
        const darkMode = localStorage.getItem('darkMode');
        setDarkMode(darkMode === 'true');
    }, []);

    React.useEffect(() => {
        localStorage.setItem('darkMode', darkMode.toString());
        document.body.classList.toggle('dark', darkMode);
    }, [darkMode]);

    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    }


  return <Sun className='w-8 h-8 stroke-yellow-500 cursor-pointer hover:stroke-blue-500 dark:hover:stroke-yellow-200 transition-colors' onClick={() => toggleDarkMode()} />;
}

export default DarkModeSwitch