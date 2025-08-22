import React from 'react'
import { PricingTable } from '@clerk/clerk-react'

const Plan = () => {
  return (
    <div className='max-w-2xl mx-auto z-20 my-30 text-white bg-gray-900 py-24'>
      
      {/* Section Heading */}
      <div className='text-center'>
        <h2 className='text-white text-[42px] font-semibold'>Choose Your Plan</h2>
        <p className='text-gray-400 max-w-lg mx-auto'>
          Start for free and scale up as you grow. Find the perfect plan for your content creation needs.
        </p>
      </div>

      {/* Pricing Table */}
      <div className='mt-14 max-sm:mx-8'>
        <PricingTable />
      </div>
    </div>
  )
}

export default Plan
