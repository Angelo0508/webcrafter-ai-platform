document.addEventListener('DOMContentLoaded', () => {
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const messagesContainer = document.getElementById('messages');
    const imageSuggestionsContainer = document.getElementById('image-suggestions');
    const structureModal = document.getElementById('structure-modal');
    const closeStructureModalButton = document.getElementById('close-modal');

    // Botones de autenticación y perfil
    const loginButton = document.getElementById('login-button');
    const registerButton = document.getElementById('register-button');
    const userProfile = document.getElementById('user-profile');

    // Elementos del Sidebar
    const hamburgerMenuButton = document.getElementById('hamburger-menu');
    const sidebar = document.getElementById('sidebar');
    const newProjectButton = document.getElementById('new-project-button');
    const projectListItems = document.getElementById('project-list-items');

    // Estado simulado de autenticación y proyectos
    let isLoggedIn = false;
    let currentProjectId = 'current';
    const projects = {
        'current': { name: 'Proyecto Actual', messages: [], imageUrls: [] }
    };
    let projectIdCounter = 0;

    // Función para actualizar el estado de los botones de autenticación/perfil
    function updateAuthButtons() {
        if (isLoggedIn) {
            loginButton.classList.add('hidden');
            registerButton.classList.add('hidden');
            userProfile.classList.remove('hidden');
        } else {
            loginButton.classList.remove('hidden');
            registerButton.classList.remove('hidden');
            userProfile.classList.add('hidden');
        }
    }

    // Función para renderizar los mensajes de un proyecto
    function renderMessages(projectId) {
        messagesContainer.innerHTML = '';
        projects[projectId].messages.forEach(msg => {
            addMessage(msg.text, msg.sender, false);
        });
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Función para renderizar la lista de proyectos en el sidebar
    function renderProjectList() {
        projectListItems.innerHTML = '';
        for (const id in projects) {
            const project = projects[id];
            const li = document.createElement('li');
            li.classList.add('project-item');
            li.dataset.projectId = id;
            
            // Contenedor para el nombre del proyecto
            const projectNameSpan = document.createElement('span');
            projectNameSpan.textContent = project.name;
            li.appendChild(projectNameSpan);

            // Contenedor para los botones de acción (editar y borrar)
            const projectActionsDiv = document.createElement('div');
            projectActionsDiv.classList.add('project-actions');

            // Botón de editar (icono de lápiz outline)
            const editButton = document.createElement('button');
            editButton.classList.add('edit-project-name');
            editButton.innerHTML = '&#x270E;'; // Emoji de lápiz outline
            editButton.title = 'Renombrar proyecto';
            editButton.addEventListener('click', (e) => {
                e.stopPropagation(); // Evitar que el clic en el botón de editar active la selección del proyecto
                const newName = prompt('Introduce el nuevo nombre para el proyecto:', project.name);
                if (newName && newName.trim() !== '') {
                    project.name = newName.trim();
                    renderProjectList(); // Volver a renderizar la lista para aplicar el cambio
                }
            });
            projectActionsDiv.appendChild(editButton);

            // Botón de borrar (icono de papelera outline)
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-project');
            deleteButton.innerHTML = '&#x1F5D1;'; // Emoji de papelera outline
            deleteButton.title = 'Eliminar proyecto';
            deleteButton.addEventListener('click', (e) => {
                e.stopPropagation(); // Evitar que el clic en el botón de borrar active la selección del proyecto
                if (confirm(`¿Estás seguro de que quieres eliminar el proyecto "${project.name}"?`)) {
                    delete projects[id];
                    // Si el proyecto actual es el que se eliminó, cambiamos a "current" o al primer proyecto disponible
                    if (id === currentProjectId) {
                        const projectIds = Object.keys(projects);
                        if (projectIds.length > 0) {
                            currentProjectId = projectIds[0];
                        } else {
                            // Si no hay proyectos, crear uno nuevo por defecto
                            projectIdCounter++;
                            const defaultId = `project-${projectIdCounter}`;
                            projects[defaultId] = { name: 'Proyecto Nuevo', messages: [{ text: "¡Hola! Soy WebCrafter AI, ¿en qué puedo ayudarte con tu nuevo proyecto?", sender: "ai" }], imageUrls: [] };
                            currentProjectId = defaultId;
                        }
                    }
                    renderProjectList();
                    renderMessages(currentProjectId);
                    structureModal.classList.add('hidden'); // Ocultar modal si estaba visible
                }
            });
            projectActionsDiv.appendChild(deleteButton);
            
            li.appendChild(projectActionsDiv); // Añadir el div de acciones al li

            if (id === currentProjectId) {
                li.classList.add('active');
            }

            li.addEventListener('click', () => {
                if (id !== currentProjectId) {
                    saveCurrentChatState();
                    currentProjectId = id;
                    renderMessages(currentProjectId);
                    document.querySelectorAll('.project-item').forEach(item => {
                        item.classList.remove('active');
                    });
                    li.classList.add('active');
                    structureModal.classList.add('hidden');
                    if (window.innerWidth <= 992) {
                        sidebar.classList.remove('visible');
                    }
                }
            });
            projectListItems.appendChild(li);
        }
    }

    // Función para guardar el estado del chat actual
    function saveCurrentChatState() {
        const currentMessages = [];
        messagesContainer.querySelectorAll('.message').forEach(msgDiv => {
            const sender = msgDiv.classList.contains('ai-message') ? 'ai' : 'user';
            const text = msgDiv.querySelector('p').textContent;
            currentMessages.push({ text, sender });
        });
        projects[currentProjectId].messages = currentMessages;
    }

    // Inicializar la interfaz al cargar
    updateAuthButtons();
    renderProjectList();
    addMessage("¡Hola! Soy WebCrafter AI, tu guía experto en desarrollo web. ¿En qué tipo de sitio web estás pensando hoy?", 'ai');


    // Event listeners para los botones de autenticación (simulados)
    loginButton.addEventListener('click', () => {
        alert('Simulando inicio de sesión...');
        isLoggedIn = true;
        updateAuthButtons();
        structureModal.classList.add('hidden');
        sidebar.classList.remove('visible');
    });

    registerButton.addEventListener('click', () => {
        alert('Simulando registro...');
        isLoggedIn = true;
        updateAuthButtons();
        structureModal.classList.add('hidden');
        sidebar.classList.remove('visible');
    });

    userProfile.addEventListener('click', () => {
        alert('Simulando menú de perfil. ¿Cerrar sesión?');
        isLoggedIn = false;
        updateAuthButtons();
        structureModal.classList.add('hidden');
        sidebar.classList.remove('visible');
    });

    // Toggle para el Sidebar
    hamburgerMenuButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Evitar que el clic en el botón cierre inmediatamente el sidebar
        sidebar.classList.toggle('visible');
    });

    // Cerrar Sidebar al hacer clic fuera de él
    document.addEventListener('click', (event) => {
        if (sidebar.classList.contains('visible')) {
            const isClickInsideSidebar = sidebar.contains(event.target);
            const isClickOnHamburger = hamburgerMenuButton.contains(event.target);
            // No se necesita `isClickInsideChatColumn` aquí, ya que el sidebar es un modal de menú
            if (!isClickInsideSidebar && !isClickOnHamburger) {
                sidebar.classList.remove('visible');
            }
        }
    });

    // Iniciar Nuevo Proyecto
    newProjectButton.addEventListener('click', () => {
        saveCurrentChatState();
        projectIdCounter++;
        const newId = `project-${projectIdCounter}`;
        projects[newId] = {
            name: `Nuevo Proyecto ${projectIdCounter}`,
            messages: [{ text: "¡Hola! Soy WebCrafter AI, ¿en qué puedo ayudarte con tu nuevo proyecto?", sender: "ai" }],
            imageUrls: []
        };
        currentProjectId = newId;
        renderProjectList();
        renderMessages(currentProjectId);
        structureModal.classList.add('hidden');
        userInput.value = '';
        if (window.innerWidth <= 992) {
            sidebar.classList.remove('visible');
        }
    });


    // Función para añadir un mensaje al chat (con opción de guardar)
    function addMessage(text, sender, save = true) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', `${sender}-message`);
        messageDiv.innerHTML = `<p>${text}</p>`;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        if (save) {
            projects[currentProjectId].messages.push({ text, sender });
        }
    }

    // Función para añadir imágenes sugeridas (como botones)
    function addImageSuggestions(imageUrls) {
        imageSuggestionsContainer.innerHTML = '';
        if (imageUrls && imageUrls.length > 0) {
            imageUrls.forEach((url, index) => {
                const imageOptionDiv = document.createElement('div');
                imageOptionDiv.classList.add('image-option');
                imageOptionDiv.dataset.structureId = index + 1;

                const img = document.createElement('img');
                img.src = url;
                img.alt = `Sugerencia de estructura ${index + 1}`;
                
                const p = document.createElement('p');
                p.textContent = `Opción ${index + 1}`;

                imageOptionDiv.appendChild(img);
                imageOptionDiv.appendChild(p);
                imageSuggestionsContainer.appendChild(imageOptionDiv);

                imageOptionDiv.addEventListener('click', () => {
                    const selectedId = imageOptionDiv.dataset.structureId;
                    alert(`¡Has seleccionado la Estructura Opción ${selectedId}!`);
                    addMessage(`He seleccionado la Estructura Opción ${selectedId}. ¡Me encanta!`, 'user');
                    structureModal.classList.add('hidden');
                });
            });
            structureModal.classList.remove('hidden');
        } else {
            structureModal.classList.add('hidden');
        }
    }

    // Event listener para cerrar el modal de estructuras
    closeStructureModalButton.addEventListener('click', () => {
        structureModal.classList.add('hidden');
    });

    // Función para enviar mensaje a Automa (placeholder por ahora)
    async function sendMessageToAutoma(message) {
        addMessage(message, 'user');
        userInput.value = '';

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            const aiResponseText = `Entendido. Para el tipo de sitio web que mencionas, aquí tienes algunas sugerencias de estructuras visuales. Por favor, selecciona la que más te guste haciendo clic en ella.`;
            addMessage(aiResponseText, 'ai');

            // Actualizadas URLs de imágenes para reflejar el nuevo color primario
            const simulatedImageUrls = [
                'https://via.placeholder.com/280x200/00FFFF/1a1a2e?text=Estructura+1', // Fondo azul brillante, texto oscuro
                'https://via.placeholder.com/280x200/0f3460/00FFFF?text=Estructura+2', // Fondo azul secundario, texto azul brillante
                'https://via.placeholder.com/280x200/1a1a2e/00FFFF?text=Estructura+3'  // Fondo oscuro, texto azul brillante
            ];
            addImageSuggestions(simulatedImageUrls);
            
        } catch (error) {
            console.error("Error al comunicarse con Automa:", error);
            addMessage("Lo siento, hubo un error al procesar tu solicitud. Por favor, inténtalo de nuevo.", 'ai');
            structureModal.classList.add('hidden');
        }
    }

    // Event Listeners para el chat
    sendButton.addEventListener('click', () => {
        const message = userInput.value.trim();
        if (message) {
            sendMessageToAutoma(message);
        }
    });

    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendButton.click();
        }
    });

});