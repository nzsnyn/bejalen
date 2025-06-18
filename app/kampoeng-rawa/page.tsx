import React from 'react'
import MainLayouts from '@/components/layouts/MainLayouts'

const KampoengRawa = () => {
    return (
        <div>
            <MainLayouts>
                {/* Hero Section */}
                <div className='bg-[url(/kampoengRawa.png)] h-screen w-full bg-cover bg-no-repeat bg-center flex items-center justify-center px-4'>
                    <div className='text-center font-kameron'>
                        <h1 className='text-white text-5xl sm:text-6xl md:text-7xl lg:text-[128px]'>Kampoeng<br />Rawa</h1>
                    </div>
                </div>

                {/* Description */}
                <p className='font-kameron text-xl sm:text-2xl text-center mx-auto mt-10 sm:mt-20 px-4 w-full max-w-[667px]'>
                    Objek wisata yang paling sering dikunjungi oleh wisatawan Kampoeng Rawa. Nikmati banyak hal-hal menarik yang bisa kalian temukan disini.
                </p>

                {/* Section Heading */}
                <h1 className='text-center mx-auto text-[#85A947] font-kameron text-4xl sm:text-5xl md:text-6xl lg:text-7xl mt-10 sm:mt-20 px-4'>
                    Yang Menarik di <br />Kampoeng Rawa
                </h1>

                {/* Attractions Cards */}
                <div className='flex flex-col sm:flex-row flex-wrap justify-center items-center gap-8 sm:gap-12 md:gap-16 lg:gap-20 mt-10 sm:mt-16 md:mt-24 px-4'>
                    {[
                        { name: 'Kuliner', image: '/kuliner.png' },
                        { name: 'Joglo Apung', image: '/jogloApung.png' },
                        { name: 'Spot Foto', image: '/spot.png' }
                    ].map((attraction, index) => (
                        <div
                            key={index}
                            className='aspect-square bg-white overflow-hidden relative w-full sm:w-[250px] md:w-[280px] lg:w-[300px] shadow-md mb-8 sm:mb-0'
                        >
                            {/* Full-sized image */}
                            <img
                                src={attraction.image}
                                alt={attraction.name}
                                className='w-full h-full object-cover'
                            />

                            {/* Centered text overlay with semi-transparent background */}
                            <div className='absolute inset-0 flex items-center justify-center bg-black/40'>
                                <h3 className='font-kameron text-xl sm:text-2xl md:text-3xl text-white text-center'>
                                    {attraction.name.split(' ').map((word, i, arr) => (
                                        <React.Fragment key={i}>
                                            {word}
                                            {i !== arr.length - 1 && <br />}
                                        </React.Fragment>
                                    ))}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Info Section */}
                <p className='text-center mx-auto font-kameron text-xl sm:text-2xl mt-10 sm:mt-16 md:mt-24 px-4 mb-10'>
                    Info Lebih Lanjut Kunjungi : <br />
                    <a href="https://kampoengrawa.com/" className="text-[#85A947] hover:underline">
                        https://kampoengrawa.com/
                    </a>
                </p>
            </MainLayouts>
        </div>
    )
}

export default KampoengRawa