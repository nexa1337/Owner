import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ThemeToggle from './ThemeToggle';
import { NAV_ITEMS } from '../constants';
import Icon from './Icon';

const MoroccanFlag = () => (
  <motion.div 
    className="relative w-6 h-4 md:w-8 md:h-5 rounded shadow-sm cursor-default overflow-hidden group"
    title="Made in Morocco 🇲🇦"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
  >
    <motion.div
      className="w-full h-full relative"
      animate={{ 
        x: [0, -2, 2, -1, 1, 0],
        skewX: [0, 5, -5, 2, -2, 0],
        filter: [
            "hue-rotate(0deg)",
            "hue-rotate(90deg) contrast(1.5)",
            "hue-rotate(0deg)"
        ]
      }}
      transition={{ 
        duration: 0.4, 
        repeat: Infinity, 
        repeatDelay: 5,
        repeatType: "mirror",
        ease: "easeInOut" 
      }}
    >
        {/* Realistic Flag Base */}
        <div className="absolute inset-0 bg-[#C1272D] flex items-center justify-center overflow-hidden">
             {/* Fabric Texture Overlay */}
             <div className="absolute inset-0 bg-gradient-to-r from-black/10 via-transparent to-black/10 opacity-30" style={{ backgroundSize: '4px 100%' }}></div>
             <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-black/10 mix-blend-overlay"></div>
             
             {/* Star */}
             <svg viewBox="0 0 512 512" className="w-3 h-3 md:w-4 md:h-4 text-[#006233] fill-current drop-shadow-sm relative z-10">
                <path d="M256 32l68 147h154L351 268l46 148-141-88-141 88 46-148L34 179h154z" />
             </svg>
        </div>
        
        {/* Glitch Overlay (Red/Blue split simulation) */}
        <div className="absolute inset-0 bg-red-500/20 mix-blend-screen translate-x-[1px] animate-pulse opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="absolute inset-0 bg-blue-500/20 mix-blend-screen -translate-x-[1px] animate-pulse animation-delay-75 opacity-0 group-hover:opacity-100 transition-opacity"></div>
    </motion.div>
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
            <motion.div
              className="relative text-slate-900 dark:text-white group-hover:scale-105 transition-transform"
              animate={{ 
                x: [0, -2, 2, -1, 1, 0],
                skewX: [0, 5, -5, 2, -2, 0],
              }}
              transition={{ 
                duration: 0.4, 
                repeat: Infinity, 
                repeatDelay: 5,
                repeatType: "mirror",
                ease: "easeInOut" 
              }}
            >
              <div className="absolute inset-0 text-red-500 translate-x-[2px] animate-pulse z-0"><Icon name="Wolf" size={32} /></div>
              <div className="absolute inset-0 text-blue-500 -translate-x-[2px] animate-pulse animation-delay-75 z-0"><Icon name="Wolf" size={32} /></div>
              <Icon name="Wolf" size={32} className="relative z-10" />
            </motion.div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white leading-none">
                Anouar Marouan
              </span>
              <div className="flex items-center justify-center mt-1 gap-1">
                 <span className="text-[10px] font-bold text-primary-500 uppercase tracking-[0.35em] leading-none animate-pulse">
                  N E X A 1337
                 </span>
                 <Icon name="CheckCircle" size={12} className="text-blue-500" />
              </div>
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