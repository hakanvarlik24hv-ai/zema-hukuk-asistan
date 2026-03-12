import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Search, Loader2, Scale, ExternalLink, Bookmark, Filter, AlertCircle } from 'lucide-react';
import { searchPrecedents } from '../services/geminiService';

export default function PrecedentSearch() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    setLoading(true);
    setError('');
    try {
      const data = await searchPrecedents(query);
      setResults(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Arama sırasında bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-logo-gold rounded-2xl flex items-center justify-center shadow-lg shadow-logo-gold/20">
            <Scale className="text-brand-navy" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Emsal Karar Arama Motoru</h1>
            <p className="text-white text-sm font-black">Yargıtay, Danıştay ve BAM kararlarını yapay zeka ile analiz edin.</p>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-md p-2 rounded-2xl border border-white/20 shadow-sm flex items-center gap-2">
        <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              placeholder="Örn: 'İşçinin haksız fesih tazminatı', 'Kira tahliyesi ihtiyaç nedeniyle'..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-transparent text-slate-950 text-lg outline-none font-bold"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-logo-gold hover:bg-logo-gold/90 text-brand-navy px-8 py-4 rounded-xl font-black transition-all disabled:opacity-50 flex items-center gap-2 font-serif shadow-lg shadow-logo-gold/20"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
            Ara
          </button>
        </form>
        <button className="p-4 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
          <Filter size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="animate-spin text-indigo-600" size={48} />
            <p className="text-slate-500 font-medium">Kararlar analiz ediliyor...</p>
          </div>
        ) : results.length > 0 ? (
          results.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-bold uppercase tracking-wider rounded-lg">
                    {item.court}
                  </div>
                  <span className="text-xs font-mono text-slate-400">{item.number}</span>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                    <Bookmark size={18} />
                  </button>
                  <button className="p-2 text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                    <ExternalLink size={18} />
                  </button>
                </div>
              </div>
              <h3 className="text-lg font-bold text-brand-navy mb-3 group-hover:text-indigo-600 transition-colors">
                {item.principle}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                {item.summary}
              </p>
              <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Hukuki İlke</span>
                <button className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                  Tam Metni Gör <ExternalLink size={12} />
                </button>
              </div>
            </motion.div>
          ))
        ) : error ? (
          <div className="py-20 flex flex-col items-center justify-center text-rose-500 space-y-4">
            <AlertCircle size={48} />
            <p className="text-sm font-black">{error}</p>
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-slate-300 space-y-4">
            <Scale size={64} strokeWidth={1} />
            <p className="text-sm font-black text-slate-950">Arama yaparak emsal kararlara ulaşabilirsiniz.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
