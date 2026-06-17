// === PON TU API KEY AQUÍ ===
const API_KEY = 'TU_API_KEY_AQUI'; 

let images = [];
let currentIndex = 0;

// Elementos del HTML
const selectElement = document.getElementById('chapter-select');
const imgElement = document.getElementById('manga-image');
const pageInfo = document.getElementById('page-info');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

// 1. Cargar la lista de proyectos desde el JSON
async function loadProjects() {
    try {
        const response = await fetch('proyectos.json');
        const proyectos = await response.json();
        
        selectElement.innerHTML = '<option value="">-- Elige un capítulo --</option>';
        
        proyectos.forEach(item => {
            const option = document.createElement('option');
            option.value = item.folderId; 
            option.textContent = `${item.manga} - Cap. ${item.capitulo}`;
            selectElement.appendChild(option);
        });

    } catch (error) {
        console.error("Error cargando proyectos.json:", error);
        pageInfo.innerText = "Error cargando la lista de capítulos.";
    }
}

// 2. Escuchar cuando eliges un capítulo en el menú
selectElement.addEventListener('change', (event) => {
    const folderId = event.target.value;
    if (folderId) {
        fetchImagesFromDrive(folderId);
    } else {
        imgElement.style.display = 'none';
        pageInfo.innerText = "Selecciona un capítulo para empezar";
        prevBtn.disabled = true;
        nextBtn.disabled = true;
    }
});

// 3. Conectar con Google Drive
async function fetchImagesFromDrive(folderId) {
    pageInfo.innerText = "Cargando imágenes...";
    imgElement.style.display = 'none';
    prevBtn.disabled = true;
    nextBtn.disabled = true;

    const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType+contains+'image/'&orderBy=name&key=${API_KEY}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.files && data.files.length > 0) {
            // Convierte el ID de la imagen en un link directo
            images = data.files.map(file => `https://lh3.googleusercontent.com/d/${file.id}`); 
            currentIndex = 0;
            updateViewer();
        } else {
            pageInfo.innerText = "No se encontraron imágenes. ¿La carpeta es pública?";
        }
    } catch (error) {
        console.error("Error cargando Drive:", error);
        pageInfo.innerText = "Error al conectar. Revisa tu API Key.";
    }
}

// 4. Actualizar el visor
function updateViewer() {
    if (images.length === 0) return;

    imgElement.src = images[currentIndex];
    imgElement.style.display = 'block';
    
    pageInfo.innerText = `Pág. ${currentIndex + 1} / ${images.length}`;
    
    prevBtn.disabled = (currentIndex === 0);
    nextBtn.disabled = (currentIndex === images.length - 1);
    
    // Sube la pantalla al inicio de la imagen al cambiar de página
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 5. Botones de "Siguiente" y "Anterior"
prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
        currentIndex--;
        updateViewer();
    }
});

nextBtn.addEventListener('click', () => {
    if (currentIndex < images.length - 1) {
        currentIndex++;
        updateViewer();
    }
});

// Arrancar la página cargando el menú
loadProjects();
