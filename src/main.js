const MAP_URL = new URL("../assets/glove-map.txt.gz", import.meta.url);
const SOURCE_COLUMNS = 144;
const SOURCE_ROWS = 144;

const RAMP = " `.-',:_~;\"!^*\\/r+=<>|()l?7LcitvzxTY][jJfs1}{unIyCFo2Ve4k3hXaZw5SP%AU#EbGdpqmK69HO$&D08gRNQWMB@";
const CHARACTER_CODES = new Uint16Array(
  Array.from({ length: 256 }, (_, value) =>
    RAMP.charCodeAt(Math.round((value / 255) * (RAMP.length - 1))),
  ),
);
const TARGET_FPS = 24;
const FRAME_INTERVAL = 1000 / TARGET_FPS;
const START_DELAY = 1800;
const ENTRY_DURATION = 4800;
const SOUND_LEAD_MS = 260;
const CHAR_WIDTH_RATIO = 0.602;
const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)");
const TAU = Math.PI * 2;

const output = document.querySelector("#art");
const stage = document.querySelector(".stage");
const startPrompt = document.querySelector("#start-prompt");
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
let experienceStarted = false;
let startRequested = false;
let audioUnlocked = false;
let isVisible = !document.hidden;
let audioContext = null;
let soundTimer = 0;
let soundPending = false;
let soundPlayed = false;
let soundTargetAt = 0;
let activeSoundMaster = null;
let activeSoundSources = [];

function clamp(value, minimum, maximum) {
  return Math.max(minimum, Math.min(maximum, value));
}

function getAudioContext() {
  if (audioContext) return audioContext;

  const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
  if (typeof AudioContextConstructor !== "function") {
    console.warn("Entrance sound is unavailable: this browser has no Web Audio API.");
    return null;
  }

  try {
    audioContext = new AudioContextConstructor();
    audioContext.addEventListener?.("statechange", handleAudioContextStateChange);
  } catch (error) {
    console.warn("Entrance sound could not be initialized:", error);
    return null;
  }

  return audioContext;
}

async function beginExperience() {
  if (experienceStarted || startRequested) return;

  startRequested = true;
  startPrompt.disabled = true;

  const context = getAudioContext();
  if (context) {
    try {
      const resumePromise = context.state === "running"
        ? Promise.resolve()
        : context.resume();
      await resumePromise;
      audioUnlocked = context.state === "running";
    } catch (error) {
      audioUnlocked = false;
      console.info("Entrance sound could not be unlocked; continuing without audio:", error);
    }
  }

  experienceStarted = true;
  startPrompt.classList.add("is-dismissed");
  startPrompt.setAttribute("aria-hidden", "true");
  window.setTimeout(() => {
    startPrompt.hidden = true;
  }, 260);

  startAnimation({ enter: true });
}

function handleAudioContextStateChange() {
  if (
    audioContext
    && audioContext.state === "running"
    && soundPending
    && !soundPlayed
    && isVisible
  ) {
    attemptEntranceSound();
  }
}

function stopEntranceSound() {
  if (!audioContext || !activeSoundMaster || audioContext.state === "closed") {
    activeSoundMaster = null;
    activeSoundSources = [];
    return;
  }

  const now = audioContext.currentTime;
  try {
    activeSoundMaster.gain.cancelScheduledValues(now);
    activeSoundMaster.gain.setValueAtTime(0.0001, now);
  } catch {
  }

  const stopAt = now + (audioContext.state === "running" ? 0.12 : 0.01);
  for (const source of activeSoundSources) {
    try {
      source.stop(stopAt);
    } catch {
    }
  }

  activeSoundMaster = null;
  activeSoundSources = [];
}

function playStoneDrag(durationSeconds) {
  if (
    !audioContext
    || audioContext.state !== "running"
    || soundPlayed
    || REDUCED_MOTION.matches
  ) {
    return false;
  }

  const context = audioContext;
  const duration = Math.max(0.65, durationSeconds);
  const startAt = context.currentTime + 0.035;
  const endAt = startAt + duration;

  const master = context.createGain();
  master.gain.setValueAtTime(0.0001, startAt);
  master.gain.linearRampToValueAtTime(0.36, startAt + 0.14);
  master.gain.setValueAtTime(0.32, Math.max(startAt + 0.2, endAt - 0.42));
  master.gain.linearRampToValueAtTime(0.0001, endAt);
  master.connect(context.destination);

  const frameCount = Math.ceil(context.sampleRate * duration);
  const noiseBuffer = context.createBuffer(1, frameCount, context.sampleRate);
  const noise = noiseBuffer.getChannelData(0);
  let seed = 0x6d2b79f5;
  for (let i = 0; i < frameCount; i += 1) {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    noise[i] = ((seed >>> 0) / 0xffffffff) * 2 - 1;
  }

  const noiseSource = context.createBufferSource();
  noiseSource.buffer = noiseBuffer;

  const scrapeFilter = context.createBiquadFilter();
  scrapeFilter.type = "bandpass";
  scrapeFilter.Q.setValueAtTime(0.82, startAt);
  scrapeFilter.frequency.setValueAtTime(680, startAt);
  scrapeFilter.frequency.linearRampToValueAtTime(310, startAt + duration * 0.46);
  scrapeFilter.frequency.linearRampToValueAtTime(570, endAt - 0.12);

  const scrapeGain = context.createGain();
  scrapeGain.gain.setValueAtTime(0.0001, startAt);
  scrapeGain.gain.linearRampToValueAtTime(0.22, startAt + 0.22);
  scrapeGain.gain.linearRampToValueAtTime(0.12, startAt + duration * 0.48);
  scrapeGain.gain.linearRampToValueAtTime(0.19, endAt - 0.36);
  scrapeGain.gain.linearRampToValueAtTime(0.0001, endAt);

  const rumbleFilter = context.createBiquadFilter();
  rumbleFilter.type = "lowpass";
  rumbleFilter.frequency.setValueAtTime(155, startAt);
  rumbleFilter.frequency.linearRampToValueAtTime(92, endAt);
  const rumbleGain = context.createGain();
  rumbleGain.gain.setValueAtTime(0.0001, startAt);
  rumbleGain.gain.linearRampToValueAtTime(0.2, startAt + 0.3);
  rumbleGain.gain.linearRampToValueAtTime(0.12, endAt - 0.35);
  rumbleGain.gain.linearRampToValueAtTime(0.0001, endAt);

  noiseSource.connect(scrapeFilter);
  scrapeFilter.connect(scrapeGain);
  scrapeGain.connect(master);
  noiseSource.connect(rumbleFilter);
  rumbleFilter.connect(rumbleGain);
  rumbleGain.connect(master);

  const bodyOscillator = context.createOscillator();
  bodyOscillator.type = "sine";
  bodyOscillator.frequency.setValueAtTime(48, startAt);
  bodyOscillator.frequency.linearRampToValueAtTime(34, startAt + duration * 0.58);
  bodyOscillator.frequency.linearRampToValueAtTime(40, endAt);
  const bodyGain = context.createGain();
  bodyGain.gain.setValueAtTime(0.0001, startAt);
  bodyGain.gain.linearRampToValueAtTime(0.105, startAt + 0.16);
  bodyGain.gain.linearRampToValueAtTime(0.065, endAt - 0.3);
  bodyGain.gain.linearRampToValueAtTime(0.0001, endAt);
  bodyOscillator.connect(bodyGain);
  bodyGain.connect(master);

  const secondaryOscillator = context.createOscillator();
  secondaryOscillator.type = "triangle";
  secondaryOscillator.frequency.setValueAtTime(73, startAt);
  secondaryOscillator.frequency.linearRampToValueAtTime(61, endAt);
  const secondaryGain = context.createGain();
  secondaryGain.gain.setValueAtTime(0.0001, startAt);
  secondaryGain.gain.linearRampToValueAtTime(0.025, startAt + 0.18);
  secondaryGain.gain.linearRampToValueAtTime(0.0001, endAt);
  secondaryOscillator.connect(secondaryGain);
  secondaryGain.connect(master);

  const thud = (when, frequency, peak) => {
    const oscillator = context.createOscillator();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(frequency, when);
    oscillator.frequency.exponentialRampToValueAtTime(Math.max(20, frequency * 0.58), when + 0.24);
    const gain = context.createGain();
    gain.gain.setValueAtTime(0.0001, when);
    gain.gain.linearRampToValueAtTime(peak, when + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.34);
    oscillator.connect(gain);
    gain.connect(master);
    oscillator.start(when);
    oscillator.stop(when + 0.36);
    activeSoundSources.push(oscillator);
  };

  noiseSource.start(startAt);
  noiseSource.stop(endAt + 0.04);
  bodyOscillator.start(startAt);
  bodyOscillator.stop(endAt + 0.04);
  secondaryOscillator.start(startAt);
  secondaryOscillator.stop(endAt + 0.04);
  activeSoundSources = [noiseSource, bodyOscillator, secondaryOscillator];

  thud(startAt + 0.025, 57, 0.16);
  thud(startAt + Math.min(1.25, duration * 0.36), 43, 0.075);

  activeSoundMaster = master;
  soundPlayed = true;
  soundPending = false;

  window.setTimeout(() => {
    if (activeSoundMaster === master) {
      activeSoundMaster = null;
      activeSoundSources = [];
    }
    try {
      scrapeFilter.disconnect();
      scrapeGain.disconnect();
      rumbleFilter.disconnect();
      rumbleGain.disconnect();
      bodyGain.disconnect();
      secondaryGain.disconnect();
      master.disconnect();
    } catch {
    }
  }, duration * 1000 + 250);

  return true;
}

function attemptEntranceSound() {
  if (!soundPending || soundPlayed || REDUCED_MOTION.matches || !isVisible) return;

  const elapsedMs = performance.now() - soundTargetAt;
  if (elapsedMs < 0) return;

  const remainingMs = SOUND_LEAD_MS + ENTRY_DURATION - elapsedMs;
  if (remainingMs <= 0) {
    soundPending = false;
    return;
  }

  const context = getAudioContext();
  if (!context || context.state !== "running") return;

  playStoneDrag(remainingMs / 1000);
}

function scheduleEntranceSound() {
  if (!audioUnlocked || soundPlayed || REDUCED_MOTION.matches) return;

  soundPending = true;
  soundTargetAt = performance.now() + START_DELAY - SOUND_LEAD_MS;

  if (soundTimer) window.clearTimeout(soundTimer);
  soundTimer = window.setTimeout(() => {
    soundTimer = 0;
    attemptEntranceSound();
  }, Math.max(0, soundTargetAt - performance.now()));
}

function cancelPendingEntranceSound() {
  if (soundTimer) window.clearTimeout(soundTimer);
  soundTimer = 0;
  soundPending = false;
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

  const nextFontSize = getFontSize(targetColumns, targetRows);
  const fontChanged = currentFontSize === null || Math.abs(nextFontSize - currentFontSize) > 0.02;
  currentFontSize = nextFontSize;
  output.style.setProperty("--art-size", nextFontSize.toFixed(3) + "px");

  if (!gridChanged) return fontChanged;

  columns = targetColumns;
  rows = targetRows;
  pixels = new Uint8Array(columns * rows);

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
  if (soundTimer) window.clearTimeout(soundTimer);
  soundTimer = 0;
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

  if (isMoving) {
    for (let x = 0; x < columns; x += 1) {
      const distance = (fields.horizontal[x] - sweepPosition) / 0.24;
      fields.sweep[x] = Math.exp(-0.5 * distance * distance);
    }
  }

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

  if (entranceAnimation && entranceStarted) {
    entranceAnimation.play();
    animationStartedAt = performance.now() - animationElapsed;
    lastFrameAt = animationStartedAt;
    if (soundPending && !soundPlayed) {
      soundTimer = window.setTimeout(attemptEntranceSound, Math.max(0, soundTargetAt - performance.now()));
    }
    animationFrame = requestAnimationFrame(animate);
    return;
  }

  const shouldEnter = enter && !hasEntered;
  const entranceOffset = shouldEnter ? placeArtBelowViewport() : null;

  if (!shouldEnter) setArtAtRest();
  renderFrame(animationElapsed, false);
  if (shouldEnter) scheduleEntranceSound();

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

  if (!experienceStarted) {
    if (REDUCED_MOTION.matches) {
      experienceStarted = true;
      startPrompt.hidden = true;
      startAnimation({ enter: true });
    } else {
      placeArtBelowViewport();
      renderFrame(0, false);
    }
    return;
  }

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

    if (REDUCED_MOTION.matches) {
      experienceStarted = true;
      startPrompt.hidden = true;
      startAnimation({ enter: true });
    } else {
      placeArtBelowViewport();
      renderFrame(0, false);
      startPrompt.hidden = false;
    }
  } catch (error) {
    console.error("ASCII artwork failed to load:", error);
    artText.data = "";
  }
}

if (typeof ResizeObserver === "function") {
  const resizeObserver = new ResizeObserver(refreshLayout);
  resizeObserver.observe(stage);
}

const handleMotionPreferenceChange = () => {
  stopAnimationLoop();

  if (REDUCED_MOTION.matches) {
    cancelPendingEntranceSound();
    stopEntranceSound();
    experienceStarted = true;
    startPrompt.hidden = true;
    hasEntered = true;
    animationElapsed = 0;
    setArtAtRest();
    renderFrame(0, false);
  } else if (!startRequested) {
    experienceStarted = false;
    hasEntered = false;
    startPrompt.hidden = false;
    placeArtBelowViewport();
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
    stopEntranceSound();
    if (entranceAnimation) entranceAnimation.pause();
  } else if (experienceStarted) {
    startAnimation({ enter: !hasEntered });
  }
});

window.addEventListener("resize", refreshLayout, { passive: true });
startPrompt.addEventListener("click", beginExperience);
loadArtworkMap();
