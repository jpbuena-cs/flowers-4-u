const IMAGE_URL = new URL("../assets/source-glove.jpg", import.meta.url);
const CROP = { x: 0, y: 0, width: 136, height: 226 };

// Ordered from visually sparse to visually dense. The wide range preserves
// fabric folds, seams, and the glove's silhouette without adding color.
const RAMP = " .-',:~\";^!_*+|=/\\)(r<>[]l?jv1cxzu7LYins}yJTt{Cfw%IVhFk2oX3mqdZ$4eaSp5bPAUGK&OEg09H6DQR8W#@NMB";
const TARGET_FPS = 24;
const FRAME_INTERVAL = 1000 / TARGET_FPS;
const START_DELAY = 1800;
const CHAR_WIDTH_RATIO = 0.602;
const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)");

const output = document.querySelector("#art");
const image = new Image();
const sampleCanvas = document.createElement("canvas");
const sampleContext = sampleCanvas.getContext("2d", { willReadFrequently: true });
const measureCanvas = document.createElement("canvas");
const measureContext = measureCanvas.getContext("2d");

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
  if (!image.complete || image.naturalWidth === 0) return false;

  const targetColumns = getColumnTarget();
  const sourceAspect = CROP.width / CROP.height;
  const targetRows = Math.max(
    1,
    Math.round((targetColumns * CHAR_WIDTH_RATIO) / sourceAspect),
  );
  const gridChanged = targetColumns !== columns || targetRows !== rows || !pixels;

  // Font size can change even when the mobile/desktop column target stays the same.
  fontSize = getFontSize(targetColumns, targetRows);
  output.style.setProperty("--art-size", fontSize.toFixed(3) + "px");

  if (!gridChanged) return false;

  columns = targetColumns;
  rows = targetRows;

  sampleCanvas.width = columns;
  sampleCanvas.height = rows;
  sampleContext.clearRect(0, 0, columns, rows);
  sampleContext.imageSmoothingEnabled = true;
  sampleContext.imageSmoothingQuality = "high";
  sampleContext.drawImage(
    image,
    CROP.x,
    CROP.y,
    CROP.width,
    CROP.height,
    0,
    0,
    columns,
    rows,
  );

  const rgba = sampleContext.getImageData(0, 0, columns, rows).data;
  pixels = new Uint8Array(columns * rows);

  for (let index = 0, pixel = 0; index < rgba.length; index += 4, pixel += 1) {
    const luminance = 0.2126 * rgba[index]
      + 0.7152 * rgba[index + 1]
      + 0.0722 * rgba[index + 2];

    // Lift the glove's soft gray fabric while keeping the background black.
    const normalized = Math.max(0, (luminance - 22) / 198);
    const shaped = Math.pow(Math.min(1, normalized), 0.72);
    pixels[pixel] = Math.round(shaped * 255);
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

  const sweepPosition = animated ? (elapsed % 10000) / 10000 : -1;
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

image.addEventListener("load", () => {
  buildSampleGrid();
  startAnimation();
}, { once: true });

image.addEventListener("error", () => {
  // Keep the page empty rather than showing fallback copy or interface text.
  output.textContent = "";
}, { once: true });

image.src = IMAGE_URL.href;

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