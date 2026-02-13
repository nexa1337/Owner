
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { TbMapPin, TbArrowRight } from 'react-icons/tb';

const Background = () => (
  <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
    {/* Base Gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-500"></div>
    
    {/* Animated Grid Pattern */}
    <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
         style={{ 
           backgroundImage: 'linear-gradient(#64748b 1px, transparent 1px), linear-gradient(to right, #64748b 1px, transparent 1px)', 
           backgroundSize: '40px 40px' 
         }}>
    </div>

    {/* Moving Gradient Orbs */}
    <motion.div 
      animate={{ 
        x: [0, 50, -50, 0],
        y: [0, -30, 30, 0],
        scale: [1, 1.2, 0.9, 1]
      }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-blue-500/10 dark:bg-blue-500/10 rounded-full blur-[100px]"
    />
    <motion.div 
      animate={{ 
        x: [0, -30, 30, 0],
        y: [0, 50, -50, 0],
        scale: [1, 1.1, 0.9, 1]
      }}
      transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: 1 }}
      className="absolute bottom-[-10%] left-[-10%] w-[70vw] h-[70vw] bg-emerald-500/10 dark:bg-emerald-500/10 rounded-full blur-[120px]"
    />
  </div>
);

const Home: React.FC = () => {
  // Calculate age automatically
  const age = useMemo(() => {
    const birthDate = new Date(1997, 9, 19); // Month is 0-indexed (9 = October)
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
    }
    return calculatedAge;
  }, []);

  return (
    // Outer Container
    <div className="relative w-full h-[100dvh] bg-slate-50 dark:bg-slate-950 font-sans overflow-hidden">
      <Background />
      
      {/* 
         Main Content Area
         overflow-y-auto + no-scrollbar allows scrolling if content is too tall for small screens,
         but hides the scrollbar to maintain the clean 'hero' aesthetic.
      */}
      <div className="relative z-10 w-full h-full overflow-y-auto no-scrollbar">
        {/* 
           Layout Container:
           - pt-20: Mobile top padding (below header)
           - md:pt-24: Laptop/Desktop top padding (reduced from 32 to ensure fit without scroll)
           - md:pb-0: No bottom padding needed on desktop (no bottom nav)
           - min-h-full: Ensures vertical centering works
        */}
        <div className="min-h-full flex flex-col items-center justify-center pt-20 pb-24 md:pt-24 md:pb-0">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center w-full max-w-5xl px-4"
          >
            {/* Wrapper to control vertical spacing distribution */}
            <div className="flex flex-col items-center justify-center gap-3 sm:gap-6 md:gap-6 lg:gap-10 w-full">

              {/* Avatar Image */}
              <div className="relative shrink-0 group">
                <div className="w-20 h-20 sm:w-32 sm:h-32 lg:w-44 lg:h-44 rounded-full p-[3px] sm:p-[4px] bg-gradient-to-tr from-blue-500 via-purple-500 to-emerald-500 shadow-xl shadow-blue-500/20 transition-transform duration-500 cursor-pointer group-hover:scale-105">
                  <div className="w-full h-full rounded-full overflow-hidden border-[2px] sm:border-[4px] border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 relative z-10">
                    <img 
                      src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhWKQ6coKkNUWDzxWRjS9iMyXUNVpou_OhdsrVHLliGMmVUfpo9OK9a49gDg7vfVMd3UwoYbA0fuptSJd1srwiCJUdcqqnF7MjV735gK3vYrLoxVKQnIf3OjXvEeipgZvUFHKoDixfrlAYzK3iZVXVd-DlHx15I4CJLe1ubSh2lPtDwOvKCIj_yyBpGhHRi/s1050/450239522_995708745313179_970074769601186719_n.jpg" 
                      alt="Marouan Anouar"
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                </div>
                {/* Online Status */}
                <div className="absolute bottom-[5%] right-[5%] z-20 flex items-center justify-center">
                   <span className="relative flex h-3 w-3 sm:h-5 sm:w-5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 sm:h-5 sm:w-5 bg-green-500 border-[2px] sm:border-[3px] border-white dark:border-slate-900"></span>
                   </span>
                </div>
              </div>

              {/* Typography */}
              <div className="w-full text-center shrink-0">
                 <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black tracking-tighter text-slate-900 dark:text-white drop-shadow-sm leading-none px-2 mb-1 sm:mb-4">
                   Marouan Anouar
                 </h1>
                 
                 <motion.p 
                   animate={{ opacity: [0.6, 1, 0.6], textShadow: ["0px 0px 5px rgba(255,255,255,0)", "0px 0px 15px rgba(56, 189, 248, 0.5)", "0px 0px 5px rgba(255,255,255,0)"] }}
                   transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                   className="text-sm sm:text-xl lg:text-2xl font-bold text-slate-500 dark:text-slate-300 max-w-lg mx-auto leading-tight"
                 >
                   Own path, own rules.
                 </motion.p>
              </div>

              {/* Quick Info Pills - Single Line & Small */}
              <div className="flex flex-row flex-nowrap justify-center items-center gap-1.5 sm:gap-3 w-full max-w-full mx-auto px-1 shrink-0 overflow-hidden">
                <InfoPill icon={TbMapPin} text="Morocco" />
                <InfoPill text={`${age} Years`} />
                <InfoPill text="Fit Life & Fast Bikes" />
                <InfoPill text="Freelance Available" active />
              </div>

              {/* Bio Text - FULL CONTENT VISIBLE */}
              <div className="w-full max-w-lg sm:max-w-2xl lg:max-w-4xl px-4 shrink-0">
                 <div className="text-[11px] sm:text-sm md:text-base lg:text-lg text-slate-600 dark:text-slate-300 font-medium text-center leading-relaxed space-y-2">
                      <p>
                        I’m an interior designer and 3D modeler specializing in architectural projects. I enjoy creating spaces that are both functional and visually stunning.
                      </p>
                      <p>
                        Beyond my professional work, I’m passionate about cybersecurity and technology, which I explore as hobbies. I also have a big love for super bikes and staying fit through regular workouts.
                      </p>
                      <p>
                        In the future, my goal is to become a successful businessman, building both online and offline ventures. I’m always looking for ways to grow and turn my passions into opportunities.
                      </p>
                 </div>
              </div>
              
              {/* ACTIONS */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto shrink-0">
                 <Link 
                   to="/roadmap" 
                   className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold text-xs sm:text-base shadow-lg shadow-slate-900/20 dark:shadow-white/10 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
                 >
                   Explore Roadmap <TbArrowRight size={16} />
                 </Link>
                 <Link 
                   to="/contact" 
                   className="w-full sm:w-auto px-6 py-3 sm:px-8 sm:py-3.5 bg-white/60 dark:bg-slate-800/60 backdrop-blur-md text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-full font-bold text-xs sm:text-base hover:bg-white dark:hover:bg-slate-700 transition-colors text-center"
                 >
                   Contact Me
                 </Link>
              </div>

            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// InfoPill Component
const InfoPill: React.FC<{ icon?: any, text: string, active?: boolean }> = ({ icon: Icon, text, active }) => (
  <div className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[9px] sm:text-xs font-semibold backdrop-blur-md border flex items-center gap-1 transition-colors cursor-default whitespace-nowrap shadow-sm ${
    active 
      ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' 
      : 'bg-white/70 dark:bg-slate-800/70 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'
  }`}>
    {Icon && <Icon size={10} className="sm:w-3.5 sm:h-3.5" />}
    {text}
  </div>
);

export default Home;
