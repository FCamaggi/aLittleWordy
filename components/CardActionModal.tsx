import React, { useState } from 'react';
import { Button } from './Button';

interface CardActionModalProps {
  isOpen: boolean;
  cardName: string;
  cardFlavor: string;
  prompt: string;
  actionType: string;
  playerTiles?: string[];
  secretWord?: string;
  cardInput?: string; // Palabra construida o letra elegida por el rival
  onSubmit: (response: string) => void;
  onClose: () => void;
}

export default function CardActionModal({
  isOpen,
  cardName,
  cardFlavor,
  prompt,
  actionType,
  playerTiles = [],
  secretWord = '',
  cardInput = '',
  onSubmit,
  onClose,
}: CardActionModalProps) {
  const [response, setResponse] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('');
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]); // Para múltiples letras

  if (!isOpen) return null;

  const handleSubmit = () => {
    let finalResponse = '';
    
    // Para cartas que requieren múltiples letras (Yakky, Scrooge)
    if (actionType.includes('tiles_not_in_word') && selectedLetters.length > 0) {
      finalResponse = selectedLetters.join(', ');
    } else {
      finalResponse = selectedLetter || response;
    }
    
    if (finalResponse.trim()) {
      onSubmit(finalResponse.trim());
      setResponse('');
      setSelectedLetter('');
      setSelectedLetters([]);
    }
  };

  const handleSelectLetter = (letter: string) => {
    setSelectedLetter(letter);
    setResponse(''); // Clear text input if selecting from tiles
  };

  const toggleLetterForYakky = (letter: string) => {
    if (selectedLetters.includes(letter)) {
      setSelectedLetters(selectedLetters.filter(l => l !== letter));
    } else {
      setSelectedLetters([...selectedLetters, letter]);
    }
    setResponse(''); // Clear text input
  };

  // Helper to show contextual information
  const renderContextInfo = () => {
    // Show opponent's constructed word (Yakky, Scrooge, Calimero)
    if (cardInput && (actionType.includes('tiles_not_in_word') || actionType.includes('compare_length'))) {
      return (
        <>
          <div className="mb-3 bg-blue-900/40 border-2 border-blue-400 rounded-lg p-4">
            <p className="text-xs text-blue-200 mb-2 font-bold uppercase">Palabra del oponente:</p>
            <p className="text-3xl font-black text-white tracking-widest text-center">
              {cardInput.toUpperCase()}
            </p>
          </div>
          {secretWord && (
            <div className="mb-4 bg-green-800/50 border-2 border-green-400 rounded-lg p-3">
              <p className="text-xs text-green-200 mb-1 font-bold uppercase text-center">📝 Tu palabra secreta:</p>
              <p className="text-2xl font-black text-white tracking-widest text-center">
                {secretWord.toUpperCase()}
              </p>
            </div>
          )}
        </>
      );
    }

    // Show opponent's chosen letter (José, Henery, Heckle, Scuttle, Flit)
    if (cardInput && (actionType.includes('check_single_letter') || actionType.includes('letter_position') || 
        actionType.includes('count_duplicates') || actionType.includes('shared_letter_count') || 
        actionType.includes('check_rare_letter'))) {
      return (
        <>
          <div className="mb-3 bg-purple-900/40 border-2 border-purple-400 rounded-lg p-4">
            <p className="text-xs text-purple-200 mb-2 font-bold uppercase text-center">Letra elegida por el oponente:</p>
            <p className="text-5xl font-black text-white text-center">
              {cardInput.toUpperCase()}
            </p>
          </div>
          {secretWord && (
            <div className="mb-4 bg-green-800/50 border-2 border-green-400 rounded-lg p-3">
              <p className="text-xs text-green-200 mb-1 font-bold uppercase text-center">📝 Tu palabra secreta:</p>
              <p className="text-2xl font-black text-white tracking-widest text-center">
                {secretWord.toUpperCase()}
              </p>
            </div>
          )}
        </>
      );
    }

    // Show opponent's revealed letter (Zazu)
    if (cardInput && actionType.includes('mutual_reveal')) {
      return (
        <>
          <div className="mb-3 bg-yellow-900/40 border-2 border-yellow-400 rounded-lg p-4">
            <p className="text-xs text-yellow-200 mb-2 font-bold uppercase text-center">🎁 El oponente reveló:</p>
            <p className="text-5xl font-black text-white text-center">
              {cardInput.toUpperCase()}
            </p>
          </div>
          {secretWord && (
            <div className="mb-4 bg-green-800/50 border-2 border-green-400 rounded-lg p-3">
              <p className="text-xs text-green-200 mb-1 font-bold uppercase text-center">📝 Tu palabra secreta:</p>
              <p className="text-2xl font-black text-white tracking-widest text-center">
                {secretWord.toUpperCase()}
              </p>
            </div>
          )}
        </>
      );
    }

    // Always show player's own secret word if available
    if (secretWord) {
      return (
        <div className="mb-4 bg-green-800/50 border-2 border-green-400 rounded-lg p-3">
          <p className="text-xs text-green-200 mb-1 font-bold uppercase text-center">📝 Tu palabra secreta:</p>
          <p className="text-2xl font-black text-white tracking-widest text-center">
            {secretWord.toUpperCase()}
          </p>
        </div>
      );
    }

    return null;
  };

  // Helper to get quick action buttons based on action type
  const renderQuickActions = () => {
    // Yes/No cards
    if (
      actionType.includes('check_single_letter') ||
      actionType.includes('check_rare_letter')
    ) {
      return (
        <div className="mb-4">
          <p className="text-sm text-yellow-200 mb-2 font-semibold">Respuesta rápida:</p>
          <div className="flex gap-2">
            <button
              onClick={() => setResponse('SÍ')}
              className={`flex-1 px-4 py-3 rounded-lg border-2 font-bold text-lg transition-all ${
                response === 'SÍ'
                  ? 'border-green-400 bg-green-500/30 scale-105 text-white'
                  : 'border-green-300 bg-green-600/20 hover:border-green-200 text-green-100'
              }`}
            >
              ✅ SÍ
            </button>
            <button
              onClick={() => setResponse('NO')}
              className={`flex-1 px-4 py-3 rounded-lg border-2 font-bold text-lg transition-all ${
                response === 'NO'
                  ? 'border-red-400 bg-red-500/30 scale-105 text-white'
                  : 'border-red-300 bg-red-600/20 hover:border-red-200 text-red-100'
              }`}
            >
              ❌ NO
            </button>
          </div>
        </div>
      );
    }

    // Length comparison for Calimero
    if (actionType.includes('compare_length')) {
      return (
        <div className="mb-4">
          <p className="text-sm text-yellow-200 mb-2 font-semibold">Comparar longitud:</p>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setResponse('MÁS LARGA')}
              className={`px-3 py-3 rounded-lg border-2 font-bold text-sm transition-all ${
                response === 'MÁS LARGA'
                  ? 'border-blue-400 bg-blue-500/30 scale-105 text-white'
                  : 'border-blue-300 bg-blue-600/20 hover:border-blue-200 text-blue-100'
              }`}
            >
              📏 MÁS LARGA
            </button>
            <button
              onClick={() => setResponse('MÁS CORTA')}
              className={`px-3 py-3 rounded-lg border-2 font-bold text-sm transition-all ${
                response === 'MÁS CORTA'
                  ? 'border-orange-400 bg-orange-500/30 scale-105 text-white'
                  : 'border-orange-300 bg-orange-600/20 hover:border-orange-200 text-orange-100'
              }`}
            >
              📐 MÁS CORTA
            </button>
            <button
              onClick={() => setResponse('IGUAL')}
              className={`px-3 py-3 rounded-lg border-2 font-bold text-sm transition-all ${
                response === 'IGUAL'
                  ? 'border-green-400 bg-green-500/30 scale-105 text-white'
                  : 'border-green-300 bg-green-600/20 hover:border-green-200 text-green-100'
              }`}
            >
              ⚖️ IGUAL
            </button>
          </div>
        </div>
      );
    }

    // "Not found" option for Henery
    if (actionType.includes('letter_position')) {
      return (
        <div className="mb-4">
          <p className="text-sm text-yellow-200 mb-2 font-semibold">Si la letra NO está:</p>
          <button
            onClick={() => setResponse('NO ESTÁ')}
            className={`w-full px-4 py-3 rounded-lg border-2 font-bold text-lg transition-all ${
              response === 'NO ESTÁ'
                ? 'border-red-400 bg-red-500/30 scale-105 text-white'
                : 'border-red-300 bg-red-600/20 hover:border-red-200 text-red-100'
            }`}
          >
            ❌ NO ESTÁ
          </button>
        </div>
      );
    }

    // "None" option for Foghorn
    if (actionType.includes('reveal_vowel')) {
      return (
        <div className="mb-4">
          <p className="text-sm text-yellow-200 mb-2 font-semibold">Si no quedan vocales:</p>
          <button
            onClick={() => setResponse('NINGUNA')}
            className={`w-full px-4 py-3 rounded-lg border-2 font-bold text-lg transition-all ${
              response === 'NINGUNA'
                ? 'border-yellow-400 bg-yellow-500/30 scale-105 text-white'
                : 'border-yellow-300 bg-yellow-600/20 hover:border-yellow-200 text-yellow-100'
            }`}
          >
            🚫 NINGUNA
          </button>
        </div>
      );
    }

    return null;
  };

  // Helper to render selectable letters based on action type
  const renderLetterSelection = () => {
    // For Yakky/Scrooge: select MULTIPLE letters that are NOT in secret word
    if (actionType.includes('tiles_not_in_word') && cardInput) {
      const opponentWord = cardInput.split('');
      return (
        <div className="mb-4">
          <p className="text-sm text-yellow-200 mb-2 font-bold">
            Selecciona las letras que NO están en tu palabra:
          </p>
          <div className="flex flex-wrap gap-2 justify-center bg-slate-800/80 p-3 rounded-lg border border-slate-600">
            {opponentWord.map((letter, idx) => (
              <button
                key={idx}
                onClick={() => toggleLetterForYakky(letter)}
                className={`px-4 py-3 rounded border-2 font-bold text-xl transition-all ${
                  selectedLetters.includes(letter)
                    ? 'border-red-500 bg-red-500/30 scale-110 line-through'
                    : 'border-white bg-white/20 hover:border-yellow-400'
                }`}
              >
                <span className="text-white">{letter.toUpperCase()}</span>
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">
            {selectedLetters.length} letra(s) seleccionada(s)
          </p>
        </div>
      );
    }

    // For actions that need a letter from secret word
    if (
      actionType.includes('letter') &&
      secretWord &&
      (actionType.includes('first') ||
        actionType.includes('last') ||
        actionType.includes('reveal_vowel') ||
        actionType.includes('mutual_reveal'))
    ) {
      const letters = secretWord.split('');
      return (
        <div className="mb-4">
          <p className="text-sm text-green-200 mb-2 font-bold">
            Selecciona de tu palabra secreta:
          </p>
          <div className="flex flex-wrap gap-2 justify-center bg-slate-800/80 p-3 rounded-lg border border-slate-600">
            {letters.map((letter, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectLetter(letter)}
                className={`px-4 py-3 rounded border-2 font-bold text-xl transition-all ${
                  selectedLetter === letter && idx === letters.indexOf(letter)
                    ? 'border-green-500 bg-green-500/30 scale-110'
                    : 'border-white bg-white/20 hover:border-green-400'
                }`}
              >
                <span className="text-white">{letter.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border-2 border-yellow-600">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-yellow-400 mb-1">
            🃏 {cardName}
          </h2>
          <p className="text-sm text-gray-400 italic">{cardFlavor}</p>
        </div>

        <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 mb-4">
          <p className="text-white text-center font-semibold">{prompt}</p>
        </div>

        {renderContextInfo()}

        {renderQuickActions()}

        {renderLetterSelection()}

        <div className="mb-4">
          <p className="text-sm text-white mb-2 font-semibold">
            {selectedLetter || selectedLetters.length > 0
              ? 'O escribe otra respuesta:'
              : 'Escribe tu respuesta:'}
          </p>
          <input
            type="text"
            value={response}
            onChange={(e) => {
              setResponse(e.target.value);
              setSelectedLetter(''); // Clear selection if typing
              setSelectedLetters([]); // Clear multiple selections
            }}
            placeholder="Tu respuesta..."
            className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-500 rounded-lg text-white text-lg placeholder-slate-300 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/50"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          {selectedLetter && (
            <p className="text-xs text-blue-400 mt-1">
              Letra seleccionada: {selectedLetter.toUpperCase()}
            </p>
          )}
          {selectedLetters.length > 0 && (
            <p className="text-xs text-red-400 mt-1">
              Letras tachadas: {selectedLetters.join(', ').toUpperCase()}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleSubmit}
            disabled={!response.trim() && !selectedLetter && selectedLetters.length === 0}
            className="flex-1"
          >
            ✅ Enviar Respuesta
          </Button>
          <Button onClick={onClose} variant="secondary" className="flex-1">
            ❌ Cancelar
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-3">
          💬 También puedes responder verbalmente en persona
        </p>
      </div>
    </div>
  );
}
