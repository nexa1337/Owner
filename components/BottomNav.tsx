
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NAV_ITEMS } from '../constants';
import Icon from './Icon';

const BottomNav: React.FC = () => {
  const location = useLocation();

  // Reorder items for mobile: Home(0), Space(1), Tool(4), Chat(2), Contact(3)
  const mobileNavItems = [
    NAV_ITEMS[0],
    NAV_ITEMS[1],
    NAV_ITEMS[4], // Tool
    NAV_ITEMS[2],
    NAV_ITEMS[3]
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-50 pb-safe">
      <div className="flex justify-around items-center h-16">
        {mobileNavItems.map((item) => {
          const isActive = !item.isExternal && location.pathname === item.path;
          const isTool = item.label === 'Tool';

          if (item.isExternal) {
            return (
              <a
                key={item.path}
                href={item.path}
                target="_blank"
                rel="noreferrer"
                className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                  isTool 
                    ? 'text-emerald-500 dark:text-emerald-400' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <div className={`transition-transform ${isTool ? 'bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-xl mb-0.5' : ''}`}>
                   <Icon name={item.iconName} size={isTool ? 24 : 24} className={isTool ? 'animate-pulse' : ''} />
                </div>
                <span className={`text-[10px] mt-0.5 font-medium ${isTool ? 'font-bold' : ''}`}>{item.label}</span>
              </a>
            );
          }

          return (
            <Link 
              key={item.path} 
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
  );
};

export default BottomNav;
