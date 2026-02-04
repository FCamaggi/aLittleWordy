import React from 'react';
import { X, BookOpen } from 'lucide-react';
import { MANUAL_TEXT } from '../constants';

interface ManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ManualModal: React.FC<ManualModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // Helper to parse inline bold markdown like **text**
  const parseInline = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={index} className="font-bold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  const renderContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Headers
      if (line.startsWith('# ')) {
        return <h1 key={i} className="text-2xl font-bold text-indigo-900 mt-6 mb-4">{line.replace('# ', '')}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={i} className="text-xl font-semibold text-indigo-800 mt-5 mb-3 border-b border-indigo-100 pb-1">{line.replace('## ', '')}</h2>;
      }
      
      // List items
      if (line.startsWith('- ')) {
        return <li key={i} className="ml-4 mb-1 text-slate-600 list-disc pl-1">{parseInline(line.replace('- ', ''))}</li>;
      }

      // Empty lines
      if (line.trim() === '') {
        return <div key={i} className="h-2"></div>;
      }

      // Paragraphs (handles lines starting with ** or containing **)
      return <p key={i} className="mb-2 text-slate-600 leading-relaxed">{parseInline(line)}</p>;
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between bg-indigo-50">
          <div className="flex items-center gap-2 text-indigo-900">
            <BookOpen className="w-5 h-5" />
            <span className="font-bold text-lg">Manual de Reglas</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-indigo-100 rounded-full transition-colors text-indigo-900">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="overflow-y-auto p-6">
          {renderContent(MANUAL_TEXT)}
        </div>

        <div className="p-4 border-t bg-gray-50 flex justify-end">
          <button onClick={onClose} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
