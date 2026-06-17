// === CONFIGURACIÓN ===
const API_KEY = 'TU_API_KEY_AQUI'; 
// Este es el ID de la carpeta principal que se llama "proyectos"
const MASTER_FOLDER_ID = 'TU_ID_DE_LA_CARPETA_PROYECTOS_AQUI'; 
// =====================

// Variables globales
let currentPages = [];
let currentIndex = 0;

// Elementos DOM
const catalogView = document.getElementById('catalog-view');
const readerView = document.getElementById('reader-view');
const mangaGrid = document.getElementById('manga-grid');
const loadingMsg = document.getElementById('loading-msg');
const backBtn = document.getElementById('back-btn');

const titleElement = document.getElementById('manga-title');
const imgElement = document.getElementById('manga-image');
const pageInfo = document.getElementById('page-info');

const prevBtns = [document.getElementById('prev-btn'), document.getElementById('prev-btn-bottom')];
const nextBtns = [document.getElementById('next-btn'), document.getElementById('next-btn-bottom')];

// 1. Cargar el catálogo escaneando la carpeta maestra
async function loadCatalog() {
    try {
        // Buscar todas las carpetas dentro de la carpeta "Proyectos"
        const foldersUrl = `https://www.googleapis.com/drive/v3/files?q='${MASTER_FOLDER_ID}'+in+parents+and+mimeType='application/vnd.google-apps.folder'&fields=files(id,name)&key=${API_KEY}`;
        const resFolders = await fetch(foldersUrl);
        const dataFolders = await resFolders.json();
        
        if (!dataFolders.files || dataFolders.files.length === 0) {
            loadingMsg.innerText = "No se encontraron obras en la carpeta de proyectos.";
            return;
        }

        loadingMsg.style.display = 'none';

        // Por cada carpeta de obra, buscar sus archivos
        for (const mangaFolder of dataFolders.files) {
            const filesUrl = `https://www.googleapis.com/drive/v3/files?q='${mangaFolder.id}'+in+parents+and+mimeType+contains+'image/'&fields=files(id,name)&key=${API_KEY}`;
            const resFiles = await fetch(filesUrl);
            const dataFiles = await resFiles.json();

            if (dataFiles.files) {
                let iconId = null;
                let pages = [];

                // Separar el icono de las páginas
                dataFiles.files.forEach(file => {
                    if (file.name.toLowerCase().startsWith('icon.')) {
                        iconId = file.id;
                    } else {
                        pages.push(file);
                    }
                });

                // Ordenar las páginas numéricamente por nombre (ej: 1.jpg, 2.png, 10.jpg)
                pages.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

                // Crear la tarjeta si hay un icono
                if (iconId) {
                    createMangaCard(mangaFolder.name, iconId, pages);
                }
            }
        }
    } catch (error) {
        console.error("Error cargando el catálogo:", error);
        loadingMsg.innerText = "Error al conectar con Drive. Verifica tu API Key.";
    }
}

// 2. Crear la tarjeta visual para el Catálogo
function createMangaCard(title, iconId, pages) {
    const card = document.createElement('div');
    card.className = 'manga-card';
    
    // Convertir ID a URL de imagen de Drive
    const iconUrl = `https://drive.google.com/uc?export=view&id=${iconId}`;

    card.innerHTML = `
        <img src="${iconUrl}" alt="${title}" class="manga-cover">
        <div class="manga-info">
            <h3 class="manga-title">${title}</h3>
        </div>
    `;

    // Al hacer clic, abrir el lector
    card.addEventListener('click', () => openReader(title, pages));
    mangaGrid.appendChild(card);
}

// 3. Abrir el visor de lectura
function openReader(title, pages) {
    if (pages.length === 0) {
        alert("Esta obra aún no tiene páginas subidas.");
        return;
    }

    // Convertir IDs de páginas a URLs
    currentPages = pages.map(p => `https://drive.google.com/uc?export=view&id=${p.id}`);
    currentIndex = 0;

    titleElement.innerText = title;
    catalogView.classList.add('hidden');
    readerView.classList.remove('hidden');
    backBtn.classList.remove('hidden');

    updateViewer();
}

// 4. Actualizar la imagen mostrada en el visor
function updateViewer() {
    imgElement.src = currentPages[currentIndex];
    pageInfo.innerText = `Pág. ${currentIndex + 1} / ${currentPages.length}`;
    
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === currentPages.length - 1;

    prevBtns.forEach(btn => btn.disabled = isFirst);
    nextBtns.forEach(btn => btn.disabled = isLast);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 5. Controles de navegación
function changePage(direction) {
    currentIndex += direction;
    if (currentIndex < 0) currentIndex = 0;
    if (currentIndex >= currentPages.length) currentIndex = currentPages.length - 1;
    updateViewer();
}

prevBtns.forEach(btn => btn.addEventListener('click', () => changePage(-1)));
nextBtns.forEach(btn => btn.addEventListener('click', () => changePage(1)));

// Botón para volver al catálogo
backBtn.addEventListener('click', () => {
    readerView.classList.add('hidden');
    backBtn.classList.add('hidden');
    catalogView.classList.remove('hidden');
    imgElement.src = ""; // Limpiar la imagen para ahorrar memoria
});

// Arrancar la magia
loadCatalog();
