// netlify/functions/form-submission-created.js
//
// Se dispara automáticamente cada vez que alguien envía
// cualquier formulario de Netlify Forms en tasklity.com.
// Añade el suscriptor a Mailerlite y lo mete en el grupo correcto.
//
// Variables de entorno necesarias en Netlify (Site → Environment variables):
//   MAILERLITE_API_KEY  → tu token de Mailerlite
//   MAILERLITE_GROUP_ID → ID numérico del grupo "Tasklity Newsletter"

exports.handler = async function (event) {
  // Netlify envía el payload como JSON en el body
  let payload;
  try {
    const body = JSON.parse(event.body);
    payload = body.payload;
  } catch {
    return { statusCode: 400, body: "Payload inválido" };
  }

  // Solo procesamos el formulario "newsletter"
  // (evita que otros formularios futuros —contacto, etc.— disparen esto)
  if (payload?.form_name !== "newsletter") {
    return { statusCode: 200, body: "Formulario ignorado" };
  }

  const email = payload?.data?.email;
  const source = payload?.data?.source || "desconocido";

  if (!email) {
    return { statusCode: 400, body: "Email no encontrado en el payload" };
  }

  const API_KEY = process.env.MAILERLITE_API_KEY;
  const GROUP_ID = process.env.MAILERLITE_GROUP_ID;

  if (!API_KEY || !GROUP_ID) {
    console.error("Faltan variables de entorno MAILERLITE_API_KEY o MAILERLITE_GROUP_ID");
    return { statusCode: 500, body: "Configuración incompleta" };
  }

  try {
    const response = await fetch("https://connect.mailerlite.com/api/subscribers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
        Accept: "application/json",
      },
      body: JSON.stringify({
        email,
        groups: [GROUP_ID],
        fields: {
          // Guardamos el origen para segmentar después si hace falta
          // (home / blog-vacaciones / blog-running / blog-productividad)
          last_name: source, // Mailerlite free no tiene campos custom; usamos last_name como workaround
        },
        status: "active",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // 409 = el email ya existe → lo tratamos como éxito silencioso
      if (response.status === 409) {
        console.log(`Suscriptor ya existente: ${email}`);
        return { statusCode: 200, body: "Ya suscrito" };
      }
      console.error("Error Mailerlite:", JSON.stringify(data));
      return { statusCode: response.status, body: "Error al añadir suscriptor" };
    }

    console.log(`Suscriptor añadido correctamente: ${email} (origen: ${source})`);
    return { statusCode: 200, body: "OK" };
  } catch (err) {
    console.error("Error de red:", err.message);
    return { statusCode: 500, body: "Error de conexión con Mailerlite" };
  }
};
