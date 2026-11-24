const MAP_URL = new URL("../assets/glove-map.txt.gz", import.meta.url);
const SOURCE_COLUMNS = 144;
const SOURCE_ROWS = 144;

// Ordered from visually sparse to visually dense. The map uses this same ramp.
const RAMP = " .-',:~\";^!_*+|=/\\)(r<>[]l?jv1cxzu7LYins}yJTt{Cfw%IVhFk2oX3mqdZ$4eaSp5bPAUGK&OEg09H6DQR8W#@NMB";
const TARGET_FPS = 24;
const FRAME_INTERVAL = 1000 / TARGET_FPS;
const START_DELAY = 1800;
const CHAR_WIDTH_RATIO = 0.602;
const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)");

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

function renderFrame(elapsed, animated) {
  if (!pixels) return;

  const sweepPosition = animated
    ? 0.5 - 0.5 * Math.cos((elapsed / 12000) * Math.PI * 2)
    : -1;
  const lines = new Array(rows);

  for (let y = 0; y < rows; y += 1) {
    const line = new Array(columns);
    const vertical = y / Math.max(1, rows - 1);

    for (let x = 0; x < columns; x += 1) {
      const horizontal = x / Math.max(1, columns - 1);
      const source = pixels[y * columns + x];
      let value = source;

      if (animated && source > 8) {
        // A broad, soft highlight travels across the cloth rather than
        // behaving like a metallic reflection or a hard scanning bar.
        const distance = (horizontal - sweepPosition) / 0.24;
        const softSweep = Math.exp(-0.5 * distance * distance);
        const fabricVariation = Math.sin(
          horizontal * 7.5 + vertical * 4.2 + elapsed * 0.00062,
        ) * 1.15;
        const slowBreath = Math.sin(elapsed * 0.00038) * 1.1;
        value += softSweep * 8.5 + fabricVariation + slowBreath;
      }

      line[x] = characterFor(Math.max(0, Math.min(255, value)));
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
