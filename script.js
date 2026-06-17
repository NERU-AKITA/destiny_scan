// ==========================================
// CONFIGURACIÓN OFICIAL - DESTINY SCAN
// ==========================================
const GITHUB_USER = 'shadow-jack2';       
const GITHUB_REPO = 'destiny_scan';   
const BRANCH = 'main';                  

const gridContainer = document.getElementById('manga-grid');

// Función principal que lee la carpeta proyectos
async function cargarProyectos() {
    try {
        // Pedimos a la API de GitHub el contenido de la carpeta 'proyectos'
        const respuesta = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/proyectos`);
        
        if (!respuesta.ok) {
            throw new Error('No se pudo acceder a la carpeta proyectos. Verifica que no esté vacía.');
        }

        const datos = await respuesta.json();

        // Filtramos para asegurarnos de que solo agarre las carpetas de las obras
        const carpetasObras = datos.filter(item => item.type === 'dir');

        if(carpetasObras.length === 0) {
            gridContainer.innerHTML = '<p style="text-align: center; width: 100%;">Aún no hay obras en la carpeta proyectos.</p>';
            return;
        }

        // Limpiamos el contenedor por si acaso
        gridContainer.innerHTML = '';

        // Por cada carpeta de obra encontrada, generamos su tarjeta
        carpetasObras.forEach(obra => {
            crearTarjetaObra(obra.name);
        });

    } catch (error) {
        console.error("Error:", error);
        gridContainer.innerHTML = `<p style="color: #ff6b6b; grid-column: 1/-1; text-align: center;">Error al cargar: ${error.message}</p>`;
    }
}

// Función que dibuja la tarjeta en el HTML
function crearTarjetaObra(titulo) {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'manga-card';

    // encodeURIComponent codifica correctamente los espacios y tildes para la URL
    const folderNameEncoded = encodeURIComponent(titulo);
    const baseUrl = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${BRANCH}/proyectos/${folderNameEncoded}`;
    
    const urlPng = `${baseUrl}/icon.png`;
    const urlJpg = `${baseUrl}/icon.jpg`;

    // Estructura de la tarjeta: intenta cargar icon.png; si no existe, salta a icon.jpg
    tarjeta.innerHTML = `
        <div class="cover-container">
            <img src="${urlPng}" onerror="this.onerror=null; this.src='${urlJpg}';" alt="Portada de ${titulo}">
        </div>
        <p class="manga-title">${titulo}</p>
    `;

    // Acción al hacer clic sobre la obra
    tarjeta.onclick = () => {
        console.log(`Abriendo: ${titulo}`);
        alert(`¡Próximamente! Aquí se abrirá la lista de capítulos para: ${titulo}`);
    };

    gridContainer.appendChild(tarjeta);
}

// Inicializar la carga automática
cargarProyectos();
