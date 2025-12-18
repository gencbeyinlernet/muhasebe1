
import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ToolCard } from './components/ToolCard';
import { ToolModal } from './components/ToolModal';
import { UserPanel } from './components/UserPanel';
import { AI_TOOLS, CATEGORIES } from './constants';
import { AITool, User } from './types';
import { Search, SlidersHorizontal, Bot, GraduationCap, Star, ArrowRight } from 'lucide-react';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTool, setSelectedTool] = useState<AITool | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const metadata = session.user.user_metadata;
        setUser({
          firstName: metadata.firstName || '',
          lastName: metadata.lastName || '',
          email: session.user.email || '',
          fieldOfWork: metadata.fieldOfWork || '',
          isRegistered: true
        });
        setFavorites(metadata.favorites || []);
      }
      setLoading(false);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const metadata = session.user.user_metadata;
        setUser({
          firstName: metadata.firstName || '',
          lastName: metadata.lastName || '',
          email: session.user.email || '',
          fieldOfWork: metadata.fieldOfWork || '',
          isRegistered: true
        });
        setFavorites(metadata.favorites || []);
      } else {
        setUser(null);
        setFavorites([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const toggleFavorite = async (toolId: string) => {
    if (!user) {
      alert("Favorilere eklemek için lütfen giriş yapın.");
      setShowProfile(true);
      return;
    }

    const newFavorites = favorites.includes(toolId)
      ? favorites.filter(id => id !== toolId)
      : [...favorites, toolId];

    setFavorites(newFavorites);

    await supabase.auth.updateUser({
      data: { favorites: newFavorites }
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setShowProfile(false);
    setShowFavorites(false);
  };

  const filteredTools = useMemo(() => {
    return AI_TOOLS.filter(tool => {
      const matchesCategory = selectedCategory === 'Tümü' || tool.category === selectedCategory;
      const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           tool.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFavorite = !showFavorites || favorites.includes(tool.id);
      return matchesCategory && matchesSearch && matchesFavorite;
    });
  }, [selectedCategory, searchQuery, showFavorites, favorites]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="animate-ping absolute inset-0 rounded-full bg-blue-100 opacity-75"></div>
            <div className="relative animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent shadow-xl"></div>
          </div>
          <span className="text-slate-900 font-black tracking-widest uppercase text-xs animate-pulse">Sistem Yükleniyor...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFDFF]">
      <Navbar 
        user={user} 
        onProfileClick={() => setShowProfile(true)} 
        onHomeClick={() => { setShowProfile(false); setShowFavorites(false); setSelectedCategory('Tümü'); }}
      />

      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        {showProfile ? (
          <div className="py-12 animate-in slide-in-from-bottom-8 duration-700">
            <UserPanel 
              user={user} 
              onLogout={handleLogout} 
            />
          </div>
        ) : (
          <>
            <div className="mb-20 text-center relative pt-10">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2 rounded-full text-[10px] font-black mb-8 uppercase tracking-[0.2em] shadow-lg shadow-blue-500/20">
                <GraduationCap className="w-4 h-4" /> AI TRACKER 2025
              </div>
              <h1 className="text-5xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-[0.9]">
                Burak TURGUT <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-600">AI Keşif Rehberi</span>
              </h1>
              <p className="text-slate-500 text-xl max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                Eğitim ve verimlilik dünyasını değiştiren en güçlü 60+ yapay zeka aracını Burak TURGUT kürasyonuyla keşfedin.
              </p>

              <div className="max-w-3xl mx-auto relative group">
                <div className="absolute inset-0 bg-blue-600/5 blur-[100px] group-focus-within:bg-blue-600/10 transition-all rounded-full" />
                <div className="relative flex items-center bg-white border-2 border-slate-100 rounded-[2.5rem] p-3 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] focus-within:ring-8 focus-within:ring-blue-600/5 focus-within:border-blue-600 transition-all duration-500">
                  <Search className="ml-6 text-slate-400 w-6 h-6" />
                  <input 
                    type="text" 
                    placeholder="Aracın adını veya kategorisini yazın..." 
                    className="w-full px-6 py-4 bg-transparent outline-none text-slate-900 text-lg placeholder:text-slate-300 font-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <div className="hidden sm:flex items-center gap-2 pr-4 text-slate-400 font-bold text-[10px] uppercase tracking-widest pointer-events-none">
                    <kbd className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg">Shift</kbd>
                    <span>+</span>
                    <kbd className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg">F</kbd>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-16 flex flex-col items-center gap-12">
              <div className="flex flex-wrap justify-center items-center gap-6">
                <div className="flex bg-slate-100/50 p-1.5 rounded-[1.5rem] border border-slate-200/50 backdrop-blur-sm">
                  <button 
                    onClick={() => setShowFavorites(false)}
                    className={`px-8 py-3 rounded-[1.2rem] text-[11px] font-black tracking-widest uppercase transition-all duration-300 ${!showFavorites ? 'bg-white text-slate-900 shadow-xl scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    TÜM ARAÇLAR
                  </button>
                  <button 
                    onClick={() => setShowFavorites(true)}
                    className={`px-8 py-3 rounded-[1.2rem] text-[11px] font-black tracking-widest uppercase transition-all duration-300 flex items-center gap-3 ${showFavorites ? 'bg-white text-blue-600 shadow-xl scale-105' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <Star className={`w-4 h-4 ${showFavorites ? 'fill-blue-600 text-blue-600' : ''}`} />
                    FAVORİLERİM ({favorites.length})
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3 max-w-6xl">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setShowFavorites(false); }}
                    className={`px-8 py-3.5 rounded-2xl text-[11px] font-black tracking-[0.1em] uppercase transition-all duration-300 border-2 ${
                      selectedCategory === cat 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-2xl shadow-blue-500/40 -translate-y-1' 
                        : 'bg-white border-slate-100 text-slate-400 hover:border-blue-400 hover:text-blue-600 hover:shadow-lg'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between mb-8 px-4">
               <h2 className="text-sm font-black text-slate-400 tracking-[0.2em] uppercase">
                 {showFavorites ? 'Kişisel Seçkileriniz' : `${selectedCategory} Kategorisindeki Araçlar`}
               </h2>
               <div className="h-[2px] flex-grow mx-8 bg-slate-100"></div>
               <span className="text-sm font-black text-blue-600">{filteredTools.length} Sonuç</span>
            </div>

            {filteredTools.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-20">
                {filteredTools.map((tool, idx) => (
                  <div key={tool.id} className="animate-in fade-in slide-in-from-bottom-10 duration-700 fill-mode-both" style={{ animationDelay: `${idx * 50}ms` }}>
                    <ToolCard 
                      tool={tool} 
                      isFavorite={favorites.includes(tool.id)}
                      onToggleFavorite={() => toggleFavorite(tool.id)}
                      onDetails={(t) => setSelectedTool(t)} 
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 max-w-3xl mx-auto shadow-sm">
                <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                  <Bot className="w-12 h-12 text-slate-300" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-4">Üzgünüz, bir şey bulamadık.</h3>
                <p className="text-slate-500 font-medium px-12 text-lg mb-10">
                  {showFavorites 
                    ? 'Henüz favori listenize bir araç eklememişsiniz. Keşfetmeye ne dersiniz?' 
                    : 'Arama teriminizi sadeleştirmeyi veya farklı bir kategori denemeyi tercih edebilirsiniz.'}
                </p>
                <button 
                  onClick={() => { setSearchQuery(''); setSelectedCategory('Tümü'); setShowFavorites(false); }}
                  className="inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-2xl font-black text-xs tracking-widest hover:bg-blue-600 transition-all active:scale-95 shadow-xl"
                >
                  ANA SAYFAYA DÖN <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="bg-slate-900 py-24 mt-20 text-white rounded-t-[4rem]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 items-start">
            <div className="text-left">
              <div className="flex items-center gap-4 mb-8">
                <div className="bg-blue-600 p-3 rounded-2xl shadow-xl shadow-blue-500/20">
                   <Bot className="text-white w-8 h-8" />
                </div>
                <span className="text-3xl font-black tracking-tighter">Burak TURGUT</span>
              </div>
              <p className="text-slate-400 font-medium text-lg leading-relaxed">
                Yapay zekayı sınıfa sokan rehber. Geleceğin eğitim vizyonunu bugün inşa ediyoruz.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-xs font-black text-blue-500 uppercase tracking-widest mb-6">Kaynaklar</h4>
                <a href="https://www.gencbeyinler.net" target="_blank" className="block text-slate-400 hover:text-white transition-colors font-bold">Gencbeyinler.net</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors font-bold">Eğitim Bülteni</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors font-bold">Araç Öner</a>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-black text-blue-500 uppercase tracking-widest mb-6">Sosyal Medya</h4>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors font-bold">LinkedIn</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors font-bold">Instagram</a>
                <a href="#" className="block text-slate-400 hover:text-white transition-colors font-bold">Twitter (X)</a>
              </div>
            </div>

            <div className="bg-slate-800/50 p-8 rounded-[2.5rem] border border-slate-700">
              <h4 className="text-xl font-bold mb-4">Geri Bildirim</h4>
              <p className="text-slate-400 text-sm mb-6">Listeye eklenmesini istediğiniz bir araç mı var? Bize yazın.</p>
              <button className="w-full bg-blue-600 py-4 rounded-2xl font-black text-xs tracking-widest hover:bg-white hover:text-blue-600 transition-all">İLETİŞİME GEÇ</button>
            </div>
          </div>
          
          <div className="mt-20 pt-10 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-slate-500 font-bold text-sm tracking-widest">
              © {new Date().getFullYear()} BURAK TURGUT HUB - MADE WITH AI
            </div>
            <div className="flex gap-8 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
               <a href="#" className="hover:text-blue-500">Kullanım Şartları</a>
               <a href="#" className="hover:text-blue-500">Gizlilik Politikası</a>
            </div>
          </div>
        </div>
      </footer>

      <ToolModal 
        tool={selectedTool} 
        onClose={() => setSelectedTool(null)} 
      />
    </div>
  );
};

export default App;
