import React, { useEffect, useState, useCallback } from 'react';
import { useUser, useAuth } from '@clerk/clerk-react';
import { Heart, X, ArrowLeft, ArrowRight } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Skeleton from '@mui/material/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {
  const [creations, setCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const { user } = useUser();
  const { getToken } = useAuth();

  const fetchCreations = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get('/api/user/get-published-creations', {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) setCreations(data.creations);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const imageLikeToggle = async (id) => {
    try {
      setCreations((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                likes: item.likes.includes(user.id)
                  ? item.likes.filter((uid) => uid !== user.id)
                  : [...item.likes, user.id],
              }
            : item
        )
      );
      const { data } = await axios.post(
        '/api/user/toggle-like-creation',
        { id },
        { headers: { Authorization: `Bearer ${await getToken()}` } }
      );
      if (!data.success) toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleKeyDown = useCallback(
    (e) => {
      if (expandedIndex === null) return;
      if (e.key === 'ArrowLeft' && expandedIndex > 0) {
        setExpandedIndex((prev) => prev - 1);
        setIsImageLoaded(false);
      } else if (e.key === 'ArrowRight' && expandedIndex < creations.length - 1) {
        setExpandedIndex((prev) => prev + 1);
        setIsImageLoaded(false);
      } else if (e.key === 'Escape') {
        setExpandedIndex(null);
        setIsImageLoaded(false);
      }
    },
    [expandedIndex, creations.length]
  );

  useEffect(() => {
    if (user) fetchCreations();
  }, [user]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="flex-1 h-full flex flex-col gap-4 p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-2">Community Creations</h2>

      <div className="backdrop-blur-md bg-white/10 h-full w-full rounded-xl overflow-y-auto p-4 flex flex-wrap gap-4">
        {!loading ? (
          creations.map((creation, index) => (
            <div
              key={index}
              className="relative group cursor-pointer w-full sm:w-[48%] lg:w-[32%] rounded-xl overflow-hidden shadow-md hover:scale-[1.02] transition-all duration-300"
              onClick={() => {
                setExpandedIndex(index);
                setIsImageLoaded(false);
              }}
            >
              <img
                src={creation.content}
                alt="Creation"
                className="w-full h-60 object-cover rounded-xl"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition bg-gradient-to-t from-black/70 via-black/40 to-transparent">
                <p className="text-sm mb-2">{creation.prompt}</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm">{creation.likes.length}</p>
                  <Heart
                    onClick={(e) => {
                      e.stopPropagation();
                      imageLikeToggle(creation.id);
                    }}
                    className={`min-w-5 h-5 hover:scale-125 transition ${
                      creation.likes.includes(user.id)
                        ? 'fill-red-500 text-red-500'
                        : 'text-white'
                    }`}
                  />
                </div>
              </div>
            </div>
          ))
        ) : (
          [...Array(6)].map((_, i) => (
            <div
              key={i}
              className="w-full sm:w-[48%] lg:w-[32%] rounded-xl overflow-hidden"
            >
              <Skeleton variant="rectangular" animation="wave" width="100%" height={200} className="rounded-lg" />
              <Skeleton width="60%" />
            </div>
          ))
        )}
      </div>

      {/* Expanded View */}
      <AnimatePresence>
        {expandedIndex !== null && creations[expandedIndex] && (
          <motion.div
            key="expanded-image"
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative max-w-full max-h-full flex items-center justify-center">
              {!isImageLoaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              <motion.img
                key={creations[expandedIndex].id}
                src={creations[expandedIndex].content}
                alt="Expanded"
                initial={{ opacity: 0 }}
                animate={{ opacity: isImageLoaded ? 1 : 0 }}
                onLoad={() => setIsImageLoaded(true)}
                className="max-w-full max-h-[80vh] rounded-xl shadow-2xl"
              />

              <button
                onClick={() => {
                  setExpandedIndex(null);
                  setIsImageLoaded(false);
                }}
                className="absolute top-3 right-3 bg-white text-black rounded-full p-2 hover:scale-110 transition"
              >
                <X size={20} />
              </button>

              {expandedIndex > 0 && (
                <button
                  onClick={() => {
                    setExpandedIndex((prev) => prev - 1);
                    setIsImageLoaded(false);
                  }}
                  className="absolute top-1/2 left-3 -translate-y-1/2 bg-white text-black rounded-full p-2 hover:scale-110 transition"
                >
                  <ArrowLeft size={20} />
                </button>
              )}

              {expandedIndex < creations.length - 1 && (
                <button
                  onClick={() => {
                    setExpandedIndex((prev) => prev + 1);
                    setIsImageLoaded(false);
                  }}
                  className="absolute top-1/2 right-3 -translate-y-1/2 bg-white text-black rounded-full p-2 hover:scale-110 transition"
                >
                  <ArrowRight size={20} />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Community;
