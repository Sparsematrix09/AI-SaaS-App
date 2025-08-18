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
    setCurrentPage(1); // Reset to page 1 on filter change
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
    <div className="h-full overflow-y-scroll p-4 md:p-6">
      {/* Stats */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex justify-between items-center w-full md:w-72 p-4 px-6 bg-white rounded-xl border border-gray-200">
          <div className="text-slate-600">
            <p className="text-sm">Total Creations</p>
            <h2 className="text-xl font-semibold">{creations.length}</h2>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#3588F2] to-[#0BB0D7] text-white flex justify-center items-center">
            <Sparkles className="w-5 text-white" />
          </div>
        </div>

        <div className="flex justify-between items-center w-full md:w-72 p-4 px-6 bg-white rounded-xl border border-gray-200">
          <div className="text-slate-600">
            <p className="text-sm">Active Plan</p>
            <h2 className="text-xl font-semibold">
              <Protect plan="premium" fallback="Free">Premium</Protect>
            </h2>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#FF61C5] to-[#9E53EE] text-white flex justify-center items-center">
            <Gem className="w-5 text-white" />
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="mb-4 flex flex-wrap gap-2">
        {['all', 'article', 'blog-title', 'image' , 'resume-review'].map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={`px-4 py-1 text-sm rounded-full border ${
              filter === type
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
            }`}
          >
            {
              type === 'all' ? 'All Creations' 
              : type === 'blog-title' ? 'Blog Title' 
              : type === 'resume-review' ? 'Resume Review' 
              : type.charAt(0).toUpperCase() + type.slice(1)
            }
          </button>
        ))}
      </div>

      {/* Items */}
      <div className="space-y-3">
        {loading ? (
          [...Array(2)].map((_, i) => (
            <div key={i} className="w-full">
              <Skeleton variant="rectangular" animation="wave" width="100%" height={150} className="rounded-lg mb-2" />
              <Skeleton width="60%" />
            </div>
          ))
        ) : currentItems.length > 0 ? (
          currentItems.map((item) => (
            <CreationItem key={item.id} item={item} onDelete={deleteCreation} />
          ))
        ) : (
          <p className="text-gray-500 text-sm">No creations found.</p>
        )}
      </div>

      {/* Pagination */}
      {!loading && filteredCreations.length > itemsPerPage && (
        <div className="flex justify-center items-center gap-2 mt-6 flex-wrap">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`p-2 border rounded-lg ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
          >
            <ChevronLeft size={18} />
          </button>

          {getPageNumbers().map((num) => (
            <button
              key={num}
              onClick={() => setCurrentPage(num)}
              className={`w-8 h-8 text-sm rounded-md ${
                currentPage === num ? 'bg-blue-600 text-white font-semibold' : 'hover:bg-gray-100'
              }`}
            >
              {num}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`p-2 border rounded-lg ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;