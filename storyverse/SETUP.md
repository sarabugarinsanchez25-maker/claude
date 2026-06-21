# 🚀 StoryVerse MVP - Guía de Setup

## Requisitos previos

- Node.js 16+ instalado
- npm o yarn
- Credenciales de Supabase (URL y anon key)

## Instalación

### 1. Clonar el repositorio (si aún no lo has hecho)

```bash
cd storyverse
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

El archivo `.env` ya está creado con tus credenciales:

```
VITE_SUPABASE_URL=https://fxfjqckss1fuebd6t.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Si necesitas actualizar las credenciales, edita `.env`.

---

## Ejecutar localmente

### Modo desarrollo

```bash
npm run dev
```

Esto abrirá la app en `http://localhost:5173`

### Build para producción

```bash
npm run build
```

El resultado estará en la carpeta `dist/`

---

## Características implementadas ✅

### Autenticación
- ✅ Registro con email + contraseña
- ✅ Login 
- ✅ Crear perfil con username
- ✅ Sesión persistente

### Búsqueda de libros
- ✅ Buscar libros con Google Books API
- ✅ Ver resultados con portada, título y autor
- ✅ Añadir libros a la biblioteca

### Biblioteca personal
- ✅ Ver libros por estado (Quiero leer, Leyendo, Leído)
- ✅ Cambiar estado de un libro
- ✅ Quitar un libro de la biblioteca
- ✅ Interfaz moderna con Tailwind CSS

---

## Estructura del proyecto

```
src/
├── lib/
│   └── supabase.js          # Cliente de Supabase
├── context/
│   └── AuthContext.jsx      # Contexto de autenticación
├── pages/
│   ├── Login.jsx            # Página de login
│   ├── Register.jsx         # Página de registro
│   ├── Search.jsx           # Búsqueda de libros
│   └── Library.jsx          # Biblioteca personal
├── App.jsx                  # Rutas principales
├── main.jsx                 # Punto de entrada
└── index.css                # Estilos con Tailwind
```

---

## Próximos pasos (Fase 2+)

- [ ] Integrar Claude AI para análisis de libros
- [ ] Reseñas y ratings de libros
- [ ] Comunidad y seguimiento de otros usuarios
- [ ] Listas de lectura colaborativas
- [ ] Estadísticas de lectura

---

## Troubleshooting

### Error de credenciales de Supabase
- Verifica que `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` sean correctas en `.env`
- Recarga la app con `npm run dev`

### Google Books API no encuentra resultados
- Google Books API tiene límites de solicitudes por IP
- Para producción, considera obtener una API key oficial

### Error de RLS en Supabase
- Asegúrate de que las políticas de seguridad estén activadas en tu BD
- Verifica que el usuario esté autenticado antes de hacer queries

---

## Soporte

Para preguntas o problemas, contacta a sarabugarinsanchez@gmail.com
