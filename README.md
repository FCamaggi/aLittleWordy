# 🎮 A Little Wordy - Versión Digital

<div align="center">

**Un juego de palabras, deducción y estrategia basado en el juego de mesa original.**

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[🎯 Demo en Vivo](#) | [📖 Manual de Reglas](docs/📖%20Manual%20de%20Reglas_%20A%20Little%20Wordy.md) | [🐛 Reportar Bug](issues)

</div>

---

## 📋 Tabla de Contenidos

- [Acerca del Juego](#-acerca-del-juego)
- [Características](#-características)
- [Tecnologías](#️-tecnologías)
- [Instalación](#-instalación)
- [Desarrollo Local](#-desarrollo-local)
- [Cómo Jugar](#-cómo-jugar)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Roadmap](#-roadmap)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

---

## 🎲 Acerca del Juego

**A Little Wordy** es una adaptación digital del popular juego de mesa de palabras y deducción. El objetivo es descifrar la palabra secreta de tu oponente usando pistas estratégicamente, mientras gestionas tus Berry Tokens (fichas de puntos).

### Mecánicas Principales

- 🔤 **Creación de Palabras**: Forma una palabra secreta con tus 11 fichas (5 vocales, 6 consonantes)
- 🔄 **Intercambio**: Intercambias tus fichas con el oponente
- 🃏 **Pistas**: Usa 16 cartas diferentes (8 Vanilla, 8 Spicy) para obtener información
- 🍓 **Berry Tokens**: Cada pista cuesta tokens que van al oponente
- 🏆 **Victoria**: Adivina la palabra teniendo MÁS tokens que tu rival

---

## ✨ Características

### ✅ Implementadas

- ✅ **16 Cartas Completas**: Todas las pistas del juego original implementadas
- ✅ **Sistema de Fichas Reveladas**: Tracking visual de letras descubiertas
- ✅ **Fichas Deshabilitadas**: Sistema de "volteo" para Yakky Doodle y Scrooge McDuck
- ✅ **Validación de Palabras**: Diccionario de ~3000+ palabras en español
- ✅ **Escenario 2**: Lógica correcta cuando adivinas con menos tokens
- ✅ **Bot Oponente**: IA básica para jugar en solitario
- ✅ **Interfaz Responsive**: Adaptada para móvil, tablet y escritorio
- ✅ **Sistema de Cambios**: 2 swaps permitidos durante la creación de palabra
- ✅ **Historial de Juego**: Registro de todas las acciones tomadas
- ✅ **Adaptación al Español**: Distribución de letras basada en Scrabble español

### 🚧 En Desarrollo

- 🚧 **Multijugador Real**: Backend con Socket.io + MongoDB Atlas
- 🚧 **IA Mejorada**: Bot que usa información revelada estratégicamente
- 🚧 **Tutorial Interactivo**: Guía paso a paso para nuevos jugadores
- 🚧 **Sistema de Salas**: Crear y unirse a partidas con amigos
- 🚧 **Estadísticas**: Tracking de victorias, palabras usadas, etc.

---

## 🛠️ Tecnologías

### Frontend

- **React 19** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool ultrarrápido
- **Tailwind CSS** - Estilos utility-first
- **Lucide React** - Iconos modernos

### Backend (Próximamente)

- **Node.js + Express** - Servidor API
- **Socket.io** - Comunicación en tiempo real
- **MongoDB Atlas** - Base de datos en la nube
- **Mongoose** - ODM para MongoDB

### Deploy

- **Netlify** - Frontend hosting
- **Render** - Backend hosting

---

## 📦 Instalación

### Prerrequisitos

- Node.js >= 18.0.0
- npm >= 9.0.0

### Pasos

1. **Clonar el repositorio**

```bash
git clone https://github.com/tu-usuario/aLittleWordy.git
cd aLittleWordy
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Ejecutar en desarrollo**

```bash
npm run dev
```

4. **Abrir en el navegador**

```
http://localhost:3000
```

---

## 🚀 Desarrollo Local

### Comandos Disponibles

```bash
# Desarrollo con hot-reload
npm run dev

# Build para producción
npm run build

# Preview del build de producción
npm run preview

# Linter (si configurado)
npm run lint
```

### Variables de Entorno

Crea un archivo `.env.local` en la raíz:

```env
# Para multijugador (próximamente)
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

---

## 🎮 Cómo Jugar

### 1. **Preparación (Setup)**

1. Recibes 11 fichas aleatorias (5 vocales + 6 consonantes)
2. Crea una palabra secreta (1-11 letras)
3. Puedes cambiar hasta 2 fichas antes de confirmar
4. ¡Las fichas se intercambian con el oponente!

### 2. **Turno de Juego**

En tu turno puedes:

#### **Opción A: Usar una Pista**

- Elige una de las 8 cartas disponibles
- Tu oponente gana tokens (coste de la carta)
- Obtienes información sobre su palabra

**Cartas Vanilla (Fáciles):**

- 🐦 **Woody Woodpecker** (4 tokens): Primera letra
- 🐤 **Calimero** (1 token): Longitud relativa
- 🐧 **Chilly Willy** (3 tokens): Longitud exacta
- 🐦 **Woodstock** (1 token): Última letra
- 🦜 **José Carioca** (2 tokens): Verificar si letra existe
- 🦆 **Yakky Doodle** (4 tokens): Eliminar letras incorrectas

**Cartas Spicy (Avanzadas):**

- 🦅 **Foghorn Leghorn** (1 token): Revelar una vocal
- 🐦 **Beaky Buzzard** (2 tokens): Número de vocales
- 🦆 **Daffy Duck** (3 tokens): Número de consonantes
- 🦅 **Henery Hawk** (3 tokens): Letra + su posición
- 🦜 **Zazu** (1 token): Intercambio mutuo
- 🐦 **Heckle & Jeckle** (2 tokens): Contar letra duplicada
- 🐦 **Scuttle** (1 token): Letra compartida
- 💰 **Scrooge McDuck** (dinámico): Como Yakky pero coste variable
- 🦜 **Iago** (5 tokens): Rima con la palabra
- 🐦 **Flit** (1 token): Verificar letra rara (Z,J,Q,X,K)

#### **Opción B: Adivinar la Palabra**

- Forma la palabra con tus fichas
- **Si aciertas:**
  - ✅ Tienes MÁS tokens → **¡GANAS!**
  - ❌ Tienes MENOS tokens → Escenario 2 (esperas ganar tokens)
- **Si fallas:**
  - Oponente gana 2 tokens

### 3. **Escenario 2 (Desempate)**

Si adivinas correctamente pero tienes menos tokens:

1. Dejas de jugar
2. Tu oponente sigue usando pistas (tú ganas sus costes)
3. Cuando superas sus tokens → **¡GANAS!**
4. Si él adivina tu palabra antes → **PIERDES**

---

## 📁 Estructura del Proyecto

```
aLittleWordy/
├── components/          # Componentes React reutilizables
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── EventModal.tsx
│   ├── ManualModal.tsx
│   └── Tile.tsx
├── services/           # Lógica de negocio
│   ├── gameLogic.ts   # Generación de fichas, barajado
│   └── dictionary.ts  # Validación de palabras
├── docs/              # Documentación
│   └── 📖 Manual de Reglas.md
├── App.tsx            # Componente principal
├── types.ts           # Definiciones de tipos TypeScript
├── constants.ts       # Cartas, palabras del bot, pools
├── index.tsx          # Punto de entrada
├── TODO.md            # Tareas pendientes
└── README.md          # Este archivo
```

---

## 🗺️ Roadmap

### Versión 1.0 (Actual - Local)

- [x] Implementación completa de 16 cartas
- [x] Sistema de fichas reveladas/deshabilitadas
- [x] Validación de palabras español
- [x] Bot oponente básico
- [x] Escenario 2 correctamente implementado

### Versión 2.0 (Multijugador)

- [ ] Backend con Node.js + Express
- [ ] MongoDB Atlas para persistencia
- [ ] Socket.io para tiempo real
- [ ] Sistema de salas con códigos
- [ ] Chat en partida

### Versión 3.0 (Mejoras)

- [ ] IA del bot mejorada (3 niveles)
- [ ] Sistema de cuentas de usuario
- [ ] Estadísticas y rankings
- [ ] Tutorial interactivo
- [ ] Torneos y modo competitivo

### Versión 4.0 (Premium)

- [ ] Temas visuales personalizables
- [ ] Modo espectador
- [ ] Replay de partidas
- [ ] Logros y badges
- [ ] Idiomas adicionales (inglés, catalán)

---

## 🤝 Contribuir

¡Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una branch para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías de Contribución

- Sigue el estilo de código existente
- Escribe mensajes de commit descriptivos
- Agrega tests si es posible
- Actualiza la documentación cuando sea necesario

---

## 📄 Licencia

Este proyecto es una implementación digital no oficial del juego de mesa "A Little Wordy" desarrollado por **Exploding Kittens**.

⚠️ **Aviso Legal**: Este proyecto es solo para propósitos educativos y de entretenimiento. Todos los derechos del juego original pertenecen a sus respectivos dueños.

---

## 👏 Créditos

- **Juego Original**: [A Little Wordy](https://www.explodingkittens.com/products/a-little-wordy) por Exploding Kittens
- **Iconos**: [Lucide Icons](https://lucide.dev/)
- **Fuentes**: System fonts
- **Desarrollador**: Fabrizio

---

## 📞 Contacto

¿Preguntas, sugerencias o bugs?

- 🐛 [Reportar un bug](issues)
- 💡 [Sugerir una feature](issues)
- 📧 Email: tu-email@ejemplo.com

---

<div align="center">

**¿Te gusta el proyecto? ¡Dale una ⭐️!**

Hecho con ❤️ y ☕

</div>
