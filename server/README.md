# A Little Wordy - Backend Server

Backend server para el juego multijugador A Little Wordy.

## 🚀 Stack Tecnológico

- **Node.js** + **Express** - Servidor HTTP
- **Socket.io** - Comunicación en tiempo real
- **MongoDB** + **Mongoose** - Base de datos
- **CORS** - Cross-Origin Resource Sharing

## 📦 Instalación

```bash
cd server
npm install
```

## ⚙️ Configuración

1. Copia `.env.example` a `.env`:

```bash
cp .env.example .env
```

2. Edita `.env` con tus credenciales:

```env
PORT=5000
MONGODB_URI=tu_connection_string_de_mongodb_atlas
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

## 🗄️ MongoDB Atlas Setup

1. Crea cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea un cluster (free tier M0)
3. Crea usuario de base de datos
4. Whitelist tu IP o permite acceso desde anywhere (0.0.0.0/0)
5. Obtén tu connection string y actualiza `MONGODB_URI`

## 🏃 Ejecutar Localmente

```bash
# Desarrollo con nodemon
npm run dev

# Producción
npm start
```

El servidor correrá en `http://localhost:5000`

## 📡 API Endpoints

### REST API

- `GET /health` - Health check
- `GET /api/rooms/:code` - Obtener sala por código
- `POST /api/rooms` - Crear nueva sala
- `POST /api/rooms/:code/join` - Unirse a sala
- `DELETE /api/rooms/:code` - Eliminar sala

### Socket.io Events

#### Cliente → Servidor

- `join_room` - Unirse a sala
- `player_ready` - Marcar jugador listo
- `submit_word` - Enviar palabra secreta
- `use_card` - Usar carta
- `guess_word` - Adivinar palabra

#### Servidor → Cliente

- `joined_room` - Confirmación de unión
- `player_joined` - Otro jugador se unió
- `player_ready_updated` - Estado ready actualizado
- `game_starting` - Juego comenzando
- `word_submitted` - Palabra enviada
- `game_started` - Juego iniciado
- `card_used` - Carta usada
- `guess_made` - Adivinanza realizada
- `error` - Error

## 🚀 Deploy en Render

1. Crea cuenta en [Render.com](https://render.com)
2. Conecta tu repositorio de GitHub
3. Crea nuevo Web Service
4. Configuración:
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Environment**: Node
5. Agrega variables de entorno:
   - `MONGODB_URI`
   - `NODE_ENV=production`
   - `CORS_ORIGIN=https://tu-frontend.netlify.app`
6. Deploy!

## 📁 Estructura

```
server/
├── models/
│   └── Room.js          # Modelo de sala
├── routes/
│   └── rooms.js         # Rutas REST API
├── socket/
│   └── handlers.js      # Handlers Socket.io
├── utils/
│   └── helpers.js       # Funciones auxiliares
├── .env.example         # Ejemplo variables entorno
├── .gitignore
├── package.json
├── README.md
└── server.js           # Punto de entrada
```

## 🔒 Seguridad

- Variables de entorno para datos sensibles
- CORS configurado
- MongoDB con autenticación
- Rate limiting (TODO)
- Input validation (TODO)

## 📝 Notas

- Las salas se auto-eliminan después de 24 horas
- Máximo 2 jugadores por sala
- Los socket IDs se actualizan al conectar
