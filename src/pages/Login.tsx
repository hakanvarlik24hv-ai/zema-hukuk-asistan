import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, ArrowRight, Building, Scale, ShieldCheck } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function Login({ onLogin }: { onLogin: (pass: string) => void }) {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState<'login' | 'selection'>('login');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const res = await fetch(`${API_BASE_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            if (res.ok) {
                setStep('selection');
            } else {
                const data = await res.json();
                setError(data.error || 'Hatalı şifre, lütfen tekrar deneyin.');
            }
        } catch (err) {
            setError('Sunucu bağlantı hatası.');
        } finally {
            setIsLoading(false);
        }
    };

    if (step === 'selection') {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-overlay" style={{ backgroundImage: "url('https://i.hizliresim.com/t11q2tv.jpg')" }} />
                <div className="absolute inset-0 bg-gradient-to-tr from-brand-900/90 via-slate-900/95 to-slate-900/90" />

                <div className="relative z-10 w-full max-w-4xl px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center mb-12 sm:mb-20"
                    >
                        <div className="inline-block p-4 sm:p-5 rounded-[2.5rem] bg-white/5 backdrop-blur-3xl border border-white/10 shadow-2xl mb-8">
                            <img src="https://i.hizliresim.com/j4yxat8.png" alt="Zema Logo" className="h-16 sm:h-24 drop-shadow-2xl" />
                        </div>
                        <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-logo-gold to-yellow-200 mb-6 tracking-tight">
                            Yönetim Merkezi
                        </h1>
                        <p className="text-white/60 text-base sm:text-xl font-medium max-w-2xl mx-auto px-4">
                            Lütfen işlem yapmak istediğiniz paneli seçin
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10 max-w-5xl mx-auto">
                        <SelectionCard
                            title="Site Yönetimi"
                            desc="Web sitesi (zemahukuk.com.tr) içeriğini yönetin."
                            icon={Building}
                            href="https://zemahukuk.com.tr/wp-admin"
                            delay={0.1}
                        />

                        <SelectionCard
                            title="Hukuk Asistanı"
                            desc="Dava dosyaları, müvekkiller ve AI araçlarını yönetin."
                            icon={Scale}
                            onClick={() => onLogin(password)}
                            primary
                            delay={0.2}
                        />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-cover bg-center opacity-20 mix-blend-overlay" style={{ backgroundImage: "url('https://i.hizliresim.com/t11q2tv.jpg')" }} />
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-950" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 w-full max-w-md"
            >
                <div className="bg-white/[0.03] backdrop-blur-3xl border border-white/10 p-8 sm:p-12 rounded-[3.5rem] shadow-[0_30px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-logo-gold/5 rounded-full blur-[80px] pointer-events-none" />

                    <div className="text-center mb-12 relative z-10">
                        <div className="inline-flex items-center justify-center p-4 rounded-3xl bg-white/5 border border-white/10 shadow-2xl mb-8 group-hover:scale-105 transition-transform duration-500">
                            <img src="https://i.hizliresim.com/j4yxat8.png" alt="Zema Logo" className="h-16 w-16 object-contain" />
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tight mb-2">Güvenli Giriş</h2>
                        <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-[10px]">Zema Hukuk Yönetim Paneli</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-white/50 uppercase tracking-widest ml-1">Erişim Şifresi</label>
                            <div className="relative group/input">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-white/20 w-5 h-5 group-focus-within/input:text-logo-gold transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className={`w-full bg-white/5 border rounded-[1.5rem] py-5 pl-14 pr-6 text-white placeholder-white/20 focus:outline-none focus:ring-4 transition-all focus:bg-white/10 ${error ? 'border-red-500/50 focus:ring-red-500/10' : 'border-white/10 focus:ring-logo-gold/10 focus:border-logo-gold/50'}`}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                            {error && (
                                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-red-400 text-xs mt-2 ml-1 font-bold">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                                    {error}
                                </motion.div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-br from-logo-gold to-yellow-600 text-brand-navy font-black py-5 rounded-[1.5rem] hover:shadow-[0_20px_40px_-10px_rgba(197,160,89,0.3)] hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3 text-lg mt-4 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        >
                            {isLoading ? 'Doğrulanıyor...' : 'Giriş Yap'}
                            <ShieldCheck className="w-6 h-6" />
                        </button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}

function SelectionCard({ title, desc, icon: Icon, href, onClick, primary, delay }: any) {
    const Component = href ? 'a' : 'button';
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
        >
            <Component
                href={href}
                onClick={onClick}
                className={`w-full block text-left p-8 sm:p-10 rounded-[3rem] border transition-all duration-500 relative overflow-hidden group hover:-translate-y-2 cursor-pointer shadow-2xl ${primary
                        ? 'bg-gradient-to-br from-logo-gold/20 to-logo-gold/5 border-logo-gold/30 hover:border-logo-gold/60'
                        : 'bg-white/5 border-white/10 hover:border-white/20'
                    }`}
            >
                <div className={`absolute inset-0 bg-gradient-to-br ${primary ? 'from-logo-gold/10' : 'from-white/5'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-[1.5rem] flex items-center justify-center mb-8 transition-all duration-500 shadow-xl border ${primary
                        ? 'bg-gradient-to-br from-logo-gold to-yellow-600 border-white/20'
                        : 'bg-white/10 border-white/5 group-hover:bg-white/20'
                    }`}>
                    <Icon className={`w-8 h-8 sm:w-10 sm:h-10 ${primary ? 'text-brand-navy' : 'text-white/80'}`} strokeWidth={2.5} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white mb-4 tracking-tight relative z-10">{title}</h3>
                <p className={`text-sm sm:text-base leading-relaxed relative z-10 ${primary ? 'text-logo-gold/80' : 'text-white/40'}`}>{desc}</p>
                <div className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/50 group-hover:text-white transition-colors">
                    Hemen Git <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
            </Component>
        </motion.div>
    );
}
