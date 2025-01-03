import * as d3 from "d3";
import { useState, useEffect, useRef } from "react";
import { convertIsoA3ToIsoA2 } from "../utils/countryCodeConverter";

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

const Globe = ({ handleCountryClick }) => {
  const [geoJson, setGeoJson] = useState(null);
  const [countries, setCountries] = useState([]);
  const [hoveredCountry, setHoveredCountry] = useState(null);

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
  const dimensions = useRef({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Resize effect
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
      .scaleExtent([1, 12])
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
  ]);

  return (
    <svg
      ref={svgRef}
      width={dimensions.current.width}
      height={dimensions.current.height}
      className="absolute z-10"
    >
      {/* Globe boundary circle */}
      <circle
        cx={globeState.translateX}
        cy={globeState.translateY}
        r={globeState.scale * globeState.zoom}
        fill="darkblue"
        stroke="lightblue"
        strokeWidth="20"
        className="blur-md"
      />

      {/* --- 1) Render country paths first --- */}
      <g className="countries">
        {countries.map((country, i) => {
          const { d, centroidLonLat } = country;
          return (
            <path
              key={i}
              d={d}
              fill="darkgreen"
              stroke="white"
              strokeWidth="0.5"
              className="transition-colors z-10"
              onClick={() => {
                // example callback
                handleCountryClick(
                  convertIsoA3ToIsoA2(country.properties.iso_a3),
                  country.properties.name
                );
                console.log(`Clicked on: ${country.properties.name}`);
              }}
              onMouseOver={(e) => {
                // Set hovered country in state
                e.target.style.fill = "green";
                setHoveredCountry(country);
              }}
              onMouseOut={(e) => {
                e.target.style.fill = "darkgreen";

                setHoveredCountry(null);
              }}
            />
          );
        })}
      </g>

      {/* 
         --- 2) Show text labels afterwards --- 
         We'll show *all* visible labels at once (like your previous approach), 
         plus we'll show a *hover label* that can be styled differently if desired.
      */}
      <g className="labels">
        {countries.map((country, i) => {
          const { centroidLonLat } = country;
          const [lon, lat] = centroidLonLat;

          // check if on visible hemisphere
          const visible = isVisible(lon, lat, [
            globeState.rotateLambda,
            globeState.rotatePhi,
            globeState.rotateGamma,
          ]);
          if (!visible) return null;

          // project to screen coords
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

          // We'll fade out the "normal" label if user is not zoomed in enough
          const textOpacity = globeState.zoom < 2 ? 0 : 1;

          return (
            <text
              key={i}
              x={x}
              y={y}
              fill="white"
              fontSize="14"
              textAnchor="middle"
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

      {/* 
          --- 3) Show a single "hover tooltip" label
          We'll display the hovered country name in a 
          different style, or near the centroid as well.
      */}
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

            // You can style this differently than the normal labels
            return (
              <text
                x={x}
                y={y}
                fill="yellow"
                fontSize="14"
                fontWeight=""
                textAnchor="middle"
                style={{
                  pointerEvents: "none",
                }}
              >
                {hoveredCountry.properties.name}
              </text>
            );
          })()}
        </g>
      )}
    </svg>
  );
};

export default Globe;
