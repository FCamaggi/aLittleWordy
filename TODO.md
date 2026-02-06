# 📝 TODO: A Little Wordy - Implementación Completa

**Fecha de auditoría:** 4 de Febrero, 2026  
**Estado:** ✅ Implementación local completa - Listo para Backend y Deploy

---

## 🚨 PRIORIDAD CRÍTICA (Antes de Deploy)

### 1. Implementar Cartas Faltantes

#### 1.1 Iago - Rima

- [x] Implementar lógica de rima en `resolveCardAction`
- [x] Bot debe decir palabra que rime con su palabra secreta
- [x] Implementación básica (actualmente devuelve palabra genérica)
- [ ] **MEJORAR**: Implementar algoritmo de rimas real
- [x] Coste: 5 tokens
- [x] Tipo: Spicy

#### 1.2 Henery Hawk - Superjugada (Corregir)

- [x] Carta implementada correctamente
- [x] Revela **POSICIÓN** de la letra
- [x] Ejemplo: "La letra R está en la posición 3"
- [x] Si letra tiene múltiples posiciones, revela solo una
- [x] Coste: 3 tokens
- [x] Tipo: Spicy

#### 1.3 Zazu - Dar y Recibir

- [x] Implementar intercambio mutuo de información
- [x] Jugador revela una letra no revelada de su palabra
- [x] Oponente revela una letra no revelada de su palabra
- [x] Sistema de tracking de letras reveladas implementado
- [x] No se puede usar si oponente ya adivinó correctamente
- [x] Coste: 1 token
- [x] Tipo: Spicy

#### 1.4 Heckle and Jeckle - Destruir Ejemplares

- [x] Implementar lógica de conteo de letras duplicadas
- [x] Jugador elige letra que aparezca 2+ veces en sus fichas
- [x] Oponente dice cuántas veces aparece en su palabra
- [x] Validación de que la letra aparece 2+ veces
- [x] Coste: 2 tokens
- [x] Tipo: Spicy

#### 1.5 Scuttle - Compartamos

- [x] Implementar comparación de letras compartidas
- [x] Jugador elige letra presente en AMBOS sets de fichas
- [x] Ambos jugadores dicen cuántas veces aparece en su palabra
- [x] Validación de letra presente en ambos sets
- [x] No se puede usar si oponente ya adivinó correctamente
- [x] Coste: 1 token
- [x] Tipo: Spicy

#### 1.6 Scrooge McDuck - Coste Dinámico (Corregir)

- [x] Coste dinámico implementado correctamente
- [x] Implementar cálculo: coste = número de fichas que quedan "encendidas"
- [x] Jugador construye palabra → Bot apaga letras que no están
- [x] Coste = letras únicas que siguen visibles
- [x] Sistema de fichas volteadas/apagadas funcionando
- [x] Tipo: Spicy

---

### 2. Sistema de Fichas Reveladas/Volteadas

#### 2.1 Tracking de Estado de Fichas

- [x] Agregar propiedad `revealed: boolean` a cada Tile
- [x] Agregar propiedad `disabled: boolean` para fichas "apagadas"
- [x] Actualizar interface `Tile` en `types.ts`
- [x] Modificar componente `Tile.tsx` para mostrar estados visuales

#### 2.2 Visual de Fichas Volteadas

- [x] Diseño para ficha "revelada" (borde verde con indicador)
- [x] Diseño para ficha "apagada" (opaca con pattern)
- [x] Efecto visual al desabilitar ficha
- [x] Tooltip mostrando por qué está revelada

#### 2.3 Lógica de Revelación

- [x] Tracking en `PlayerState` con `revealedLetters`
- [x] Tracking de posiciones reveladas con `revealedPositions`
- [x] Actualizar estado al usar Woody, Woodstock, Foghorn, etc.
- [x] Prevenir revelar fichas ya reveladas (filtrado implementado)

---

### 3. Corregir Implementación de Cartas Existentes

#### 3.1 Yakky Doodle - Generador de Palabras

- [x] Ahora **VOLTEA** visualmente las fichas incorrectas
- [x] Marcar fichas como `disabled: true`
- [x] Actualizar UI para mostrar fichas volteadas
- [x] Preservar estado entre turnos

#### 3.2 Scrooge McDuck (Refactorización completa)

- [x] Implementado con lógica correcta de Yakky + coste dinámico
- [x] Calcular coste real = fichas únicas que quedan visibles
- [x] Descontar tokens correctos al oponente
- [x] Actualizar historial con coste real

---

### 4. Lógica de Victoria - Escenario 2

#### 4.1 Verificación Continua de Victoria

- [x] Función `checkScenario2Victory()` implementada
- [x] Se ejecuta después de cada pista usada por oponente
- [x] Se ejecuta después de cada intento fallido
- [x] Se ejecuta en turno del bot
- [x] Ganar inmediatamente al superar tokens del oponente

#### 4.2 Estado de Espera

- [x] Visual de "Esperando superar tokens" implementado
- [ ] **MEJORAR**: Mostrar barra de progreso (tus tokens / tokens del bot)
- [x] Actualiza en tiempo real al recibir tokens

---

### 5. Validación de Palabras

#### 5.1 Diccionario Español

- [x] Crear archivo `dictionary.ts` con ~3000+ palabras
- [x] Función `isValidWord()` implementada
- [x] Función `getValidationMessage()` implementada
- [ ] **FUTURO**: Considerar API de diccionario (RAE) para palabras más raras

#### 5.2 Validación en Setup

- [x] Validar palabra del jugador antes de confirmar
- [x] Mostrar error si palabra no es válida
- [x] Validar longitud (1-11 letras)

#### 5.3 Validación en Guess

- [x] Validar antes de enviar intento
- [x] Evitar gastar intento en palabra inválida
- [x] Dar feedback inmediato con modal

---

## ⚠️ PRIORIDAD MEDIA (Mejoras de Jugabilidad)

### 6. Mejora de IA del Bot

#### 6.1 Bot Inteligente

- [ ] Trackear información revelada
- [ ] Usar pistas de forma estratégica
- [ ] Algoritmo de eliminación de palabras posibles
- [ ] Adivinar solo cuando tenga alta confianza

#### 6.2 Dificultades

- [x] Fácil: Bot aleatorio (actual)
- [ ] Normal: Bot que usa información
- [ ] Difícil: Bot optimizado

---

### 7. Ampliación de Contenido

#### 7.1 Palabras del Bot

- [x] Expandido a ~150 palabras
- [x] Categorizar por dificultad (cortas/largas)
- [x] Asegurar todas son formables con 5V/6C
- [x] Incluir palabras con Ñ
- [ ] **FUTURO**: Agregar 200+ más

#### 7.2 Balance de Letras

- [x] 5V/6C implementado
- [ ] Testear si funciona bien en producción
- [ ] Alternativa: probar 6V/5C si es necesario
- [ ] Recopilar estadísticas de palabras creadas (post-backend)

---

### 8. UX/UI Mejoras

#### 8.1 Tutorial Interactivo

- [ ] Paso a paso del primer juego
- [ ] Explicar cada fase
- [ ] Mostrar cómo usar cartas
- [ ] Explicar escenarios de victoria

#### 8.2 Animaciones

- [x] Transición al voltear fichas (básica)
- [ ] Efecto al usar cartas (mejorar)
- [ ] Celebración al ganar
- [x] Feedback visual al recibir tokens

#### 8.3 Accesibilidad

- [ ] Modo alto contraste
- [ ] Tamaños de texto ajustables
- [ ] Soporte para lectores de pantalla
- [ ] Atajos de teclado

---

## 🔄 BACKEND Y DEPLOY

### 9. Backend con Render + MongoDB Atlas

#### 9.1 Setup de MongoDB Atlas

- [ ] Crear cuenta en MongoDB Atlas
- [ ] Crear cluster (free tier M0)
- [ ] Configurar usuario y contraseñas
- [ ] Whitelist IPs (permitir acceso desde anywhere para desarrollo)
- [ ] Obtener connection string

#### 9.2 Backend Node.js

- [ ] Crear carpeta `/server`
- [ ] Inicializar proyecto: `npm init -y`
- [ ] Instalar dependencias:
  - `express`
  - `mongoose`
  - `socket.io`
  - `cors`
  - `dotenv`
- [ ] Crear modelos de datos:
  - `Room` (código, jugadores, estado)
  - `Game` (estado completo del juego)
  - `Player` (nombre, tokens, palabra secreta)

#### 9.3 API REST

- [ ] POST `/api/rooms` - Crear sala
- [ ] GET `/api/rooms/:code` - Obtener sala
- [ ] POST `/api/rooms/:code/join` - Unirse a sala
- [ ] PATCH `/api/games/:id` - Actualizar estado

#### 9.4 WebSockets (Socket.io)

- [ ] Evento: `room:created`
- [ ] Evento: `player:joined`
- [ ] Evento: `game:started`
- [ ] Evento: `turn:completed`
- [ ] Evento: `card:used`
- [ ] Evento: `game:ended`

#### 9.5 Deploy Backend en Render

- [ ] Crear cuenta en Render.com
- [ ] Conectar repositorio GitHub
- [ ] Crear Web Service
- [ ] Configurar variables de entorno:
  - `MONGODB_URI`
  - `PORT`
  - `NODE_ENV=production`
- [ ] Configurar build command: `npm install`
- [ ] Configurar start command: `node server.js`

---

### 10. Frontend - Deploy en Netlify

#### 10.1 Adaptación para Multiplayer

- [ ] Instalar `socket.io-client`
- [ ] Crear service: `socketService.ts`
- [ ] Conectar a backend de Render
- [ ] Actualizar flujos para usar API real
- [ ] Mantener modo vs Bot local

#### 10.2 Variables de Entorno

- [ ] Crear `.env` con `VITE_API_URL`
- [ ] Configurar para desarrollo local
- [ ] Configurar para producción

#### 10.3 Build y Deploy

- [ ] Verificar build: `npm run build`
- [ ] Testear preview: `npm run preview`
- [ ] Crear cuenta en Netlify
- [ ] Conectar repositorio GitHub
- [ ] Configurar build settings:
  - Build command: `npm run build`
  - Publish directory: `dist`
- [ ] Configurar variables de entorno en Netlify
- [ ] Configurar redirects para SPA

#### 10.4 CI/CD

- [ ] Auto-deploy en push a `main`
- [ ] Deploy previews en PRs
- [ ] Notificaciones de deploy

---

## 🎨 MEJORAS FUTURAS (Post-Launch)

### 11. Funcionalidades Adicionales

- [ ] Sistema de cuentas de usuario
- [ ] Historial de partidas
- [ ] Estadísticas (winrate, promedio de tokens)
- [ ] Ranking/Leaderboard
- [ ] Torneos
- [ ] Modo espectador
- [ ] Chat en partida
- [ ] Emojis/Reacciones
- [ ] Temas visuales personalizables
- [ ] Idiomas adicionales (inglés, catalán)

### 12. Monetización (Opcional)

- [ ] Versión gratuita vs premium
- [ ] Compra de temas/avatares
- [ ] Modo sin anuncios
- [ ] Soporte/Donaciones

---

## 📋 CHECKLIST PRE-DEPLOY

### Antes del primer deploy:

- [ ] Todas las 16 cartas implementadas y testeadas
- [ ] Sistema de fichas reveladas funcionando
- [ ] Lógica de victoria correcta (ambos escenarios)
- [ ] Validación de palabras activa
- [ ] Testing manual de flujo completo
- [ ] Fix de bugs conocidos
- [ ] Responsive en móvil/tablet/desktop
- [ ] README.md actualizado con instrucciones
- [ ] LICENSE añadida

### Antes del deploy con backend:

- [ ] Backend funcional y testeado
- [ ] MongoDB conectado y funcionando
- [ ] WebSockets sincronizando correctamente
- [ ] Manejo de errores robusto
- [ ] Rate limiting configurado
- [ ] CORS configurado correctamente
- [ ] Logs y monitoreo activos

---

## 🐛 BUGS CONOCIDOS

- [ ] No hay validación de palabras reales
- [ ] Bot no respeta restricciones de cartas (Zazu, Scuttle)
- [ ] Escenario 2 puede no detectar victoria inmediata
- [ ] Cartas con input no validan longitud/tipo
- [ ] No hay límite de caracteres en nombre de jugador
- [ ] Historial puede crecer indefinidamente (sin paginación)

---

## 📊 MÉTRICAS A TRACKEAR

Post-deploy:

- [ ] Número de partidas creadas
- [ ] Partidas completadas vs abandonadas
- [ ] Cartas más/menos usadas
- [ ] Palabras más comunes
- [ ] Tiempo promedio de partida
- [ ] Tasa de error en validación de palabras
- [ ] Ratio victoria jugador vs bot

---

## 📚 RECURSOS

### APIs y Librerías

- Diccionario: https://github.com/JorgeDuenasLerin/diccionario-espanol-txt
- Socket.io: https://socket.io/docs/v4/
- MongoDB Atlas: https://www.mongodb.com/cloud/atlas
- Render: https://render.com/docs
- Netlify: https://docs.netlify.com/

### Juego Original

- Manual PDF incluido en `/docs`
- BoardGameGeek: https://boardgamegeek.com/boardgame/315586/little-wordy

---

**NOTA:** Este documento debe actualizarse conforme se completan tareas. Marcar con `[x]` las tareas completadas.
