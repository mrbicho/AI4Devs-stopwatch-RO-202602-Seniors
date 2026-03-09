/* ═══════════════════════════════════════════════════════
   CHRONOS — Timer Logic
   ═══════════════════════════════════════════════════════ */

// ── Mode Switch ──────────────────────────────────────────
function switchMode(mode) {
  document.getElementById('panel-stopwatch').classList.toggle('hidden', mode !== 'stopwatch');
  document.getElementById('panel-countdown').classList.toggle('hidden', mode !== 'countdown');
  document.getElementById('btn-stopwatch').classList.toggle('active', mode === 'stopwatch');
  document.getElementById('btn-countdown').classList.toggle('active', mode === 'countdown');
}

// ═══════════════════════════════════════════════════════
//  STOPWATCH
// ═══════════════════════════════════════════════════════
let swRunning    = false;
let swStartTime  = 0;
let swElapsed    = 0;
let swRafId      = null;

const swMainEl   = document.getElementById('sw-main');
const swMsEl     = document.getElementById('sw-ms');
const swDisplayEl= document.getElementById('sw-display');
const swStartBtn = document.getElementById('sw-startbtn');
const swDotEl    = document.getElementById('sw-dot');
const swStatusEl = document.getElementById('sw-status');

function swToggle() {
  if (swRunning) {
    swStop();
  } else {
    swStart();
  }
}

function swStart() {
  swRunning   = true;
  swStartTime = performance.now() - swElapsed;

  swStartBtn.classList.add('stop-mode');
  swStartBtn.querySelector('.btn-label').textContent = 'STOP';

  swDisplayEl.classList.add('running');
  swDotEl.classList.add('active');
  swStatusEl.classList.add('active');
  swStatusEl.textContent = 'RUNNING';

  swRafId = requestAnimationFrame(swTick);
}

function swStop() {
  swRunning = false;
  cancelAnimationFrame(swRafId);

  swStartBtn.classList.remove('stop-mode');
  swStartBtn.querySelector('.btn-label').textContent = 'START';

  swDisplayEl.classList.remove('running');
  swDotEl.classList.remove('active');
  swStatusEl.classList.remove('active');
  swStatusEl.textContent = swElapsed > 0 ? 'PAUSED' : 'READY';
}

function swClear() {
  swStop();
  swElapsed = 0;
  swRenderTime(0, swMainEl, swMsEl);
  swStatusEl.textContent = 'READY';
}

function swTick(now) {
  if (!swRunning) return;
  swElapsed = now - swStartTime;
  swRenderTime(swElapsed, swMainEl, swMsEl);
  swRafId = requestAnimationFrame(swTick);
}

// ═══════════════════════════════════════════════════════
//  COUNTDOWN
// ═══════════════════════════════════════════════════════
let cdRunning     = false;
let cdStartTime   = 0;
let cdRemaining   = 0;   // ms — time left at last pause/start
let cdSetTotal    = 0;   // ms — anchors tick math each run segment
let cdResetTarget = 0;   // ms — original configured duration, for Reset
let cdRafId       = null;
let beepPlayed    = false;

const cdMainEl    = document.getElementById('cd-main');
const cdMsEl      = document.getElementById('cd-ms');
const cdDisplayEl = document.getElementById('cd-display');
const cdStartBtn  = document.getElementById('cd-startbtn');
const cdDotEl     = document.getElementById('cd-dot');
const cdStatusEl  = document.getElementById('cd-status');
const cdSetterEl  = document.getElementById('cd-setter');
const cdAlertEl   = document.getElementById('cd-alert');
const cdHours     = document.getElementById('cd-hours');
const cdMinutes   = document.getElementById('cd-minutes');
const cdSeconds   = document.getElementById('cd-seconds');

// Pre-fill display from inputs
cdHours.addEventListener('input', cdUpdateDisplay);
cdMinutes.addEventListener('input', cdUpdateDisplay);
cdSeconds.addEventListener('input', cdUpdateDisplay);

function cdUpdateDisplay() {
  if (!cdRunning) {
    const ms = cdGetInputMs();
    swRenderTime(ms, cdMainEl, cdMsEl);
  }
}

function cdGetInputMs() {
  const h = clamp(parseInt(cdHours.value)   || 0, 0, 99);
  const m = clamp(parseInt(cdMinutes.value) || 0, 0, 59);
  const s = clamp(parseInt(cdSeconds.value) || 0, 0, 59);
  return (h * 3600 + m * 60 + s) * 1000;
}

function cdToggle() {
  if (cdRunning) {
    cdStop();
  } else {
    cdStart();
  }
}

function cdStart() {
  const resuming = cdRemaining > 0;
  const totalMs  = resuming ? cdRemaining : cdGetInputMs();
  if (totalMs <= 0) return;

  if (!resuming) cdResetTarget = totalMs;  // only record original duration on a fresh start
  cdSetTotal   = totalMs;   // anchor tick math to current remaining for this run segment
  cdRemaining  = totalMs;
  cdRunning    = true;
  cdStartTime  = performance.now();
  beepPlayed   = false;

  cdStartBtn.classList.add('stop-mode');
  cdStartBtn.querySelector('.btn-label').textContent = 'STOP';
  cdSetInputsDisabled(true);

  const isWarn = cdRemaining <= 10000;
  setCountdownState(isWarn ? 'warn' : 'running');

  cdRafId = requestAnimationFrame(cdTick);
}

function cdStop() {
  cdRunning = false;
  cancelAnimationFrame(cdRafId);

  cdStartBtn.classList.remove('stop-mode');
  cdStartBtn.querySelector('.btn-label').textContent = cdRemaining > 0 ? 'RESUME' : 'START';
  cdSetInputsDisabled(false);

  cdDisplayEl.classList.remove('running', 'countdown-warn', 'done');
  cdDotEl.classList.remove('active', 'warn', 'done');
  cdStatusEl.classList.remove('active', 'warn', 'done');
  cdStatusEl.textContent = 'PAUSED';
}

function cdReset() {
  cdRemaining = 0;          // clear so cdStop shows START label
  cdStop();
  cdAlertEl.classList.add('hidden');
  cdDisplayEl.classList.remove('done');
  cdRemaining = cdResetTarget;
  swRenderTime(cdResetTarget || cdGetInputMs(), cdMainEl, cdMsEl);
  cdStatusEl.textContent = 'SET TIME';
}

function cdTick(now) {
  if (!cdRunning) return;

  const delta   = now - cdStartTime;
  cdRemaining   = cdSetTotal - delta;

  if (cdRemaining <= 0) {
    cdRemaining = 0;
    swRenderTime(0, cdMainEl, cdMsEl);
    cdFinish();
    return;
  }

  swRenderTime(cdRemaining, cdMainEl, cdMsEl);

  // Warn at last 10 seconds
  if (cdRemaining <= 10000) {
    setCountdownState('warn');
  }

  cdRafId = requestAnimationFrame(cdTick);
}

function cdFinish() {
  cdRunning = false;
  cdStartBtn.classList.remove('stop-mode');
  cdStartBtn.querySelector('.btn-label').textContent = 'START';
  cdSetInputsDisabled(false);

  setCountdownState('done');
  cdAlertEl.classList.remove('hidden');
  playBeep();
}

function cdDismiss() {
  cdAlertEl.classList.add('hidden');
  cdDisplayEl.classList.remove('done');
  setCountdownState('idle');
  cdStatusEl.textContent = 'SET TIME';
  swRenderTime(cdSetTotal, cdMainEl, cdMsEl);
}

function setCountdownState(state) {
  cdDisplayEl.classList.remove('running', 'countdown-warn', 'done');
  cdDotEl.classList.remove('active', 'warn', 'done');
  cdStatusEl.classList.remove('active', 'warn', 'done');

  if (state === 'running') {
    cdDisplayEl.classList.add('running');
    cdDotEl.classList.add('active');
    cdStatusEl.classList.add('active');
    cdStatusEl.textContent = 'RUNNING';
  } else if (state === 'warn') {
    cdDisplayEl.classList.add('countdown-warn');
    cdDotEl.classList.add('warn');
    cdStatusEl.classList.add('warn');
    cdStatusEl.textContent = 'WARNING';
  } else if (state === 'done') {
    cdDisplayEl.classList.add('done');
    cdDotEl.classList.add('done');
    cdStatusEl.classList.add('done');
    cdStatusEl.textContent = 'DONE';
  }
}

function cdSetInputsDisabled(disabled) {
  cdHours.disabled   = disabled;
  cdMinutes.disabled = disabled;
  cdSeconds.disabled = disabled;
}

// ═══════════════════════════════════════════════════════
//  SHARED: Time Renderer
// ═══════════════════════════════════════════════════════
function swRenderTime(ms, mainEl, msEl) {
  const totalMs  = Math.max(0, Math.floor(ms));
  const hours    = Math.floor(totalMs / 3_600_000);
  const minutes  = Math.floor((totalMs % 3_600_000) / 60_000);
  const seconds  = Math.floor((totalMs % 60_000) / 1_000);
  const millis   = totalMs % 1_000;

  mainEl.textContent = pad2(hours) + ':' + pad2(minutes) + ':' + pad2(seconds);
  msEl.textContent   = pad3(millis);
}

// ═══════════════════════════════════════════════════════
//  BEEP (Web Audio API)
// ═══════════════════════════════════════════════════════
function playBeep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();

    // Three rapid beeps
    [0, 0.22, 0.44].forEach(offset => {
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.type      = 'square';
      osc.frequency.setValueAtTime(880, ctx.currentTime + offset);

      gain.gain.setValueAtTime(0, ctx.currentTime + offset);
      gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + offset + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + 0.18);

      osc.start(ctx.currentTime + offset);
      osc.stop(ctx.currentTime + offset + 0.2);
    });

    // Long final beep
    const osc2  = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(660, ctx.currentTime + 0.7);
    gain2.gain.setValueAtTime(0, ctx.currentTime + 0.7);
    gain2.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 0.71);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.5);
    osc2.start(ctx.currentTime + 0.7);
    osc2.stop(ctx.currentTime + 1.6);

  } catch(e) {
    console.warn('Audio playback failed:', e);
  }
}

// ═══════════════════════════════════════════════════════
//  UTILS
// ═══════════════════════════════════════════════════════
const pad2 = n => String(n).padStart(2, '0');
const pad3 = n => String(n).padStart(3, '0');
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

// Init countdown display
swRenderTime(cdGetInputMs(), cdMainEl, cdMsEl);