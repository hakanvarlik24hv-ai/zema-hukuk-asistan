import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, Plus, Search, Filter, ChevronRight, X, TurkishLira, Calendar, User, Briefcase } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { cn } from '../lib/utils';
import { useToast } from '../components/ToastProvider';

interface Payment {
  id: number;
  case_id: number;
  case_title?: string;
  client_name?: string;
  amount: number;
  status: string;
  due_date: string;
}

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { showToast } = useToast();
  const [newPayment, setNewPayment] = useState({
    case_id: '',
    amount: '',
    status: 'Bekliyor',
    due_date: new Date().toISOString().split('T')[0]
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [paymentsRes, casesRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/payments`),
        fetch(`${API_BASE_URL}/api/cases`)
      ]);

      if (paymentsRes.ok) setPayments(await paymentsRes.json());
      if (casesRes.ok) setCases(await casesRes.json());
    } catch (err) {
      console.error("Data fetch error in Payments:", err);
      showToast('error', 'Hata', 'Veriler yüklenirken bir sorun oluştu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/api/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newPayment,
          case_id: Number(newPayment.case_id),
          amount: Number(newPayment.amount)
        }),
      });

      if (response.ok) {
        showToast('success', 'Ödeme Eklendi', 'Yeni ödeme kaydı başarıyla oluşturuldu.');
        fetchData();
        setIsModalOpen(false);
        setNewPayment({
          case_id: '',
          amount: '',
          status: 'Bekliyor',
          due_date: new Date().toISOString().split('T')[0]
        });
      }
    } catch (error) {
      showToast('error', 'Hata', 'Ödeme kaydedilemedi.');
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">Ödemeler ve Tahsilat</h1>
          <p className="text-white font-black text-sm">Müvekkil ödemelerini ve bekleyen borçları takip edin.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-logo-gold hover:bg-logo-gold/90 text-brand-navy px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-logo-gold/20 transition-all"
        >
          <Plus size={20} />
          Yeni Ödeme Kaydı
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/20 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Müvekkil / Dava</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Vade Tarihi</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tutar</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Durum</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">Yükleniyor...</td></tr>
              ) : payments.length > 0 ? payments.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-black text-slate-900 text-sm">{p.client_name}</span>
                      <span className="text-[10px] text-slate-500 font-bold uppercase">{p.case_title}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Calendar size={14} className="text-logo-gold" />
                      <span className="text-xs font-bold text-slate-900">
                        {new Date(p.due_date).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-black text-brand-navy">₺{p.amount.toLocaleString('tr-TR')}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
                      p.status === 'Ödendi' ? "bg-emerald-100 text-emerald-700" :
                      p.status === 'Gecikmiş' ? "bg-rose-100 text-rose-700" :
                      "bg-amber-100 text-amber-700"
                    )}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-slate-400 hover:text-logo-gold hover:bg-logo-gold/5 rounded-lg transition-all">
                      <ChevronRight size={18} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="px-6 py-12 text-center text-slate-400 italic">Kayıtlı ödeme bulunmuyor.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900">Yeni Ödeme Kaydı</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl text-slate-400"><X size={20} /></button>
              </div>
              <form onSubmit={handleAddPayment} className="p-6 space-y-4">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Dava Dosyası</label>
                  <select
                    required
                    value={newPayment.case_id}
                    onChange={e => setNewPayment({ ...newPayment, case_id: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-logo-gold font-bold transition-all"
                  >
                    <option value="">Dava seçin...</option>
                    {cases.map(c => <option key={c.id} value={c.id}>{c.client_name} - {c.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tutar (₺)</label>
                  <div className="relative">
                    <TurkishLira className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      required
                      type="number"
                      value={newPayment.amount}
                      onChange={e => setNewPayment({ ...newPayment, amount: e.target.value })}
                      placeholder="0.00"
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-logo-gold font-bold transition-all"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Vade Tarihi</label>
                    <input
                      required
                      type="date"
                      value={newPayment.due_date}
                      onChange={e => setNewPayment({ ...newPayment, due_date: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-logo-gold font-bold transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Durum</label>
                    <select
                      value={newPayment.status}
                      onChange={e => setNewPayment({ ...newPayment, status: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-logo-gold font-bold transition-all"
                    >
                      <option value="Bekliyor">Bekliyor</option>
                      <option value="Ödendi">Ödendi</option>
                      <option value="Gecikmiş">Gecikmiş</option>
                    </select>
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 border border-slate-200 font-black rounded-2xl hover:bg-slate-50 transition-all text-sm">İptal</button>
                  <button type="submit" className="flex-1 py-3.5 bg-logo-gold text-brand-navy font-black rounded-2xl shadow-lg shadow-logo-gold/20 hover:bg-logo-gold/90 transition-all text-sm">Kaydet</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
