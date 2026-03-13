import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from './Icon';

export const NEXA_ECOSYSTEM_LINKS = [
  { name: 'N E X A 1337', url: 'https://nexa1337.github.io/nexa1337', clicks: '342K' },
  { name: 'N E X A 1337 - Portfolio', url: 'https://nexa1337.github.io/Owner', clicks: '215K' },
  { name: 'N E X A 1337 - Tool', url: 'https://nexa1337.github.io/tool', clicks: '189K' },
  { name: 'N E X A 1337 - Digital Store', url: 'https://nexa1337.github.io/digitalstore', clicks: '128K' }
];

const Footer: React.FC = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <>
      <footer className="w-full py-8 text-center text-slate-500 dark:text-slate-400 text-sm pb-24 md:pb-8">
        <p>
          © 2026 <button onClick={() => setIsPopupOpen(true)} className="font-bold text-slate-700 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">N E X A 1337</button>. All rights reserved.
        </p>
      </footer>

      <AnimatePresence>
        {isPopupOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsPopupOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">N E X A 1337 Ecosystem</h3>
                <button onClick={() => setIsPopupOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                  <Icon name="X" size={24} />
                </button>
              </div>
              <div className="p-4 space-y-3">
                {NEXA_ECOSYSTEM_LINKS.map((link, idx) => (
                  <a 
                    key={idx}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-primary-50 dark:hover:bg-primary-900/20 border border-slate-100 dark:border-slate-700 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center shadow-sm group-hover:text-primary-600 dark:group-hover:text-primary-400">
                        <Icon name="ExternalLink" size={18} />
                      </div>
                      <span className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">{link.name}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                      <Icon name="Activity" size={14} />
                      {link.clicks} clicks
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Footer;
