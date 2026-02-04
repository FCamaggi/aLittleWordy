import React, { useState } from 'react';
import { Users, Copy, Check } from 'lucide-react';
import { Button } from './Button';

interface LobbyProps {
  roomCode: string;
  players: Array<{ name: string; ready: boolean }>;
  isHost: boolean;
  localPlayerReady: boolean;
  onReady: () => void;
  onLeave: () => void;
}

export const Lobby: React.FC<LobbyProps> = ({
  roomCode,
  players,
  isHost,
  localPlayerReady,
  onReady,
  onLeave,
}) => {
  const [copied, setCopied] = useState(false);

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const canStart = players.length === 2 && players.every(p => p.ready);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-amber-50 to-amber-100 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <Users className="w-16 h-16 mx-auto mb-4 text-amber-600" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Sala de Espera</h1>
          <p className="text-gray-600">Esperando a los jugadores...</p>
        </div>

        {/* Room Code */}
        <div className="bg-amber-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-2 text-center">Código de Sala</p>
          <div className="flex items-center justify-center gap-2">
            <code className="text-3xl font-bold text-amber-700 tracking-wider">
              {roomCode}
            </code>
            <Button
              variant="secondary"
              size="sm"
              onClick={copyRoomCode}
              className="ml-2"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          {copied && (
            <p className="text-xs text-green-600 text-center mt-2">¡Copiado!</p>
          )}
        </div>

        {/* Players List */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">
            Jugadores ({players.length}/2)
          </h3>
          <div className="space-y-2">
            {players.map((player, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    player.ready ? 'bg-green-500' : 'bg-gray-300'
                  }`} />
                  <span className="font-medium text-gray-800">{player.name}</span>
                </div>
                {player.ready && (
                  <span className="text-sm text-green-600 font-medium">Listo</span>
                )}
              </div>
            ))}
            {players.length === 1 && (
              <div className="flex items-center justify-between p-3 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                <span className="text-gray-400">Esperando jugador...</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          {!localPlayerReady && (
            <Button
              variant="primary"
              onClick={onReady}
              disabled={players.length < 2}
              className="w-full"
            >
              {players.length < 2 ? 'Esperando al otro jugador' : 'Estoy Listo'}
            </Button>
          )}

          {localPlayerReady && !canStart && (
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-green-700 font-medium">
                ✓ Esperando al otro jugador...
              </p>
            </div>
          )}

          {canStart && (
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-blue-700 font-medium">
                🎮 ¡El juego está por comenzar!
              </p>
            </div>
          )}

          <Button
            variant="secondary"
            onClick={onLeave}
            className="w-full"
          >
            Salir de la Sala
          </Button>
        </div>

        {/* Info */}
        {isHost && players.length === 1 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 Comparte el código de sala con tu amigo para que pueda unirse
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
