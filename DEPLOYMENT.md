# A Little Wordy - Guía de Deployment

## 🚀 Backend (Render.com)

### 1. Configurar MongoDB Atlas

1. Ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register)
2. Crea una cuenta gratuita
3. Crea un nuevo cluster (selecciona el plan **FREE M0**)
4. En **Security**:
   - **Database Access**: Crea un usuario con contraseña
   - **Network Access**: Agrega `0.0.0.0/0` (permitir todas las IPs)
5. Haz clic en **Connect** → **Connect your application**
6. Copia el **connection string**:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
7. Reemplaza `<username>` y `<password>` con tus credenciales
8. Agrega el nombre de la base de datos: `alittlewordy`
   ```
   mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/alittlewordy?retryWrites=true&w=majority
   ```

### 2. Deploy en Render

1. Ve a [Render.com](https://render.com/) y crea una cuenta
2. Conecta tu repositorio de GitHub
3. Haz clic en **New +** → **Web Service**
4. Selecciona tu repositorio
5. Configuración:
   - **Name**: `alittlewordy-backend` (o el que prefieras)
   - **Region**: Oregon (o el más cercano)
   - **Branch**: `main`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: `Free`

6. **Environment Variables** (Variables de Entorno):

   ```
   NODE_ENV=production
   MONGODB_URI=mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/alittlewordy?retryWrites=true&w=majority
   CORS_ORIGIN=https://tu-app.netlify.app
   PORT=10000
   ```

   ⚠️ **Importante**: `CORS_ORIGIN` debe ser la URL de tu frontend en Netlify (la configurarás más abajo)

7. Haz clic en **Create Web Service**
8. Espera a que termine el deploy (2-3 minutos)
9. Copia la URL del backend: `https://alittlewordy-backend.onrender.com`

### 3. Configurar Auto-Deploy

Render automáticamente hará deploy cada vez que hagas push a la rama `main`.

---

## 🌐 Frontend (Netlify)

### 1. Preparar el proyecto

1. Crea el archivo `.env.production` en la raíz del proyecto:
   ```bash
   VITE_SOCKET_URL=https://tu-backend.onrender.com
   ```
   Reemplaza con la URL de tu backend de Render.

### 2. Deploy en Netlify

#### Opción A: Deploy Manual (Rápido)

1. Construye el proyecto:

   ```bash
   npm run build
   ```

2. Ve a [Netlify](https://www.netlify.com/) y crea una cuenta
3. Arrastra la carpeta `dist/` a Netlify
4. Copia la URL generada (ej: `https://tu-app.netlify.app`)

#### Opción B: Deploy Automático con GitHub (Recomendado)

1. Ve a [Netlify](https://www.netlify.com/)
2. Haz clic en **Add new site** → **Import an existing project**
3. Conecta con GitHub y selecciona tu repositorio
4. Configuración:
   - **Branch**: `main`
   - **Base directory**: (dejar vacío)
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Build settings**:
     ```
     Environment variables:
     VITE_SOCKET_URL = https://tu-backend.onrender.com
     ```

5. Haz clic en **Deploy site**
6. Espera a que termine el build (1-2 minutos)
7. Copia tu URL de Netlify: `https://tu-app.netlify.app`

### 3. Actualizar CORS en Backend

1. Ve a tu servicio en Render
2. **Environment** → Edita `CORS_ORIGIN`
3. Cambia el valor a tu URL de Netlify: `https://tu-app.netlify.app`
4. Guarda y espera a que se redeploy automáticamente

---

## ✅ Verificar que todo funcione

1. Abre tu app en Netlify: `https://tu-app.netlify.app`
2. Haz clic en **Crear Sala Nueva**
3. Si todo está bien, verás el lobby
4. Abre una ventana de incógnito y únete con el código
5. Ambos jugadores deben poder ver cambios en tiempo real

---

## 🐛 Troubleshooting

### Error: "Failed to fetch"

- Verifica que el backend esté funcionando: `https://tu-backend.onrender.com/health`
- Debe responder: `{"status":"ok"}`

### Error: "CORS policy"

- Verifica que `CORS_ORIGIN` en Render tenga la URL correcta de Netlify
- No incluyas `/` al final: ❌ `https://app.netlify.app/` ✅ `https://app.netlify.app`

### Backend se duerme (Free tier)

- Render pone el servidor en sleep después de 15 minutos sin actividad
- La primera solicitud tardará ~30 segundos en despertar
- Considera usar un servicio de "ping" para mantenerlo despierto

### MongoDB Atlas dice "IP not whitelisted"

- Ve a Network Access en Atlas
- Asegúrate de tener `0.0.0.0/0` agregado

---

## 📊 Monitoreo

### Logs del Backend (Render)

1. Ve a tu servicio en Render
2. Haz clic en **Logs**
3. Verás todos los eventos en tiempo real

### Logs del Frontend (Netlify)

1. Ve a tu sitio en Netlify
2. **Deploys** → Selecciona un deploy
3. Haz clic en **Deploy log**

### Consola del Navegador

Abre DevTools (F12) para ver:

- Conexión Socket.io
- Errores de red
- Estado del juego

---

## 🔄 Actualizar la App

1. Haz cambios en tu código local
2. Commit y push a GitHub:
   ```bash
   git add .
   git commit -m "Actualización"
   git push origin main
   ```
3. Render y Netlify harán deploy automáticamente
4. Espera 2-3 minutos

---

## 💰 Costos

- **MongoDB Atlas**: Gratis (512 MB)
- **Render**: Gratis (750 horas/mes, se duerme después de 15 min)
- **Netlify**: Gratis (100 GB ancho de banda)

**Total: $0/mes** 🎉

---

## 🔒 Seguridad en Producción (Opcional)

Para una versión más robusta:

1. **Rate Limiting** (limitar peticiones):

   ```bash
   cd server
   npm install express-rate-limit
   ```

2. **Helmet** (headers de seguridad):

   ```bash
   npm install helmet
   ```

3. **Validación de inputs**:

   ```bash
   npm install express-validator
   ```

4. **MongoDB**: Usa usuario con permisos limitados
5. **Environment Variables**: Nunca las subas a GitHub

---

¿Listo para deployar? 🚀
