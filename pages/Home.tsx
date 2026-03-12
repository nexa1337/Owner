
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

    {/* Moving Gradient Orbs - Optimized for mobile with lower blur and will-change */}
    <motion.div 
      animate={{ 
        x: [0, 50, -50, 0],
        y: [0, -30, 30, 0],
        scale: [1, 1.2, 0.9, 1]
      }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-blue-500/10 dark:bg-blue-500/10 rounded-full blur-[60px] md:blur-[100px] will-change-transform"
    />
    <motion.div 
      animate={{ 
        x: [0, -30, 30, 0],
        y: [0, 50, -50, 0],
        scale: [1, 1.1, 0.9, 1]
      }}
      transition={{ duration: 18, repeat: Infinity, ease: "linear", delay: 1 }}
      className="absolute bottom-[-10%] left-[-10%] w-[70vw] h-[70vw] bg-emerald-500/10 dark:bg-emerald-500/10 rounded-full blur-[60px] md:blur-[120px] will-change-transform"
    />
  </div>
);

const TypewriterText = ({ text }: { text: string }) => {
  const characters = Array.from(text);
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.04, delayChildren: 0.5 }
        }
      }}
      className="text-xs sm:text-sm lg:text-lg font-bold text-slate-500 dark:text-slate-300 max-w-lg mx-auto leading-tight"
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0, y: 10, filter: 'blur(4px)' },
            visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.div>
  );
};

const GlitchText = ({ text }: { text: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2.5, duration: 1 }}
      className="relative mt-2"
    >
      <motion.p
        className="text-[10px] sm:text-xs lg:text-sm font-black uppercase tracking-[0.2em] text-red-600/80 dark:text-red-500/80 will-change-transform"
        animate={{
          x: [0, -2, 2, 0],
          skewX: [0, 10, -10, 0]
        }}
        transition={{
          duration: 0.25,
          repeat: Infinity,
          repeatDelay: 4,
          repeatType: "mirror",
          ease: "easeInOut"
        }}
      >
        {text}
      </motion.p>
    </motion.div>
  );
};

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
         Uses fluid typography and spacing to adapt to any screen size (11" laptop to 100" TV).
         overflow-hidden ensures no scrollbars, content scales to fit.
      */}
      <div className="relative z-10 w-full h-full overflow-hidden flex items-center justify-center">
        <div className="w-full h-full flex flex-col items-center justify-center p-[2vmin]">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center justify-center w-full max-w-[90vw] 2xl:max-w-[80vw]"
          >
            {/* Wrapper to control vertical spacing distribution with fluid gaps */}
            <div className="flex flex-col items-center justify-center gap-[1.5vh] sm:gap-[2vh] md:gap-[2.5vh] lg:gap-[3vh] w-full">

              {/* Avatar Image - Scales with viewport min dimension */}
              <div className="relative shrink-0 group">
                <div className="w-[18vmin] h-[18vmin] max-w-[200px] max-h-[200px] min-w-[80px] min-h-[80px] rounded-full p-[0.5vmin] bg-gradient-to-tr from-blue-500 via-purple-500 to-emerald-500 shadow-xl shadow-blue-500/20 transition-transform duration-500 cursor-pointer group-hover:scale-105">
                  <div className="w-full h-full rounded-full overflow-hidden border-[0.4vmin] border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 relative z-10">
                    <img 
                      src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhWKQ6coKkNUWDzxWRjS9iMyXUNVpou_OhdsrVHLliGMmVUfpo9OK9a49gDg7vfVMd3UwoYbA0fuptSJd1srwiCJUdcqqnF7MjV735gK3vYrLoxVKQnIf3OjXvEeipgZvUFHKoDixfrlAYzK3iZVXVd-DlHx15I4CJLe1ubSh2lPtDwOvKCIj_yyBpGhHRi/s1050/450239522_995708745313179_970074769601186719_n.jpg" 
                      alt="Marouan Anouar"
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                </div>
                {/* Online Status */}
                <div className="absolute bottom-[5%] right-[5%] z-20 flex items-center justify-center">
                   <span className="relative flex h-[2.5vmin] w-[2.5vmin] max-h-[24px] max-w-[24px] min-h-[10px] min-w-[10px]">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-full w-full bg-green-500 border-[0.3vmin] border-white dark:border-slate-900"></span>
                   </span>
                </div>
              </div>

              {/* Typography - Fluid text sizing */}
              <div className="w-full text-center shrink-0 space-y-[1vh]">
                 <h1 className="text-[clamp(2rem,6vw,8rem)] font-black tracking-tighter text-slate-900 dark:text-white drop-shadow-sm leading-none px-2">
                   Marouan Anouar
                 </h1>
                 
                 <div className="flex flex-col items-center justify-center scale-[0.8] sm:scale-100 lg:scale-110 xl:scale-125 origin-top">
                    <TypewriterText text="I don’t follow paths. I create them." />
                    <GlitchText text="I am not to be tested." />
                 </div>
              </div>

              {/* Quick Info Pills - Fluid sizing */}
              <div className="flex flex-row flex-wrap justify-center items-center gap-[1vmin] w-full max-w-full mx-auto px-1 shrink-0">
                <InfoPill icon={TbMapPin} text="Morocco" />
                <InfoPill text={`${age} Years`} />
                <InfoPill text="Fit Life & Fast Bikes" />
                <InfoPill text="Freelance Available" active />
              </div>

              {/* Bio Text & Footer Grouped - Fluid width and text size */}
              <div className="w-full max-w-[90vw] md:max-w-[70vw] lg:max-w-[50vw] px-4 shrink-0 flex flex-col items-center gap-[2vh]">
                 <div className="text-[clamp(0.75rem,1.5vmin,1.5rem)] text-slate-600 dark:text-slate-300 font-medium text-center leading-relaxed space-y-[1vh]">
                      <p>
                        I’m an interior designer and 3D modeler specializing in architectural projects. I enjoy creating spaces that are both functional and visually stunning.
                      </p>
                      <p>
                        Beyond my professional work, I’m passionate about cybersecurity and technology, which I explore as hobbies. I also have a big love for super bikes and staying fit through regular workouts.
                      </p>
                      <p className="hidden sm:block">
                        In the future, my goal is to become a successful businessman, building both online and offline ventures. I’m always looking for ways to grow and turn my passions into opportunities.
                      </p>
                 </div>

                 {/* Modern Minimalist Footer / Status */}
                 <div className="flex flex-col items-center gap-[0.5vh] opacity-80 hover:opacity-100 transition-opacity duration-500">
                      <div className="h-[0.3vh] w-[8vw] max-w-[100px] bg-gradient-to-r from-transparent via-slate-400 dark:via-slate-600 to-transparent rounded-full"></div>
                      <p className="text-[clamp(0.5rem,1vmin,1rem)] uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400 font-bold">
                          Internet • For • Everyone
                      </p>
                 </div>
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
