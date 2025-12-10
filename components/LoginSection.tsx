
import React, { useState } from 'react';
import { Lock, User, Key, ArrowRight, AlertCircle, Activity } from 'lucide-react';
import { User as UserType } from '../types';

interface LoginSectionProps {
  onLoginSuccess: (user: UserType) => void;
  users: UserType[];
}

const LoginSection: React.FC<LoginSectionProps> = ({ onLoginSuccess, users }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay for better UX
    setTimeout(() => {
      const foundUser = users.find(
        (u) => u.username === username && u.password === password
      );

      if (foundUser) {
        onLoginSuccess(foundUser);
      } else {
        setError('Username atau password salah. Silakan coba lagi.');
      }
      setIsLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-teal-900 px-4 py-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-teal-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md w-full space-y-8 bg-white/95 backdrop-blur-sm p-10 rounded-2xl shadow-2xl relative z-10">
        <div className="text-center">
          <div className="mx-auto h-20 w-20 bg-teal-100 rounded-full flex items-center justify-center mb-6 shadow-inner">
            <Activity className="h-10 w-10 text-teal-600" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">Selamat Datang</h2>
          <p className="mt-2 text-sm text-slate-600">
            Sistem Informasi & Profil Digital Puskesmas
          </p>
          <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full bg-teal-50 border border-teal-100 text-teal-700 text-xs font-medium">
            <Lock className="w-3 h-3 mr-1" /> Akses Terbatas
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          {error && (
            <div className="rounded-md bg-red-50 p-4 border border-red-200 flex items-start animate-fade-in">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-colors"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Key className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg placeholder-slate-400 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm transition-colors"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-all ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'shadow-lg shadow-teal-500/30'
              }`}
            >
              {isLoading ? (
                'Memproses...'
              ) : (
                <span className="flex items-center">
                  Masuk Aplikasi
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              )}
            </button>
          </div>
        </form>
        
        <div className="text-center text-xs text-slate-400 mt-4 border-t border-slate-100 pt-4">
           <p>Gunakan akun demo:</p>
           <p className="font-mono mt-1 text-slate-500 font-semibold">User: admin | Pass: admin123</p>
        </div>
      </div>
    </div>
  );
};

export default LoginSection;
