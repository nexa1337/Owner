import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Icon from '../components/Icon';
import { CATEGORIES } from '../constants';

const Roadmap: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="w-full pt-24 pb-24 min-h-screen bg-[#f9f9f8] dark:bg-slate-950 px-4 sm:px-6 md:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-16 text-center md:text-left">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight"
          >
            Explore <span className="text-emerald-600 dark:text-emerald-400">Space</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-slate-600 dark:text-slate-400 max-w-2xl text-lg md:text-xl leading-relaxed"
          >
            Dive into the different dimensions of my universe. From architectural designs to cybersecurity protocols and gaming worlds.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 auto-rows-fr"
        >
          
          {CATEGORIES.map((category) => (
            <motion.div key={category.id} variants={cardVariants} className="h-full">
              <Link to={`/roadmap/${category.id}`} className="block group h-full">
                <div className="
                  h-full relative overflow-hidden rounded-[32px] p-8 md:p-10
                  bg-white dark:bg-slate-900 
                  shadow-[0px_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none
                  border border-transparent dark:border-slate-800
                  hover:shadow-[0px_8px_30px_rgba(0,0,0,0.08)] dark:hover:border-slate-700
                  transition-all duration-300
                  flex flex-col justify-between
                ">
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-8">
                      <div className={`w-14 h-14 rounded-full bg-${category.color}-50 dark:bg-${category.color}-900/20 text-${category.color}-600 dark:text-${category.color}-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <Icon name={category.iconName} size={28} />
                      </div>
                      <div className="px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-500 uppercase tracking-wider">
                         {category.projects.length + (category.nexaProjects?.length || 0)} Items
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {category.title}
                    </h3>
                    
                    <p className="text-base text-slate-500 dark:text-slate-400 leading-relaxed">
                      {category.shortDescription}
                    </p>
                  </div>

                  <div className="relative z-10 mt-10 flex items-center justify-between">
                     <span className="text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        Enter Dimension
                     </span>
                     <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                        <Icon name="ArrowRight" size={18} />
                     </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* SECRET AREA CARD */}
          <motion.div variants={cardVariants} className="h-full">
            <Link to="/secret" className="block group h-full">
              <div className="
                h-full relative overflow-hidden rounded-[32px] p-8 md:p-10
                bg-slate-900 dark:bg-black
                shadow-[0px_4px_20px_rgba(0,0,0,0.1)]
                hover:shadow-[0px_8px_30px_rgba(220,38,38,0.15)]
                transition-all duration-300
                flex flex-col justify-between
              ">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-14 h-14 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon name="Lock" size={28} />
                    </div>
                    <div className="px-4 py-1.5 rounded-full bg-red-500/10 text-[10px] font-bold text-red-500 uppercase tracking-widest animate-pulse">
                       Restricted
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-red-400 transition-colors tracking-tight">
                    Secret Area
                  </h3>
                  
                  <p className="text-base text-slate-400 leading-relaxed">
                    Exclusive resources, cracked software, and premium assets. Access requires a <span className="text-white font-bold">Secret Key</span>.
                  </p>
                </div>

                <div className="relative z-10 mt-10 flex items-center justify-between">
                   <span className="text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-red-400 transition-colors">
                      Enter Vault
                   </span>
                   <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-red-500 group-hover:text-white transition-all duration-300">
                      <Icon name="Key" size={18} />
                   </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* MASTER ADMIN PERSONAL SPACE CARD */}
          <motion.div variants={cardVariants} className="h-full">
            <Link to="/personal-space" className="block group h-full">
              <div className="
                h-full relative overflow-hidden rounded-[32px] p-8 md:p-10
                bg-[#1c1917] dark:bg-[#0c0a09]
                shadow-[0px_4px_20px_rgba(0,0,0,0.1)]
                hover:shadow-[0px_8px_30px_rgba(245,158,11,0.1)]
                transition-all duration-300
                flex flex-col justify-between
              ">
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-14 h-14 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                      <Icon name="User" size={28} />
                    </div>
                    <div className="px-4 py-1.5 rounded-full bg-amber-500/10 text-[10px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Icon name="Lock" size={10} />
                      Admin Only
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-amber-400 transition-colors tracking-tight">
                    Personal Space
                  </h3>
                  
                  <p className="text-base text-slate-400 leading-relaxed">
                    Financial Command Center, Growth Plans, and Private Acquisitions. 
                    <span className="text-amber-500/80 block mt-2 font-medium">Auth Required.</span>
                  </p>
                </div>

                <div className="relative z-10 mt-10 flex items-center justify-between">
                   <span className="text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-amber-400 transition-colors">
                      Access System
                   </span>
                   <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-slate-400 group-hover:bg-amber-500 group-hover:text-black transition-all duration-300">
                      <Icon name="ArrowRight" size={18} />
                   </div>
                </div>
              </div>
            </Link>
          </motion.div>

        </motion.div>
      </div>
    </div>
  );
};

export default Roadmap;