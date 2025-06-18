import React from 'react'
import Navbar from '../navigation/Navbar'
import Footer from '../navigation/Footer'

interface MainLayoutsProps {
  children: React.ReactNode;
}

const MainLayouts = ({ children }: MainLayoutsProps) => {
  return (
    <div>
        <Navbar />
        <main>
            {children}
        </main>
        <Footer />
    </div>
  )
}

export default MainLayouts