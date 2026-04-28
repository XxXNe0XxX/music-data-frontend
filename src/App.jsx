import { useContext, useEffect, useState } from "react";
import ContentList from "./components/ContentList";
import { getPopularVideos } from "./services/youtubeService";
import Globe from "./components/Globe";
import Starfield from "./components/starfield";
import PlatformContext from "./context/PlatformProvider";
import { getPopularSongs } from "./services/spotifyServices";
import { getPopularMovies, getPopularShows } from "./services/netflixServices";
import { ThemeContext } from "./context/ThemeContext";
import { LuInfo } from "react-icons/lu";
import "./App.css";
function App() {
  const [youtubeData, setYoutubeData] = useState([]);
  const [spotifyData, setSpotifyData] = useState([]);
  const [netflixMoviesData, setNetflixMoviesData] = useState([]);
  const [netflixShowsData, setNetflixShowsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [showInfoPopup, setShowInfoPopup] = useState(false);
  const { currentPlatform } = useContext(PlatformContext);
  const { isDark } = useContext(ThemeContext);

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisited");
    if (!hasVisited) {
      setShowInfoPopup(true);
      localStorage.setItem("hasVisited", "true");
    }
  }, []);

  useEffect(() => {
    if (currentPlatform === "youtube" && selectedCountry) {
      const fetchYoutubeVideos = async () => {
        try {
          setError(null);
          setLoading(true);
          const data = await getPopularVideos(selectedCountry);
          setYoutubeData(data.items);
        } catch (err) {
          setError(err.message || "Failed to get popular videos");
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
          setSpotifyData(data);
        } catch (err) {
          setError(err.message || "Failed to get popular songs");
        } finally {
          setLoading(false);
        }
      };

      fetchSpotifySongs(selectedCountry);
    }
    if (currentPlatform === "netflixMovies" && selectedCountry) {
      const fetchNetflixMovies = async () => {
        try {
          setError(null);
          setLoading(true);
          const data = await getPopularMovies(selectedCountry);
          setNetflixMoviesData(data);
        } catch (err) {
          setError(err.message || "Failed to get popular movies");
        } finally {
          setLoading(false);
        }
      };

      fetchNetflixMovies(selectedCountry);
    }
    if (currentPlatform === "netflixShows" && selectedCountry) {
      const fetchNetflixShows = async () => {
        try {
          setError(null);
          setLoading(true);
          const data = await getPopularShows(selectedCountry);
          setNetflixShowsData(data);
        } catch (err) {
          setError(err.message || "Failed to get popular shows");
        } finally {
          setLoading(false);
        }
      };

      fetchNetflixShows(selectedCountry);
    }
  }, [selectedCountry, currentPlatform]);

  return (
    <div
      className={`relative text-sm md:text-base h-screen w-screen overflow-hidden dark:text-white text-black font-lexend `}
    >
      <Globe
        setSelectedCountry={setSelectedCountry}
        selectedCountry={selectedCountry}
      ></Globe>

      <Starfield starCount={100} speedFactor={0.2} className="-z-50 absolute" />
      <div className="absolute md:top-4 top-14 left-4 z-10">
        <button
          onClick={() => setShowInfoPopup(true)}
          className={`p-2 rounded-full transition-colors ${
            isDark
              ? "bg-gray-800 text-white hover:bg-gray-700"
              : "bg-white text-black hover:bg-gray-100"
          } shadow-lg`}
          aria-label="Show info"
        >
          <LuInfo size={20} />
        </button>
      </div>
      <div className=" absolute right-0 top-0 z-20">
        <ContentList
          content={
            currentPlatform === "youtube" && youtubeData
              ? youtubeData
              : currentPlatform === "spotify" && spotifyData
                ? spotifyData
                : currentPlatform === "netflixMovies" && netflixMoviesData
                  ? netflixMoviesData
                  : currentPlatform === "netflixShows" && netflixShowsData
                    ? netflixShowsData
                    : ""
          }
          selectedCountry={selectedCountry}
          loading={loading}
          error={error}
        />
      </div>
      {showInfoPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className={`p-6 rounded-lg max-w-md mx-4 ${isDark ? "bg-gray-800 text-white" : "bg-white text-black"} shadow-xl`}
          >
            <h2 className="text-xl font-bold mb-4">
              Welcome to International Tube
            </h2>
            <p className="mb-4">
              This app displays popular content from YouTube, Spotify, and
              Netflix based on the selected country. Click anywhere on the globe
              to start to explore trending music, videos, movies, and shows.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowInfoPopup(false)}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
