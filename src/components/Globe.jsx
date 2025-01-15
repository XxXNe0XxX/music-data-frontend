import * as d3 from "d3";
import { useState, useEffect, useRef, useContext } from "react";
import { convertIsoA3ToIsoA2 } from "../utils/countryCodeConverter";
import { LuTurtle, LuRabbit } from "react-icons/lu";
import { FaSearch, FaSpotify, FaYoutube } from "react-icons/fa";
import PlatformContext from "../context/PlatformProvider";
import { ThemeContext } from "../context/ThemeContext";
import CountrySearch from "./CountrySearch";
import {
  FaLocationPin,
  FaLocationPinLock,
  FaMapLocation,
  FaMapLocationDot,
} from "react-icons/fa6";
import { IoLocationOutline } from "react-icons/io5";
// Spherical geometry helpers for “isVisible”
const radians = Math.PI / 180;
const degrees = 180 / Math.PI;

function angle(lambda0, phi0, lambda1, phi1) {
  lambda0 *= radians;
  phi0 *= radians;
  lambda1 *= radians;
  phi1 *= radians;

  const sinPhi0 = Math.sin(phi0),
    sinPhi1 = Math.sin(phi1);
  const cosPhi0 = Math.cos(phi0),
    cosPhi1 = Math.cos(phi1);
  const cosDeltaLambda = Math.cos(lambda0 - lambda1);

  let c = sinPhi0 * sinPhi1 + cosPhi0 * cosPhi1 * cosDeltaLambda;
  if (c > 1) c = 1; // numerical fix
  return Math.acos(c) * degrees; // spherical distance in degrees
}

function isVisible(lon, lat, [lambdaRotate, phiRotate, gamma]) {
  // For Orthographic, “front” if angle < 90° (the horizon).
  const dist = angle(lon, lat, -lambdaRotate, -phiRotate);
  return dist < 90;
}

const Globe = ({ setSelectedCountry, selectedCountry }) => {
  const [geoJson, setGeoJson] = useState(null);
  const [countries, setCountries] = useState([]);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [grat, setGrat] = useState("");
  const { currentPlatform } = useContext(PlatformContext);
  const { isDark } = useContext(ThemeContext);

  // Our globe state
  const [globeState, setGlobeState] = useState({
    type: "Orthographic",
    scale: 400,
    translateX: window.innerWidth / 2,
    translateY: window.innerHeight / 2,
    centerLon: 0,
    centerLat: 0,
    rotateLambda: 0,
    rotatePhi: 0,
    rotateGamma: 0,
    zoom: 0.6,
    rotationSpeed: 0.07,
    autoRotate: true,
  });

  const svgRef = useRef(null);
  const dimensions = useRef({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // For multi-touch
  const pointersRef = useRef({});
  const initialPinchZoomRef = useRef({
    distance: 0,
    zoom: 1,
  });

  const lastPointerPosRef = useRef({ x: 0, y: 0 }); // for single-finger drag
  function centerOnCountry(lon, lat) {
    setGlobeState((prev) => ({
      ...prev,
      autoRotate: false, // Disable auto-rotate during centering
    }));

    const startLambda = globeState.rotateLambda;
    const startPhi = globeState.rotatePhi;

    const targetLambda = -lon;
    const targetPhi = -lat;

    const duration = 1000; // Transition duration in ms

    // Smoothly interpolate rotation
    const interpolate = d3.interpolate(
      { lambda: startLambda, phi: startPhi },
      { lambda: targetLambda, phi: targetPhi }
    );

    d3.transition()
      .duration(duration)
      .tween("rotate", () => (t) => {
        const { lambda, phi } = interpolate(t);
        setGlobeState((prev) => ({
          ...prev,
          rotateLambda: lambda,
          rotatePhi: phi,
        }));
      });
  }

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      dimensions.current = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      // Compute the diameter
      const diameter = 2 * globeState.scale * 0.5;
      const extraSpace = 500;
      let newTranslateX;
      if (diameter + extraSpace < window.innerWidth) {
        newTranslateX = window.innerWidth / 3;
      } else {
        newTranslateX = window.innerWidth / 2;
      }

      setGlobeState((prev) => ({
        ...prev,
        translateX: newTranslateX,
      }));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [globeState.scale, globeState.zoom]);

  // Load GeoJSON once
  useEffect(() => {
    d3.json("/geojson/countries.json").then((data) => {
      setGeoJson(data);
    });
  }, []);

  // Auto-rotate effect
  useEffect(() => {
    if (!globeState.autoRotate) return;
    const rotationTimer = d3.timer(() => {
      setGlobeState((prev) => ({
        ...prev,
        rotateLambda: prev.rotateLambda + prev.rotationSpeed,
      }));
    });
    return () => rotationTimer.stop();
  }, [globeState.autoRotate, globeState.rotationSpeed]);

  // Recompute paths whenever geoJson or globeState changes
  useEffect(() => {
    if (!geoJson) return;

    const projection = d3["geo" + globeState.type]()
      .scale(globeState.scale * globeState.zoom)
      .translate([globeState.translateX, globeState.translateY])
      .center([globeState.centerLon, globeState.centerLat])
      .rotate([
        globeState.rotateLambda,
        globeState.rotatePhi,
        globeState.rotateGamma,
      ]);

    const geoGenerator = d3.geoPath().projection(projection);

    // Graticule
    const graticule = d3.geoGraticule10();
    setGrat(geoGenerator(graticule));

    // Countries
    const countriesData = geoJson.features.map((feature) => ({
      ...feature,
      d: geoGenerator(feature),
      centroidLonLat: d3.geoCentroid(feature),
    }));
    setCountries(countriesData);
  }, [
    geoJson,
    globeState.zoom,
    globeState.rotateLambda,
    globeState.rotatePhi,
    globeState.translateX,
    globeState.translateY,
    globeState.type,
    globeState.centerLon,
    globeState.centerLat,
    globeState.rotateGamma,
    globeState.scale,
  ]);

  /*****************************************************************
   * Pointer (touch + mouse) event handling
   *****************************************************************/
  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    // Prevent default gestures on mobile
    svgEl.style.touchAction = "none";

    const handlePointerDown = (e) => {
      e.preventDefault();
      // If the user touches, we disable auto-rotate
      setGlobeState((prev) => ({ ...prev, autoRotate: false }));

      // Store pointer in our ref
      pointersRef.current[e.pointerId] = {
        x: e.clientX,
        y: e.clientY,
      };

      const pointerCount = Object.keys(pointersRef.current).length;
      if (pointerCount === 1) {
        // Single-finger drag start
        lastPointerPosRef.current = { x: e.clientX, y: e.clientY };
      } else if (pointerCount === 2) {
        // If second finger is placed, set up pinch-zoom baseline
        const [p1, p2] = Object.values(pointersRef.current);
        const dist = distanceBetweenPoints(p1, p2);
        initialPinchZoomRef.current = {
          distance: dist,
          zoom: globeState.zoom,
        };
      }
    };

    const handlePointerMove = (e) => {
      e.preventDefault();
      if (!pointersRef.current[e.pointerId]) return;

      // Update pointer position
      pointersRef.current[e.pointerId] = {
        x: e.clientX,
        y: e.clientY,
      };

      const pointerIds = Object.keys(pointersRef.current);
      if (pointerIds.length === 1) {
        // Single pointer => rotate
        const pointer = pointersRef.current[pointerIds[0]];
        const dx = pointer.x - lastPointerPosRef.current.x;
        const dy = pointer.y - lastPointerPosRef.current.y;

        setGlobeState((prev) => ({
          ...prev,
          rotateLambda: prev.rotateLambda + dx * 0.2,
          rotatePhi: clampPhi(prev.rotatePhi - dy * 0.2),
        }));

        lastPointerPosRef.current = { x: pointer.x, y: pointer.y };
      } else if (pointerIds.length === 2) {
        // Two pointers => pinch to zoom
        const [p1, p2] = pointerIds.map((id) => pointersRef.current[id]);
        const newDist = distanceBetweenPoints(p1, p2);
        const { distance: oldDist, zoom: oldZoom } =
          initialPinchZoomRef.current;

        const scaleRatio = newDist / oldDist;
        const newZoom = Math.max(0.5, Math.min(10, oldZoom * scaleRatio));

        setGlobeState((prev) => ({
          ...prev,
          zoom: newZoom,
        }));
      }
    };

    const handlePointerUpOrCancel = (e) => {
      e.preventDefault();
      delete pointersRef.current[e.pointerId];
    };

    svgEl.addEventListener("pointerdown", handlePointerDown);
    svgEl.addEventListener("pointermove", handlePointerMove);
    svgEl.addEventListener("pointerup", handlePointerUpOrCancel);
    svgEl.addEventListener("pointercancel", handlePointerUpOrCancel);
    svgEl.addEventListener("pointerleave", handlePointerUpOrCancel);

    return () => {
      svgEl.removeEventListener("pointerdown", handlePointerDown);
      svgEl.removeEventListener("pointermove", handlePointerMove);
      svgEl.removeEventListener("pointerup", handlePointerUpOrCancel);
      svgEl.removeEventListener("pointercancel", handlePointerUpOrCancel);
      svgEl.removeEventListener("pointerleave", handlePointerUpOrCancel);
    };
  }, [globeState.zoom]); // re-run if globeState.zoom changes
  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    function handleWheel(e) {
      e.preventDefault();
      // Positive deltaY => scroll down => zoom out
      // Negative deltaY => scroll up => zoom in
      const direction = e.deltaY > 0 ? -1 : 1;
      const zoomFactor = 0.05;

      setGlobeState((prev) => {
        const newZoom = clampZoom(prev.zoom + direction * zoomFactor);
        return { ...prev, zoom: newZoom };
      });
    }

    // Attach the wheel listener
    svgEl.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      svgEl.removeEventListener("wheel", handleWheel);
    };
  }, []);

  // Helper to clamp zoom
  function clampZoom(value) {
    return Math.max(0.5, Math.min(10, value));
  }
  // Helper: distance between points
  const distanceBetweenPoints = (p1, p2) => {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Helper: clamp latitude rotation between -90 and 90
  const clampPhi = (phi) => Math.max(-90, Math.min(90, phi));

  // Optional button for toggling rotation
  const toggleRotation = () => {
    setGlobeState((prev) => ({
      ...prev,
      autoRotate: !prev.autoRotate,
    }));
  };

  return (
    <>
      <div className="absolute flex md:w-fit md:h-fit h-full w-full md:items-center items-start  max-w-screen px-4 py-2 dark:border-gray-600 border-t md:border-r border-b top-[100vh] -translate-y-[90px]  md:rounded-r-3xl z-50  md:bg-opacity-20 md:backdrop-blur-sm bg-white dark:bg-black">
        <div className="flex items-center space-x-3 flex-wrap justify-start flex-grow">
          <CountrySearch
            countries={countries}
            onSelectCountry={(country) => {
              const [lon, lat] = country.centroidLonLat;
              centerOnCountry(lon, lat);
              // Optionally also setSelectedCountry if desired
              setSelectedCountry(
                convertIsoA3ToIsoA2(country.properties.iso_a3)
              );
            }}
          />
          <button
            onClick={toggleRotation}
            className=" opacity-70 hover:opacity-100 transition-opacity text-nowrap"
          >
            {globeState.autoRotate ? "Detener" : "Rotar"}
          </button>
          <button
            className=" opacity-70 hover:opacity-100 transition-opacity text-2xl"
            onClick={() => {
              // Slow rotation
              setGlobeState((prev) => ({
                ...prev,
                rotationSpeed: 0.03,
              }));
              // If autoRotate is off, turn it on
              if (!globeState.autoRotate) toggleRotation();
            }}
          >
            <LuTurtle />
          </button>
          <button
            className="rounded-md opacity-70 hover:opacity-100 transition-opacity text-2xl"
            onClick={() => {
              // Fast rotation
              setGlobeState((prev) => ({
                ...prev,
                rotationSpeed: 0.5,
              }));
              // If autoRotate is off, turn it on
              if (!globeState.autoRotate) toggleRotation();
            }}
          >
            <LuRabbit />
          </button>
        </div>
      </div>

      <svg
        ref={svgRef}
        width={dimensions.current.width}
        height={dimensions.current.height}
        className="absolute z-10"
      >
        {/* Graticule path */}
        <path
          strokeWidth="0.2"
          stroke={isDark ? "lightgray" : "gray"}
          d={grat}
          fill="transparent"
        ></path>

        {/* Platform icon in center (optional) */}
        {currentPlatform === "youtube" ? (
          <FaYoutube
            size={globeState.zoom * 200}
            x={globeState.translateX - 100 * globeState.zoom}
            y={globeState.translateY - 100 * globeState.zoom}
            className="text-red-700 opacity-80"
          />
        ) : currentPlatform === "spotify" ? (
          <FaSpotify
            size={globeState.zoom * 200}
            x={globeState.translateX - 100 * globeState.zoom}
            y={globeState.translateY - 100 * globeState.zoom}
            className="text-green-700 opacity-80"
          />
        ) : null}

        {/* Glow-ish boundary circle */}
        <circle
          cx={globeState.translateX}
          cy={globeState.translateY}
          r={globeState.scale * globeState.zoom * 1.03}
          stroke={isDark ? "lightblue" : "gray"}
          fill={isDark ? "black" : "white"}
          strokeWidth="5"
          className="blur-md"
          fillOpacity="0.5"
        />

        {/* Countries */}
        <g className="countries">
          {countries.map((country, i) => {
            const { d } = country;
            return (
              <path
                key={i}
                d={d}
                fill={isDark ? "#1d447e" : "lightblue"}
                stroke={isDark ? "black" : "white"}
                strokeWidth="1"
                className={`transition-colors z-10 ${
                  convertIsoA3ToIsoA2(country.properties.iso_a3) ===
                  selectedCountry
                    ? "flowing-dashed"
                    : ""
                } ${
                  hoveredCountry &&
                  hoveredCountry.properties.iso_a3 === country.properties.iso_a3
                    ? "flowing-dashed"
                    : ""
                }`}
                onClick={() => {
                  setSelectedCountry(
                    convertIsoA3ToIsoA2(country.properties.iso_a3)
                  );
                }}
                onMouseOver={() => setHoveredCountry(country)}
                onMouseOut={() => setHoveredCountry(null)}
              />
            );
          })}
        </g>

        {/* Label all visible countries if zoom >= 2 */}
        <g className="labels">
          {countries.map((country, i) => {
            const { centroidLonLat } = country;
            const [lon, lat] = centroidLonLat;
            const visible = isVisible(lon, lat, [
              globeState.rotateLambda,
              globeState.rotatePhi,
              globeState.rotateGamma,
            ]);
            if (!visible) return null;

            const projection = d3["geo" + globeState.type]()
              .scale(globeState.scale * globeState.zoom)
              .translate([globeState.translateX, globeState.translateY])
              .center([globeState.centerLon, globeState.centerLat])
              .rotate([
                globeState.rotateLambda,
                globeState.rotatePhi,
                globeState.rotateGamma,
              ]);

            const point = projection(centroidLonLat);
            if (!point) return null;
            const [x, y] = point;

            const textOpacity = globeState.zoom < 2 ? 0 : 1;

            return (
              <text
                key={i}
                x={x}
                y={y}
                fill={isDark ? "white" : "#4e4e4e"}
                fontSize="14"
                textAnchor="middle"
                style={{
                  pointerEvents: "none",
                  opacity: textOpacity,
                  transition: "opacity 0.3s ease",
                  fontWeight: "bold",
                }}
              >
                {country.properties.name}
              </text>
            );
          })}
        </g>

        {/* Hover label (fallback if zoom < 2) */}
        {hoveredCountry && (
          <g className="hover-label">
            {(() => {
              const { centroidLonLat } = hoveredCountry;
              const projection = d3["geo" + globeState.type]()
                .scale(globeState.scale * globeState.zoom)
                .translate([globeState.translateX, globeState.translateY])
                .center([globeState.centerLon, globeState.centerLat])
                .rotate([
                  globeState.rotateLambda,
                  globeState.rotatePhi,
                  globeState.rotateGamma,
                ]);
              const point = projection(centroidLonLat);
              if (!point) return null;
              const [x, y] = point;

              return (
                <text
                  x={x}
                  y={y}
                  fill={isDark ? "white" : "#4e4e4e"}
                  fontSize="14"
                  textAnchor="middle"
                  style={{
                    pointerEvents: "none",
                    fontWeight: "bold",
                  }}
                >
                  {hoveredCountry.properties.name}
                </text>
              );
            })()}
          </g>
        )}
      </svg>
    </>
  );
};

export default Globe;
