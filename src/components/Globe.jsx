import * as d3 from "d3";
import { useState, useEffect, useRef, useContext } from "react";
import { convertIsoA3ToIsoA2 } from "../utils/countryCodeConverter";
import { LuTurtle } from "react-icons/lu";
import { LuRabbit } from "react-icons/lu";
import { FaSpotify } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa";
import PlatformContext from "../context/PlatformProvider";

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

const Globe = ({ setSelectedCountry }) => {
  const [geoJson, setGeoJson] = useState(null);
  const [countries, setCountries] = useState([]);
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [grat, setGrat] = useState("");
  const { currentPlatform } = useContext(PlatformContext);
  // 1) Add rotationSpeed & autoRotate
  const [globeState, setGlobeState] = useState({
    type: "Orthographic",
    scale: 400,
    translateX: 0,
    translateY: 0,
    centerLon: 0,
    centerLat: 0,
    rotateLambda: 0,
    rotatePhi: 0,
    rotateGamma: 0,
    zoom: 0.6,
    rotationSpeed: 0.07,
    autoRotate: true,
  });

  const svgRef = useRef();
  const dimensions = useRef({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      dimensions.current = {
        width: window.innerWidth,
        height: window.innerHeight,
      };
      setGlobeState((prev) => ({
        ...prev,
        translateX: window.innerWidth / 2,
        translateY: window.innerHeight / 2,
      }));
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load GeoJSON once
  useEffect(() => {
    d3.json("/geojson/countries.json").then((data) => {
      setGeoJson(data);
    });
  }, []);

  // 2) Auto-rotate effect
  // useEffect(() => {
  //   if (!globeState.autoRotate) return;

  //   const rotationTimer = d3.timer((elapsed) => {
  //     // ...
  //     setGlobeState((prev) => ({
  //       ...prev,
  //       rotateLambda: prev.rotateLambda + prev.rotationSpeed,
  //     }));
  //   });

  //   return () => rotationTimer.stop();
  //   // ONLY re-run if autoRotate toggles from false->true
  // }, [globeState.autoRotate]);

  // Recompute paths + attach interactions
  useEffect(() => {
    if (!geoJson || !svgRef.current) return;

    const projection = d3["geo" + globeState.type]()
      .scale(globeState.scale * globeState.zoom)
      .translate([dimensions.current.width / 2, dimensions.current.height / 2])
      .center([globeState.centerLon, globeState.centerLat])
      .rotate([
        globeState.rotateLambda,
        globeState.rotatePhi,
        globeState.rotateGamma,
      ]);

    const geoGenerator = d3.geoPath().projection(projection);
    const graticule = d3.geoGraticule10();
    setGrat(geoGenerator(graticule));

    const countriesData = geoJson.features.map((feature) => ({
      ...feature,
      d: geoGenerator(feature),
      centroidLonLat: d3.geoCentroid(feature),
    }));
    setCountries(countriesData);

    const svg = d3.select(svgRef.current);

    // Drag to rotate
    svg.call(
      d3.drag().on("drag", (event) => {
        setGlobeState((prev) => ({
          ...prev,
          // If the user drags, it overrides auto rotation
          autoRotate: false,
          rotateLambda: prev.rotateLambda + event.dx * 0.2,
          rotatePhi: Math.max(
            -90,
            Math.min(90, prev.rotatePhi - event.dy * 0.2)
          ),
        }));
      })
    );

    // Zoom to scale
    const zoom = d3
      .zoom()
      .scaleExtent([0.5, 10])
      .on("zoom", (event) => {
        setGlobeState((prev) => ({
          ...prev,
          zoom: event.transform.k,
        }));
      });

    svg.call(zoom);

    // Double-click reset
    svg.on("dblclick.zoom", null);
    svg.on("dblclick", () => {
      svg.transition().duration(750).call(zoom.transform, d3.zoomIdentity);
    });
  }, [
    geoJson,
    globeState.zoom,
    globeState.rotateLambda,
    globeState.rotatePhi,
    globeState.translateX,
    globeState.translateY,
    // If you want to re-project on auto rotation changes, add it too:
    // globeState.autoRotate,
  ]);

  // Optional button for toggling rotation
  const toggleRotation = () => {
    return setGlobeState((prev) => ({
      ...prev,
      autoRotate: !prev.autoRotate,
    }));
  };

  return (
    <>
      {/* A toggle button to start/stop rotation (optional) */}
      <div className="absolute z-20 flex items-center space-x-3 max-w-screen w-screen pl-2 top-[95vh]">
        <button
          onClick={toggleRotation}
          className=" rounded-md opacity-70 hover:opacity-100 transition-opacity  "
        >
          {globeState.autoRotate ? "Stop Rotation" : "Start Rotation"}
        </button>
        <button
          className="rounded-md opacity-70 hover:opacity-100 transition-opacity text-2xl  "
          onClick={() => {
            setGlobeState((prev) => ({
              ...prev,
              rotationSpeed: 0.03,
            }));
            return !globeState.autoRotate && toggleRotation();
          }}
        >
          <LuTurtle />
        </button>
        <button
          className="rounded-md opacity-70 hover:opacity-100 transition-opacity text-2xl  "
          onClick={() => {
            setGlobeState((prev) => ({
              ...prev,
              rotationSpeed: 0.5,
            }));
            return !globeState.autoRotate && toggleRotation();
          }}
        >
          <LuRabbit />
        </button>
      </div>

      <svg
        ref={svgRef}
        width={dimensions.current.width}
        height={dimensions.current.height}
        className="absolute z-10"
      >
        {/* Graticule path */}
        <path strokeWidth="0.2" stroke="white" fill="" d={grat}></path>
        {currentPlatform === "youtube" ? (
          <FaYoutube
            onClick={() => console.log(this)}
            size={globeState.zoom * 200}
            // size={(globeState.scale * globeState.zoom) / 4}
            x={globeState.translateX - 100 * globeState.zoom}
            y={globeState.translateY - 100 * globeState.zoom}
            className="text-red-700 opacity-40"
          ></FaYoutube>
        ) : currentPlatform === "spotify" ? (
          <FaSpotify
            onClick={() => console.log(this)}
            size={globeState.zoom * 200}
            // size={(globeState.scale * globeState.zoom) / 4}
            x={globeState.translateX - 100 * globeState.zoom}
            y={globeState.translateY - 100 * globeState.zoom}
            className="text-green-700 opacity-40"
          ></FaSpotify>
        ) : (
          ""
        )}
        <circle
          cx={globeState.translateX}
          cy={globeState.translateY}
          r={globeState.scale * globeState.zoom * 1.03}
          fill="white"
          stroke="lightblue"
          strokeWidth="5"
          className="blur-md "
          fillOpacity="0.05"
        />
        {/* Glow-ish boundary circle */}

        {/* Countries */}
        <g className="countries">
          {countries.map((country, i) => {
            const { d } = country;
            return (
              <path
                key={i}
                d={d}
                fill="#1d447e"
                stroke="black"
                strokeWidth="1"
                className="transition-colors z-10"
                onClick={() => {
                  setSelectedCountry(
                    convertIsoA3ToIsoA2(country.properties.iso_a3)
                  );
                  return console.log(`Clicked on: ${country.properties.name}`);
                }}
                onMouseOver={(e) => {
                  e.target.style.fill = "#275cad";
                  return setHoveredCountry(country);
                }}
                onMouseOut={(e) => {
                  e.target.style.fill = "#1d447e";
                  return setHoveredCountry(null);
                }}
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

            // fade out if zoom < 2
            const textOpacity = globeState.zoom < 2 ? 0 : 1;

            return (
              <text
                key={i}
                x={x}
                y={y}
                fill="white"
                fontSize="14"
                textAnchor="middle"
                className="drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]"
                style={{
                  pointerEvents: "none",
                  opacity: textOpacity,
                  transition: "opacity 0.3s ease",
                }}
              >
                {country.properties.name}
              </text>
            );
          })}
        </g>

        {/* Hover label */}
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
                  fill="white"
                  fontSize="14"
                  textAnchor="middle"
                  style={{ pointerEvents: "none" }}
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
