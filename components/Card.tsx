import React from 'react';
import { Card as CardType } from '../types';

interface CardProps {
  card: CardType;
  onClick?: () => void;
  disabled?: boolean;
}

export const Card: React.FC<CardProps> = ({ card, onClick, disabled }) => {
  return (
    <div 
      onClick={!disabled ? onClick : undefined}
      className={`
        relative group p-4 rounded-xl border-2 flex flex-col justify-between h-48 transition-all duration-200
        ${card.type === 'vanilla' ? 'bg-amber-50 border-amber-200' : 'bg-rose-50 border-rose-200'}
        ${!disabled ? 'cursor-pointer hover:shadow-lg hover:-translate-y-1' : 'opacity-60 grayscale cursor-not-allowed'}
      `}
    >
      <div>
        <div className="flex justify-between items-start mb-2">
          <h3 className={`font-bold leading-tight ${card.type === 'vanilla' ? 'text-amber-800' : 'text-rose-800'}`}>
            {card.name}
          </h3>
          <span className={`
            px-2 py-0.5 text-xs font-black rounded-full
            ${card.type === 'vanilla' ? 'bg-amber-200 text-amber-800' : 'bg-rose-200 text-rose-800'}
          `}>
            {typeof card.cost === 'number' ? card.cost : '*'}
          </span>
        </div>
        <p className="text-xs text-slate-500 font-medium uppercase tracking-wide mb-1">{card.flavor}</p>
        <p className="text-sm text-slate-700 leading-snug">{card.description}</p>
      </div>
      
      {/* Berry Icon decorative */}
      <div className="absolute bottom-3 right-3 opacity-10 text-4xl">
        🍓
      </div>
    </div>
  );
};
