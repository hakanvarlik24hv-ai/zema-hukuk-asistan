import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Send, Download, Copy, Loader2, Sparkles, AlertCircle, Check } from 'lucide-react';
import { generatePetition } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
// @ts-ignore
import html2pdf from 'html2pdf.js';

export default function PetitionGenerator() {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    caseType: 'Boşanma Davası',
    parties: '',
    summary: '',
    documentType: 'Dava Dilekçesi'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const text = await generatePetition(formData);
      setResult(text || '');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Bir hata oluştu. Lütfen API anahtarını kontrol edin.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById("petition-content");
    if (!element) return;
    const opt = {
      margin: 15,
      filename: 'dilekce.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  };

  const handleDownloadWord = () => {
    const element = document.getElementById("petition-content");
    if (!element) return;

    // Minimal valid HTML structure with charset for tr characters
    const preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Dilekce</title></head><body>";
    const postHtml = "</body></html>";
    const html = preHtml + element.innerHTML + postHtml;

    // Create a Blob with the file content
    const blob = new Blob(['\ufeff', html], {
      type: 'application/msword;charset=utf-8'
    });

    // Create a link to download it
    const downloadLink = document.createElement("a");
    document.body.appendChild(downloadLink);
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'dilekce.doc';
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-5xl mx-auto space-y-8"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-logo-gold rounded-2xl flex items-center justify-center shadow-lg shadow-logo-gold/20">
          <Sparkles className="text-brand-navy" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Yapay Zeka Dilekçe Oluşturucu</h1>
          <p className="text-white text-sm font-black">Saniyeler içinde profesyonel ve hukuka uygun dilekçeler hazırlayın.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xl space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Dava Türü</label>
              <select
                value={formData.caseType}
                onChange={e => setFormData({ ...formData, caseType: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-logo-gold outline-none transition-all"
              >
                <option>Boşanma Davası</option>
                <option>İşçi Alacağı Davası</option>
                <option>İcra Takibi</option>
                <option>Kira Tahliye Davası</option>
                <option>Tazminat Davası</option>
                <option>Ceza Davası</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Belge Türü</label>
              <select
                value={formData.documentType}
                onChange={e => setFormData({ ...formData, documentType: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-logo-gold outline-none transition-all"
              >
                <option>Dava Dilekçesi</option>
                <option>Cevap Dilekçesi</option>
                <option>İstinaf Dilekçesi</option>
                <option>Beyan Dilekçesi</option>
                <option>Delil Listesi</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Taraf Bilgileri</label>
              <textarea
                placeholder="Davacı: Ad Soyad, TC... Davalı: Ad Soyad..."
                value={formData.parties}
                onChange={e => setFormData({ ...formData, parties: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-logo-gold outline-none transition-all resize-none placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Olay Özeti ve Talepler</label>
              <textarea
                placeholder="Davanın konusunu ve taleplerinizi kısaca özetleyin..."
                value={formData.summary}
                onChange={e => setFormData({ ...formData, summary: e.target.value })}
                rows={6}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-logo-gold outline-none transition-all resize-none placeholder:text-slate-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-logo-gold hover:bg-logo-gold/90 text-brand-navy font-black py-4 rounded-xl shadow-lg shadow-logo-gold/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 font-serif"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              Dilekçeyi Oluştur
            </button>
          </form>

          <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3">
            <AlertCircle className="text-amber-500 shrink-0" size={20} />
            <p className="text-xs text-amber-700 leading-relaxed">
              <strong>Önemli Not:</strong> Yapay zeka tarafından oluşturulan metinler taslak niteliğindedir. Lütfen hukuki geçerlilik için metni kontrol ediniz ve gerekli düzenlemeleri yapınız.
            </p>
          </div>
        </div>

        {/* Result Section */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm h-full flex flex-col min-h-[600px]">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-brand-navy flex items-center gap-2">
                <FileText size={18} className="text-slate-400" />
                Dilekçe Taslağı
              </h3>
              {result && (
                <div className="flex gap-2">
                  <button onClick={handleCopy} className="flex items-center gap-1 px-3 py-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors text-sm font-semibold border border-slate-200" title="Kopyala">
                    {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                    <span className="hidden sm:inline">{copied ? 'Kopyalandı' : 'Kopyala'}</span>
                  </button>
                  <button onClick={handleDownloadWord} className="flex items-center gap-1 px-3 py-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors text-sm font-semibold border border-slate-200" title="Word Olarak İndir">
                    <Download size={16} />
                    <span className="hidden sm:inline">Word İndir</span>
                  </button>
                  <button onClick={handleDownloadPDF} className="flex items-center gap-1 px-3 py-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors text-sm font-semibold border border-slate-200" title="PDF Olarak İndir">
                    <Download size={16} />
                    <span className="hidden sm:inline">PDF İndir</span>
                  </button>
                </div>
              )}
            </div>
            <div className="flex-1 p-8 overflow-y-auto prose prose-slate max-w-none">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-950 font-black space-y-4">
                  <Loader2 className="animate-spin text-logo-gold" size={40} />
                  <p className="text-sm">Dilekçeniz hazırlanıyor, lütfen bekleyin...</p>
                </div>
              ) : result ? (
                <div id="petition-content" className="markdown-body text-slate-800">
                  <ReactMarkdown>{result}</ReactMarkdown>
                </div>
              ) : error ? (
                <div className="h-full flex flex-col items-center justify-center text-rose-600 space-y-4 text-center px-12">
                  <AlertCircle size={48} />
                  <p className="font-black">{error}</p>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-900 space-y-4 text-center px-12">
                  <FileText size={64} strokeWidth={2} className="text-slate-900" />
                  <p className="text-sm font-black">Formu doldurup "Oluştur" butonuna bastığınızda dilekçe tertemiz bir şekilde burada görünecektir.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
