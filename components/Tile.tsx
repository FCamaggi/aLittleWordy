import React from 'react';
import { Tile as TileType } from '../types';

interface TileProps {
  tile: TileType;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
  small?: boolean;
  faceDown?: boolean;
  highlight?: boolean;
}

export const Tile: React.FC<TileProps> = ({
  tile,
  onClick,
  selected,
  disabled,
  small,
  faceDown,
  highlight,
}) => {
  // Si está boca abajo (fichas del oponente no reveladas)
  if (faceDown) {
    return (
      <div
        className={`${small ? 'w-8 h-8 text-xs' : 'w-12 h-12 text-lg'} 
        bg-indigo-900 rounded-md shadow-md border-2 border-indigo-700 flex items-center justify-center`}
      >
        <span className="text-white opacity-20">?</span>
      </div>
    );
  }

  // Si está deshabilitada (apagada por Yakky/Scrooge)
  if (tile.disabled) {
    return (
      <div
        className={`${small ? 'w-8 h-8 text-sm' : 'w-12 h-12 text-xl'} 
        bg-slate-300 rounded-lg shadow-sm border-b-4 border-slate-400 flex items-center justify-center font-bold opacity-40 relative overflow-hidden`}
        title="Ficha eliminada por pista"
      >
        <span className="text-slate-500">{tile.letter}</span>
        <div
          className="absolute inset-0 bg-slate-400 opacity-20"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,.1) 10px, rgba(0,0,0,.1) 20px)',
          }}
        ></div>
      </div>
    );
  }

  // Si está revelada (por una pista)
  const isRevealed = tile.revealed;

  return (
    <div
      onClick={!disabled && !tile.disabled ? onClick : undefined}
      className={`
        ${small ? 'w-8 h-8 text-sm' : 'w-12 h-12 text-xl'} 
        flex items-center justify-center font-bold rounded-lg shadow-sm border-b-4 transition-all duration-100 select-none
        ${
          isRevealed
            ? 'bg-green-100 border-green-400 text-green-900 ring-2 ring-green-300 cursor-default'
            : selected
              ? 'bg-yellow-300 border-yellow-500 text-yellow-900 -translate-y-1 cursor-pointer'
              : highlight
                ? 'bg-orange-200 border-orange-400 text-orange-900 cursor-pointer hover:bg-orange-300'
                : 'bg-white border-slate-300 text-slate-700 cursor-pointer hover:-translate-y-0.5'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed transform-none' : ''}
      `}
      title={isRevealed ? 'Letra revelada' : undefined}
    >
      {tile.letter}
      {isRevealed && (
        <span className="absolute top-0 right-0 w-2 h-2 bg-green-500 rounded-full"></span>
      )}
    </div>
  );
};
