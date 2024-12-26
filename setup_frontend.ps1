# Crear estructura de carpetas
Write-Host "Creando estructura de carpetas..."
New-Item -ItemType Directory -Name "src/components" -Force | Out-Null
New-Item -ItemType Directory -Name "src/services" -Force | Out-Null
New-Item -ItemType Directory -Name "src/styles" -Force | Out-Null

# Crear archivos iniciales

# Archivo VideoCard.jsx
Write-Host "Creando VideoCard.jsx..."
@'
import React from "react";

function VideoCard({ video }) {
  return (
    <div className="video-card">
      <img src={video.snippet.thumbnails.default.url} alt={video.snippet.title} />
      <h3>{video.snippet.title}</h3>
      <p>{video.snippet.channelTitle}</p>
    </div>
  );
}

export default VideoCard;
'@ | Set-Content "src/components/VideoCard.jsx"

# Archivo VideoList.jsx
Write-Host "Creando VideoList.jsx..."
@'
import React from "react";
import VideoCard from "./VideoCard";

function VideoList({ videos }) {
  return (
    <div className="video-list">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}

export default VideoList;
'@ | Set-Content "src/components/VideoList.jsx"

# Archivo youtubeService.js
Write-Host "Creando youtubeService.js..."
@'
const BASE_URL = "http://localhost:3001/api/youtube";

/**
 * Obtiene los videos más populares de una región específica.
 * @param {string} regionCode - Código de región (ej. "US", "MX").
 * @returns {Promise<Object>} - Lista de videos populares.
 */
export async function getPopularVideos(regionCode) {
  const response = await fetch(`${BASE_URL}/popular/${regionCode}`);
  if (!response.ok) {
    throw new Error(`Error al obtener los videos: ${response.statusText}`);
  }
  return response.json();
}
'@ | Set-Content "src/services/youtubeService.js"

# Archivo App.jsx
Write-Host "Creando App.jsx..."
@'
import React, { useState, useEffect } from "react";
import VideoList from "./components/VideoList";
import { getPopularVideos } from "./services/youtubeService";

function App() {
  const [videos, setVideos] = useState([]);
  const [regionCode, setRegionCode] = useState("US");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchVideos() {
      setLoading(true);
      setError(null);
      try {
        const data = await getPopularVideos(regionCode);
        setVideos(data.items);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchVideos();
  }, [regionCode]);

  return (
    <div className="App">
      <h1>Videos más populares</h1>
      <select onChange={(e) => setRegionCode(e.target.value)} value={regionCode}>
        <option value="US">Estados Unidos</option>
        <option value="MX">México</option>
        <option value="ES">España</option>
      </select>
      {loading && <p>Cargando...</p>}
      {error && <p>Error: {error}</p>}
      <VideoList videos={videos} />
    </div>
  );
}

export default App;
'@ | Set-Content "src/App.jsx"

# Archivo App.css
Write-Host "Creando App.css..."
@'
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 0;
  background-color: #f9f9f9;
}

.App {
  text-align: center;
  padding: 20px;
}

.video-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.video-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  width: 200px;
  background-color: #fff;
}

.video-card img {
  width: 100%;
  border-radius: 4px;
}

.video-card h3 {
  font-size: 1rem;
  margin: 10px 0;
}

.video-card p {
  color: #666;
  font-size: 0.9rem;
}
'@ | Set-Content "src/styles/App.css"

# Actualizar main.jsx
Write-Host "Actualizando main.jsx..."
@'
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
'@ | Set-Content "src/main.jsx"

Write-Host "¡Estructura del proyecto actualizada con éxito!"
Write-Host "Ejecuta 'npm run dev' para iniciar el servidor de desarrollo."
