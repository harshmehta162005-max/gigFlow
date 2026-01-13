import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import axios from 'axios';
import io from 'socket.io-client';

let socket;

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  
  
  const dropdownRef = useRef(null);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  
  useEffect(() => {
    if (userInfo) {
      fetchNotifications();

      socket = io('http://localhost:5000');
      socket.emit('setup', userInfo);
      
      
      socket.on('notification', () => {
        
        fetchNotifications();
      });
    }
    return () => { if(socket) socket.disconnect(); }
  }, [userInfo]);

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get('/api/notifications');
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    } catch (error) {
      console.error(error);
    }
  };

  const markAsRead = async (id, gigId) => {
    try {
      await axios.patch(`/api/notifications/${id}/read`);
      
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
      setUnreadCount(prev => (prev > 0 ? prev - 1 : 0));
      setShowDropdown(false);
      
      
      if (gigId) navigate(`/gig/${gigId}`);
    } catch (error) {
      console.error(error);
    }
  };

  const logoutHandler = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          <div className="shrink-0">
            <Link to="/" className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-cyan-400">
              GigFlow
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-6">
              {userInfo ? (
                <>
                  <Link to="/post-gig" className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg shadow-indigo-500/30 transition-all transform hover:scale-105">
                    Post Job
                  </Link>

                  
                  <div className="relative" ref={dropdownRef}>
                    <button 
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="relative p-2 text-slate-300 hover:text-white transition-colors focus:outline-none"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      
                      
                      {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    
                    {showDropdown && (
                      <div className="absolute right-0 mt-2 w-80 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-fade-in z-50">
                        <div className="px-4 py-3 border-b border-slate-700 bg-slate-900/50">
                          <h3 className="text-sm font-semibold text-white">Notifications</h3>
                        </div>
                        
                        <div className="max-h-96 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="p-4 text-center text-slate-500 text-sm">No notifications yet</div>
                          ) : (
                            notifications.map((notif) => (
                              <div 
                                key={notif._id}
                                onClick={() => markAsRead(notif._id, notif.gigId)}
                                className={`px-4 py-3 cursor-pointer transition-colors border-b border-slate-700/50 last:border-0 ${notif.read ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-700/40 hover:bg-slate-700 border-l-4 border-l-indigo-500'}`}
                              >
                                <p className={`text-sm ${notif.read ? 'text-slate-400' : 'text-slate-200 font-medium'}`}>
                                  {notif.message}
                                </p>
                                <p className="text-xs text-slate-500 mt-1">
                                  {new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </p>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  

                  <div className="h-6 w-px bg-slate-700 mx-2"></div>

                  <div className="flex items-center gap-3">
                     <span className="text-slate-300 text-sm font-medium">
                      {userInfo.name}
                    </span>
                    <button
                      onClick={logoutHandler}
                      className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium border border-slate-600 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-600">
                    Login
                  </Link>
                  <Link to="/register" className="bg-linear-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg shadow-indigo-500/30 transition-all transform hover:scale-105">
                    Join Now
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;