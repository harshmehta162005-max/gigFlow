
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createGig } from '../redux/slices/gigSlice';
import Navbar from '../components/Navbar';

const PostGig = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState(''); // Stores the raw number
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.gigs);

  
  const handleIncrement = () => {
    setBudget(prev => (prev === '' ? 50 : parseInt(prev) + 50));
  };

  const handleDecrement = () => {
    setBudget(prev => (prev === '' || parseInt(prev) <= 0 ? 0 : parseInt(prev) - 50));
  };
  

  const submitHandler = async (e) => {
    e.preventDefault();
    
    
    const result = await dispatch(createGig({ title, description, budget }));
    
    
    if (!result.error) {
      navigate('/');
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
        
        <div className="max-w-2xl w-full bg-slate-800/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-slate-700/50">
          
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white">Post a New Job</h2>
            <p className="text-slate-400 mt-2">Describe the project and set your budget.</p>
          </div>

          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-200 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={submitHandler} className="space-y-6">
            
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Job Title
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Build a React E-commerce Site"
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Budget ($)
              </label>
              <div className="flex items-center w-full bg-slate-900/50 border border-slate-600 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                
                
                <button 
                  type="button" 
                  onClick={handleDecrement}
                  className="px-5 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-300 font-bold border-r border-slate-600 transition-colors"
                >
                  −
                </button>

                
                <input
                  type="number"
                  required
                  min="1"
                  className="w-full bg-transparent text-center text-white font-bold text-lg outline-none appearance-none"
                  placeholder="500"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  style={{ MozAppearance: 'textfield' }} 
                />

                
                <button 
                  type="button" 
                  onClick={handleIncrement}
                  className="px-5 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-300 font-bold border-l border-slate-600 transition-colors"
                >
                  +
                </button>
              </div>
              
              <style>{`
                input[type=number]::-webkit-inner-spin-button, 
                input[type=number]::-webkit-outer-spin-button { 
                  -webkit-appearance: none; 
                  margin: 0; 
                }
              `}</style>
            </div>
            

            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Project Description
              </label>
              <textarea
                required
                rows="6"
                placeholder="Detail the requirements, tech stack, and timeline..."
                className="w-full px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 px-4 py-3 rounded-lg text-slate-300 bg-slate-700/50 hover:bg-slate-700 transition-colors font-medium"
              >
                Cancel
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-3 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-colors font-medium shadow-lg shadow-indigo-500/30 disabled:opacity-50"
              >
                {loading ? 'Posting...' : 'Post Job'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  );
};

export default PostGig;