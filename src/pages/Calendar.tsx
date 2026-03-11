import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Calendar as CalendarIcon, Clock, MapPin, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { Hearing } from '../types';
import { API_BASE_URL } from '../config';

export default function CalendarPage() {
  const [hearings, setHearings] = useState<Hearing[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    location: ''
  });

  useEffect(() => {
    setHearings([]);
  }, []);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would POST to /api/hearings
    // For now, we'll just update local state to show it works
    const newHearing: Hearing = {
      id: Math.random(),
      case_title: newEvent.title,
      hearing_date: `${newEvent.date}T${newEvent.time}:00`,
      location: newEvent.location,
      case_id: 1,
      notes: ''
    };
    setHearings([...hearings, newHearing]);
    setIsModalOpen(false);
    setNewEvent({ title: '', date: '', time: '', location: '' });
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-600/20">
            <CalendarIcon className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Duruşma ve Süre Takvimi</h1>
            <p className="text-white font-black text-sm">Tüm duruşmalarınızı ve hukuki süreleri tek bir yerden takip edin.</p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-logo-gold hover:bg-logo-gold/90 text-brand-navy px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-logo-gold/20 transition-all font-serif"
        >
          <Plus size={20} />
          Yeni Etkinlik
        </button>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-brand-navy/40">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200"
            >
              <div className="p-6 border-b border-brand-navy/10 flex items-center justify-between">
                <h3 className="font-bold text-lg text-brand-navy">Yeni Etkinlik Ekle</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-brand-navy/5 rounded-lg text-brand-navy/40">
                  <Plus size={20} className="rotate-45" />
                </button>
              </div>
              <form onSubmit={handleAddEvent} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Başlık / Dosya Adı</label>
                  <input
                    required
                    type="text"
                    value={newEvent.title}
                    onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full px-4 py-2 bg-brand-navy/5 border border-brand-navy/10 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 transition-all text-brand-navy"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Tarih</label>
                    <input
                      required
                      type="date"
                      value={newEvent.date}
                      onChange={e => setNewEvent({ ...newEvent, date: e.target.value })}
                      className="w-full px-4 py-2 bg-brand-navy/5 border border-brand-navy/10 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 transition-all text-brand-navy"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-brand-navy/40 uppercase tracking-wider mb-2">Saat</label>
                    <input
                      required
                      type="time"
                      value={newEvent.time}
                      onChange={e => setNewEvent({ ...newEvent, time: e.target.value })}
                      className="w-full px-4 py-2 bg-brand-navy/5 border border-brand-navy/10 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 transition-all text-brand-navy"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-navy/40 uppercase tracking-wider mb-2">Konum / Adliye</label>
                  <input
                    required
                    type="text"
                    value={newEvent.location}
                    onChange={e => setNewEvent({ ...newEvent, location: e.target.value })}
                    className="w-full px-4 py-2 bg-brand-navy/5 border border-brand-navy/10 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 transition-all text-brand-navy"
                  />
                </div>
                <button type="submit" className="w-full bg-logo-gold text-brand-navy font-bold py-3 rounded-xl shadow-lg shadow-logo-gold/20 hover:bg-logo-gold/90 transition-all mt-4 font-serif">
                  Kaydet
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Calendar View */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-brand-navy/10 flex items-center justify-between">
            <h3 className="font-bold text-lg text-brand-navy">Mart 2026</h3>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-brand-navy/5 rounded-lg border border-brand-navy/10 text-brand-navy/60"><ChevronLeft size={18} /></button>
              <button className="p-2 hover:bg-brand-navy/5 rounded-lg border border-brand-navy/10 text-brand-navy/60"><ChevronRight size={18} /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 border-b border-brand-navy/10">
            {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(day => (
              <div key={day} className="py-3 text-center text-[10px] font-black text-slate-900 uppercase tracking-widest">{day}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={`empty-${i}`} className="h-32 border-r border-b border-brand-navy/10 bg-brand-navy/5"></div>
            ))}
            {days.map(day => {
              const hasHearing = hearings.some(h => new Date(h.hearing_date).getDate() === day);
              return (
                <div key={day} className="h-32 border-r border-b border-brand-navy/10 p-2 hover:bg-brand-navy/5 transition-colors cursor-pointer group">
                  <span className={cn(
                    "inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-black transition-colors",
                    day === 9 ? "bg-brand-600 text-white" : "text-slate-950 group-hover:bg-slate-200"
                  )}>
                    {day}
                  </span>
                  {hasHearing && (
                    <div className="mt-2 space-y-1">
                      <div className="px-2 py-1 bg-amber-50 text-amber-700 text-[10px] font-bold rounded border border-amber-100 truncate">
                        Duruşma
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming List */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xl">
            <h3 className="font-bold text-brand-navy mb-6">Günün Programı</h3>
            <div className="space-y-6">
              {hearings.filter(h => new Date(h.hearing_date).getDate() === 9).map(hearing => (
                <div key={hearing.id} className="relative pl-6 border-l-2 border-brand-500 space-y-1">
                  <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-brand-500"></div>
                  <p className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                    {new Date(hearing.hearing_date).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <h4 className="text-sm font-bold text-brand-navy">{hearing.case_title}</h4>
                  <div className="flex items-center gap-2 text-[10px] text-slate-900 font-black">
                    <MapPin size={10} />
                    {hearing.location}
                  </div>
                </div>
              ))}
              {hearings.filter(h => new Date(h.hearing_date).getDate() === 9).length === 0 && (
                <p className="text-xs text-slate-900 font-black italic">Bugün için planlanmış etkinlik yok.</p>
              )}
            </div>
          </div>

          <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
            <h3 className="font-bold text-rose-900 mb-4 flex items-center gap-2">
              <Clock size={18} />
              Kritik Süreler
            </h3>
            <div className="space-y-4">
              <div className="p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-rose-200">
                <p className="text-[10px] font-bold text-rose-600 uppercase mb-1">Son 2 Gün</p>
                <p className="text-xs font-bold text-brand-navy">İstinaf Başvuru Süresi</p>
                <p className="text-[10px] text-slate-900 font-black mt-1">Dosya No: 2024/125 E.</p>
              </div>
              <div className="p-3 bg-white/50 backdrop-blur-sm rounded-xl border border-rose-200">
                <p className="text-[10px] font-bold text-rose-600 uppercase mb-1">Bugün Son</p>
                <p className="text-xs font-bold text-brand-navy">Cevap Dilekçesi Sunma</p>
                <p className="text-[10px] text-slate-900 font-black mt-1">Dosya No: 2023/890 E.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
