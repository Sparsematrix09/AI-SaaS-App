import React, { useState } from 'react';
import { FileText, Sparkles } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import Markdown from 'react-markdown';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const ReviewResume = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('resume', input);

      const { data } = await axios.post('/api/ai/resume-review', formData, {
        headers: { Authorization: `Bearer ${await getToken()}` },
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

  return (
    <div className="h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-6 bg-gradient-to-br from-gray-900 to-gray-800 text-gray-200">
      {/* Left Column */}
      <form
        onSubmit={onSubmitHandler}
        className="w-full max-w-lg p-6 rounded-2xl border border-gray-700 bg-gray-900/80 backdrop-blur-md shadow-xl hover:shadow-2xl transition"
      >
        <div className="flex items-center gap-3">
          <Sparkles className="w-6 h-6 text-teal-400" />
          <h1 className="text-2xl font-bold text-gray-100">Resume Review</h1>
        </div>
        <p className="mt-6 text-sm font-medium text-gray-400">Upload Resume</p>
        <input
          onChange={(e) => setInput(e.target.files[0])}
          type="file"
          accept="application/pdf"
          className="w-full p-2 px-3 mt-2 outline-none text-sm rounded-lg border border-gray-600 bg-gray-800 text-gray-200 focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition"
          required
        />
        <p className="text-xs text-gray-500 font-light mt-1">
          Supports PDF resume only.
        </p>
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 mt-6 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-medium px-4 py-2 rounded-xl shadow-md hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? (
            <span className="w-4 h-4 my-1 rounded-full border-2 border-t-transparent border-white animate-spin"></span>
          ) : (
            <FileText className="w-5 h-5" />
          )}
          Review Resume
        </button>
      </form>

      {/* Right Column */}
      <div className="w-full max-w-lg p-6 rounded-2xl border border-gray-700 bg-gray-900/80 backdrop-blur-md shadow-xl hover:shadow-2xl transition flex flex-col min-h-96 max-h-[600px]">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-teal-400" />
          <h1 className="text-2xl font-bold text-gray-100">Analysis Results</h1>
        </div>

        {/* Skeleton Loading or No Content */}
        {loading ? (
          <div className="mt-4 space-y-3 animate-pulse">
            {[...Array(10)].map((_, idx) => (
              <div
                key={idx}
                className="h-4 bg-gray-700 rounded w-full"
                style={{ width: `${70 + Math.random() * 30}%` }}
              ></div>
            ))}
          </div>
        ) : !content ? (
          <div className="flex-1 flex justify-center items-center">
            <div className="text-sm flex flex-col items-center gap-5 text-gray-500">
              <FileText className="w-9 h-9" />
              <p>
                Upload a resume and click <strong>"Review Resume"</strong> to get started
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-3 h-full overflow-y-auto text-sm text-gray-200 leading-relaxed">
            <div className="prose prose-invert prose-sm max-w-none">
              <Markdown>{content}</Markdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewResume;
