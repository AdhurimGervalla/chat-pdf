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
        <div className='grid grid-cols-2 max-sm:grid-cols-1'>
            <div className='min-h-screen w-100 relative max-sm:min-h-1/2'>
              <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-sm:top-auto max-sm:bottom-1/4'>
                <h1 className='text-black text-7xl max-lg:text-6xl max-md:text-5xl'><span>PDF</span>2<span>chat</span><span className='absolute text-sm'>BETA</span></h1>
                <TypingAnimation typingInterval={10} className={'absolute left-1/2 -translate-x-1/2 mt-5 text-lg w-[400px] sm:max-lg:w-[300px] max-[420px]:w-[300px]'} text="Optimize your interaction with AI by leveraging the context of your own documents." />
              </div>
            </div>
            <div className='min-h-screen w-100 bg-black relative max-sm:min-h-1/2'>
              <div className='w-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-sm:top-1/4'>
                  <h2 className='text-white text-3xl text-center mb-8'>Get started</h2>
                  <div className='mx-auto max-w-max'>
                    <Link href={'/sign-in'}><Button className='bg-blue-500 hover:bg-white hover:text-black text-xl w-[136px]' size={'lg'}>Login</Button></Link>
                    <Link className='ml-4' href={'/sign-up'}><Button className=' bg-lime-600 hover:bg-white hover:text-black text-xl w-[136px]' size={'lg'}>Sign up</Button></Link>
                  </div>
              </div>

            </div>
        </div>
    </div>
  )
}

export default LoginPage