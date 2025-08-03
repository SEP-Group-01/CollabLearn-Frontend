// src/components/Navbar.tsx

import React from 'react'
import { assets } from '../assets/assets'

const Navbar = () => {
  return (
    <header className="bg-white shadow-md">
      <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src={assets.logo} alt="Logo" className="w-20 h-20" />
        </div>

        {/* Navigation Links */}
        <ul className="hidden md:flex space-x-8 text-gray-600 font-medium">
          <li className="hover:text-blue-600 cursor-pointer">Home</li>
          <li className="hover:text-blue-600 cursor-pointer">Groups</li>
          <li className="hover:text-blue-600 cursor-pointer">Planner</li>
          <li className="hover:text-blue-600 cursor-pointer">Profile</li>
        </ul>

        {/* Action Button */}
        <div className="hidden md:block">
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            Login
          </button>
        </div>

        {/* Mobile Menu Placeholder */}
        <div className="md:hidden">
          <button className="text-gray-700 text-2xl">☰</button>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
