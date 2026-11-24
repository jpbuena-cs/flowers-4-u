const MAP_URL = new URL("../assets/glove-map.txt.gz", import.meta.url);
const SOURCE_COLUMNS = 144;
const SOURCE_ROWS = 144;

// Ordered from visually sparse to visually dense. The map uses this same ramp.
const RAMP = " .-',:~\";^!_*+|=/\\)(r<>[]l?jv1cxzu7LYins}yJTt{Cfw%IVhFk2oX3mqdZ$4eaSp5bPAUGK&OEg09H6DQR8W#@NMB";
const TARGET_FPS = 24;
const FRAME_INTERVAL = 1000 / TARGET_FPS;
const START_DELAY = 1800;
const FINGER_LIFT_DELAY = 2800;
const FINGER_LIFT_DURATION = 9200;
const MAX_FINGER_LIFT = 4.6;
const CHAR_WIDTH_RATIO = 0.602;
const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)");
const TAU = Math.PI * 2;

const output = document.querySelector("#art");
const measureCanvas = document.createElement("canvas");
const measureContext = measureCanvas.getContext("2d");

let sourcePixels = null;
let pixels = null;
let columns = 0;
let rows = 0;
let fontSize = 6;
let animationFrame = 0;
let startTimer = 0;
let lastFrameAt = 0;
let animationStartedAt = 0;
let isVisible = !document.hidden;

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, value));
}

function smoothstep(edge0, edge1, value) {
  const t = clamp((value - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
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

  const stage = document.querySelector(".stage");
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

  // Font size can change even when the mobile/desktop column target stays the same.
  fontSize = getFontSize(targetColumns, targetRows);
  output.style.setProperty("--art-size", fontSize.toFixed(3) + "px");

  if (!gridChanged) return false;

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

  renderFrame(0, false);
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
  // if the tiny idle drift moves the hand by a fraction of a character cell.
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

function getFingerMask(x, y, sizeRatio) {
  // The raised finger runs diagonally from the upper-left toward its knuckle.
  // The feathered mask keeps the lift strongest at the fingertip and anchored
  // where the finger joins the palm.
  const fingerCenterX = (23 / SOURCE_COLUMNS) * columns + 0.58 * y;
  const horizontalDistance = Math.abs(x - fingerCenterX);
  const acrossFinger = 1 - smoothstep(8.5 * sizeRatio, 14 * sizeRatio, horizontalDistance);
  const topFade = smoothstep(4 * sizeRatio, 10 * sizeRatio, y);
  const baseFade = 1 - smoothstep(72 * sizeRatio, 89 * sizeRatio, y);
  const towardTip = 1 - smoothstep(10 * sizeRatio, 88 * sizeRatio, y);

  return acrossFinger * topFade * baseFade * towardTip;
}

function renderFrame(elapsed, animated) {
  if (!pixels) return;

  const isMoving = animated && !REDUCED_MOTION.matches;
  const sweepPosition = isMoving
    ? 0.5 - 0.5 * Math.cos((elapsed / 12000) * TAU)
    : -1;
  const sizeRatio = columns / SOURCE_COLUMNS;
  const lines = new Array(rows);

  // A portrait-style idle: the hand gently settles around its wrist rather
  // than wobbling as one rigid sticker. The amplitudes stay below one cell.
  const idlePhase = (elapsed / 18500) * TAU;
  const idleAngle = isMoving ? Math.sin(idlePhase) * 0.0022 : 0;
  const cosine = Math.cos(idleAngle);
  const sine = Math.sin(idleAngle);
  const breathPhase = (elapsed / 23000) * TAU;
  const scaleX = isMoving ? 1 + Math.sin(breathPhase) * 0.00125 : 1;
  const scaleY = isMoving ? 1 + Math.sin(breathPhase + 1.15) * 0.0009 : 1;
  const driftX = isMoving ? Math.sin((elapsed / 14500) * TAU + 0.6) * 0.2 * sizeRatio : 0;
  const driftY = isMoving ? Math.sin((elapsed / 17200) * TAU + 2.0) * 0.22 * sizeRatio : 0;

  // The wrist/cuff is the quiet pivot point for the hand's tiny idle movement.
  const pivotX = columns * 0.53;
  const pivotY = rows * 0.81;

  // The finger begins lifting only after the fabric-light movement is underway.
  // It rises once, slowly, then holds its new pose while the idle loop continues.
  const liftProgress = isMoving
    ? smoothstep(0, 1, (elapsed - FINGER_LIFT_DELAY) / FINGER_LIFT_DURATION)
    : 0;
  const fingerLift = MAX_FINGER_LIFT * sizeRatio * liftProgress;

  for (let y = 0; y < rows; y += 1) {
    const line = new Array(columns);
    const vertical = y / Math.max(1, rows - 1);

    for (let x = 0; x < columns; x += 1) {
      // Inverse transform: tiny wrist-led sway, breathing scale, and drift.
      const relativeX = x - driftX - pivotX;
      const relativeY = y - driftY - pivotY;
      let sourceX = (cosine * relativeX + sine * relativeY) / scaleX + pivotX;
      let sourceY = (-sine * relativeX + cosine * relativeY) / scaleY + pivotY;

      if (liftProgress > 0) {
        const fingerMask = getFingerMask(x, y, sizeRatio);
        const localLift = fingerLift * fingerMask;
        // Move along the finger's existing diagonal, not straight upward:
        // this makes the fingertip creep up while its base stays attached.
        sourceX += localLift * 0.58;
        sourceY += localLift;
      }

      const source = samplePixel(sourceX, sourceY);
      let value = source;

      if (isMoving && source > 8) {
        // The soft highlight keeps moving underneath the hand's idle motion.
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

function stopAnimation() {
  if (animationFrame) cancelAnimationFrame(animationFrame);
  animationFrame = 0;
  if (startTimer) clearTimeout(startTimer);
  startTimer = 0;
}

function animate(timestamp) {
  if (!isVisible || REDUCED_MOTION.matches) {
    animationFrame = 0;
    return;
  }

  if (timestamp - lastFrameAt >= FRAME_INTERVAL) {
    lastFrameAt = timestamp;
    renderFrame(timestamp - animationStartedAt, true);
  }

  animationFrame = requestAnimationFrame(animate);
}

function startAnimation() {
  stopAnimation();
  if (REDUCED_MOTION.matches || !isVisible || !pixels) return;

  renderFrame(0, false);
  startTimer = window.setTimeout(() => {
    animationStartedAt = performance.now();
    lastFrameAt = 0;
    animationFrame = requestAnimationFrame(animate);
  }, START_DELAY);
}

function refreshLayout() {
  const gridChanged = buildSampleGrid();
  if (gridChanged) startAnimation();
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
    startAnimation();
  } catch {
    // Keep the page empty rather than showing fallback copy or interface text.
    output.textContent = "";
  }
}

const resizeObserver = new ResizeObserver(() => refreshLayout());
resizeObserver.observe(document.querySelector(".stage"));

REDUCED_MOTION.addEventListener("change", () => {
  stopAnimation();
  if (REDUCED_MOTION.matches) {
    renderFrame(0, false);
  } else {
    startAnimation();
  }
});

document.addEventListener("visibilitychange", () => {
  isVisible = !document.hidden;
  if (!isVisible) {
    stopAnimation();
  } else {
    startAnimation();
  }
});

window.addEventListener("resize", refreshLayout, { passive: true });
loadArtworkMap();
