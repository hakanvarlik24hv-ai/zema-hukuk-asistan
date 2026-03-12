import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calculator, Percent, Scale, TrendingUp, Landmark, Gavel } from 'lucide-react';

export default function CalculatorPage() {
  const [activeTab, setActiveTab] = useState('Vekalet Ücreti');

  // States for different calculators
  const [amount, setAmount] = useState<number>(0);
  const [days, setDays] = useState<number>(0);
  const [rate, setRate] = useState<number>(9); // Default legal interest
  const [years, setYears] = useState<number>(0);
  const [salary, setSalary] = useState<number>(0);

  const [result, setResult] = useState<any>(null);

  const calculateFee = () => {
    let fee = 0;
    if (amount <= 100000) fee = amount * 0.16;
    else if (amount <= 200000) fee = 16000 + (amount - 100000) * 0.15;
    else fee = 31000 + (amount - 200000) * 0.14;

    if (fee < 17900) fee = 17900;
    const kdv = fee * 0.20;
    const stopaj = fee * 0.20;
    const net = fee + kdv - stopaj;
    setResult({ fee, kdv, stopaj, net });
  };

  const calculateInterest = () => {
    const interest = (amount * rate * days) / 36500;
    const total = amount + interest;
    setResult({ interest, total });
  };

  const calculateExecution = () => {
    const basvuruHarci = 427.60;
    const peşinHarç = amount * 0.005;
    const vekaletSureti = 60.00;
    const total = basvuruHarci + peşinHarç + vekaletSureti;
    setResult({ basvuruHarci, peşinHarç, vekaletSureti, total });
  };

  const calculateSeverance = () => {
    const kidem = salary * years;
    const ihbar = salary * 2; // Simplified: assuming 2 months
    const damgaVergisi = (kidem + ihbar) * 0.00759;
    const net = kidem + ihbar - damgaVergisi;
    setResult({ kidem, ihbar, damgaVergisi, net });
  };

  const calculateCourtFee = () => {
    const basvuruHarci = 427.60;
    const kararHarci = amount * 0.06831 / 4; // Peşin harç (1/4)
    const giderAvansi = 850.00;
    const total = basvuruHarci + kararHarci + giderAvansi;
    setResult({ basvuruHarci, kararHarci, giderAvansi, total });
  };

  const renderCalculator = () => {
    switch (activeTab) {
      case 'Vekalet Ücreti':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Dava Değeri (TL)</label>
                <input type="number" value={amount || ''} onChange={e => setAmount(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-logo-gold transition-all font-mono text-slate-950 font-bold" />
              </div>
              <button onClick={calculateFee} className="w-full bg-logo-gold text-brand-navy font-bold py-3 rounded-xl shadow-lg shadow-logo-gold/20 hover:bg-logo-gold/90 transition-all font-serif">Hesapla</button>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 flex flex-col justify-center border border-slate-100">
              <p className="text-slate-900 text-xs font-black mb-1 text-center uppercase tracking-widest">Hesaplanan Vekalet Ücreti</p>
              <h4 className="text-3xl font-black text-slate-950 text-center">₺{result?.fee?.toLocaleString('tr-TR') || '0,00'}</h4>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs text-slate-900 font-black"><span>KDV (%20)</span><span className="font-bold">₺{result?.kdv?.toLocaleString('tr-TR') || '0,00'}</span></div>
                <div className="flex justify-between text-xs text-slate-900 font-black"><span>Stopaj (%20)</span><span className="font-bold">₺{result?.stopaj?.toLocaleString('tr-TR') || '0,00'}</span></div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-logo-gold"><span>Net Ele Geçen</span><span>₺{result?.net?.toLocaleString('tr-TR') || '0,00'}</span></div>
              </div>
            </div>
          </div>
        );
      case 'Faiz Hesaplama':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Anapara (TL)</label>
                <input type="number" value={amount || ''} onChange={e => setAmount(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-logo-gold transition-all font-mono text-slate-950 font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Faiz Oranı (%)</label>
                  <input type="number" value={rate || ''} onChange={e => setRate(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-logo-gold transition-all font-mono text-slate-950 font-bold" />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Gün Sayısı</label>
                  <input type="number" value={days || ''} onChange={e => setDays(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-logo-gold transition-all font-mono text-slate-950 font-bold" />
                </div>
              </div>
              <button onClick={calculateInterest} className="w-full bg-logo-gold text-brand-navy font-bold py-3 rounded-xl shadow-lg shadow-logo-gold/20 hover:bg-logo-gold/90 transition-all font-serif">Hesapla</button>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 flex flex-col justify-center border border-slate-100">
              <p className="text-slate-950 text-xs font-black mb-1 text-center uppercase tracking-widest">Hesaplanan Faiz</p>
              <h4 className="text-3xl font-black text-slate-950 text-center">₺{result?.interest?.toLocaleString('tr-TR') || '0,00'}</h4>
              <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between text-sm font-black text-logo-gold"><span>Toplam Tutar</span><span>₺{result?.total?.toLocaleString('tr-TR') || '0,00'}</span></div>
            </div>
          </div>
        );
      case 'İcra Masrafları':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Takip Tutarı (TL)</label>
                <input type="number" value={amount || ''} onChange={e => setAmount(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-logo-gold transition-all font-mono text-slate-950 font-bold" />
              </div>
              <button onClick={calculateExecution} className="w-full bg-logo-gold text-brand-navy font-bold py-3 rounded-xl shadow-lg shadow-logo-gold/20 hover:bg-logo-gold/90 transition-all font-serif">Hesapla</button>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 flex flex-col justify-center border border-slate-100">
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-900 font-black"><span>Başvuru Harcı</span><span className="font-bold">₺{result?.basvuruHarci?.toLocaleString('tr-TR') || '0,00'}</span></div>
                <div className="flex justify-between text-xs text-slate-900 font-black"><span>Peşin Harç (%0.5)</span><span className="font-bold">₺{result?.peşinHarç?.toLocaleString('tr-TR') || '0,00'}</span></div>
                <div className="flex justify-between text-xs text-slate-900 font-black"><span>Vekalet Suret Harcı</span><span className="font-bold">₺{result?.vekaletSureti?.toLocaleString('tr-TR') || '0,00'}</span></div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-logo-gold"><span>Toplam Masraf</span><span>₺{result?.total?.toLocaleString('tr-TR') || '0,00'}</span></div>
              </div>
            </div>
          </div>
        );
      case 'Kıdem & İhbar':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Brüt Maaş (TL)</label>
                <input type="number" value={salary || ''} onChange={e => setSalary(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-logo-gold transition-all font-mono text-slate-950 font-bold" />
              </div>
              <div>
                <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Çalışma Süresi (Yıl)</label>
                <input type="number" value={years || ''} onChange={e => setYears(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-logo-gold transition-all font-mono text-slate-950 font-bold" />
              </div>
              <button onClick={calculateSeverance} className="w-full bg-logo-gold text-brand-navy font-bold py-3 rounded-xl shadow-lg shadow-logo-gold/20 hover:bg-logo-gold/90 transition-all font-serif">Hesapla</button>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 flex flex-col justify-center border border-slate-100">
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-900 font-black"><span>Kıdem Tazminatı</span><span className="font-bold">₺{result?.kidem?.toLocaleString('tr-TR') || '0,00'}</span></div>
                <div className="flex justify-between text-xs text-slate-900 font-black"><span>İhbar Tazminatı</span><span className="font-bold">₺{result?.ihbar?.toLocaleString('tr-TR') || '0,00'}</span></div>
                <div className="flex justify-between text-xs text-slate-900 font-black"><span>Damga Vergisi</span><span className="font-bold">₺{result?.damgaVergisi?.toLocaleString('tr-TR') || '0,00'}</span></div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-logo-gold"><span>Net Ödenecek</span><span>₺{result?.net?.toLocaleString('tr-TR') || '0,00'}</span></div>
              </div>
            </div>
          </div>
        );
      case 'Harç Hesaplama':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-slate-900 uppercase tracking-widest mb-2">Dava Değeri (TL)</label>
                <input type="number" value={amount || ''} onChange={e => setAmount(Number(e.target.value))} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-logo-gold transition-all font-mono text-slate-950 font-bold" />
              </div>
              <button onClick={calculateCourtFee} className="w-full bg-logo-gold text-brand-navy font-bold py-3 rounded-xl shadow-lg shadow-logo-gold/20 hover:bg-logo-gold/90 transition-all font-serif">Hesapla</button>
            </div>
            <div className="bg-slate-50 rounded-2xl p-6 flex flex-col justify-center border border-slate-100">
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-900 font-black"><span>Başvuru Harcı</span><span className="font-bold">₺{result?.basvuruHarci?.toLocaleString('tr-TR') || '0,00'}</span></div>
                <div className="flex justify-between text-xs text-slate-900 font-black"><span>Peşin Karar Harcı</span><span className="font-bold">₺{result?.kararHarci?.toLocaleString('tr-TR') || '0,00'}</span></div>
                <div className="flex justify-between text-xs text-slate-900 font-black"><span>Gider Avansı</span><span className="font-bold">₺{result?.giderAvansi?.toLocaleString('tr-TR') || '0,00'}</span></div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-logo-gold"><span>Toplam Harç & Masraf</span><span>₺{result?.total?.toLocaleString('tr-TR') || '0,00'}</span></div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-8"
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-logo-gold rounded-2xl flex items-center justify-center shadow-lg shadow-logo-gold/20">
          <Calculator className="text-brand-navy" size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white">Hesaplama Araçları</h1>
          <p className="text-white text-sm font-black">Faiz, vekalet ücreti ve asgari ücret tarifesine göre hızlı hesaplamalar yapın.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <CalcCard title="Vekalet Ücreti" description="AAÜT'ye göre nisbi ve maktu vekalet ücreti hesaplama." icon={Scale} color="bg-brand-navy" active={activeTab === 'Vekalet Ücreti'} onClick={() => { setActiveTab('Vekalet Ücreti'); setResult(null); }} />
        <CalcCard title="Faiz Hesaplama" description="Yasal, ticari ve temerrüt faizi hesaplama araçları." icon={TrendingUp} color="bg-logo-gold" active={activeTab === 'Faiz Hesaplama'} onClick={() => { setActiveTab('Faiz Hesaplama'); setResult(null); }} />
        <CalcCard title="İcra Masrafları" description="İcra takibi açılış masrafları ve harç hesaplama." icon={Landmark} color="bg-amber-500" active={activeTab === 'İcra Masrafları'} onClick={() => { setActiveTab('İcra Masrafları'); setResult(null); }} />
        <CalcCard title="Kıdem & İhbar" description="İş hukukuna uygun tazminat ve alacak hesaplamaları." icon={Gavel} color="bg-rose-500" active={activeTab === 'Kıdem & İhbar'} onClick={() => { setActiveTab('Kıdem & İhbar'); setResult(null); }} />
        <CalcCard title="Harç Hesaplama" description="Dava açılış harçları ve gider avansı hesaplama." icon={Percent} color="bg-indigo-500" active={activeTab === 'Harç Hesaplama'} onClick={() => { setActiveTab('Harç Hesaplama'); setResult(null); }} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-white/80 backdrop-blur-md p-8 rounded-2xl border border-white/20 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-logo-gold/10 text-logo-gold rounded-lg">
              <Scale size={20} />
            </div>
            <h3 className="text-lg font-black text-slate-950">{activeTab} Hesaplayıcı</h3>
          </div>

          {renderCalculator()}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}


function CalcCard({ title, description, icon: Icon, color, active, onClick }: any) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-white/80 backdrop-blur-md p-6 rounded-2xl border transition-all cursor-pointer group",
        active ? "border-logo-gold shadow-xl ring-2 ring-logo-gold/10" : "border-white/20 shadow-xl hover:shadow-2xl"
      )}
    >
      <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110", color)}>
        <Icon className={cn(color === "bg-logo-gold" ? "text-slate-950" : "text-white")} size={24} />
      </div>
      <h3 className="font-black text-slate-950 mb-2">{title}</h3>
      <p className="text-slate-900 text-xs font-black leading-relaxed">{description}</p>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
