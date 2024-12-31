import * as d3 from "d3";
import { useState, useEffect, useRef } from "react";
import { convertIsoA3ToIsoA2 } from "../utils/countryCodeConverter";

// 1) Helpers for spherical geometry
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
  // For an orthographic-like projection, the center is at (-λr, -φr).
  const dist = angle(lon, lat, -lambdaRotate, -phiRotate);
  return dist < 70;
}

// Main Globe component
const Globe = ({ handleCountryClick }) => {
  const [geoJson, setGeoJson] = useState(null);
  const [countries, setCountries] = useState(null);
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
    zoom: 1,
  });

  const svgRef = useRef();
  const svgGratRef = useRef();
  const dimensions = useRef({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Add resize handler
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

    handleResize(); // Set initial dimensions
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Load GeoJSON
  useEffect(() => {
    d3.json("/geojson/countries.json").then((data) => {
      setGeoJson(data);
    });
  }, []);

  // Update projection and attach interactions
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

    const countriesData = geoJson.features.map((feature) => ({
      ...feature,
      d: geoGenerator(feature),
      centroidLonLat: d3.geoCentroid(feature),
    }));

    setCountries(countriesData);

    const svg = d3.select(svgRef.current);

    // Drag behavior
    svg.call(
      d3.drag().on("drag", (event) => {
        setGlobeState((prev) => ({
          ...prev,
          rotateLambda: prev.rotateLambda + event.dx * 0.2,
          rotatePhi: Math.max(
            -90,
            Math.min(90, prev.rotatePhi - event.dy * 0.2)
          ),
        }));
      })
    );

    // Improved zoom behavior
    const zoom = d3
      .zoom()
      .scaleExtent([1, 12])
      .on("zoom", (event) => {
        setGlobeState((prev) => ({
          ...prev,
          zoom: event.transform.k,
        }));
      });

    svg.call(zoom);

    // Optional: Reset zoom on double click
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
  ]);

  // 4) Render the globe
  return (
    <svg
      ref={svgRef}
      width={window.innerWidth}
      height={window.innerHeight}
      className=" absolute z-10"
    >
      <circle
        cx={globeState.translateX}
        cy={globeState.translateY}
        r={globeState.scale * globeState.zoom}
        fill="darkblue"
        stroke="lightblue"
        strokeWidth="10"
        className="blur-sm "
      />

      {countries?.map((country, i) => {
        const { d, centroidLonLat } = country;
        const [lon, lat] = centroidLonLat; // in degrees

        // Check if on visible side:
        const visible = isVisible(lon, lat, [
          globeState.rotateLambda,
          globeState.rotatePhi,
          globeState.rotateGamma,
        ]);

        return (
          <g key={i} className="group relative">
            <path
              d={d}
              fill="darkgreen"
              stroke="white"
              strokeWidth="0.5"
              className="transition-colors z-10"
              onClick={() => {
                handleCountryClick(
                  country.properties.iso_a3,
                  country.properties.name
                );
                console.log(`Clicked on: ${country.properties.name}`);
              }}
              onMouseOver={(e) => {
                e.target.style.fill = "green";
              }}
              onMouseOut={(e) => {
                e.target.style.fill = "darkgreen";
              }}
            />
            {/* If visible, show the label. Otherwise, skip it. */}
            {visible && (
              <text
                fill="white"
                fontSize="13"
                textAnchor="middle"
                style={{ pointerEvents: "none" }}
                className={`absolute group-hover:opacity-100 group-hover:text-2xl transition-all duration-500  ${
                  globeState.zoom < 2 ? "opacity-0" : "opacity-100"
                }`}
                {...(() => {
                  // Project the [lon, lat] to get [x, y].
                  const projection = d3["geo" + globeState.type]()
                    .scale(globeState.scale * globeState.zoom)
                    .translate([globeState.translateX, globeState.translateY])
                    .center([globeState.centerLon, globeState.centerLat])
                    .rotate([
                      globeState.rotateLambda,
                      globeState.rotatePhi,
                      globeState.rotateGamma,
                    ]);
                  const [x, y] = projection(centroidLonLat);
                  return { x, y };
                })()}
              >
                {country?.properties?.name}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

export default Globe;
