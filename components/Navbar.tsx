
import React from 'react';
import { User as UserIcon, Bot, Menu, X } from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onProfileClick: () => void;
  onHomeClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, onProfileClick, onHomeClick }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={onHomeClick}
          >
            <div className="bg-blue-600 p-2 rounded-lg group-hover:bg-blue-700 transition-colors">
              <Bot className="text-white w-6 h-6" />
            </div>
            <span className="font-bold text-xl tracking-tight hidden sm:block">
              Burak TURGUT <span className="text-blue-600">AI</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button onClick={onHomeClick} className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Araçlar</button>
            <button className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Kategoriler</button>
            <button 
              onClick={onProfileClick}
              className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full hover:bg-slate-200 transition-colors"
            >
              <UserIcon className="w-5 h-5 text-slate-700" />
              <span className="text-sm font-semibold text-slate-700">
                {user && user.isRegistered ? `${user.firstName} ${user.lastName}` : 'Hesabım'}
              </span>
            </button>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="p-2">
              {isOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 p-4 space-y-4">
          <button onClick={() => { onHomeClick(); setIsOpen(false); }} className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 rounded-lg">Araçlar</button>
          <button onClick={() => { onProfileClick(); setIsOpen(false); }} className="block w-full text-left px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold">
            {user && user.isRegistered ? 'Profilim' : 'Kayıt Ol / Giriş Yap'}
          </button>
        </div>
      )}
    </nav>
  );
};
