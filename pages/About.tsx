import React from 'react';
import { motion } from 'framer-motion';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import Icon from '../components/Icon';

const capabilitiesData = [
  { subject: 'Global Network', score: 95 },
  { subject: 'Data Analytics', score: 100 },
  { subject: 'Security', score: 100 },
  { subject: 'Scalability', score: 90 },
  { subject: 'Conversion', score: 95 },
  { subject: 'Infrastructure', score: 95 },
];

const uptimeData = [
  { name: 'Guaranteed Uptime', value: 99.9 },
  { name: 'Routine Maintenance', value: 0.1 },
];

const projectLifecycleData = [
  { phase: 'Discovery', effort: 20 },
  { phase: 'Design', effort: 20 },
  { phase: 'Development', effort: 35 },
  { phase: 'Testing', effort: 15 },
  { phase: 'Growth', effort: 10 },
];

const COLORS = ['#10b981', '#334155'];

const roadmapSteps = [
  {
    step: '01',
    title: 'Discovery & Strategy',
    description: 'We start by understanding your business goals, target audience, and market landscape to build a solid foundation.',
    icon: 'Search'
  },
  {
    step: '02',
    title: 'Design & Prototyping',
    description: 'Our creative team crafts intuitive, user-centric designs that align with your brand identity and vision.',
    icon: 'PenTool'
  },
  {
    step: '03',
    title: 'Development & Integration',
    description: 'We bring designs to life using cutting-edge technologies, ensuring robust performance and seamless integration.',
    icon: 'Code'
  },
  {
    step: '04',
    title: 'Testing & Launch',
    description: 'Rigorous testing ensures a bug-free experience before we deploy your solution to the world.',
    icon: 'CheckCircle'
  },
  {
    step: '05',
    title: 'Growth & Optimization',
    description: 'Post-launch, we monitor performance and optimize strategies to drive continuous growth and ROI.',
    icon: 'TrendingUp'
  }
];

const About: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pt-24 pb-20 px-4 md:px-8 max-w-7xl mx-auto"
    >
      {/* Hero Section */}
      <div className="text-center mb-16">
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight"
        >
          Empowering Digital Growth for <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-emerald-500">Modern Brands</span>
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed"
        >
          At N E X A 1337, we help brands unlock their full potential through modern technology, creative design, and performance-driven strategies.
        </motion.p>
      </div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-8 mb-20">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
        >
          <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center mb-6">
            <Icon name="Target" size={24} className="text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Our Mission</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            To transform complex challenges into simple, scalable digital solutions. We blend creativity with technology to build impactful digital experiences that help businesses grow smarter and faster.
          </p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-slate-800/50 p-8 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
        >
          <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center mb-6">
            <Icon name="Eye" size={24} className="text-primary-600 dark:text-primary-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Our Vision</h2>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            To be the global catalyst for digital innovation, connecting brands with world-class expertise and data-driven strategies that ensure sustainable growth in an ever-evolving digital landscape.
          </p>
        </motion.div>
      </div>

      {/* Data-Driven Insights (Charts) */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12 text-center">Why Choose N E X A 1337</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Core Capabilities Radar */}
          <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 text-center">Core Capabilities</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-4">Global Network & Data-Driven Growth</p>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={capabilitiesData}>
                  <PolarGrid stroke="#64748b" opacity={0.3} />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                  <Radar name="N E X A 1337" dataKey="score" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.5} />
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Uptime Guarantee Pie */}
          <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 text-center">Secure & Reliable</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-4">Enterprise-grade hosting & encryption</p>
            <div className="h-[250px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={uptimeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {uptimeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">99.9%</span>
              </div>
            </div>
          </div>

          {/* Project Lifecycle Bar */}
          <div className="bg-white dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col items-center">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 text-center">Project Effort Distribution</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-4">From discovery to continuous growth</p>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectLifecycleData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} vertical={false} />
                  <XAxis dataKey="phase" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `${val}%`} />
                  <Tooltip 
                    cursor={{ fill: '#334155', opacity: 0.1 }}
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#f8fafc' }}
                    formatter={(value) => [`${value}%`, 'Effort']}
                  />
                  <Bar dataKey="effort" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                    {projectLifecycleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 2 ? '#8b5cf6' : '#3b82f6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Our Network Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">Our Network</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {[
            { name: 'N E X A 1337', url: 'https://nexa1337.github.io/nexa1337', clicks: '342,150', icon: 'Globe' },
            { name: 'N E X A 1337 - Portfolio', url: 'https://nexa1337.github.io/Owner', clicks: '128,400', icon: 'Briefcase' },
            { name: 'N E X A 1337 - Tool', url: 'https://nexa1337.github.io/tool', clicks: '215,890', icon: 'Wrench' },
            { name: 'N E X A 1337 - Digital Store', url: 'https://nexa1337.github.io/digitalstore', clicks: '310,200', icon: 'ShoppingCart' },
          ].map((link, idx) => (
            <motion.a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="flex flex-row items-center justify-between bg-white dark:bg-slate-800/50 p-4 md:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all hover:border-primary-500 group"
            >
              <div className="flex items-center gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 shrink-0 bg-primary-50 dark:bg-primary-900/20 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform">
                  <Icon name={link.icon as any} size={20} className="md:w-6 md:h-6" />
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary-500 transition-colors line-clamp-1">{link.name}</h3>
                </div>
              </div>
              <div className="text-right shrink-0 ml-2">
                <div className="flex items-center justify-end gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-sm md:text-base">
                  <Icon name="TrendingUp" size={14} />
                  <span>{link.clicks}</span>
                </div>
                <span className="text-[10px] md:text-xs text-slate-500 dark:text-slate-400 uppercase tracking-wider">Clicks</span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>

      {/* Roadmap Section */}
      <div className="px-4 md:px-0">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12 text-center">Our Roadmap to Success</h2>
        <div className="relative max-w-4xl mx-auto">
          {/* Vertical Line - Hidden on very small screens, aligned left on mobile, centered on md+ */}
          <div className="absolute left-[28px] md:left-1/2 top-0 bottom-0 w-1 bg-slate-200 dark:bg-slate-700 transform md:-translate-x-1/2 rounded-full hidden sm:block"></div>
          
          <div className="space-y-8 sm:space-y-12">
            {roadmapSteps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`relative flex flex-col sm:flex-row items-start ${idx % 2 === 0 ? 'sm:flex-row-reverse' : ''}`}
              >
                {/* Timeline Dot - Hidden on very small screens, aligned left on mobile, centered on md+ */}
                <div className="hidden sm:flex absolute left-[28px] md:left-1/2 w-12 h-12 rounded-full bg-white dark:bg-slate-900 border-4 border-primary-500 transform -translate-x-1/2 items-center justify-center z-10 shadow-md">
                  <span className="text-primary-600 dark:text-primary-400 font-bold text-sm">{step.step}</span>
                </div>
                
                {/* Content */}
                <div className={`w-full sm:w-1/2 sm:pl-[70px] md:pl-0 ${idx % 2 === 0 ? 'md:pl-12' : 'md:pr-12 text-left md:text-right'}`}>
                  <div className="bg-white dark:bg-slate-800/50 p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    {/* Mobile Step Indicator (Visible only on very small screens) */}
                    <div className="sm:hidden absolute top-0 right-0 bg-primary-500 text-white px-3 py-1 rounded-bl-xl font-bold text-xs">
                      Step {step.step}
                    </div>
                    
                    <div className={`flex items-center gap-3 mb-3 ${idx % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                      <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center shrink-0">
                        <Icon name={step.icon as any} size={20} className="text-primary-600 dark:text-primary-400" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">{step.title}</h3>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm sm:text-base">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

    </motion.div>
  );
};

export default About;
