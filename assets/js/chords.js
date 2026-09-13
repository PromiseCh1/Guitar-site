/**
 * chords.js
 * Chord-specific interactions:
 *   - chord data (major, minor, power)
 *   - SVG chord diagram rendering (colored fingers + fret numbers)
 *   - major/minor/power tab switching
 *   - chord grid + selected chord panel
 *   - practice progressions with audio playback AND a live
 *     visual highlight that follows the currently-playing chord
 *
 * Audio is synthesized with the Web Audio API — no external files.
 *
 * String order, low to high: [E, A, D, G, B, e]
 * fret:  null = muted, 0 = open, N = fretted at fret N
 * finger: 0 = none, 1-4 = index/middle/ring/pinky
 */
(function () {
  'use strict';

  // ---------------------------------------------------------------
  // 1. CHORD DATA
  // ---------------------------------------------------------------
  var CHORDS = [
    // ---------------- MAJOR ----------------
    { id: 'E', name: 'E Major', type: 'major', startFret: 1,
      frets:   [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0], barre: null,
      tip: 'Curl your fingers so the open high E and B strings ring clearly.' },

    { id: 'A', name: 'A Major', type: 'major', startFret: 1,
      frets:   [null, 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0], barre: null,
      tip: 'Squeeze your three middle fingers close together on the 2nd fret.' },

    { id: 'D', name: 'D Major', type: 'major', startFret: 1,
      frets:   [null, null, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2], barre: null,
      tip: 'Keep your thumb low so you can angle your fingers onto the top 3 strings.' },

    { id: 'G', name: 'G Major', type: 'major', startFret: 1,
      frets:   [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3], barre: null,
      tip: 'Stretch your ring finger to the high E string without muting the B string.' },

    { id: 'C', name: 'C Major', type: 'major', startFret: 1,
      frets:   [null, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0], barre: null,
      tip: 'Arch your fingers so the open G and high E strings ring clearly.' },

    { id: 'F', name: 'F Major', type: 'major', startFret: 1,
      frets:   [1, 3, 3, 2, 1, 1], fingers: [1, 3, 4, 2, 1, 1],
      barre: { fret: 1, finger: 1, from: 0, to: 5 },
      tip: 'Roll the side of your index finger flat across all 6 strings. This one takes practice — don\u2019t rush it.' },

    { id: 'B', name: 'B Major', type: 'major', startFret: 2,
      frets:   [null, 2, 4, 4, 4, 2], fingers: [0, 1, 3, 3, 3, 1],
      barre: { fret: 2, finger: 1, from: 1, to: 5 },
      tip: 'Barre with your index finger, then press D, G and B strings flat with your ring finger.' },

    // ---------------- MINOR ----------------
    { id: 'Am', name: 'A Minor', type: 'minor', startFret: 1,
      frets:   [null, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0], barre: null,
      tip: 'Almost the same shape as E Major, just moved over one string.' },

    { id: 'Bm', name: 'B Minor', type: 'minor', startFret: 2,
      frets:   [null, 2, 4, 4, 3, 2], fingers: [0, 1, 3, 4, 2, 1],
      barre: { fret: 2, finger: 1, from: 1, to: 5 },
      tip: 'Barre the 2nd fret first, then drop your other fingers on top one at a time.' },

    { id: 'Cm', name: 'C Minor', type: 'minor', startFret: 3,
      frets:   [null, 3, 5, 5, 4, 3], fingers: [0, 1, 3, 4, 2, 1],
      barre: { fret: 3, finger: 1, from: 1, to: 5 },
      tip: 'Same shape as B Minor, just shifted up one fret.' },

    { id: 'Dm', name: 'D Minor', type: 'minor', startFret: 1,
      frets:   [null, null, 0, 2, 3, 1], fingers: [0, 0, 0, 2, 3, 1], barre: null,
      tip: 'Keep your index finger flat and light on the high E string.' },

    { id: 'Em', name: 'E Minor', type: 'minor', startFret: 1,
      frets:   [0, 2, 2, 0, 0, 0], fingers: [0, 1, 2, 0, 0, 0], barre: null,
      tip: 'One of the easiest chords to start with — great for your very first strum.' },

    { id: 'Fm', name: 'F Minor', type: 'minor', startFret: 1,
      frets:   [1, 3, 3, 1, 1, 1], fingers: [1, 3, 4, 1, 1, 1],
      barre: { fret: 1, finger: 1, from: 0, to: 5 },
      tip: 'Same barre as F Major, but only two extra fingers to add on top.' },

    { id: 'Gm', name: 'G Minor', type: 'minor', startFret: 3,
      frets:   [3, 5, 5, 3, 3, 3], fingers: [1, 3, 4, 1, 1, 1],
      barre: { fret: 3, finger: 1, from: 0, to: 5 },
      tip: 'Same shape as F Minor, just shifted up two frets.' },

    // ---------------- POWER ----------------
    // Power chords are only the root, the fifth, and (optionally) the
    // octave — no third, so they work equally well over major or minor.
    // The same two-finger shape moves anywhere on the neck.

    { id: 'E5', name: 'E5 Power Chord', type: 'power', startFret: 1,
      frets:   [0, 2, 2, null, null, null], fingers: [0, 1, 3, 0, 0, 0], barre: null,
      tip: 'Open low E, then two fingers on the A and D strings. Only strum those three strings.' },

    { id: 'F5', name: 'F5 Power Chord', type: 'power', startFret: 1,
      frets:   [1, 3, 3, null, null, null], fingers: [1, 3, 4, 0, 0, 0], barre: null,
      tip: 'Same shape as E5, moved up one fret. Index on the root note.' },

    { id: 'G5', name: 'G5 Power Chord', type: 'power', startFret: 3,
      frets:   [3, 5, 5, null, null, null], fingers: [1, 3, 4, 0, 0, 0], barre: null,
      tip: 'The same movable shape, just higher up the neck. Keep your fingers relaxed.' },

    { id: 'A5', name: 'A5 Power Chord', type: 'power', startFret: 1,
      frets:   [null, 0, 2, 2, null, null], fingers: [0, 0, 1, 3, 0, 0], barre: null,
      tip: 'Root on the open A string. Two fingers on the D and G strings — that\'s it.' },

    { id: 'B5', name: 'B5 Power Chord', type: 'power', startFret: 2,
      frets:   [null, 2, 4, 4, null, null], fingers: [0, 1, 3, 4, 0, 0], barre: null,
      tip: 'A-string root shape, moved up two frets. Same fingers as A5.' },

    { id: 'C5', name: 'C5 Power Chord', type: 'power', startFret: 3,
      frets:   [null, 3, 5, 5, null, null], fingers: [0, 1, 3, 4, 0, 0], barre: null,
      tip: 'Same A-string shape, one fret up from B5. Slide the shape up or down to change chords.' },

    { id: 'D5', name: 'D5 Power Chord', type: 'power', startFret: 5,
      frets:   [null, 5, 7, 7, null, null], fingers: [0, 1, 3, 4, 0, 0], barre: null,
      tip: 'Higher up the neck. Keep your thumb behind the neck for a clean grip.' }
  ];

  // ---------------------------------------------------------------
  // 2. AUDIO — chord voicings + synth
  // ---------------------------------------------------------------
  var NOTE_FREQ = {
    'C2':  65.41, 'C#2':  69.30, 'D2':  73.42, 'D#2':  77.78,
    'E2':  82.41, 'F2':   87.31, 'F#2':  92.50, 'G2':  98.00,
    'G#2': 103.83, 'A2': 110.00, 'A#2': 116.54, 'B2': 123.47,
    'C3': 130.81, 'C#3': 138.59, 'D3': 146.83, 'D#3': 155.56,
    'E3': 164.81, 'F3':  174.61, 'F#3': 185.00, 'G3': 196.00,
    'G#3': 207.65, 'A3': 220.00, 'A#3': 233.08, 'B3': 246.94,
    'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13,
    'E4': 329.63, 'F4':  349.23, 'F#4': 369.99, 'G4': 392.00
  };

  var CHORD_NOTES = {
    // Major
    'E':  ['E2', 'B2', 'E3', 'G#3', 'B3', 'E4'],
    'A':  ['A2', 'E3', 'A3', 'C#4', 'E4'],
    'D':  ['D3', 'A3', 'D4', 'F#4'],
    'G':  ['G2', 'B2', 'D3', 'G3', 'B3', 'G4'],
    'C':  ['C3', 'E3', 'G3', 'C4', 'E4'],
    'F':  ['F2', 'C3', 'F3', 'A3', 'C4', 'F4'],
    'B':  ['B2', 'F#3', 'B3', 'D#4', 'F#4'],
    // Minor
    'Am': ['A2', 'E3', 'A3', 'C4', 'E4'],
    'Bm': ['B2', 'F#3', 'B3', 'D4', 'F#4'],
    'Cm': ['C3', 'G3', 'C4', 'D#4', 'G4'],
    'Dm': ['D3', 'A3', 'D4', 'F4'],
    'Em': ['E2', 'B2', 'E3', 'G3', 'B3', 'E4'],
    'Fm': ['F2', 'C3', 'F3', 'G#3', 'C4', 'F4'],
    'Gm': ['G2', 'D3', 'G3', 'A#3', 'D4', 'G4'],
    // Power (root + fifth + octave — no third)
    'E5': ['E2', 'B2', 'E3'],
    'F5': ['F2', 'C3', 'F3'],
    'G5': ['G2', 'D3', 'G3'],
    'A5': ['A2', 'E3', 'A3'],
    'B5': ['B2', 'F#3', 'B3'],
    'C5': ['C3', 'G3', 'C4'],
    'D5': ['D3', 'A3', 'D4']
  };

  // Playback pacing
  var CHORD_DURATION_SEC = 1.9;
  var AUDIO_LEAD_IN_SEC  = 0.08;
  var CHORD_DURATION_MS  = CHORD_DURATION_SEC * 1000;
  var AUDIO_LEAD_IN_MS   = AUDIO_LEAD_IN_SEC * 1000;

  var audioCtx = null;
  var activeOscillators = [];
  var currentPlaybackTimer = null;
  var currentPlayingBtn = null;
  var currentHighlightTimers = [];

  function ensureAudio() {
    if (!audioCtx) {
      var Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) { return false; }
      audioCtx = new Ctx();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return true;
  }

  function playNote(freq, startTime, duration, volume) {
    var ctx = audioCtx;

    var osc1 = ctx.createOscillator();
    var osc2 = ctx.createOscillator();
    var gain = ctx.createGain();
    var filter = ctx.createBiquadFilter();

    osc1.type = 'triangle';
    osc1.frequency.value = freq;

    osc2.type = 'sine';
    osc2.frequency.value = freq * 2;
    osc2.detune.value = 3;

    filter.type = 'lowpass';
    filter.frequency.value = 2400;
    filter.Q.value = 0.7;

    var now = startTime;
    var attack = 0.008;
    var decay = 0.4;
    var endTime = now + duration;

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + attack);
    gain.gain.exponentialRampToValueAtTime(volume * 0.55, now + attack + decay);
    gain.gain.exponentialRampToValueAtTime(0.0001, endTime);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(endTime + 0.05);
    osc2.stop(endTime + 0.05);

    activeOscillators.push({ osc1: osc1, osc2: osc2, gain: gain });
  }

  function playChord(chordId, startTime, duration) {
    var notes = CHORD_NOTES[chordId];
    if (!notes) { return; }

    var perNoteVolume = 0.9 / Math.max(4, notes.length * 0.75);
    var strumDelay = 0.028;

    notes.forEach(function (noteName, i) {
      var freq = NOTE_FREQ[noteName];
      if (!freq) { return; }
      playNote(freq, startTime + i * strumDelay, duration, perNoteVolume);
    });
  }

  function clearChordHighlights() {
    currentHighlightTimers.forEach(function (t) { clearTimeout(t); });
    currentHighlightTimers = [];
    var lit = document.querySelectorAll('.progression-chord-btn.is-playing-chord');
    for (var i = 0; i < lit.length; i++) {
      lit[i].classList.remove('is-playing-chord');
    }
  }

  function stopAllAudio() {
    if (audioCtx) {
      var now = audioCtx.currentTime;
      activeOscillators.forEach(function (item) {
        try {
          item.gain.gain.cancelScheduledValues(now);
          item.gain.gain.setValueAtTime(
            Math.max(item.gain.gain.value, 0.0001), now);
          item.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
          item.osc1.stop(now + 0.07);
          item.osc2.stop(now + 0.07);
        } catch (e) { /* already stopped */ }
      });
    }
    activeOscillators = [];

    if (currentPlaybackTimer) {
      clearTimeout(currentPlaybackTimer);
      currentPlaybackTimer = null;
    }
    if (currentPlayingBtn) {
      setPlayBtnState(currentPlayingBtn, false);
      currentPlayingBtn = null;
    }
    clearChordHighlights();
  }

  function setPlayBtnState(btn, isPlaying) {
    btn.classList.toggle('is-playing', isPlaying);
    var label = btn.querySelector('.play-btn-label');
    if (label) {
      label.textContent = isPlaying ? 'Stop' : 'Play';
    }
    btn.setAttribute('aria-label',
      (isPlaying ? 'Stop' : 'Play') + ' progression');
  }

  function playProgression(prog, btn) {
    if (currentPlayingBtn === btn) {
      stopAllAudio();
      return;
    }
    stopAllAudio();

    if (!ensureAudio()) { return; }

    var card = btn.closest('.progression-card');
    var chordBtns = card
      ? card.querySelectorAll('.progression-chord-btn')
      : [];

    var startTime = audioCtx.currentTime + AUDIO_LEAD_IN_SEC;

    prog.chords.forEach(function (chordId, i) {
      playChord(chordId, startTime + i * CHORD_DURATION_SEC,
                CHORD_DURATION_SEC * 0.95);
    });

    prog.chords.forEach(function (chordId, i) {
      var delay = AUDIO_LEAD_IN_MS + i * CHORD_DURATION_MS;
      var timer = setTimeout(function () {
        for (var j = 0; j < chordBtns.length; j++) {
          chordBtns[j].classList.remove('is-playing-chord');
        }
        if (chordBtns[i]) {
          chordBtns[i].classList.add('is-playing-chord');
        }
      }, delay);
      currentHighlightTimers.push(timer);
    });

    var totalMs = AUDIO_LEAD_IN_MS
                + CHORD_DURATION_MS * prog.chords.length
                + 400;

    currentPlayingBtn = btn;
    setPlayBtnState(btn, true);

    currentPlaybackTimer = setTimeout(function () {
      setPlayBtnState(btn, false);
      currentPlayingBtn = null;
      currentPlaybackTimer = null;
      activeOscillators = [];
      clearChordHighlights();
    }, totalMs);
  }

  // ---------------------------------------------------------------
  // 3. PROGRESSIONS
  // ---------------------------------------------------------------
  var PROGRESSIONS = [
    {
      name: "Pop's Favorite",
      subtitle: 'Four chords, hundreds of songs',
      chords: ['Em', 'C', 'G', 'D'],
      desc: 'You\u2019ll hear this in pop, folk and rock. Start slow and switch on beat four.'
    },
    {
      name: 'Feel-Good',
      subtitle: 'Warm and bright',
      chords: ['G', 'D', 'Em', 'C'],
      desc: 'Same chords as Pop\u2019s Favorite, but starting on G. Try it with a light strum.'
    },
    {
      name: 'Doo-Wop',
      subtitle: 'Classic 1950s sound',
      chords: ['C', 'Am', 'Dm', 'G'],
      desc: 'Slow, steady switches. Great for practicing without rushing the changes.'
    },
    {
      name: 'Folk Classic',
      subtitle: 'Just three shapes',
      chords: ['D', 'A', 'G', 'A'],
      desc: 'Three chords that carry a huge number of folk and country songs.'
    },
    {
      name: 'Minor Mood',
      subtitle: 'A bit darker',
      chords: ['Am', 'Dm', 'G', 'C'],
      desc: 'Mixes minor and major shapes. Play it slowly and listen to how it feels.'
    },
    {
      name: 'Ballad',
      subtitle: 'Slow and gentle',
      chords: ['G', 'Em', 'C', 'D'],
      desc: 'A warm, sing-along progression. Perfect for your first full practice run.'
    },
    {
      name: 'Rock Power',
      subtitle: 'Power chords only',
      chords: ['E5', 'G5', 'A5', 'C5'],
      desc: 'Straight-up rock. Same two-finger shape, just moving up and down the neck.'
    },
    {
      name: 'Punk Energy',
      subtitle: 'Fast and simple',
      chords: ['A5', 'D5', 'E5', 'A5'],
      desc: 'The three power chords behind a thousand punk songs.'
    }
  ];

  var STRING_LABELS = ['E', 'A', 'D', 'G', 'B', 'e'];
  var FRETS_SHOWN = 4;

  var GENERIC_PRACTICE_STEPS = [
    'Form the chord shape with your fingers.',
    'Place your fingers one at a time, close to the fret.',
    'Play each string one by one and listen closely.',
    'Fix any string that buzzes or sounds muted.',
    'Strum all the strings slowly.',
    'Repeat until the whole chord rings clearly.'
  ];

  var SVG_NS = 'http://www.w3.org/2000/svg';

  // ---------------------------------------------------------------
  // 4. SVG HELPERS
  // ---------------------------------------------------------------
  function el(tag, attrs) {
    var node = document.createElementNS(SVG_NS, tag);
    for (var key in attrs) {
      if (Object.prototype.hasOwnProperty.call(attrs, key)) {
        node.setAttribute(key, attrs[key]);
      }
    }
    return node;
  }

  function buildChordDiagramSVG(chord, size) {
    var isSmall = (size === 'small');

    var width       = isSmall ? 150 : 220;
    var height      = isSmall ? 180 : 270;
    var leftMargin  = isSmall ? 16  : 44;
    var rightMargin = isSmall ? 12  : 20;
    var topMargin   = isSmall ? 32  : 48;
    var fretSpacing = isSmall ? 30  : 46;
    var stringGap   = (width - leftMargin - rightMargin) / (STRING_LABELS.length - 1);

    var svg = el('svg', {
      viewBox: '0 0 ' + width + ' ' + height,
      class: 'chord-diagram-svg chord-diagram-' + (size || 'large'),
      role: 'img',
      'aria-label': chord.name + ' chord diagram'
    });

    function stringX(i) { return leftMargin + i * stringGap; }
    function fretY(relRow) { return topMargin + relRow * fretSpacing; }

    if (!isSmall) {
      for (var r = 0; r < FRETS_SHOWN; r++) {
        var fretNumText = el('text', {
          x: leftMargin - 8,
          y: fretY(r + 0.5) + 4,
          class: 'chord-fret-num',
          'text-anchor': 'end'
        });
        fretNumText.textContent = chord.startFret + r;
        svg.appendChild(fretNumText);
      }
    }

    for (var row = 0; row <= FRETS_SHOWN; row++) {
      var isNut = chord.startFret === 1 && row === 0;
      svg.appendChild(el('line', {
        x1: stringX(0), x2: stringX(STRING_LABELS.length - 1),
        y1: fretY(row), y2: fretY(row),
        class: isNut ? 'chord-nut' : 'chord-fretline'
      }));
    }

    STRING_LABELS.forEach(function (label, i) {
      svg.appendChild(el('line', {
        x1: stringX(i), x2: stringX(i),
        y1: fretY(0), y2: fretY(FRETS_SHOWN),
        class: 'chord-stringline'
      }));

      var nameText = el('text', {
        x: stringX(i),
        y: fretY(FRETS_SHOWN) + (isSmall ? 14 : 18),
        class: 'chord-string-label'
      });
      nameText.textContent = label;
      svg.appendChild(nameText);

      var fretVal = chord.frets[i];
      if (fretVal === null) {
        var mute = el('text', {
          x: stringX(i),
          y: topMargin - (isSmall ? 12 : 18),
          class: 'chord-mute-marker'
        });
        mute.textContent = '\u00D7';
        svg.appendChild(mute);
      } else if (fretVal === 0) {
        svg.appendChild(el('circle', {
          cx: stringX(i),
          cy: topMargin - (isSmall ? 12 : 20),
          r: isSmall ? 4 : 6,
          class: 'chord-open-marker'
        }));
      }
    });

    if (chord.barre) {
      var relRow = chord.barre.fret - chord.startFret + 1;
      if (relRow >= 1 && relRow <= FRETS_SHOWN) {
        var barX1 = stringX(chord.barre.from);
        var barX2 = stringX(chord.barre.to);
        svg.appendChild(el('rect', {
          x: barX1 - (isSmall ? 6 : 9),
          y: fretY(relRow - 1) + (isSmall ? 5 : 7),
          width: (barX2 - barX1) + (isSmall ? 12 : 18),
          height: fretSpacing - (isSmall ? 10 : 14),
          rx: isSmall ? 7 : 11,
          class: 'chord-barre finger-' + chord.barre.finger
        }));
        var barreLabel = el('text', {
          x: (barX1 + barX2) / 2,
          y: fretY(relRow - 0.5) + (isSmall ? 3 : 5),
          class: 'chord-finger-label'
        });
        barreLabel.textContent = String(chord.barre.finger);
        svg.appendChild(barreLabel);
      }
    }

    chord.frets.forEach(function (fretVal, i) {
      if (typeof fretVal !== 'number' || fretVal === 0) return;

      var isPureBarrePosition = chord.barre &&
        fretVal === chord.barre.fret &&
        i >= chord.barre.from && i <= chord.barre.to;
      if (isPureBarrePosition) return;

      var relRow = fretVal - chord.startFret + 1;
      if (relRow < 1 || relRow > FRETS_SHOWN) return;

      var cy = fretY(relRow - 0.5);
      var fingerNum = chord.fingers[i];
      var dotClass = 'chord-dot';
      if (fingerNum >= 1 && fingerNum <= 4) {
        dotClass += ' finger-' + fingerNum;
      }

      svg.appendChild(el('circle', {
        cx: stringX(i), cy: cy,
        r: isSmall ? 7 : 10,
        class: dotClass
      }));

      if (fingerNum) {
        var t = el('text', {
          x: stringX(i), y: cy + (isSmall ? 3 : 4),
          class: 'chord-finger-label'
        });
        t.textContent = String(fingerNum);
        svg.appendChild(t);
      }
    });

    return svg;
  }

  function renderChordDiagram(container, chord, size) {
    container.innerHTML = '';
    container.appendChild(buildChordDiagramSVG(chord, size || 'large'));
  }

  function findChord(id) {
    for (var i = 0; i < CHORDS.length; i++) {
      if (CHORDS[i].id === id) return CHORDS[i];
    }
    return null;
  }

  function scrollToViewer() {
    var panel = document.querySelector('.chord-panel');
    if (panel) {
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // ---------------------------------------------------------------
  // 5. PAGE WIRING
  // ---------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function () {
    var grid = document.getElementById('chordGrid');
    var diagramContainer = document.getElementById('selectedChordDiagram');
    var selectedNameEl = document.getElementById('selectedChordName');
    var selectedTipEl = document.getElementById('selectedChordTip');
    var practiceListEl = document.getElementById('genericPracticeSteps');
    var tabButtons = document.querySelectorAll('.chord-tab');

    if (!grid || !diagramContainer) {
      return; // Not on the chords page.
    }

    var activeType = 'major';
    var activeId = 'E';

    if (practiceListEl && !practiceListEl.children.length) {
      GENERIC_PRACTICE_STEPS.forEach(function (step) {
        var li = document.createElement('li');
        li.textContent = step;
        practiceListEl.appendChild(li);
      });
    }

    function renderGrid() {
      grid.innerHTML = '';
      CHORDS
        .filter(function (c) { return c.type === activeType; })
        .forEach(function (chord) {
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'chord-grid-btn' + (chord.id === activeId ? ' is-selected' : '');
          btn.textContent = chord.id;
          btn.setAttribute('aria-pressed', chord.id === activeId ? 'true' : 'false');
          btn.addEventListener('click', function () {
            selectChord(chord.id);
          });
          grid.appendChild(btn);
        });
    }

    function selectChord(id) {
      var chord = findChord(id);
      if (!chord) return;

      activeId = id;

      if (chord.type !== activeType) {
        activeType = chord.type;
        tabButtons.forEach(function (t) {
          var isActive = t.getAttribute('data-type') === activeType;
          t.classList.toggle('is-active', isActive);
          t.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
      }

      renderGrid();
      renderChordDiagram(diagramContainer, chord, 'large');

      if (selectedNameEl) selectedNameEl.textContent = chord.name;
      if (selectedTipEl)   selectedTipEl.textContent = chord.tip;

      diagramContainer.classList.remove('diagram-enter');
      void diagramContainer.offsetWidth;
      diagramContainer.classList.add('diagram-enter');
    }

    tabButtons.forEach(function (tab) {
      tab.addEventListener('click', function () {
        activeType = tab.getAttribute('data-type');
        tabButtons.forEach(function (t) {
          var isActive = t === tab;
          t.classList.toggle('is-active', isActive);
          t.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        var first = CHORDS.filter(function (c) { return c.type === activeType; })[0];
        if (first) selectChord(first.id);
      });
    });

    // ---------- Progressions ----------
    function buildPlayButton(prog) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'progression-play-btn';
      btn.setAttribute('aria-label', 'Play ' + prog.name + ' progression');

      btn.innerHTML =
        '<svg class="play-btn-icon" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">' +
          '<path class="icon-play" d="M8 5v14l11-7z"/>' +
          '<rect class="icon-stop" x="6.5" y="6.5" width="11" height="11" rx="1.5"/>' +
        '</svg>' +
        '<span class="play-btn-label">Play</span>';

      btn.addEventListener('click', function () {
        playProgression(prog, btn);
      });

      return btn;
    }

    function renderProgressions() {
      var pg = document.getElementById('progressionsGrid');
      if (!pg) return;

      PROGRESSIONS.forEach(function (prog) {
        var card = document.createElement('article');
        card.className = 'progression-card';

        var head = document.createElement('div');
        head.className = 'progression-head';

        var titles = document.createElement('div');
        titles.className = 'progression-titles';

        var title = document.createElement('h3');
        title.className = 'progression-name';
        title.textContent = prog.name;
        titles.appendChild(title);

        var sub = document.createElement('span');
        sub.className = 'progression-subtitle';
        sub.textContent = prog.subtitle;
        titles.appendChild(sub);

        head.appendChild(titles);
        head.appendChild(buildPlayButton(prog));
        card.appendChild(head);

        var chordsRow = document.createElement('div');
        chordsRow.className = 'progression-chords';

        prog.chords.forEach(function (chordId, idx) {
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'progression-chord-btn';
          btn.textContent = chordId;
          btn.setAttribute('aria-label', 'Show ' + chordId + ' chord');
          btn.addEventListener('click', function () {
            selectChord(chordId);
            scrollToViewer();
          });
          chordsRow.appendChild(btn);

          if (idx < prog.chords.length - 1) {
            var arrow = document.createElement('span');
            arrow.className = 'progression-arrow';
            arrow.setAttribute('aria-hidden', 'true');
            arrow.textContent = '\u2192';
            chordsRow.appendChild(arrow);
          }
        });

        card.appendChild(chordsRow);

        var desc = document.createElement('p');
        desc.className = 'progression-desc';
        desc.textContent = prog.desc;
        card.appendChild(desc);

        pg.appendChild(card);
      });
    }

    renderProgressions();
    renderGrid();
    selectChord(activeId);

    window.addEventListener('pagehide', stopAllAudio);
  });
})();