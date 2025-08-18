import React, { useState } from 'react';
import { Scissors, Sparkles, Download } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveObject = () => {
  const [input, setInput] = useState('');
  const [object, setObject] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (object.trim().split(' ').length > 1) {
        setLoading(false);
        return toast.error('Please enter a single object name to remove.');
      }

      const formData = new FormData();
      formData.append('image', input);
      formData.append('object', object);

      const { data } = await axios.post('/api/ai/remove-image-object', formData, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await fetch(content);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = 'processed-image.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to download image.");
    }
  };

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>
      {/* Left Column */}
      <form
        onSubmit={onSubmitHandler}
        className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'
      >
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>Object Removal</h1>
        </div>
        <p className='mt-6 text-sm font-medium'>Upload Image</p>
        <input
          onChange={(e) => setInput(e.target.files[0])}
          type='file'
          accept='image/*'
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300 text-gray-600'
          required
        />
        <p className='mt-6 text-sm font-medium'>Describe object name to remove</p>
        <textarea
          onChange={(e) => setObject(e.target.value)}
          value={object}
          rows={4}
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
          placeholder='e.g., watch or spoon , Only single object name'
          required
        />
        <button
          disabled={loading}
          className='w-full flex items-center justify-center gap-2 mt-6 bg-gradient-to-r from-[#417DF6] to-[#8E37EB] text-white px-4 py-2 rounded-lg cursor-pointer'
          type='submit'
        >
          {loading ? (
            <span className='w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin'></span>
          ) : (
            <Scissors className='w-5' />
          )}
          Remove Object
        </button>
      </form>

      {/* Right Column */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96'>
        <div className='flex items-center gap-3'>
          <Scissors className='w-5 h-5 text-[#4A7AFF]' />
          <h1 className='text-xl font-semibold'>Processed Image</h1>
        </div>

        {loading ? (
          <Box sx={{ mt: 3 }}>
            <Skeleton variant='rectangular' animation='wave' width='100%' height={250} />
            <Skeleton animation='wave' height={36} width={160} sx={{ mt: 2 }} />
          </Box>
        ) : !content ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <Scissors className='w-9 h-9' />
              <p>Upload an image and Click "Remove Object" to get started</p>
            </div>
          </div>
        ) : (
          <>
            <img
              src={content}
              alt='Processed'
              className='mt-3 w-full max-h-[400px] object-contain rounded-md'
            />
            <button
              onClick={handleDownload}
              className='flex items-center justify-center gap-2 mt-4 px-4 py-2 rounded-md bg-gradient-to-r from-[#417DF6] to-[#8E37EB] text-white text-sm transition'
            >
              <Download className='w-4 h-4' />
              Download Image
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default RemoveObject;