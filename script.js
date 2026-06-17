// ==========================================
// CONFIGURACIÓN OFICIAL - DESTINY SCAN
// ==========================================
const GITHUB_USER = 'shadow-jack2';       
const GITHUB_REPO = 'destiny_scan';   
const BRANCH = 'main';                  

const gridContainer = document.getElementById('manga-grid');
const loader = document.getElementById('loader');
const searchInput = document.getElementById('searchInput');
const noResultsMsg = document.getElementById('no-results');

let proyectosGlobales = []; // Aquí guardaremos las obras para poder buscarlas rápido

// Función principal
async function cargarProyectos() {
    try {
        const respuesta = await fetch(`https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/proyectos`);
        
        if (!respuesta.ok) throw new Error('No se pudo acceder a los proyectos.');

        const datos = await respuesta.json();
        
        // Guardamos solo las carpetas
        proyectosGlobales = datos.filter(item => item.type === 'dir');

        // Ocultamos el loader y mostramos el grid
        loader.classList.add('hidden');
        gridContainer.classList.remove('hidden');

        if(proyectosGlobales.length === 0) {
            gridContainer.innerHTML = '<p style="text-align:center; width:100%;">No hay obras disponibles.</p>';
            return;
        }

        renderizarObras(proyectosGlobales);

    } catch (error) {
        loader.classList.add('hidden');
        gridContainer.classList.remove('hidden');
        gridContainer.innerHTML = `<p style="color: #ef4444; text-align:center; width:100%;">Error: ${error.message}</p>`;
    }
}

// Función que dibuja las tarjetas basándose en una lista
function renderizarObras(listaObras) {
    gridContainer.innerHTML = ''; // Limpiamos antes de dibujar

    if(listaObras.length === 0) {
        noResultsMsg.classList.remove('hidden');
    } else {
        noResultsMsg.classList.add('hidden');
        listaObras.forEach(obra => {
            crearTarjetaObra(obra.name);
        });
    }
}

// Generador de tarjetas individual
function crearTarjetaObra(titulo) {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'manga-card';

    const folderNameEncoded = encodeURIComponent(titulo);
    const baseUrl = `https://raw.githubusercontent.com/${GITHUB_USER}/${GITHUB_REPO}/${BRANCH}/proyectos/${folderNameEncoded}`;
    
    const urlPng = `${baseUrl}/icon.png`;
    const urlJpg = `${baseUrl}/icon.jpg`;

    tarjeta.innerHTML = `
        <div class="cover-container">
            <img src="${urlPng}" onerror="this.onerror=null; this.src='${urlJpg}';" alt="${titulo}">
        </div>
        <div class="manga-info">
            <p class="manga-title">${titulo}</p>
        </div>
    `;

    // Futura redirección al lector
    tarjeta.onclick = () => {
        // Ejemplo de cómo será la URL futura:
        // window.location.href = `lector.html?obra=${folderNameEncoded}`;
        alert(`Abriendo índice de capítulos para: ${titulo}`);
    };

    gridContainer.appendChild(tarjeta);
}

// Buscador en tiempo real
searchInput.addEventListener('input', (e) => {
    const terminoBusqueda = e.target.value.toLowerCase();
    
    // Filtramos el array que guardamos al principio
    const obrasFiltradas = proyectosGlobales.filter(obra => 
        obra.name.toLowerCase().includes(terminoBusqueda)
    );
    
    renderizarObras(obrasFiltradas);
});

// Arrancamos la app
cargarProyectos();
