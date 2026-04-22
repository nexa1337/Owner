
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_ITEMS, SOCIAL_LINKS } from '../constants';
import Icon from './Icon';

const BottomNav: React.FC = () => {
  const location = useLocation();
  const [showMoreMobile, setShowMoreMobile] = useState(false);

  // New mobile nav items defined directly here
  const mobileNavItems = [
    { label: 'Home', path: '/', iconName: 'Home', isExternal: false },
    { label: 'Personal', path: '/personal-space', iconName: 'Activity', isExternal: false },
    { label: 'Secret Area', path: '/', iconName: 'Wolf', isExternal: false, centerAction: true },
    { label: 'Roadmap', path: '/roadmap', iconName: 'Rocket', isExternal: false },
    { label: 'More', path: '#more', iconName: 'MoreHorizontal', isExternal: false, isMore: true }
  ];

  return (
    <>
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-50 pb-safe">
        <div className="flex justify-around items-center h-16 relative">
          {mobileNavItems.map((item) => {
            const isActive = !item.isExternal && !item.isMore && location.pathname === item.path;

            if (item.isMore) {
              return (
                <button
                  key={item.label}
                  onClick={() => setShowMoreMobile(!showMoreMobile)}
                  className={`flex flex-col items-center justify-center w-full h-full transition-colors group ${
                    showMoreMobile 
                      ? 'text-primary-600 dark:text-nexa-accent' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon name={item.iconName} size={24} className={showMoreMobile ? 'animate-bounce-subtle' : ''} />
                  <span className="text-[10px] mt-1 font-medium">{item.label}</span>
                </button>
              );
            }

            if (item.centerAction) {
              return (
                <Link
                  key={item.label}
                  to={item.path}
                   className="relative flex flex-col items-center justify-center w-full h-full -mt-6 group"
                >
                  <div className="w-14 h-14 bg-gradient-to-tr from-slate-800 to-black rounded-full flex items-center justify-center shadow-lg border-[3px] border-white dark:border-slate-900 text-white group-hover:scale-105 transition-transform">
                     <Icon name={item.iconName} size={28} className="animate-pulse" />
                  </div>
                  <span className="text-[10px] mt-1 font-bold text-slate-800 dark:text-slate-200">{item.label}</span>
                </Link>
              );
            }

            return (
              <Link 
                key={item.label} 
                to={item.path}
                className={`flex flex-col items-center justify-center w-full h-full transition-colors group ${
                  isActive 
                    ? 'text-primary-600 dark:text-nexa-accent' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <Icon name={item.iconName} size={24} className={isActive ? 'animate-bounce-subtle' : ''} />
                <span className="text-[10px] mt-1 font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {showMoreMobile && (
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="md:hidden fixed inset-x-4 bottom-20 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-4 shadow-2xl flex flex-col items-stretch max-h-[70vh]"
          >
             <h3 className="text-slate-900 dark:text-white font-bold mb-4 px-2 tracking-tight">N E X A 1337 Ecosystem</h3>
             
             <div className="flex flex-col gap-2 overflow-y-auto px-2 pb-2">
                <a href="https://instagram.com/nexa1337" target="_blank" rel="noreferrer" className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98] rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm transition-all group">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-500/20 group-hover:scale-110 transition-transform">
                            <Icon name="Briefcase" size={18} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-slate-900 dark:text-white font-extrabold text-[13px] tracking-tight">N E X A 1337</span>
                            <span className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">342K clicks</span>
                        </div>
                    </div>
                    <Icon name="ExternalLink" size={14} className="text-slate-300 dark:text-slate-500 group-hover:text-blue-500 transition-colors" />
                </a>

                <a href="#" className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98] rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm transition-all group">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-100 dark:border-indigo-500/20 group-hover:scale-110 transition-transform">
                            <Icon name="Layout" size={18} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-slate-900 dark:text-white font-extrabold text-[13px] tracking-tight">N E X A 1337 - Portfolio</span>
                            <span className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">215K clicks</span>
                        </div>
                    </div>
                    <Icon name="ExternalLink" size={14} className="text-slate-300 dark:text-slate-500 group-hover:text-indigo-500 transition-colors" />
                </a>

                <a href="https://nexa1337.github.io/tool/" target="_blank" rel="noreferrer" className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98] rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm transition-all group">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-500/20 group-hover:scale-110 transition-transform">
                            <Icon name="Wrench" size={18} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-slate-900 dark:text-white font-extrabold text-[13px] tracking-tight">N E X A 1337 - Tool</span>
                            <span className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">189K clicks</span>
                        </div>
                    </div>
                    <Icon name="ExternalLink" size={14} className="text-slate-300 dark:text-slate-500 group-hover:text-emerald-500 transition-colors" />
                </a>

                <a href="#" className="flex items-center justify-between p-3.5 bg-slate-900 dark:bg-slate-950 active:scale-[0.98] rounded-2xl border border-purple-500/20 shadow-lg transition-all group overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-50"></div>
                    <div className="flex items-center gap-3 relative z-10">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white flex items-center justify-center shrink-0 shadow-md group-hover:scale-110 transition-transform">
                            <Icon name="Sparkles" size={18} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white font-extrabold text-[13px] tracking-tight">N E X A 1337 - Tool v2</span>
                            <span className="text-pink-400 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
                              <Icon name="TrendingUp" size={12} className="animate-pulse" /> 92K clicks
                            </span>
                        </div>
                    </div>
                    <Icon name="ExternalLink" size={14} className="text-slate-500 relative z-10 group-hover:text-purple-400 transition-colors" />
                </a>

                <a href="https://nexa1337.github.io/school" target="_blank" rel="noreferrer" className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98] rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm transition-all group">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 border border-amber-100 dark:border-amber-500/20 group-hover:scale-110 transition-transform">
                            <Icon name="GraduationCap" size={18} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-slate-900 dark:text-white font-extrabold text-[13px] tracking-tight">N E X A 1337 - School</span>
                            <span className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">54K clicks</span>
                        </div>
                    </div>
                    <Icon name="ExternalLink" size={14} className="text-slate-300 dark:text-slate-500 group-hover:text-amber-500 transition-colors" />
                </a>

                <a href="https://linktr.ee/nexa1337" target="_blank" rel="noreferrer" className="flex items-center justify-between p-3.5 bg-white dark:bg-slate-800/80 hover:bg-slate-50 dark:hover:bg-slate-800 active:scale-[0.98] rounded-2xl border border-slate-100 dark:border-slate-700/50 shadow-sm transition-all group">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-100 dark:border-rose-500/20 group-hover:scale-110 transition-transform">
                            <Icon name="ShoppingCart" size={18} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-slate-900 dark:text-white font-extrabold text-[13px] tracking-tight">N E X A 1337 - Digital Store</span>
                            <span className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-wider">Products & More</span>
                        </div>
                    </div>
                    <Icon name="ExternalLink" size={14} className="text-slate-300 dark:text-slate-500 group-hover:text-rose-500 transition-colors" />
                </a>
             </div>

             <button onClick={() => setShowMoreMobile(false)} className="mt-4 w-full py-3.5 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 text-red-600 dark:text-red-500 rounded-xl font-bold active:scale-95 transition-all outline-none">
               Close Menu
             </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BottomNav;
