import React from 'react'
import { assets } from '../assets/assets'

const Testimonial = () => {

    const dummyTestimonialData = [
        {
            image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200",
            name: 'John Doe',
            title: 'Marketing Director, TechCorp',
            content: 'GenCraftAI has revolutionized our content workflow. The quality of the articles is outstanding, and it saves us hours of work every week.',
            rating: 4,
        },
        {
            image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
            name: 'Jane Smith',
            title: 'Content Creator, TechCorp',
            content: 'GenCraftAI has made our content creation process effortless. The AI tools have helped us produce high-quality content faster than ever before.',
            rating: 5,
        },
        {
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&h=200&auto=format&fit=crop",
            name: 'David Lee',
            title: 'Content Writer, TechCorp',
            content: 'GenCraftAI has transformed our content creation process. The AI tools have helped us produce high-quality content faster than ever before.',
            rating: 4,
        },
    ]

    return (
        <div className='px-4 sm:px-20 xl:px-32 py-24 text-white bg-gray-900'>
            {/* Section Heading */}
            <div className='text-center'>
                <h2 className='text-white text-[42px] font-semibold'>Loved by Creators</h2>
                <p className='text-gray-400 max-w-lg mx-auto'>
                    Don't just take our word for it. Here's what our users are saying.
                </p>
            </div>

            {/* Testimonials */}
            <div className='flex flex-wrap mt-10 justify-center'>
                {dummyTestimonialData.map((testimonial, index) => (
                    <div 
                        key={index} 
                        className='p-8 m-4 max-w-xs rounded-lg bg-gray-800 shadow-lg border border-gray-700 hover:-translate-y-1 transition duration-300 cursor-pointer'
                    >
                        {/* Rating Stars */}
                        <div className="flex items-center gap-1">
                            {Array(5).fill(0).map((_, starIndex) => (
                                <img 
                                    key={starIndex} 
                                    src={starIndex < testimonial.rating ? assets.star_icon : assets.star_dull_icon} 
                                    alt="star" 
                                    className="w-5 h-5"
                                />
                            ))}
                        </div>

                        {/* Testimonial Content */}
                        <p className='text-gray-300 text-sm my-5'>"{testimonial.content}"</p>
                        <hr className='mb-5 border-gray-700' />

                        {/* User Info */}
                        <div className='flex items-center gap-4'>
                            <img 
                                src={testimonial.image} 
                                className='w-12 h-12 object-cover rounded-full border border-gray-600' 
                                alt={testimonial.name} 
                            />
                            <div className='text-sm'>
                                <h3 className='font-medium text-white'>{testimonial.name}</h3>
                                <p className='text-xs text-gray-400'>{testimonial.title}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Testimonial
