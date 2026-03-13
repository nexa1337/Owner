
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { GoogleGenAI } from "@google/genai";
import Icon from '../components/Icon';

// --- CONFIGURATION ---
const API_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxbQKmoUUH4KzLmkAYZMGpoORPDTFYTzqCpnScEFIw5ngQ1cgzvFWU5fq0OXe2M5Ref/exec';
const DISCORD_LINK = 'https://discord.gg/MgqvMyZv2b';
const INSTAGRAM_LINK = 'https://instagram.com/nexa1337';
const ITEMS_PER_PAGE = 12; // Show 12 items per page for laptop grid (4x3)

// --- ADVERTISEMENT CONFIGURATION ---
const AD_CONFIG = {
  top: {
    desktop: "https://blogger.googleusercontent.com/img/a/AVvXsEjvKO51qmORWNQeRzbG0U66BuGMMlWmMsA344VdhJ8V3JcioC2XrW66Z3kGy4HQMsosM0LgGjCkVJ8NpZ1VIqQIz-mCNWf2jiDCevjoyxhPdqA6XP2XHfgLGCu8RoW85ZbirIllNSaBFZtKZ6z3-HWvKg8LZQxSlaU80PE4nVwUPB9b4feyPJjzjDMUZhVF",
    mobile: "https://blogger.googleusercontent.com/img/a/AVvXsEgUaBQ0XP17B2aUVnkbJxWXVg3PUDIKYDs4Q9t3mRsX79mhAPZkJGnPjvyeROac9NZW7MzYsiewRFgiaMbyPVz2dnwl--o6W0IPd95E-r-KWxmPCTtHVIpyXPfu4DdvTzW5wtGZk3ks4TwTK0TBxqOZgGl5eCoALki-Zuz-YEhFXcxsVXK-F1cHpVOy5CCz",
    link: "https://nexa1337.github.io/digitalstore"
  },
  bottom: {
    desktop: "https://blogger.googleusercontent.com/img/a/AVvXsEg0zMrZ22tyGW-aXpu2FAjvrfTlqRz699E3AMMRvV1z26qjt1QZTk45h6pPUhWEzmBW-AmKnKGnEg8qanKwtoP76u8qxQoXjCb91OBqZbQLsr4zRM9WUpBr9w5iGZL668__-C8S7LDj-0nfljMmyL9NLQuKMYsCwPcjtfqbuHF8sbOsKoeyNC-kkXOQ5wnl",
    mobile: "https://blogger.googleusercontent.com/img/a/AVvXsEi0u1ifLrSsflsFEpWVx9dHUucni_Pl7E4tuja5EHi9N313U8_qnfQXUzQit8tTwoM2z5B3yINT7zCfJAtDj-LnPHWiWe2GgHcZK1Xf7B7y6LzuvhAq5Vx9J-ZMY0ul_YBGqG31lvztFU3keoib7OrzYw5DlfIhpkSjPySH4xy3R2_4NL6pbcN_zAGHK6Wg",
    link: "https://linktr.ee/nexa1337"
  }
};

// --- DISCLAIMER DATA ---
interface DisclaimerData {
  label: string;
  title: string;
  text: string;
  btn: string;
  dir?: string;
}

const DISCLAIMER_CONTENT: Record<string, DisclaimerData> = {
  EN: {
    label: "English",
    title: "⚠️ Disclaimer",
    text: "All content shared on this website is already publicly available on the internet.\nWe do not host, modify, or crack any files. We only organize and share existing public links.\n\nWe strongly encourage users to purchase original software and games to support developers.\nThe user is solely responsible for how the content is used.",
    btn: "I Understand"
  },
  AR: {
    label: "العربية",
    title: "⚠️ تنبيه قانوني",
    text: "جميع المحتويات الموجودة في هذا الموقع متوفرة مسبقًا على الإنترنت بشكل علني.\nنحن لا نستضيف الملفات ولا نقوم بتعديلها أو كسر حمايتها، بل نشارك فقط روابط عامة.\n\nننصح المستخدمين بشراء النسخ الأصلية لدعم المطورين.\nالمسؤولية الكاملة تقع على عاتق المستخدم.",
    btn: "أنا أفهم",
    dir: "rtl"
  },
  FR: {
    label: "Français",
    title: "⚠️ Avertissement",
    text: "Tout le contenu présent sur ce site est déjà disponible publiquement sur Internet.\nNous n’hébergeons, ne modifions ni ne crackons aucun fichier. Nous partageons uniquement des liens publics.\n\nNous encourageons fortement l’achat des versions originales pour soutenir les développeurs.\nL’utilisateur est seul responsable de l’utilisation du contenu.",
    btn: "Je comprends"
  },
  ES: {
    label: "Español",
    title: "⚠️ Aviso legal",
    text: "Todo el contenido de este sitio ya está disponible públicamente en Internet.\nNo alojamos, modificamos ni crackeamos archivos. Solo compartimos enlaces públicos.\n\nRecomendamos comprar las versions originales para apoyar a los desarrolladores.\nEl usuario es totalmente responsable del uso del contenido.",
    btn: "Entiendo"
  },
  RU: {
    label: "Русский",
    title: "⚠️ Отказ от ответственности",
    text: "Весь контент на этом сайте уже находится в открытом доступе в интернете.\nМы не размещаем, не изменяем и не взламываем файлы. Мы лишь делимся публичными ссылками.\n\nМы рекомендуем приобретать оригинальные версии для поддержки разработчиков.\nПользователь несёт полную ответственность за использование контента.",
    btn: "Я понимаю"
  }
};

// --- TYPES ---
interface Requirement {
  label: string;
  value: string;
  icon: string;
  link?: string;
}

interface ResourceItem {
  id: string;
  category: string;
  name: string;
  version: string;
  repackSize: string;
  originalSize: string;
  genres: string;
  languages: string;
  repackBy: string;
  coverImage: string;
  galleryImages: string[];
  description: string;
  gameId?: string;
  ratingPositive?: string;
  ratingNegative?: string;
  hasDenuvo?: boolean;
  hasExternalLauncher?: boolean;
  systemReqs: Requirement[];
  installSteps: string[];
  isPinned: boolean;
  isFree: boolean;
  toolsNeeded: { name: string; url: string }[];
  links: {
    parts: { id: number, link: string, note?: string }[];
    mirrors: { id: number, link: string, note?: string }[];
    full?: string;
    fullNote?: string;
    tutorial?: string; 
    dlc?: string;
    trailer?: string;
  };
}

interface UpcomingGame {
  id: string;
  title: string;
  image: string;
  platform: string;
  price: string;
  icon: string;
}

interface SteamAccount {
    username: string;
    password: string;
    games: string;
    status: string;
}

// --- HELPER FUNCTIONS ---
const getYoutubeEmbedUrl = (url: string) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}?autoplay=1&rel=0` : url;
};

const formatPlatformDisplay = (platform: string) => {
    if (!platform) return '';
    return platform.replace(/,/g, ' •').toUpperCase();
};

const getPlatformIcon = (platform: string): string => {
    if (!platform) return 'Gamepad2';
    const p = platform.toLowerCase();
    if (p.includes('ps5') || p.includes('playstation')) return 'BrandPlaystation';
    if (p.includes('xbox')) return 'BrandXbox';
    if (p.includes('steam') || p.includes('pc')) return 'BrandSteam';
    if (p.includes('switch') || p.includes('nintendo')) return 'Gamepad';
    return 'Gamepad2';
};

// --- COMPONENTS ---

// Countdown Component for Lockout
const LockoutTimer: React.FC<{ targetTime: number }> = ({ targetTime }) => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const updateTimer = () => {
            const now = Date.now();
            const diff = targetTime - now;
            
            if (diff <= 0) {
                setTimeLeft('00:00:00');
                return;
            }

            const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const m = Math.floor((diff / (1000 * 60)) % 60);
            const s = Math.floor((diff / 1000) % 60);

            setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [targetTime]);

    return (
        <span className="font-mono text-xl font-black text-red-500">{timeLeft}</span>
    );
};

const DisclaimerModal: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const [lang, setLang] = useState<keyof typeof DISCLAIMER_CONTENT>('EN');
  
  if (!open) return null;

  const content = DISCLAIMER_CONTENT[lang];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-red-500/30 flex flex-col max-h-[90vh]"
      >
        <div className="bg-slate-100 dark:bg-slate-950 p-4 border-b border-slate-200 dark:border-slate-800">
           <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
              {(Object.keys(DISCLAIMER_CONTENT) as Array<keyof typeof DISCLAIMER_CONTENT>).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                    lang === l 
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' 
                    : 'bg-white dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  {DISCLAIMER_CONTENT[l].label}
                </button>
              ))}
           </div>
        </div>
        <div className="p-6 md:p-8 flex-1 overflow-y-auto">
           <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-2">
                 <Icon name="Shield" size={32} className="text-red-500" />
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight" dir={content.dir || 'ltr'}>
                {content.title}
              </h2>
              <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-medium whitespace-pre-line" dir={content.dir || 'ltr'}>
                {content.text}
              </p>
           </div>
        </div>
        <div className="p-4 md:p-6 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
           <button 
             onClick={onClose}
             className="w-full py-4 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-red-500/20 transition-all active:scale-95"
           >
             {content.btn}
           </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// STEAM ACCOUNTS MODAL
const SteamAccountsModal: React.FC<{ open: boolean; onClose: () => void; accounts: SteamAccount[] }> = ({ open, onClose, accounts }) => {
    const [copiedIndex, setCopiedIndex] = useState<{idx: number, type: 'user' | 'pass'} | null>(null);

    if (!open) return null;

    const handleCopy = (text: string, idx: number, type: 'user' | 'pass') => {
        navigator.clipboard.writeText(text);
        setCopiedIndex({ idx, type });
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4"
            onClick={onClose}
        >
            <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-[#171a21] dark:bg-[#171a21] bg-white w-[95%] md:w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-[#2a475e] dark:border-[#2a475e] border-slate-200 flex flex-col max-h-[85vh] sm:max-h-[85vh]"
                onClick={e => e.stopPropagation()}
            >
                {/* Steam Header */}
                <div className="bg-gradient-to-r from-[#171a21] to-[#1b2838] p-4 sm:p-6 border-b border-[#2a475e] flex justify-between items-center relative overflow-hidden shrink-0">
                    <div className="absolute inset-0 bg-[url('https://community.cloudflare.steamstatic.com/public/shared/images/header/globalheader_logo.png')] bg-no-repeat bg-right-bottom opacity-10 bg-contain pointer-events-none"></div>
                    <div className="relative z-10">
                        <h3 className="text-lg sm:text-xl font-black uppercase tracking-wider text-white flex items-center gap-3">
                            <Icon name="BrandSteam" size={24} className="text-[#66c0f4] sm:w-7 sm:h-7" /> 
                            <span className="truncate">Free Accounts</span>
                        </h3>
                        <p className="text-[#c5c3c0] text-[10px] sm:text-xs font-bold mt-1">
                            Updated Daily • <span className="text-[#66c0f4]">{accounts.length} Available</span>
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-[#c5c3c0] hover:text-white relative z-10 shrink-0">
                        <Icon name="X" size={20} className="sm:w-6 sm:h-6" />
                    </button>
                </div>
                
                {/* List */}
                <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 custom-scrollbar bg-slate-50 dark:bg-[#171a21]">
                    {accounts.length === 0 ? (
                        <div className="text-center py-10 text-slate-500">
                            <Icon name="Ghost" size={40} className="mx-auto mb-3 opacity-50"/>
                            <p>No accounts available right now. Check back later!</p>
                        </div>
                    ) : (
                        accounts.map((acc, idx) => {
                            const statusRaw = acc.status?.toString().trim();
                            const isOffline = statusRaw.toLowerCase() === 'offline';
                            return (
                                <div key={idx} className="bg-white dark:bg-[#1b2838] border border-slate-200 dark:border-[#2a475e] rounded-xl p-4 sm:p-5 hover:border-[#66c0f4] transition-colors group shadow-lg relative">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-[#2a475e] dark:to-[#171a21] rounded-full flex items-center justify-center text-[#66c0f4] font-bold text-xs sm:text-sm">
                                                {idx + 1}
                                            </div>
                                        </div>
                                        {/* Status Badge */}
                                        <div className={`text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider border ${
                                            isOffline 
                                            ? 'bg-red-500/10 text-red-500 dark:text-red-400 border-red-500/20' 
                                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                                        }`}>
                                            {statusRaw || 'ONLINE'}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-4">
                                        <div className="space-y-1">
                                            <label className="text-[9px] sm:text-[10px] font-bold text-slate-500 dark:text-[#8f98a0] uppercase tracking-wider">Username</label>
                                            <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#171a21] p-2 rounded border border-slate-200 dark:border-[#2a475e] group-hover:border-[#66c0f4]/50 transition-colors">
                                                <span className="text-xs sm:text-sm font-mono text-slate-900 dark:text-white truncate flex-1 select-all">{acc.username}</span>
                                                <button 
                                                    onClick={() => handleCopy(acc.username, idx, 'user')}
                                                    className="text-[#66c0f4] hover:text-blue-600 dark:hover:text-white p-1.5 rounded hover:bg-[#66c0f4]/20 transition-all shrink-0"
                                                    title="Copy Username"
                                                >
                                                    {copiedIndex?.idx === idx && copiedIndex.type === 'user' ? <Icon name="Check" size={14} className="text-emerald-500 dark:text-emerald-400" /> : <Icon name="Copy" size={14} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[9px] sm:text-[10px] font-bold text-slate-500 dark:text-[#8f98a0] uppercase tracking-wider">Password</label>
                                            <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#171a21] p-2 rounded border border-slate-200 dark:border-[#2a475e] group-hover:border-[#66c0f4]/50 transition-colors">
                                                <span className="text-xs sm:text-sm font-mono text-slate-900 dark:text-white truncate flex-1 select-all">{acc.password}</span>
                                                <button 
                                                    onClick={() => handleCopy(acc.password, idx, 'pass')}
                                                    className="text-[#66c0f4] hover:text-blue-600 dark:hover:text-white p-1.5 rounded hover:bg-[#66c0f4]/20 transition-all shrink-0"
                                                    title="Copy Password"
                                                >
                                                    {copiedIndex?.idx === idx && copiedIndex.type === 'pass' ? <Icon name="Check" size={14} className="text-emerald-500 dark:text-emerald-400" /> : <Icon name="Copy" size={14} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {acc.games && (
                                        <div className="pt-3 border-t border-slate-100 dark:border-[#2a475e]/50">
                                            <div className="flex items-start gap-2">
                                                <Icon name="DeviceGamepad2" size={16} className="text-slate-400 dark:text-[#8f98a0] mt-0.5 shrink-0" />
                                                <p className="text-[10px] sm:text-xs text-slate-600 dark:text-[#c5c3c0] leading-relaxed line-clamp-2 sm:line-clamp-none">
                                                    <span className="text-slate-500 dark:text-[#8f98a0] font-bold">Includes: </span>
                                                    {acc.games}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
                
                <div className="p-3 sm:p-4 bg-slate-100 dark:bg-[#171a21] border-t border-slate-200 dark:border-[#2a475e] text-center shrink-0">
                    <p className="text-[9px] sm:text-[10px] text-slate-500 dark:text-[#8f98a0]">
                        Please do not change passwords. These are community accounts.
                    </p>
                </div>
            </motion.div>
        </motion.div>
    );
};

// REQUEST MODAL
const RequestModal: React.FC<{ open: boolean; onClose: () => void; onSubmit: (data: any) => Promise<void>; initialTitle?: string }> = ({ open, onClose, onSubmit, initialTitle = '' }) => {
    const [formData, setFormData] = useState({ title: initialTitle, category: 'Game', image: '', message: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open) {
            setFormData(prev => ({ ...prev, title: initialTitle }));
        }
    }, [open, initialTitle]);

    if (!open) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await onSubmit(formData);
        setLoading(false);
        setFormData({ title: '', category: 'Game', image: '', message: '' });
        onClose();
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
        >
            <motion.div 
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 w-[95%] sm:w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-blue-500/30 flex flex-col max-h-[90vh]"
            >
                <div className="bg-slate-50 dark:bg-slate-950 p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center shrink-0">
                    <h3 className="text-lg font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
                        <Icon name="Plus" size={20} className="text-blue-500" /> Request Item
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <Icon name="X" size={18} />
                    </button>
                </div>
                
                <div className="overflow-y-auto p-6 space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Item Title *</label>
                            <input 
                                type="text" 
                                required 
                                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
                                placeholder="e.g. Call of Duty: Black Ops 6"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Section</label>
                            <select 
                                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
                                value={formData.category}
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                            >
                                <option value="Game">Game</option>
                                <option value="SteamTools">SteamTools</option>
                                <option value="Architect">Architect</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Image URL (Optional)</label>
                            <input 
                                type="url" 
                                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors"
                                placeholder="https://..."
                                value={formData.image}
                                onChange={(e) => setFormData({...formData, image: e.target.value})}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1">Message to Admin (Optional)</label>
                            <textarea 
                                rows={3}
                                className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors resize-none"
                                placeholder="Any specific version or details?"
                                value={formData.message}
                                onChange={(e) => setFormData({...formData, message: e.target.value})}
                            ></textarea>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-4 mt-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? <Icon name="Loader" size={18} className="animate-spin" /> : <Icon name="Send" size={18} />}
                            {loading ? 'Transmitting...' : 'Send Request'}
                        </button>
                    </form>
                </div>
            </motion.div>
        </motion.div>
    );
};

const AdBanner: React.FC<{ desktopSrc: string, mobileSrc: string, link: string, className?: string }> = ({ desktopSrc, mobileSrc, link, className }) => (
  <a href={link} target="_blank" rel="noreferrer" className={`block w-full group overflow-hidden ${className}`}>
    <div className="block md:hidden w-full flex justify-center">
        <img src={mobileSrc} alt="Sponsored" className="w-full max-w-[350px] h-auto rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 hover:opacity-95 transition-opacity" />
    </div>
    <div className="hidden md:flex w-full justify-center">
        <img src={desktopSrc} alt="Sponsored" className="w-full max-w-[970px] h-auto rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 hover:opacity-95 transition-opacity" />
    </div>
  </a>
);

const GameCarousel: React.FC<{ games: UpcomingGame[], loading: boolean, errorState: { missing: boolean, script: boolean } }> = ({ games, loading, errorState }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(5);
    const [isHovered, setIsHovered] = useState(false);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    useEffect(() => {
        setCurrentIndex(0);
    }, [games]);

    useEffect(() => {
        const handleResize = () => {
            const w = window.innerWidth;
            if (w < 640) setItemsPerView(1.2); 
            else if (w < 768) setItemsPerView(2.2); 
            else if (w < 1024) setItemsPerView(3.2); 
            else if (w < 1280) setItemsPerView(4.2); 
            else setItemsPerView(5); 
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (isHovered || games.length === 0 || errorState.missing || errorState.script) return;
        const interval = setInterval(() => {
            handleNext();
        }, 3000);
        return () => clearInterval(interval);
    }, [currentIndex, isHovered, games.length, itemsPerView, errorState]);

    const handleNext = () => {
        setCurrentIndex((prev) => {
            const maxIndex = games.length - Math.floor(itemsPerView);
            return prev >= maxIndex ? 0 : prev + 1;
        });
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => {
            const maxIndex = games.length - Math.floor(itemsPerView);
            return prev <= 0 ? maxIndex : prev - 1;
        });
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (touchStartX.current - touchEndX.current > 50) handleNext();
        if (touchStartX.current - touchEndX.current < -50) handlePrev();
    };

    if (errorState.missing || errorState.script) {
        return (
            <div className="w-full h-40 flex flex-col items-center justify-center bg-red-50 dark:bg-red-900/10 text-red-500 rounded-2xl border border-red-200 dark:border-red-900/30">
                <Icon name="Bug" size={32} className="mb-2" />
                <span className="text-xs font-bold uppercase tracking-widest">{errorState.script ? "Script Error" : "Backend Mismatch"}</span>
                <span className="text-[10px] mt-1 opacity-70">{errorState.script ? "Invalid API response." : "'upcoming' tab not found."}</span>
            </div>
        );
    }

    if (loading && games.length === 0) {
        return (
            <div className="w-full h-40 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 text-slate-400 rounded-2xl">
                <Icon name="Database" size={32} className="mb-2 opacity-50 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest">Syncing Data...</span>
            </div>
        );
    }

    if (games.length === 0) {
        return (
            <div className="w-full h-40 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 text-slate-400 rounded-2xl">
                <Icon name="Ghost" size={32} className="mb-2 opacity-50" />
                <span className="text-xs font-bold uppercase tracking-widest">No Upcoming Games Found</span>
            </div>
        );
    }

    return (
        <div 
            className="relative w-full group select-none"
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                <motion.div 
                    className="flex"
                    animate={{ x: `-${currentIndex * (100 / itemsPerView)}%` }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                    {games.map((game) => (
                        <div 
                            key={game.id}
                            style={{ width: `${100 / itemsPerView}%` }}
                            className="flex-shrink-0 p-1"
                        >
                            <div className="relative aspect-[3/4] bg-slate-200 dark:bg-slate-900 rounded-xl overflow-hidden group/card shadow-sm hover:shadow-lg transition-all duration-300">
                                <img 
                                    src={game.image} 
                                    alt={game.title} 
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover/card:opacity-90 transition-opacity"></div>
                                <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
                                    <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/20 backdrop-blur-md border border-white/10 mb-1.5 max-w-full">
                                        <Icon name={game.icon} size={10} className="text-white shrink-0" />
                                        <span className="text-[8px] font-bold text-white uppercase tracking-wider truncate">
                                            {formatPlatformDisplay(game.platform)}
                                        </span>
                                    </div>
                                    <h3 className="font-black text-xs md:text-sm text-white leading-tight line-clamp-2 drop-shadow-md group-hover/card:text-primary-400 transition-colors">
                                        {game.title}
                                    </h3>
                                    <div className="mt-1 flex justify-between items-center">
                                        <span className="font-mono font-bold text-emerald-400 text-[10px] drop-shadow-md bg-black/40 px-1.5 rounded">
                                            {game.price}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 left-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
                <button onClick={handlePrev} className="p-2 rounded-full bg-white/90 dark:bg-black/90 text-slate-900 dark:text-white shadow-lg hover:scale-110 transition-transform">
                    <Icon name="ChevronLeft" size={20} />
                </button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
                <button onClick={handleNext} className="p-2 rounded-full bg-white/90 dark:bg-black/90 text-slate-900 dark:text-white shadow-lg hover:scale-110 transition-transform">
                    <Icon name="ChevronRight" size={20} />
                </button>
            </div>
        </div>
    );
};

const RecentProductsCarousel: React.FC<{ items: ResourceItem[], loading: boolean, onSelect: (item: ResourceItem) => void }> = ({ items, loading, onSelect }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemsPerView, setItemsPerView] = useState(5);
    const [isHovered, setIsHovered] = useState(false);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    useEffect(() => {
        setCurrentIndex(0);
    }, [items]);

    useEffect(() => {
        const handleResize = () => {
            const w = window.innerWidth;
            if (w < 640) setItemsPerView(1.2); 
            else if (w < 768) setItemsPerView(2.2); 
            else if (w < 1024) setItemsPerView(3.2); 
            else if (w < 1280) setItemsPerView(4.2); 
            else setItemsPerView(5); 
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (isHovered || items.length === 0) return;
        const interval = setInterval(() => {
            handleNext();
        }, 3000);
        return () => clearInterval(interval);
    }, [currentIndex, isHovered, items.length, itemsPerView]);

    const handleNext = () => {
        setCurrentIndex((prev) => {
            const maxIndex = items.length - Math.floor(itemsPerView);
            return prev >= maxIndex ? 0 : prev + 1;
        });
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => {
            const maxIndex = items.length - Math.floor(itemsPerView);
            return prev <= 0 ? maxIndex : prev - 1;
        });
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const handleTouchEnd = () => {
        if (touchStartX.current - touchEndX.current > 50) handleNext();
        if (touchStartX.current - touchEndX.current < -50) handlePrev();
    };

    if (loading && items.length === 0) {
        return (
            <div className="w-full h-40 flex flex-col items-center justify-center bg-slate-100 dark:bg-slate-900 text-slate-400 rounded-2xl">
                <Icon name="Database" size={32} className="mb-2 opacity-50 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest">Loading Recent Products...</span>
            </div>
        );
    }

    if (items.length === 0) {
        return null;
    }

    return (
        <div 
            className="relative w-full group select-none"
            onMouseEnter={() => setIsHovered(true)} 
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        >
            <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950">
                <motion.div 
                    className="flex"
                    animate={{ x: `-${currentIndex * (100 / itemsPerView)}%` }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                    {items.map((item, idx) => (
                        <div 
                            key={`${item.id}-${idx}`}
                            style={{ width: `${100 / itemsPerView}%` }}
                            className="flex-shrink-0 p-1"
                        >
                            <div 
                                onClick={() => onSelect(item)}
                                className="relative aspect-[3/4] bg-slate-200 dark:bg-slate-900 rounded-xl overflow-hidden group/card shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                            >
                                <img 
                                    src={item.coverImage} 
                                    alt={item.name} 
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover/card:opacity-90 transition-opacity"></div>
                                
                                {item.isFree && (
                                    <div className="absolute top-2 right-2 px-2 py-1 bg-emerald-500 text-white rounded-md text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1 z-20">
                                        <Icon name="Tag" size={10} /> Free
                                    </div>
                                )}
                                <div className="absolute top-2 left-2 px-2 py-1 bg-primary-600 text-white rounded-md text-[10px] font-black uppercase tracking-wider shadow-lg z-20">
                                    {item.category === 'steamtools' ? 'STEAMTOOLS' : item.category.toUpperCase()}
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-3 z-20">
                                    <h3 className="font-black text-xs md:text-sm text-white leading-tight line-clamp-2 drop-shadow-md group-hover/card:text-primary-400 transition-colors">
                                        {item.name}
                                    </h3>
                                    <div className="mt-1 flex justify-between items-center">
                                        <span className="font-mono font-bold text-slate-300 text-[10px] drop-shadow-md bg-black/40 px-1.5 rounded">
                                            {item.version}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 left-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
                <button onClick={handlePrev} className="p-2 rounded-full bg-white/90 dark:bg-black/90 text-slate-900 dark:text-white shadow-lg hover:scale-110 transition-transform">
                    <Icon name="ChevronLeft" size={20} />
                </button>
            </div>
            <div className="absolute top-1/2 -translate-y-1/2 right-2 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:block">
                <button onClick={handleNext} className="p-2 rounded-full bg-white/90 dark:bg-black/90 text-slate-900 dark:text-white shadow-lg hover:scale-110 transition-transform">
                    <Icon name="ChevronRight" size={20} />
                </button>
            </div>
        </div>
    );
};

const ResourceDetailModal: React.FC<{ 
  item: ResourceItem; 
  onClose: () => void;
}> = ({ item, onClose }) => {
  const [activeImage, setActiveImage] = useState(item.coverImage);
  const [showTrailer, setShowTrailer] = useState(false);
  const [translatedDesc, setTranslatedDesc] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showArabic, setShowArabic] = useState(false);

  useEffect(() => {
    setActiveImage(item.galleryImages.length > 0 ? item.galleryImages[0] : item.coverImage);
    setShowTrailer(false);
    setTranslatedDesc(null);
    setShowArabic(false);
  }, [item]);

  const handleTranslate = async () => {
    if (showArabic) {
        setShowArabic(false);
        return;
    }
    if (translatedDesc) {
        setShowArabic(true);
        return;
    }
    setIsTranslating(true);
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Translate the following technical software/game description into professional Arabic. Keep technical terms English. \n\nTEXT: ${item.description}`,
        });
        const text = response.text;
        if (text) {
            setTranslatedDesc(text);
            setShowArabic(true);
        }
    } catch (error) {
        console.error("Translation failed", error);
    } finally {
        setIsTranslating(false);
    }
  };

  const handleThumbnailClick = (img: string) => {
    setActiveImage(img);
    setShowTrailer(false);
  };

  const handleReportBrokenLink = () => {
    const whatsappMessage = `*Report Broken Link in Secret Vault*\n\n*Item Name:* ${item.name}\n*Item ID:* ${item.id}\n*Category:* ${item.category}\n\nPlease check this link, it seems to be down. Thanks!`;
    const phoneNumber = '212723242286';
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank');
  };

  const isSteamTool = item.category === 'steamtools';
  const scoreConfig = (item.ratingPositive) ? ((score) => {
    if (isNaN(score)) return { emoji: '🤔', color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-800', border: 'border-slate-200 dark:border-slate-700', wrapper: 'bg-slate-50 dark:bg-slate-900' };
    if (score > 50) return { emoji: '😎', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-500/20', border: 'border-emerald-500/10', wrapper: 'bg-emerald-500/5' };
    if (score === 50) return { emoji: '😐', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-500/20', border: 'border-orange-500/10', wrapper: 'bg-orange-500/5' };
    return { emoji: '😕', color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-500/20', border: 'border-red-500/10', wrapper: 'bg-red-500/5' };
  })(parseInt((item.ratingPositive || '').toString().replace(/[^0-9]/g, ''))) : { emoji: '🤔', color: 'text-slate-500', bg: 'bg-slate-100 dark:bg-slate-800', border: 'border-slate-200 dark:border-slate-700', wrapper: 'bg-slate-50 dark:bg-slate-900' };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white/95 dark:bg-slate-950/95 backdrop-blur-md p-0 sm:p-4 md:p-6"
      onClick={onClose}
    >
      <motion.div 
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-slate-900 w-full h-full md:max-w-6xl md:h-[90vh] rounded-none md:rounded-[2rem] shadow-[0_0_100px_rgba(0,0,0,0.2)] dark:shadow-[0_0_100px_rgba(0,0,0,0.8)] relative overflow-hidden flex flex-col md:flex-row border border-slate-200 dark:border-slate-800"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-[110] bg-white/60 dark:bg-black/60 hover:bg-red-500 hover:text-white text-slate-500 dark:text-slate-400 p-2.5 rounded-full transition-all backdrop-blur-md border border-slate-200 dark:border-white/10"
        >
             <Icon name="X" size={20} />
        </button>

        <div className="w-full md:w-[45%] bg-slate-100 dark:bg-black flex flex-col shrink-0 h-[40vh] md:h-full border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-800 relative">
           <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-slate-200/90 dark:to-slate-900/90 pointer-events-none"></div>
              <AnimatePresence mode="wait">
                {showTrailer && item.links.trailer ? (
                    <motion.div 
                        key="trailer"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="w-full h-full z-20 bg-black flex items-center justify-center relative"
                    >
                        <iframe 
                            className="w-full h-full absolute inset-0"
                            src={getYoutubeEmbedUrl(item.links.trailer) || ''}
                            title="Trailer"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            allowFullScreen
                        ></iframe>
                    </motion.div>
                ) : (
                    <motion.img 
                        key={activeImage}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        src={activeImage} 
                        alt={item.name} 
                        className="max-w-full max-h-full object-contain shadow-2xl z-10" 
                    />
                )}
              </AnimatePresence>
           </div>
           <div className="h-20 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 p-3 flex gap-3 overflow-x-auto no-scrollbar shrink-0 z-20">
              <Thumbnail src={item.coverImage} isActive={!showTrailer && activeImage === item.coverImage} onClick={() => handleThumbnailClick(item.coverImage)} />
             {item.galleryImages.map((img, idx) => (
               <Thumbnail key={idx} src={img} isActive={!showTrailer && activeImage === img} onClick={() => handleThumbnailClick(img)} />
             ))}
           </div>
        </div>

        <div className="flex-1 bg-white dark:bg-slate-900 overflow-y-auto custom-scrollbar relative flex flex-col">
            <div className="p-6 md:p-8 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 sticky top-0 z-30 backdrop-blur-xl">
               <div className="flex flex-wrap items-center gap-2 mb-3">
                  <Badge text={isSteamTool ? 'STEAMTOOLS' : item.category} color="blue" icon={isSteamTool ? 'BrandSteam' : 'Folder'} />
                  {!isSteamTool && <Badge text={item.version} color="slate" icon="Code" />}
                  {isSteamTool && item.gameId && <Badge text={`ID: ${item.gameId}`} color="slate" icon="Hash" />}
                  {!isSteamTool && item.category !== 'architect' && item.repackBy && <Badge text={`REPACK: ${item.repackBy.toUpperCase()}`} color="emerald" icon="Box" />}
               </div>
               <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white leading-none tracking-tight uppercase italic">{item.name}</h2>
               {item.genres && (
                 <div className="mt-3 text-xs font-mono text-primary-500 dark:text-sky-400 font-bold uppercase tracking-widest flex items-center gap-2">
                    <Icon name="Gamepad2" size={14} /> {item.genres}
                 </div>
               )}
            </div>

            <div className="p-6 md:p-8 space-y-8 pb-32">
                
                {isSteamTool ? (
                    <div className="bg-slate-100 dark:bg-slate-950 p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
                        <div className="flex justify-between items-center mb-4 border-b border-slate-200 dark:border-slate-800 pb-2">
                            <h4 className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                <Icon name="BrandSteam" size={16} /> Community Score
                            </h4>
                            <span className="text-[10px] font-bold bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded-full">
                                VERIFIED
                            </span>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                            <div className={`flex items-center gap-4 flex-1 w-full p-3 rounded-xl border ${scoreConfig.wrapper} ${scoreConfig.border}`}>
                                <div className={`w-12 h-12 rounded-full ${scoreConfig.bg} ${scoreConfig.color} shrink-0 flex items-center justify-center text-2xl`}>
                                    {scoreConfig.emoji}
                                </div>
                                <div>
                                    <span className={`block text-[10px] font-bold ${scoreConfig.color} opacity-70 uppercase tracking-wider`}>Positive</span>
                                    <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{item.ratingPositive || 'N/A'}</span>
                                </div>
                            </div>
                            <div className="hidden sm:block w-px h-10 bg-slate-200 dark:bg-slate-800"></div>
                            <div className="flex items-center gap-4 flex-1 w-full p-3 bg-blue-500/5 rounded-xl border border-blue-500/10 justify-end sm:justify-start flex-row-reverse sm:flex-row">
                                <div className="p-2.5 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 shrink-0">
                                    <Icon name="Users" size={24} />
                                </div>
                                <div className="text-right sm:text-left">
                                    <span className="block text-[10px] font-bold text-blue-600/70 dark:text-blue-400/70 uppercase tracking-wider">In Game</span>
                                    <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{item.ratingNegative || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                       <StatBox label="Repack Size" value={item.repackSize} icon="Database" color="text-primary-500 dark:text-sky-400" />
                       <StatBox label="Original Size" value={item.originalSize} icon="Server" color="text-slate-500 dark:text-slate-400" />
                       <StatBox label="Languages" value={item.languages} icon="Globe" color="text-emerald-500 dark:text-emerald-400" fullWidth />
                    </div>
                )}

                {isSteamTool && item.hasDenuvo && (
                    <div className="mb-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 flex gap-4">
                        <div className="text-red-600 dark:text-red-400 shrink-0">
                            <Icon name="ShieldLock" size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-red-700 dark:text-red-400 text-sm uppercase mb-1">Denuvo DRM Detected</h4>
                            <p className="text-xs text-red-600 dark:text-red-300 leading-relaxed font-medium">
                                This game uses Denuvo Anti-Tampering DRM. There is currently no known public bypass for Denuvo, meaning you likely will NOT be able to play this game. However, there's a slight chance it might be available in the DepotBox or ProjectLighting Launcher with a bypass. <span className="font-bold underline">Download at your own risk.</span>
                            </p>
                        </div>
                    </div>
                )}

                {isSteamTool && item.hasExternalLauncher && (
                    <div className="mb-4 p-4 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-900/50 flex gap-4">
                        <div className="text-orange-600 dark:text-orange-400 shrink-0">
                            <Icon name="User" size={24} />
                        </div>
                        <div>
                            <h4 className="font-bold text-orange-700 dark:text-orange-400 text-sm uppercase mb-1">Third-Party Account Required</h4>
                            <p className="text-xs text-orange-600 dark:text-orange-300 leading-relaxed font-medium">
                                This game requires an external launcher or account verification (EA Account). As this game also has Denuvo, it might be impossible to play in any case. <span className="font-bold underline">Download at your own risk.</span>
                            </p>
                        </div>
                    </div>
                )}

                <Section title="Overview" action={
                        <button onClick={handleTranslate} disabled={isTranslating} className={`flex items-center gap-2 px-3 py-1 rounded-md border text-[10px] font-bold uppercase tracking-wider transition-all ${showArabic ? 'bg-primary-500/20 border-primary-500 text-primary-600 dark:text-sky-400' : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>
                            {isTranslating ? (<><Icon name="Cpu" size={12} className="animate-spin" /> Decrypting...</>) : (<><Icon name="Globe" size={12} /> {showArabic ? 'Show Original' : 'Translate AR'}</>)}
                        </button>
                    }>
                   <div className="bg-slate-50 dark:bg-slate-950/50 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 relative overflow-hidden group">
                     <div className="max-h-[250px] overflow-y-auto custom-scrollbar pr-2">
                        <AnimatePresence mode="wait">
                            <motion.div key={showArabic ? 'ar' : 'en'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className={`text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium ${showArabic ? 'text-right font-sans text-slate-800 dark:text-slate-200' : 'text-slate-700 dark:text-slate-300'}`} dir={showArabic ? 'rtl' : 'ltr'}>
                                {showArabic && translatedDesc ? translatedDesc : item.description}
                            </motion.div>
                        </AnimatePresence>
                     </div>
                     <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-slate-50 dark:from-slate-950 to-transparent pointer-events-none opacity-50"></div>
                   </div>
                </Section>

                {item.systemReqs.length > 0 && (
                   <Section title="System Parameters">
                      <div className="grid grid-cols-1 gap-3">
                        {item.systemReqs.map((req, idx) => {
                          let paramIcon = req.icon || 'Cpu';
                          const label = req.label.toLowerCase();
                          if (label.includes('os')) paramIcon = 'BrandWindows';
                          if (label.includes('ram')) paramIcon = 'Cpu';
                          if (label.includes('gpu')) paramIcon = 'DeviceDesktop';
                          if (label.includes('storage')) paramIcon = 'Database';
                          
                          return (
                            <div key={idx} className="flex flex-col sm:flex-row sm:items-start justify-between p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-colors gap-2 sm:gap-4">
                               <div className="flex items-center gap-3 shrink-0 pt-0.5">
                                 <div className="p-2 bg-white dark:bg-slate-900 rounded-lg text-slate-500"><Icon name={paramIcon} size={18} /></div>
                                 <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{req.label}</span>
                               </div>
                               <span className="text-xs font-mono text-slate-900 dark:text-white text-left sm:text-right font-bold break-words leading-relaxed sm:max-w-[70%] pl-1 sm:pl-0">{req.value}</span>
                            </div>
                          );
                        })}
                      </div>
                   </Section>
                )}

                {item.toolsNeeded && item.toolsNeeded.length > 0 && (
                    <Section title="Tools You Need">
                        <div className="flex flex-wrap gap-3">
                            {item.toolsNeeded.map((tool, idx) => (
                                <a 
                                    key={idx} 
                                    href={tool.url} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-900/30 text-orange-700 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors text-xs font-bold uppercase tracking-wider"
                                >
                                    <Icon name="Wrench" size={14} /> {tool.name}
                                </a>
                            ))}
                        </div>
                    </Section>
                )}

                {item.installSteps.length > 0 && (
                   <Section title="Deployment Protocol">
                      <div className="space-y-3">
                        {item.installSteps.map((step, idx) => (
                          <div key={idx} className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-800/20 rounded-xl border border-slate-200 dark:border-slate-800/50">
                            <span className="font-black text-primary-600 dark:text-primary-500 shrink-0 text-sm">0{idx + 1}</span>
                            <span className="text-sm text-slate-700 dark:text-slate-300 font-medium">{step}</span>
                          </div>
                        ))}
                      </div>
                   </Section>
                )}

                <Section title="Download Channels">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                        {item.links.full && (
                            <a href={item.links.full} target="_blank" rel="noreferrer" className="col-span-1 md:col-span-2 group relative overflow-hidden bg-gradient-to-r from-primary-600 to-primary-500 p-4 sm:p-5 rounded-xl shadow-lg shadow-primary-500/20 hover:shadow-primary-500/40 transition-all hover:-translate-y-1 active:scale-95">
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                                <div className="relative z-10 flex items-center justify-center gap-3 sm:gap-4">
                                    <div className="p-2 bg-white/10 rounded-full backdrop-blur-sm"><Icon name="Download" size={20} className="text-white sm:w-6 sm:h-6 animate-bounce" /></div>
                                    <div className="text-left sm:text-center">
                                        <div className="text-[10px] font-black text-primary-100 uppercase tracking-[0.2em] opacity-80">Master File</div>
                                        <div className="text-sm sm:text-lg font-black text-white uppercase tracking-wider leading-none">Full Project ({item.repackSize})</div>
                                        {item.links.fullNote && <div className="text-[10px] text-white/80 font-bold mt-1">{item.links.fullNote}</div>}
                                    </div>
                                </div>
                            </a>
                        )}
                        {item.links.parts.map(part => (
                            <DownloadButton 
                                key={`part-${part.id}`}
                                label={`Download Part ${part.id < 10 ? '0' + part.id : part.id}`} 
                                sub="Primary Server" 
                                href={part.link} 
                                icon="Server" 
                                note={part.note}
                            />
                        ))}
                        {item.links.parts.length === 0 && !item.links.full && (
                            <div className="col-span-1 md:col-span-2 p-6 bg-slate-100 dark:bg-slate-950 rounded-xl border border-dashed border-slate-300 dark:border-slate-800 text-center">
                                <Icon name="Loader" size={24} className="animate-spin mx-auto mb-2 text-slate-400" />
                                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Awaiting Encryption Keys...</p>
                            </div>
                        )}
                        {item.links.mirrors.map(mirror => (
                            <DownloadButton 
                                key={`mirror-${mirror.id}`}
                                label={`Mirror Link ${mirror.id < 10 ? '0' + mirror.id : mirror.id}`} 
                                sub="Backup Server" 
                                href={mirror.link} 
                                icon="Database" 
                                secondary 
                                note={mirror.note}
                            />
                        ))}
                    </div>
                    
                    <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                        {item.links.trailer && (
                            <button onClick={() => setShowTrailer(!showTrailer)} className={`flex items-center justify-center gap-2 p-3 sm:p-0 rounded-lg sm:bg-transparent border sm:border-0 text-xs font-bold uppercase tracking-widest transition-colors ${showTrailer ? 'bg-red-500/10 border-red-500 text-red-600 dark:text-red-400' : 'bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 text-red-600 dark:text-red-500 hover:text-red-500 dark:hover:text-red-400'}`}>
                                <Icon name="Video" size={16} /> {showTrailer ? 'Close Trailer' : 'Game Trailer'}
                            </button>
                        )}
                        {item.links.tutorial && <a href={item.links.tutorial} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 p-3 sm:p-0 rounded-lg bg-slate-50 dark:bg-slate-800/50 sm:bg-transparent border sm:border-0 border-slate-200 dark:border-slate-700 text-xs font-bold text-amber-600 dark:text-amber-500 hover:text-amber-500 dark:hover:text-amber-400 uppercase tracking-widest transition-colors"><Icon name="BrandYoutube" size={16} /> Watch Tutorial</a>}
                        {item.links.dlc && <a href={item.links.dlc} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 p-3 sm:p-0 rounded-lg bg-slate-50 dark:bg-slate-800/50 sm:bg-transparent border sm:border-0 border-slate-200 dark:border-slate-700 text-xs font-bold text-purple-600 dark:text-purple-500 hover:text-purple-500 dark:hover:text-purple-400 uppercase tracking-widest transition-colors"><Icon name="Plus" size={16} /> Get DLCs / Updates</a>}
                        
                        <button 
                            onClick={handleReportBrokenLink} 
                            className="flex items-center justify-center gap-2 p-3 sm:p-0 rounded-lg bg-red-50 dark:bg-red-900/10 sm:bg-transparent border sm:border-0 border-red-200 dark:border-red-900/30 text-xs font-bold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 uppercase tracking-widest transition-colors"
                        >
                            <Icon name="AlertTriangle" size={16} /> Report Broken Link
                        </button>
                    </div>
                </Section>
            </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const Badge: React.FC<{ text: string; color: 'blue' | 'slate' | 'emerald'; icon: string }> = ({ text, color, icon }) => {
  const colors = {
    blue: 'bg-primary-500/10 text-primary-600 dark:text-sky-400 border-primary-500/20',
    slate: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
  };
  return (
    <span className={`px-2.5 py-1 rounded-md border text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${colors[color]}`}>
       <Icon name={icon} size={12} /> {text}
    </span>
  );
};

const StatBox: React.FC<{ label: string; value: string; icon: string; color: string; fullWidth?: boolean }> = ({ label, value, icon, color, fullWidth }) => (
  <div className={`bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center ${fullWidth ? 'col-span-2 lg:col-span-1' : ''}`}>
     <Icon name={icon} size={20} className={`${color} mb-2`} />
     <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{label}</span>
     <span className="text-xs font-mono font-bold text-slate-900 dark:text-white truncate w-full px-2">{value || 'N/A'}</span>
  </div>
);

const Section: React.FC<{ title: string; children: React.ReactNode; action?: React.ReactNode }> = ({ title, children, action }) => (
  <div className="space-y-4">
     <div className="flex items-center justify-between pr-1">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2 pl-1">
            <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span> {title}
        </h3>
        {action}
     </div>
     {children}
  </div>
);

const Thumbnail: React.FC<{ src: string; isActive: boolean; onClick: () => void }> = ({ src, isActive, onClick }) => (
  <button onClick={onClick} className={`relative aspect-square h-full rounded-lg overflow-hidden border-2 transition-all shrink-0 ${isActive ? 'border-primary-500 scale-105 opacity-100' : 'border-transparent opacity-50 hover:opacity-100'}`}>
    <img src={src} alt="thumb" className="w-full h-full object-cover" />
  </button>
);

const DownloadButton: React.FC<{ label: string; sub: string; href: string; icon: string; secondary?: boolean; note?: string }> = ({ label, sub, href, icon, secondary, note }) => (
  <a href={href} target="_blank" rel="noreferrer" className={`group flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border transition-all active:scale-95 hover:-translate-y-1 ${secondary ? 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-400 dark:hover:border-slate-500 hover:text-slate-900 dark:hover:text-white' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-primary-500/50 hover:text-primary-600 dark:hover:text-white'}`}>
     <div className={`p-2 sm:p-2.5 rounded-lg shrink-0 transition-colors ${secondary ? 'bg-slate-100 dark:bg-slate-950 text-slate-500 group-hover:text-slate-800 dark:group-hover:text-slate-300' : 'bg-slate-200 dark:bg-slate-900 text-primary-600 dark:text-primary-500 group-hover:text-white group-hover:bg-primary-500'}`}>
        <Icon name={icon} size={20} />
     </div>
     <div className="min-w-0 flex-1">
        <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-widest opacity-60 mb-0.5">{sub}</div>
        <div className="text-xs sm:text-sm font-bold truncate">{label}</div>
        {note && <div className="text-[10px] text-emerald-500 font-bold mt-1 truncate">{note}</div>}
     </div>
     <Icon name="ExternalLink" size={14} className="ml-auto opacity-50 sm:opacity-0 group-hover:opacity-100 transition-opacity" />
  </a>
);

// --- MAIN PAGE COMPONENT ---

const SecretArea: React.FC = () => {
  const [isUnlocked, setIsUnlocked] = useState(() => localStorage.getItem('secret_area_unlocked') === 'true');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [allResources, setAllResources] = useState<Record<string, ResourceItem[]>>({ game: [], steamtools: [], architect: [], extra: [] });
  const [activeTab, setActiveTab] = useState<'game' | 'steamtools' | 'architect' | 'extra'>('game');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [visitorCount, setVisitorCount] = useState(2491);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [notifications, setNotifications] = useState<Array<{id: number, title: string, text: string, time: string, isAr?: boolean}>>([]);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [upcomingGames, setUpcomingGames] = useState<UpcomingGame[]>([]);
  const [upcomingPlatform, setUpcomingPlatform] = useState('PlayStation 5');
  const [isUpcomingMissing, setIsUpcomingMissing] = useState(false);
  const [scriptError, setScriptError] = useState(false);
  const [requestModalInitialTitle, setRequestModalInitialTitle] = useState('');
  
  // Steam Accounts Feature
  const [steamAccounts, setSteamAccounts] = useState<SteamAccount[]>([]);

  const recentProducts = useMemo(() => {
    const recent: ResourceItem[] = [];
    ['game', 'steamtools', 'architect', 'extra'].forEach(cat => {
        const items = allResources[cat] || [];
        const catRecent = [...items].reverse().slice(0, 10);
        recent.push(...catRecent);
    });
    return recent;
  }, [allResources]);
  const [showSteamModal, setShowSteamModal] = useState(false);

  // Math Game State
  const [showMathGame, setShowMathGame] = useState(false);
  const [mathProblem, setMathProblem] = useState({ q: '', a: 0, note: '' });
  const [mathInput, setMathInput] = useState('');
  const [mathStatus, setMathStatus] = useState<'playing' | 'won' | 'lost' | 'locked'>('playing');
  const [mathLockoutTime, setMathLockoutTime] = useState<number | null>(null);
  const [attemptsLeft, setAttemptsLeft] = useState(2);

  useEffect(() => {
    const accepted = localStorage.getItem('nexa_disclaimer_accepted');
    if (!accepted) {
        setShowDisclaimer(true);
    }
  }, []);

  // --- INITIALIZE LOCKOUT STATE ---
  useEffect(() => {
    const lockout = localStorage.getItem('nexa_math_lockout');
    if (lockout) {
        const time = parseInt(lockout);
        if (time > Date.now()) {
            setMathLockoutTime(time);
            setMathStatus('locked');
        } else {
            localStorage.removeItem('nexa_math_lockout');
        }
    }
  }, []);

  const handleCloseDisclaimer = () => {
    setShowDisclaimer(false);
    localStorage.setItem('nexa_disclaimer_accepted', 'true');
  };

  useEffect(() => {
    if (isUnlocked) {
        const t1 = setTimeout(() => {
            const id = Date.now();
            setNotifications(prev => [...prev, {
                id,
                title: '🐺 New Wolf Detected',
                text: 'Welcome, new Wolf.\nYou are one of the few chosen to enter the Secret Area.\nOnly Wolves belong here 🖤',
                time: 'Now'
            }]);
            setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 6000);
        }, 1500);

        const t2 = setTimeout(() => {
            const id = Date.now() + 1;
            setNotifications(prev => [...prev, {
                id,
                title: '🐺 انضمام ذئب جديد',
                text: 'مرحباً بالذئب الجديد\nأنت من القلّة التي تمكنت من دخول الـ Secret Area.\nهنا لا يوجد إلا الـ Wolves 🖤',
                time: 'الآن',
                isAr: true
            }]);
            setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 6000);
        }, 8000); 

        return () => { clearTimeout(t1); clearTimeout(t2); };
    }
  }, [isUnlocked]);

  // Math Game Functions
  const startMathGame = () => {
    // Check for lockout first
    const lockout = localStorage.getItem('nexa_math_lockout');
    if (lockout) {
        const time = parseInt(lockout);
        if (time > Date.now()) {
            setMathLockoutTime(time);
            setMathStatus('locked');
            setShowMathGame(true);
            return;
        } else {
            localStorage.removeItem('nexa_math_lockout');
        }
    }

    // Reset attempts if starting fresh without lockout
    setAttemptsLeft(2);

    // Advanced math patterns to challenge the user
    const mode = Math.floor(Math.random() * 5); // 5 complex modes
    let q = '';
    let a = 0;
    let note = ''; // Context like "α = 5"

    switch (mode) {
        case 0: // Greek Variables Algebra
            const alpha = Math.floor(Math.random() * 10) + 2; // 2-11
            const omega = Math.floor(Math.random() * 50) + 10;
            note = `Let α = ${alpha}, Ω = ${omega}`;
            // Problem: (Ω - α) * α
            q = `(Ω - α) × α`;
            a = (omega - alpha) * alpha;
            break;
        case 1: // Summation Sequence
            const limit = Math.floor(Math.random() * 3) + 3; // 3 to 5
            const add = Math.floor(Math.random() * 10);
            // Sum k=1 to limit of k
            // sum(3) = 6, sum(4) = 10, sum(5) = 15
            const sum = (limit * (limit + 1)) / 2;
            q = `∑(k=1 to ${limit}) k + ${add}`;
            a = sum + add;
            note = 'Calculate the summation sequence';
            break;
        case 2: // Squares and Roots
            const roots = [4, 9, 16, 25, 36, 49, 64, 81, 100];
            const sqVal = roots[Math.floor(Math.random() * roots.length)];
            const rootVal = Math.sqrt(sqVal);
            const factor = Math.floor(Math.random() * 5) + 2;
            // q: √sqVal * factor^2
            q = `√${sqVal} × ${factor}²`;
            a = rootVal * (factor * factor);
            break;
        case 3: // Fractions and Cube Roots
            const cubes = [8, 27, 64]; // roots: 2, 3, 4
            const cbVal = cubes[Math.floor(Math.random() * cubes.length)];
            const cbRoot = Math.cbrt(cbVal); // 2,3,4
            // q: 1/2 of (∛cbVal * 100)
            q = `½ (∛${cbVal} × 100)`;
            a = 0.5 * (cbRoot * 100);
            break;
        case 4: // Delta Logic
            const delta = Math.floor(Math.random() * 5) + 3; // 3-7
            note = `Given Δ = ${delta}`;
            // q: (Δ³ ÷ Δ) + 10  -> simplifies to Δ^2 + 10
            q = `(Δ³ ÷ Δ) + 10`;
            a = (Math.pow(delta, 3) / delta) + 10;
            break;
    }
    
    setMathProblem({ q, a, note });
    setMathStatus('playing');
    setMathInput('');
    setShowMathGame(true);
  };

  const verifyMath = (e: React.FormEvent) => {
    e.preventDefault();
    if (Math.abs(parseFloat(mathInput) - mathProblem.a) < 0.1) {
        setMathStatus('won');
        // Clear any previous attempts/lockout if won
        localStorage.removeItem('nexa_math_lockout');
    } else {
        const newAttempts = attemptsLeft - 1;
        setAttemptsLeft(newAttempts);
        
        if (newAttempts <= 0) {
            // LOCKOUT LOGIC
            const lockTime = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
            localStorage.setItem('nexa_math_lockout', lockTime.toString());
            setMathLockoutTime(lockTime);
            setMathStatus('locked');
        } else {
            // WRONG ANSWER FEEDBACK
            setMathStatus('lost');
            setTimeout(() => {
                setMathStatus('playing');
            }, 1000);
        }
    }
  };

  const copyAndCloseMath = () => {
    setPassword('Wolfspace'); // Pre-fill
    navigator.clipboard.writeText('Wolfspace'); // Copy
    setShowMathGame(false); // Close game
  };

  const filteredUpcoming = useMemo(() => {
    return upcomingGames.filter(g => {
        const p = g.platform ? g.platform.toLowerCase() : '';
        if (upcomingPlatform === 'PlayStation 5') return p.includes('ps5') || p.includes('playstation');
        if (upcomingPlatform === 'Xbox S/X') return p.includes('xbox') || p.includes('series');
        if (upcomingPlatform === 'Steam') return p.includes('steam') || p.includes('pc');
        return false;
    });
  }, [upcomingPlatform, upcomingGames]);

  useEffect(() => {
    const initial = Math.floor(Math.random() * (150000 - 30000 + 1)) + 30000;
    setVisitorCount(initial);
    const interval = setInterval(() => {
      setVisitorCount(prev => prev + Math.floor(Math.random() * 21) - 10);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchData = async () => {
    if (!isUnlocked) return;
    setLoading(true);
    setError(null);
    setIsUpcomingMissing(false);
    setScriptError(false);

    try {
      const response = await fetch(`${API_ENDPOINT}?t=${Date.now()}`);
      if (!response.ok) {
          throw new Error(`Server returned ${response.status} ${response.statusText}`);
      }
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
          setScriptError(true);
          throw new Error("Google Script is down or returned invalid data. Please check code.gs deployment.");
      }
      const data = await response.json();
      
      const upcomingKey = Object.keys(data).find(k => k.toLowerCase() === 'upcoming');
      if (!upcomingKey) {
          setIsUpcomingMissing(true);
          setUpcomingGames([]);
      } else if (Array.isArray(data[upcomingKey])) {
         const mappedUpcoming: UpcomingGame[] = data[upcomingKey].map((item: any, index: number) => ({
             id: `ug-${index}`,
             title: item.name || item.title || 'Untitled',
             image: item.image || item.coverImage || 'https://placehold.co/600x800/0f172a/334155?text=ENCRYPTED',
             platform: formatPlatformDisplay(item.platform || 'TBA'),
             price: item.price || 'TBA',
             icon: getPlatformIcon(item.platform || '')
         }));
         setUpcomingGames(mappedUpcoming);
      } else {
         setUpcomingGames([]);
      }

      // Handle Steam Accounts with robust header normalization
      const steamKey = Object.keys(data).find(k => k.toLowerCase() === 'steamaccounts');
      if (steamKey && Array.isArray(data[steamKey])) {
          setSteamAccounts(data[steamKey].map((raw: any) => {
              // Extract values by checking keys that start with the intended name
              const findByPrefix = (prefix: string) => {
                  const key = Object.keys(raw).find(k => k.toLowerCase().trim().startsWith(prefix.toLowerCase()));
                  return key ? raw[key] : undefined;
              };

              return {
                  username: findByPrefix('username') || '',
                  password: findByPrefix('password') || '',
                  games: findByPrefix('games') || '',
                  status: findByPrefix('status') || 'Online'
              };
          }));
      } else {
          setSteamAccounts([]);
      }

      const transformed: Record<string, ResourceItem[]> = { game: [], steamtools: [], architect: [], extra: [] };
      Object.keys(data).forEach(tabKey => {
        const normalizedKey = tabKey.toLowerCase();
        let idPrefix = '';
        if (normalizedKey.includes('game')) idPrefix = 'G';
        else if (normalizedKey.includes('steamtools')) idPrefix = 'S';
        else if (normalizedKey.includes('architect')) idPrefix = 'A';
        else if (normalizedKey.includes('extra')) idPrefix = 'E';

        if (transformed.hasOwnProperty(normalizedKey)) {
          transformed[normalizedKey] = data[tabKey].map((row: any, idx: number) => {
            // Robust access: check both lower and original casing
            const getVal = (key: string) => row[key] || row[key.charAt(0).toUpperCase() + key.slice(1)] || '';
            
            const reqsStr = getVal('requirements');
            const reqs = (reqsStr || '').toString().split('|').map((s: string) => {
              const parts = s.split(':');
              return { 
                label: parts[0]?.trim() || 'Info', 
                value: parts[1]?.trim() || 'N/A', 
                icon: parts[2]?.trim() || 'Box',
                link: parts[3]?.trim() || undefined
              };
            }).filter((r: any) => r.value && r.value !== 'N/A');

            const steps = (getVal('steps') || '').toString().split('|').map((s: string) => s.trim()).filter((s: string) => s);
            const gallery = (getVal('gallery') || '').toString().split('|').map((s: string) => s.trim()).filter((s: string) => s && s.startsWith('http'));
            const toolsParsed = (getVal('tools') || '').toString().split('|').map((s: string) => {
                const parts = s.split('^');
                return { name: parts[0]?.trim(), url: parts[1]?.trim() };
            }).filter((t: any) => t.name && t.url);

            const partsArr: { id: number, link: string, note?: string }[] = [];
            const mirrorsArr: { id: number, link: string, note?: string }[] = [];
            for (let i = 1; i <= 20; i++) {
                let pVal = getVal(`part${i}`);
                let pNote = getVal(`partNote${i}`) || getVal(`note${i}`);
                
                // Helper to extract note from link string
                const extractNote = (val: string) => {
                    if (!val) return { link: '', note: '' };
                    
                    // Format: Link | Note
                    if (val.includes('|')) {
                        const parts = val.split('|');
                        return { link: parts[0].trim(), note: parts[1].trim() };
                    }
                    
                    // Format: Link "Note"
                    const quoteMatch = val.match(/^(.*)\s+"([^"]+)"$/);
                    if (quoteMatch) {
                        return { link: quoteMatch[1].trim(), note: quoteMatch[2].trim() };
                    }

                    // Format: Link (Note)
                    const parenMatch = val.match(/^(.*)\s+\(([^)]+)\)$/);
                    if (parenMatch) {
                        return { link: parenMatch[1].trim(), note: parenMatch[2].trim() };
                    }

                    return { link: val.trim(), note: '' };
                };

                if (pVal) {
                    const extracted = extractNote(pVal);
                    pVal = extracted.link;
                    if (extracted.note) pNote = extracted.note;
                }

                let mVal = getVal(`mirror${i}`);
                let mNote = getVal(`mirrorNote${i}`);

                if (mVal) {
                    const extracted = extractNote(mVal);
                    mVal = extracted.link;
                    if (extracted.note) mNote = extracted.note;
                }

                if (pVal) partsArr.push({ id: i, link: pVal, note: pNote });
                if (mVal) mirrorsArr.push({ id: i, link: mVal, note: mNote });
            }

            const isPinnedRaw = getVal('pinned');
            const isFreeRaw = getVal('price') || getVal('isfree') || getVal('free');

            return {
              id: `${idPrefix}${row.id || (idx + 1)}`,
              category: normalizedKey,
              name: getVal('name') || 'Secure Fragment',
              version: getVal('version') || 'v1.0',
              repackSize: getVal('repackSize') || 'N/A',
              originalSize: getVal('originalSize') || 'N/A',
              genres: getVal('genres') || '',
              languages: getVal('languages') || 'ENG',
              repackBy: getVal('repackBy') || 'NEXA',
              coverImage: getVal('coverImage') || 'https://placehold.co/600x800/0f172a/334155?text=ENCRYPTED',
              galleryImages: gallery,
              description: getVal('description') || 'No intel available.',
              gameId: getVal('gameId') || '',
              ratingPositive: getVal('ratingPositive') || '',
              ratingNegative: getVal('ratingNegative') || '',
              hasDenuvo: String(getVal('denuvo')).toLowerCase() === 'true',
              hasExternalLauncher: String(getVal('launcher')).toLowerCase() === 'true',
              systemReqs: reqs,
              installSteps: steps,
              isPinned: String(isPinnedRaw).toLowerCase() === 'true' || String(isPinnedRaw).toLowerCase() === 'yes' || String(isPinnedRaw).toLowerCase() === 'on',
              isFree: String(isFreeRaw).toLowerCase() === 'true' || String(isFreeRaw).toLowerCase() === 'yes' || String(isFreeRaw).toLowerCase() === 'free' || String(isFreeRaw) === '0',
              toolsNeeded: toolsParsed,
              links: { 
                parts: partsArr,
                mirrors: mirrorsArr,
                full: getVal('full'), 
                fullNote: getVal('fullNote') || getVal('note'),
                tutorial: getVal('tutorial'), 
                dlc: getVal('dlc'), 
                trailer: getVal('trailer')
              }
            };
          });
        }
      });
      setAllResources(transformed);
    } catch (err: any) {
      console.error("Fetch Error:", err);
      if (!scriptError) setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { if (isUnlocked) fetchData(); }, [isUnlocked]);
  useEffect(() => { setCurrentPage(1); }, [activeTab, searchQuery]);

  const filteredData = useMemo(() => {
    const currentTabData = allResources[activeTab] || [];
    const query = searchQuery.toLowerCase();
    const filtered = currentTabData.filter(item => 
      item.name.toLowerCase().includes(query) || 
      item.id.toLowerCase().includes(query) ||
      (item.gameId && String(item.gameId).toLowerCase().includes(query))
    );
    return filtered.sort((a, b) => {
        if (a.isPinned === b.isPinned) return 0;
        return a.isPinned ? -1 : 1;
    });
  }, [allResources, activeTab, searchQuery]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Wolfspace') {
      setIsUnlocked(true);
      localStorage.setItem('secret_area_unlocked', 'true');
    } else {
      setError('AUTHORIZATION FAILED');
      setPassword('');
    }
  };

  const handleRequestSubmit = async (requestData: any) => {
    try {
        await fetch(API_ENDPOINT, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'text/plain',
            },
            body: JSON.stringify(requestData)
        });
        
        const notifId = Date.now();
        setNotifications(prev => [...prev, {
            id: notifId,
            title: 'Request Sent',
            text: `Your request for "${requestData.title}" has been submitted to the admin team.`,
            time: 'Just now'
        }]);

        // Auto remove alert after 5 seconds
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== notifId));
        }, 5000);

    } catch (err) {
        console.error("Submission failed", err);
        const notifId = Date.now();
        setNotifications(prev => [...prev, {
            id: notifId,
            title: 'Request Error',
            text: 'There was an issue sending your request. Please try again.',
            time: 'Just now'
        }]);
        setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== notifId));
        }, 5000);
    }
  };

  if (!isUnlocked) {
    return (
      <div className="w-full h-screen fixed inset-0 z-[200] flex items-center justify-center bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans transition-colors duration-300">
        <div className="absolute inset-0 z-0 pointer-events-none">
           <motion.div 
             animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }} 
             transition={{ duration: 10, repeat: Infinity }}
             className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary-500/10 dark:bg-primary-900/20 rounded-full blur-[120px]"
           />
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          className="w-full max-w-[420px] mx-4 relative z-10"
        >
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[2rem] border border-slate-200 dark:border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.1)] dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden relative group">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-primary-500 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
            
            {showMathGame ? (
                <div className="p-6 sm:p-8 md:p-10 space-y-4 sm:space-y-6 text-center relative overflow-hidden">
                    
                    {/* Matrix Digital Rain Effect (Static Visual) */}
                    <div className="absolute inset-0 pointer-events-none opacity-5 overflow-hidden">
                        <div className="animate-pulse text-[10px] font-mono leading-3 text-emerald-500 break-words text-justify p-2 select-none">
                            / x + ∑ ∛ √ ² ³ ≤ ≥ ≠ π μ η α Δ Ω ∞ ½ ¼ 0 1 0 1 1 0 ∞ ∑ π μ η α Δ Ω / x + ∑ ∛ √ ² ³ ≤ ≥ ≠ π μ η α Δ Ω ∞ ½ ¼
                            / x + ∑ ∛ √ ² ³ ≤ ≥ ≠ π μ η α Δ Ω ∞ ½ ¼ 0 1 0 1 1 0 ∞ ∑ π μ η α Δ Ω / x + ∑ ∛ √ ² ³ ≤ ≥ ≠ π μ η α Δ Ω ∞ ½ ¼
                            / x + ∑ ∛ √ ² ³ ≤ ≥ ≠ π μ η α Δ Ω ∞ ½ ¼ 0 1 0 1 1 0 ∞ ∑ π μ η α Δ Ω / x + ∑ ∛ √ ² ³ ≤ ≥ ≠ π μ η α Δ Ω ∞ ½ ¼
                            / x + ∑ ∛ √ ² ³ ≤ ≥ ≠ π μ η α Δ Ω ∞ ½ ¼ 0 1 0 1 1 0 ∞ ∑ π μ η α Δ Ω / x + ∑ ∛ √ ² ³ ≤ ≥ ≠ π μ η α Δ Ω ∞ ½ ¼
                        </div>
                    </div>

                    <button onClick={() => setShowMathGame(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors z-20">
                        <Icon name="X" size={24} />
                    </button>
                    
                    <div className="relative z-10">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl flex items-center justify-center shadow-inner mb-4 border border-blue-500/20">
                            <Icon name="Cpu" size={32} className="text-blue-500 animate-pulse" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-1">Security Challenge</h2>
                        <p className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em]">Advanced Protocol</p>
                    </div>

                    {mathStatus === 'locked' && (
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-6 relative z-10 py-6">
                            <div className="text-red-500 flex justify-center animate-pulse"><Icon name="Skull" size={64} /></div>
                            <div className="bg-red-500/10 border border-red-500/30 p-6 rounded-xl">
                                <h3 className="text-lg font-black text-red-500 uppercase mb-2">System Locked</h3>
                                <p className="text-xs sm:text-sm font-bold text-slate-300 uppercase leading-relaxed">
                                    you are a loser contact admin to request secret key
                                </p>
                            </div>
                            <div className="flex flex-col items-center gap-2">
                                <span className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Retry Available In</span>
                                {mathLockoutTime && <LockoutTimer targetTime={mathLockoutTime} />}
                            </div>
                        </motion.div>
                    )}

                    {mathStatus === 'playing' && (
                        <form onSubmit={verifyMath} className="space-y-4 sm:space-y-6 relative z-10">
                            <div className="py-4 sm:py-6 bg-slate-100 dark:bg-slate-950/80 rounded-xl border border-slate-200 dark:border-slate-800 relative overflow-hidden group">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50"></div>
                                
                                {mathProblem.note && (
                                    <div className="mb-2 sm:mb-3">
                                        <span className="inline-block px-3 py-1 rounded bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-mono font-bold border border-blue-500/20">
                                            {mathProblem.note}
                                        </span>
                                    </div>
                                )}
                                
                                <div className="px-2">
                                    <span className="text-xl sm:text-2xl md:text-3xl font-mono font-black text-slate-800 dark:text-slate-100 tracking-wider break-all leading-tight">
                                        {mathProblem.q} = ?
                                    </span>
                                </div>
                            </div>
                            
                            <div className="flex items-center justify-between px-2">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Input Answer</span>
                                <span className={`text-[10px] font-bold uppercase tracking-widest ${attemptsLeft === 1 ? 'text-red-500 animate-pulse' : 'text-blue-500'}`}>
                                    {attemptsLeft} Attempts Left
                                </span>
                            </div>

                            <input 
                                type="number" 
                                value={mathInput} 
                                onChange={e => setMathInput(e.target.value)} 
                                placeholder="ENTER RESULT" 
                                autoFocus
                                step="any"
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 sm:py-4 font-mono text-lg sm:text-xl font-bold text-center outline-none focus:border-blue-500 transition-colors shadow-inner"
                            />
                            
                            <button type="submit" className="w-full py-3 sm:py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all text-xs sm:text-sm">
                                Verify Calculation
                            </button>
                        </form>
                    )}

                    {mathStatus === 'won' && (
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-6 relative z-10">
                            <div className="text-emerald-500 flex justify-center"><Icon name="CheckCircle" size={48} /></div>
                            <p className="text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-300 px-4">
                                "Intelligence confirmed. Welcome to the inner circle."
                            </p>
                            <div className="bg-emerald-500/10 border border-emerald-500/30 p-4 rounded-xl">
                                <span className="block text-[10px] uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-1">Secret Key</span>
                                <span className="font-mono text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 select-all">Wolfspace</span>
                            </div>
                            <button onClick={copyAndCloseMath} className="w-full py-3 sm:py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-widest rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 text-xs sm:text-sm">
                                <Icon name="Copy" size={18} /> Copy & Enter
                            </button>
                        </motion.div>
                    )}

                    {mathStatus === 'lost' && (
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-10 relative z-10">
                            <div className="text-red-500 flex justify-center mb-4"><Icon name="AlertTriangle" size={48} /></div>
                            <h3 className="text-xl font-black text-red-500 uppercase">Incorrect</h3>
                            <p className="text-xs font-bold text-slate-500 mt-2">Calculation Error. Be careful.</p>
                        </motion.div>
                    )}
                </div>
            ) : (
                <div className="p-8 md:p-10 space-y-8">
                   <div className="text-center">
                      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-950 rounded-[1.5rem] flex items-center justify-center shadow-inner border border-slate-200 dark:border-white/5 mb-6 relative">
                         <div className="absolute inset-0 bg-primary-500/10 rounded-[1.5rem] blur-lg"></div>
                         <Icon name="Lock" size={32} className="text-primary-500 relative z-10 drop-shadow-sm" />
                      </div>
                      <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-1">Restricted Access</h2>
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em]">Security Protocol Alpha</p>
                   </div>
                   <form onSubmit={handleUnlock} className="space-y-4">
                      <div className="relative group/input">
                         <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/input:text-primary-500 transition-colors">
                            <Icon name="Key" size={18} />
                         </div>
                         <input 
                            type="password" 
                            value={password} 
                            onChange={e => setPassword(e.target.value)} 
                            placeholder="ENTER SECRET KEY" 
                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 group-hover/input:border-slate-300 dark:group-hover/input:border-slate-700 focus:border-primary-500/50 rounded-xl pl-12 pr-4 py-4 font-mono text-sm text-slate-900 dark:text-white placeholder:text-slate-400 outline-none transition-all focus:ring-4 focus:ring-primary-500/10 text-center tracking-[0.2em]"
                         />
                      </div>
                      <AnimatePresence>
                        {error && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                            <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg p-2.5 text-center">
                               <p className="text-red-600 dark:text-red-400 text-[10px] font-bold uppercase tracking-wide flex items-center justify-center gap-1.5"><Icon name="Bug" size={12} /> {error}</p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      <div className="space-y-3 pt-2">
                         <button type="submit" className="w-full px-4 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-bold text-[10px] md:text-xs uppercase tracking-wider transition-all shadow-lg shadow-primary-500/25 flex items-center justify-center gap-2 active:scale-95">
                            <Icon name="CheckCircle" size={14} /> Verify Key
                         </button>
                         <button type="button" onClick={startMathGame} className="w-full px-4 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 font-bold text-[10px] md:text-xs uppercase tracking-wider transition-colors text-center flex items-center justify-center gap-2 border border-transparent hover:border-blue-300 dark:hover:border-blue-600">
                            <Icon name="Cpu" size={14} /> Crack Code (Math Game)
                         </button>
                      </div>
                      <Link to="/" className="block text-center text-[10px] font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors mt-4">
                          ← Return Home
                      </Link>
                   </form>
                   <div className="pt-6 border-t border-slate-200 dark:border-slate-800/50 space-y-4">
                      <div className="bg-slate-50 dark:bg-slate-800/30 rounded-lg p-3 border border-slate-200 dark:border-slate-800 flex gap-3 items-start">
                         <Icon name="HelpCircle" size={16} className="text-slate-400 mt-0.5 shrink-0" />
                         <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium">Don't have a secret key? Contact <span className="text-slate-700 dark:text-slate-200 font-bold">Admin</span> via social media.</p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                         <a href={INSTAGRAM_LINK} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-pink-500/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group">
                            <Icon name="Instagram" size={14} className="text-slate-500 group-hover:text-pink-500" />
                            <span className="text-[9px] font-bold text-slate-500 group-hover:text-pink-500 uppercase tracking-wider">Instagram</span>
                         </a>
                         <a href={DISCORD_LINK} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all group">
                            <Icon name="Discord" size={14} className="text-slate-500 group-hover:text-indigo-500" />
                            <span className="text-[9px] font-bold text-slate-500 group-hover:text-indigo-500 uppercase tracking-wider">Discord</span>
                         </a>
                      </div>
                   </div>
                </div>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950 font-sans text-slate-800 dark:text-slate-200 selection:bg-primary-500/30 transition-colors duration-300 overflow-x-hidden">
      
      <div className="fixed top-24 right-4 z-[300] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
            {notifications.map(n => (
                <motion.div
                    key={n.id}
                    initial={{ x: 100, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 100, opacity: 0 }}
                    className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl p-4 rounded-2xl w-[300px] pointer-events-auto flex gap-3 items-start ${n.isAr ? 'rtl' : 'ltr'}`}
                    dir={n.isAr ? 'rtl' : 'ltr'}
                >
                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 text-xl border border-slate-200 dark:border-slate-700">
                        🐺
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-baseline mb-1">
                            <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate">{n.title}</h4>
                            <span className="text-[9px] text-slate-400">{n.time}</span>
                        </div>
                        <p className="text-[10px] text-slate-600 dark:text-slate-300 leading-snug whitespace-pre-line font-medium">
                            {n.text}
                        </p>
                    </div>
                </motion.div>
            ))}
        </AnimatePresence>
      </div>

      <DisclaimerModal open={showDisclaimer} onClose={handleCloseDisclaimer} />

      <AnimatePresence>
        {selectedResource && (
          <ResourceDetailModal 
            item={selectedResource} 
            onClose={() => setSelectedResource(null)} 
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRequestModal && (
            <RequestModal 
                open={showRequestModal} 
                onClose={() => setShowRequestModal(false)} 
                onSubmit={handleRequestSubmit}
                initialTitle={requestModalInitialTitle}
            />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSteamModal && (
            <SteamAccountsModal 
                open={showSteamModal} 
                onClose={() => setShowSteamModal(false)} 
                accounts={steamAccounts} 
            />
        )}
      </AnimatePresence>

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-24 pb-40">
        
        <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-8 mb-12">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
               <div className="px-3 py-1 bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-500/30 rounded-lg flex items-center gap-2 shadow-[0_0_15px_rgba(14,165,233,0.15)]">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                  </span>
                  <span className="text-[10px] font-mono font-bold text-primary-600 dark:text-primary-400 tracking-wider">
                     <span className="hidden sm:inline">SECURE CONNECTION ESTABLISHED</span>
                     <span className="sm:hidden">SECURE</span>
                  </span>
               </div>
               <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-500">
                  <Icon name="Users" size={12} /> {visitorCount.toLocaleString()} 
                  <span className="hidden sm:inline">NODES ACTIVE</span>
                  <span className="sm:hidden">NODES</span>
               </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-none uppercase italic relative">
              Secret 
              <motion.span 
                className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-cyan-300 inline-block ml-2"
                animate={{
                  textShadow: [
                    "0px 0px 0px transparent",
                    "2px 0px 0px rgba(255,0,0,0.8), -2px 0px 0px rgba(0,0,255,0.8)",
                    "0px 0px 0px transparent"
                  ],
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
                Vault
              </motion.span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-xl text-sm md:text-base font-medium leading-relaxed border-l-2 border-slate-300 dark:border-slate-800 pl-4">
              Access high-tier digital assets, exclusive repacks, and premium architectural resources. 
              <span className="text-primary-600 dark:text-primary-500"> For authorized eyes only.</span>
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0">
            <button 
                onClick={() => setShowSteamModal(true)}
                className="relative flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#171a21] to-[#2a475e] hover:to-[#66c0f4] text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 group border border-white/10"
            >
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <Icon name="BrandSteam" size={20} className="group-hover:animate-bounce" /> 
                <span className="relative z-10">Free Accounts</span>
                {steamAccounts.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-3 w-3 z-20">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                )}
            </button>
            <a href={DISCORD_LINK} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 px-6 py-4 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95 group">
               <Icon name="Discord" size={20} className="group-hover:animate-bounce" /> Join Community
            </a>
            <button 
              onClick={() => { localStorage.removeItem('secret_area_unlocked'); setIsUnlocked(false); }} 
              className="px-6 py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-red-500/50 rounded-xl text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-500 transition-all shadow-sm active:scale-95 flex items-center justify-center gap-2 group"
            >
              <Icon name="Lock" size={20} /> <span className="text-xs font-bold uppercase tracking-widest">Logout</span>
            </button>
          </div>
        </header>

        <section className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-primary-600 to-primary-800 rounded-lg shadow-lg shadow-primary-500/20 text-white">
                    <Icon name="Rocket" size={20} />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
                    Upcoming Games <span className="text-primary-500">2026+</span>
                </h2>
             </div>
             
             <div className="flex gap-2 bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
                {['PlayStation 5', 'Xbox S/X', 'Steam'].map((p) => (
                    <button
                        key={p}
                        onClick={() => setUpcomingPlatform(p)}
                        className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wide transition-all whitespace-nowrap ${
                            upcomingPlatform === p 
                            ? 'bg-slate-800 dark:bg-slate-700 text-white shadow-sm' 
                            : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'
                        }`}
                    >
                        {p}
                    </button>
                ))}
             </div>
          </div>
          
          <div className="relative">
             <GameCarousel 
                games={filteredUpcoming} 
                loading={loading}
                errorState={{ missing: isUpcomingMissing, script: scriptError }}
             />
          </div>
        </section>

        <div className="mb-10 w-full flex justify-center">
            <AdBanner 
                desktopSrc={AD_CONFIG.top.desktop} 
                mobileSrc={AD_CONFIG.top.mobile} 
                link={AD_CONFIG.top.link} 
            />
        </div>

        <section className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-lg shadow-lg shadow-emerald-500/20 text-white">
                    <Icon name="Sparkles" size={20} />
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
                    Recent <span className="text-emerald-500">Products</span>
                </h2>
             </div>
          </div>
          
          <div className="relative">
             <RecentProductsCarousel 
                items={recentProducts} 
                loading={loading}
                onSelect={setSelectedResource}
             />
          </div>
        </section>

        <div className="sticky top-20 z-40 mb-10">
           <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 p-2 rounded-2xl shadow-2xl flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between transition-all">
              
              <div className="grid grid-cols-2 sm:flex p-1 bg-slate-100 dark:bg-slate-950 rounded-xl w-full lg:w-auto gap-1 sm:gap-0 shrink-0">
                {(['game', 'steamtools', 'architect', 'extra'] as const).map(tab => (
                  <button 
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`relative px-2 py-2.5 sm:px-6 md:px-8 sm:py-3 rounded-lg font-bold text-[10px] sm:text-xs uppercase tracking-widest transition-all z-10 flex items-center justify-center ${activeTab === tab ? 'text-slate-900 dark:text-white' : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-300'}`}
                  >
                    {activeTab === tab && (
                      <motion.div layoutId="activeTab" className="absolute inset-0 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700" transition={{ type: "spring", bounce: 0.2, duration: 0.6 }} />
                    )}
                    <span className="relative z-10">{tab}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 w-full lg:w-auto lg:flex-1 lg:justify-end min-w-0">
                  <div className="relative flex-1 lg:max-w-[400px] group min-w-0">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary-500 transition-colors">
                      <Icon name="Search" size={18} />
                    </div>
                    <input 
                      type="text" 
                      value={searchQuery} 
                      onChange={e => setSearchQuery(e.target.value)} 
                      placeholder={`SEARCH ${activeTab.toUpperCase()}...`} 
                      className="w-full pl-12 pr-4 py-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/20 text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider placeholder:text-slate-400 dark:placeholder:text-slate-600 transition-all truncate"
                    />
                  </div>
                  
                  <button 
                    onClick={fetchData}
                    className="flex items-center justify-center p-3.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl transition-all shrink-0"
                    title="Reload Data"
                  >
                    <Icon name="RefreshCw" size={20} className={loading ? "animate-spin" : ""} />
                  </button>

                  <button 
                    onClick={() => {
                        setRequestModalInitialTitle(searchQuery);
                        setShowRequestModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all shrink-0 whitespace-nowrap"
                    title="Request a game or tool not listed here"
                  >
                    <Icon name="Plus" size={20} />
                    <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                        <span className="inline sm:hidden">Request</span>
                        <span className="hidden sm:inline">Request Item</span>
                    </span>
                  </button>
              </div>
           </div>
        </div>

        <div className="min-h-[50vh]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-[50vh] text-slate-500">
               <div className="w-16 h-16 border-4 border-slate-200 dark:border-slate-800 border-t-primary-500 rounded-full animate-spin mb-6"></div>
               <p className="font-mono text-xs uppercase tracking-[0.2em] animate-pulse">Decrypting Data Stream...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[50vh] text-slate-500">
               <div className="p-6 bg-white dark:bg-slate-900 rounded-full mb-6 shadow-sm">
                 <Icon name="Database" size={40} className="opacity-20" />
               </div>
               <h3 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-tight mb-1">No Data Found</h3>
               <p className="text-slate-500 text-xs mb-6">Try adjusting your search or category.</p>
               <button 
                 onClick={() => {
                    setRequestModalInitialTitle(searchQuery);
                    setShowRequestModal(true);
                 }}
                 className="px-6 py-2.5 bg-blue-600 text-white font-bold uppercase tracking-wider text-xs rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
               >
                 Request This Item
               </button>
            </div>
          ) : (
            <div className="space-y-12">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedData.map((item, idx) => (
                      <motion.div 
                          layout
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          whileHover={{ y: -8, transition: { duration: 0.2 } }}
                          className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-primary-900/10 hover:border-primary-500/30 transition-all relative flex flex-col"
                          onClick={() => setSelectedResource(item)}
                      >
                          <div className="aspect-[3/4] relative overflow-hidden bg-slate-100 dark:bg-slate-950">
                            <img src={item.coverImage} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-90"></div>
                            {item.isPinned && (
                                <div className="absolute top-3 left-3 z-20">
                                    <div className="bg-yellow-500 text-white p-1.5 rounded-lg shadow-lg border border-white/20">
                                        <Icon name="Pin" size={16} />
                                    </div>
                                </div>
                            )}
                            {item.category === 'steamtools' ? (
                                <>
                                    {item.gameId && (
                                        <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-md rounded-md border border-white/10 text-[10px] font-mono font-bold text-white shadow-sm">
                                            ID: {item.gameId}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 dark:bg-black/60 backdrop-blur-md rounded-md border border-slate-200 dark:border-white/10 text-[10px] font-mono font-bold text-primary-600 dark:text-primary-400">
                                    {item.repackSize}
                                </div>
                            )}
                            <div className={`absolute top-3 ${item.isPinned ? 'left-12' : 'left-3'} px-2 py-1 bg-primary-600 text-white rounded-md text-[10px] font-black uppercase tracking-wider shadow-lg transition-all`}>
                              {item.id}
                            </div>
                            {item.isFree && (
                                <div className="absolute top-10 right-3 px-2 py-1 bg-emerald-500 text-white rounded-md text-[10px] font-black uppercase tracking-wider shadow-lg flex items-center gap-1 z-20">
                                    <Icon name="Tag" size={12} /> Free
                                </div>
                            )}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
                               <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center text-white shadow-[0_0_20px_rgba(14,165,233,0.5)] transform scale-50 group-hover:scale-100 transition-transform duration-300">
                                  <Icon name="ArrowRight" size={24} />
                               </div>
                            </div>
                            
                            <div className="absolute bottom-0 left-0 right-0 p-5 z-20">
                                <h3 className="font-black text-lg text-white leading-tight uppercase italic mb-2 line-clamp-2 group-hover:text-primary-400 transition-colors drop-shadow-md">
                                  {item.name}
                                </h3>
                                <div className="flex items-center justify-between border-t border-white/20 pt-3 mt-1">
                                  <span className="text-[10px] text-slate-200 font-mono font-bold bg-black/40 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10">{item.version}</span>
                                  <span className="text-[10px] font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1 drop-shadow-sm">
                                     Details <Icon name="ChevronRight" size={12} />
                                  </span>
                                </div>
                            </div>
                          </div>
                      </motion.div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex flex-col items-center gap-6 py-10 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center gap-2 sm:gap-4 bg-white dark:bg-slate-900 p-2 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-full overflow-x-auto no-scrollbar">
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="p-2 sm:p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 transition-all hover:bg-slate-200 dark:hover:bg-slate-700 shrink-0"
                    >
                      <Icon name="ChevronLeft" size={20} />
                    </button>
                    
                    <div className="flex gap-1 sm:gap-2">
                      {(() => {
                          let pages = [];
                          if (totalPages <= 5) {
                             pages = Array.from({ length: totalPages }, (_, i) => i + 1);
                          } else {
                             if (currentPage <= 3) pages = [1, 2, 3, '...', totalPages];
                             else if (currentPage >= totalPages - 2) pages = [1, '...', totalPages - 2, totalPages - 1, totalPages];
                             else pages = [1, '...', currentPage, '...', totalPages];
                          }
                          
                          return pages.map((page, idx) => (
                            typeof page === 'number' ? (
                                <button
                                  key={idx}
                                  onClick={() => setCurrentPage(page)}
                                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl font-bold text-[10px] sm:text-xs transition-all shrink-0 ${currentPage === page ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/50' : 'bg-slate-50 dark:bg-slate-950 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'}`}
                                >
                                  {page}
                                </button>
                            ) : (
                                <span key={idx} className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center text-slate-400 text-xs font-bold select-none shrink-0">...</span>
                            )
                          ));
                      })()}
                    </div>

                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="p-2 sm:p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white disabled:opacity-30 transition-all hover:bg-slate-200 dark:hover:bg-slate-700 shrink-0"
                    >
                      <Icon name="ChevronRight" size={20} />
                    </button>
                  </div>
                  <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                    Sector {currentPage} / {totalPages}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="mt-8 mb-4 w-full flex justify-center">
            <AdBanner 
                desktopSrc={AD_CONFIG.bottom.desktop} 
                mobileSrc={AD_CONFIG.bottom.mobile} 
                link={AD_CONFIG.bottom.link} 
            />
        </div>

      </div>
    </div>
  );
};

export default SecretArea;
