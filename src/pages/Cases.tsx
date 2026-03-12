import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Briefcase, Plus, Search, Filter, MoreVertical, ChevronRight, Scale, Clock, MapPin, X } from 'lucide-react';
import { Case, Client } from '../types';
import { API_BASE_URL } from '../config';
import { cn } from '../lib/utils';

export default function Cases() {
  const [cases, setCases] = useState<Case[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCase, setSelectedCase] = useState<Case | null>(null);
  const [newCase, setNewCase] = useState({
    client_id: '',
    title: '',
    case_number: '',
    court: '',
    status: 'Aktif',
    description: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [clientsRes, casesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/clients`),
        fetch(`${API_BASE_URL}/api/cases`)
      ]);

      if (clientsRes.ok) {
        const clientsData = await clientsRes.json();
        setClients(clientsData);
      }

      if (casesRes.ok) {
        const casesData = await casesRes.json();
        setCases(casesData);
      }
    } catch (err) {
      console.error("Data fetch error in Cases:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddCase = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/cases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newCase,
          client_id: Number(newCase.client_id)
        }),
      });

      if (response.ok) {
        fetchData();
        setIsModalOpen(false);
        setNewCase({
          client_id: '',
          title: '',
          case_number: '',
          court: '',
          status: 'Aktif',
          description: ''
        });
      }
    } catch (error) {
      console.error('Error adding case:', error);
      window.alert('Dava eklenirken bir hata oluştu.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Dava Dosyaları</h1>
          <p className="text-white font-black text-sm">Aktif ve sonuçlanmış tüm dava dosyalarınızı takip edin.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-logo-gold hover:bg-logo-gold/90 text-brand-navy px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-logo-gold/20 transition-all font-serif"
        >
          <Plus size={20} />
          Yeni Dosya
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-20 text-center text-slate-400">Yükleniyor...</div>
        ) : cases.length > 0 ? cases.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ y: -4 }}
            className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl hover:shadow-2xl transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-logo-gold/10 text-logo-gold rounded-lg">
                <Scale size={20} />
              </div>
              <span className={cn(
                "px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider",
                item.status === 'Aktif' ? "bg-logo-gold/10 text-logo-gold" : "bg-slate-100 text-slate-500"
              )}>
                {item.status}
              </span>
            </div>

            <h3 className="text-lg font-black text-slate-950 mb-1 group-hover:text-logo-gold transition-colors">{item.title}</h3>
            <p className="text-xs font-black text-slate-900 mb-4">{item.case_number}</p>

            <div className="space-y-3 pt-4 border-t border-slate-50">
              <div className="flex items-center gap-2 text-slate-600">
                <MapPin size={14} className="text-slate-900" />
                <span className="text-xs font-bold text-slate-900 uppercase">{item.court}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-900">
                <Clock size={14} className="text-slate-900" />
                <span className="text-xs font-bold">{new Date(item.created_at).toLocaleDateString('tr-TR')}</span>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-[10px] font-bold">
                  {item.client_name?.[0]}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCase(item);
                }}
                className="text-xs font-bold text-logo-gold flex items-center gap-1 hover:underline"
              >
                Detaylar <ChevronRight size={14} />
              </button>
            </div>
          </motion.div>
        )) : (
          <div className="col-span-full py-20 text-center text-slate-400 italic">Dava dosyası bulunmuyor.</div>
        )}
      </div>
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-start justify-center p-4 pt-20 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-black text-white">Yeni Dava Dosyası</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-900 transition-all font-black"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAddCase} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-xs font-black text-slate-950 uppercase tracking-widest mb-2">Müvekkil Seçin</label>
                    <select
                      required
                      value={newCase.client_id}
                      onChange={e => setNewCase({ ...newCase, client_id: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-logo-gold text-slate-950 font-bold transition-all"
                    >
                      <option value="">Müvekkil seçin...</option>
                      {clients.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-black text-slate-950 uppercase tracking-widest mb-2">Dava Başlığı</label>
                    <input
                      required
                      type="text"
                      value={newCase.title}
                      onChange={e => setNewCase({ ...newCase, title: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-logo-gold text-slate-950 font-bold transition-all placeholder:text-slate-500"
                      placeholder="Örn: İşçi Alacağı Davası"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-950 uppercase tracking-widest mb-2">Esas No</label>
                    <input
                      required
                      type="text"
                      value={newCase.case_number}
                      onChange={e => setNewCase({ ...newCase, case_number: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-logo-gold font-mono text-slate-950 font-bold transition-all placeholder:text-slate-500"
                      placeholder="2024/123 E."
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black text-slate-950 uppercase tracking-widest mb-2">Mahkeme</label>
                    <input
                      required
                      type="text"
                      value={newCase.court}
                      onChange={e => setNewCase({ ...newCase, court: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-logo-gold text-slate-950 font-bold transition-all placeholder:text-slate-500"
                      placeholder="Örn: İstanbul 4. İş Mahkemesi"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-black text-slate-950 uppercase tracking-widest mb-2">Açıklama</label>
                    <textarea
                      value={newCase.description}
                      onChange={e => setNewCase({ ...newCase, description: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-logo-gold text-slate-950 font-bold transition-all min-h-[100px] placeholder:text-slate-500"
                      placeholder="Dava hakkında kısa bilgi..."
                    />
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-3 border border-slate-300 text-slate-950 font-black rounded-xl hover:bg-slate-50 transition-all"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-3 bg-logo-gold text-brand-navy font-black rounded-xl shadow-lg shadow-logo-gold/20 hover:bg-logo-gold/90 transition-all font-serif"
                  >
                    Kaydet
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedCase && (
          <div className="fixed inset-0 z-[9999] flex items-start justify-center p-4 pt-20 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCase(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-logo-gold/10 text-logo-gold rounded-2xl flex items-center justify-center shadow-inner">
                    <Briefcase size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-brand-navy">{selectedCase.title}</h3>
                    <p className="text-sm font-medium text-slate-500">{selectedCase.case_number}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCase(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-all shadow-sm"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 grid grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Müvekkil</label>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-10 h-10 rounded-full bg-logo-gold/20 text-logo-gold flex items-center justify-center font-bold">
                        {selectedCase.client_name?.[0]}
                      </div>
                      <span className="font-bold text-brand-navy">{selectedCase.client_name}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Mahkeme</label>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <MapPin size={18} className="text-logo-gold" />
                      <span className="font-medium text-brand-navy">{selectedCase.court}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Kayıt Tarihi</label>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <Clock size={18} className="text-logo-gold" />
                      <span className="font-medium text-brand-navy">{new Date(selectedCase.created_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Dosya Durumu</label>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-logo-gold/10 text-logo-gold text-xs font-bold ring-1 ring-logo-gold/20">
                      <div className="w-2 h-2 rounded-full bg-logo-gold animate-pulse"></div>
                      {selectedCase.status}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Dosya Açıklaması</label>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 min-h-[120px] text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                      {selectedCase.description || 'Bu dosya için herhangi bir açıklama girilmemiş.'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedCase(null)}
                  className="px-6 py-3 bg-brand-navy text-white font-bold rounded-xl hover:bg-brand-navy/90 transition-all shadow-lg shadow-brand-navy/20 font-serif"
                >
                  Kapat
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div >
  );
}

// Removed local cn function

