import React, { useState } from 'react'
import { Hash, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import Markdown from 'react-markdown'
import { useAuth } from '@clerk/clerk-react'
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const BlogTitles = () => {
  const blogCategories = [
    'General', 'Technology', 'Business', 'Health', 'Lifestyle',
    'Education', 'Travel', 'Food', 'Entertainment', 'Science', 'Sports'
  ]

  const [selectedCategory, setSelectedCategory] = useState('General')
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [content, setContent] = useState('')
  const { getToken } = useAuth()

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      setContent('')
      const prompt = `Generate some catchy blog titles for the topic: "${input}" in the category of "${selectedCategory}".`

      const { data } = await axios.post(
        '/api/ai/generate-blog-title',
        { prompt },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      )

      if (data.success) {
        setContent(data.content)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
    setLoading(false)
  }

  const SkeletonLoader = () => (
    <div className="mt-4 space-y-3 animate-pulse">
      {[...Array(8)].map((_, idx) => (
        <div key={idx} className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
      ))}
    </div>
  )

  return (
    <div className="h-full overflow-y-auto p-6 flex flex-wrap gap-6 text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      
      {/* Left Column */}
      <form onSubmit={onSubmitHandler} className="w-full max-w-lg p-6 bg-white dark:bg-gray-800 shadow-md rounded-xl border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
          <h1 className="text-xl font-bold">AI Title Generator</h1>
        </div>
        
        <p className="mt-6 text-sm font-medium">Keyword</p>
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          className="w-full mt-2 p-2 px-3 text-sm rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-purple-500 outline-none transition-colors duration-300"
          placeholder="The future of artificial intelligence is..."
          required
        />
        
        <p className="mt-4 text-sm font-medium">Category</p>
        <div className="mt-3 flex gap-3 flex-wrap">
          {blogCategories.map((item) => (
            <span
              key={item}
              onClick={() => setSelectedCategory(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer transition-all duration-300 
                ${selectedCategory === item 
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent' 
                  : 'text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
            >
              {item}
            </span>
          ))}
        </div>
        
        <button
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 mt-6 bg-gradient-to-r from-purple-600 to-pink-500 hover:opacity-90 text-white px-4 py-2 rounded-lg transition-all duration-300 disabled:opacity-50"
          type="submit"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Hash className="w-5" />
          )}
          Generate Title
        </button>
      </form>

      {/* Right Column */}
      <div className="w-full max-w-lg p-6 bg-white dark:bg-gray-800 shadow-md rounded-xl border border-gray-200 dark:border-gray-700 min-h-[380px] flex flex-col transition-colors duration-300">
        <div className="flex items-center gap-3">
          <Hash className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          <h1 className="text-xl font-bold">Generated Titles</h1>
        </div>

        {loading ? (
          <SkeletonLoader />
        ) : !content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-4 text-gray-400 dark:text-gray-500">
              <Hash className="w-9 h-9" />
              <p>Enter a topic and click "Generate Title" to get started</p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full overflow-y-auto text-sm text-gray-700 dark:text-gray-300 transition-colors duration-300">
            <Markdown>{content}</Markdown>
          </div>
        )}
      </div>
    </div>
  )
}

export default BlogTitles
