import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson";
import versor from "versor";

/**
 * Minimal reproduction of Mike Bostock’s Versor Dragging,
 * in React, using a <canvas> for rendering.
 */
export default function TestGlobe() {
  const canvasRef = useRef(null);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  // We'll store geographic data after loading
  const [land, setLand] = useState(null);

  // A sphere geometry (for drawing the outer boundary)
  const sphere = { type: "Sphere" };

  // The Orthographic projection
  const [projection] = useState(() => d3.geoOrthographic().precision(0.1));

  // On mount, load the land data and set up resize
  useEffect(() => {
    async function loadData() {
      // Load "land-50m.json" from unpkg.
      const world = await d3.json(
        "https://unpkg.com/world-atlas@2/land-50m.json"
      );
      const landFeature = topojson.feature(world, world.objects.land);
      setLand(landFeature);
    }
    loadData();

    function handleResize() {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Each time width/height/land changes, re-render
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;

    fitProjection();
    renderGlobe();
  }, [width, height, land]);

  // Attach D3’s drag behavior once
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    // Create a custom "drag" behavior with versor
    const dragBehavior = createVersorDrag(projection, () => {
      renderGlobe(); // re-render on drag
    });

    d3.select(canvas).call(dragBehavior);

    // Cleanup
    return () => {
      d3.select(canvas).on(".drag", null);
    };
  }, [projection]);

  /**
   * Scale/center the projection to fit our canvas.
   */
  function fitProjection() {
    const size = Math.min(width, height) * 0.45;
    projection.translate([width / 2, height / 2]).scale(size);
  }

  /**
   * Draws sphere + land to the canvas.
   */
  function renderGlobe() {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    context.clearRect(0, 0, width, height);

    // Create a geoPath that draws to the canvas context
    const path = d3.geoPath(projection, context);

    // Draw sphere background
    context.beginPath();
    path(sphere);
    context.fillStyle = "#fff";
    context.fill();

    // Draw land
    if (land) {
      context.beginPath();
      path(land);
      context.fillStyle = "blue";
      context.fill();
    }

    // Stroke the sphere’s outline
    context.beginPath();
    path(sphere);
    context.strokeStyle = "";
    context.stroke();
  }

  return (
    <canvas ref={canvasRef} style={{ display: "block", background: "#eee" }} />
  );
}

/**
 * Creates a d3.drag() configured for single-touch (mouse or finger) versor rotation.
 * @param {d3.GeoProjection} projection The d3 geoProjection to rotate.
 * @param {Function} onDrag Callback to re-render when rotated.
 */
function createVersorDrag(projection, onDrag) {
  let v0, q0, r0; // v0=initial point on sphere, q0=initial versor, r0=initial rotation

  // Called when drag starts
  function dragstarted(event) {
    const [x, y] = d3.pointer(event);
    v0 = versor.cartesian(projection.invert([x, y])); // initial point
    r0 = projection.rotate();
    q0 = versor(r0);
  }

  // Called for each "drag" event
  function dragged(event) {
    const [x, y] = d3.pointer(event);
    const v1 = versor.cartesian(projection.rotate(r0).invert([x, y]));
    const delta = versor.delta(v0, v1);
    const q1 = versor.multiply(q0, delta);
    const r1 = versor.rotation(q1);
    projection.rotate(r1);
    onDrag();
  }

  return d3.drag().on("start", dragstarted).on("drag", dragged);
}
