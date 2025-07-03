// netlify/functions/gemini_ai.js

// Importar la librería de Google Generative AI para Node.js
// Necesitaremos instalarla con 'npm install @google/generative-ai'
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Acceder a la clave API de forma segura desde las variables de entorno de Netlify
// ¡NO PONGAS LA CLAVE DIRECTAMENTE AQUÍ EN CÓDIGO DE PRODUCCIÓN!
const API_KEY = process.env.GEMINI_API_KEY; 

exports.handler = async (event) => {
    // Solo respondemos a peticiones POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    }

    // Asegúrate de que la clave API esté configurada
    if (!API_KEY) {
        console.error("Error: GEMINI_API_KEY no está configurada como variable de entorno.");
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Server configuration error: API Key missing.' }),
        };
    }

    try {
        const { message } = JSON.parse(event.body); // Obtener el mensaje del usuario

        if (!message) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing message in request body' }),
            };
        }

        const genAI = new GoogleGenerativeAI(API_KEY);
        // Seleccionar el modelo Gemini Pro para la generación de texto
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Generar contenido con Gemini
        const result = await model.generateContent(message);
        const response = await result.response;
        const text = response.text(); // Obtener el texto de la respuesta

        // Devolver la respuesta al frontend
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', // Permite peticiones desde cualquier origen (CORS)
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({ aiText: text, imageUrls: [] }), // Por ahora, imageUrls vacío
        };

    } catch (error) {
        console.error('Error llamando a la API de Gemini:', error);
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({ message: 'Error procesando la solicitud en el servidor', error: error.message }),
        };
    }
};