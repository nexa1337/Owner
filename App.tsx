
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Roadmap from './pages/Roadmap';
import CategoryDetail from './pages/CategoryDetail';
import SecretArea from './pages/SecretArea';
import PersonalFinance from './pages/PersonalFinance';
import Footer from './components/Footer';

// Logic to handle initial redirect and scrolling
const AppBehavior = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Protected routes logic
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isUnlocked = localStorage.getItem('secret_area_unlocked') === 'true';
  if (!isUnlocked) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <Router>
      <AppBehavior />
      <div className="min-h-screen flex flex-col font-sans">
        <Header />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<SecretArea />} />
            <Route path="/roadmap" element={<ProtectedRoute><Roadmap /></ProtectedRoute>} />
            <Route path="/roadmap/:id" element={<ProtectedRoute><CategoryDetail /></ProtectedRoute>} />
            <Route path="/personal-space" element={<ProtectedRoute><PersonalFinance /></ProtectedRoute>} />
          </Routes>
          <Footer />
        </main>

        <BottomNav />
      </div>
    </Router>
  );
};

export default App;