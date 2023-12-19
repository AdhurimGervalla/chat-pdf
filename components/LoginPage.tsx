import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'
import { LogIn } from 'lucide-react'
import TypingAnimation from './TypingAnimation'

type Props = {
}

const LoginPage = (props: Props) => {
  return (
    <div className='w-screen min-h-screen'>
        <div className='grid grid-cols-2 max-md:grid-cols-1'>
            <div className='min-h-screen w-100 relative max-md:min-h-1/2 flex w-full items-end md:items-center justify-center pb-10'>
              <div className='max-md:text-center px-[30px]'>
                <h1 className='text-black dark:text-white text-4xl md:text-5xl lg:text-7xl'><span>workspAIces</span><span className='absolute text-sm'>BETA</span></h1>
                <TypingAnimation typingInterval={10} className={'pt-5 text-md w-[400px] sm:max-lg:w-[300px] max-[420px]:w-[300px] relative'} text="Optimize your interaction with AI by leveraging the context of your own data." />
              </div>
            </div>
            <div className='min-h-screen w-100 relative max-sm:min-h-1/2 flex w-full items-start md:items-center justify-center pt-10 bg-black'>
              <div className='w-full md:-mt-10'>
                  <h2 className='text-white text-3xl text-center mb-8'>Get started</h2>
                  <div className='mx-auto max-w-max'>
                    <Link href={'/sign-in'}><Button className='bg-green-500 hover:bg-white hover:text-black text-xl w-[136px]' size={'lg'}>Login</Button></Link>
                    {/*<Link className='ml-4' href={'/sign-up'}><Button className=' bg-lime-600 hover:bg-white hover:text-black text-xl w-[136px]' size={'lg'}>Sign up</Button></Link>*/}
                  </div>
              </div>

            </div>
        </div>
    </div>
  )
}

export default LoginPage