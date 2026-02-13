import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TbMail } from 'react-icons/tb';
import Icon from '../components/Icon';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Just say hi!',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleWhatsAppSend = () => {
    const { name, email, subject, message } = formData;
    const whatsappMessage = `*New Contact Request via Portfolio*
    
*Name:* ${name}
*Email:* ${email}
*Subject:* ${subject}

*Message:*
${message}`;

    const phoneNumber = '212679440068';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="w-full pt-24 pb-24 px-6 max-w-6xl mx-auto">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-12"
      >
        {/* Contact Info */}
        <div className="space-y-8">
          <div>
            <h2 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">Let's Connect</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
              Whether you have a project in mind, need consultation, or just want to say hi. 
              <span className="font-semibold text-slate-900 dark:text-white"> Mr.Marouan</span> is open for business.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm">
              <div className="p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl mr-5 text-primary-600 dark:text-primary-400">
                <TbMail size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wide mb-1">Email</h4>
                <a href="mailto:lesaffaires8@gmail.com" className="text-lg text-slate-600 dark:text-slate-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors font-medium">
                  lesaffaires8@gmail.com
                </a>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
               {/* Instagram */}
               <a 
                 href="https://instagram.com/marouan_anouar" 
                 target="_blank" 
                 rel="noreferrer"
                 className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:border-pink-500 hover:shadow-md transition-all group"
               >
                  <Icon name="Instagram" size={28} className="text-slate-400 group-hover:text-pink-500 transition-colors mb-2" />
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Instagram</span>
               </a>

               {/* LinkedIn */}
               <a 
                 href="https://www.linkedin.com/in/marouananouar" 
                 target="_blank" 
                 rel="noreferrer"
                 className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:border-blue-600 hover:shadow-md transition-all group"
               >
                  <Icon name="Linkedin" size={28} className="text-slate-400 group-hover:text-blue-600 transition-colors mb-2" />
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">LinkedIn</span>
               </a>

               {/* TikTok */}
               <a 
                 href="https://tiktok.com/@marouan_anouar" 
                 target="_blank" 
                 rel="noreferrer"
                 className="flex flex-col items-center justify-center p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:border-black dark:hover:border-white hover:shadow-md transition-all group"
               >
                  <Icon name="Tiktok" size={28} className="text-slate-400 group-hover:text-black dark:group-hover:text-white transition-colors mb-2" />
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">TikTok</span>
               </a>
            </div>
          </div>
          
          {/* Map */}
          <div className="w-full h-64 md:h-80 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-lg relative bg-slate-100 dark:bg-slate-800">
             <iframe 
               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3306.484313352609!2d-6.832365123974353!3d34.03144567316487!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda76b146a4caac9%3A0xdc0f711f384b0c52!2sN%20E%20X%20A%201337%20-%20Digital%20Agency!5e0!3m2!1sfr!2sma!4v1767956581706!5m2!1sfr!2sma" 
               width="100%" 
               height="100%" 
               style={{ border: 0 }} 
               allowFullScreen 
               loading="lazy" 
               referrerPolicy="no-referrer-when-downgrade"
               title="NEXA 1337 Location"
               className="grayscale hover:grayscale-0 transition-all duration-500"
             ></iframe>
          </div>

        </div>

        {/* Contact Form */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl h-fit">
          <h3 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white">Send Message</h3>
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary-500 outline-none transition-all placeholder:text-slate-400" 
                  placeholder="Marouan anouar" 
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Email</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary-500 outline-none transition-all placeholder:text-slate-400" 
                  placeholder="lesaffaires8@gmail.com" 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Subject</label>
              <div className="relative">
                <select 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary-500 outline-none appearance-none transition-all cursor-pointer"
                >
                  <option value="Just say hi!">Just say hi!</option>
                  <option value="About N E X A 1337">About N E X A 1337</option>
                  <option value="About Architecture & 3D">About Architecture & 3D</option>
                  <option value="About Secret Area">About Secret Area</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Message</label>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5} 
                className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary-500 outline-none transition-all placeholder:text-slate-400 resize-none" 
                placeholder="How can I help you today?"
              ></textarea>
            </div>

            <button 
              type="button" 
              onClick={handleWhatsAppSend}
              className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <span>Send via WhatsApp</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1"/></svg>
            </button>
            <p className="text-center text-xs text-slate-400">
              This will open WhatsApp with your pre-filled message.
            </p>
          </form>
        </div>

      </motion.div>
    </div>
  );
};

export default Contact;