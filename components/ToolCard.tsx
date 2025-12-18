
import React, { useState } from 'react';
import { ExternalLink, Star, Copy, Check, Sparkles } from 'lucide-react';
import { AITool } from '../types';

interface ToolCardProps {
  tool: AITool;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onDetails: (tool: AITool) => void;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, isFavorite, onToggleFavorite, onDetails }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(tool.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-500 flex flex-col group h-full relative">
      <div className="relative aspect-[16/11] overflow-hidden">
        <img 
          src={tool.imageUrl} 
          alt={tool.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="absolute top-4 right-4 flex flex-col gap-2 translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(); }}
            className={`p-2.5 rounded-2xl backdrop-blur-md transition-all shadow-lg ${
              isFavorite 
                ? 'bg-yellow-400 text-yellow-900 scale-110' 
                : 'bg-white/90 text-slate-400 hover:text-yellow-500 hover:scale-110'
            }`}
          >
            <Star className={`w-5 h-5 ${isFavorite ? 'fill-yellow-900' : ''}`} />
          </button>
          
          <button 
            onClick={handleCopyLink}
            className="p-2.5 rounded-2xl bg-white/90 text-slate-400 hover:text-blue-600 hover:scale-110 backdrop-blur-md transition-all shadow-lg"
            title="Linkini Kopyala"
          >
            {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>

        {tool.isPopular && (
          <div className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full flex items-center gap-1.5 uppercase tracking-widest shadow-lg animate-pulse">
            <Sparkles className="w-3 h-3" /> Popüler
          </div>
        )}
      </div>
      
      <div className="p-7 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-4">
          <span className="bg-blue-50 text-blue-600 text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-wider border border-blue-100/50">
            {tool.category}
          </span>
        </div>
        
        <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors leading-tight">
          {tool.name}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-grow line-clamp-3">
          {tool.description}
        </p>
        
        <div className="flex gap-3 mt-auto pt-4 border-t border-slate-50">
          <button 
            onClick={() => onDetails(tool)}
            className="flex-[2] bg-slate-900 text-white py-4 rounded-2xl text-xs font-black hover:bg-blue-600 transition-all shadow-lg active:scale-95"
          >
            DETAYLARI İNCELE
          </button>
          <a 
            href={tool.url} 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 flex items-center justify-center border border-slate-200 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all active:scale-95"
          >
            <ExternalLink className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
};
