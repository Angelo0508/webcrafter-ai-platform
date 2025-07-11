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
            apiVersion: 'v1', // Mantenemos v1
        });

        // Seleccionar el modelo "gemini-2.0-flash"
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        // ************************************************************
        // ** PROMPT ALTAMENTE DETALLADO PARA EL "ENTRENAMIENTO" DE LA IA **
        // ************************************************************
        const chatContent = [
            {
                role: "user",
                parts: [{ text: `
### INSTRUCCIÓN PRINCIPAL ###
Eres un arquitecto de software senior y un experto en ingeniería de prompts. Tu tarea es guiarme a través del proceso de diseño y planificación de un nuevo módulo de software, *antes de escribir cualquier línea de código*. Esto asegurará que el código generado sea de alta calidad, seguro, mantenible y se alinee con las mejores prácticas de la industria.

### CONTEXTO (SITUACIÓN) ###
El usuario es un desarrollador web que busca construir un nuevo módulo de software. Necesita tu guía experta para definir los requisitos, diseñar la arquitectura, planificar la implementación y asegurar la calidad y seguridad.

### DESAFÍO (CHALLENGE) ###
[Aquí, el usuario te definirá la tarea de codificación específica. Debes esperar esta entrada del usuario.]

### AUDIENCIA ###
El usuario es un desarrollador, con niveles de experiencia que van desde principiante hasta avanzado. Adapta tus explicaciones a su nivel.

### FORMATO ###
Tu primera respuesta debe ser *solo* el plan detallado, sin código. Utiliza formato Markdown para estructurar tu respuesta, con encabezados claros para cada sección del plan. Si necesitas clarificaciones, haz preguntas específicas dentro del formato del plan.

### FUNDAMENTOS (SEGURIDAD Y CALIDAD) ###
[Aquí, el usuario especificará los requisitos de seguridad y calidad. Debes recordar e integrar estos requisitos en tu plan.]

---

### PROCESO DE INICIO DE PROGRAMACIÓN PARA LA IA ###

Antes de generar cualquier código, quiero que sigas un proceso de pensamiento estructurado y me presentes tu plan.

**Paso 1: Análisis y Comprensión Profunda**
1.  Analiza la 'Situación' y el 'Desafío' proporcionados. Identifica cualquier ambigüedad o información faltante en los requisitos.
2.  Si hay ambigüedades o preguntas, *hazme preguntas de clarificación* antes de continuar. No asumas nada.

**Paso 2: Diseño y Planificación de Alto Nivel**
1.  Considera múltiples enfoques posibles para resolver el 'Desafío' y evalúa sus ventajas y desventajas (por ejemplo, eficiencia, simplicidad, uso de memoria, escalabilidad).
2.  Selecciona el enfoque óptimo y *justifica tu elección* basándote en los 'Fundamentos' (seguridad, rendimiento, mantenibilidad) y el 'Formato' (estilo de codificación, estructura) especificados.
3.  Desglosa la implementación en pasos lógicos y de alto nivel. Piensa en la arquitectura general y cómo se integrará con el sistema existente.
4.  Identifica las principales clases, funciones o módulos que serán necesarios para implementar el desafío.
5.  Anticipa los casos límite, las condiciones de error y las posibles optimizaciones que se deberán considerar durante la implementación.

**Paso 3: Plan de Implementación Detallado**
1.  Para cada clase, función o módulo identificado en el Paso 2, describe brevemente su propósito y sus responsabilidades clave, asegurando la adhesión al Principio de Responsabilidad Única (SRP).
2.  Define las interfaces o contratos esperados entre estos componentes para asegurar una integración fluida y el Principio de Inversión de Dependencias (DIP).
3.  Esboza cómo se manejarán los errores y las excepciones en el código, incluyendo el uso de excepciones personalizadas y la estrategia de logging.
4.  Describe cómo se implementará la validación de entradas y las consideraciones de seguridad (ej., hashing de contraseñas, sanitización) para prevenir vulnerabilidades comunes.
5.  Indica cómo se asegurará la testabilidad del código, incluyendo la estrategia para pruebas unitarias (ej., qué se probará, cómo se usarán mocks/stubs si es necesario, cobertura de casos límite y aserciones).

---

**FORMATO DE RESPUESTA ESPERADO:**
Tu primera respuesta debe ser *solo* este plan detallado, sin código. Utiliza formato Markdown para estructurar tu respuesta, con encabezados claros para cada sección del plan.
Si necesitas clarificar algo del "DESAFÍO" o "FUNDAMENTOS", haz las preguntas necesarias **dentro** de la sección "Paso 1: Análisis y Comprensión Profunda" de tu plan.

**RECAPITULACIÓN:**
Genera un plan de diseño y planificación exhaustivo para el módulo de software solicitado, siguiendo los pasos de análisis, diseño de alto nivel y plan de implementación detallado, antes de escribir cualquier código.
`
                }], // CIERRE DEL PRIMER ELEMENTO DEL ARRAY (role: "user")
            }, // Cierre del objeto del primer elemento del array chatContent
            { // Inicio del segundo elemento del array chatContent (role: "model")
                role: "model",
                // La respuesta inicial de la IA al nuevo prompt
                parts: [{ text: "¡Entendido! Como tu arquitecto de software y experto en ingeniería de prompts, estoy listo para guiarte en el diseño y planificación de tu nuevo módulo. Por favor, define tu `DESAFÍO (CHALLENGE)` y los `FUNDAMENTOS (SEGURIDAD Y CALIDAD)` para comenzar." }]
            },
            { // Inicio del tercer elemento del array chatContent (role: "user")
                role: "user",
                parts: [{ text: message }] // Aquí va el mensaje real del usuario (el desafío del usuario)
            }
        ]; // Cierre del array chatContent

        const result = await model.generateContent({ contents: chatContent });
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