const MAP_URL = new URL("../assets/glove-map.txt.gz", import.meta.url);
const SOURCE_COLUMNS = 144;
const SOURCE_ROWS = 144;

// Ordered from visually sparse to visually dense. The map uses this same ramp.
// 95 glyphs sorted by average ink coverage across Liberation Mono and DejaVu Sans Mono.
const RAMP = " `.-',:_~;\"!^*\\/r+=<>|()l?7LcitvzxTY][jJfs1}{unIyCFo2Ve4k3hXaZw5SP%AU#EbGdpqmK69HOconst RAMP = " `.-',:_~;\"!^*\\/r+=<>|()l?7LcitvzxTY][jJfs1}{unIyCFo2Ve4k3hXaZw5SP%AU#EbGdpqmK69HO$&D08gRNQWMB@";
const TARGET_FPS = 24;D08gRNQWMB@";
const CHARACTER_CODES = new Uint16Array(
  Array.from({ length: 256 }, (_, value) =>
    RAMP.charCodeAt(Math.round((value / 255) * (RAMP.length - 1))),
  ),
);
const TARGET_FPS = 24;
const FRAME_INTERVAL = 1000 / TARGET_FPS;
const START_DELAY = 1800;
const ENTRY_DURATION = 4800;
const CHAR_WIDTH_RATIO = 0.602;
const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)");
const TAU = Math.PI * 2;

const output = document.querySelector("#art");
const stage = document.querySelector(".stage");
const artText = document.createTextNode("");
output.append(artText);

const measureCanvas = document.createElement("canvas");
const measureContext = measureCanvas.getContext("2d");

let sourcePixels = null;
let pixels = null;
let columns = 0;
let rows = 0;
let currentFontSize = null;
let motionFields = null;
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

  buildMotionFields();
  renderFrame(animationElapsed, false);
  return true;
}

function buildMotionFields() {
  const length = columns * rows;
  const motionScale = Math.sqrt(columns / SOURCE_COLUMNS);

  // Precompute masks and spatial wave coefficients once per grid size.
  // The frame renderer only applies time-dependent multipliers to these.
  const fields = {
    palmXSin: new Float32Array(length),
    palmXCos: new Float32Array(length),
    cuffXSin: new Float32Array(length),
    cuffXCos: new Float32Array(length),
    palmYCos: new Float32Array(length),
    palmYSin: new Float32Array(length),
    cuffYCos: new Float32Array(length),
    cuffYSin: new Float32Array(length),
    fabricSin: new Float32Array(length),
    fabricCos: new Float32Array(length),
    horizontal: new Float32Array(columns),
    sweep: new Float32Array(columns),
    outputBuffer: new Uint16Array(length + rows - 1),
    stringParts: [],
  };

  for (let x = 0; x < columns; x += 1) {
    fields.horizontal[x] = x / Math.max(1, columns - 1);
  }

  for (let y = 0; y < rows; y += 1) {
    const vertical = y / Math.max(1, rows - 1);
    const rowOffset = y * columns;

    for (let x = 0; x < columns; x += 1) {
      const index = rowOffset + x;
      const horizontal = fields.horizontal[x];

      const palmDx = (x - columns * 0.535) / (columns * 0.19);
      const palmDy = (y - rows * 0.49) / (rows * 0.19);
      const palmMask = Math.exp(-1.65 * (palmDx * palmDx + palmDy * palmDy));

      const cuffDx = (x - columns * 0.57) / (columns * 0.17);
      const cuffDy = (y - rows * 0.81) / (rows * 0.075);
      const cuffMask = Math.exp(-1.8 * (cuffDx * cuffDx + cuffDy * cuffDy));

      const palmXPhase = horizontal * 3.8 + vertical * 2.2;
      const cuffXPhase = horizontal * 2.6 - vertical * 1.7 + 0.8;
      const palmYPhase = horizontal * 3.1;
      const cuffYPhase = vertical * 2.8;
      const fabricPhase = horizontal * 7.5 + vertical * 4.2;

      fields.palmXSin[index] = motionScale * palmMask * 0.16 * Math.sin(palmXPhase);
      fields.palmXCos[index] = motionScale * palmMask * 0.16 * Math.cos(palmXPhase);
      fields.cuffXSin[index] = motionScale * cuffMask * 0.085 * Math.sin(cuffXPhase);
      fields.cuffXCos[index] = motionScale * cuffMask * 0.085 * Math.cos(cuffXPhase);

      fields.palmYCos[index] = motionScale * palmMask * 0.105 * Math.cos(palmYPhase);
      fields.palmYSin[index] = motionScale * palmMask * 0.105 * Math.sin(palmYPhase);
      fields.cuffYCos[index] = motionScale * cuffMask * 0.06 * Math.cos(cuffYPhase);
      fields.cuffYSin[index] = motionScale * cuffMask * 0.06 * Math.sin(cuffYPhase);

      fields.fabricSin[index] = Math.sin(fabricPhase);
      fields.fabricCos[index] = Math.cos(fabricPhase);
    }
  }

  motionFields = fields;
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
  if (!pixels || !motionFields) return;

  const isMoving = animated && !REDUCED_MOTION.matches;
  const fields = motionFields;
  const sweepPosition = isMoving
    ? 0.5 - 0.5 * Math.cos((elapsed / 12000) * TAU)
    : -1;

  // Temporal terms are calculated once per frame, not once per character.
  const palmXSin = isMoving ? Math.sin(elapsed * 0.00034) : 0;
  const palmXCos = isMoving ? Math.cos(elapsed * 0.00034) : 0;
  const cuffXSin = isMoving ? Math.sin(elapsed * 0.00027) : 0;
  const cuffXCos = isMoving ? Math.cos(elapsed * 0.00027) : 0;
  const palmYSin = isMoving ? Math.sin(elapsed * 0.00031) : 0;
  const palmYCos = isMoving ? Math.cos(elapsed * 0.00031) : 0;
  const cuffYSin = isMoving ? Math.sin(elapsed * 0.00024) : 0;
  const cuffYCos = isMoving ? Math.cos(elapsed * 0.00024) : 0;
  const fabricSin = isMoving ? Math.sin(elapsed * 0.00062) : 0;
  const fabricCos = isMoving ? Math.cos(elapsed * 0.00062) : 0;
  const slowBreath = isMoving ? Math.sin(elapsed * 0.00038) * 1.1 : 0;

  // The light sweep varies only by column. Calculate 72/144 weights once.
  if (isMoving) {
    for (let x = 0; x < columns; x += 1) {
      const distance = (fields.horizontal[x] - sweepPosition) / 0.24;
      fields.sweep[x] = Math.exp(-0.5 * distance * distance);
    }
  }

  // Living-portrait idle: preserve the approved wrist-led movement, breathing,
  // and drift. These values are shared by the whole character grid.
  const idlePhase = (elapsed / 19600) * TAU;
  const idleAngle = isMoving ? Math.sin(idlePhase + 0.35) * 0.0031 : 0;
  const cosine = Math.cos(idleAngle);
  const sine = Math.sin(idleAngle);
  const breathPhase = (elapsed / 12800) * TAU;
  const scaleX = isMoving ? 1 + Math.sin(breathPhase) * 0.0018 : 1;
  const scaleY = isMoving ? 1 + Math.sin(breathPhase + 1.25) * 0.00125 : 1;
  const driftX = isMoving
    ? Math.sin((elapsed / 17700) * TAU + 0.6) * 0.26
      + Math.sin((elapsed / 29300) * TAU + 1.9) * 0.055
    : 0;
  const driftY = isMoving ? Math.sin((elapsed / 21400) * TAU + 2.0) * 0.25 : 0;

  const pivotX = columns * 0.53;
  const pivotY = rows * 0.81;
  const outputBuffer = fields.outputBuffer;
  let writeIndex = 0;

  for (let y = 0; y < rows; y += 1) {
    const rowOffset = y * columns;

    for (let x = 0; x < columns; x += 1) {
      const index = rowOffset + x;

      const relativeX = x - driftX - pivotX;
      const relativeY = y - driftY - pivotY;
      let sourceX = (cosine * relativeX + sine * relativeY) / scaleX + pivotX;
      let sourceY = (-sine * relativeX + cosine * relativeY) / scaleY + pivotY;

      if (isMoving) {
        // Apply precomputed feathered masks via time-dependent multipliers.
        sourceX += palmXSin * fields.palmXCos[index]
          + palmXCos * fields.palmXSin[index]
          + cuffXSin * fields.cuffXCos[index]
          + cuffXCos * fields.cuffXSin[index];

        sourceY += palmYCos * fields.palmYCos[index]
          - palmYSin * fields.palmYSin[index]
          + cuffYCos * fields.cuffYCos[index]
          - cuffYSin * fields.cuffYSin[index];
      }

      const source = samplePixel(sourceX, sourceY);
      let value = source;

      if (isMoving && source > 8) {
        const fabricVariation = (
          fabricSin * fields.fabricCos[index]
          + fabricCos * fields.fabricSin[index]
        ) * 1.15;
        value += fields.sweep[x] * 8.5 + fabricVariation + slowBreath;
      }

      const brightness = Math.round(clamp(value, 0, 255));
      outputBuffer[writeIndex++] = CHARACTER_CODES[brightness];
    }

    if (y < rows - 1) outputBuffer[writeIndex++] = 10;
  }

  // Convert the reused character buffer in safe-size chunks and update the
  // same text node. No row arrays or per-cell character strings are allocated.
  fields.stringParts.length = 0;
  const CHUNK_SIZE = 8192;
  for (let offset = 0; offset < writeIndex; offset += CHUNK_SIZE) {
    fields.stringParts.push(String.fromCharCode(...outputBuffer.subarray(
      offset,
      Math.min(writeIndex, offset + CHUNK_SIZE),
    )));
  }
  artText.data = fields.stringParts.join("");
}
function animate(timestamp) {
  if (!isVisible || REDUCED_MOTION.matches) {
    animationFrame = 0;
    return;
  }

  const frameDelta = timestamp - lastFrameAt;
  if (frameDelta >= FRAME_INTERVAL) {
    // Carry fractional frame intervals forward to preserve a stable 24 FPS
    // cadence on common 60 Hz displays.
    const elapsedIntervals = Math.max(1, Math.floor(frameDelta / FRAME_INTERVAL));
    lastFrameAt += elapsedIntervals * FRAME_INTERVAL;
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
    lastFrameAt = animationStartedAt;
    animationFrame = requestAnimationFrame(animate);
    return;
  }

  const shouldEnter = enter && !hasEntered;
  const entranceOffset = shouldEnter ? placeArtBelowViewport() : null;

  if (!shouldEnter) setArtAtRest();
  renderFrame(animationElapsed, false);

  startTimer = window.setTimeout(() => {
    animationStartedAt = performance.now() - animationElapsed;
    lastFrameAt = animationStartedAt;
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
  } catch (error) {
    // Keep the page free of visible copy, but report the actual failure in DevTools.
    console.error("ASCII artwork failed to load:", error);
    artText.data = "";
  }
}

// ResizeObserver handles viewport changes beyond window.resize on mobile.
// Older browsers use the window resize listener below as a compatibility fallback.
if (typeof ResizeObserver === "function") {
  const resizeObserver = new ResizeObserver(refreshLayout);
  resizeObserver.observe(stage);
}

const handleMotionPreferenceChange = () => {
  stopAnimationLoop();

  if (REDUCED_MOTION.matches) {
    hasEntered = true;
    animationElapsed = 0;
    setArtAtRest();
    renderFrame(0, false);
  } else {
    startAnimation();
  }
};

if (typeof REDUCED_MOTION.addEventListener === "function") {
  REDUCED_MOTION.addEventListener("change", handleMotionPreferenceChange);
} else if (typeof REDUCED_MOTION.addListener === "function") {
  REDUCED_MOTION.addListener(handleMotionPreferenceChange);
}

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
