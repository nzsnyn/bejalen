"use client"

import Link from 'next/link'
import React from 'react'

const Footer = () => {
    return (
        <div>
            <div className='w-full bg-[#3E7B27] mt-16 sm:mt-24 md:mt-32 py-10 md:py-20 font-kameron text-white font-bold'>
                <div className='container mx-auto px-4 flex flex-col sm:flex-row justify-center gap-10 md:gap-16 lg:gap-24'>
                    {/* Alamat */}
                    <div className='mb-8 sm:mb-0'>
                        <h1 className='text-xl md:text-2xl mb-3 md:mb-5'>Alamat</h1>
                        <p className='text-sm md:text-[16px] max-w-[259px]'>PCF7+FJJ, Bejalen Barat, Bejalen, Ambarawa, Semarang Regency, Central Java 50614</p>
                    </div>

                    {/* Narahubung */}
                    <div className='mb-8 sm:mb-0'>
                        <h1 className='text-xl md:text-2xl mb-3 md:mb-5'>Narahubung</h1>
                        <p className='text-sm md:text-[16px]'>Telp: (+62)821034812 <br />Email : bhck@gmail.com</p>
                        <div className='my-6'>
                            <h1 className='text-xl md:text-2xl mb-3 md:mb-5'>Info Paket Wisata</h1>
                            <div className='flex justify-center sm:justify-start items-center gap-2 w-[120px] h-10 bg-[#123524]'>
                                <Link href="/info-paket" className='text-sm font-bold text-white'>
                                    <p className='font-kameron text-sm font-bold text-white'>E-Catalog</p>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Gallery */}
                    <div>
                        <h1 className='text-xl md:text-2xl mb-3 md:mb-5'>Gallery</h1>
                        <div className='grid grid-cols-3 grid-rows-2 gap-2 sm:gap-4 mt-2 sm:mt-4'>
                            {[...Array(6)].map((_, index) => (
                                <div
                                    key={index}
                                    className='w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] bg-gray-300'
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className='w-full py-8 bg-[#123524] flex justify-center items-center'>
                <p className='text-white font-kameron text-sm md:text-[16px] px-4 text-center'>Copyright © 2025. All rights reserved</p>
            </div>

            {/* WhatsApp floating button */}
            <a
                href="https://wa.me/6285867420966"
                target="_blank"
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 flex items-center justify-center w-14 h-14 rounded-full border bg-[#25D366] border-[#25D366] text-white shadow-lg hover:scale-110 transition-transform duration-300 z-50"
                aria-label="WhatsApp"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                >
                    <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                </svg>
            </a>
        </div>
    )
}

export default Footer