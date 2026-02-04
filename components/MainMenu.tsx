import React, { useState } from 'react';
import { Plus, LogIn, Gamepad2 } from 'lucide-react';
import { Button } from './Button';

interface MainMenuProps {
  onCreateRoom: (playerName: string) => void;
  onJoinRoom: (roomCode: string, playerName: string) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onCreateRoom, onJoinRoom }) => {
  const [mode, setMode] = useState<'menu' | 'create' | 'join'>('menu');
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');

  const handleCreateRoom = () => {
    if (!playerName.trim()) {
      setError('Ingresa tu nombre');
      return;
    }
    if (playerName.trim().length < 2) {
      setError('El nombre debe tener al menos 2 caracteres');
      return;
    }
    onCreateRoom(playerName.trim());
  };

  const handleJoinRoom = () => {
    if (!playerName.trim()) {
      setError('Ingresa tu nombre');
      return;
    }
    if (!roomCode.trim()) {
      setError('Ingresa el código de sala');
      return;
    }
    if (roomCode.trim().length !== 6) {
      setError('El código debe tener 6 caracteres');
      return;
    }
    onJoinRoom(roomCode.trim().toUpperCase(), playerName.trim());
  };

  const handleBack = () => {
    setMode('menu');
    setError('');
    setPlayerName('');
    setRoomCode('');
  };

  if (mode === 'menu') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <Gamepad2 className="w-20 h-20 mx-auto mb-4 text-amber-600" />
            <h1 className="text-4xl font-bold text-gray-800 mb-2">A Little Wordy</h1>
            <p className="text-gray-600">Juego de palabras multijugador</p>
          </div>

          <div className="space-y-4">
            <Button
              variant="primary"
              onClick={() => setMode('create')}
              className="w-full flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Crear Sala Nueva
            </Button>

            <Button
              variant="secondary"
              onClick={() => setMode('join')}
              className="w-full flex items-center justify-center gap-2"
            >
              <LogIn className="w-5 h-5" />
              Unirse a Sala
            </Button>
          </div>

          <div className="mt-8 p-4 bg-amber-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              📖 Juego para 2 jugadores
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (mode === 'create') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 p-4">
        <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <Plus className="w-16 h-16 mx-auto mb-4 text-amber-600" />
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Crear Sala</h2>
            <p className="text-gray-600">Ingresa tu nombre para comenzar</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tu Nombre
              </label>
              <input
                type="text"
                value={playerName}
                onChange={(e) => {
                  setPlayerName(e.target.value);
                  setError('');
                }}
                placeholder="Ej: Fabrizio"
                maxLength={20}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-lg"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Button
              variant="primary"
              onClick={handleCreateRoom}
              className="w-full"
            >
              Crear Sala
            </Button>

            <Button
              variant="secondary"
              onClick={handleBack}
              className="w-full"
            >
              Volver
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // mode === 'join'
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <LogIn className="w-16 h-16 mx-auto mb-4 text-amber-600" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Unirse a Sala</h2>
          <p className="text-gray-600">Ingresa el código de sala</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tu Nombre
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => {
                setPlayerName(e.target.value);
                setError('');
              }}
              placeholder="Ej: Fabrizio"
              maxLength={20}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Código de Sala
            </label>
            <input
              type="text"
              value={roomCode}
              onChange={(e) => {
                setRoomCode(e.target.value.toUpperCase());
                setError('');
              }}
              placeholder="ABC123"
              maxLength={6}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none text-lg font-mono tracking-wider text-center"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <Button
            variant="primary"
            onClick={handleJoinRoom}
            className="w-full"
          >
            Unirse
          </Button>

          <Button
            variant="secondary"
            onClick={handleBack}
            className="w-full"
          >
            Volver
          </Button>
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800 text-center">
            💡 Pídele el código a quien creó la sala
          </p>
        </div>
      </div>
    </div>
  );
};
