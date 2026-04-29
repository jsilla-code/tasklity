# Tasklity

Coleccion de apps gratuitas, instalables (PWA) y sin anuncios.

## Estructura
```
tasklity-web/
├── index.html
├── _redirects
├── netlify.toml
├── mis-vacaciones/
│   ├── index.html
│   ├── manifest.json
│   ├── sw.js
│   └── icons/
└── taskflow/
    ├── index.html
    ├── manifest.json
    ├── sw.js
    └── icons/
```

## Deploy en Netlify
- Build command: (vacio)
- Publish directory: .

## Añadir nueva app
1. Crear carpeta /nombre-app/ con index.html, manifest.json, sw.js e icons/
2. Añadir las dos rutas en _redirects
3. Añadir tarjeta en index.html principal
