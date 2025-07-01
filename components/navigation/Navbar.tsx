"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import logo from '@/public/logo.png'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems = [
    { href: '/', label: 'Home' },
    { href: '/info-paket', label: 'Info Paket' },
    { href: '/perahu-mesin', label: 'Perahu Mesin' },
    { href: '/kampoeng-rawa', label: 'Kampoeng Rawa' },
    { href: '/rawa-pening', label: 'Rawa Pening' },
    { href: '/lucky-land', label: 'Lucky Land' },
  ]

  return (
    <div className='w-full bg-white shadow-md'>
      <div className='container mx-auto px-4 md:px-6'>
        <div className='flex justify-between items-center py-4'>
          {/* Logo */}
          <Link href="/">
            <Image src={logo} alt="logo" width={80} height={80} className='h-12 sm:h-16 md:h-20 object-contain' />
          </Link>

          {/* Desktop Navigation */}
          <nav className='hidden md:flex space-x-8'>
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className='text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200'
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className='md:hidden flex flex-col space-y-1 w-6 h-6'
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            <span className={`w-full h-0.5 bg-gray-700 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`w-full h-0.5 bg-gray-700 transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`w-full h-0.5 bg-gray-700 transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className='md:hidden pb-4'>
            <div className='flex flex-col space-y-3'>
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className='text-gray-700 hover:text-blue-600 font-medium py-2 px-4 rounded transition-colors duration-200'
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>
        )}
      </div>
    </div>
  )
}

export default Navbar