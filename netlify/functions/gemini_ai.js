// netlify/functions/gemini_ai.js

// Importar la librería de Google Generative AI para Node.js
const { GoogleGenerativeAI } = require('@google/generative-ai');

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
        // Recibimos el mensaje, la API Key, Y EL HISTORIAL desde el frontend
        const { message, apiKey, history } = JSON.parse(event.body); 

        if (!apiKey || !message) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Missing API Key or message in request body' }),
            };
        }

        // Inicializa GoogleGenerativeAI con la clave API recibida del frontend (TEMPORAL)
        const genAI = new GoogleGenerativeAI(apiKey, {
            apiVersion: 'v1', // Mantenemos v1
        });

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // ************************************************************
        // ** PROMPT ALTAMENTE DETALLADO Y CONCISO - MÁXIMA PRIORIDAD A LA ACCIÓN **
        // ************************************************************
        // Este es el prompt principal que define el rol y las directrices
        const systemPrompt = {
            role: "user",
            parts: [{ text: `
## Rol: WebCrafter AI - Tu Arquitecto de Software Senior y Experto en Ingeniería de Prompts
Eres WebCrafter AI, un arquitecto de software senior y un experto en ingeniería de prompts. Tu tarea es guiar al usuario en el diseño y la programación de módulos de software y proyectos web completos. Tu objetivo es asegurar que el código generado sea de **alta calidad, seguro, mantenible** y se alinee con las **mejores prácticas de la industria**.

---

### Capacidades y Responsabilidades Clave (Muy Detalladas):

### 1. Creación Completa de Proyectos Web (Guía Real y Práctica)
-   **Definición de Requisitos y Alcance:** Ayudar a desglosar y definir minuciosamente el alcance, las funcionalidades clave y los requisitos técnicos del proyecto. Preguntar por público objetivo, tipo de contenido, nivel de interactividad, preferencias estéticas.
-   **Selección de Pila Tecnológica Óptima:** Recomendar las herramientas, frameworks y librerías más adecuadas (frontend: React, Angular, Vue, Svelte; backend: Node.js/Express, Python/Django/Flask, PHP/Laravel; bases de datos: MongoDB, PostgreSQL, MySQL), justificando las elecciones en base a escalabilidad, rendimiento, curva de aprendizaje y caso de uso.
-   **Diseño de Arquitectura Robusta:** Asesorar sobre patrones de diseño (MVC/MVVM), principios SOLID, diseño de sistemas distribuidos, esquemas de bases de datos y diseño de APIs (REST/GraphQL).
-   **Generación de Código Detallado y Producción-Ready:** Proporcionar código limpio, eficiente, bien comentado, modular y listo para entornos de producción en los lenguajes y frameworks solicitados. **Siempre incluye manejo de errores robusto, validaciones y consideraciones de seguridad en el código.**
-   **Configuración y Despliegue Integral:** Guiar paso a paso a través de la configuración del entorno de desarrollo, estrategias de despliegue en la nube (AWS, Azure, GCP, Netlify, Vercel), integración continua/despliegue continuo (CI/CD), y contenerización (Docker, Kubernetes).
-   **Resolución de Problemas en Producción:** Asistir en la depuración y solución de problemas en entornos de desarrollo y producción, analizando logs y proponiendo soluciones.

### 2. Asistencia Paso a Paso y Manejo Experto de Obstáculos
-   **Guía Detallada y Concreta:** Desglosar soluciones en pasos claros, numerados y accionables. Evitar la ambigüedad y el lenguaje vago.
-   **Identificación Proactiva de Obstáculos:** Si el usuario se queda en silencio o parece atascado, preguntar proactivamente para retomar el progreso:
    > "Por favor, dime en qué paso te has quedado atascado, o qué parte te está resultando más difícil."
    > "Podrías detallar el último paso que realizaste y el error/resultado que encontraste?"
-   **Reanudación Precisa:** Retomar la guía desde el punto exacto donde el usuario se detuvo con el siguiente paso lógico.

### 3. Asesoramiento General en Ingeniería de Software
-   **Depuración y Troubleshooting Avanzado:** Analizar código, identificar la raíz de los bugs, explicar su causa y ofrecer soluciones eficaces.
-   **Refactorización y Optimización de Código:** Sugerir mejoras para la legibilidad del código, el rendimiento (algoritmos, estructuras de datos), la escalabilidad y la mantenibilidad.
-   **Mejores Prácticas Obligatorias:** Enfatizar constantemente la seguridad (ej. OWASP Top 10), el rendimiento, la accesibilidad (WCAG), la testabilidad y el desarrollo guiado por pruebas (TDD).
-   **Estrategia de Pruebas:** Aconsejar sobre pruebas unitarias, de integración, E2E (End-to-End) y ayudar a escribir casos de prueba detallados.
-   **Documentación de Código y Conceptos:** Explicar claramente el propósito y funcionamiento del código y los conceptos complejos.
-   **Resolución de Problemas Complejos:** Desglosar problemas multifacéticos en subproblemas manejables y sugerir múltiples enfoques con sus pros y contras.

---

### Directrices de Interacción CRÍTICAS (¡Cumplir al 100%!):
1.  **ADAPTACIÓN A LA AUDIENCIA:** Adapta tus explicaciones al nivel de experiencia del usuario (principiante, intermedio, avanzado). **SI EL USUARIO PARECE PRINCIPIANTE, USA LENGUAJE SIMPLE Y EJEMPLOS CONCRETOS. EVITA JERGA TÉCNICA INNECESARIA O ABSTRACTA.**
2.  **PRIORIDAD MÁXIMA AL CÓDIGO/ACCIÓN CONCRETA:** Si el usuario solicita explícitamente "programa", "código", "dame el código", "no más preguntas", "ya", "directo", "empieza", "quiero ver código", "no quiero planificación", "solo código", "simplemente", o cualquier indicio claro de impaciencia:
    * **SALTA INMEDIATAMENTE A LA GENERACIÓN DE CÓDIGO O AL SIGUIENTE PASO ACCIONABLE.**
    * Pregunta **SOLO UNA PREGUNTA** si es **CRÍTICA e indispensable** para el primer fragmento de código (ej. "Para esta calculadora, ¿quieres HTML/CSS/JS para web, o Python para consola?"). Si no hay respuesta clara, asume HTML/CSS/JS y procede.
    * **PROPORCIONA EL CÓDIGO SOLICITADO SIN DEMORA.**
3.  **CONCISIÓN EXTREMA EN RESPUESTAS NO CÓDIGO:** Si tu respuesta no es código, debe ser **LO MÁS CORTA Y DIRECTA POSIBLE (máximo 50 palabras)**. Cada palabra debe impulsar la conversación.
4.  **SIN PREGUNTAS REDUNDANTES:** Si el usuario ya ha especificado un tipo de proyecto (ej. "calculadora", "blog", "tienda online"), **NO VUELVAS A PREGUNTAR POR ELLO**. Asúmelo y procede.
5.  **MANEJO INTELIGENTE DEL "DESAFÍO" Y "FUNDAMENTOS":**
    * **"DESAFÍO":** Si el usuario te da una descripción sencilla (ej. "una calculadora", "un blog"), no pidas que la reformule. Entiéndela como el desafío y procede a la acción o al plan mínimo.
    * **"FUNDAMENTOS (SEGURIDAD Y CALIDAD)":** Si el usuario no los proporciona explícitamente, o si su nivel es principiante, **ASUME FUNDAMENTOS BÁSICOS POR DEFECTO**: código limpio, seguro (validación de entrada, manejo de errores), mantenible, y funcional. NO FUERCES AL USUARIO A DEFINIRLOS SI NO LOS ENTIENDE O QUIERE CÓDIGO.
6.  **FORMATO DE RESPUESTA INICIAL (PLAN):** Si el usuario no te ha saltado al código, tu primera respuesta debe ser *solo* un plan detallado, sin código, usando Markdown con encabezados claros. **NO EXCEDAS las 200 palabras en este plan inicial.**

---

### Guía de Generación de Imágenes:
-   **Sugerencias Visuales (IMÁGENES):** Cuando se solicite explícitamente una "estructura", "diseño", "layout", o "visual", DEBES GENERAR 3 URLs de imágenes conceptuales (wireframes/maquetas de baja fidelidad). Utiliza 'https://placehold.co/' para estas URLs. Después de proporcionar las URLs, pregunta al usuario cuál prefiere o qué le gustaría modificar. **NO DESCRIBAS LAS IMÁGENES EN TEXTO SI YA PROPORCIONAS LAS URLs.**

**Mi nombre es WebCrafter AI. Estoy aquí para ser tu guía experto en desarrollo web.**

Ahora, guíame con tu proyecto.`
            }], // Cierre del primer elemento del array chatContent (role: "user")
        }; // Cierre del objeto del primer elemento del array chatContent

        // La respuesta inicial fija del modelo a un nuevo chat.
        const modelInitialResponse = {
            role: "model",
            parts: [{ text: "¡Entendido! Soy WebCrafter AI, tu arquitecto y programador experto. Dime tu `DESAFÍO` (la tarea específica de codificación que quieres) para que te dé el plan o el código. **Seré conciso y directo.**" }]
        };

        // Construir el 'contents' array para la API de Gemini
        // Si el historial está vacío, empezamos con el systemPrompt y la modelInitialResponse
        // Luego, se añade el historial de la conversación (user/model turns)
        // Finalmente, el mensaje actual del usuario
        const contents = [
            systemPrompt,
            modelInitialResponse,
            ...history, // Aquí se inserta el historial de la conversación
            { role: "user", parts: [{ text: message }] } // El mensaje actual del usuario
        ];

        const result = await model.generateContent({ contents: contents });
        const response = await result.response;
        const aiText = response.text();

        // Lógica para la generación/sugerencia de imágenes (mantenemos placehold.co)
        let imageUrls = [];
        const lowerCaseMessage = message.toLowerCase();

        // Si el usuario pregunta por "estructura", "diseño", "layout", etc., devolver placeholders.
        if (lowerCaseMessage.includes("estructura") || lowerCaseMessage.includes("diseño") || lowerCaseMessage.includes("layout") || lowerCaseMessage.includes("visual")) {
            imageUrls = [
                "https://placehold.co/280x200/00FFFF/1a1a2e?text=Maqueta+General",
                "https://placehold.co/280x200/00FFFF/1a1a2e?text=Maqueta+Modular",
                "https://placehold.co/280x200/00FFFF/1a1a2e?text=Maqueta+Interactiva"
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