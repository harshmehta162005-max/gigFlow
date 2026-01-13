import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import PostGig from './pages/PostGig';
import GigDetails from './pages/GigDetails';
import ManageGig from './pages/ManageGig';

function App() {
  return (
    <Router>
      <div className="font-sans text-gray-900 relative">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post-gig" element={<PostGig />} />
          <Route path="/gig/:id" element={<GigDetails />} />
          <Route path="/manage-gig/:id" element={<ManageGig />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;