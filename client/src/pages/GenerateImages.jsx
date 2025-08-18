import React, { useState } from 'react';
import { Image, Sparkles, Download } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const GenerateImages = () => {
  const imageStyle = ['Realistic', 'Ghibli', 'Anime', 'Cartoon', 'Fantasy', '3D', 'Portrait', 'Pixel Art', 'Cyberpunk', 'Sci-Fi', 'Minimalist', 'Abstract'];
  const [selectedStyle, setSelectedStyle] = useState('Realistic');
  const [input, setInput] = useState('');
  const [publish, setPublish] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setContent('');
      const prompt = `Generate an image based on the description: "${input}" in the style of "${selectedStyle}".`;
      const { data } = await axios.post('/api/ai/generate-image', { prompt, publish }, {
        headers: { Authorization: `Bearer ${await getToken()}` }
      });

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(content);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'generated-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to download image.");
      console.error("Download error:", error);
    }
  };

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>

      {/* Left Panel */}
      <form onSubmit={onSubmitHandler} className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'>
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#00AD25]' />
          <h1 className='text-xl font-semibold'>AI Image Generator</h1>
        </div>

        <p className='mt-6 text-sm font-medium'>Describe Your Image</p>
        <textarea
          onChange={(e) => setInput(e.target.value)}
          value={input}
          rows={4}
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
          placeholder='Describe what you want to see in the image...'
          required
        />

        <p className='mt-4 text-sm font-medium'>Style</p>
        <div className='mt-3 flex gap-3 flex-wrap sm:max-w-9/11'>
          {imageStyle.map((item) => (
            <span
              onClick={() => setSelectedStyle(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer ${selectedStyle === item ? 'bg-green-50 text-green-700' : 'text-gray-500 border-gray-300'}`}
              key={item}
            >
              {item}
            </span>
          ))}
        </div>

        <div className='my-6 flex items-center gap-2'>
          <label className='relative cursor-pointer'>
            <input
              type="checkbox"
              onChange={(e) => setPublish(e.target.checked)}
              checked={publish}
              className='sr-only peer'
            />
            <div className='w-9 h-5 bg-slate-300 rounded-full peer-checked:bg-green-500 transition'></div>
            <span className='absolute left-1 top-1 w-3 h-3 bg-white rounded-full peer-checked:translate-x-4'></span>
          </label>
          <p className='text-sm'>Make this image Public</p>
        </div>

        <button
          disabled={loading}
          className='w-full flex items-center justify-center gap-2 mt-6 bg-gradient-to-r from-[#00AD25] to-[#04FF50] text-white px-4 py-2 rounded-lg cursor-pointer'
          type='submit'
        >
          {loading ? (
            <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
          ) : (
            <Image className='w-5' />
          )}
          Generate Image
        </button>
      </form>

      {/* Right Panel */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-119'>
        <div className='flex items-center gap-3'>
          <Image className='w-5 h-5 text-[#00AD25]' />
          <h1 className='text-xl font-semibold'>Generated Image</h1>
        </div>

        <div className='mt-3 h-full'>
          {loading ? (
            <Box sx={{ width: '100%', mt: 2 }}>
              <Skeleton variant="rectangular" animation="wave" height={320} />
              <Skeleton animation="wave" height={40} width="50%" sx={{ mt: 1 }} />
            </Box>
          ) : content ? (
            <div className='flex flex-col gap-3'>
              <img src={content} alt="Generated" className='w-full rounded-md' />
              <button
                onClick={handleDownload}
                className='flex items-center justify-center gap-2 bg-gradient-to-r from-[#00AD25] to-[#04FF50] text-white px-4 py-2 rounded-md text-sm'
              >
                <Download className='w-4 h-4' /> Download Image
              </button>
            </div>
          ) : (
            <div className="flex flex-1 justify-center items-center min-h-[320px]">
              <div className="text-sm flex flex-col items-center gap-5 text-gray-400 text-center">
                <Image className="w-9 h-9" />
                <p>Enter a topic and Click "Generate Image" to get started</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GenerateImages;