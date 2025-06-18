"use client"

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import logo from '@/public/logo.png'

const Navbar = () => {
  return (
    <div className='w-full bg-white shadow-md flex flex-col items-center py-4'>
      <div className='container mx-auto flex justify-between items-center px-4 md:px-6'>
        <Link href="/">
          <Image src={logo} alt="logo" width={80} height={80} className='h-12 sm:h-16 md:h-20 object-contain' />
        </Link>
      </div>
    </div>
  )
}

export default Navbar