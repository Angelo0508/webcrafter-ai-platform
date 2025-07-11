// netlify/functions/gemini_ai.js

// Importa las clases necesarias del SDK de Google Generative AI
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Exporta la función handler que Netlify ejecutará
exports.handler = async (event, context) => {
    // Asegúrate de que la solicitud sea POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    }

    try {
        // Parsea el cuerpo de la solicitud (que viene como JSON)
        // Ahora obtenemos tanto el mensaje como la clave API del cuerpo
        const { message, apiKey } = JSON.parse(event.body);

        // Verifica si la clave API y el mensaje existen
        if (!apiKey || !message) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing API Key or message in request body' }),
            };
        }

        // Inicializa el modelo de Gemini con la clave API recibida del frontend
        const genAI = new GoogleGenerativeAI(apiKey);

        // Selecciona el modelo 'gemini-2.0-flash'
        // Este modelo es más reciente y compatible con la API v1beta
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // Inicia el chat (opcional, puedes usar generateContent directamente si no necesitas historial)
        const chat = model.startChat({
            history: [
                // Puedes pre-cargar un historial aquí si lo necesitas
            ],
            generationConfig: {
                maxOutputTokens: 500, // Limita la longitud de la respuesta para evitar respuestas muy largas
            },
        });

        // Envía el mensaje del usuario a la IA
        const result = await chat.sendMessage(message);
        const response = await result.response;
        const aiText = response.text();

        // Por ahora, imageUrls estará vacío, pero puedes añadir lógica para generarlas aquí
        const imageUrls = []; 

        // Devuelve la respuesta de la IA y las URLs de imágenes
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                // Permite peticiones desde cualquier origen (CORS) - considera restringir esto en producción
                'Access-Control-Allow-Origin': '*', 
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({ aiText, imageUrls }),
        };

    } catch (error) {
        console.error("Error en la función de Netlify:", error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({ message: `Error procesando la solicitud en el servidor: ${error.message}` }),
        };
    }
};
