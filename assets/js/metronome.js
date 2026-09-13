/**
 * metronome.js
 * A real Web Audio API metronome.
 *
 * Timing approach ("lookahead scheduler"): a fast setInterval loop
 * repeatedly schedules any upcoming clicks that fall within a short
 * lookahead window using precise AudioContext time, rather than
 * relying on setInterval itself to fire audio — this keeps the
 * click timing accurate even if the browser's timer jitters.
 *
 * This file is unchanged from the previous version — the redesign
 * was CSS/HTML-only. Hook IDs and class names are preserved so
 * behavior stays identical.
 */
(function () {
  'use strict';

  var MIN_BPM = 40;
  var MAX_BPM = 240;
  var DEFAULT_BPM = 100;
  var BEATS_PER_BAR = 4;
  var LOOKAHEAD_MS = 25;
  var SCHEDULE_AHEAD_SEC = 0.12;
  var TAP_RESET_MS = 2000;
  var TAP_MAX_SAMPLES = 6;

  var els = {};

  var state = {
    bpm: DEFAULT_BPM,
    subdivision: 'none',
    isRunning: false,
    audioCtx: null,
    schedulerTimer: null,
    nextNoteTime: 0,
    currentBeat: 0,
    currentSub: 0,
    visualQueue: [],
    rafId: null,
    tapTimes: []
  };

  function subdivisionCount() {
    if (state.subdivision === '8th') { return 2; }
    if (state.subdivision === '16th') { return 4; }
    return 1;
  }

  function clampBpm(value) {
    return Math.min(MAX_BPM, Math.max(MIN_BPM, Math.round(value)));
  }

  // ---------------------------------------------------------------
  // Audio
  // ---------------------------------------------------------------

  function ensureAudioContext() {
    if (!state.audioCtx) {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      state.audioCtx = new Ctx();
    }
    if (state.audioCtx.state === 'suspended') {
      state.audioCtx.resume();
    }
  }

  function scheduleClick(time, isBeatOne, isSubBeat) {
    var ctx = state.audioCtx;
    var osc = ctx.createOscillator();
    var gain = ctx.createGain();

    var freq = isBeatOne ? 1400 : (isSubBeat ? 700 : 1000);
    var peakVolume = isBeatOne ? 0.9 : (isSubBeat ? 0.35 : 0.65);

    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, time);

    gain.gain.setValueAtTime(0.0001, time);
    gain.gain.exponentialRampToValueAtTime(peakVolume, time + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(time);
    osc.stop(time + 0.06);
  }

  // ---------------------------------------------------------------
  // Scheduler
  // ---------------------------------------------------------------

  function scheduleNote() {
    var isBeatOne = state.currentBeat === 0 && state.currentSub === 0;
    var isMainBeat = state.currentSub === 0;
    var isSubBeat = !isMainBeat;

    scheduleClick(state.nextNoteTime, isBeatOne, isSubBeat);

    state.visualQueue.push({
      time: state.nextNoteTime,
      beat: state.currentBeat,
      isBeatOne: isBeatOne,
      isMainBeat: isMainBeat
    });

    advanceNote();
  }

  function advanceNote() {
    var secondsPerBeat = 60.0 / state.bpm;
    var subCount = subdivisionCount();
    var secondsPerSub = secondsPerBeat / subCount;

    state.nextNoteTime += secondsPerSub;
    state.currentSub++;

    if (state.currentSub >= subCount) {
      state.currentSub = 0;
      state.currentBeat = (state.currentBeat + 1) % BEATS_PER_BAR;
    }
  }

  function schedulerLoop() {
    while (state.nextNoteTime < state.audioCtx.currentTime + SCHEDULE_AHEAD_SEC) {
      scheduleNote();
    }
  }

  function visualLoop() {
    if (!state.isRunning) {
      return;
    }
    var now = state.audioCtx.currentTime;
    while (state.visualQueue.length && state.visualQueue[0].time <= now) {
      var note = state.visualQueue.shift();
      if (note.isMainBeat) {
        flashBeatDot(note.beat);
      }
    }
    state.rafId = requestAnimationFrame(visualLoop);
  }

  function flashBeatDot(beatIndex) {
    if (!els.beatDots || !els.beatDots.length) {
      return;
    }
    els.beatDots.forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === beatIndex);
    });
    window.clearTimeout(flashBeatDot._timer);
    flashBeatDot._timer = window.setTimeout(function () {
      els.beatDots.forEach(function (dot) { dot.classList.remove('is-active'); });
    }, Math.max(80, (60000 / state.bpm) * 0.35));
  }

  // ---------------------------------------------------------------
  // Start / Stop
  // ---------------------------------------------------------------

  function start() {
    if (state.isRunning) {
      return;
    }
    ensureAudioContext();
    state.isRunning = true;
    state.currentBeat = 0;
    state.currentSub = 0;
    state.visualQueue = [];
    state.nextNoteTime = state.audioCtx.currentTime + 0.05;

    state.schedulerTimer = window.setInterval(schedulerLoop, LOOKAHEAD_MS);
    state.rafId = requestAnimationFrame(visualLoop);

    updateStartStopUI();
  }

  function stop() {
    state.isRunning = false;
    if (state.schedulerTimer) {
      window.clearInterval(state.schedulerTimer);
      state.schedulerTimer = null;
    }
    if (state.rafId) {
      cancelAnimationFrame(state.rafId);
      state.rafId = null;
    }
    if (els.beatDots) {
      els.beatDots.forEach(function (dot) { dot.classList.remove('is-active'); });
    }
    updateStartStopUI();
  }

  function updateStartStopUI() {
    if (!els.startStopBtn) {
      return;
    }
    els.startStopBtn.textContent = state.isRunning ? 'Stop' : 'Start';
    els.startStopBtn.classList.toggle('btn-outline', state.isRunning);
    els.startStopBtn.classList.toggle('btn-primary', !state.isRunning);
    if (els.statusEl) {
      els.statusEl.textContent = state.isRunning
        ? 'Playing at ' + state.bpm + ' BPM.'
        : 'Stopped. Tap Start when you\u2019re ready to practice.';
    }
  }

  // ---------------------------------------------------------------
  // BPM controls
  // ---------------------------------------------------------------

  function setBpm(newBpm) {
    state.bpm = clampBpm(newBpm);
    if (els.bpmValue) {
      els.bpmValue.textContent = state.bpm;
    }
    if (state.isRunning && els.statusEl) {
      els.statusEl.textContent = 'Playing at ' + state.bpm + ' BPM.';
    }
  }

  function changeBpm(delta) {
    setBpm(state.bpm + delta);
  }

  // ---------------------------------------------------------------
  // Tap tempo
  // ---------------------------------------------------------------

  function handleTapTempo() {
    var now = Date.now();
    var last = state.tapTimes[state.tapTimes.length - 1];

    if (last && (now - last) > TAP_RESET_MS) {
      state.tapTimes = [];
    }

    state.tapTimes.push(now);
    if (state.tapTimes.length > TAP_MAX_SAMPLES) {
      state.tapTimes.shift();
    }

    if (state.tapTimes.length < 2) {
      if (els.statusEl) {
        els.statusEl.textContent = 'Tap a few more times to set the tempo\u2026';
      }
      return;
    }

    var intervals = [];
    for (var i = 1; i < state.tapTimes.length; i++) {
      intervals.push(state.tapTimes[i] - state.tapTimes[i - 1]);
    }
    var avgMs = intervals.reduce(function (a, b) { return a + b; }, 0) / intervals.length;
    var tappedBpm = 60000 / avgMs;

    setBpm(tappedBpm);
  }

  // ---------------------------------------------------------------
  // Subdivision selection
  // ---------------------------------------------------------------

  function setSubdivision(value, buttons) {
    state.subdivision = value;
    buttons.forEach(function (btn) {
      var isActive = btn.getAttribute('data-subdivision') === value;
      btn.classList.toggle('is-active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  }

  // ---------------------------------------------------------------
  // Wiring
  // ---------------------------------------------------------------

  document.addEventListener('DOMContentLoaded', function () {
    els.bpmValue = document.getElementById('bpmValue');
    els.startStopBtn = document.getElementById('startStopBtn');
    els.tapBtn = document.getElementById('tapTempoBtn');
    els.statusEl = document.getElementById('metronomeStatus');
    els.beatDots = Array.prototype.slice.call(document.querySelectorAll('.beat-dot'));

    if (!els.startStopBtn) {
      return;
    }

    var bpmDownBtn = document.getElementById('bpmDown');
    var bpmUpBtn = document.getElementById('bpmUp');
    var bpmDown5Btn = document.getElementById('bpmDown5');
    var bpmUp5Btn = document.getElementById('bpmUp5');
    var subdivisionButtons = Array.prototype.slice.call(document.querySelectorAll('.subdivision-btn'));

    setBpm(state.bpm);
    setSubdivision('none', subdivisionButtons);

    if (bpmDownBtn) { bpmDownBtn.addEventListener('click', function () { changeBpm(-1); }); }
    if (bpmUpBtn) { bpmUpBtn.addEventListener('click', function () { changeBpm(1); }); }
    if (bpmDown5Btn) { bpmDown5Btn.addEventListener('click', function () { changeBpm(-5); }); }
    if (bpmUp5Btn) { bpmUp5Btn.addEventListener('click', function () { changeBpm(5); }); }

    els.startStopBtn.addEventListener('click', function () {
      if (state.isRunning) {
        stop();
      } else {
        start();
      }
    });

    if (els.tapBtn) {
      els.tapBtn.addEventListener('click', handleTapTempo);
    }

    subdivisionButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        setSubdivision(btn.getAttribute('data-subdivision'), subdivisionButtons);
      });
    });

    window.addEventListener('pagehide', stop);
  });
})();