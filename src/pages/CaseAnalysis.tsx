import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileSearch, Upload, Loader2, AlertTriangle, CheckCircle2, Info, ArrowRight } from 'lucide-react';
import { analyzeCaseFile } from '../services/geminiService';

export default function CaseAnalysis() {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!content) return;
    setLoading(true);
    setError('');
    try {
      const data = await analyzeCaseFile(content);
      setAnalysis(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Analiz sırasında bir hata oluştu.');
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
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-logo-gold rounded-2xl flex items-center justify-center shadow-lg shadow-logo-gold/20">
          <FileSearch className="text-brand-navy" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Otomatik Dava Dosyası Analizi</h1>
          <p className="text-white text-sm font-black">Dilekçelerdeki riskleri, eksiklikleri ve stratejik önerileri anında görün.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl">
            <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-4">Dilekçe veya Dosya Metni</label>
            <textarea
              placeholder="Analiz edilmesini istediğiniz metni buraya yapıştırın..."
              value={content}
              onChange={e => setContent(e.target.value)}
              rows={15}
              className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-logo-gold outline-none transition-all resize-none font-mono"
            />
            <button
              onClick={handleAnalyze}
              disabled={loading || !content}
              className="w-full mt-4 bg-logo-gold hover:bg-logo-gold/90 text-brand-navy font-black py-4 rounded-xl shadow-lg shadow-logo-gold/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 font-serif"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <FileSearch size={20} />}
              Analizi Başlat
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center py-20 bg-white/80 backdrop-blur-md rounded-2xl border border-dashed border-slate-300 shadow-xl">
              <Loader2 className="animate-spin text-logo-gold mb-4" size={48} />
              <p className="text-slate-900 font-black">Yapay zeka dosyayı inceliyor...</p>
            </div>
          ) : analysis ? (
            <div className="space-y-6">
              {/* Risks */}
              <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl">
                <div className="flex items-center gap-2 mb-4 text-rose-600">
                  <AlertTriangle size={20} />
                  <h3 className="font-bold">Hukuki Riskler</h3>
                </div>
                <ul className="space-y-3">
                  {analysis.risks?.map((risk: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 p-3 bg-rose-50 rounded-xl text-sm text-rose-700">
                      <ArrowRight size={14} className="mt-1 shrink-0" />
                      {risk}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Missing Points */}
              <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl">
                <div className="flex items-center gap-2 mb-4 text-amber-600">
                  <Info size={20} />
                  <h3 className="font-bold">Eksik Noktalar</h3>
                </div>
                <ul className="space-y-3">
                  {analysis.missingPoints?.map((point: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl text-sm text-amber-700">
                      <ArrowRight size={14} className="mt-1 shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suggestions */}
              <div className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl">
                <div className="flex items-center gap-2 mb-4 text-emerald-600">
                  <CheckCircle2 size={20} />
                  <h3 className="font-bold">Stratejik Öneriler</h3>
                </div>
                <ul className="space-y-3">
                  {analysis.suggestions?.map((sug: string, i: number) => (
                    <li key={i} className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl text-sm text-emerald-700">
                      <ArrowRight size={14} className="mt-1 shrink-0" />
                      {sug}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : error ? (
            <div className="h-full flex flex-col items-center justify-center py-20 bg-white/80 backdrop-blur-md rounded-2xl border border-dashed border-rose-300 shadow-xl text-rose-600 text-center px-12">
              <AlertTriangle size={64} className="mb-4" />
              <p className="font-black">{error}</p>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-20 bg-white/80 backdrop-blur-md rounded-2xl border border-dashed border-slate-200 shadow-xl text-slate-400 text-center px-12">
              <Upload size={64} strokeWidth={1} className="mb-4" />
              <p className="text-sm font-black text-slate-950">Metni yapıştırıp analizi başlattığınızda sonuçlar burada görünecektir.</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
