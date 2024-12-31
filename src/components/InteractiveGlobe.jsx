import * as d3 from "d3";
import { useEffect, useState, useRef } from "react";
import { convertIsoA3ToIsoA2 } from "../utils/countryCodeConverter";

// Degrees-radians helpers
const radians = Math.PI / 180;
const degrees = 180 / Math.PI;

function angle(λ0, φ0, λ1, φ1) {
  λ0 *= radians;
  φ0 *= radians;
  λ1 *= radians;
  φ1 *= radians;

  const sinφ0 = Math.sin(φ0),
    sinφ1 = Math.sin(φ1);
  const cosφ0 = Math.cos(φ0),
    cosφ1 = Math.cos(φ1);
  const cosΔλ = Math.cos(λ0 - λ1);

  let c = sinφ0 * sinφ1 + cosφ0 * cosφ1 * cosΔλ;
  if (c > 1) c = 1; // floating precision
  return Math.acos(c) * degrees;
}

// Check if (lon, lat) is visible given the current rotate=[λr, φr, γ].
function isVisible(lon, lat, rotate) {
  const [lambdaRotate, phiRotate] = rotate;
  // The center of the projection is at (-lambdaRotate, -phiRotate).
  const dist = angle(lon, lat, -lambdaRotate, -phiRotate);
  return dist < 90; // < 90° → on front side of globe
}

function InteractiveGlobe({ handleCountryClick }) {
  const [countries, setCountries] = useState([]);
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const [globeState, setGlobeState] = useState({
    type: "Orthographic",
    scale: (window.innerWidth / window.innerHeight) * 200,
    translateX: window.innerWidth / 2,
    translateY: window.innerHeight / 2,
    centerLon: 0,
    centerLat: 0,
    rotateLambda: 0,
    rotatePhi: 0,
    rotateGamma: 0,
  });

  const svgRef = useRef();

  // Handle resizing
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      setGlobeState((prev) => ({
        ...prev,
        scale: (window.innerWidth / window.innerHeight) * 200,
        translateX: window.innerWidth / 2,
        translateY: window.innerHeight / 2,
      }));
    };

    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Load & draw
  useEffect(() => {
    d3.json("public/geojson/countries.json").then((geojson) => {
      // Create the projection
      const projection = d3["geo" + globeState.type]()
        .scale(globeState.scale)
        .translate([globeState.translateX, globeState.translateY])
        .center([globeState.centerLon, globeState.centerLat])
        .rotate([
          globeState.rotateLambda,
          globeState.rotatePhi,
          globeState.rotateGamma,
        ]);

      // Geo generator
      const geoGenerator = d3.geoPath().projection(projection);

      // Attach features
      const countriesData = geojson.features.map((feature) => ({
        ...feature,
        // Precompute the path
        d: geoGenerator(feature),
        // For labeling, store the raw geometry’s centroid in [lon, lat].
        // Note that d3.geoCentroid(feature) returns [lon, lat].
        centroidLonLat: d3.geoCentroid(feature),
      }));

      setCountries(countriesData);

      // Setup behaviors
      const svg = d3.select(svgRef.current);

      // DRAG to rotate
      svg.call(
        d3.drag().on("drag", (event) => {
          const dx = event.dx;
          const dy = event.dy;
          setGlobeState((prev) => ({
            ...prev,
            rotateLambda: prev.rotateLambda + dx * 0.2,
            rotatePhi: Math.max(-90, Math.min(90, prev.rotatePhi - dy * 0.2)),
          }));
        })
      );

      // ZOOM to scale
      const zoom = d3
        .zoom()
        .scaleExtent([0.5, 5])
        .on("zoom", (event) => {
          const newScale = globeState.scale * event.transform.k;
          setGlobeState((prev) => ({
            ...prev,
            scale: newScale,
          }));
        });
      svg.call(zoom);
    });
  }, [globeState]);

  return (
    <div className="w-full h-full flex justify-center items-center m-auto">
      <svg ref={svgRef} width={dimensions.width} height={dimensions.height}>
        {/* The circular boundary of the Orthographic projection */}
        <circle
          cx={globeState.translateX}
          cy={globeState.translateY}
          r={globeState.scale}
          fill="darkblue"
          stroke="gray"
          strokeWidth="10"
        />

        {/* Render each country */}
        {countries.map((country, i) => {
          const { d, centroidLonLat } = country;
          const [lon, lat] = centroidLonLat;

          // Check if the centroid is on the visible side
          const visible = isVisible(lon, lat, [
            globeState.rotateLambda,
            globeState.rotatePhi,
            globeState.rotateGamma,
          ]);

          return (
            <g key={i}>
              <path
                d={d}
                fill="green"
                stroke="white"
                strokeWidth="0.5"
                className="transition-colors"
                onClick={() => {
                  handleCountryClick(
                    convertIsoA3ToIsoA2(country.properties.iso_a3)
                  );
                  console.log(`Clicked on: ${country.properties.name}`);
                }}
                onMouseOver={(e) => {
                  e.target.style.fill = "red";
                }}
                onMouseOut={(e) => {
                  e.target.style.fill = "green";
                }}
              />
              {/* If visible, show text (centered at the projected position). 
                  For *labeling*, we do still need the [x, y] from the projection. 
                  But we only *render* if isVisible(...) is true. 
              */}
              {visible && (
                <text
                  // Project the country’s centroid to x,y
                  {...(() => {
                    const projection = d3["geo" + globeState.type]()
                      .scale(globeState.scale)
                      .translate([globeState.translateX, globeState.translateY])
                      .center([globeState.centerLon, globeState.centerLat])
                      .rotate([
                        globeState.rotateLambda,
                        globeState.rotatePhi,
                        globeState.rotateGamma,
                      ]);
                    const point = projection(centroidLonLat);
                    return { x: point[0], y: point[1] };
                  })()}
                  textAnchor="middle"
                  fontSize="10px"
                  fill="white"
                  style={{ pointerEvents: "none" }}
                >
                  {country.properties.name}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default InteractiveGlobe;
