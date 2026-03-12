import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  Briefcase,
  Calendar,
  Users,
  CreditCard,
  ArrowUpRight,
  Clock,
  ChevronRight,
  TrendingUp,
  Activity,
  Award,
  RefreshCw
} from 'lucide-react';
import { useToast } from '../components/ToastProvider';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { DashboardStats, Hearing } from '../types';
import { API_BASE_URL } from '../config';
import { cn } from '../lib/utils';
import { useNavigate, Link } from 'react-router-dom';

const chartData = [
  { name: 'Oca', davalar: 4, tamamlanan: 2 },
  { name: 'Şub', davalar: 7, tamamlanan: 5 },
  { name: 'Mar', davalar: 5, tamamlanan: 3 },
  { name: 'Nis', davalar: 9, tamamlanan: 6 },
  { name: 'May', davalar: 12, tamamlanan: 8 },
  { name: 'Haz', davalar: 8, tamamlanan: 9 },
];

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [hearings, setHearings] = useState<Hearing[]>([]);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, hearingsRes, notificationsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/dashboard`),
          fetch(`${API_BASE_URL}/api/hearings`),
          fetch(`${API_BASE_URL}/api/notifications`)
        ]);

        if (statsRes.ok) setStats(await statsRes.json());
        if (hearingsRes.ok) setHearings(await hearingsRes.json());
        if (notificationsRes.ok) setNotifications(await notificationsRes.json());
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const { showToast } = useToast();
  const [resetLoading, setResetLoading] = useState(false);

  const handleResetData = async () => {
    if (!window.confirm("Tüm veri ve bildirimleri sıfırlamak istediğinize emin misiniz? Bu işlem geri alınamaz.")) return;
    
    setResetLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/reset-data`, { method: 'POST' });
      if (res.ok) {
        showToast('success', 'Sistem Sıfırlandı', 'Tüm veri ve bildirimler başarıyla temizlendi.');
        window.location.reload();
      } else {
        throw new Error('Sıfırlama işlemi başarısız oldu.');
      }
    } catch (err: any) {
      showToast('error', 'Hata', err.message || 'Bir hata oluştu.');
    } finally {
      setResetLoading(false);
    }
  };

  if (loading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-6 lg:space-y-10"
    >
      {/* Header Section */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">Hoş Geldiniz Yönetici</h1>
          <p className="text-white/80 font-bold mt-2 text-sm lg:text-base">Bugün bekleyen duruşmalarınız ve dilekçeleriniz var.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md p-3 rounded-2xl border border-white/20 shadow-sm">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <p className="text-sm font-black text-slate-900 leading-none">
                {new Date().toLocaleDateString('tr-TR', { weekday: 'long' })}
              </p>
            </div>
            <div className="w-10 h-10 bg-logo-gold/10 rounded-xl flex items-center justify-center text-logo-gold">
              <Calendar size={20} />
            </div>
          </div>
          
          <button 
            onClick={handleResetData}
            disabled={resetLoading}
            className="flex items-center gap-2 bg-rose-500 hover:bg-rose-600 text-white px-6 py-3.5 rounded-2xl shadow-lg shadow-rose-500/20 transition-all font-black text-sm active:scale-95 disabled:opacity-50 group border-b-4 border-rose-700 active:border-b-0 active:translate-y-1"
          >
            <RefreshCw size={18} className={cn(resetLoading && "animate-spin")} />
            {resetLoading ? 'Sıfırlanıyor...' : 'Tüm Verileri Sıfırla'}
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <StatCard
          label="Aktif Davalar"
          value={stats?.activeCases || 0}
          icon={Briefcase}
          color="bg-blue-500/10 text-blue-600"
          trend={stats?.trends.activeCases || "Yok"}
          trendDir={stats?.trends.directions.activeCases || "neutral"}
          to="/cases"
        />
        <StatCard
          label="Yaklaşan Duruşmalar"
          value={stats?.upcomingHearings || 0}
          icon={Activity}
          color="bg-amber-500/10 text-amber-600"
          trend={stats?.trends.upcomingHearings || "Yok"}
          trendDir={stats?.trends.directions.upcomingHearings || "neutral"}
          to="/calendar"
        />
        <StatCard
          label="Toplam Müvekkil"
          value={stats?.totalClients || 0}
          icon={Users}
          color="bg-emerald-500/10 text-emerald-600"
          trend={stats?.trends.totalClients || "Yeni Yok"}
          trendDir={stats?.trends.directions.totalClients || "neutral"}
          to="/clients"
        />
        <StatCard
          label="Bekleyen Ödemeler"
          value={stats?.pendingPayments || 0}
          icon={CreditCard}
          color="bg-rose-500/10 text-rose-600"
          trend={stats?.trends.pendingPayments || "Yok"}
          trendDir={stats?.trends.directions.pendingPayments || "neutral"}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Main Chart Card */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-md p-6 lg:p-8 rounded-3xl border border-white/20 shadow-xl shadow-slate-200/50">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-black text-slate-900 text-lg">Hukuki Süreç Analizi</h3>
              <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">Aylık Dava Dağılımı ve Tamamlanma Oranı</p>
            </div>
            <select className="text-[10px] font-black bg-slate-100/80 border-none rounded-xl px-4 py-2 outline-none text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer">
              <option>Son 6 Ay</option>
              <option>Son 1 Yıl</option>
            </select>
          </div>
          <div className="h-[300px] lg:h-[350px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorDavalar" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c5a059" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#c5a059" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorTamamlanan" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#64748b', fontWeight: '800' }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#64748b', fontWeight: '800' }}
                />
                <Tooltip
                  cursor={{ stroke: '#c5a059', strokeWidth: 1 }}
                  contentStyle={{
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                    padding: '12px 16px',
                    background: '#fff'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="davalar"
                  stroke="#c5a059"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorDavalar)"
                  stackId="1"
                />
                <Area
                  type="monotone"
                  dataKey="tamamlanan"
                  stroke="#0f172a"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorTamamlanan)"
                  stackId="2"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-6">
          {/* Upcoming Hearings */}
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-xl shadow-slate-200/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-black text-slate-900">Ajanda</h3>
              <Link to="/calendar" className="text-[10px] font-black text-logo-gold hover:underline uppercase tracking-widest">Tümünü Gör</Link>
            </div>
            <div className="space-y-4">
              {hearings.length > 0 ? hearings.slice(0, 4).map((hearing) => (
                <div key={hearing.id} onClick={() => navigate('/calendar')} className="group flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100 cursor-pointer">
                  <div className="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-logo-gold/10 transition-colors">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">
                      {new Date(hearing.hearing_date).toLocaleDateString('tr-TR', { month: 'short' })}
                    </span>
                    <span className="text-lg font-black text-slate-900 group-hover:text-logo-gold leading-none">
                      {new Date(hearing.hearing_date).getDate()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{hearing.case_title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock size={12} className="text-slate-400" />
                      <span className="text-xs text-slate-500 font-bold">
                        {new Date(hearing.hearing_date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-slate-300 group-hover:text-logo-gold" />
                </div>
              )) : (
                <div className="text-center py-10">
                  <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Calendar size={20} className="text-slate-300" />
                  </div>
                  <p className="text-xs text-slate-400 font-bold">Yakın zamanda duruşma bulunmuyor.</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-brand-navy p-6 rounded-3xl text-white shadow-xl shadow-brand-navy/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 scale-150 rotate-12 group-hover:scale-[2] transition-transform duration-700">
              <Award size={80} />
            </div>
            <h3 className="font-black text-lg relative z-10">AI Hukuk Asistanı</h3>
            <p className="text-slate-300 text-xs mt-2 relative z-10 font-medium">Hızlı dilekçe veya emsal karara mı ihtiyacın var?</p>
            <button onClick={() => navigate('/ai-petition')} className="mt-6 w-full bg-logo-gold hover:bg-logo-gold/90 text-brand-navy font-black py-3 rounded-xl transition-all relative z-10 text-sm active:scale-95 shadow-lg shadow-logo-gold/20">
              Aracı Başlat
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StatCard({ label, value, icon: Icon, color, trend, trendDir, to, onClick }: any) {
  const content = (
    <div className="flex items-start justify-between">
      <div className={cn("p-4 rounded-2xl transition-transform group-hover:rotate-6", color)}>
        <Icon size={24} />
      </div>
      <div className={cn(
        "flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full",
        trendDir === 'up' ? "text-emerald-600 bg-emerald-50" :
          trendDir === 'down' ? "text-rose-600 bg-rose-50" :
            "text-slate-500 bg-slate-50"
      )}>
        {trendDir === 'up' && <ArrowUpRight size={10} />}
        {trend}
      </div>
    </div>
  );

  const stats = (
    <div className="mt-6">
      <h3 className="text-3xl font-black text-slate-900 tracking-tight">{value}</h3>
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">{label}</p>
    </div>
  );

  const className = cn(
    "bg-white/80 backdrop-blur-md p-6 rounded-[2.5rem] border border-white/20 shadow-lg shadow-slate-200/50 transition-all duration-300 group block",
    (to || onClick) ? "hover:shadow-2xl hover:-translate-y-1 cursor-pointer" : ""
  );

  if (to) {
    return (
      <Link to={to} className={className}>
        {content}
        {stats}
      </Link>
    );
  }

  return (
    <div onClick={onClick} className={className}>
      {content}
      {stats}
    </div>
  );
}
