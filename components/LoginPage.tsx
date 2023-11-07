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
        <div className='grid grid-cols-2'>
            <div className='min-h-screen w-100 relative'>
              <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                <h1 className='text-black text-7xl'><span>PDF</span>2<span>chat</span></h1>
                <TypingAnimation typingInterval={10} className={'absolute left-1 mt-5 text-lg'} text="Optimize your interaction with AI by leveraging the context of your own documents." />
              </div>
            </div>
            <div className='min-h-screen w-100 bg-black relative'>
              <div className='w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
                  <h2 className='text-white text-3xl text-center mb-8'>Get started</h2>
                  <div className='mx-auto max-w-max'>
                    <Link href={'/sign-in'}><Button className='hover:bg-white hover:text-black text-xl' size={'lg'}>Login</Button></Link>
                    <Link className='ml-4' href={'/sign-up'}><Button className='hover:bg-white hover:text-black text-xl' size={'lg'}>Sign up</Button></Link>
                  </div>
              </div>

            </div>
        </div>
    </div>
  )
}

export default LoginPage