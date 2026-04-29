# GYM-PROYECT

App web simple para seguimiento de gimnasio con frontend en HTML/CSS/JavaScript puro y backend en Google Apps Script conectado a Google Sheets.

## Estructura

- `index.html`, `styles.css`, `script.js`: frontend local / PWA
- `manifest.webmanifest`, `service-worker.js`: instalación y soporte offline
- `Code.gs`: backend de Google Apps Script

## Qué hace la PWA

- Se puede instalar en teléfono como app
- Abre aunque no haya internet si ya fue visitada antes
- Guarda sets localmente cuando no hay señal
- Muestra esos registros como pendientes de sincronización
- Reintenta enviar a Google Sheets cuando vuelve la conexión o al tocar `Reintentar envíos pendientes`

## Desarrollo local

Desde esta carpeta:

```bash
python3 -m http.server 5500
```

Abre:

```text
http://localhost:5500
```

## Backend en Apps Script

1. Abre tu Google Sheet.
2. Ve a `Extensiones > Apps Script`.
3. Copia el contenido de `Code.gs` dentro del proyecto de Apps Script.
4. Guarda.
5. Ejecuta `setupSheet()`.
6. Despliega como `Web app`.
7. Copia la URL terminada en `/exec`.

## Conectar el frontend

En `script.js`, la constante `APPS_SCRIPT_URL` debe apuntar a tu Web App de Apps Script.

## Despliegue en Vercel

1. Sube esta carpeta a un repositorio Git.
2. Importa ese repositorio en Vercel.
3. Publica como sitio estático.
4. Abre la URL final en tu teléfono.
5. Instala la app desde el navegador.

## Nota importante

- `script.js` no va en Apps Script.
- `Code.gs` no va en el frontend.
