import { useState } from "react";
import Map from "./components/Map";
import VideoList from "./components/VideoList";
import { getPopularVideos } from "./services/youtubeService";
import "./styles/App.css";

function App() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("");

  const handleCountryClick = async (countryCode) => {
    setSelectedCountry(countryCode);
    setLoading(true);
    setError(null);
    try {
      const data = await getPopularVideos(countryCode);
      setVideos(data.items);
    } catch (err) {
      console.error("Error fetching videos:", err);
      setError(err.message || "Error al obtener los videos populares");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="map-container">
        <Map onCountryClick={handleCountryClick} />
      </div>
      <div className="video-panel">
        <h2>Videos Populares</h2>
        {selectedCountry && <p>País seleccionado: {selectedCountry}</p>}
        {loading && <p>Cargando videos...</p>}
        {error && <p>{error}</p>}
        <VideoList videos={videos} />
      </div>
    </div>
  );
}

export default App;
