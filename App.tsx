
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Home from './pages/Home';
import Roadmap from './pages/Roadmap';
import CategoryDetail from './pages/CategoryDetail';
import Contact from './pages/Contact';
import Chat from './pages/Chat';
import SecretArea from './pages/SecretArea';
import PersonalFinance from './pages/PersonalFinance';

// Logic to handle initial redirect and scrolling
const AppBehavior = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Force redirect to Home on initial mount (website reload)
  useEffect(() => {
    navigate('/', { replace: true });
  }, []);

  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <AppBehavior />
      <div className="min-h-screen flex flex-col font-sans">
        <Header />
        
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/roadmap" element={<Roadmap />} />
            <Route path="/roadmap/:id" element={<CategoryDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/secret" element={<SecretArea />} />
            <Route path="/personal-space" element={<PersonalFinance />} />
          </Routes>
        </main>

        <BottomNav />
      </div>
    </Router>
  );
};

export default App;