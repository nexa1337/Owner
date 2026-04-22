import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SiWolframlanguage } from 'react-icons/si';
import Icon from './Icon';

interface Comment {
  id: string;
  itemId: string;
  author: string;
  text: string;
  tags: string[];
  reactions: {
    like: number;
    dislike: number;
    love: number;
  };
  timestamp: string;
}

const AVAILABLE_TAGS = [
  "Masterpiece 🏆", "Buggy 🐛", "Hidden Gem 💎", 
  "Nostalgia 🕰️", "Overrated 📉", "Must Play 🔥",
  "Great Story 📖", "Hardcore 💀", "Chill ☕"
];

const FAKE_NAMES = ['Ghost_Protocol', 'Ahmed_DZ', 'Simox1337', 'LeHacker99', 'Carlos_Dev', 'Ivan_B', 'Wang_Wei', 'Kenji_San', 'Min_Jae', 'ShadowWolf', 'Kira99', 'Youssef_DZ', 'Sakura_01'];
const FAKE_TEXTS = [
  { lang: 'en', text: 'Works perfectly! Thanks for the upload.' },
  { lang: 'ar', text: 'شغال 100%، شكرا جزيلا على المجهود' },
  { lang: 'darija', text: 'nadi canadi khouya, lay 7fdek' },
  { lang: 'fr', text: 'Super, installation très facile. Merci!' },
  { lang: 'es', text: '¡Funciona de maravilla! Saludos desde España.' },
  { lang: 'ru', text: 'Всё работает отлично, спасибо автору!' },
  { lang: 'zh', text: '非常感谢，下载速度很快，完美运行！' },
  { lang: 'ja', text: '完璧に動作しました。ありがとうございます！' },
  { lang: 'ko', text: '잘 작동합니다. 공유해주셔서 감사합니다!' },
  { lang: 'en', text: 'Been looking for this everywhere. You are a lifesaver.' },
  { lang: 'ar', text: 'أسطورة، جاري التحميل والتجربة' },
  { lang: 'darija', text: 'tbarkellah 3lik a sat, dima top' }
];

function seededRandom(seed: number) {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
}

const API_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxbQKmoUUH4KzLmkAYZMGpoORPDTFYTzqCpnScEFIw5ngQ1cgzvFWU5fq0OXe2M5Ref/exec';

export const CommentsSection: React.FC<{ itemId: string }> = ({ itemId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fakeComments = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < itemId.length; i++) hash = itemId.charCodeAt(i) + ((hash << 5) - hash);
    
    const numFakes = Math.floor(seededRandom(hash) * 4) + 2; // 2 to 5 comments
    const fakes: Comment[] = [];
    
    for (let i = 0; i < numFakes; i++) {
        const seed = hash + i * 100;
        const nameIdx = Math.floor(seededRandom(seed) * FAKE_NAMES.length);
        const textIdx = Math.floor(seededRandom(seed + 1) * FAKE_TEXTS.length);
        const tagIdx = Math.floor(seededRandom(seed + 2) * AVAILABLE_TAGS.length);
        
        const daysAgo = Math.floor(seededRandom(seed + 3) * 30) + 1;
        const d = new Date();
        d.setDate(d.getDate() - daysAgo);

        fakes.push({
            id: `fake-${itemId}-${i}`,
            itemId,
            author: FAKE_NAMES[nameIdx],
            text: FAKE_TEXTS[textIdx].text,
            tags: [AVAILABLE_TAGS[tagIdx]],
            reactions: {
                like: Math.floor(seededRandom(seed + 4) * 50) + 5,
                dislike: Math.floor(seededRandom(seed + 5) * 3),
                love: Math.floor(seededRandom(seed + 6) * 20) + 1
            },
            timestamp: d.toISOString()
        });
    }
    
    return fakes.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [itemId]);

  // Load comments
  useEffect(() => {
    const loadComments = async () => {
      setFetching(true);
      let loadedComments: Comment[] = [];
      try {
        // Try fetching from Google Sheet
        const response = await fetch(`${API_ENDPOINT}?action=getComments&itemId=${itemId}`);
        if (response.ok) {
          const data = await response.json();
          if (data && data.comments) {
            loadedComments = data.comments;
          }
        }
      } catch (error) {
        console.warn("Google Script not updated yet, falling back to local storage.");
      }

      // Fallback to local storage if script fails or isn't updated
      if (loadedComments.length === 0) {
          const localData = localStorage.getItem(`comments_${itemId}`);
          if (localData) {
            loadedComments = JSON.parse(localData);
          }
      }
      
      // Merge real and fake comments, sort by date
      const allComments = [...loadedComments, ...fakeComments].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setComments(allComments);
      setFetching(false);
    };

    loadComments();
  }, [itemId, fakeComments]);

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag].slice(0, 3) // Max 3 tags
    );
  };

  const handleReaction = async (commentId: string, type: 'like' | 'dislike' | 'love') => {
    // Optimistic update
    const updatedComments = comments.map(c => {
      if (c.id === commentId) {
        return { ...c, reactions: { ...c.reactions, [type]: c.reactions[type] + 1 } };
      }
      return c;
    });
    setComments(updatedComments);
    localStorage.setItem(`comments_${itemId}`, JSON.stringify(updatedComments));

    // Try sending to Google Sheet
    try {
      await fetch(API_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({ action: 'reactComment', commentId, type }),
      });
    } catch (e) {
      // Ignore errors if script isn't updated
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setLoading(true);
    const commentData: Comment = {
      id: Date.now().toString(),
      itemId,
      author: authorName.trim() || 'Anonymous Wolf',
      text: newComment.trim(),
      tags: selectedTags,
      reactions: { like: 0, dislike: 0, love: 0 },
      timestamp: new Date().toISOString(),
    };

    const updatedComments = [commentData, ...comments];
    setComments(updatedComments);
    localStorage.setItem(`comments_${itemId}`, JSON.stringify(updatedComments));

    try {
      await fetch(API_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({ action: 'addComment', comment: commentData }),
      });
    } catch (error) {
      console.warn("Failed to save to Google Sheet, saved locally.");
    }

    setNewComment('');
    setSelectedTags([]);
    setLoading(false);
  };

  return (
    <div className="mt-8 border-t border-slate-200 dark:border-slate-800 pt-8">
      <h3 className="text-xl font-black uppercase tracking-wider text-slate-900 dark:text-white mb-6 flex items-center gap-2">
        <Icon name="MessageSquare" size={24} className="text-blue-500" /> 
        Intel Reviews & Chatter
      </h3>

      {/* Add Comment Form */}
      <form onSubmit={handleSubmit} className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-4 sm:p-6 border border-slate-200 dark:border-slate-800 mb-8">
        <div className="flex gap-4 mb-4">
          <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-300 dark:border-slate-700">
            <SiWolframlanguage size={20} className="text-slate-700 dark:text-slate-300" />
          </div>
          <div className="flex-1">
            <input 
              type="text" 
              placeholder="Your Alias (Optional)..." 
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className="w-full bg-transparent border-b border-slate-300 dark:border-slate-700 pb-2 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors mb-4 placeholder:text-slate-400"
              maxLength={20}
            />
            <textarea
              placeholder="Drop your intel, review, or funny thoughts here..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
              rows={3}
              className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500 transition-colors resize-none"
            />
          </div>
        </div>

        {/* Tags Selection */}
        <div className="mb-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tag this Intel (Max 3):</p>
          <div className="flex flex-wrap gap-2">
            {AVAILABLE_TAGS.map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-bold transition-all ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20 scale-105'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={loading || !newComment.trim()}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? <Icon name="Loader" size={16} className="animate-spin" /> : <Icon name="Send" size={16} />}
            Post Intel
          </button>
        </div>
      </form>

      {/* Comments List */}
      <div className="space-y-4">
        {fetching ? (
          <div className="flex justify-center py-8">
            <Icon name="Loader" size={24} className="text-blue-500 animate-spin" />
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-10 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
            <SiWolframlanguage size={40} className="mx-auto text-slate-300 dark:text-slate-700 mb-3 opacity-50" />
            <p className="text-sm font-bold text-slate-500">No intel dropped yet. Be the first wolf to howl!</p>
          </div>
        ) : (
          <AnimatePresence>
            {comments.map((comment) => (
              <motion.div 
                key={comment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm"
              >
                <div className="flex gap-3 sm:gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 shadow-inner">
                    <SiWolframlanguage size={20} className="text-slate-800 dark:text-slate-200" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
                      <h4 className="font-black text-sm text-slate-900 dark:text-white truncate">
                        {comment.author}
                      </h4>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        {new Date(comment.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {comment.tags && comment.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {comment.tags.map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md text-[9px] font-bold uppercase tracking-wider border border-slate-200 dark:border-slate-700">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap break-words leading-relaxed mb-3">
                      {comment.text}
                    </p>

                    {/* Reactions */}
                    <div className="flex items-center gap-2 sm:gap-3">
                      <button 
                        onClick={() => handleReaction(comment.id, 'like')}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 transition-colors border border-slate-200 dark:border-slate-700/50"
                      >
                        👍 <span>{comment.reactions?.like || 0}</span>
                      </button>
                      <button 
                        onClick={() => handleReaction(comment.id, 'dislike')}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-400 transition-colors border border-slate-200 dark:border-slate-700/50"
                      >
                        👎 <span>{comment.reactions?.dislike || 0}</span>
                      </button>
                      <button 
                        onClick={() => handleReaction(comment.id, 'love')}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-lg text-xs font-bold text-rose-600 dark:text-rose-400 transition-colors border border-rose-200 dark:border-rose-500/20"
                      >
                        ❤️ <span>{comment.reactions?.love || 0}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
