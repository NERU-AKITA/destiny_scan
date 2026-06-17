// === CONFIGURACIÓN ===
const API_KEY = 'AIzaSyDaoyZ2z39X0tyOUhQiNJmbnRmUX28XcI0'; 
const MASTER_FOLDER_ID = '16a5mYYvEuVwFIciW9RmmJ6Hg0RAh-BQ_'; 
// =====================

// Variables globales
let currentPages = [];
let currentIndex = 0;
let mangaChapters = {}; // Diccionario para mapear: mangaId -> [lista de capítulos]

// Elementos DOM
const catalogView = document.getElementById('catalog-view');
const readerView = document.getElementById('reader-view');
const mangaGrid = document.getElementById('manga-grid');
const loadingMsg = document.getElementById('loading-msg');
const backBtn = document.getElementById('back-btn');

const titleElement = document.getElementById('manga-title');
const imgElement = document.getElementById('manga-image');
const pageInfo = document.getElementById('page-info');
const chapterSelect = document.getElementById('chapter-select');

const prevBtns = [document.getElementById('prev-btn'), document.getElementById('prev-btn-bottom')];
const nextBtns = [document.getElementById('next-btn'), document.getElementById('next-btn-bottom')];

// 1. Cargar catálogo principal buscando obras e iconos
async function loadCatalog() {
    try {
        const foldersUrl = `https://www.googleapis.com/drive/v3/files?q='${MASTER_FOLDER_ID}'+in+parents+and+mimeType='application/vnd.google-apps.folder'&fields=files(id,name)&key=${API_KEY}`;
        const resFolders = await fetch(foldersUrl);
        const dataFolders = await resFolders.json();
        
        if (!dataFolders.files || dataFolders.files.length === 0) {
            loadingMsg.innerText = "No se encontraron obras en la carpeta de proyectos.";
            return;
        }

        loadingMsg.style.display = 'none';

        for (const mangaFolder of dataFolders.files) {
            // Buscamos tanto carpetas (capítulos) como imágenes (icon) dentro de cada obra
            const query = `'${mangaFolder.id}'+in+parents+and+(mimeType='application/vnd.google-apps.folder'+or+mimeType+contains+'image/')`;
            const contentUrl = `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(query)}&fields=files(id,name,mimeType)&key=${API_KEY}`;
            const resContent = await fetch(contentUrl);
            const dataContent = await resContent.json();

            if (dataContent.files) {
                let iconId = null;
                let chapters = [];

                dataContent.files.forEach(file => {
                    if (file.mimeType === 'application/vnd.google-apps.folder') {
                        chapters.push({ id: file.id, name: file.name });
                    } else if (file.name.toLowerCase().startsWith('icon.')) {
                        iconId = file.id;
                    }
                });

                // Ordenar los capítulos de forma inteligente (Capítulo 1, Capítulo 2, Capítulo 10...)
                chapters.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

                // Almacenar los capítulos indexados por el ID de la obra
                mangaChapters[mangaFolder.id] = chapters;

                // Si tiene portada, pintarlo en el catálogo
                if (iconId) {
                    createMangaCard(mangaFolder.name, mangaFolder.id, iconId);
                }
            }
        }
    } catch (error) {
        console.error("Error cargando el catálogo:", error);
        loadingMsg.innerText = "Error al conectar con Drive. Verifica tu configuración.";
    }
}

// 2. Crear las tarjetas del Catálogo
function createMangaCard(title, mangaId, iconId) {
    const card = document.createElement('div');
    card.className = 'manga-card';
    
    const iconUrl = `https://drive.google.com/uc?export=view&id=${iconId}`;

    card.innerHTML = `
        <img src="${iconUrl}" alt="${title}" class="manga-cover">
        <div class="manga-info">
            <h3 class="manga-title">${title}</h3>
        </div>
    `;

    card.addEventListener('click', () => openManga(title, mangaId));
    mangaGrid.appendChild(card);
}

// 3. Abrir la obra y rellenar el selector de capítulos
function openManga(title, mangaId) {
    const chapters = mangaChapters[mangaId] || [];
    if (chapters.length === 0) {
        alert("Esta obra aún no tiene capítulos subidos.");
        return;
    }

    titleElement.innerText = title;
    
    // Limpiar y cargar las opciones en el dropdown de capítulos
    chapterSelect.innerHTML = '';
    chapters.forEach(ch => {
        const option = document.createElement('option');
        option.value = ch.id;
        option.innerText = ch.name;
        chapterSelect.appendChild(option);
    });

    // Detectar cuando el usuario cambia de capítulo en el menú desplegable
    chapterSelect.onchange = async () => {
        await loadChapterPages(chapterSelect.value);
    };

    catalogView.classList.add('hidden');
    readerView.classList.remove('hidden');
    backBtn.classList.remove('hidden');

    // Cargar automáticamente el primer capítulo de la lista
    loadChapterPages(chapters[0].id);
}

// 4. Buscar y cargar las imágenes de las páginas del capítulo seleccionado
async function loadChapterPages(chapterFolderId) {
    pageInfo.innerText = "Cargando páginas...";
    imgElement.src = ""; 
    currentPages = [];
    
    try {
        const pagesUrl = `https://www.googleapis.com/drive/v3/files?q='${chapterFolderId}'+in+parents+and+mimeType+contains+'image/'&fields=files(id,name)&key=${API_KEY}`;
        const resPages = await fetch(pagesUrl);
        const dataPages = await resPages.json();

        if (!dataPages.files || dataPages.files.length === 0) {
            pageInfo.innerText = "Este capítulo no contiene páginas.";
            prevBtns.forEach(btn => btn.disabled = true);
            nextBtns.forEach(btn => btn.disabled = true);
            return;
        }

        // Ordenar las páginas numéricamente (1, 2, 3...) sin importar si son jpg o png
        let pages = dataPages.files;
        pages.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

        // Guardar links directos de visualización
        currentPages = pages.map(p => `https://drive.google.com/uc?export=view&id=${p.id}`);
        currentIndex = 0;

        updateViewer();
    } catch (error) {
        console.error("Error cargando el capítulo:", error);
        pageInfo.innerText = "Error al abrir el capítulo.";
    }
}

// 5. Actualizar la vista del visor de páginas
function updateViewer() {
    if (currentPages.length === 0) return;
    
    imgElement.src = currentPages[currentIndex];
    pageInfo.innerText = `Pág. ${currentIndex + 1} / ${currentPages.length}`;
    
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === currentPages.length - 1;

    prevBtns.forEach(btn => btn.disabled = isFirst);
    nextBtns.forEach(btn => btn.disabled = isLast);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Navigación de páginas
function changePage(direction) {
    currentIndex += direction;
    if (currentIndex < 0) currentIndex = 0;
    if (currentIndex >= currentPages.length) currentIndex = currentPages.length - 1;
    updateViewer();
}

prevBtns.forEach(btn => btn.addEventListener('click', () => changePage(-1)));
nextBtns.forEach(btn => btn.addEventListener('click', () => changePage(1)));

// Volver al Catálogo
backBtn.addEventListener('click', () => {
    readerView.classList.add('hidden');
    backBtn.classList.add('hidden');
    catalogView.classList.remove('hidden');
    imgElement.src = "";
    currentPages = [];
});

// Iniciar app
loadCatalog();
