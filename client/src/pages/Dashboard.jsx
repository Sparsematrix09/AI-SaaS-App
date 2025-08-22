import React, { useEffect, useState } from 'react';
import { Gem, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { Protect, useAuth } from '@clerk/clerk-react';
import CreationItem from '../components/CreationItem';
import axios from 'axios';
import toast from 'react-hot-toast';
import Skeleton from '@mui/material/Skeleton';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Dashboard = () => {
  const [creations, setCreations] = useState([]);
  const [filteredCreations, setFilteredCreations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState('all');
  const itemsPerPage = 10;

  const { getToken } = useAuth();

  const getDashboardData = async () => {
    try {
      const { data } = await axios.get('/api/user/get-user-creations', {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        setCreations(data.creations);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
    setLoading(false);
  };

  const deleteCreation = async (id) => {
    try {
      const { data } = await axios.delete(`/api/user/delete-creation/${id}`, {
        headers: { Authorization: `Bearer ${await getToken()}` },
      });
      if (data.success) {
        toast.success(data.message);
        setCreations(prev => prev.filter(item => item.id !== id));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    getDashboardData();
  }, []);

  useEffect(() => {
    if (filter === 'all') {
      setFilteredCreations(creations);
    } else {
      setFilteredCreations(creations.filter(item => item.type === filter));
    }
    setCurrentPage(1);
  }, [filter, creations]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCreations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCreations.length / itemsPerPage);

  const getPageNumbers = () => {
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  return (
    <div className="h-full overflow-y-scroll p-4 md:p-6 bg-gray-900 text-gray-100">
      {/* Stats */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex justify-between items-center w-full md:w-72 p-4 px-6 bg-gray-800 rounded-xl border border-gray-700 shadow-lg">
          <div>
            <p className="text-sm text-gray-400">Total Creations</p>
            <h2 className="text-xl font-semibold text-white">{creations.length}</h2>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-400 text-white flex justify-center items-center shadow-md">
            <Sparkles className="w-5" />
          </div>
        </div>

        <div className="flex justify-between items-center w-full md:w-72 p-4 px-6 bg-gray-800 rounded-xl border border-gray-700 shadow-lg">
          <div>
            <p className="text-sm text-gray-400">Active Plan</p>
            <h2 className="text-xl font-semibold text-white">
              <Protect plan="premium" fallback="Free">Premium</Protect>
            </h2>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500 text-white flex justify-center items-center shadow-md">
            <Gem className="w-5" />
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="mb-4 flex flex-wrap gap-2">
        {['all', 'article', 'blog-title', 'image', 'resume-review'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-1 text-sm rounded-full border transition-colors duration-200 ${
              filter === type
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-transparent shadow-lg'
                : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700 hover:text-white'
            }`}
          >
            {type === 'all'
              ? 'All Creations'
              : type === 'blog-title'
              ? 'Blog Title'
              : type === 'resume-review'
              ? 'Resume Review'
              : type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="space-y-3">
        {loading ? (
          [...Array(2)].map((_, i) => (
            <div key={i} className="w-full">
              <Skeleton variant="rectangular" animation="wave" width="100%" height={150} className="rounded-lg mb-2 bg-gray-700" />
              <Skeleton width="60%" className="bg-gray-700" />
            </div>
          ))
        ) : currentItems.length > 0 ? (
          currentItems.map((item) => (
            <CreationItem key={item.id} item={item} onDelete={deleteCreation} />
          ))
        ) : (
          <p className="text-gray-400 text-sm">No creations found.</p>
        )}
      </div>

      {/* Pagination */}
      {!loading && filteredCreations.length > itemsPerPage && (
        <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`p-2 border rounded-lg ${
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700 border-gray-600'
            }`}
          >
            <ChevronLeft size={18} />
          </button>

          {getPageNumbers().map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`w-8 h-8 text-sm rounded-md ${
                currentPage === num
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold'
                  : 'hover:bg-gray-700 text-gray-300'
              }`}
            >
              {num}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`p-2 border rounded-lg ${
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700 border-gray-600'
            }`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
