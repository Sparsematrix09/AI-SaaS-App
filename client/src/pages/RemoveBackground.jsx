import React, { useState } from 'react';
import { Eraser, Sparkles, Download } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const RemoveBackground = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setContent('');

      const formData = new FormData();
      formData.append('image', input);

      const { data } = await axios.post(
        '/api/ai/remove-image-background',
        formData,
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );

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
      link.download = 'image-without-bg.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to download image.");
    }
  };

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-gray-100 bg-gradient-to-br from-gray-900 to-gray-800">
      {/* Left column */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-5 bg-gray-800 rounded-xl border border-gray-700 shadow-lg hover:shadow-cyan-500/20 transition"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-cyan-400" />
          <h1 className="text-xl font-bold">Background Removal</h1>
        </div>
        <p className="mt-6 text-sm font-medium text-gray-300">Upload Image</p>
        <input
          onChange={(e) => setInput(e.target.files[0])}
          type="file"
          accept="image/*"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-600 bg-gray-900 text-gray-200 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-cyan-600 file:text-white hover:file:bg-cyan-500"
          required
        />
        <p className="text-xs text-gray-400 font-light mt-1">
          Supports JPG, PNG, and more
        </p>
        <button
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 mt-6 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-white px-4 py-2 rounded-lg cursor-pointer transition shadow-md"
          type="submit"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent border-white animate-spin"></span>
          ) : (
            <Eraser className="w-5" />
          )}
          Remove Background
        </button>
      </form>

      {/* Right column */}
      <div className="w-full max-w-lg p-5 bg-gray-800 rounded-xl flex flex-col border border-gray-700 shadow-lg hover:shadow-cyan-500/20 transition min-h-96">
        <div className="flex items-center gap-3">
          <Eraser className="w-5 h-5 text-cyan-400" />
          <h1 className="text-xl font-bold">Processed Image</h1>
        </div>

        {loading ? (
          <div className="mt-4 space-y-4">
            <Box>
              <Skeleton variant="rectangular" width="100%" height={280} sx={{ bgcolor: 'grey.800' }} />
            </Box>
            <Box>
              <Skeleton width="40%" height={30} sx={{ bgcolor: 'grey.800' }} />
            </Box>
          </div>
        ) : !content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-400">
              <Eraser className="w-9 h-9 text-gray-500" />
              <p>
                Upload an image and click{" "}
                <strong className="text-gray-200">"Remove Background"</strong> to get started
              </p>
            </div>
          </div>
        ) : (
          <>
            <img
              src={content}
              alt="Result"
              className="mt-3 w-full h-full object-contain rounded-md border border-gray-600"
            />
            <button
              onClick={handleDownload}
              className="mt-4 flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white px-4 py-2 text-sm rounded-lg transition shadow-md"
            >
              <Download className="w-4 h-4" />
              Download Image
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default RemoveBackground;
