import React from 'react'
import MainLayouts from '@/components/layouts/MainLayouts'

const PerahuMesin = () => {
    return (
        <div>
            <MainLayouts>
                {/* Hero Section */}
                <div className='bg-[url(/perahuMesinHeader.png)] h-screen w-full bg-cover bg-no-repeat bg-center flex items-center justify-center px-4'>
                    <div className='text-center font-kameron'>
                        <h1 className='text-white text-5xl sm:text-6xl md:text-7xl lg:text-[128px]'>Perahu<br />Mesin</h1>
                    </div>
                </div>

                {/* Description Section */}
                <p className='font-kameron text-xl sm:text-2xl text-center mx-auto mt-10 sm:mt-20 px-4 w-full max-w-[667px]'>
                    Arungi luasnya Rawa Pening dengan menaiki perahu mesin pada Desa Wisata Bejalen. Nikmati serunya menaiki perahu dengan keluarga, orang tersayang sambil menikmati pemandangan alam sekitar.
                </p>

                {/* Pricing Section */}
                <div className='flex flex-col md:flex-row justify-center items-center mt-12 md:mt-24 px-4'>
                    {/* Pricing Header */}
                    <div className='w-full md:w-[404px] bg-[#85A947] py-12 md:h-[568px] flex items-center justify-center'>
                        <h1 className='text-center font-kameron text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white'>
                            Harga <br /> Sewa
                        </h1>
                    </div>
                    
                    {/* Pricing Details */}
                    <div className='flex flex-col sm:flex-row bg-[#EFE3C2] w-full md:w-[884px] py-12 md:h-[568px] justify-center items-center gap-8 sm:gap-20'>
                        {/* Weekday Pricing */}
                        <div className='px-4 mb-8 sm:mb-0'>
                            <h1 className='font-kameron text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center mb-4 sm:mb-8'>
                                Weekdays
                            </h1>
                            <p className='mx-auto font-kameron text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl'>
                                IDR. 120.000 <br />
                                untuk kapasitas <br /> maksimal 8 <br /> orang dan <br />
                                naik selama <br />30 menit
                            </p>
                        </div>
                        
                        {/* Weekend Pricing */}
                        <div className='px-4'>
                            <h1 className='font-kameron text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-center mb-4 sm:mb-8'>
                                Weekend
                            </h1>
                            <p className='mx-auto font-kameron text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl'>
                                IDR. 150.000 <br />
                                untuk kapasitas <br /> maksimal 8 <br /> orang dan <br />
                                naik selama <br />30 menit
                            </p>
                        </div>
                    </div>
                </div>
            </MainLayouts>
        </div>
    )
}

export default PerahuMesin