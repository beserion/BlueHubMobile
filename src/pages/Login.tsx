import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User, Loader2, AlertCircle, ArrowRight, Ship, Anchor } from 'lucide-react';
import Logo from '../components/Logo.svg';

const Login = () => {
    const [identifier, setIdentifier] = useState('admin@bluehub.com');
    const [password, setPassword] = useState('BlueHub1!');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Redirect to where they wanted to go, or home
    const from = (location.state as any)?.from?.pathname || '/';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Check if identifier is email-like
            const isEmail = identifier.includes('@');
            await login({
                email: isEmail ? identifier : "",
                userName: !isEmail ? identifier : "",
                password
            });
            navigate(from, { replace: true });
        } catch (err: any) {
            setError(err.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full relative flex items-center justify-center overflow-hidden bg-slate-900">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-slate-900/60 to-slate-950/80 z-10" />
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1498036882173-b41c28a8ba34?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-30 animate-pulse-slow" />

                {/* Floating Orbs */}
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-blue-600/20 blur-[100px] animate-blob" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/20 blur-[100px] animate-blob animation-delay-2000" />
                <div className="absolute top-[40%] left-[40%] w-[300px] h-[300px] rounded-full bg-emerald-500/10 blur-[80px] animate-blob animation-delay-4000" />
            </div>

            {/* Glass Card Container */}
            <div className="relative z-20 w-full max-w-md px-4 mx-4">
                <div className="backdrop-blur-xl bg-white/10 dark:bg-slate-950/40 border border-white/20 dark:border-white/10 shadow-2xl rounded-3xl p-6 sm:p-8 overflow-hidden relative group">

                    {/* Glossy Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none opacity-50" />

                    {/* Header */}
                    <div className="relative flex flex-col items-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-tr from-sky-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg mb-4 shadow-sky-500/30 transform group-hover:scale-105 transition-transform duration-500">
                            <Ship className="text-white w-10 h-10" />
                        </div>
                        <h1 className="text-3xl font-black text-white tracking-tight text-center">
                            BlueHUB
                        </h1>
                        <p className="text-blue-200/80 text-sm font-medium mt-1 text-center">
                            Marine Operations System
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl flex items-start gap-3 backdrop-blur-md animate-shake">
                            <AlertCircle className="text-red-300 shrink-0 mt-0.5" size={18} />
                            <p className="text-sm text-red-100 font-medium">{error}</p>
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-5 relative">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-blue-100/70 ml-1 uppercase tracking-wider">
                                Kullanıcı Adı
                            </label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-200/50 group-focus-within:text-sky-400 transition-colors">
                                    <User className="h-5 w-5" />
                                </div>
                                <input
                                    type="text"
                                    required
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-4 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-blue-200/30 transition-all duration-300 focus:bg-slate-900/70 focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 outline-none backdrop-blur-sm"
                                    placeholder="Kullanıcı adı veya e-posta"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between ml-1">
                                <label className="text-xs font-bold text-blue-100/70 uppercase tracking-wider">
                                    Şifre
                                </label>
                                <a href="#" className="text-xs font-medium text-sky-400 hover:text-sky-300 transition-colors">
                                    Unuttum?
                                </a>
                            </div>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-blue-200/50 group-focus-within:text-sky-400 transition-colors">
                                    <Lock className="h-5 w-5" />
                                </div>
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-4 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-blue-200/30 transition-all duration-300 focus:bg-slate-900/70 focus:border-sky-500/50 focus:ring-2 focus:ring-sky-500/20 outline-none backdrop-blur-sm"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full relative group overflow-hidden rounded-xl p-[1px] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 transition-all active:scale-[0.98]"
                        >
                            <span className="absolute inset-0 bg-gradient-to-r from-sky-400 via-blue-500 to-purple-600 group-hover:bg-gradient-to-br transition-all duration-300" />
                            <div className="relative bg-slate-900/50 backdrop-blur-sm group-hover:bg-transparent transition-colors duration-300 rounded-[11px] h-full flex items-center justify-center py-4 px-6">
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                                        <span className="font-bold text-white">Giriş Yapılıyor...</span>
                                    </>
                                ) : (
                                    <span className="font-bold text-white flex items-center gap-2">
                                        Giriş Yap <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </div>
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-xs text-blue-200/40 font-medium">
                            &copy; {new Date().getFullYear()} BlueHUB Marine Systems
                        </p>
                    </div>
                </div>

                {/* Bottom decorative line */}
                <div className="mt-6 flex justify-center gap-4 text-xs font-medium text-blue-200/30">
                    <a href="#" className="hover:text-sky-400 transition-colors">Gizlilik</a>
                    <span>•</span>
                    <a href="#" className="hover:text-sky-400 transition-colors">Şartlar</a>
                    <span>•</span>
                    <a href="#" className="hover:text-sky-400 transition-colors">Yardım</a>
                </div>
            </div>
        </div>
    );
};

export default Login;