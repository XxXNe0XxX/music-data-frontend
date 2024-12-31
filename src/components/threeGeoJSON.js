import * as THREE from "three";
// Make sure these imports match where you have them in your project:
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry.js";
import { Line2 } from "three/examples/jsm/lines/Line2.js";

/**
 * drawThreeGeo
 * Renders GeoJSON geometry onto a 3D sphere.
 *
 * @param {Object}   params
 * @param {Object}   params.json               - GeoJSON data (FeatureCollection or single Geometry)
 * @param {number}   params.radius             - Radius of the sphere
 * @param {Object}   [params.materialOptions]  - Options for line & point materials
 * @param {number}   [params.materialOptions.rendererWidth]  - Required for LineMaterial resolution
 * @param {number}   [params.materialOptions.rendererHeight] - Required for LineMaterial resolution
 * @param {number}   [params.materialOptions.color=0xffffff] - Default color for lines/points
 * @param {boolean}  [params.materialOptions.dashed=false]   - Whether lines are dashed
 * @param {number}   [params.materialOptions.linewidth=2]    - Thickness of lines
 * @param {number}   [params.materialOptions.size=2]         - Particle size (for Point geometries)
 *
 * @returns {THREE.Object3D} container - An Object3D holding the drawn lines/points
 */
export function drawThreeGeo({ json, radius, materialOptions = {} }) {
  const container = new THREE.Object3D();

  container.userData.update = (t) => {
    // If you animate dashOffset or something else, you can call userData.update on each child
    for (let i = 0; i < container.children.length; i++) {
      container.children[i].userData.update?.(t);
    }
  };

  // Optional rotation to match your coordinate system
  container.rotation.x = -Math.PI * 0.5;

  // Temporary arrays for building lines/points
  const x_values = [];
  const y_values = [];
  const z_values = [];

  // Convert the GeoJSON into an array of geometry objects
  const geoArray = createGeometryArray(json);

  for (let i = 0; i < geoArray.length; i++) {
    const geometry = geoArray[i];
    if (!geometry) continue;

    // `_props` holds the feature's properties (like country name)
    const props = geometry._props || {};

    switch (geometry.type) {
      case "Point":
        convertToSphereCoords(geometry.coordinates, radius);
        drawParticle(
          x_values[0],
          y_values[0],
          z_values[0],
          materialOptions,
          props
        );
        break;

      case "MultiPoint":
        for (let j = 0; j < geometry.coordinates.length; j++) {
          convertToSphereCoords(geometry.coordinates[j], radius);
          drawParticle(
            x_values[0],
            y_values[0],
            z_values[0],
            materialOptions,
            props
          );
        }
        break;

      case "LineString": {
        const coords = createInterpolatedCoordArray(geometry.coordinates);
        for (let j = 0; j < coords.length; j++) {
          convertToSphereCoords(coords[j], radius);
        }
        drawLine(x_values, y_values, z_values, materialOptions, props);
        break;
      }

      case "MultiLineString":
        for (let j = 0; j < geometry.coordinates.length; j++) {
          const coords = createInterpolatedCoordArray(geometry.coordinates[j]);
          for (let k = 0; k < coords.length; k++) {
            convertToSphereCoords(coords[k], radius);
          }
          drawLine(x_values, y_values, z_values, materialOptions, props);
        }
        break;

      case "Polygon":
        for (let j = 0; j < geometry.coordinates.length; j++) {
          const coords = createInterpolatedCoordArray(geometry.coordinates[j]);
          for (let k = 0; k < coords.length; k++) {
            convertToSphereCoords(coords[k], radius);
          }
          drawLine(x_values, y_values, z_values, materialOptions, props);
        }
        break;

      case "MultiPolygon":
        for (let j = 0; j < geometry.coordinates.length; j++) {
          // geometry.coordinates[j] is an array of polygon rings
          for (let k = 0; k < geometry.coordinates[j].length; k++) {
            const coords = createInterpolatedCoordArray(
              geometry.coordinates[j][k]
            );
            for (let m = 0; m < coords.length; m++) {
              convertToSphereCoords(coords[m], radius);
            }
            drawLine(x_values, y_values, z_values, materialOptions, props);
          }
        }
        break;

      default:
        console.warn("Unsupported geometry type:", geometry.type);
        break;
    }
  }

  /**
   * Convert the GeoJSON into an array of geometry objects, attaching
   * each Feature's properties in `geometry._props`.
   */
  function createGeometryArray(geojson) {
    const geometryArray = [];

    if (geojson.type === "Feature") {
      const geom = geojson.geometry;
      geom._props = geojson.properties || {};
      geometryArray.push(geom);
    } else if (geojson.type === "FeatureCollection") {
      for (let i = 0; i < geojson.features.length; i++) {
        const feature = geojson.features[i];
        if (!feature.geometry) continue;
        const geom = feature.geometry;
        // Attach feature.properties so we can get "name" or any other field
        geom._props = feature.properties || {};
        geometryArray.push(geom);
      }
    } else if (geojson.type === "GeometryCollection") {
      for (let i = 0; i < geojson.geometries.length; i++) {
        const geom = geojson.geometries[i];
        geom._props = {};
        geometryArray.push(geom);
      }
    } else if (geojson.type && geojson.coordinates) {
      // Single geometry
      geojson._props = {};
      geometryArray.push(geojson);
    } else {
      throw new Error("Invalid or unsupported GeoJSON format.");
    }

    return geometryArray;
  }

  /**
   * We subdivide large lat/lon gaps so lines don't cross the interior of the sphere.
   */
  function createInterpolatedCoordArray(coordinates) {
    const tempArray = [];
    let interpArray = [];

    for (let i = 0; i < coordinates.length; i++) {
      const point1 = coordinates[i];
      const point2 = coordinates[i - 1];

      if (i > 0) {
        if (needsInterpolation(point2, point1)) {
          interpArray = [point2, point1];
          interpArray = interpolatePoints(interpArray);
          for (let j = 0; j < interpArray.length; j++) {
            tempArray.push(interpArray[j]);
          }
        } else {
          tempArray.push(point1);
        }
      } else {
        tempArray.push(point1);
      }
    }
    return tempArray;
  }

  function needsInterpolation(p1, p2) {
    if (!p1 || !p2) return false;
    const lonDist = Math.abs(p1[0] - p2[0]);
    const latDist = Math.abs(p1[1] - p2[1]);
    // If the distance is > 5°, we subdivide
    return lonDist > 5 || latDist > 5;
  }

  function interpolatePoints(points) {
    let tempArray = [];
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      if (needsInterpolation(p1, p2)) {
        tempArray.push(p1);
        tempArray.push(getMidpoint(p1, p2));
      } else {
        tempArray.push(p1);
      }
    }
    tempArray.push(points[points.length - 1]);

    if (tempArray.length > points.length) {
      // keep subdividing until no more large jumps
      tempArray = interpolatePoints(tempArray);
    }
    return tempArray;
  }

  function getMidpoint(p1, p2) {
    const midLon = (p1[0] + p2[0]) / 2;
    const midLat = (p1[1] + p2[1]) / 2;
    return [midLon, midLat];
  }

  /**
   * Converts [lon, lat] to (x,y,z) on a sphere of given `sphereRadius`.
   */
  function convertToSphereCoords(coords, sphereRadius) {
    if (!coords) return;
    const [lon, lat] = coords;

    x_values.push(
      Math.cos((lat * Math.PI) / 180) *
        Math.cos((lon * Math.PI) / 180) *
        sphereRadius
    );
    y_values.push(
      Math.cos((lat * Math.PI) / 180) *
        Math.sin((lon * Math.PI) / 180) *
        sphereRadius
    );
    z_values.push(Math.sin((lat * Math.PI) / 180) * sphereRadius);
  }

  /**
   * Draws a single point for 'Point' geometry
   */
  function drawParticle(x, y, z, options, props) {
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute([x, y, z], 3)
    );

    const particleMaterial = new THREE.PointsMaterial({
      size: options.size || 2,
      color: options.color || 0xffffff,
    });

    const particle = new THREE.Points(particleGeo, particleMaterial);

    // Attach userData for interaction
    particle.userData = {
      countryName: props.name || "Unknown",
    };

    container.add(particle);
    clearArrays();
  }

  /**
   * Draws a line using THREE.Line2 for polygons/lines
   */
  function drawLine(xVals, yVals, zVals, options, props) {
    const lineGeo = new LineGeometry();
    const verts = [];

    for (let i = 0; i < xVals.length; i++) {
      verts.push(xVals[i], yVals[i], zVals[i]);
    }
    lineGeo.setPositions(verts);

    // Use materialOptions color or random if not provided
    let color;
    if (options.color !== undefined) {
      color = new THREE.Color(options.color);
    } else {
      // Example random hue approach
      let hue = 0.3 + Math.random() * 0.2;
      if (Math.random() > 0.5) hue -= 0.3;
      color = new THREE.Color().setHSL(hue, 1.0, 0.5);
    }

    const lineMaterial = new LineMaterial({
      color,
      linewidth: options.linewidth || 2,
      dashed: !!options.dashed,
      fog: true,
    });

    // **Important**: Must set the resolution
    const width = options.rendererWidth || window.innerWidth;
    const height = options.rendererHeight || window.innerHeight;
    lineMaterial.resolution.set(width, height);

    if (options.dashed) {
      // lineMaterial.defines.USE_DASH = "";
      // lineMaterial.dashSize = 1;
      // lineMaterial.gapSize = 0.5;
    }

    const line = new Line2(lineGeo, lineMaterial);
    line.computeLineDistances();

    // Attach userData so we know the country name
    line.userData = {
      defaultColor: color.clone(),
      countryName: props.name || "Unknown Country",
    };

    // Example of dashOffset animation
    const dashRate = Math.random() * 0.0002;
    line.userData.update = (t) => {
      lineMaterial.dashOffset = t * dashRate;
    };

    container.add(line);
    clearArrays();
  }

  function clearArrays() {
    x_values.length = 0;
    y_values.length = 0;
    z_values.length = 0;
  }

  return container;
}
