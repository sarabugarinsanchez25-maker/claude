# 🌐 Guía de Despliegue - StoryVerse MVP

Tu aplicación StoryVerse está completamente lista para ser desplegada en internet.

## ✅ Estado del Proyecto

- ✅ App compilada y funcional
- ✅ Todas las características implementadas (login, búsqueda, biblioteca)
- ✅ Supabase configurado
- ✅ Listo para desplegar

---

## 🚀 Opción 1: Netlify (Recomendado - Más fácil)

### Paso 1: Ve a Netlify
1. Abre https://netlify.com en tu navegador
2. Haz clic en "Sign up" (Registrarse)
3. Elige "GitHub" como proveedor

### Paso 2: Conecta tu repositorio
1. Autoriza Netlify a acceder a tu GitHub
2. Selecciona el repositorio: `claude`
3. Configuración del build:
   - **Base directory**: `storyverse`
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   
   (Netlify debería detectar esto automáticamente)

### Paso 3: Desplegar
1. Haz clic en "Deploy site"
2. Netlify compilará y desplegará automáticamente
3. Te dará una URL como: `https://xxxxx.netlify.app`

**Ventajas:**
- No necesitas línea de comandos
- Despliegue automático en cada push a GitHub
- Gratuito y muy rápido

---

## 🚀 Opción 2: Vercel

### Paso 1: Ve a Vercel
1. Abre https://vercel.com
2. Haz clic en "Sign Up"
3. Elige "Continue with GitHub"

### Paso 2: Importar proyecto
1. Haz clic en "New Project"
2. Selecciona el repositorio `claude`
3. Vercel debería auto-detectar la configuración

### Paso 3: Desplegar
1. Haz clic en "Deploy"
2. Vercel desplegará automáticamente
3. Tendrás tu URL en: `https://xxxxx.vercel.app`

---

## 🚀 Opción 3: GitHub Pages

Tu repositorio ya tiene configurado GitHub Actions para desplegar automáticamente.

### Paso 1: Habilitar GitHub Pages
1. Ve a tu repositorio en GitHub
2. Settings → Pages
3. En "Build and deployment":
   - **Source**: "Deploy from a branch"
   - **Branch**: Selecciona `gh-pages` y `/root`

### Paso 2: Realizar un push
Una vez que hagas push a la rama `claude/storyverse-mvp-oft6yf`, GitHub Actions:
1. Compilará automáticamente
2. Creará la rama `gh-pages`
3. Desplegará en: `https://sarabugarinsanchez25-maker.github.io/claude/`

---

## 🔑 Variables de Entorno en Netlify/Vercel

Si necesitas cambiar las credenciales de Supabase:

### En Netlify:
1. Ve a Site settings → Build & deploy → Environment
2. Agrega variables:
   - `VITE_SUPABASE_URL`: tu URL de Supabase
   - `VITE_SUPABASE_ANON_KEY`: tu API key

### En Vercel:
1. Ve a Settings → Environment Variables
2. Agrega las mismas variables

---

## ✨ Resumen Rápido

| Opción | Dificultad | Velocidad | Recomendación |
|--------|-----------|-----------|---------------|
| **Netlify** | Muy fácil | Muy rápido | ⭐ Mejor opción |
| **Vercel** | Muy fácil | Muy rápido | ⭐ También buena |
| **GitHub Pages** | Fácil | Rápido | Funciona pero menos intuitivo |

---

## 🐛 Solución de problemas

### "Error: No se puede encontrar el proyecto"
- Asegúrate de que el repositorio es público o que has autorizado acceso
- Verifica que seleccionaste el repositorio correcto

### "Build falla"
- Verifica que la rama es `claude/storyverse-mvp-oft6yf`
- Comprueba que el build command es: `npm run build`
- Asegúrate que publish directory es: `dist`

### "La app no carga"
- Espera 5-10 minutos para que el despliegue se propague
- Intenta abrir en incógnito (sin caché del navegador)
- Verifica la consola del navegador (F12) para errores

---

## 📞 ¿Necesitas ayuda?

La aplicación está completamente lista. Solo necesitas elegir una opción de arriba y seguir los pasos.

**Recomendación**: Usa Netlify - es la más fácil desde un Chromebook.

¡Tu app estará en internet en menos de 5 minutos! 🚀
