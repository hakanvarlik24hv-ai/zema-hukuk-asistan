import React, { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Send, Download, Copy, Loader2, FileSignature, AlertCircle, Check } from 'lucide-react';
import { generateContract } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
// Use CDN for html2pdf

export default function ContractGenerator() {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    contractType: 'Kira Sözleşmesi',
    details: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const text = await generateContract(formData);
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

  const handleDownloadWord = () => {
    const element = document.getElementById("contract-content");
    if (!element) return;

    const html = `<html xmlns:v="urn:schemas-microsoft-com:vml"
xmlns:o="urn:schemas-microsoft-com:office:office"
xmlns:w="urn:schemas-microsoft-com:office:word"
xmlns:m="http://schemas.microsoft.com/office/2004/12/omml"
xmlns="http://www.w3.org/TR/REC-html40">
<head>
    <meta http-equiv=Content-Type content="text/html; charset=utf-8">
    <title>Sozlesme</title>
    <!--[if gte mso 9]>
    <xml>
        <w:WordDocument>
            <w:View>Print</w:View>
            <w:Zoom>100</w:Zoom>
            <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
    </xml>
    <![endif]-->
    <style>
        @page WordSection1 {
            size: 21.0cm 29.7cm;
            margin: 2.5cm 2.5cm 2.5cm 2.5cm;
        }
        div.WordSection1 { page: WordSection1; }
        body { font-family: "Times New Roman", serif; font-size: 12pt; }
        p, span, div, h1, h2, h3, h4, li { 
            font-family: "Times New Roman", serif; 
            font-size: 12pt; 
            line-height: 1.5;
            text-align: justify;
        }
    </style>
</head>
<body>
    <div class="WordSection1">
        ${element.innerHTML}
    </div>
</body>
</html>`;

    const blob = new Blob(['\ufeff', html], {
      type: 'application/msword;charset=utf-8'
    });

    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'sozlesme.doc';
    downloadLink.click();
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="max-w-5xl mx-auto space-y-8"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-logo-gold rounded-2xl flex items-center justify-center shadow-lg shadow-logo-gold/20">
          <FileSignature className="text-brand-navy" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Otomatik Sözleşme Oluşturucu</h1>
          <p className="text-white text-sm font-black">Hukuka uygun, kapsamlı sözleşmeleri dakikalar içinde hazırlayın.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-white/20 shadow-xl space-y-4">
            <div>
              <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Sözleşme Türü</label>
              <select
                value={formData.contractType}
                onChange={e => setFormData({ ...formData, contractType: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900 focus:ring-2 focus:ring-logo-gold outline-none transition-all"
              >
                <option>Kira Sözleşmesi</option>
                <option>Hizmet Sözleşmesi</option>
                <option>İş Sözleşmesi</option>
                <option>Gizlilik Sözleşmesi (NDA)</option>
                <option>Satış Sözleşmesi</option>
                <option>Danışmanlık Sözleşmesi</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Sözleşme Detayları</label>
              <textarea
                placeholder="Taraflar, süre, bedel ve özel şartları belirtin..."
                value={formData.details}
                onChange={e => setFormData({ ...formData, details: e.target.value })}
                rows={10}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:ring-2 focus:ring-logo-gold outline-none transition-all resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-logo-gold hover:bg-logo-gold/90 text-brand-navy font-black py-4 rounded-xl shadow-lg shadow-logo-gold/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 font-serif"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              Sözleşmeyi Oluştur
            </button>
          </form>

          <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex gap-3">
            <AlertCircle className="text-blue-500 shrink-0" size={20} />
            <p className="text-xs text-blue-700 leading-relaxed">
              <strong>İpucu:</strong> Tarafların TC kimlik numaralarını, adreslerini ve sözleşme bedelini net bir şekilde belirtmeniz daha sağlıklı sonuçlar verecektir.
            </p>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/20 shadow-sm h-full flex flex-col min-h-[600px]">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-brand-navy flex items-center gap-2">
                <FileText size={18} className="text-slate-400" />
                Sözleşme Taslağı
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

                </div>
              )}
            </div>
            <div className="flex-1 p-4 lg:p-8 overflow-y-auto bg-slate-50/30">
              {loading ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                  <Loader2 className="animate-spin text-logo-gold" size={40} />
                  <p className="text-sm font-black text-slate-900">Sözleşmeniz hazırlanıyor...</p>
                </div>
              ) : result ? (
                <div id="contract-content" className="max-w-[21cm] mx-auto bg-white shadow-2xl p-[2.5cm] min-h-[29.7cm] border border-slate-200">
                  <div 
                    className="markdown-body text-black"
                    style={{
                      fontFamily: "'Times New Roman', serif",
                      fontSize: "12pt",
                      lineHeight: "1.5",
                      textAlign: "justify"
                    }}
                  >
                    <ReactMarkdown>{result}</ReactMarkdown>
                  </div>
                </div>
              ) : error ? (
                <div className="h-full flex flex-col items-center justify-center text-rose-600 space-y-4 text-center px-12">
                  <AlertCircle size={48} />
                  <p className="font-black">{error}</p>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-4 text-center px-12">
                  <FileSignature size={64} strokeWidth={1} />
                  <p className="text-sm font-black text-slate-950">Detayları girip "Oluştur" butonuna bastığınızda sözleşmeniz burada görünecektir.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
