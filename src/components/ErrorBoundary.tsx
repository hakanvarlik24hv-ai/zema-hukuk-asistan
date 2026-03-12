import React, { Component, ReactNode, ErrorInfo } from 'react';
import { AlertTriangle, RefreshCcw, Home, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleRestart = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-6 text-white overflow-hidden relative">
          {/* Background decoration */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-logo-gold/10 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="max-w-2xl w-full bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-8 md:p-12 shadow-2xl relative z-10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-logo-gold to-blue-500" />
            
            <div className="flex flex-col items-center text-center space-y-8">
              {/* Icon */}
              <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                <AlertTriangle className="text-red-500" size={40} />
              </div>

              {/* Text */}
              <div className="space-y-4">
                <h1 className="text-3xl md:text-4xl font-black tracking-tight bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent italic font-serif">
                  Bir Hata Oluştu
                </h1>
                <p className="text-slate-400 text-lg leading-relaxed max-w-md mx-auto">
                  Sistemi çalıştırırken beklenmedik bir durumla karşılaştık. Endişelenmeyin, verileriniz güvende.
                </p>
              </div>

              {/* Error Detail */}
              <div className="w-full bg-black/40 rounded-2xl p-4 border border-white/5 font-mono text-xs text-rose-300/80 text-left overflow-x-auto max-h-32 custom-scrollbar">
                <span className="text-white/40 block mb-1 uppercase tracking-widest font-sans font-bold">Teknik Detay:</span>
                {this.state.error?.toString() || 'Bilinmeyen Sistem Hatası'}
              </div>

              {/* Guidance Section */}
              <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-left">
                  <h4 className="font-bold text-logo-gold text-sm mb-1">Ne Yapabilirsiniz?</h4>
                  <ul className="text-xs text-slate-400 space-y-2">
                    <li className="flex gap-2"><span>•</span> Sayfayı yenileyerek tekrar deneyin.</li>
                    <li className="flex gap-2"><span>•</span> İnternet bağlantınızı kontrol edin.</li>
                    <li className="flex gap-2"><span>•</span> Sorun devam ederse teknik birimle görüşün.</li>
                  </ul>
                </div>
                <div className="bg-white/5 p-4 rounded-2xl border border-white/5 text-left flex flex-col justify-center">
                  <p className="text-xs text-slate-400 italic">"Hata denetim sistemimiz durumu otomatik olarak günlüğe kaydetti. Çözüm için çalışıyoruz."</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-center gap-4 w-full pt-4">
                <button
                  onClick={this.handleRestart}
                  className="flex-1 min-w-[160px] bg-logo-gold hover:bg-logo-gold/90 text-brand-navy font-black py-4 rounded-xl shadow-lg shadow-logo-gold/20 flex items-center justify-center gap-2 transition-all active:scale-95 group"
                >
                  <RefreshCcw className="group-hover:rotate-180 transition-transform duration-700" size={20} />
                  Sayfayı Yenile
                </button>
                <button
                  onClick={this.handleGoHome}
                  className="flex-1 min-w-[160px] bg-white/10 hover:bg-white/20 text-white font-bold py-4 rounded-xl border border-white/10 flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Home size={20} />
                  Ana Sayfaya Dön
                </button>
              </div>
              
              <button className="text-slate-500 hover:text-white text-xs flex items-center gap-2 transition-colors">
                <MessageSquare size={14} />
                Destek Ekibine Raporla
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
