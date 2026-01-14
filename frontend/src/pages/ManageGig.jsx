import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGigById } from '../redux/slices/gigSlice';
import { fetchBids, hireFreelancer } from '../redux/slices/bidSlice';
import Navbar from '../components/Navbar';
import api from '../utils/axios'; // <--- Added this import

const ManageGig = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [confirmModal, setConfirmModal] = useState({ show: false, bidId: null });

  const { gig, loading: gigLoading } = useSelector((state) => state.gigs);
  const { bids, loading: bidsLoading, successMessage } = useSelector((state) => state.bids);
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchGigById(id));
    dispatch(fetchBids(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (gig && userInfo && gig.ownerId?._id !== userInfo._id) {
      navigate('/');
    }
  }, [gig, userInfo, navigate]);

  const handleHireClick = (bidId) => {
    setConfirmModal({ show: true, bidId });
  };

  // 🔥 NEW: Delete Functionality
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this Job? This action cannot be undone.")) {
      try {
        await api.delete(`/gigs/${id}`);
        navigate('/'); // Redirect to home after delete
      } catch (error) {
        alert(error.response?.data?.message || "Failed to delete gig");
      }
    }
  };

  const confirmHireAction = async () => {
    if (confirmModal.bidId) {
      await dispatch(hireFreelancer(confirmModal.bidId));
      dispatch(fetchGigById(id)); 
      setConfirmModal({ show: false, bidId: null });
    }
  };

  if (gigLoading || bidsLoading) return <div className="text-white text-center mt-20">Loading data...</div>;
  if (!gig) return null;

  return (
    <>
      <Navbar />

      {confirmModal.show && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-800 border border-slate-600 p-6 rounded-xl shadow-2xl max-w-md w-full relative animate-scale-in">
            <h3 className="text-xl font-bold text-white mb-2">Confirm Hiring</h3>
            <p className="text-slate-300 mb-6">
              Are you sure you want to hire this freelancer? <br/>
              <span className="text-red-400 text-sm">This action will automatically reject all other applications.</span>
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setConfirmModal({ show: false, bidId: null })}
                className="px-4 py-2 rounded-lg text-slate-300 hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmHireAction}
                className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-bold shadow-lg shadow-green-500/20"
              >
                Yes, Hire
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Manage Applicants</h1>
            <p className="text-slate-400">
              For job: <span className="text-indigo-400 font-medium">{gig.title}</span>
            </p>
          </div>
          <div className="text-right flex flex-col items-end gap-3">
            
            <div className={`px-4 py-2 rounded-lg font-bold uppercase text-sm tracking-wide border ${
              gig.status === 'open' 
                ? 'bg-green-500/10 text-green-400 border-green-500/50' 
                : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/50'
            }`}>
              {gig.status === 'open' ? 'Active • Accepting Bids' : 'Job Assigned'}
            </div>

            {/* 🔥 NEW: Delete Button */}
            <button 
              onClick={handleDelete}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/50 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Job
            </button>

          </div>
        </div>

        {successMessage && (
          <div className="mb-8 bg-green-500/10 border border-green-500/50 text-green-200 p-4 rounded-lg flex items-center gap-3 animate-fade-in">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            {successMessage}
          </div>
        )}

        <div className="grid gap-6">
          {bids.length === 0 ? (
            <div className="text-center py-20 bg-slate-800/30 rounded-2xl border border-slate-700/50">
              <p className="text-slate-500 text-lg">No applicants yet. Share your job to get more bids!</p>
            </div>
          ) : (
            bids.map((bid) => (
              <div 
                key={bid._id} 
                className={`p-6 rounded-xl border transition-all ${
                  bid.status === 'hired' 
                    ? 'bg-indigo-900/20 border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.2)]' 
                    : bid.status === 'rejected'
                    ? 'opacity-50 bg-slate-900/50 border-slate-800 grayscale'
                    : 'bg-slate-800/50 border-slate-700 hover:border-slate-600'
                }`}
              >
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{bid.freelancerId?.name}</h3>
                      <span className="text-slate-500 text-sm">• {bid.freelancerId?.email}</span>
                      {bid.status === 'hired' && (
                        <span className="bg-indigo-500 text-white text-xs px-2 py-0.5 rounded font-bold uppercase tracking-wider">Hired</span>
                      )}
                    </div>
                    
                    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
                      <p className="text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">{bid.message}</p>
                    </div>
                    <p className="text-slate-500 text-xs mt-2">Applied on {new Date(bid.createdAt).toLocaleDateString()}</p>
                  </div>

                  <div className="flex flex-col justify-center items-end min-w-37.5 gap-3">
                    <div className="text-2xl font-bold text-white">${bid.price}</div>
                    
                    {bid.status === 'pending' && gig.status === 'open' && (
                      <button
                        onClick={() => handleHireClick(bid._id)} 
                        className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-4 rounded-lg shadow-lg shadow-green-500/20 transition-all transform hover:scale-105"
                      >
                        Hire Now
                      </button>
                    )}

                    {bid.status === 'rejected' && (
                      <span className="text-red-400 text-sm font-medium">Application Rejected</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default ManageGig;