import { useState } from "react";
import VideoList from "./components/VideoList";
import { getPopularVideos } from "./services/youtubeService";
import Globe from "./components/Globe";
import { convertIsoA3ToIsoA2 } from "./utils/countryCodeConverter";
import Starfield from "./components/starfield";
function App() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("");

  const handleCountryClick = async (countryISOA3, countryName) => {
    setSelectedCountry(countryISOA3);
    setLoading(true);
    setError(null);
    let countryCode = convertIsoA3ToIsoA2(countryISOA3);
    try {
      const data = await getPopularVideos(convertIsoA3ToIsoA2(countryCode));
      setVideos(data.items);
    } catch (err) {
      console.error("Error fetching videos:", err);
      setError(err.message || "Error al obtener los videos populares");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-black ">
      <Globe handleCountryClick={handleCountryClick}></Globe>
      <Starfield
        starCount={300}
        starColor={[255, 255, 255]}
        speedFactor={0.05}
        backgroundColor="black"
        className="-z-50 absolute"
      />
      <div className=" absolute right-0 top-0 max-h-screen overflow-y-scroll z-20">
        <VideoList
          videos={videos}
          selectedCountry={selectedCountry}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
}

export default App;
