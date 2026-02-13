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
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="w-full pt-20 pb-24 min-h-screen bg-slate-50 dark:bg-slate-950 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
            Explore <span className="text-primary-500">Space</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl text-lg">
            Dive into the different dimensions of my universe. From architectural designs to cybersecurity protocols and gaming worlds.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr"
        >
          
          {CATEGORIES.map((category) => (
            <motion.div key={category.id} variants={cardVariants} className="h-full">
              <Link to={`/roadmap/${category.id}`} className="block group h-full">
                <div className={`
                  h-full relative overflow-hidden rounded-[2rem] p-8 
                  bg-white dark:bg-slate-900 
                  border border-slate-200 dark:border-slate-800 
                  hover:border-${category.color}-500/50 
                  transition-all duration-500 hover:shadow-2xl 
                  hover:shadow-${category.color}-500/10 hover:-translate-y-2
                  flex flex-col justify-between
                `}>
                  {/* Decorative Background */}
                  <div className={`absolute -right-10 -top-10 w-40 h-40 bg-${category.color}-500/10 rounded-full blur-3xl group-hover:bg-${category.color}-500/20 transition-all`}></div>
                  
                  <div className="relative z-10">
                    <div className="flex justify-between items-start mb-8">
                      <div className={`p-4 rounded-2xl bg-${category.color}-50 dark:bg-${category.color}-900/20 text-${category.color}-600 dark:text-${category.color}-400 group-hover:scale-110 transition-transform duration-500`}>
                        <Icon name={category.iconName} size={32} />
                      </div>
                      <div className="px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-500 uppercase tracking-wider">
                         {category.projects.length + (category.nexaProjects?.length || 0)} Items
                      </div>
                    </div>

                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-primary-500 transition-colors">
                      {category.title}
                    </h3>
                    
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                      {category.shortDescription}
                    </p>
                  </div>

                  <div className="relative z-10 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                     <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 group-hover:text-primary-500 transition-colors">
                        Enter Dimension
                     </span>
                     <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300">
                        <Icon name="ArrowRight" size={14} />
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
                h-full relative overflow-hidden rounded-[2rem] p-8 
                bg-slate-900 dark:bg-black
                border border-slate-800 dark:border-slate-800
                hover:border-red-500/50 
                transition-all duration-500 hover:shadow-2xl 
                hover:shadow-red-900/20 hover:-translate-y-2
                flex flex-col justify-between
              ">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-red-600/10 rounded-full blur-3xl group-hover:bg-red-600/20 transition-all"></div>

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div className="p-4 rounded-2xl bg-red-900/20 text-red-500 group-hover:scale-110 transition-transform duration-500">
                      <Icon name="Lock" size={32} />
                    </div>
                    <div className="px-3 py-1 rounded-full bg-red-900/20 text-[10px] font-bold text-red-500 uppercase tracking-widest animate-pulse">
                       Restricted
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-white mb-3 group-hover:text-red-500 transition-colors uppercase italic tracking-tight">
                    Secret Area
                  </h3>
                  
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">
                    Exclusive resources, cracked software, and premium assets. Access requires a <span className="text-white font-bold">Secret Key</span>.
                  </p>
                </div>

                <div className="relative z-10 mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                   <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 group-hover:text-red-500 transition-colors">
                      Enter Vault
                   </span>
                   <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-500 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                      <Icon name="Key" size={14} />
                   </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* MASTER ADMIN PERSONAL SPACE CARD */}
          <motion.div variants={cardVariants} className="h-full">
            <Link to="/personal-space" className="block group h-full">
              <div className="
                h-full relative overflow-hidden rounded-[2rem] p-8 
                bg-gradient-to-bl from-[#0f172a] to-black
                border border-amber-900/30
                hover:border-amber-500/50 
                transition-all duration-500 hover:shadow-2xl 
                hover:shadow-amber-900/20 hover:-translate-y-2
                flex flex-col justify-between
              ">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all"></div>

                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div className="p-4 rounded-2xl bg-amber-950/30 text-amber-500 group-hover:text-amber-400 shadow-inner border border-amber-900/50 group-hover:scale-110 transition-transform duration-500">
                      <Icon name="User" size={32} />
                    </div>
                    <div className="px-3 py-1.5 rounded-md bg-amber-950/30 border border-amber-500/30 text-[10px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1.5">
                      <Icon name="Lock" size={10} />
                      Admin Only
                    </div>
                  </div>

                  <h3 className="text-2xl font-black text-white mb-3 group-hover:text-amber-400 transition-colors uppercase italic tracking-tight">
                    Personal Space
                  </h3>
                  
                  <p className="text-sm text-slate-400 leading-relaxed font-medium">
                    Financial Command Center, Growth Plans, and Private Acquisitions. 
                    <span className="text-amber-500/80 block mt-1">Auth Required.</span>
                  </p>
                </div>

                <div className="relative z-10 mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                   <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 group-hover:text-amber-500 transition-colors">
                      Access System
                   </span>
                   <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-slate-500 group-hover:bg-amber-600 group-hover:text-black transition-all duration-300">
                      <Icon name="ArrowRight" size={14} />
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