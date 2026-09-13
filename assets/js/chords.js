/**
 * chords.js
 * Chord-specific interactions only:
 *   - chord data (verified standard beginner open-position shapes)
 *   - SVG chord diagram rendering
 *   - major/minor tab switching
 *   - chord grid + selected chord panel
 *   - simple "switch practice" pair cycler
 *
 * String order used throughout this file, low to high:
 *   [ E (low), A, D, G, B, e (high) ]
 * fret value: null = muted string, 0 = open string, N = fretted at fret N
 * finger value: 0 = no finger (open/muted), 1-4 = index/middle/ring/pinky
 */
(function () {
  'use strict';

  // ---------------------------------------------------------------
  // 1. CHORD DATA
  // Verified standard beginner open-position / barre shapes.
  // startFret: the fret shown at the top of the diagram window.
  //   1 = normal open position (nut shown).
  //   >1 = barre chord starting higher up the neck ("Nfr" label,
  //        no nut line).
  // barre: optional { fret, finger, from, to } — "from"/"to" are
  //   string indices (0=low E ... 5=high e) the barre spans.
  //   Drawn as a bar; any string whose own fret differs from the
  //   barre fret still gets its own finger dot on top.
  // ---------------------------------------------------------------
  var CHORDS = [
    {
      id: 'E', name: 'E Major', type: 'major', startFret: 1,
      frets:   [0, 2, 2, 1, 0, 0],
      fingers: [0, 2, 3, 1, 0, 0],
      barre: null,
      tip: 'Curl your fingers so the open high E and B strings ring clearly.'
    },
    {
      id: 'A', name: 'A Major', type: 'major', startFret: 1,
      frets:   [null, 0, 2, 2, 2, 0],
      fingers: [0, 0, 1, 2, 3, 0],
      barre: null,
      tip: 'Squeeze your three middle fingers close together on the 2nd fret.'
    },
    {
      id: 'D', name: 'D Major', type: 'major', startFret: 1,
      frets:   [null, null, 0, 2, 3, 2],
      fingers: [0, 0, 0, 1, 3, 2],
      barre: null,
      tip: 'Keep your thumb low so you can angle your fingers onto the top 3 strings.'
    },
    {
      id: 'G', name: 'G Major', type: 'major', startFret: 1,
      frets:   [3, 2, 0, 0, 0, 3],
      fingers: [2, 1, 0, 0, 0, 3],
      barre: null,
      tip: 'Stretch your ring finger to the high E string without muting the B string.'
    },
    {
      id: 'C', name: 'C Major', type: 'major', startFret: 1,
      frets:   [null, 3, 2, 0, 1, 0],
      fingers: [0, 3, 2, 0, 1, 0],
      barre: null,
      tip: 'Arch your fingers so the open G and high E strings ring clearly.'
    },
    {
      id: 'F', name: 'F Major', type: 'major', startFret: 1,
      frets:   [1, 3, 3, 2, 1, 1],
      fingers: [1, 3, 4, 2, 1, 1],
      barre: { fret: 1, finger: 1, from: 0, to: 5 },
      tip: 'Roll the side of your index finger flat across all 6 strings. This one takes practice — don\u2019t rush it.'
    },
    {
      id: 'B', name: 'B Major', type: 'major', startFret: 2,
      frets:   [null, 2, 4, 4, 4, 2],
      fingers: [0, 1, 3, 3, 3, 1],
      barre: { fret: 2, finger: 1, from: 1, to: 5 },
      tip: 'Barre with your index finger, then press D, G and B strings flat with your ring finger.'
    },
    {
      id: 'Am', name: 'A Minor', type: 'minor', startFret: 1,
      frets:   [null, 0, 2, 2, 1, 0],
      fingers: [0, 0, 2, 3, 1, 0],
      barre: null,
      tip: 'Almost the same shape as E Major, just moved over one string.'
    },
    {
      id: 'Bm', name: 'B Minor', type: 'minor', startFret: 2,
      frets:   [null, 2, 4, 4, 3, 2],
      fingers: [0, 1, 3, 4, 2, 1],
      barre: { fret: 2, finger: 1, from: 1, to: 5 },
      tip: 'Barre the 2nd fret first, then drop your other fingers on top one at a time.'
    },
    {
      id: 'Cm', name: 'C Minor', type: 'minor', startFret: 3,
      frets:   [null, 3, 5, 5, 4, 3],
      fingers: [0, 1, 3, 4, 2, 1],
      barre: { fret: 3, finger: 1, from: 1, to: 5 },
      tip: 'Same shape as B Minor, just shifted up one fret.'
    },
    {
      id: 'Dm', name: 'D Minor', type: 'minor', startFret: 1,
      frets:   [null, null, 0, 2, 3, 1],
      fingers: [0, 0, 0, 2, 3, 1],
      barre: null,
      tip: 'Keep your index finger flat and light on the high E string.'
    },
    {
      id: 'Em', name: 'E Minor', type: 'minor', startFret: 1,
      frets:   [0, 2, 2, 0, 0, 0],
      fingers: [0, 1, 2, 0, 0, 0],
      barre: null,
      tip: 'One of the easiest chords to start with — great for your very first strum.'
    },
    {
      id: 'Fm', name: 'F Minor', type: 'minor', startFret: 1,
      frets:   [1, 3, 3, 1, 1, 1],
      fingers: [1, 3, 4, 1, 1, 1],
      barre: { fret: 1, finger: 1, from: 0, to: 5 },
      tip: 'Same barre as F Major, but only two extra fingers to add on top.'
    },
    {
      id: 'Gm', name: 'G Minor', type: 'minor', startFret: 3,
      frets:   [3, 5, 5, 3, 3, 3],
      fingers: [1, 3, 4, 1, 1, 1],
      barre: { fret: 3, finger: 1, from: 0, to: 5 },
      tip: 'Same shape as F Minor, just shifted up two frets.'
    }
  ];

  var STRING_LABELS = ['E', 'A', 'D', 'G', 'B', 'e'];
  var FRETS_SHOWN = 4;

  // Generic 6-step practice recipe shown for every chord, per spec section 14.
  var GENERIC_PRACTICE_STEPS = [
    'Form the chord shape with your fingers.',
    'Place your fingers one at a time, close to the fret.',
    'Play each string one by one and listen closely.',
    'Fix any string that buzzes or sounds muted.',
    'Strum all the strings slowly.',
    'Repeat until the whole chord rings clearly.'
  ];

  var SWITCH_PAIRS = [
    ['G', 'C'], ['C', 'D'], ['D', 'G'],
    ['A', 'E'], ['E', 'A'],
    ['Am', 'C'], ['Em', 'Am']
  ];

  var SVG_NS = 'http://www.w3.org/2000/svg';

  // ---------------------------------------------------------------
  // 2. SVG CHORD DIAGRAM RENDERING
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

  /**
   * Builds an SVG chord diagram for the given chord definition.
   * size: 'large' (selected chord panel) or 'small' (switch practice).
   */
  function buildChordDiagramSVG(chord, size) {
    var width = 200;
    var height = 250;
    var leftMargin = 22;
    var rightMargin = 22;
    var topMargin = 46;
    var fretSpacing = 44;
    var stringGap = (width - leftMargin - rightMargin) / (STRING_LABELS.length - 1);

    var svg = el('svg', {
      viewBox: '0 0 ' + width + ' ' + height,
      class: 'chord-diagram-svg chord-diagram-' + size,
      role: 'img',
      'aria-label': chord.name + ' chord diagram'
    });

    function stringX(i) { return leftMargin + i * stringGap; }
    function fretY(relRow) { return topMargin + relRow * fretSpacing; }

    // Starting fret label (e.g. "3fr") when not showing the nut.
    if (chord.startFret > 1) {
      var label = el('text', {
        x: leftMargin - 14,
        y: fretY(0.5) + 5,
        class: 'chord-fret-label'
      });
      label.textContent = chord.startFret + 'fr';
      svg.appendChild(label);
    }

    // Fret lines (nut is thicker when startFret === 1).
    for (var row = 0; row <= FRETS_SHOWN; row++) {
      var isNut = chord.startFret === 1 && row === 0;
      svg.appendChild(el('line', {
        x1: stringX(0), x2: stringX(STRING_LABELS.length - 1),
        y1: fretY(row), y2: fretY(row),
        class: isNut ? 'chord-nut' : 'chord-fretline'
      }));
    }

    // String lines + labels + open/mute markers.
    STRING_LABELS.forEach(function (label, i) {
      svg.appendChild(el('line', {
        x1: stringX(i), x2: stringX(i),
        y1: fretY(0), y2: fretY(FRETS_SHOWN),
        class: 'chord-stringline'
      }));

      var nameText = el('text', {
        x: stringX(i), y: fretY(FRETS_SHOWN) + 18,
        class: 'chord-string-label'
      });
      nameText.textContent = label;
      svg.appendChild(nameText);

      var fretVal = chord.frets[i];
      if (fretVal === null) {
        var mute = el('text', {
          x: stringX(i), y: topMargin - 18,
          class: 'chord-mute-marker'
        });
        mute.textContent = '\u00D7'; // ×
        svg.appendChild(mute);
      } else if (fretVal === 0) {
        svg.appendChild(el('circle', {
          cx: stringX(i), cy: topMargin - 20, r: 6,
          class: 'chord-open-marker'
        }));
      }
    });

    // Barre bar (drawn behind individual finger dots).
    if (chord.barre) {
      var relRow = chord.barre.fret - chord.startFret + 1;
      if (relRow >= 1 && relRow <= FRETS_SHOWN) {
        var barX1 = stringX(chord.barre.from);
        var barX2 = stringX(chord.barre.to);
        svg.appendChild(el('rect', {
          x: barX1 - 9, y: fretY(relRow - 1) + 7,
          width: (barX2 - barX1) + 18,
          height: fretSpacing - 14,
          rx: 11,
          class: 'chord-barre'
        }));
        var barreLabel = el('text', {
          x: (barX1 + barX2) / 2,
          y: fretY(relRow - 0.5) + 5,
          class: 'chord-finger-label chord-finger-label-on-barre'
        });
        barreLabel.textContent = String(chord.barre.finger);
        svg.appendChild(barreLabel);
      }
    }

    // Individual finger dots (skip strings fully covered by the barre
    // at the same fret with no extra finger of their own).
    chord.frets.forEach(function (fretVal, i) {
      if (typeof fretVal !== 'number' || fretVal === 0) {
        return;
      }
      var isPureBarrePosition = chord.barre &&
        fretVal === chord.barre.fret &&
        i >= chord.barre.from && i <= chord.barre.to;
      if (isPureBarrePosition) {
        return; // already represented by the barre bar
      }

      var relRow = fretVal - chord.startFret + 1;
      if (relRow < 1 || relRow > FRETS_SHOWN) {
        return;
      }
      var cy = fretY(relRow - 0.5);
      svg.appendChild(el('circle', {
        cx: stringX(i), cy: cy, r: 10,
        class: 'chord-dot'
      }));
      var fingerNum = chord.fingers[i];
      if (fingerNum) {
        var t = el('text', {
          x: stringX(i), y: cy + 4,
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

  // ---------------------------------------------------------------
  // 3. PAGE WIRING
  // ---------------------------------------------------------------

  function findChord(id) {
    for (var i = 0; i < CHORDS.length; i++) {
      if (CHORDS[i].id === id) {
        return CHORDS[i];
      }
    }
    return null;
  }

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

    // Fill in the generic 6-step practice recipe once.
    if (practiceListEl) {
      GENERIC_PRACTICE_STEPS.forEach(function (step) {
        var li = document.createElement('li');
        li.textContent = step;
        practiceListEl.appendChild(li);
      });
    }

    function renderGrid() {
      grid.innerHTML = '';
      CHORDS.filter(function (c) { return c.type === activeType; })
        .forEach(function (chord) {
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'chord-grid-btn';
          btn.textContent = chord.id;
          btn.setAttribute('aria-pressed', chord.id === activeId ? 'true' : 'false');
          if (chord.id === activeId) {
            btn.classList.add('is-selected');
          }
          btn.addEventListener('click', function () {
            selectChord(chord.id);
          });
          grid.appendChild(btn);
        });
    }

    function selectChord(id) {
      var chord = findChord(id);
      if (!chord) {
        return;
      }
      activeId = id;
      activeType = chord.type;
      renderGrid();
      renderChordDiagram(diagramContainer, chord, 'large');
      if (selectedNameEl) {
        selectedNameEl.textContent = chord.name;
      }
      if (selectedTipEl) {
        selectedTipEl.textContent = chord.tip;
      }
    }

    tabButtons.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var type = tab.getAttribute('data-type');
        activeType = type;
        tabButtons.forEach(function (t) {
          var isActive = t === tab;
          t.classList.toggle('is-active', isActive);
          t.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        // Jump to the first chord of the newly selected category.
        var first = CHORDS.filter(function (c) { return c.type === activeType; })[0];
        if (first) {
          selectChord(first.id);
        }
      });
    });

    renderGrid();
    selectChord(activeId);

    // ---------------- Switch Practice ----------------
    var switchIndex = 0;
    var switchLabelEl = document.getElementById('switchPairLabel');
    var switchNextBtn = document.getElementById('switchNextBtn');
    var switchDiagramA = document.getElementById('switchDiagramA');
    var switchDiagramB = document.getElementById('switchDiagramB');
    var switchNameA = document.getElementById('switchNameA');
    var switchNameB = document.getElementById('switchNameB');

    function renderSwitchPair() {
      var pair = SWITCH_PAIRS[switchIndex];
      var chordA = findChord(pair[0]);
      var chordB = findChord(pair[1]);
      if (!chordA || !chordB) {
        return;
      }
      if (switchLabelEl) {
        switchLabelEl.textContent = chordA.id + ' \u2192 ' + chordB.id;
      }
      if (switchNameA) {
        switchNameA.textContent = chordA.id;
      }
      if (switchNameB) {
        switchNameB.textContent = chordB.id;
      }
      if (switchDiagramA) {
        renderChordDiagram(switchDiagramA, chordA, 'small');
      }
      if (switchDiagramB) {
        renderChordDiagram(switchDiagramB, chordB, 'small');
      }
    }

    if (switchNextBtn) {
      switchNextBtn.addEventListener('click', function () {
        switchIndex = (switchIndex + 1) % SWITCH_PAIRS.length;
        renderSwitchPair();
      });
      renderSwitchPair();
    }
  });
})();
