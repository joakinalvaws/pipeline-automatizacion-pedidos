import { google } from "googleapis";

const SHEET_ID = process.env.GOOGLE_SHEET_ID;

export const handler = async (event) => {
  const headers = {
    "Content-Type": "application/json"
  };

  try {
    const pedido = JSON.parse(event.body);

    const credenciales = JSON.parse(process.env.GOOGLE_CREDENTIALS);

    const auth = new google.auth.GoogleAuth({
      credentials: credenciales,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const productos = pedido.carrito
      .map((p) => `${p.nombre} x${p.cantidad}`)
      .join(", ");

    const fila = [
      pedido.fecha,
      pedido.nombre,
      pedido.email,
      pedido.telefono,
      pedido.direccion,
      pedido.tipo,
      pedido.empresa || "",
      pedido.total,
      productos,
      "pendiente",
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SHEET_ID,
      range: "Hoja 1!A:J",
      valueInputOption: "RAW",
      requestBody: { values: [fila] },
    });

    await fetch(process.env.N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fecha: pedido.fecha,
        nombre: pedido.nombre,
        email: pedido.email,
        telefono: pedido.telefono,
        direccion: pedido.direccion,
        tipo: pedido.tipo,
        empresa: pedido.empresa || "",
        total: pedido.total,
        productos: productos,
      }),
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true, mensaje: "Pedido registrado" }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ ok: false, error: error.message }),
    };
  }
};