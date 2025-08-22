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
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-6 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">

      {/* Left Panel */}
      <form onSubmit={onSubmitHandler} className="w-full max-w-lg p-6 bg-gray-900/80 backdrop-blur-lg shadow-xl rounded-2xl border border-gray-700">
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-green-400" />
          <h1 className="text-2xl font-bold">AI Image Generator</h1>
        </div>

        <p className="mt-6 text-sm font-medium text-gray-300">Describe Your Image</p>
        <textarea
          onChange={(e) => setInput(e.target.value)}
          value={input}
          rows={4}
          className="w-full p-3 mt-2 bg-gray-800 text-white rounded-md border border-gray-600 placeholder-gray-400 focus:border-green-400 focus:ring focus:ring-green-400/30 outline-none text-sm"
          placeholder="Describe what you want to see in the image..."
          required
        />

        <p className="mt-4 text-sm font-medium text-gray-300">Style</p>
        <div className="mt-3 flex gap-3 flex-wrap">
          {imageStyle.map((item) => (
            <span
              onClick={() => setSelectedStyle(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer transition 
                ${selectedStyle === item ? 'bg-green-500/20 border-green-400 text-green-300' : 'text-gray-400 border-gray-600 hover:border-green-400 hover:text-green-300'}`}
              key={item}
            >
              {item}
            </span>
          ))}
        </div>

        <div className="my-6 flex items-center gap-2">
          <label className="relative cursor-pointer">
            <input
              type="checkbox"
              onChange={(e) => setPublish(e.target.checked)}
              checked={publish}
              className="sr-only peer"
            />
            <div className="w-9 h-5 bg-gray-700 rounded-full peer-checked:bg-green-500 transition"></div>
            <span className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full peer-checked:translate-x-4 transition"></span>
          </label>
          <p className="text-sm text-gray-300">Make this image Public</p>
        </div>

        <button
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 mt-6 bg-gradient-to-r from-green-400 to-emerald-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition shadow-lg"
          type="submit"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Image className="w-5" />
          )}
          Generate Image
        </button>
      </form>

      {/* Right Panel */}
      <div className="w-full max-w-lg p-6 bg-gray-900/80 backdrop-blur-lg shadow-xl rounded-2xl border border-gray-700 min-h-[420px]">
        <div className="flex items-center gap-3">
          <Image className="w-5 h-5 text-green-400" />
          <h1 className="text-xl font-bold">Generated Image</h1>
        </div>

        <div className="mt-3 h-full">
          {loading ? (
            <Box sx={{ width: '100%', mt: 2 }}>
              <Skeleton variant="rectangular" animation="wave" height={320} sx={{ bgcolor: 'grey.800' }} />
              <Skeleton animation="wave" height={40} width="50%" sx={{ mt: 1, bgcolor: 'grey.800' }} />
            </Box>
          ) : content ? (
            <div className="flex flex-col gap-3">
              <img src={content} alt="Generated" className="w-full rounded-md border border-gray-700" />
              <button
                onClick={handleDownload}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-green-400 to-emerald-600 text-white px-4 py-2 rounded-md text-sm hover:opacity-90 transition"
              >
                <Download className="w-4 h-4" /> Download Image
              </button>
            </div>
          ) : (
            <div className="flex flex-1 justify-center items-center min-h-[320px]">
              <div className="text-sm flex flex-col items-center gap-5 text-gray-500 text-center">
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
