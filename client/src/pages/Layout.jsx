import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { Menu, X } from 'lucide-react'
import Sidebar from '../components/Sidebar'
import { SignIn, useUser } from '@clerk/clerk-react'

const Layout = () => {
  const navigate = useNavigate()
  const [sidebar, setSidebar] = useState(false)
  const { user } = useUser()

  return user ? (
    <div className="flex flex-col h-screen bg-gradient-to-b from-gray-50 to-gray-100 text-slate-800">
      {/* Navbar */}
      <nav className="w-full px-8 min-h-14 flex items-center justify-between bg-gradient-to-r from-purple-600 to-indigo-600 shadow-md">
        <img
          className="cursor-pointer w-32 sm:w-44 drop-shadow-md"
          src={assets.logo}
          alt="logo"
          onClick={() => navigate('/')}
        />
        {sidebar ? (
          <X onClick={() => setSidebar(false)} className="w-7 h-7 text-white sm:hidden cursor-pointer hover:scale-110 transition" />
        ) : (
          <Menu onClick={() => setSidebar(true)} className="w-7 h-7 text-white sm:hidden cursor-pointer hover:scale-110 transition" />
        )}
      </nav>

      {/* Content Area */}
      <div className="flex flex-1 w-full h-[calc(100vh-64px)]">
        <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
        <div className="flex-1 bg-gray-100 p-4 overflow-y-auto">
          <Outlet />
        </div>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-purple-500 to-indigo-600">
      <div className="p-6 bg-white rounded-xl shadow-lg">
        <SignIn />
      </div>
    </div>
  )
}

export default Layout
