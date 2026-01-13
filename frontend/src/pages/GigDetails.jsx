import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGigById } from '../redux/slices/gigSlice';
import { placeBid, clearBidMessages } from '../redux/slices/bidSlice';
import Navbar from '../components/Navbar';
import api from '../utils/axios';

const GigDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const [showBidForm, setShowBidForm] = useState(false);
  const [price, setPrice] = useState(''); 
  const [message, setMessage] = useState('');
  const [hasApplied, setHasApplied] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const { gig, loading: gigLoading } = useSelector((state) => state.gigs);
  const { userInfo } = useSelector((state) => state.auth);
  const { loading: bidLoading, error: bidError } = useSelector((state) => state.bids);

  useEffect(() => {
    dispatch(fetchGigById(id));
    dispatch(clearBidMessages());

    const checkStatus = async () => {
      if (userInfo && id) {
        try {
          const { data } = await api.get(`/bids/check/${id}`);
          setHasApplied(data.hasApplied);
        } catch (error) {
          console.error("Failed to check bid status", error);
        }
      }
    };
    checkStatus();
  }, [dispatch, id, userInfo]);


  const handleIncrement = () => {
    setPrice(prev => (prev === '' ? 10 : parseInt(prev) + 10));
  };

  const handleDecrement = () => {
    setPrice(prev => (prev === '' || parseInt(prev) <= 0 ? 0 : parseInt(prev) - 10));
  };


  const submitBidHandler = async (e) => {
    e.preventDefault();
    const result = await dispatch(placeBid({ gigId: id, price, message }));
    
    if (!result.error) {
      setShowBidForm(false);
      setShowToast(true);
      setHasApplied(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  };

  if (gigLoading) return <div className="text-white text-center mt-20">Loading...</div>;
  if (!gig) return null;

  const isOwner = userInfo?._id === gig.ownerId?._id;

  return (
    <>
      <Navbar />

      
      {showToast && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-bounce-in">
          <div className="bg-green-500 text-white px-8 py-4 rounded-lg shadow-2xl flex items-center gap-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <h4 className="font-bold text-lg">Bid Placed Successfully!</h4>
              <p className="text-sm text-green-100">Redirecting to dashboard...</p>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-[calc(100vh-64px)] flex justify-center px-4 py-12">
        <div className="max-w-3xl w-full bg-slate-800/50 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-slate-700/50 h-fit">
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{gig.title}</h1>
              <p className="text-slate-400 text-sm">
                Posted by <span className="text-indigo-400">{gig.ownerId?.name}</span> • {new Date(gig.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
               <div className="bg-indigo-500/10 border border-indigo-500/50 text-indigo-300 px-4 py-2 rounded-lg text-lg font-bold">
                ${gig.budget}
              </div>
              <div className={`mt-2 text-xs uppercase font-bold px-5 py-1 rounded ${gig.status === 'open' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                {gig.status}
              </div>
            </div>
          </div>

          <hr className="border-slate-700 mb-6" />

          <div className="prose prose-invert max-w-none mb-8">
            <h3 className="text-xl font-semibold text-white mb-3">Project Description</h3>
            <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">{gig.description}</p>
          </div>

          {bidError && (
            <div className="mb-6 bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-lg">
              {bidError}
            </div>
          )}

          {!userInfo ? (
            <button 
              onClick={() => navigate('/login')}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg"
            >
              Login to Apply
            </button>
          ) : isOwner ? (
            <Link 
              to={`/manage-gig/${id}`}
              className="block text-center w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Manage Applicants
            </Link>
          ) : hasApplied && !showToast ? (
            <button 
              disabled
              className="w-full bg-gray-600 text-gray-400 font-bold py-3 px-6 rounded-lg cursor-not-allowed border border-gray-500"
            >
              Already Applied
            </button>
          ) : (
            <>
              {!showBidForm && !showToast && (
                <button 
                  onClick={() => setShowBidForm(true)}
                  disabled={gig.status !== 'open'}
                  className="w-full bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-indigo-500/30 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {gig.status === 'open' ? 'Apply Now' : 'Job Closed'}
                </button>
              )}

              {showBidForm && !showToast && (
                <form onSubmit={submitBidHandler} className="bg-slate-900/50 p-6 rounded-xl border border-slate-700 animate-fade-in mt-6">
                  <h3 className="text-lg font-bold text-white mb-4">Submit Your Proposal</h3>
                  
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Your Price ($)</label>
                    <div className="flex items-center w-full bg-slate-800 border border-slate-600 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                      
                      
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
                        className="w-full bg-transparent text-center text-white font-bold text-lg outline-none appearance-none"
                        placeholder="0"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
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
                  
                  
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Cover Letter</label>
                    <textarea
                      required
                      rows="4"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                      placeholder="Why are you the best fit for this project?"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setShowBidForm(false)}
                      className="flex-1 bg-slate-700 text-slate-300 py-3 rounded-lg hover:bg-slate-600 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={bidLoading}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-lg font-bold shadow-lg shadow-indigo-500/30 transition-colors"
                    >
                      {bidLoading ? 'Sending...' : 'Submit Proposal'}
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

        </div>
      </div>
    </>
  );
};

export default GigDetails;