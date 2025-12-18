
import React from 'react';
import { X, ExternalLink, Globe, Layout, Share2 } from 'lucide-react';
import { AITool } from '../types';

interface ToolModalProps {
  tool: AITool | null;
  onClose: () => void;
}

export const ToolModal: React.FC<ToolModalProps> = ({ tool, onClose }) => {
  if (!tool) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors z-10"
        >
          <X className="w-6 h-6 text-slate-900" />
        </button>

        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/2">
            <img 
              src={tool.imageUrl} 
              alt={tool.name} 
              className="w-full h-full object-cover min-h-[300px]"
            />
          </div>
          <div className="md:w-1/2 p-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full uppercase">
                {tool.category}
              </span>
              {tool.isPopular && (
                 <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full uppercase">
                  Popüler
                </span>
              )}
            </div>
            
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{tool.name}</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              {tool.longDescription}
            </p>

            <div className="space-y-4">
              <a 
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-all transform hover:-translate-y-1"
              >
                Aracı Ziyaret Et <ExternalLink className="w-5 h-5" />
              </a>
              <div className="flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-2 border border-slate-200 py-3 rounded-xl text-slate-600 font-semibold hover:bg-slate-50 transition-colors">
                  <Share2 className="w-4 h-4" /> Paylaş
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
