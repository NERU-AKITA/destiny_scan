:root {
    --bg-color: #0d0814; 
    --header-bg: #150d22;
    --card-bg: #1e1332;
    --accent-color: #9d4edd; 
    --accent-hover: #c77dff;
    --text-main: #e0d8f0;
    --text-muted: #a395b8;
    --border-color: #3c2069;
    --glow: 0 0 15px rgba(157, 78, 221, 0.4);
}

body {
    background-color: var(--bg-color);
    color: var(--text-main);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
}

header {
    background-color: var(--header-bg);
    width: 100%;
    padding: 20px 0;
    text-align: center;
    border-bottom: 2px solid var(--border-color);
    box-shadow: var(--glow);
    position: relative;
}

h1 { 
    margin: 0; 
    color: #e0aaff; 
    font-size: 2.2rem; 
    text-transform: uppercase;
    letter-spacing: 3px;
    text-shadow: 0 2px 5px rgba(0,0,0,0.8);
}

.hidden { display: none !important; }

/* --- VISTA CATÁLOGO --- */
#catalog-view {
    width: 100%;
    max-width: 1200px;
    padding: 30px 20px;
    box-sizing: border-box;
}

#loading-msg {
    text-align: center;
    font-size: 1.2rem;
    color: var(--accent-color);
    margin-top: 50px;
}

.grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 25px;
}

.manga-card {
    background-color: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    display: flex;
    flex-direction: column;
}

.manga-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--glow);
    border-color: var(--accent-hover);
}

.manga-cover {
    width: 100%;
    height: 320px;
    object-fit: cover;
    border-bottom: 2px solid var(--border-color);
}

.manga-info {
    padding: 15px;
    text-align: center;
}

.manga-title {
    margin: 0;
    font-size: 1.1rem;
    color: #fff;
    font-weight: 600;
}

/* --- VISTA LECTOR --- */
#reader-view {
    width: 100%;
    max-width: 900px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0;
}

#manga-title {
    color: var(--accent-hover);
    margin-bottom: 15px;
    text-align: center;
}

.image-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    padding: 0 10px;
    box-sizing: border-box;
}

#manga-image {
    max-width: 100%;
    height: auto;
    border: 2px solid var(--border-color);
    border-radius: 4px;
    box-shadow: 0 5px 25px rgba(0,0,0,0.9);
}

.controls {
    margin: 15px 0;
    display: flex;
    gap: 15px;
    align-items: center;
}

button {
    background-color: var(--accent-color);
    color: white;
    border: none;
    padding: 10px 25px;
    font-size: 1rem;
    font-weight: bold;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s ease, transform 0.1s;
}

button:hover:not(:disabled) { 
    background-color: var(--accent-hover); 
    transform: scale(1.05);
}
button:disabled { 
    background-color: #2a1a3a; 
    color: #555; 
    cursor: not-allowed; 
}

#back-btn {
    position: absolute;
    left: 20px;
    top: 20px;
    background-color: transparent;
    border: 1px solid var(--accent-color);
}
#back-btn:hover { background-color: var(--accent-color); }
#page-info { font-size: 1.1rem; font-weight: 600; color: var(--text-main); }
