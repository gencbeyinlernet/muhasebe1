
import React, { useState } from 'react';
import { User, Mail, Briefcase, LogOut, UserCheck, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { User as UserType } from '../types';
import { supabase } from '../lib/supabase';

interface UserPanelProps {
  user: UserType | null;
  onLogout: () => void;
}

export const UserPanel: React.FC<UserPanelProps> = ({ user, onLogout }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    fieldOfWork: ''
  });

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLoginView) {
        // Giriş Yap
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        if (error) throw error;
      } else {
        // Kayıt Ol
        const { error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              firstName: formData.firstName,
              lastName: formData.lastName,
              fieldOfWork: formData.fieldOfWork,
            }
          }
        });
        if (error) throw error;
        alert("Kayıt başarılı! Giriş yapabilirsiniz.");
        setIsLoginView(true);
      }
    } catch (err: any) {
      setError(err.message || "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  if (user?.isRegistered) {
    return (
      <div className="max-w-md mx-auto bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <User className="w-12 h-12 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">{user.firstName} {user.lastName}</h2>
          <p className="text-slate-500">{user.email}</p>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-50 p-4 rounded-2xl">
            <label className="text-xs font-bold text-slate-400 uppercase mb-1 block">Uğraşılan Alan</label>
            <div className="flex items-center gap-2 text-slate-700 font-medium">
              <Briefcase className="w-4 h-4 text-blue-500" />
              {user.fieldOfWork || 'Belirtilmemiş'}
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 p-4 rounded-xl bg-red-50 text-red-600 font-bold hover:bg-red-100 transition-colors group"
            >
              <LogOut className="w-5 h-5" />
              Çıkış Yap
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl border border-slate-200 p-8 shadow-xl">
      <div className="mb-8 text-center">
        <div className="inline-block p-4 bg-blue-50 rounded-2xl mb-4">
          <UserCheck className="w-8 h-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">
          {isLoginView ? 'Giriş Yap' : 'Topluluğa Katılın'}
        </h2>
        <p className="text-slate-500 mt-2 text-sm">
          {isLoginView 
            ? 'Hesabınıza erişerek araçları takip etmeye devam edin.' 
            : 'AI araçlarını takip etmek ve kişisel profilinizi oluşturmak için kayıt olun.'}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 text-red-600 text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleAuth} className="space-y-4">
        {!isLoginView && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 ml-1">Ad</label>
              <input 
                required
                type="text"
                placeholder="Ahmet"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700 ml-1">Soyad</label>
              <input 
                required
                type="text"
                placeholder="Yılmaz"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              />
            </div>
          </div>
        )}

        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700 ml-1">E-posta</label>
          <div className="relative">
            <input 
              required
              type="email"
              placeholder="ahmet@mail.com"
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-sm font-semibold text-slate-700 ml-1">Şifre</label>
          <div className="relative">
            <input 
              required
              type="password"
              placeholder="••••••••"
              minLength={6}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          </div>
        </div>

        {!isLoginView && (
          <div className="space-y-1">
            <label className="text-sm font-semibold text-slate-700 ml-1">Uğraşılan Alan</label>
            <div className="relative">
              <input 
                required
                type="text"
                placeholder="Örn: Yazılım Geliştirici"
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                value={formData.fieldOfWork}
                onChange={(e) => setFormData({...formData, fieldOfWork: e.target.value})}
              />
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            </div>
          </div>
        )}

        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 mt-4 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading && <Loader2 className="w-5 h-5 animate-spin" />}
          {isLoginView ? 'Giriş Yap' : 'Kayıt Ol'}
        </button>
        
        <div className="text-center mt-6">
          <button 
            type="button"
            onClick={() => {
              setIsLoginView(!isLoginView);
              setError(null);
            }}
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            {isLoginView ? 'Hesabınız yok mu? Hemen kayıt olun' : 'Zaten hesabınız var mı? Giriş yapın'}
          </button>
        </div>
      </form>
    </div>
  );
};
