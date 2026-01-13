import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGigs } from '../redux/slices/gigSlice';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';

const Home = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  // 1. Add a debounced term state
  const [debouncedTerm, setDebouncedTerm] = useState(searchTerm);

  const { gigs, loading, error } = useSelector((state) => state.gigs);

  // 2. Delay updating the debounced term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 500); // Wait 500ms after user stops typing

    return () => clearTimeout(timer); // Cleanup
  }, [searchTerm]);

  // 3. Only fetch when debouncedTerm changes
  useEffect(() => {
    dispatch(fetchGigs(debouncedTerm));
  }, [dispatch, debouncedTerm]);

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold text-white">Latest Gigs</h1>
          
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search jobs (e.g. React, Design)..."
              className="w-full bg-slate-800/50 border border-slate-600 text-white rounded-lg pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="absolute right-3 top-3 h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {loading && <div className="text-center text-slate-400 mt-20">Loading amazing gigs...</div>}
        {error && <div className="text-center text-red-400 mt-20">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gigs.map((gig) => (
            <div key={gig._id} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-indigo-500/50 transition-all hover:transform hover:-translate-y-1 group relative flex flex-col">
              
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors truncate pr-2">
                  {gig.title}
                </h3>
                <span className="bg-green-500/10 text-green-400 text-xs font-semibold px-2.5 py-0.5 rounded border border-green-500/20 whitespace-nowrap">
                  ${gig.budget}
                </span>
              </div>
              
              <p className="text-slate-400 text-sm mb-6 line-clamp-3 grow">
                {gig.description}
              </p>
              
              <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-700/50">
                <div className="text-xs text-slate-500">
                  Posted by <span className="text-slate-300">{gig.ownerId?.name || 'Unknown'}</span>
                </div>
                
                <Link to={`/gig/${gig._id}`} className="text-sm font-medium text-indigo-400 hover:text-indigo-300">
                  View Details →
                </Link>
              </div>

            </div>
          ))}
        </div>

        {!loading && gigs.length === 0 && (
          <div className="text-center py-20">
            <p className="text-slate-500 text-lg">No gigs found. Be the first to post one!</p>
          </div>
        )}

      </div>
    </>
  );
};

export default Home;