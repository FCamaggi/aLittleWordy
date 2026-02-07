import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, Delete, X } from 'lucide-react';
import { Button } from './Button';
import { Tile } from './Tile';
import { Tile as TileType } from '../types';

export interface EventModalProps {
  isOpen: boolean;
  type: 'info' | 'input' | 'success' | 'error' | 'bot_action';
  title: string;
  message: React.ReactNode;
  onClose?: () => void;
  onConfirm?: (inputValue: string) => void;
  inputPlaceholder?: string; // Kept for compatibility but mostly unused in tile mode
  confirmText?: string;
  availableTiles?: TileType[]; // The pool of tiles the player can use
}

export const EventModal: React.FC<EventModalProps> = ({ 
  isOpen, type, title, message, onClose, onConfirm, confirmText, availableTiles 
}) => {
  // State for Tile Input Mode
  const [selectedTiles, setSelectedTiles] = useState<TileType[]>([]);
  const [poolTiles, setPoolTiles] = useState<TileType[]>([]);

  // Initialize pool when modal opens with input type
  useEffect(() => {
    if (isOpen && type === 'input' && availableTiles) {
      setPoolTiles([...availableTiles]); // Copy to avoid mutating game state directly
      setSelectedTiles([]);
    }
  }, [isOpen, type, availableTiles]);

  if (!isOpen) return null;

  const handleTileClick = (tile: TileType, origin: 'pool' | 'selected') => {
    if (origin === 'pool') {
      setPoolTiles(prev => prev.filter(t => t.id !== tile.id));
      setSelectedTiles(prev => [...prev, tile]);
    } else {
      setSelectedTiles(prev => prev.filter(t => t.id !== tile.id));
      setPoolTiles(prev => [...prev, tile]);
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      const word = selectedTiles.map(t => t.letter).join('');
      
      // Validation: if only one tile should be selected, enforce it
      if (selectedTiles.length === 0) {
        return; // Button should be disabled anyway
      }
      
      onConfirm(word);
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success': return <CheckCircle className="w-12 h-12 text-green-500 mb-4" />;
      case 'error': return <AlertCircle className="w-12 h-12 text-red-500 mb-4" />;
      case 'bot_action': return <div className="text-4xl mb-4">🤖</div>;
      default: return <Info className="w-12 h-12 text-indigo-500 mb-4" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col items-center text-center p-6 animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-start w-full mb-2">
            <div className="w-8"></div> {/* Spacer */}
            <div className="flex flex-col items-center">
                {getIcon()}
                <h3 className="text-2xl font-bold text-slate-800 leading-none">{title}</h3>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-slate-100 rounded-full">
                <X className="w-6 h-6 text-slate-400" />
            </button>
        </div>
        
        <div className="text-slate-600 mb-6 text-lg leading-relaxed px-2">
          {message}
        </div>

        {/* Tile Input System */}
        {type === 'input' && availableTiles && (
          <div className="w-full mb-6 flex-1 overflow-y-auto min-h-[200px] flex flex-col">
            
            {/* Input Area (Constructed Word) */}
            <div className="bg-indigo-50 p-4 rounded-xl border-2 border-indigo-100 mb-4 min-h-[80px] flex items-center justify-center relative">
               {selectedTiles.length === 0 && (
                   <span className="text-indigo-300 font-bold tracking-widest uppercase absolute">
                       {title.includes('Zazu') 
                         ? 'Elige letra a revelar...'
                         : title.includes('Scuttle') || title.includes('José') || title.includes('Henery') || 
                           title.includes('Heckle') || title.includes('Flit') 
                           ? 'Elige UNA letra...' 
                           : 'Selecciona fichas...'}
                   </span>
               )}
               <div className="flex flex-wrap justify-center gap-1.5 z-10">
                   {selectedTiles.map(tile => (
                       <Tile 
                          key={tile.id} 
                          tile={tile} 
                          onClick={() => handleTileClick(tile, 'selected')}
                       />
                   ))}
               </div>
            </div>

            {/* Divider */}
            <div className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-wider">Tus Fichas Disponibles</div>

            {/* Pool Area */}
            <div className="flex flex-wrap justify-center gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200">
                {poolTiles.map(tile => (
                    <Tile 
                        key={tile.id} 
                        tile={tile} 
                        onClick={() => handleTileClick(tile, 'pool')}
                    />
                ))}
            </div>
          </div>
        )}

        <div className="w-full flex gap-3 mt-auto pt-2">
          {onClose && type !== 'input' && (
            <Button onClick={onClose} variant={type === 'bot_action' ? 'primary' : 'secondary'} fullWidth>
              {type === 'bot_action' ? 'Continuar' : 'Cerrar'}
            </Button>
          )}
          
          {onConfirm && (
            <>
              {onClose && type === 'input' && (
                <Button onClick={onClose} variant="ghost">
                  Cancelar
                </Button>
              )}
              <Button onClick={handleConfirm} fullWidth disabled={type === 'input' && selectedTiles.length === 0}>
                {confirmText || 'Confirmar'}
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};