import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import { NAV_ITEMS } from '../constants';
import Icon from './Icon';

const MoroccanFlag = () => (
  <motion.div 
    className="relative w-7 h-5 md:w-8 md:h-6 rounded-md overflow-hidden shadow-sm border border-slate-200 dark:border-slate-800 cursor-default origin-left"
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ 
      opacity: 1, 
      scale: 1,
      y: [0, -4, 0],
      rotate: [0, 10, 0] 
    }}
    transition={{ 
      y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
      rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" },
      default: { duration: 0.5 }
    }}
    title="Made in Morocco 🇲🇦"
  >
    {/* Red Background */}
    <div className="absolute inset-0 bg-[#C1272D]"></div>
    
    {/* Green Star (Pentagram) */}
    <div className="absolute inset-0 flex items-center justify-center">
       <svg viewBox="0 0 512 512" className="w-3.5 h-3.5 md:w-4 md:h-4 text-[#006233] fill-current">
          <path d="M256 32l68 147h154L351 268l46 148-141-88-141 88 46-148L34 179h154z" />
       </svg>
    </div>
    
    {/* Gloss Effect */}
    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent pointer-events-none"></div>
  </motion.div>
);

const Header: React.FC = () => {
  const location = useLocation();

  return (
    <header className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-black dark:bg-white rounded-xl flex items-center justify-center text-white dark:text-black group-hover:scale-105 transition-transform shadow-lg shadow-primary-500/20">
              <Icon name="Wolf" size={24} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white leading-none">
                Anouar Marouan
              </span>
              <span className="text-[10px] font-bold text-primary-500 uppercase tracking-widest leading-none mt-1">
                NEXA 1337
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {NAV_ITEMS.map((item) => {
              if (item.isExternal) {
                const isTool = item.label === 'Tool';
                return (
                  <a
                    key={item.path}
                    href={item.path}
                    target="_blank"
                    rel="noreferrer"
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      isTool 
                        ? 'bg-gradient-to-r from-primary-600 to-purple-600 text-white hover:shadow-lg hover:scale-105 hover:shadow-primary-500/30 relative overflow-hidden group/tool' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    {isTool && (
                       <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/tool:translate-x-full transition-transform duration-1000"></span>
                    )}
                    {item.label}
                  </a>
                );
              }
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    location.pathname === item.path 
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3 md:gap-4">
            <MoroccanFlag />
            <ThemeToggle />
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;