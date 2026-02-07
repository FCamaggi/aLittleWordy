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
  onSubmit,
  onClose,
}: CardActionModalProps) {
  const [response, setResponse] = useState('');
  const [selectedLetter, setSelectedLetter] = useState('');

  if (!isOpen) return null;

  const handleSubmit = () => {
    const finalResponse = selectedLetter || response;
    if (finalResponse.trim()) {
      onSubmit(finalResponse.trim());
      setResponse('');
      setSelectedLetter('');
    }
  };

  const handleSelectLetter = (letter: string) => {
    setSelectedLetter(letter);
    setResponse(''); // Clear text input if selecting from tiles
  };

  // Helper to render selectable letters based on action type
  const renderLetterSelection = () => {
    // For actions that need a letter from secret word
    if (
      actionType.includes('letter') &&
      secretWord &&
      (actionType.includes('first') ||
        actionType.includes('last') ||
        actionType.includes('specific'))
    ) {
      const letters = secretWord.split('');
      return (
        <div className="mb-4">
          <p className="text-sm text-gray-300 mb-2">
            Selecciona de tu palabra secreta:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {letters.map((letter, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectLetter(letter)}
                className={`px-4 py-2 rounded border-2 transition-all ${
                  selectedLetter === letter && idx === letters.indexOf(letter)
                    ? 'border-blue-500 bg-blue-500/20 scale-110'
                    : 'border-gray-600 bg-gray-700/50 hover:border-gray-400'
                }`}
              >
                {letter.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      );
    }

    // For actions that need any letter
    if (playerTiles.length > 0 && actionType.includes('tile')) {
      return (
        <div className="mb-4">
          <p className="text-sm text-gray-300 mb-2">
            Selecciona una de tus letras:
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {playerTiles.map((letter, idx) => (
              <button
                key={idx}
                onClick={() => handleSelectLetter(letter)}
                className={`px-4 py-2 rounded border-2 transition-all ${
                  selectedLetter === letter
                    ? 'border-blue-500 bg-blue-500/20 scale-110'
                    : 'border-gray-600 bg-gray-700/50 hover:border-gray-400'
                }`}
              >
                {letter.toUpperCase()}
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

        {renderLetterSelection()}

        <div className="mb-4">
          <p className="text-sm text-gray-300 mb-2">
            {selectedLetter
              ? 'O escribe otra respuesta:'
              : 'Escribe tu respuesta:'}
          </p>
          <input
            type="text"
            value={response}
            onChange={(e) => {
              setResponse(e.target.value);
              setSelectedLetter(''); // Clear selection if typing
            }}
            placeholder="Tu respuesta..."
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          {selectedLetter && (
            <p className="text-xs text-blue-400 mt-1">
              Letra seleccionada: {selectedLetter.toUpperCase()}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleSubmit}
            disabled={!response.trim() && !selectedLetter}
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
