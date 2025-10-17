# Sistema de Rutas - Voz Ciudadana

## 📋 Estructura de Rutas

### 🏠 Ruta Principal
- **URL**: `/` (raíz)
- **Componente**: `App.tsx`
- **Funcionalidad**: 
  - Pantalla de fecha de nacimiento
  - Sidebar con reportes
  - Funcionalidad principal de la app

### 👨‍💼 Rutas de Administración
- **URL**: `/admin`
- **Componente**: `Login.tsx`
- **Funcionalidad**: 
  - Pantalla de login para administradores
  - Validación de credenciales
  - Redirección al panel de admin

- **URL**: `/admin/panel`
- **Componente**: `AdminPanel.tsx`
- **Funcionalidad**: 
  - Panel de administración
  - Estadísticas de reportes
  - Gestión de usuarios y reportes

## 🔐 Credenciales de Prueba

**Email**: `admin@voiciudadana.com`
**Contraseña**: `admin123`

## 🚀 Instalación de Dependencias

Antes de usar el sistema de rutas, necesitas instalar React Router:

```bash
npm install react-router-dom
```

## 📱 Cómo Acceder

### Para Usuarios Normales:
1. Ve a: `http://localhost:5173/`
2. Completa la fecha de nacimiento
3. Usa la aplicación normalmente

### Para Administradores:
1. Ve a: `http://localhost:5173/admin`
2. Ingresa las credenciales:
   - Email: admin@voiciudadana.com
   - Contraseña: admin123
3. Serás redirigido al panel de admin

## 🛠️ Personalización

### Cambiar Credenciales de Admin:
Edita el archivo `src/Router.tsx` en la función `handleLogin`:

```tsx
if (email === "tu-email@ejemplo.com" && password === "tu-contraseña") {
  // Login exitoso
}
```

### Agregar Nuevas Rutas:
En `src/Router.tsx`, agrega nuevas rutas en el componente `Routes`:

```tsx
<Route path="/nueva-ruta" element={<TuComponente />} />
```

## 🔄 Flujo de Navegación

1. **Usuario normal**: `/` → Fecha de nacimiento → Sidebar
2. **Admin**: `/admin` → Login → `/admin/panel` → Panel de administración
3. **Logout**: Panel de admin → Botón "Cerrar Sesión" → `/` (home)

## 🗂️ Archivos Principales

- `src/Router.tsx` - Configuración de rutas principal
- `src/main.tsx` - Punto de entrada con Router
- `src/components/auth/Login.tsx` - Componente de login
- `src/components/admin/AdminPanel.tsx` - Panel de administración
- `src/App.tsx` - Aplicación principal (usuarios)