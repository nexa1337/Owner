
import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { jsPDF } from "jspdf";
import Icon from '../components/Icon';

// --- TYPES ---
interface Note {
  id: number;
  title: string;
  text: string;
  date: string;
  color: string;
}

interface WishItem {
  id: number;
  name: string;
  price: number;
  type: 'waiting' | 'bought';
  icon: string;
  priority: 'High' | 'Medium' | 'Low';
  fundSource: 'personal' | 'safe' | 'invest';
  url?: string;
  dateAdded: string;
}

interface ExpenseItem {
  id: string;
  label: string;
  cost: number;
  paid: boolean;
  icon: string;
  category: 'fixed' | 'lifestyle';
}

interface VisionGoal {
  id: number;
  label: string;
  done: boolean;
}

interface VisionArea {
  id: string;
  title: string;
  icon: string;
  color: string;
  goals: VisionGoal[];
}

// --- CONSTANTS ---
const FINANCIAL_PHASES = [
    { limit: 4000, name: "Survival Mode", color: "red", bg: "bg-red-500", text: "text-red-500", icon: "Skull", desc: "Focus on basics. Cut everything unnecessary." },
    { limit: 8000, name: "Foundation", color: "orange", bg: "bg-orange-500", text: "text-orange-500", icon: "Hammer", desc: "Building the base. Safety net is priority." },
    { limit: 15000, name: "Growth", color: "yellow", bg: "bg-yellow-500", text: "text-yellow-500", icon: "TrendingUp", desc: "Accelerating. Time to invest heavily." },
    { limit: Infinity, name: "Freedom", color: "emerald", bg: "bg-emerald-500", text: "text-emerald-500", icon: "Rocket", desc: "The world is yours. Optimize and enjoy." }
];

const FINANCIAL_WISDOM = {
    survival: [
        { text: "The Richest Man in Babylon: 'A part of all you earn is yours to keep.' Save 10% even if it hurts. In Morocco, call it 'Dwa d Zman'.", source: "The Richest Man in Babylon" },
        { text: "Rich Dad: 'The poor and middle class work for money.' Right now, you are working for money. Keep costs low to start buying freedom.", source: "Rich Dad Poor Dad" },
        { text: "Stop trying to look rich. A new phone on credit is a liability. If it doesn't put money in your pocket, don't buy it.", source: "Common Sense" }
    ],
    foundation: [
        { text: "Psychology of Money: 'Wealth is what you don't see.' Wealth is the nice car not purchased. The diamonds not bought. Build your safety net silently.", source: "The Psychology of Money" },
        { text: "Rich Dad: 'Assets put money in your pocket. Liabilities take money out.' A Dacia depreciates. A stock dividend pays you. Know the difference.", source: "Rich Dad Poor Dad" },
        { text: "Pay yourself first. Before paying Lydec, Orange, or the cafe, route money to your savings account automatically.", source: "The Richest Man in Babylon" }
    ],
    growth: [
        { text: "Atomic Habits of Money: Small 1% improvements in your investment portfolio compound over time. Don't rush for the 'Hamza', look for consistency.", source: "James Clear (Adapted)" },
        { text: "Rich Dad: 'Mind your own business.' Your job pays the bills, but your investments build your empire. Focus on the latter.", source: "Rich Dad Poor Dad" },
        { text: "Don't increase your lifestyle just because your salary increased. That's the 'Rat Race' trap. Invest the difference.", source: "Rich Dad Poor Dad" }
    ],
    freedom: [
        { text: "Psychology of Money: 'Control over your time is the highest dividend money pays.' You are not buying things anymore, you are buying time.", source: "The Psychology of Money" },
        { text: "Diversify. Real Estate in Tangier, Stocks in Casablanca, Crypto in the cloud. Never keep all your eggs in one basket.", source: "General Wisdom" },
        { text: "The purpose of wealth is freedom, not showing off. Be the 'Moul Chekara' who wears simple clothes but owns the building.", source: "Moroccan Wisdom" }
    ]
};

// --- STRATEGY DATA ---
const STRATEGIES = [
  {
    max: 4500,
    phase: "Survival & Foundation",
    color: "text-orange-500",
    description: "You are in the foundational phase. Capital is tight. Your primary goal is to increase your value in the marketplace while keeping costs strictly low.",
    actions: [
      "Learn English: This is the highest ROI skill for you right now.",
      "Tech Skills: Start learning Python, Design, or basic IT support.",
      "Side Hustle: Use weekends for Freelancing or simple services.",
      "Emergency Fund: Try to save 100-300 DH/month no matter what."
    ],
    tools: ["YouTube (Free Education)", "Notion (Organize Life)", "Canva (Sell Designs)"]
  },
  {
    max: 8000,
    phase: "Stability & Skill Stacking",
    color: "text-blue-500",
    description: "You have reached stability. Now you must specialize. Don't get comfortable; this is the trap zone where many stop growing.",
    actions: [
      "Certification: Get a recognized certificate (Google, Meta, Cisco).",
      "Invest in Yourself: Buy better equipment (Laptop, Internet).",
      "Networking: Optimize LinkedIn profile, connect with recruiters.",
      "Savings: Automate 10% of income to a savings account."
    ],
    tools: ["LinkedIn Learning", "Coursera", "Upwork (Global Freelancing)"]
  },
  {
    max: 16000,
    phase: "Growth & Optimization",
    color: "text-emerald-500",
    description: "You are earning a respectable income. The focus shifts from 'working harder' to 'working smarter' and managing assets.",
    actions: [
      "Invest: Start putting money into Stocks or low-risk funds.",
      "Outsource: Pay for cleaning/services to buy back your time.",
      "High-Value Skills: Learn Management, Sales, or AI Automation.",
      "Health: Invest in a gym membership and quality food."
    ],
    tools: ["Interactive Brokers / Local Bank App", "N8N (Automation)", "Audible (Books)"]
  },
  {
    max: 999999,
    phase: "Wealth & Freedom",
    color: "text-purple-500",
    description: "High income territory. Your money should work for you. Focus on tax optimization, business creation, and legacy.",
    actions: [
      "Business: Transition from employee to business owner/investor.",
      "Real Estate: Look for property investment opportunities.",
      "Diversify: Don't keep all cash in one currency or bank.",
      "Mentorship: Pay for access to high-level networks."
    ],
    tools: ["Real Estate Agencies", "Tax Consultant", "Private Banking"]
  }
];

// --- MOROCCAN SALARY RANGES ---
const SALARY_RANGES = {
  min: [2500, 3000, 3500, 4000, 4500, 5000],
  avg: [6000, 8000, 10000, 12000, 14000, 16000],
  high: [20000, 30000, 40000, 55000]
};

const NOTE_COLORS = [
  'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700/50',
  'bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700/50',
  'bg-emerald-100 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-700/50',
  'bg-purple-100 dark:bg-purple-900/20 border-purple-200 dark:border-purple-700/50',
];

// --- HELPER: AUTO ICON ---
const getSmartIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('car') || n.includes('bmw') || n.includes('mercedes') || n.includes('audi') || n.includes('peugeot') || n.includes('volkswagen') || n.includes('vw')) return 'Car';
    if (n.includes('house') || n.includes('home') || n.includes('apartment') || n.includes('villa')) return 'Home';
    if (n.includes('macbook') || n.includes('laptop') || n.includes('pc') || n.includes('computer') || n.includes('desktop') || n.includes('msi')) return 'DeviceDesktop';
    if (n.includes('phone') || n.includes('iphone') || n.includes('samsung') || n.includes('android') || n.includes('redmi')) return 'DeviceMobile';
    if (n.includes('camera') || n.includes('sony') || n.includes('canon')) return 'Camera';
    if (n.includes('watch') || n.includes('rolex')) return 'Clock';
    if (n.includes('bike') || n.includes('motor') || n.includes('honda') || n.includes('suzuki') || n.includes('yamaha') || n.includes('helmet') || n.includes('jacket') || n.includes('gloves')) return 'Bike';
    if (n.includes('shoe') || n.includes('nike') || n.includes('clothes') || n.includes('mask') || n.includes('bag')) return 'ShoppingBag';
    if (n.includes('playstation') || n.includes('ps4') || n.includes('ps5') || n.includes('xbox') || n.includes('game') || n.includes('steering')) return 'Gamepad';
    if (n.includes('tv') || n.includes('monitor') || n.includes('screen')) return 'Monitor';
    if (n.includes('license') || n.includes('permis')) return 'FileText';
    if (n.includes('headphone') || n.includes('chair')) return 'ShoppingBag';
    return 'ShoppingBag'; // Default
};

// --- COMPONENT ---
const PersonalFinance: React.FC = () => {
  const [locked, setLocked] = useState(() => sessionStorage.getItem('admin_unlocked') !== 'true');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [activeTab, setActiveTab] = useState<'finance' | 'mind' | 'market'>('finance');
  const [pendingTab, setPendingTab] = useState<'finance' | 'mind' | 'market' | null>(null);

  // --- FINANCE STATE ---
  const [salary, setSalary] = useState(3000);
  const [totalSaved, setTotalSaved] = useState(0); // For emergency fund calc
  
  // Smart Connected Expenses
  const [expenses, setExpenses] = useState<ExpenseItem[]>([
    { id: 'rent', label: 'Rent / Housing', cost: 0, paid: false, icon: 'Home', category: 'fixed' },
    { id: 'food', label: 'Food & Groceries', cost: 0, paid: false, icon: 'ShoppingBag', category: 'fixed' },
    { id: 'transport', label: 'Transport', cost: 200, paid: false, icon: 'Car', category: 'fixed' },
    { id: 'internet', label: 'Internet / Phone', cost: 300, paid: false, icon: 'Wifi', category: 'fixed' },
    { id: 'gym', label: 'Gym & Health', cost: 250, paid: false, icon: 'Activity', category: 'lifestyle' },
    { id: 'subs', label: 'Subscriptions', cost: 100, paid: false, icon: 'CreditCard', category: 'lifestyle' },
  ]);

  // --- NOTES STATE ---
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem('nexa_admin_notes');
    return saved ? JSON.parse(saved) : [];
  });
  const [noteSearch, setNoteSearch] = useState('');
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteText, setNewNoteText] = useState('');

  // --- VISION STATE ---
  const [vision, setVision] = useState<VisionArea[]>(() => {
    const saved = localStorage.getItem('nexa_admin_vision');
    const parsed = saved ? JSON.parse(saved) : null;
    if (parsed) return parsed.map((v: any) => ({ ...v, goals: v.goals.map((g: any) => ({ ...g, id: g.id || Date.now() + Math.random() })) }));

    return [
      {
        id: 'work',
        title: 'Career & Mastery',
        icon: 'Briefcase',
        color: 'blue',
        goals: [
          { id: 1, label: 'Secure Senior Job Position', done: false },
          { id: 2, label: 'Master 3ds Max & Revit', done: false }
        ]
      },
      {
        id: 'health',
        title: 'Bio-Hacking & Style',
        icon: 'Heart',
        color: 'red',
        goals: [
          { id: 6, label: 'Aesthetic Body (Low BF%)', done: false }
        ]
      },
      {
        id: 'hobbies',
        title: 'High-Octane Lifestyle',
        icon: 'Bike',
        color: 'orange',
        goals: [
          { id: 11, label: 'Own a Super Sport Bike', done: false }
        ]
      },
      {
        id: 'business',
        title: 'Empire Building',
        icon: 'Building',
        color: 'emerald',
        goals: [
          { id: 14, label: 'Launch Digital Business', done: false }
        ]
      }
    ];
  });
  const [newGoalInputs, setNewGoalInputs] = useState<Record<string, string>>({});

  // --- WISHLIST STATE ---
  const [wishlist, setWishlist] = useState<WishItem[]>(() => {
    const saved = localStorage.getItem('nexa_admin_wishlist');
    return saved ? JSON.parse(saved) : [
        // WAITING LIST - BIKES
        { id: 1, name: 'Suzuki GSXR 750', price: 90000, type: 'waiting', icon: 'Bike', priority: 'High', fundSource: 'safe', url: 'https://biker.ma', dateAdded: '02/03/2026' },
        { id: 2, name: 'Honda CBR 600 RR', price: 60000, type: 'waiting', icon: 'Bike', priority: 'High', fundSource: 'safe', url: 'https://biker.ma', dateAdded: '02/03/2026' },
        { id: 3, name: 'Honda Hornet', price: 49000, type: 'waiting', icon: 'Bike', priority: 'Medium', fundSource: 'safe', url: 'https://biker.ma', dateAdded: '02/03/2026' },
        
        // WAITING LIST - VEHICLES
        { id: 4, name: 'Peugeot 308 CC / VW EOS', price: 100000, type: 'waiting', icon: 'Car', priority: 'High', fundSource: 'safe', dateAdded: '02/03/2026' },
        
        // WAITING LIST - GAMING & TECH
        { id: 5, name: 'Gaming Desktop Setup', price: 35000, type: 'waiting', icon: 'DeviceDesktop', priority: 'High', fundSource: 'personal', dateAdded: '02/03/2026' },
        { id: 6, name: 'iPhone 15 Pro Max (256GB)', price: 17500, type: 'waiting', icon: 'DeviceMobile', priority: 'High', fundSource: 'personal', dateAdded: '02/03/2026' },
        { id: 7, name: 'PlayStation 5 Pro', price: 8000, type: 'waiting', icon: 'Gamepad', priority: 'High', fundSource: 'personal', dateAdded: '02/03/2026' },
        { id: 8, name: 'Xbox Series X', price: 7500, type: 'waiting', icon: 'Gamepad', priority: 'Medium', fundSource: 'personal', dateAdded: '02/03/2026' },
        { id: 9, name: 'TCL C745 TV', price: 6200, type: 'waiting', icon: 'Monitor', priority: 'Medium', fundSource: 'personal', dateAdded: '02/03/2026' },
        { id: 10, name: 'Xtrmlab RSC1-500 Chair', price: 5000, type: 'waiting', icon: 'ShoppingBag', priority: 'Low', fundSource: 'personal', dateAdded: '02/03/2026' },
        { id: 11, name: 'Gaming Steering Wheel', price: 4000, type: 'waiting', icon: 'Gamepad', priority: 'Low', fundSource: 'personal', dateAdded: '02/03/2026' },
        { id: 12, name: 'PS4 Pro Flashi 1TB (v7216)', price: 3200, type: 'waiting', icon: 'Gamepad', priority: 'Low', fundSource: 'personal', dateAdded: '02/03/2026' },
        { id: 13, name: 'PC Monitor', price: 2500, type: 'waiting', icon: 'Monitor', priority: 'Medium', fundSource: 'personal', dateAdded: '02/03/2026' },
        { id: 14, name: 'Gaming Headphone', price: 1000, type: 'waiting', icon: 'ShoppingBag', priority: 'Low', fundSource: 'personal', dateAdded: '02/03/2026' },

        // WAITING LIST - BIKER GEAR
        { id: 15, name: 'Biker Helmet (Agv/Shoei)', price: 4000, type: 'waiting', icon: 'Bike', priority: 'Medium', fundSource: 'personal', dateAdded: '02/03/2026' },
        { id: 16, name: 'Biker Jacket', price: 2500, type: 'waiting', icon: 'Bike', priority: 'Medium', fundSource: 'personal', dateAdded: '02/03/2026' },
        { id: 17, name: 'Biker Backpack', price: 2000, type: 'waiting', icon: 'ShoppingBag', priority: 'Low', fundSource: 'personal', dateAdded: '02/03/2026' },
        { id: 18, name: 'Leg Bag Moto', price: 350, type: 'waiting', icon: 'ShoppingBag', priority: 'Low', fundSource: 'personal', dateAdded: '02/03/2026' },
        { id: 19, name: 'Mask Cagoule', price: 250, type: 'waiting', icon: 'ShoppingBag', priority: 'Low', fundSource: 'personal', dateAdded: '02/03/2026' },
        { id: 20, name: 'Super Moto Gloves', price: 250, type: 'waiting', icon: 'ShoppingBag', priority: 'Low', fundSource: 'personal', dateAdded: '02/03/2026' },

        // PURCHASED LIST
        { id: 21, name: 'MSI Thin GF63', price: 15000, type: 'bought', icon: 'DeviceDesktop', priority: 'High', fundSource: 'personal', dateAdded: '01/01/2024' },
        { id: 22, name: 'Car License (Permis B)', price: 3000, type: 'bought', icon: 'FileText', priority: 'High', fundSource: 'personal', dateAdded: '01/06/2023' },
        { id: 23, name: 'Sport Bike License (Permis A)', price: 2500, type: 'bought', icon: 'FileText', priority: 'High', fundSource: 'personal', dateAdded: '01/06/2023' },
        { id: 24, name: 'Redmi 12', price: 1800, type: 'bought', icon: 'DeviceMobile', priority: 'Medium', fundSource: 'personal', dateAdded: '01/01/2024' }
    ];
  });
  const [newItem, setNewItem] = useState<{name: string, price: string, priority: string, fundSource: 'personal'|'safe'|'invest', url: string}>({ 
      name: '', 
      price: '', 
      priority: 'Medium', 
      fundSource: 'personal', // Default to personal fund
      url: '' 
  });
  const [marketFilter, setMarketFilter] = useState<'all' | 'high' | 'waiting' | 'bought'>('all');

  // --- EFFECTS ---
  useEffect(() => localStorage.setItem('nexa_admin_notes', JSON.stringify(notes)), [notes]);
  useEffect(() => localStorage.setItem('nexa_admin_wishlist', JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => localStorage.setItem('nexa_admin_vision', JSON.stringify(vision)), [vision]);

  // --- AUTH HANDLERS ---
  const handleTabClick = (tab: 'finance' | 'mind' | 'market') => {
    if (tab === 'finance') {
        setActiveTab(tab);
        return;
    }
    if (locked) {
        setPendingTab(tab);
        setShowAuthModal(true);
    } else {
        setActiveTab(tab);
    }
  };

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Marouan.anouar1') {
      setLocked(false);
      sessionStorage.setItem('admin_unlocked', 'true');
      setShowAuthModal(false);
      if (pendingTab) {
          setActiveTab(pendingTab);
          setPendingTab(null);
      }
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  };

  const updateExpense = (id: string, field: keyof ExpenseItem, value: any) => {
    setExpenses(prev => prev.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  // --- NOTE/VISION/WISH HANDLERS (Standard) ---
  const toggleVisionGoal = (areaId: string, goalId: number) => {
    setVision(prev => prev.map(area => {
        if (area.id !== areaId) return area;
        const newGoals = area.goals.map(g => g.id === goalId ? { ...g, done: !g.done } : g);
        return { ...area, goals: newGoals };
    }));
  };

  const addVisionGoal = (areaId: string) => {
    const text = newGoalInputs[areaId];
    if (!text?.trim()) return;
    setVision(prev => prev.map(area => {
        if (area.id !== areaId) return area;
        return { ...area, goals: [...area.goals, { id: Date.now(), label: text, done: false }] };
    }));
    setNewGoalInputs(prev => ({ ...prev, [areaId]: '' }));
  };

  const deleteVisionGoal = (areaId: string, goalId: number) => {
    setVision(prev => prev.map(area => {
        if (area.id !== areaId) return area;
        return { ...area, goals: area.goals.filter(g => g.id !== goalId) };
    }));
  };

  const addNote = () => {
    if (!newNoteText.trim() && !newNoteTitle.trim()) return;
    const randomColor = NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)];
    setNotes([{ 
      id: Date.now(), 
      title: newNoteTitle || 'Untitled Idea',
      text: newNoteText, 
      date: new Date().toLocaleDateString(),
      color: randomColor
    }, ...notes]);
    setNewNoteTitle('');
    setNewNoteText('');
  };

  const deleteNote = (id: number) => setNotes(notes.filter(n => n.id !== id));

  const addWishItem = () => {
    if (!newItem.name) return;
    setWishlist([...wishlist, { 
      id: Date.now(), 
      name: newItem.name, 
      price: Number(newItem.price) || 0, 
      type: 'waiting', 
      icon: getSmartIcon(newItem.name), // Auto icon
      priority: newItem.priority as any,
      fundSource: newItem.fundSource, // Added Fund Link
      url: newItem.url,
      dateAdded: new Date().toLocaleDateString()
    }]);
    setNewItem({ name: '', price: '', priority: 'Medium', fundSource: 'personal', url: '' });
  };

  const toggleWishItem = (id: number) => {
    setWishlist(wishlist.map(item => 
      item.id === id ? { ...item, type: item.type === 'waiting' ? 'bought' : 'waiting' } : item
    ));
  };

  const deleteWishItem = (id: number) => setWishlist(wishlist.filter(item => item.id !== id));

  // --- CALCULATIONS & LOGIC ---
  const getDistribution = (amount: number) => {
    if (amount <= 4000) {
      return { safe: 5, invest: 5, emergency: 10, parents: 20, personal: 60 }; // Survival
    } else if (amount <= 8000) {
      return { safe: 10, invest: 15, emergency: 10, parents: 15, personal: 50 }; // Stability
    } else if (amount <= 16000) {
      return { safe: 15, invest: 25, emergency: 10, parents: 10, personal: 40 }; // Growth
    } else {
      return { safe: 10, invest: 40, emergency: 5, parents: 10, personal: 35 }; // Wealth
    }
  };

  const dist = getDistribution(salary);
  const totalExpensesCost = expenses.reduce((acc, curr) => acc + curr.cost, 0);
  const paidExpensesCost = expenses.filter(e => e.paid).reduce((acc, curr) => acc + curr.cost, 0);
  
  // Logic Strategy Generator
  const currentStrategy = useMemo(() => {
    return STRATEGIES.find(s => salary <= s.max) || STRATEGIES[STRATEGIES.length - 1];
  }, [salary]);

  const marketStats = useMemo(() => {
    const totalNeeded = wishlist.filter(w => w.type === 'waiting').reduce((acc, curr) => acc + curr.price, 0);
    const totalAssetValue = wishlist.filter(w => w.type === 'bought').reduce((acc, curr) => acc + curr.price, 0);
    const totalItems = wishlist.length;
    const boughtItems = wishlist.filter(w => w.type === 'bought').length;
    const progress = totalItems === 0 ? 0 : (boughtItems / totalItems) * 100;
    return { totalNeeded, totalAssetValue, progress, boughtItems };
  }, [wishlist]);

  const filteredMarketItems = useMemo(() => {
      let items = [...wishlist];
      if (marketFilter === 'high') items = items.filter(i => i.priority === 'High' && i.type === 'waiting');
      else if (marketFilter === 'waiting') items = items.filter(i => i.type === 'waiting');
      else if (marketFilter === 'bought') items = items.filter(i => i.type === 'bought');
      
      // Sort: High priority first, then expensive items first
      return items.sort((a, b) => {
          const prioMap: Record<string, number> = { 'High': 3, 'Medium': 2, 'Low': 1 };
          const pA = prioMap[a.priority] || 0;
          const pB = prioMap[b.priority] || 0;
          if (pA !== pB) return pB - pA;
          return b.price - a.price;
      });
  }, [wishlist, marketFilter]);

  // Vision Stats
  const visionStats = useMemo(() => {
    let totalGoals = 0;
    let completedGoals = 0;
    const focusItems: { area: string, goal: string, color: string, icon: string }[] = [];

    vision.forEach(v => {
        totalGoals += v.goals.length;
        completedGoals += v.goals.filter(g => g.done).length;
        const nextStep = v.goals.find(g => !g.done);
        if (nextStep) {
            focusItems.push({ area: v.title, goal: nextStep.label, color: v.color, icon: v.icon });
        }
    });
    const progress = totalGoals === 0 ? 0 : (completedGoals / totalGoals) * 100;
    const startDate = new Date('2026-03-02');
    const endDate = new Date('2031-03-02');
    const today = new Date();
    let status = '';
    let daysLeft = 0;
    if (today < startDate) {
        const diffTime = Math.abs(startDate.getTime() - today.getTime());
        daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        status = 'Launch Countdown';
    } else {
        const diffTime = Math.abs(endDate.getTime() - today.getTime());
        daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        status = 'Execution Phase';
    }
    return { progress, daysLeft, status, focusItems };
  }, [vision]);

  const filteredNotes = notes.filter(n => 
    n.title.toLowerCase().includes(noteSearch.toLowerCase()) || 
    n.text.toLowerCase().includes(noteSearch.toLowerCase())
  );

  // --- SMART FEATURES LOGIC ---
  const getCurrentPhase = () => {
      return FINANCIAL_PHASES.find(p => salary <= p.limit) || FINANCIAL_PHASES[FINANCIAL_PHASES.length-1];
  };
  const phase = getCurrentPhase();

  const getSmartWarnings = () => {
      const warnings = [];
      const personalFund = salary * (dist.personal / 100);
      const fixedExpenses = expenses.filter(e => e.category === 'fixed').reduce((a, b) => a + b.cost, 0);
      const freeCash = personalFund - totalExpensesCost;

      // Emergency Fund
      if (totalSaved < totalExpensesCost) warnings.push({ type: 'red', msg: "High risk: You don't have enough emergency savings ( < 1 month).", icon: 'AlertTriangle' });
      else if (totalSaved < totalExpensesCost * 3) warnings.push({ type: 'yellow', msg: "Low safety buffer. Aim to cover at least 3 months of expenses.", icon: 'Shield' });
      else warnings.push({ type: 'green', msg: "Strong financial safety net. Well done.", icon: 'CheckCircle' });

      // Savings & Investment Allocations
      if (dist.safe === 0) warnings.push({ type: 'yellow', msg: "You are not saving. This limits your financial stability.", icon: 'TrendingUp' });
      else if (dist.safe < 5) warnings.push({ type: 'blue', msg: "Your savings rate is very low. Try increasing it gradually.", icon: 'TrendingUp' });
      else if (dist.safe >= 15) warnings.push({ type: 'green', msg: "Healthy savings habit.", icon: 'CheckCircle' });

      if (dist.invest === 0) warnings.push({ type: 'blue', msg: "You are not investing. Skills or assets matter.", icon: 'Briefcase' });
      else if (dist.invest >= 10) warnings.push({ type: 'green', msg: "You are actively building future income.", icon: 'Rocket' });

      // Family
      if (dist.parents > 30) warnings.push({ type: 'yellow', msg: "Family support is very high. Ensure your own stability first.", icon: 'Users' });

      // Balance
      if (fixedExpenses > personalFund * 0.8) warnings.push({ type: 'red', msg: "Your fixed costs are too high (>80% of Personal Fund).", icon: 'Home' });
      if (freeCash <= 0) warnings.push({ type: 'yellow', msg: "No free cash at month end. One surprise expense could hurt.", icon: 'Wallet' });
      else if (freeCash >= salary * 0.1) warnings.push({ type: 'green', msg: "Good flexibility. You can absorb unexpected costs.", icon: 'CheckCircle' });

      return warnings;
  };
  const smartWarnings = getSmartWarnings();

  // --- AUTOMATIC SMART QUESTS ---
  const smartQuests = useMemo(() => {
      const quests = [];
      
      // Quest 1: The Safety Net (Emergency Fund)
      const emergencyTarget = totalExpensesCost * 6;
      quests.push({
          id: 'q1',
          label: 'The Safety Net (6 Months)',
          target: emergencyTarget,
          current: totalSaved,
          unit: 'DH',
          color: 'red',
          icon: 'Shield',
          desc: "Before investing, ensure you can survive 6 months without income."
      });

      // Quest 2: Asset Accumulation (1 Year Salary)
      const assetTarget = salary * 12;
      quests.push({
          id: 'q2',
          label: 'Asset Accumulation',
          target: assetTarget,
          current: marketStats.totalAssetValue,
          unit: 'DH',
          color: 'emerald',
          icon: 'Building',
          desc: "Build assets equal to 1 year of your active income."
      });

      // Quest 3: The Golden Rule (20% Savings/Invest)
      const savingsRateTarget = 20;
      const currentRate = dist.safe + dist.invest;
      quests.push({
          id: 'q3',
          label: 'Golden Savings Rate',
          target: savingsRateTarget,
          current: currentRate,
          unit: '%',
          color: 'yellow',
          icon: 'TrendingUp',
          desc: "Aim to save and invest at least 20% of your income."
      });

      return quests;
  }, [totalExpensesCost, totalSaved, salary, marketStats.totalAssetValue, dist]);

  // --- MOROCCAN BOOK ADVISOR ---
  const dailyTip = useMemo(() => {
      // Determine phase key
      let key: keyof typeof FINANCIAL_WISDOM = 'survival';
      if (salary > 15000) key = 'freedom';
      else if (salary > 8000) key = 'growth';
      else if (salary > 4000) key = 'foundation';
      
      // Get tips for current phase
      const tips = FINANCIAL_WISDOM[key];
      // Select random tip from available ones (stable on render due to useMemo unless salary changes)
      const randomTip = tips[Math.floor(Math.random() * tips.length)];
      return randomTip;
  }, [salary]);

  // --- PDF GENERATION ---
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    
    // Header
    doc.setFillColor(15, 23, 42); // Dark Blue (Slate 900)
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("N E X A 1337 | Financial Roadmap", 20, 20);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);

    // Current Status
    let yPos = 55;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Current Status", 20, yPos);
    
    yPos += 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Monthly Income: ${salary} DH`, 20, yPos);
    doc.text(`Financial Phase: ${phase.name}`, 100, yPos);
    
    // Allocations
    yPos += 20;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Monthly Allocations", 20, yPos);
    
    yPos += 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    
    const allocations = [
        { label: 'Personal (Needs)', amount: Math.round(salary * (dist.personal / 100)), percent: dist.personal },
        { label: 'Investment (Future)', amount: Math.round(salary * (dist.invest / 100)), percent: dist.invest },
        { label: 'Savings (Safety)', amount: Math.round(salary * (dist.safe / 100)), percent: dist.safe },
        { label: 'Emergency Fund', amount: Math.round(salary * (dist.emergency / 100)), percent: dist.emergency },
        { label: 'Parents / Charity', amount: Math.round(salary * (dist.parents / 100)), percent: dist.parents },
    ];

    allocations.forEach((alloc) => {
        doc.text(`• ${alloc.label}: ${alloc.amount} DH (${alloc.percent}%)`, 25, yPos);
        yPos += 8;
    });

    // Strategy
    yPos += 15;
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(`Strategy: ${currentStrategy.phase}`, 20, yPos);
    
    yPos += 10;
    doc.setFontSize(11);
    doc.setFont("helvetica", "italic");
    const descLines = doc.splitTextToSize(currentStrategy.description, pageWidth - 40);
    doc.text(descLines, 20, yPos);
    yPos += descLines.length * 6 + 5;

    // Action Plan
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Action Plan:", 20, yPos);
    yPos += 8;
    
    doc.setFont("helvetica", "normal");
    currentStrategy.actions.forEach((action) => {
        doc.text(`- ${action}`, 25, yPos);
        yPos += 7;
    });

    // Warnings (if any)
    if (smartWarnings.length > 0) {
        yPos += 10;
        doc.setTextColor(220, 38, 38); // Red
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        doc.text("Critical Alerts & Insights:", 20, yPos);
        yPos += 8;
        
        doc.setTextColor(50, 50, 50);
        doc.setFont("helvetica", "normal");
        smartWarnings.forEach((warn) => {
            const warnLines = doc.splitTextToSize(`! ${warn.msg}`, pageWidth - 40);
            doc.text(warnLines, 25, yPos);
            yPos += warnLines.length * 6 + 2;
        });
    }

    // Footer
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("Keep pushing. The roadmap is clear.", pageWidth / 2, 280, { align: 'center' });

    doc.save(`NEXA_Roadmap_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // --- MAIN DASHBOARD ---
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans pt-24 pb-32 transition-colors duration-300 relative">
      
      {/* AUTH OVERLAY MODAL */}
      <AnimatePresence>
        {showAuthModal && (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4"
            >
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-black/90 border border-amber-500/30 p-8 rounded-3xl max-w-md w-full relative z-10 shadow-2xl shadow-amber-900/40"
                >
                    <button onClick={() => { setShowAuthModal(false); setPendingTab(null); }} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
                        <Icon name="X" size={24} />
                    </button>
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-amber-900/30 rounded-2xl mx-auto flex items-center justify-center text-amber-500 mb-4 border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.2)]">
                            <Icon name="Lock" size={32} />
                        </div>
                        <h1 className="text-2xl font-black text-white uppercase tracking-wider">Restricted Area</h1>
                        <p className="text-slate-400 text-xs mt-3 leading-relaxed">
                            Only the <strong className="text-white">E-Wallet</strong> is free to view.<br/>
                            To access <strong>MIND</strong> or <strong>MARKET</strong>, please enter the admin secret key.
                        </p>
                    </div>
                    <form onSubmit={handleUnlock} className="space-y-4">
                        <div className="relative">
                            <input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                                placeholder="SECRET KEY" 
                                className={`w-full bg-slate-900/50 border ${error ? 'border-red-500 animate-shake' : 'border-amber-900/50'} rounded-xl px-4 py-4 text-center text-white font-mono tracking-[0.2em] focus:outline-none focus:border-amber-500 transition-colors`} 
                            />
                        </div>
                        <button type="submit" className="w-full bg-amber-600 hover:bg-amber-500 text-black font-bold py-4 rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-amber-600/20">
                            Unlock Access
                        </button>
                    </form>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 pb-6 border-b border-slate-200 dark:border-slate-800">
          <div className="mb-4 lg:mb-0">
            <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-slate-900 dark:bg-white rounded-lg text-white dark:text-slate-900"><Icon name="User" size={24} /></div>
                <div>
                    <h1 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-600">Space</span></h1>
                    <p className="text-slate-500 dark:text-slate-400 font-mono text-[10px] md:text-xs">ID: Marouan.Anouar | Access: <span className={locked ? "text-orange-500 font-bold" : "text-emerald-500 font-bold"}>{locked ? "Partial" : "Full"}</span></p>
                </div>
            </div>
          </div>
          <div className="flex bg-white dark:bg-slate-900 p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm w-full lg:w-auto overflow-x-auto no-scrollbar">
            {[ { id: 'finance', icon: 'Briefcase', label: 'E-Wallet' }, { id: 'mind', icon: 'BookOpen', label: 'Mind' }, { id: 'market', icon: 'ShoppingBag', label: 'Market' } ].map((tab) => {
                const isRestricted = tab.id !== 'finance' && locked;
                return (
                    <button key={tab.id} onClick={() => handleTabClick(tab.id as any)} className={`flex-1 lg:flex-none px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 whitespace-nowrap ${activeTab === tab.id ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                        {isRestricted ? <Icon name="Lock" size={14} className="text-amber-500" /> : <Icon name={tab.icon} size={16} />}
                        {tab.label}
                    </button>
                );
            })}
          </div>
        </div>

        {/* TAB: FINANCE */}
        {activeTab === 'finance' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            
            {/* 1. PHASE SYSTEM BANNER */}
            <div className={`w-full p-4 rounded-3xl border relative overflow-hidden shadow-lg ${phase.bg} bg-opacity-10 border-${phase.color}-500/30`}>
                <div className={`absolute top-0 right-0 p-6 opacity-20 ${phase.text}`}><Icon name={phase.icon} size={80} /></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`px-3 py-1 rounded-full bg-${phase.color}-500 text-white text-[10px] font-black uppercase tracking-widest`}>Current Phase</span>
                        <div className="h-2 flex-1 bg-slate-200 dark:bg-black/20 rounded-full overflow-hidden">
                            <div className={`h-full bg-${phase.color}-500`} style={{ width: `${Math.min((salary/phase.limit)*100, 100)}%` }}></div>
                        </div>
                    </div>
                    <h2 className={`text-3xl font-black ${phase.text} uppercase italic tracking-tighter`}>{phase.name}</h2>
                    <p className="text-slate-600 dark:text-slate-300 text-xs font-medium max-w-md">{phase.desc}</p>
                </div>
            </div>

            {/* 2. SMART ALLOCATOR */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2"><Icon name="Database" className="text-amber-500" /> Smart Allocator (Morocco)</h2>
                <button 
                  onClick={handleDownloadPDF} 
                  className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold text-xs uppercase tracking-wider hover:scale-105 transition-transform shadow-lg shadow-slate-900/10 dark:shadow-white/10"
                >
                  <Icon name="Download" size={16} /> Save Roadmap
                </button>
              </div>
              
              <div className="space-y-6">
                  <div className="space-y-4">
                      <div><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Minimum Salary (Entry Level)</span>
                          <div className="flex flex-wrap gap-2">{SALARY_RANGES.min.map(val => (<button key={val} onClick={() => setSalary(val)} className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${salary === val ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-500' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-transparent hover:border-slate-300'}`}>{val} DH</button>))}</div></div>
                      <div><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Average Salary (Skilled)</span>
                          <div className="flex flex-wrap gap-2">{SALARY_RANGES.avg.map(val => (<button key={val} onClick={() => setSalary(val)} className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${salary === val ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-500' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-transparent hover:border-slate-300'}`}>{val} DH</button>))}</div></div>
                      <div><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">High Income (Elite)</span>
                          <div className="flex flex-wrap gap-2">{SALARY_RANGES.high.map(val => (<button key={val} onClick={() => setSalary(val)} className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${salary === val ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 border-purple-500' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-transparent hover:border-slate-300'}`}>{val} DH</button>))}</div></div>
                  </div>
                  <div className="h-px bg-slate-200 dark:bg-slate-800 my-4"></div>
                  <div className="flex flex-col lg:flex-row gap-8 items-center">
                      <div className="w-full lg:w-1/3">
                          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2 block">Custom Amount</label>
                          <div className="relative"><input type="number" value={salary} onChange={(e) => setSalary(Number(e.target.value))} className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-3xl font-black text-slate-900 dark:text-white focus:border-amber-500 outline-none transition-colors font-mono"/><span className="absolute right-6 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">MAD</span></div>
                      </div>
                      <div className="w-full lg:w-2/3 space-y-4">
                          <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex shadow-inner">
                              <div style={{ width: `${dist.personal}%` }} className="bg-blue-500 h-full"></div>
                              <div style={{ width: `${dist.invest}%` }} className="bg-amber-500 h-full"></div>
                              <div style={{ width: `${dist.safe}%` }} className="bg-emerald-500 h-full"></div>
                              <div style={{ width: `${dist.emergency}%` }} className="bg-red-500 h-full"></div>
                              <div style={{ width: `${dist.parents}%` }} className="bg-pink-500 h-full"></div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            <FundCard label="Personal" percent={dist.personal} total={salary} expenses={totalExpensesCost} color="text-blue-500" bg="bg-blue-50 dark:bg-blue-900/10" border="border-blue-200 dark:border-blue-900/30" icon="User" />
                            <FundCard label="Invest" percent={dist.invest} total={salary} color="text-amber-500" bg="bg-amber-50 dark:bg-amber-900/10" border="border-amber-200 dark:border-amber-900/30" icon="TrendingUp" />
                            <FundCard label="Savings" percent={dist.safe} total={salary} color="text-emerald-500" bg="bg-emerald-50 dark:bg-emerald-900/10" border="border-emerald-200 dark:border-emerald-900/30" icon="Lock" />
                            <FundCard label="Emergency" percent={dist.emergency} total={salary} color="text-red-500" bg="bg-red-50 dark:bg-red-900/10" border="border-red-200 dark:border-red-900/30" icon="AlertTriangle" />
                            <FundCard label="Parents" percent={dist.parents} total={salary} color="text-pink-500" bg="bg-pink-50 dark:bg-pink-900/10" border="border-pink-200 dark:border-pink-900/30" icon="Heart" />
                          </div>
                      </div>
                  </div>
                  
                  {/* Current Liquid Assets Input for Emergency Calc */}
                  <div className="flex items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                      <div className="text-xs font-bold text-slate-500 uppercase">Current Emergency Savings:</div>
                      <div className="relative w-32">
                          <input type="number" value={totalSaved} onChange={(e) => setTotalSaved(Number(e.target.value))} className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-2 py-1 text-xs font-mono font-bold" />
                          <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">DH</span>
                      </div>
                  </div>
              </div>
            </div>

            {/* 3. SMART WARNINGS & ALERTS */}
            <div className="space-y-2">
                {smartWarnings.map((warn, idx) => (
                    <div key={idx} className={`flex items-center gap-3 p-3 rounded-xl border ${
                        warn.type === 'red' ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400' :
                        warn.type === 'yellow' ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-900/30 text-amber-700 dark:text-amber-400' :
                        warn.type === 'blue' ? 'bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/30 text-blue-700 dark:text-blue-400' :
                        'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                    }`}>
                        <Icon name={warn.icon} size={20} className="shrink-0" />
                        <span className="text-xs font-bold">{warn.msg}</span>
                    </div>
                ))}
            </div>

            {/* 4. EXPENSES & STRATEGY */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
                <div className="flex items-center justify-between mb-4"><h3 className="text-slate-900 dark:text-white font-bold flex items-center gap-2"><Icon name="CreditCard" className="text-emerald-500"/> Expenses & Subs</h3><div className="text-right"><span className="block text-[10px] font-bold text-slate-400 uppercase">Monthly Cost</span><span className="text-lg font-black text-slate-900 dark:text-white">{totalExpensesCost} DH</span></div></div>
                <div className="space-y-3">{expenses.map((exp) => (<div key={exp.id} className={`flex items-center justify-between p-3 rounded-xl border transition-all ${exp.paid ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-900/30' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700'}`}><div className="flex items-center gap-3 flex-1"><button onClick={() => updateExpense(exp.id, 'paid', !exp.paid)} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 ${exp.paid ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-300 hover:border-emerald-500 hover:text-emerald-500'}`}><Icon name={exp.paid ? "Check" : exp.icon} size={16} /></button><div className="flex flex-col min-w-0"><span className={`font-bold text-xs sm:text-sm truncate ${exp.paid ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>{exp.label}</span><span className="text-[10px] text-slate-400 uppercase tracking-wider">{exp.category}</span></div></div><div className="flex items-center gap-2 ml-2"><div className="relative"><input type="number" value={exp.cost} onChange={(e) => updateExpense(exp.id, 'cost', Number(e.target.value))} className={`w-20 bg-white dark:bg-slate-900 border rounded-lg px-2 py-1 text-right text-xs font-mono font-bold outline-none focus:border-blue-500 transition-all ${exp.paid ? 'text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50' : 'text-slate-900 dark:text-white border-slate-200 dark:border-slate-700'}`} /></div></div></div>))}</div>
                <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs"><span className="text-slate-500 dark:text-slate-400 font-medium">{paidExpensesCost} DH Paid</span><span className={`font-bold ${totalExpensesCost > (salary * (dist.personal/100)) ? 'text-red-500' : 'text-emerald-500'}`}>{Math.round((totalExpensesCost / (salary * (dist.personal/100))) * 100)}% of Personal Fund</span></div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 relative overflow-hidden flex flex-col">
                <div className="flex items-center gap-2 mb-4"><Icon name="Zap" className={`${currentStrategy.color}`} /><div><h3 className="text-slate-900 dark:text-white font-bold text-lg leading-none">Smart Strategy</h3><span className={`text-[10px] font-bold uppercase tracking-widest ${currentStrategy.color}`}>{currentStrategy.phase}</span></div></div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6 font-medium">{currentStrategy.description}</p>
                <div className="space-y-4 flex-1"><div><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Action Plan</span><ul className="space-y-2">{currentStrategy.actions.map((action, idx) => (<li key={idx} className="flex items-start gap-2 text-xs md:text-sm text-slate-700 dark:text-slate-200"><Icon name="ArrowRight" size={14} className={`mt-0.5 shrink-0 ${currentStrategy.color}`} /><span>{action}</span></li>))}</ul></div><div><span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Recommended Tools</span><div className="flex flex-wrap gap-2">{currentStrategy.tools.map((tool, idx) => (<span key={idx} className="px-2 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-[10px] font-bold text-slate-600 dark:text-slate-300">{tool}</span>))}</div></div></div>
              </div>
            </div>

            {/* 5. FINANCIAL GOALS & ADVICE */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Auto-Quests */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6">
                    <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Icon name="Trophy" className="text-yellow-500" /> Quest Log</h3>
                    <div className="space-y-3 mb-4">
                        {smartQuests.map(q => (
                            <div key={q.id} className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 group hover:border-slate-300 dark:hover:border-slate-600 transition-colors">
                                <div className="flex justify-between items-center mb-1">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-1 rounded bg-${q.color}-100 dark:bg-${q.color}-900/30 text-${q.color}-600 dark:text-${q.color}-400`}>
                                            <Icon name={q.icon} size={14} />
                                        </div>
                                        <span className="text-xs font-bold text-slate-900 dark:text-white">{q.label}</span>
                                    </div>
                                    <span className={`text-[10px] font-mono font-bold ${q.current >= q.target ? 'text-emerald-500' : 'text-slate-500'}`}>
                                        {q.current.toLocaleString()} / {q.target.toLocaleString()} {q.unit}
                                    </span>
                                </div>
                                <div className="text-[10px] text-slate-400 mb-2 leading-tight">{q.desc}</div>
                                <div className="h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full bg-${q.color}-500 transition-all duration-1000`} 
                                        style={{ width: `${Math.min((q.current/q.target)*100, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Moroccan Advisor */}
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl p-6 relative overflow-hidden flex flex-col justify-center">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Icon name="Bot" size={64} /></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-xl">🧞‍♂️</div>
                            <div>
                                <h4 className="font-bold text-lg">Moroccan Advisor</h4>
                                <span className="text-[10px] uppercase tracking-widest opacity-60">Book Wisdom • Moroccan Context</span>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 mb-4 relative">
                            <Icon name="Quote" size={24} className="absolute -top-3 -left-2 text-amber-400 opacity-80 bg-slate-900 rounded-full p-1" />
                            <p className="text-sm font-medium italic leading-relaxed pt-2">"{dailyTip.text}"</p>
                        </div>
                        <div className="flex justify-between items-center text-[10px] opacity-60">
                            <span>Source: <span className="font-bold text-white">{dailyTip.source}</span></span>
                            <span>Phase: <span className="uppercase">{phase.name}</span></span>
                        </div>
                    </div>
                </div>

            </div>

          </motion.div>
        )}

        {/* TAB: MIND (ROADMAPS) */}
        {activeTab === 'mind' && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="max-w-7xl mx-auto space-y-10">
            <div className="bg-slate-900 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-xl">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/20 rounded-full blur-[100px] -ml-20 -mb-20 pointer-events-none"></div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end relative z-10 gap-6">
                    <div><div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10 mb-3"><span className="animate-pulse w-2 h-2 bg-emerald-400 rounded-full"></span><span className="text-[10px] font-bold uppercase tracking-widest text-slate-300">Target Date: <span className="text-white">02/03/2031</span></span></div><h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-2">Vision <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">2031</span></h2><p className="text-sm text-slate-400 max-w-xl font-medium">Strategic roadmap execution. Tracking progress across Work, Health, Hobbies, and Business.</p></div>
                    <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md p-4 rounded-2xl border border-white/10"><div className="relative w-16 h-16 flex items-center justify-center"><svg className="w-full h-full transform -rotate-90"><circle cx="32" cy="32" r="28" stroke="rgba(255,255,255,0.1)" strokeWidth="6" fill="transparent" /><circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray={175.9} strokeDashoffset={175.9 - (175.9 * visionStats.progress) / 100} className="text-blue-500 transition-all duration-1000 ease-out" /></svg><span className="absolute text-sm font-bold text-white">{Math.round(visionStats.progress)}%</span></div><div className="text-right"><div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{visionStats.status}</div><div className="text-2xl font-mono font-black text-white">{visionStats.daysLeft} <span className="text-xs font-sans text-slate-500 font-bold">DAYS</span></div></div></div>
                </div>
            </div>
            {visionStats.focusItems.length > 0 && (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">{visionStats.focusItems.map((item, idx) => (<div key={idx} className={`bg-white dark:bg-slate-900 border-l-4 border-${item.color}-500 p-4 rounded-xl shadow-sm border-t border-r border-b border-slate-200 dark:border-slate-800`}><div className="flex items-center justify-between mb-2"><span className={`text-[10px] font-bold uppercase tracking-wider text-${item.color}-600 dark:text-${item.color}-400`}>Next Step: {item.area}</span><Icon name={item.icon} size={14} className={`text-${item.color}-500`} /></div><h4 className="font-bold text-sm text-slate-900 dark:text-white leading-tight">{item.goal}</h4></div>))}</div>)}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">{vision.map((area) => { const completedCount = area.goals.filter(g => g.done).length; const totalCount = area.goals.length; const areaProgress = totalCount === 0 ? 0 : (completedCount / totalCount) * 100; return (<div key={area.id} className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 relative overflow-hidden"><div className="flex items-center justify-between mb-6 relative z-10"><div className="flex items-center gap-3"><div className={`p-2 rounded-xl bg-${area.color}-100 dark:bg-${area.color}-900/30 text-${area.color}-600 dark:text-${area.color}-400`}><Icon name={area.icon} size={20} /></div><h3 className="font-bold text-lg text-slate-900 dark:text-white">{area.title}</h3></div><span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">{Math.round(areaProgress)}%</span></div><div className="h-1 w-full bg-slate-200 dark:bg-slate-800 rounded-full mb-8 relative z-10 overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: `${areaProgress}%` }} className={`h-full bg-${area.color}-500`} /></div><div className="relative space-y-0 pl-4 z-10"><div className="absolute top-2 bottom-6 left-[27px] w-0.5 bg-slate-200 dark:bg-slate-800" />{area.goals.map((goal, idx) => (<div key={goal.id} className="relative flex items-start gap-4 py-3 group"><div onClick={() => toggleVisionGoal(area.id, goal.id)} className={`w-6 h-6 rounded-full border-2 z-10 flex items-center justify-center cursor-pointer transition-all hover:scale-110 shrink-0 bg-slate-50 dark:bg-slate-950 ${goal.done ? `border-${area.color}-500 bg-${area.color}-500 text-white` : `border-slate-300 dark:border-slate-600 hover:border-${area.color}-400`}`}>{goal.done && <Icon name="Check" size={12} />}</div><div className="flex-1 min-w-0 pt-0.5"><div className="flex justify-between items-start"><span onClick={() => toggleVisionGoal(area.id, goal.id)} className={`text-sm font-medium cursor-pointer transition-colors leading-tight ${goal.done ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}`}>{goal.label}</span><button onClick={() => deleteVisionGoal(area.id, goal.id)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all p-1"><Icon name="X" size={14} /></button></div>{!goal.done && idx === area.goals.findIndex(g => !g.done) && (<span className={`text-[10px] font-bold uppercase tracking-wider text-${area.color}-500 mt-1 inline-block animate-pulse`}>Current Focus</span>)}</div></div>))} <div className="relative flex items-center gap-4 pt-4"><div className="w-6 h-6 rounded-full border-2 border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 z-10 flex items-center justify-center shrink-0"><Icon name="Plus" size={10} className="text-slate-400" /></div><div className="flex-1 flex gap-2"><input type="text" placeholder="Add next step..." className="w-full bg-transparent text-sm border-b border-slate-200 dark:border-slate-800 focus:border-slate-400 dark:focus:border-slate-600 outline-none py-1 text-slate-700 dark:text-slate-300 placeholder:text-slate-400" value={newGoalInputs[area.id] || ''} onChange={(e) => setNewGoalInputs({ ...newGoalInputs, [area.id]: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && addVisionGoal(area.id)} /><button onClick={() => addVisionGoal(area.id)} className={`text-xs font-bold uppercase text-${area.color}-500 hover:text-${area.color}-600 disabled:opacity-50`} disabled={!newGoalInputs[area.id]}>Add</button></div></div></div></div>); })}</div>
            <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between mb-6"><h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2"><Icon name="FileText" className="text-slate-400"/> Quick Notes</h3><div className="relative w-full max-w-[200px]"><Icon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" /><input type="text" placeholder="Search notes..." value={noteSearch} onChange={(e) => setNoteSearch(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-900 border border-transparent focus:border-blue-500 rounded-xl outline-none text-xs font-bold text-slate-900 dark:text-white placeholder:text-slate-400 transition-all" /></div></div>
                <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 mb-8 shadow-sm">
                    <div className="flex flex-col gap-3"><input placeholder="Title (Optional)..." value={newNoteTitle} onChange={(e) => setNewNoteTitle(e.target.value)} className="w-full bg-transparent text-lg font-bold text-slate-900 dark:text-white outline-none placeholder:text-slate-400" onKeyDown={(e) => { if(e.key === 'Enter') { e.preventDefault(); document.getElementById('note-textarea')?.focus(); } }} /><textarea id="note-textarea" value={newNoteText} onChange={(e) => setNewNoteText(e.target.value)} placeholder="Capture your idea..." className="w-full bg-transparent outline-none text-slate-600 dark:text-slate-300 min-h-[80px] resize-none placeholder:text-slate-500" onKeyDown={(e) => { if(e.key === 'Enter' && e.ctrlKey) { addNote(); } }}></textarea><div className="flex justify-between items-center pt-2 border-t border-slate-100 dark:border-slate-800"><span className="text-[10px] text-slate-400 font-medium hidden sm:inline-block">Ctrl + Enter to save</span><button onClick={addNote} disabled={!newNoteText.trim() && !newNoteTitle.trim()} className="w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-500/20 active:scale-95">Save Note</button></div></div>
                </div>
                {filteredNotes.length === 0 && (<div className="text-center py-10 text-slate-400"><p className="text-sm">No notes found. Start writing above!</p></div>)}
                <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">{filteredNotes.map(note => (<div key={note.id} className={`break-inside-avoid p-5 rounded-2xl border shadow-sm relative group hover:-translate-y-1 transition-all duration-300 ${note.color}`}><h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">{note.title}</h3><p className="text-slate-800 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-wrap font-medium">{note.text}</p><div className="mt-4 flex justify-between items-center pt-3 border-t border-black/10 dark:border-white/10"><span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400 opacity-70">{note.date}</span><button onClick={() => deleteNote(note.id)} className="text-red-500 hover:text-red-700 p-1 opacity-0 group-hover:opacity-100 transition-opacity"><Icon name="Trash" size={16} /></button></div></div>))}</div>
            </div>
          </motion.div>
        )}

        {/* TAB: MARKET (SMART UPGRADE) */}
        {activeTab === 'market' && (
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            
            {/* 1. Smart Market Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-emerald-900 to-slate-900 p-6 rounded-3xl border border-emerald-500/30 relative overflow-hidden">
                    <div className="absolute right-0 top-0 p-4 opacity-10"><Icon name="Wallet" size={64} /></div>
                    <h3 className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-1">Total Assets (Bought)</h3>
                    <div className="text-3xl font-black text-white">{marketStats.totalAssetValue.toLocaleString()} <span className="text-xs font-normal opacity-50">DH</span></div>
                    <div className="mt-2 text-[10px] text-slate-400 font-medium">{marketStats.boughtItems} Items Acquired</div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800">
                    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Target Cap (Waiting)</h3>
                    <div className="text-3xl font-black text-slate-900 dark:text-white">{marketStats.totalNeeded.toLocaleString()} <span className="text-xs font-normal opacity-50">DH</span></div>
                    <div className="mt-2 h-1.5 w-full bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div style={{ width: `${marketStats.progress}%` }} className="h-full bg-emerald-500"></div>
                    </div>
                    <div className="mt-1 flex justify-between text-[9px] font-bold text-slate-400 uppercase">
                        <span>Progress</span>
                        <span>{Math.round(marketStats.progress)}%</span>
                    </div>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg"><Icon name="Lock" size={18} /></div>
                        <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Allocated Strategy</span>
                            <div className="flex gap-2 mt-1">
                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                            </div>
                        </div>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-tight">
                        Items are now linked to <span className="text-slate-900 dark:text-white font-bold">specific funds</span>. Affordability is calculated based on the monthly allocation of that fund.
                    </p>
                </div>
            </div>

            {/* 2. Smart Input */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2"><Icon name="Plus" size={16} /> Add Acquisition</h3>
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-[2]">
                            <input 
                                placeholder="Item Name (e.g. MacBook Pro M3)" 
                                value={newItem.name}
                                onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-emerald-500 text-sm font-bold"
                            />
                        </div>
                        <div className="flex-1 relative">
                            <input 
                                type="number"
                                placeholder="Price" 
                                value={newItem.price}
                                onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-emerald-500 text-sm font-bold pl-8"
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">DH</span>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <select 
                                value={newItem.priority}
                                onChange={(e) => setNewItem({...newItem, priority: e.target.value})}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-emerald-500 text-sm font-bold appearance-none cursor-pointer"
                            >
                                <option value="High">High Priority</option>
                                <option value="Medium">Medium Priority</option>
                                <option value="Low">Low Priority</option>
                            </select>
                        </div>
                        <div className="flex-1">
                            <select 
                                value={newItem.fundSource}
                                onChange={(e) => setNewItem({...newItem, fundSource: e.target.value as any})}
                                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-emerald-500 text-sm font-bold appearance-none cursor-pointer"
                            >
                                <option value="personal">Personal Fund (Spending)</option>
                                <option value="safe">Savings Fund (Goals)</option>
                                <option value="invest">Investment Fund (Assets)</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <input 
                            placeholder="Link URL (Optional)..." 
                            value={newItem.url}
                            onChange={(e) => setNewItem({...newItem, url: e.target.value})}
                            className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-slate-900 dark:text-white outline-none focus:border-emerald-500 text-sm"
                        />
                        <button onClick={addWishItem} className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-emerald-500/20 active:scale-95 text-sm uppercase tracking-wider">
                            Add Item
                        </button>
                    </div>
                </div>
            </div>

            {/* 3. Filter Controls */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {[
                    { id: 'all', label: 'All Items' },
                    { id: 'waiting', label: 'Waiting List' },
                    { id: 'high', label: 'High Priority' },
                    { id: 'bought', label: 'Purchased' }
                ].map((f) => (
                    <button 
                        key={f.id}
                        onClick={() => setMarketFilter(f.id as any)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${marketFilter === f.id ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900' : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white'}`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* 4. Smart Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                    {filteredMarketItems.map(item => (
                        <WishCard 
                            key={item.id} 
                            item={item} 
                            onToggle={() => toggleWishItem(item.id)} 
                            onDelete={() => deleteWishItem(item.id)}
                            monthlySavings={salary * (dist[item.fundSource] / 100)} // Pass specific fund allocation
                        />
                    ))}
                </AnimatePresence>
                {filteredMarketItems.length === 0 && (
                    <div className="col-span-full py-12 text-center text-slate-400">
                        <Icon name="Ghost" size={32} className="mx-auto mb-2 opacity-50"/>
                        <p className="text-sm">No items found in this category.</p>
                    </div>
                )}
            </div>

          </motion.div>
        )}

      </div>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const Badge = ({ text, color }: { text: string, color: string }) => {
    const colors: Record<string, string> = {
        green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        blue: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
        orange: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
    };
    return <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide ${colors[color] || colors.blue}`}>{text}</span>;
}

const FundCard = ({ label, percent, total, color, bg, border, icon, expenses }: any) => {
  const amountNum = Math.round(total * (percent / 100));
  const amount = amountNum.toString();
  const remaining = expenses !== undefined ? amountNum - expenses : null;
  const isDeficit = remaining !== null && remaining < 0;

  return (
    <div className={`p-4 rounded-2xl border ${bg} ${border} relative overflow-hidden flex flex-col justify-between h-full group hover:shadow-md transition-all`}>
      <div className={`absolute top-2 right-2 opacity-20 ${color} group-hover:scale-110 transition-transform`}>
        <Icon name={icon} size={32} />
      </div>
      <div>
        <div className={`text-[10px] font-bold uppercase tracking-wider mb-1 ${color} opacity-80`}>{label}</div>
        <div className="text-xl md:text-2xl font-black text-slate-900 dark:text-white">{amount} <span className="text-[10px] text-slate-400 font-normal">DH</span></div>
        {remaining !== null && (
            <div className={`text-xs font-bold mt-1 ${isDeficit ? 'text-red-500' : 'text-emerald-500'}`}>
                {isDeficit ? 'Deficit: ' : 'Free: '}{remaining} DH
            </div>
        )}
      </div>
      <div className="mt-3 w-full bg-slate-200 dark:bg-black/20 h-1.5 rounded-full overflow-hidden relative">
        <div className={`h-full ${color.replace('text-', 'bg-')}`} style={{ width: `${percent}%` }}></div>
        {expenses !== undefined && (
            <div className="absolute top-0 left-0 h-full bg-red-500/50" style={{ width: `${Math.min((expenses/total)*100, 100)}%` }}></div>
        )}
      </div>
      <div className="mt-1.5 text-[10px] text-right text-slate-500 dark:text-slate-400 font-mono">{percent}%</div>
    </div>
  );
};

interface WishCardProps {
  item: WishItem;
  onToggle: () => void;
  onDelete: () => void;
  monthlySavings: number;
}

const WishCard: React.FC<WishCardProps> = ({ item, onToggle, onDelete, monthlySavings }) => {
    const isBought = item.type === 'bought';
    const monthsToBuy = item.price > 0 && monthlySavings > 0 ? (item.price / monthlySavings).toFixed(1) : '∞';
    
    // Priority Colors
    const pColor = {
        'High': 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30',
        'Medium': 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30',
        'Low': 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30'
    }[item.priority] || 'text-slate-600 bg-slate-100';

    // Fund Colors
    const fColor = {
        'personal': 'text-blue-500 border-blue-500/30',
        'safe': 'text-emerald-500 border-emerald-500/30',
        'invest': 'text-amber-500 border-amber-500/30'
    }[item.fundSource] || 'text-slate-500';

    const fLabel = {
        'personal': 'Personal Fund',
        'safe': 'Savings Fund',
        'invest': 'Investment Fund'
    }[item.fundSource];

    return (
        <motion.div 
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={`p-4 rounded-2xl border transition-all relative group overflow-hidden ${isBought ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-500/20' : `bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700 shadow-sm hover:shadow-md`}`}
        >
            {/* Fund Source Indicator Strip */}
            {!isBought && <div className={`absolute top-0 left-4 right-4 h-0.5 bg-current opacity-30 ${fColor}`}></div>}

            <div className="flex justify-between items-start mb-3 relative z-10 pt-2">
                <div className="flex items-center gap-3">
                    <button onClick={onToggle} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 ${isBought ? 'bg-emerald-500 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-300 hover:border-emerald-500 hover:text-emerald-500'}`}>
                        <Icon name={isBought ? "Check" : item.icon} size={16} />
                    </button>
                    <div>
                        <div className={`font-bold text-sm md:text-base leading-tight ${isBought ? 'text-slate-500 line-through' : 'text-slate-900 dark:text-white'}`}>{item.name}</div>
                        {!isBought && (
                            <div className="flex gap-1 mt-1">
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide ${pColor}`}>{item.priority}</span>
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide border ${fColor} bg-transparent opacity-80`}>{fLabel}</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="text-right">
                    <div className="font-mono font-black text-sm text-slate-900 dark:text-white">{item.price > 0 ? `${item.price.toLocaleString()} DH` : 'TBD'}</div>
                    {!isBought && item.price > 0 && (
                        <div className="text-[10px] font-bold text-slate-400 mt-0.5" title={`Based on ${fLabel} allocation`}>
                            ~{monthsToBuy} Mo.
                        </div>
                    )}
                </div>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-800 relative z-10">
                <div className="flex gap-2">
                    {item.url && (
                        <a href={item.url} target="_blank" rel="noreferrer" className="text-blue-500 hover:text-blue-600 transition-colors p-1.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md">
                            <Icon name="ExternalLink" size={14} />
                        </a>
                    )}
                    <span className="text-[10px] text-slate-400 font-mono mt-1.5">{item.dateAdded || 'Unknown Date'}</span>
                </div>
                <button onClick={onDelete} className="text-slate-400 hover:text-red-500 transition-colors p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md opacity-0 group-hover:opacity-100">
                    <Icon name="Trash" size={16} />
                </button>
            </div>
            
            {isBought && <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-5 pointer-events-none"></div>}
        </motion.div>
    );
};

export default PersonalFinance;
