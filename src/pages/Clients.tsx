import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Plus, Search, Mail, Phone, MoreVertical, Filter, ChevronRight, X } from 'lucide-react';
import { Client } from '../types';
import { API_BASE_URL } from '../config';
import { cn } from '../lib/utils';

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', email: '', phone: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [selectedClientForView, setSelectedClientForView] = useState<Client | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/clients`);
      if (response.ok) {
        const data = await response.json();
        setClients(data);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newClient),
      });

      const result = await response.json();

      if (response.ok) {
        fetchClients();
        setIsModalOpen(false);
        setNewClient({ name: '', email: '', phone: '' });
      } else {
        window.alert(`Hata: ${result.error || 'Kaydetme sırasında bir hata oluştu.'}`);
      }
    } catch (error) {
      console.error('Error adding client:', error);
      window.alert('Bağlantı hatası: Sunucuya ulaşılamadı.');
    } finally {
      setIsSaving(false);
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
          <h1 className="text-2xl font-black text-white">Müvekkil Yönetimi</h1>
          <p className="text-white font-black text-sm">Tüm müvekkil kayıtlarını ve iletişim bilgilerini yönetin.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-logo-gold hover:bg-logo-gold/90 text-brand-navy px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-logo-gold/20 transition-all font-serif"
        >
          <Plus size={20} />
          Yeni Müvekkil
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-transparent">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-900" size={16} />
            <input
              type="text"
              placeholder="Müvekkil ara..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-lg text-sm text-slate-950 font-bold outline-none focus:ring-2 focus:ring-brand-500 transition-all placeholder:text-slate-600"
            />
          </div>
          <div className="flex gap-2">
            <button className="p-2 text-slate-900 hover:bg-white border border-transparent hover:border-slate-300 rounded-lg transition-all">
              <Filter size={18} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[300px] pb-24">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-transparent">
                <th className="px-6 py-4 data-grid-header">Müvekkil Adı</th>
                <th className="px-6 py-4 data-grid-header">E-posta</th>
                <th className="px-6 py-4 data-grid-header">Telefon</th>
                <th className="px-6 py-4 data-grid-header">Durum</th>
                <th className="px-6 py-4 data-grid-header"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 min-h-[200px]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-900 font-bold">Yükleniyor...</td>
                </tr>
              ) : clients.length > 0 ? clients.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50 transition-colors group cursor-pointer">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-sm">
                        {client.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-semibold text-brand-navy">{client.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-950 font-bold text-sm">
                      <Mail size={14} className="text-slate-900" />
                      {client.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-950 font-bold text-sm">
                      <Phone size={14} className="text-slate-900" />
                      {client.phone}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full bg-logo-gold/10 text-logo-gold text-[10px] font-bold uppercase tracking-wider">Aktif</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdown(activeDropdown === client.id ? null : client.id);
                          }}
                          className="p-2 text-slate-900 hover:text-black rounded-lg transition-all"
                        >
                          <MoreVertical size={18} />
                        </button>
                        {activeDropdown === client.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setActiveDropdown(null)} />
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 z-20 py-1 overflow-hidden">
                              <button
                                onClick={() => {
                                  setSelectedClientForView(client);
                                  setActiveDropdown(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm font-bold text-slate-900 hover:bg-slate-50 transition-colors"
                              >
                                Detayları Gör
                              </button>
                              <button
                                onClick={async () => {
                                  if (window.confirm('Bu müvekkil kaydını silmek istediğinize emin misiniz?')) {
                                    try {
                                      const res = await fetch(`${API_BASE_URL}/api/clients/${client.id}`, { method: 'DELETE' });
                                      if (res.ok) fetchClients();
                                    } catch (e) { }
                                  }
                                  setActiveDropdown(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
                              >
                                Sil
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                      <ChevronRight
                        size={18}
                        className="text-slate-900 hover:text-logo-gold transition-colors"
                        onClick={() => setSelectedClientForView(client)}
                      />
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-900 font-bold italic">Müvekkil kaydı bulunmuyor.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-start justify-center p-4 pt-20 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-950">Yeni Müvekkil Ekle</h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg text-slate-900 transition-all font-black"
                >
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleAddClient} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Ad Soyad</label>
                  <input
                    required
                    type="text"
                    value={newClient.name}
                    onChange={e => setNewClient({ ...newClient, name: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                    placeholder="Müvekkil adı..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">E-posta</label>
                  <input
                    required
                    type="email"
                    value={newClient.email}
                    onChange={e => setNewClient({ ...newClient, email: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                    placeholder="ornek@mail.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Telefon</label>
                  <input
                    required
                    type="tel"
                    value={newClient.phone}
                    onChange={e => setNewClient({ ...newClient, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-brand-500 transition-all"
                    placeholder="05xx xxx xx xx"
                  />
                </div>
                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-3 border border-slate-300 text-slate-900 font-black rounded-xl hover:bg-slate-50 transition-all"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className={`flex-1 px-4 py-3 bg-logo-gold text-brand-navy font-black rounded-xl shadow-lg shadow-logo-gold/20 hover:bg-logo-gold/90 transition-all font-serif ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {selectedClientForView && (
          <div className="fixed inset-0 z-[9999] flex items-start justify-center p-4 pt-20 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedClientForView(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-logo-gold/10 text-logo-gold rounded-2xl flex items-center justify-center shadow-inner font-bold text-xl">
                    {selectedClientForView.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-brand-navy">{selectedClientForView.name}</h3>
                    <p className="text-sm font-medium text-slate-500">Müvekkil Bilgileri</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedClientForView(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 transition-all shadow-sm"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">E-posta Adresi</label>
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <Mail size={18} className="text-logo-gold" />
                      <span className="font-bold text-brand-navy">{selectedClientForView.email}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Telefon Numarası</label>
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <Phone size={18} className="text-logo-gold" />
                      <span className="font-bold text-brand-navy">{selectedClientForView.phone}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Sistem Durumu</label>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 text-green-600 text-xs font-bold ring-1 ring-green-500/20">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      Aktif Müvekkil
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-end gap-3">
                <button
                  onClick={() => setSelectedClientForView(null)}
                  className="px-6 py-3 bg-brand-navy text-white font-bold rounded-xl hover:bg-brand-navy/90 transition-all shadow-lg shadow-brand-navy/20 font-serif"
                >
                  Kapat
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

