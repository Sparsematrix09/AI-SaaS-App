import React, { useState } from 'react';
import { Edit, Sparkles } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const WriteArticle = () => {
  const articleLengths = [
    { length: 800, text: 'Short (500-800 words)' },
    { length: 1200, text: 'Medium (800-1200 words)' },
    { length: 1600, text: 'Long (1200+ words)' },
  ];

  const [selectedLength, setSelectedLength] = useState(articleLengths[0]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setContent('');
      const prompt = `Write an article on the topic: "${input}" with a length of ${selectedLength.length} words.`;

      const { data } = await axios.post(
        '/api/ai/generate-article',
        { prompt, length: selectedLength.length },
        {
          headers: { Authorization: `Bearer ${await getToken()}` },
        }
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

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-gray-200">
      {/* Left Column */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-5 bg-gray-800/80 rounded-xl border border-gray-700 shadow-xl backdrop-blur-sm"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 text-violet-400" />
          <h1 className="text-xl font-semibold text-gray-100">Article Configuration</h1>
        </div>

        <p className="mt-6 text-sm font-medium text-gray-300">Article Topic</p>
        <input
          onChange={(e) => setInput(e.target.value)}
          value={input}
          type="text"
          className="w-full p-2 px-3 mt-2 text-sm rounded-md bg-gray-900/60 border border-gray-600 text-gray-100 placeholder-gray-400 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
          placeholder="The future of artificial intelligence is..."
          required
        />

        <p className="mt-4 text-sm font-medium text-gray-300">Article Length</p>
        <div className="mt-3 flex gap-3 flex-wrap">
          {articleLengths.map((item, index) => (
            <span
              onClick={() => setSelectedLength(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer transition ${
                selectedLength.text === item.text
                  ? 'bg-violet-500 text-white border-violet-500 shadow-md'
                  : 'text-gray-300 border-gray-600 hover:border-violet-400'
              }`}
              key={index}
            >
              {item.text}
            </span>
          ))}
        </div>

        <button
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 mt-6 bg-gradient-to-r from-violet-500 to-fuchsia-500 hover:opacity-90 text-white px-4 py-2 rounded-lg shadow-lg transition disabled:opacity-50"
          type="submit"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent animate-spin"></span>
          ) : (
            <Edit className="w-5" />
          )}
          Generate Article
        </button>
      </form>

      {/* Right Column */}
      <div className="w-full max-w-lg p-5 bg-gray-800/80 rounded-xl border border-gray-700 shadow-xl min-h-88 max-h-[600px] flex flex-col">
        <div className="flex items-center gap-3">
          <Edit className="w-5 h-5 text-violet-400" />
          <h1 className="text-xl font-semibold text-gray-100">Generated Article</h1>
        </div>

        {loading ? (
          <div className="mt-4 space-y-3 animate-pulse">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-4 bg-gray-700 rounded"></div>
            ))}
          </div>
        ) : !content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-500">
              <Edit className="w-9 h-9" />
              <p>Enter a topic and Click "Generate Article" to get started</p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full overflow-y-auto text-sm text-gray-200">
            <Markdown>{content}</Markdown>
          </div>
        )}
      </div>
    </div>
  );
};

export default WriteArticle;
