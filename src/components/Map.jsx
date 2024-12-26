import { useRef, useEffect } from "react";
import PropTypes from "prop-types";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import "../styles/Map.css";
import { convertIsoA3ToIsoA2 } from "../utils/countryCodeConverter"; // Importar la utilidad

function Map({ onCountryClick }) {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    const mapInstance = new maplibregl.Map({
      container: mapContainerRef.current,
      style: "https://demotiles.maplibre.org/style.json",
      center: [0, 20],
      zoom: 1.5,
    });

    mapInstance.addControl(new maplibregl.NavigationControl(), "top-right");

    mapInstance.on("load", () => {
      mapInstance.addSource("countries", {
        type: "geojson",
        data: "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson",
      });

      mapInstance.addLayer({
        id: "countries-layer",
        type: "fill",
        source: "countries",
        paint: {
          "fill-color": "#888888",
          "fill-opacity": 0.4,
        },
      });

      mapInstance.on("click", "countries-layer", (e) => {
        const countryCodeIsoA3 = e.features[0].properties.ISO_A3;
        const countryCodeIsoA2 = convertIsoA3ToIsoA2(countryCodeIsoA3);
        onCountryClick(countryCodeIsoA2);
      });

      mapInstance.on("mouseenter", "countries-layer", () => {
        mapInstance.getCanvas().style.cursor = "pointer";
      });

      mapInstance.on("mouseleave", "countries-layer", () => {
        mapInstance.getCanvas().style.cursor = "";
      });
    });

    return () => mapInstance.remove();
  }, [onCountryClick]);

  return <div ref={mapContainerRef} className="map-container" />;
}

Map.propTypes = {
  onCountryClick: PropTypes.func.isRequired,
};

export default Map;
