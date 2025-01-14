import { useContext, useEffect, useState } from "react";
import ContentList from "./components/ContentList";
import { getPopularVideos } from "./services/youtubeService";
import Globe from "./components/Globe";
import Starfield from "./components/starfield";
import PlatformContext from "./context/PlatformProvider";
import { getPopularSongs } from "./services/spotifyServices";
import "./App.css";
function App() {
  const [youtubeData, setYoutubeData] = useState([]);
  const [spotifyData, setSpotifyData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const { currentPlatform } = useContext(PlatformContext);

  useEffect(() => {
    if (currentPlatform === "youtube" && selectedCountry) {
      const fetchYoutubeVideos = async () => {
        try {
          setError(null);
          setLoading(true);
          const data = await getPopularVideos(selectedCountry);
          setYoutubeData(data.items);
        } catch (err) {
          setError(err.message || "Error al obtener los videos populares");
        } finally {
          setLoading(false);
        }
      };
      fetchYoutubeVideos();
    }

    if (currentPlatform === "spotify" && selectedCountry) {
      const fetchSpotifySongs = async () => {
        try {
          setError(null);
          setLoading(true);
          const data = await getPopularSongs(selectedCountry);
          setSpotifyData(data.tracks.items);
        } catch (err) {
          setError(err.message || "Error al obtener las canciones populares");
        } finally {
          setLoading(false);
        }
      };

      fetchSpotifySongs(selectedCountry);
    }
  }, [selectedCountry, currentPlatform]);

  return (
    <div
      className={`relative text-sm md:text-base h-screen w-screen overflow-hidden dark:text-white text-black font-lexend `}
    >
      <Globe setSelectedCountry={setSelectedCountry}></Globe>
      <Starfield
        starCount={200}
        speedFactor={0.009}
        className="-z-50 absolute"
      />
      <div className=" absolute right-0 top-0 z-20">
        <ContentList
          content={
            currentPlatform === "youtube" && youtubeData
              ? youtubeData
              : currentPlatform === "spotify" && spotifyData
              ? spotifyData
              : ""
          }
          selectedCountry={selectedCountry}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
}

export default App;
