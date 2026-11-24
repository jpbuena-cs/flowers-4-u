const MAP_URL = new URL("../assets/glove-map.txt.gz", import.meta.url);
const SOURCE_COLUMNS = 144;
const SOURCE_ROWS = 144;

// Ordered from visually sparse to visually dense. The map uses this same ramp.
const RAMP = " .-',:~\";^!_*+|=/\\)(r<>[]l?jv1cxzu7LYins}yJTt{Cfw%IVhFk2oX3mqdZ$4eaSp5bPAUGK&OEg09H6DQR8W#@NMB";
const TARGET_FPS = 24;
const FRAME_INTERVAL = 1000 / TARGET_FPS;
const START_DELAY = 1800;
const ENTRY_DURATION = 4800;
const CHAR_WIDTH_RATIO = 0.602;
const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)");
const TAU = Math.PI * 2;

const output = document.querySelector("#art");
const stage = document.querySelector(".stage");
const measureCanvas = document.createElement("canvas");
const measureContext = measureCanvas.getContext("2d");

let sourcePixels = null;
let pixels = null;
let columns = 0;
let rows = 0;
let currentFontSize = null;
let animationFrame = 0;
let startTimer = 0;
let lastFrameAt = 0;
let animationStartedAt = 0;
let animationElapsed = 0;
let entranceAnimation = null;
let entranceStarted = false;
let hasEntered = false;
let isVisible = !document.hidden;

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, value));
}

function getColumnTarget() {
  return window.matchMedia("(max-width: 640px)").matches ? 72 : 144;
}

function getFontSize(nextColumns, nextRows) {
  measureContext.font = "100px monospace";
  const measuredRatio = measureContext.measureText("M").width / 100;
  const charWidthRatio = Number.isFinite(measuredRatio) && measuredRatio > 0
    ? measuredRatio
    : CHAR_WIDTH_RATIO;

  const availableWidth = Math.max(1, stage.clientWidth - 24);
  const availableHeight = Math.max(1, stage.clientHeight - 24);
  const widthFit = availableWidth / (nextColumns * charWidthRatio);
  const heightFit = availableHeight / nextRows;

  return Math.max(3, Math.min(widthFit, heightFit));
}

function buildSampleGrid() {
  if (!sourcePixels) return false;

  const targetColumns = getColumnTarget();
  const targetRows = Math.max(
    1,
    Math.round((targetColumns * SOURCE_ROWS) / SOURCE_COLUMNS),
  );
  const gridChanged = targetColumns !== columns || targetRows !== rows || !pixels;

  // A viewport-height change can alter the fitted font size without crossing
  // the mobile/desktop breakpoint. Track that too so the offscreen offset is
  // recalculated before the first entrance.
  const nextFontSize = getFontSize(targetColumns, targetRows);
  const fontChanged = currentFontSize === null || Math.abs(nextFontSize - currentFontSize) > 0.02;
  currentFontSize = nextFontSize;
  output.style.setProperty("--art-size", nextFontSize.toFixed(3) + "px");

  if (!gridChanged) return fontChanged;

  columns = targetColumns;
  rows = targetRows;
  pixels = new Uint8Array(columns * rows);

  // Average source cells when reducing from the desktop map to the mobile grid.
  for (let y = 0; y < rows; y += 1) {
    const sourceY0 = Math.floor((y * SOURCE_ROWS) / rows);
    const sourceY1 = Math.max(sourceY0 + 1, Math.floor(((y + 1) * SOURCE_ROWS) / rows));

    for (let x = 0; x < columns; x += 1) {
      const sourceX0 = Math.floor((x * SOURCE_COLUMNS) / columns);
      const sourceX1 = Math.max(sourceX0 + 1, Math.floor(((x + 1) * SOURCE_COLUMNS) / columns));
      let total = 0;
      let count = 0;

      for (let sourceY = sourceY0; sourceY < sourceY1; sourceY += 1) {
        for (let sourceX = sourceX0; sourceX < sourceX1; sourceX += 1) {
          total += sourcePixels[sourceY * SOURCE_COLUMNS + sourceX];
          count += 1;
        }
      }

      pixels[y * columns + x] = Math.round(total / count);
    }
  }

  renderFrame(animationElapsed, false);
  return true;
}

function characterFor(value) {
  const index = Math.max(
    0,
    Math.min(RAMP.length - 1, Math.round((value / 255) * (RAMP.length - 1))),
  );
  return RAMP[index];
}

function samplePixel(x, y) {
  // Samples outside the map as black. This prevents edge pixels from smearing
  // as the hand makes its tiny portrait-style idle movements.
  if (x < 0 || y < 0 || x > columns - 1 || y > rows - 1) return 0;

  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = Math.min(columns - 1, x0 + 1);
  const y1 = Math.min(rows - 1, y0 + 1);
  const fx = x - x0;
  const fy = y - y0;

  const top = pixels[y0 * columns + x0] * (1 - fx)
    + pixels[y0 * columns + x1] * fx;
  const bottom = pixels[y1 * columns + x0] * (1 - fx)
    + pixels[y1 * columns + x1] * fx;

  return top * (1 - fy) + bottom * fy;
}

function stopAnimationLoop() {
  if (animationFrame) cancelAnimationFrame(animationFrame);
  animationFrame = 0;
  if (startTimer) clearTimeout(startTimer);
  startTimer = 0;
}

function cancelEntrance() {
  if (entranceAnimation) {
    entranceAnimation.onfinish = null;
    entranceAnimation.cancel();
    entranceAnimation = null;
  }
  entranceStarted = false;
}

function setArtAtRest() {
  cancelEntrance();
  output.style.transition = "none";
  output.style.transform = "translate3d(0, 0, 0)";
}

function placeArtBelowViewport() {
  const artHeight = output.getBoundingClientRect().height;
  const offset = Math.ceil((stage.clientHeight + artHeight) / 2 + 36);

  // The text block is centered by the stage grid. This puts its top edge
  // 36px below the viewport before the entrance begins.
  output.style.transition = "none";
  output.style.transform = "translate3d(0, " + offset + "px, 0)";
  output.getBoundingClientRect();
  return offset;
}

function beginEntrance(offset) {
  entranceStarted = true;

  const animation = output.animate([
    {
      transform: "translate3d(0, " + offset + "px, 0)",
      offset: 0,
      easing: "cubic-bezier(0.42, 0, 0.58, 1)",
    },
    {
      transform: "translate3d(0, -2.5px, 0)",
      offset: 0.88,
      easing: "cubic-bezier(0.2, 0.66, 0.28, 1)",
    },
    {
      transform: "translate3d(0, 0.8px, 0)",
      offset: 0.965,
      easing: "ease-out",
    },
    {
      transform: "translate3d(0, 0, 0)",
      offset: 1,
    },
  ], {
    duration: ENTRY_DURATION,
    fill: "both",
  });

  entranceAnimation = animation;
  animation.onfinish = () => {
    if (entranceAnimation !== animation) return;

    // Commit the exact resting position before clearing the fill effect.
    output.style.transform = "translate3d(0, 0, 0)";
    animation.cancel();
    entranceAnimation = null;
    entranceStarted = false;
    hasEntered = true;
  };
}

function renderFrame(elapsed, animated) {
  if (!pixels) return;

  const isMoving = animated && !REDUCED_MOTION.matches;
  const sweepPosition = isMoving
    ? 0.5 - 0.5 * Math.cos((elapsed / 12000) * TAU)
    : -1;
  const lines = new Array(rows);

  // Living-portrait idle: a tiny wrist-led pivot and fractional-cell drift.
  // Keep these movements smaller than one character cell.
  const idlePhase = (elapsed / 18500) * TAU;
  const idleAngle = isMoving ? Math.sin(idlePhase) * 0.0022 : 0;
  const cosine = Math.cos(idleAngle);
  const sine = Math.sin(idleAngle);
  const breathPhase = (elapsed / 23000) * TAU;
  const scaleX = isMoving ? 1 + Math.sin(breathPhase) * 0.00125 : 1;
  const scaleY = isMoving ? 1 + Math.sin(breathPhase + 1.15) * 0.0009 : 1;
  const driftX = isMoving ? Math.sin((elapsed / 14500) * TAU + 0.6) * 0.2 : 0;
  const driftY = isMoving ? Math.sin((elapsed / 17200) * TAU + 2.0) * 0.22 : 0;

  // The wrist/cuff is the quiet pivot point for the hand's idle movement.
  const pivotX = columns * 0.53;
  const pivotY = rows * 0.81;

  for (let y = 0; y < rows; y += 1) {
    const line = new Array(columns);
    const vertical = y / Math.max(1, rows - 1);

    for (let x = 0; x < columns; x += 1) {
      // Inverse transform creates the slight organic motion inside the art.
      const relativeX = x - driftX - pivotX;
      const relativeY = y - driftY - pivotY;
      const sourceX = (cosine * relativeX + sine * relativeY) / scaleX + pivotX;
      const sourceY = (-sine * relativeX + cosine * relativeY) / scaleY + pivotY;
      const source = samplePixel(sourceX, sourceY);
      let value = source;

      if (isMoving && source > 8) {
        // A soft cloth highlight travels back and forth during the entrance
        // and continues after the hand settles into the center of the page.
        const horizontal = x / Math.max(1, columns - 1);
        const distance = (horizontal - sweepPosition) / 0.24;
        const softSweep = Math.exp(-0.5 * distance * distance);
        const fabricVariation = Math.sin(
          horizontal * 7.5 + vertical * 4.2 + elapsed * 0.00062,
        ) * 1.15;
        const slowBreath = Math.sin(elapsed * 0.00038) * 1.1;
        value += softSweep * 8.5 + fabricVariation + slowBreath;
      }

      line[x] = characterFor(clamp(value, 0, 255));
    }

    lines[y] = line.join("");
  }

  output.textContent = lines.join("\n");
}

function animate(timestamp) {
  if (!isVisible || REDUCED_MOTION.matches) {
    animationFrame = 0;
    return;
  }

  if (timestamp - lastFrameAt >= FRAME_INTERVAL) {
    lastFrameAt = timestamp;
    animationElapsed = timestamp - animationStartedAt;
    renderFrame(animationElapsed, true);
  }

  animationFrame = requestAnimationFrame(animate);
}

function startAnimation({ enter = false } = {}) {
  stopAnimationLoop();
  if (!pixels) return;

  if (REDUCED_MOTION.matches) {
    hasEntered = true;
    setArtAtRest();
    renderFrame(0, false);
    return;
  }

  if (!isVisible) return;

  // If the page was hidden during the entrance, resume the same animation
  // instead of jumping back below the viewport or replaying the entrance.
  if (entranceAnimation && entranceStarted) {
    entranceAnimation.play();
    animationStartedAt = performance.now() - animationElapsed;
    animationFrame = requestAnimationFrame(animate);
    return;
  }

  const shouldEnter = enter && !hasEntered;
  const entranceOffset = shouldEnter ? placeArtBelowViewport() : null;

  if (!shouldEnter) setArtAtRest();
  renderFrame(animationElapsed, false);

  startTimer = window.setTimeout(() => {
    animationStartedAt = performance.now() - animationElapsed;
    lastFrameAt = 0;
    animationFrame = requestAnimationFrame(animate);

    if (shouldEnter) beginEntrance(entranceOffset);
  }, START_DELAY);
}

function refreshLayout() {
  const gridChanged = buildSampleGrid();
  if (!gridChanged) return;

  // If the viewport changes while the first entrance is in progress, rebuild
  // the offscreen starting position using the new art dimensions.
  if (entranceAnimation && entranceStarted) {
    cancelEntrance();
    hasEntered = false;
  }

  startAnimation({ enter: !hasEntered });
}

async function loadArtworkMap() {
  try {
    const response = await fetch(MAP_URL);
    if (!response.ok) throw new Error("Artwork map could not be loaded");

    if (typeof DecompressionStream === "undefined") {
      throw new Error("This browser does not support native gzip decompression");
    }

    const compressed = await response.arrayBuffer();
    const decompressed = new Blob([compressed])
      .stream()
      .pipeThrough(new DecompressionStream("gzip"));
    const raw = await new Response(decompressed).text();
    const lines = raw.split(/\r?\n/);
    if (lines[lines.length - 1] === "") lines.pop();
    if (lines.length !== SOURCE_ROWS || lines.some((line) => line.length !== SOURCE_COLUMNS)) {
      throw new Error("Artwork map has an unexpected size");
    }

    sourcePixels = new Uint8Array(SOURCE_COLUMNS * SOURCE_ROWS);
    for (let y = 0; y < SOURCE_ROWS; y += 1) {
      for (let x = 0; x < SOURCE_COLUMNS; x += 1) {
        const rampIndex = RAMP.indexOf(lines[y][x]);
        if (rampIndex < 0) throw new Error("Artwork map contains an unknown character");
        sourcePixels[y * SOURCE_COLUMNS + x] = Math.round(
          (rampIndex / (RAMP.length - 1)) * 255,
        );
      }
    }

    buildSampleGrid();
    startAnimation({ enter: true });
  } catch {
    // Keep the page empty rather than showing fallback copy or interface text.
    output.textContent = "";
  }
}

const resizeObserver = new ResizeObserver(refreshLayout);
resizeObserver.observe(stage);

REDUCED_MOTION.addEventListener("change", () => {
  stopAnimationLoop();

  if (REDUCED_MOTION.matches) {
    hasEntered = true;
    animationElapsed = 0;
    setArtAtRest();
    renderFrame(0, false);
  } else {
    startAnimation();
  }
});

document.addEventListener("visibilitychange", () => {
  isVisible = !document.hidden;

  if (!isVisible) {
    if (animationStartedAt) {
      animationElapsed = performance.now() - animationStartedAt;
    }
    stopAnimationLoop();
    if (entranceAnimation) entranceAnimation.pause();
  } else {
    startAnimation({ enter: !hasEntered });
  }
});

window.addEventListener("resize", refreshLayout, { passive: true });
loadArtworkMap();
