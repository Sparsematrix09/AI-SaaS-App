import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { Trash2, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';

const CreationItem = ({ item, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  // Download image function
  const handleDownload = async () => {
    try {
      const response = await fetch(item.content);
      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'image.png';
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
    <div
      onClick={() => setExpanded(!expanded)}
      className="p-4 w-full bg-white border border-gray-200 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-sm"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Prompt & Date */}
        <div className="flex-1 w-full">
          <h2 className="text-base font-medium text-gray-800 break-words">
            {item.prompt}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {item.type} • {new Date(item.created_at).toLocaleDateString()}
          </p>
        </div>

        {/* Type + Trash + Download */}
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          <span className="bg-[#EFF6FF] border border-[#BFDBFE] text-[#1E40AF] px-3 py-1 text-xs rounded-full">
            {item.type}
          </span>

          {item.type === 'image' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownload();
              }}
              className="bg-blue-100 text-blue-600 hover:bg-blue-200 p-1 rounded-full"
              title="Download image"
            >
              <Download size={16} />
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(item.id);
            }}
            className="bg-red-100 text-red-600 hover:bg-red-200 p-1 rounded-full"
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Content Preview */}
      {expanded && (
        <div className="mt-4">
          {item.type === 'image' ? (
            <img
              src={item.content}
              alt="Generated"
              className="w-full max-w-md rounded-md object-contain"
            />
          ) : (
            <div className="mt-2 max-h-60 overflow-y-auto text-sm text-slate-700">
              <div className="prose prose-sm">
                <Markdown>{item.content}</Markdown>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreationItem;