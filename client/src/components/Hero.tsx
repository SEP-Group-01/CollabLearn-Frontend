import React from 'react'
import { assets } from '../assets/assets'
import SearchBar from './SearchBar'

const Hero = () => {
  return (
    <div className='flex flex-col items-center justify-center w-full md:pt-36 pt-20 px-7 md:px-0 space-y-7 text-center bg-gradient-to-b from-cyan-100/70'>
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
          Welcome Back Student! 
          <img src={assets.sketch} alt='sketch' className='md:block hidden absolute -bottom-7 right-0'/>
        </h1>
      <p className='text-gray-500 md:block  max-w-2xl mx-auto'> 
                 Your personalized dashboard helps you track your progress, access course materials, join discussions, and manage your study plans—all in one place.
</p>
      <p className='text-gray-500 md:hidden  max-w-sm mx-auto'></p>
      <SearchBar/>
    </div>
  )
}

export default Hero