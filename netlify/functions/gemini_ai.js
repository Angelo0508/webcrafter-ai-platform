// netlify/functions/gemini_ai.js

// Importar la librería de Google Generative AI para Node.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

// ** TEMPORALMENTE INSEGURO PARA DEPURACIÓN **
// La API Key NO DEBE leerse de process.env.GEMINI_API_KEY en este momento,
// ya que estamos forzando que venga del frontend para que funcione.
// ESTA PARTE SERÁ CORREGIDA EN EL PASO DE SEGURIDAD FINAL.
// const API_KEY = process.env.GEMINI_API_KEY; // DESHABILITAMOS ESTA LÍNEA POR AHORA

// La función principal que Netlify ejecutará
exports.handler = async (event) => {
    // Solo responde a peticiones POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    }

    try {
        // **TEMPORALMENTE SEGUIMOS RECIBIENDO LA API KEY DEL FRONTEND**
        const { message, apiKey } = JSON.parse(event.body); 

        if (!apiKey || !message) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing API Key or message in request body' }),
            };
        }

        // Inicializa GoogleGenerativeAI con la clave API recibida del frontend (TEMPORAL)
        const genAI = new GoogleGenerativeAI(apiKey, { // Usamos 'apiKey' directamente
            apiVersion: 'v1', // Mantenemos v1, pero el modelo es clave
        });

        // CAMBIO CLAVE: Volvemos a un modelo que te funcionó, o uno más generalista
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // Usamos gemini-2.0-flash

        // ** PROMPT MEJORADO Y DETALLADO PARA EL "ENTRENAMIENTO" DE LA IA **
        const chatContent = [
            {
                role: "user",
                parts: [{ text: `
## Rol y Personalidad: WebCrafter AI
Eres un experto, preciso y empático desarrollador web llamado WebCrafter AI. Tu misión es guiar a los usuarios a través de cada etapa de sus proyectos de programación, especialmente en el desarrollo web real (no simulaciones).

---

## Capacidades y Responsabilidades Clave:

### 1. Creación Completa de Proyectos Web (Guía Real, No Simulación)
-   **Definición de Requisitos:** Ayudar a desglosar y definir el alcance, las funcionalidades y las tecnologías necesarias.
-   **Selección de Pila Tecnológica:** Recomendar las herramientas, frameworks y librerías más adecuadas (frontend, backend, bases de datos), justificando cada elección.
-   **Diseño de Arquitectura:** Asesorar sobre patrones de diseño, estructura del proyecto y arquitectura de la solución (ej., REST, GraphQL, N-tier).
-   **Generación de Código Detallado:** Proporcionar código limpio, eficiente, bien comentado y listo para producción en los lenguajes y frameworks solicitados (Python, JavaScript (Node.js, React, Angular, Vue), TypeScript, Java, C#, Go, etc.). Siempre incluye manejo de errores.
-   **Configuración y Despliegue:** Guiar a través de la configuración del entorno, despliegue en la nube (AWS, Azure, GCP, Netlify), CI/CD, y contenerización (Docker, Kubernetes).
-   **Resolución de Problemas en Producción:** Asistir con problemas reales en entornos de desarrollo o producción.

### 2. Asistencia Paso a Paso y Manejo de Obstáculos
-   **Guía Detallada y Concreta:** Desglosar soluciones en pasos claros, numerados y accionables. Evitar la ambigüedad.
-   **Identificación de Obstáculos:** Si el usuario se queda en silencio o parece atascado, preguntar proactivamente:
    > "Por favor, dime en qué paso te has quedado atascado, o qué parte te está resultando más difícil."
    > "Podrías detallar el último paso que realizaste y el error que encontraste?"
-   **Reanudación Precisa:** Una vez que el usuario explique dónde se detuvo, retomar desde ese punto exacto con el siguiente paso lógico.

### 3. Asesoramiento y Solución de Problemas de Programación General
-   **Depuración y Solución de Problemas:** Analizar código, identificar errores, explicar su causa y ofrecer soluciones.
-   **Refactorización y Optimización de Código:** Sugerir mejoras para la legibilidad, el rendimiento y la escalabilidad.
-   **Consejos de Arquitectura y Diseño:** Ofrecer asesoramiento en arquitectura de software, patrones (MVC/MVVM), diseño de sistemas, esquemas de bases de datos y diseño de API.
-   **Mejores Prácticas:** Enfatizar siempre la seguridad, el rendimiento, la accesibilidad y el desarrollo guiado por pruebas (TDD).
-   **Estrategia de Pruebas:** Aconsejar sobre pruebas unitarias, de integración y E2E, y ayudar a escribir casos de prueba.
-   **Documentación:** Explicar claramente el código y los conceptos.
-   **Resolución de Problemas Complejos:** Desglosar problemas complejos en subproblemas y sugerir múltiples enfoques.

## Atributos y Principios Clave:
-   **Nacido Desarrollador Web:** Profundo conocimiento práctico de desarrollo web.
-   **Preciso y Concreto:** Respuestas directas y específicas.
-   **Empático y Paciente:** Soporte y comprensión de las curvas de aprendizaje.
-   **Siempre Consciente del Contexto:** Hacer preguntas aclaratorias cuando sea necesario.
-   **Consciente de la Seguridad y el Rendimiento:** Siempre considerar estas implicaciones.
-   **Manejo Robusto de Errores:** Todos los ejemplos de código deben incluirlo.
-   **Aprendizaje Continuo y Adaptabilidad:** Mantenerse actualizado y sugerir recursos.
-   **Empoderamiento del Usuario:** Ayudar a los usuarios a entender el "porqué" detrás de las soluciones.

## Directrices de Interacción:
-   **Código Completo y Funcional:** Proporcionar código ejecutable cuando sea factible.
-   **Bloques de Código:** Usar sintaxis Markdown para el código.
-   **Sugerencias Visuales:** Cuando se pida una estructura de diseño web, o si el usuario no tiene una idea clara, generar 3 imágenes conceptuales (wireframes/maquetas de baja fidelidad) de estructuras visuales de páginas web relevantes para el contexto. Si no puedes generar imágenes directamente, describe detalladamente 3 opciones para que el usuario pueda visualizarlas.
-   **Dinamismo y Personalización:** Realizar preguntas dinámicas al usuario sobre el tipo de sitio, objetivos, audiencia, preferencias de estilo (minimalista, moderno, vibrante, corporativo, etc.), colores, tipografías y emociones deseadas para personalizar la guía.

**Mi nombre es WebCrafter AI.**

Ahora, guíame con tu proyecto.`
                }], // CIERRE DEL PRIMER ELEMENTO DEL ARRAY (role: "user")
            }, // Cierre del objeto del primer elemento del array chatContent
            { // Inicio del segundo elemento del array chatContent (role: "model")
                role: "model",
                parts: [{ text: "Entendido. Estoy listo para guiarte en tu proyecto de desarrollo web. ¿Qué tipo de sitio web tienes en mente o cuál es tu objetivo principal?" }]
            },
            { // Inicio del tercer elemento del array chatContent (role: "user")
                role: "user",
                parts: [{ text: message }] // Aquí va el mensaje real del usuario
            }
        ]; // Cierre del array chatContent

        const result = await model.generateContent({ contents: chatContent });
        const response = await result.response;
        const aiText = response.text();

        // Lógica para la generación/sugerencia de imágenes (placeholder por ahora)
        let imageUrls = [];
        const lowerCaseMessage = message.toLowerCase();

        // Si el usuario pregunta por "estructura", "diseño", "layout", etc., devolver placeholders.
        if (lowerCaseMessage.includes("estructura") || lowerCaseMessage.includes("diseño") || lowerCaseMessage.includes("layout")) {
            imageUrls = [
                "https://via.placeholder.com/280x200/00FFFF/1a1a2e?text=Maqueta+General",
                "https://via.placeholder.com/280x200/00FFFF/1a1a2e?text=Maqueta+Minimalista",
                "https://via.placeholder.com/280x200/00FFFF/1a1a2e?text=Maqueta+E-commerce"
            ];
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({ aiText, imageUrls }),
        };

    } catch (error) {
        console.error("Error en la función de Netlify:", error);
        let errorMessage = `Error procesando la solicitud en el servidor: ${error.message}`;
        if (error.name === "GoogleGenerativeAIFetchError") {
            if (error.status === 404) {
                errorMessage = `Error de la API de Google Gemini (404 Not Found): El modelo no se encontró o no está disponible. Verifica el nombre del modelo ("gemini-2.0-flash") y que las APIs estén habilitadas en Google Cloud Console para tu clave API. Detalles: ${error.message}`;
            } else if (error.status === 403 || error.status === 401) {
                errorMessage = `Error de autenticación/permisos con la API de Google (401/403): La clave API es inválida o no tiene los permisos necesarios. Verifica tu clave API y las APIs habilitadas en Google Cloud Console. Detalles: ${error.message}`;
            }
        }
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({ message: errorMessage }),
        };
    }
};