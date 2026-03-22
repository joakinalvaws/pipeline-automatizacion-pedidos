# Pipeline Automatizacion Pedidos

Sistema de gestion de pedidos para una tienda de materiales de construccion. El cliente realiza pedidos desde una tienda web (React), el backend serverless (AWS Lambda) los registra en Google Sheets y dispara un workflow en n8n para notificaciones automaticas.

## Arquitectura

```
┌──────────────────┐       ┌──────────────────┐       ┌──────────────────┐
│   React + Vite   │──────>│   AWS Lambda     │──────>│  Google Sheets   │
│   (Storefront)   │ POST  │   (Node.js)      │ API   │  (Pedidos)       │
└──────────────────┘       └────────┬─────────┘       └──────────────────┘
                                    │
                                    │ Webhook
                                    v
                           ┌──────────────────┐
                           │       n8n        │
                           │ (Notificaciones) │
                           └──────────────────┘
```

## Stack Tecnologico

| Capa | Tecnologia |
|---|---|
| Frontend | React 19, Vite 8, Tailwind CSS 4 |
| Backend | AWS Lambda (Node.js, ES Modules) |
| Base de datos | Google Sheets API v4 |
| Automatizacion | n8n (webhook para notificaciones) |
| Auth (Sheets) | Google Cloud Service Account |

## Funcionalidades

- Catalogo de 6 productos de construccion con precios en soles (S/)
- Carrito de compras con control de cantidades (+/-)
- Formulario de cliente con soporte B2C (personal) y B2B (empresarial)
- Registro automatico del pedido en Google Sheets
- Notificacion via webhook a n8n para procesamiento posterior
- Interfaz responsive con Tailwind CSS

## Estructura del Proyecto

```
├── lambda-pedidos/          # Backend serverless
│   ├── index.js             # Handler: recibe pedido → Sheets + n8n
│   ├── package.json
│   └── .env.example
│
├── tienda-pedidos/          # Frontend React
│   ├── src/
│   │   ├── App.jsx          # Componente principal (tienda + carrito + form)
│   │   ├── main.jsx         # Entry point
│   │   └── index.css        # Tailwind CSS
│   ├── public/
│   ├── vite.config.js
│   ├── package.json
│   └── .env.example
│
└── .gitignore
```

## Instalacion

### Requisitos

- Node.js 18+
- Cuenta de AWS con acceso a Lambda
- Google Cloud Service Account con acceso a Sheets API
- n8n con webhook configurado (opcional, para notificaciones)

### 1. Frontend

```bash
cd tienda-pedidos
cp .env.example .env    # Configurar VITE_API_URL
npm install
npm run dev             # http://localhost:5173
```

### 2. Backend (Lambda)

```bash
cd lambda-pedidos
cp .env.example .env    # Configurar credenciales
npm install
```

Para desplegar en AWS Lambda:
```bash
zip -r lambda-pedidos.zip index.js node_modules package.json
# Subir el .zip a AWS Lambda (runtime Node.js 18+, handler: index.handler)
```

**Variables de entorno en Lambda:**

| Variable | Descripcion |
|---|---|
| `GOOGLE_CREDENTIALS` | JSON del service account de Google Cloud |
| `GOOGLE_SHEET_ID` | ID de la hoja de Google Sheets |
| `N8N_WEBHOOK_URL` | URL del webhook de n8n para notificaciones |

### 3. Google Sheets

Crear una hoja con las columnas:

| A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|
| Fecha | Nombre | Email | Telefono | Direccion | Tipo | Empresa | Total | Productos | Estado |

Compartir la hoja con el email del service account.

## Flujo del Pedido

1. El cliente navega el catalogo y agrega productos al carrito
2. Completa el formulario con sus datos (nombre, email, telefono, direccion)
3. Selecciona tipo de pedido (personal o empresarial)
4. Al confirmar, el frontend envia POST al Lambda con el pedido completo
5. Lambda escribe una fila en Google Sheets con los datos del pedido
6. Lambda dispara webhook en n8n para notificaciones (email, WhatsApp, etc.)
7. El cliente ve pantalla de confirmacion

## Licencia

MIT
