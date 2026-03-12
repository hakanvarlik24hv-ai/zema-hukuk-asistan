import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  Search,
  Calendar,
  Calculator,
  Bell,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  FileSearch,
  FileSignature
} from 'lucide-react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { User } from './types';
import { API_BASE_URL } from './config';

// --- Pages ---
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Cases from './pages/Cases';
import PetitionGenerator from './pages/PetitionGenerator';
import PrecedentSearch from './pages/PrecedentSearch';
import CaseAnalysis from './pages/CaseAnalysis';
import CalendarPage from './pages/Calendar';
import CalculatorPage from './pages/Calculator';
import ContractGenerator from './pages/ContractGenerator';

const SidebarItem = ({ icon: Icon, label, to, active, onClick }: {
  icon: any,
  label: string,
  to: string,
  active: boolean,
  onClick?: () => void
}) => (
  <Link
    to={to}
    onClick={onClick}
    className={cn(
      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group border border-transparent mb-1",
      active
        ? "bg-logo-gold text-brand-navy shadow-[0_15px_30px_-5px_rgba(197,160,89,0.6)] border-white/40 -translate-y-1 scale-[1.03]"
        : "text-brand-navy/80 hover:bg-logo-gold/20 hover:text-brand-navy font-semibold hover:-translate-y-0.5"
    )}
  >
    <Icon size={20} className={cn("transition-transform duration-200", active ? "scale-110 text-brand-navy" : "group-hover:scale-110 text-brand-navy/60")} />
    <span className="text-sm">{label}</span>
    {active && <motion.div layoutId="active-pill" className="ml-auto w-1.5 h-1.5 rounded-full bg-brand-navy" />}
  </Link>
);

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Auto-login with default password if no session
        const loginRes = await fetch(`${API_BASE_URL}/api/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password: 'zema2024' })
        });

        if (loginRes.ok) {
          const data = await loginRes.json();
          setUser(data);
        }
      } catch (e) {
        console.error("Auth check failed:", e);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);

  if (loading) {
    return <div className="h-screen w-screen bg-slate-900 flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-logo-gold border-t-transparent rounded-full animate-spin"></div>
    </div>;
  }

  // Fallback user if login failed (to prevent blank screen in dev/offline)
  const activeUser = user || { id: 1, name: 'Av. Mahmut KORKMAZ, Av. Zeki FIRAT', email: 'yonetim@zemahukuk.com.tr', role: 'lawyer' };

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && window.innerWidth < 1024 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[45]"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-white/95 border-r border-slate-200 shadow-2xl transition-all duration-300 transform lg:relative lg:translate-x-0 overflow-y-auto no-scrollbar",
          !isSidebarOpen && "-translate-x-full lg:w-20 lg:translate-x-0"
        )}
      >
        <div
          className="absolute top-0 left-0 w-full h-[100vh] z-0 blur-[2px] opacity-60"
          style={{
            backgroundImage: `url('https://i.hizliresim.com/ofc01s1.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'top',
            backgroundRepeat: 'no-repeat'
          }}
        />
        <div className="h-full flex flex-col p-4 relative z-10">
          <div className="flex items-center gap-3 px-2 mb-8 text-slate-950">
            <div className="w-20 h-20 bg-transparent flex items-center justify-center overflow-hidden shrink-0">
              <img src="https://i.hizliresim.com/j4yxat8.png" alt="Zema Logo" className="w-full h-full object-contain" />
            </div>
            {isSidebarOpen && (
              <span className="text-lg font-black tracking-tight text-slate-950 leading-tight">
                Zema Hukuk<br />
                <span className="text-[10px] font-black text-logo-gold uppercase tracking-widest">Yönetim Paneli</span>
              </span>
            )}
            {!isSidebarOpen && window.innerWidth >= 1024 && (
              <button onClick={() => setIsSidebarOpen(true)} className="mx-auto text-logo-gold mt-2">
                <Menu size={20} />
              </button>
            )}
          </div>

          <nav className="flex-1 space-y-4">
            <section className="bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl p-1.5 shadow-sm">
              {isSidebarOpen && <p className="px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 mt-2">PANEL</p>}
              <SidebarItem icon={LayoutDashboard} label="Panel" to="/" active={location.pathname === '/'} />
              <SidebarItem icon={Users} label="Müvekkiller" to="/clients" active={location.pathname === '/clients'} />
              <SidebarItem icon={Briefcase} label="Dava Dosyaları" to="/cases" active={location.pathname === '/cases'} />
            </section>

            <section className="bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl p-1.5 shadow-sm">
              {isSidebarOpen && <p className="px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 mt-2">Yapay Zeka</p>}
              <SidebarItem icon={FileSignature} label="Dilekçe" to="/ai-petition" active={location.pathname === '/ai-petition'} />
              <SidebarItem icon={Search} label="Emsal Arama" to="/ai-search" active={location.pathname === '/ai-search'} />
              <SidebarItem icon={FileSearch} label="Analiz" to="/ai-analysis" active={location.pathname === '/ai-analysis'} />
              <SidebarItem icon={FileText} label="Sözleşme" to="/ai-contract" active={location.pathname === '/ai-contract'} />
            </section>

            <section className="bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl p-1.5 shadow-sm">
              {isSidebarOpen && <p className="px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 mt-2">Operasyon</p>}
              <SidebarItem icon={Calendar} label="Takvim" to="/calendar" active={location.pathname === '/calendar'} />
              <SidebarItem icon={Calculator} label="Hesaplama" to="/calculator" active={location.pathname === '/calculator'} />
            </section>
          </nav>

          <div className="mt-8 pt-4 border-t border-slate-200/50">
            <div className="flex items-center gap-3 px-2 py-3">
              <div className="w-10 h-10 rounded-full bg-logo-gold/10 flex items-center justify-center overflow-hidden shrink-0 border border-logo-gold/20">
                <UserIcon size={20} className="text-logo-gold" />
              </div>
              {isSidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{activeUser.name}</p>
                  <p className="text-[10px] text-slate-500 truncate">{activeUser.email}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-transparent relative overflow-hidden">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url('https://i.hizliresim.com/42rlxep.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: 1
          }}
        />
        <header className="h-16 bg-white/80 backdrop-blur-lg border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 hover:bg-slate-100 rounded-xl text-slate-600 transition-all active:scale-95"
            >
              <Menu size={22} />
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm font-black text-slate-900 uppercase tracking-widest">
                {location.pathname === '/' ? 'Panel' :
                  location.pathname === '/clients' ? 'Müvekkiller' :
                    location.pathname === '/cases' ? 'Dava Dosyaları' :
                      location.pathname === '/ai-petition' ? 'Dilekçe' :
                        location.pathname === '/ai-search' ? 'Emsal Arama' :
                          location.pathname === '/ai-analysis' ? 'Analiz' :
                            location.pathname === '/ai-contract' ? 'Sözleşme' :
                              location.pathname === '/calendar' ? 'Takvim' :
                                location.pathname === '/calculator' ? 'Hesaplama' : ''}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <div className="relative group hidden md:block">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Genel arama..."
                className="w-48 lg:w-64 pl-10 pr-4 py-2 bg-slate-100/50 border-transparent focus:bg-white focus:ring-2 focus:ring-logo-gold/20 focus:border-logo-gold/30 rounded-xl text-xs transition-all outline-none font-bold"
              />
            </div>

            <button
              className="p-2.5 text-slate-500 hover:bg-slate-100 rounded-xl relative transition-all active:scale-95"
            >
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="h-8 w-[1px] bg-slate-200 mx-1 hidden sm:block"></div>

            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-black text-slate-900">{new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                <div className="text-xs font-bold text-slate-500">{new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })} • ☀️ Açık, 22°C</div>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-4 lg:p-8 relative z-10 custom-scrollbar">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/clients" element={<Clients />} />
              <Route path="/cases" element={<Cases />} />
              <Route path="/ai-petition" element={<PetitionGenerator />} />
              <Route path="/ai-search" element={<PrecedentSearch />} />
              <Route path="/ai-analysis" element={<CaseAnalysis />} />
              <Route path="/ai-contract" element={<ContractGenerator />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/calculator" element={<CalculatorPage />} />
            </Routes>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
