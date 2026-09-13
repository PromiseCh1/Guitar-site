/**
 * scales.js
 * Scale-specific interactions with per-degree coloring.
 *
 *   - Chromatic, Major, Minor Pentatonic, Blues
 *   - Each scale degree has its own color; the root is red
 *   - Fretboard renders the low E string at the BOTTOM
 *     (standard tab orientation)
 *   - Pentatonic and Blues hide the formula + sequence blocks
 *   - Fretboard supports zoom (0.25× … 1.5× and Fit)
 *
 * Music theory reference:
 *   NOTES is the chromatic sequence starting from A (index 0),
 *   sharps only (no flats).
 *   note_at(openStringNote, fret) = NOTES[(index(openStringNote) + fret) % 12]
 *
 *   Standard tuning open strings, low to high: E A D G B e
 */
(function () {
  'use strict';

  var NOTES = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

  var OPEN_STRINGS = [
    { label: 'E', name: 'Low E', index: NOTES.indexOf('E') },
    { label: 'A', name: 'A',      index: NOTES.indexOf('A') },
    { label: 'D', name: 'D',      index: NOTES.indexOf('D') },
    { label: 'G', name: 'G',      index: NOTES.indexOf('G') },
    { label: 'B', name: 'B',      index: NOTES.indexOf('B') },
    { label: 'e', name: 'High E', index: NOTES.indexOf('E') }
  ];

  var FRETS_SHOWN = 12;

  // Zoom levels — scale is a multiplier of the fretboard container
  // width, so 1× always fits on any device.
  var ZOOM_LEVELS = [
    { label: '0.25×', scale: 0.25 },
    { label: '0.5×',  scale: 0.5  },
    { label: '0.75×', scale: 0.75 },
    { label: '1×',    scale: 1.0  },  // default
    { label: '1.5×',  scale: 1.5  },
    { label: 'Fit',   scale: 1.0  }
  ];

  // One color per scale degree. Index 0 = root (red).
  var DEGREE_PALETTE = [
    { bg: '#ef4444', text: '#ffffff' }, // 1st (root)  — red
    { bg: '#f59e0b', text: '#0a0a0a' }, // 2nd         — amber
    { bg: '#22c55e', text: '#0a0a0a' }, // 3rd         — green
    { bg: '#06b6d4', text: '#ffffff' }, // 4th         — cyan
    { bg: '#8b5cf6', text: '#ffffff' }, // 5th         — violet
    { bg: '#ec4899', text: '#ffffff' }, // 6th         — pink
    { bg: '#f97316', text: '#0a0a0a' }, // 7th         — orange
    { bg: '#84cc16', text: '#0a0a0a' }, // 8th         — lime
    { bg: '#14b8a6', text: '#0a0a0a' }, // 9th         — teal
    { bg: '#3b82f6', text: '#ffffff' }, // 10th        — blue
    { bg: '#a855f7', text: '#ffffff' }, // 11th        — purple
    { bg: '#eab308', text: '#0a0a0a' }  // 12th        — yellow
  ];

  var SCALE_DEFS = {
    chromatic: {
      name: 'Chromatic Scale',
      badge: '12 notes',
      hasRoot: false,
      fixedStart: 'C',
      showFormula: true,
      showSequence: true,
      points: [
        'Uses every note on the guitar — 12 in total.',
        'Every step is one fret. That distance is called a semitone.',
        'Every note has its own color so you can trace the whole neck.',
        'The best way to learn where every note lives.',
        'Play it slowly: one finger per fret, one note at a time.'
      ],
      buildSteps: [1,1,1,1,1,1,1,1,1,1,1],
      stepLabels: ['H','H','H','H','H','H','H','H','H','H','H','H'],
      formulaNote: 'H = half step = 1 fret. The cycle repeats after 12 notes.'
    },

    major: {
      name: 'Major Scale',
      badge: '7 notes',
      hasRoot: true,
      showFormula: true,
      showSequence: true,
      points: [
        'The familiar "do-re-mi" sound — bright and happy.',
        'Built from 7 different notes before it repeats.',
        'Every note of the scale gets its own color on the neck.',
        'The foundation for most melodies in pop, folk, and rock.',
        'Learn one shape and you can play it in any key.'
      ],
      buildSteps: [2,2,1,2,2,2],
      stepLabels: ['W','W','H','W','W','W','H'],
      formulaNote: 'W = whole step = 2 frets. H = half step = 1 fret.'
    },

    pentatonic: {
      name: 'Minor Pentatonic Scale',
      badge: '5 notes',
      hasRoot: true,
      showFormula: false,
      showSequence: false,
      points: [
        'Only 5 notes — the easiest scale to play over songs.',
        'Works over almost any rock, blues, or pop backing track.',
        'Leaves out the notes most likely to clash with the key.',
        'Great for improvising from day one.',
        'One movable shape covers the whole neck.'
      ],
      buildSteps: [3,2,2,3],
      stepLabels: ['3','2','2','3','2'],
      formulaNote: '3 = whole + half step (3 frets). 2 = whole step.'
    },

    blues: {
      name: 'Blues Scale',
      badge: '6 notes',
      hasRoot: true,
      showFormula: false,
      showSequence: false,
      points: [
        'The minor pentatonic plus one extra note — the "blue note".',
        'That extra note gives blues its gritty, expressive sound.',
        'Works over blues, rock, and even jazz progressions.',
        'Very similar shape to the pentatonic, so learn that first.',
        'You\'ll recognise the sound instantly once you play it.'
      ],
      buildSteps: [3,2,1,1,3],
      stepLabels: ['3','2','1','1','3','2'],
      formulaNote: 'The 1-fret jump is the blue note. 3 = whole + half step.'
    }
  };

  var PRACTICE_STEPS = [
    'Start slowly — around 60 BPM on the metronome.',
    'Play one note per beat and keep the timing even.',
    'Use one finger per fret if you can (1-2-3-4 on frets 1-2-3-4).',
    'Play the scale ascending, then descending.',
    'Say each note name out loud as you play it.',
    'Only speed up once every note sounds clean.'
  ];

  // ---------------------------------------------------------------
  // THEORY HELPERS
  // ---------------------------------------------------------------
  function noteAt(openIndex, fret) {
    return NOTES[(openIndex + fret) % 12];
  }

  function buildScaleNotes(root, buildSteps) {
    var rootIndex = NOTES.indexOf(root);
    var scale = [root];
    var current = rootIndex;
    for (var i = 0; i < buildSteps.length; i++) {
      current = (current + buildSteps[i]) % 12;
      scale.push(NOTES[current]);
    }
    return scale;
  }

  // ---------------------------------------------------------------
  // FRETBOARD RENDERING
  // ---------------------------------------------------------------
  var SVG_NS = 'http://www.w3.org/2000/svg';

  function el(tag, attrs) {
    var node = document.createElementNS(SVG_NS, tag);
    for (var key in attrs) {
      if (Object.prototype.hasOwnProperty.call(attrs, key)) {
        node.setAttribute(key, attrs[key]);
      }
    }
    return node;
  }

  function renderFretboard(container, highlightFn) {
    var width        = 900;
    var height       = 260;
    var leftMargin   = 44;
    var rightMargin  = 24;
    var topMargin    = 26;
    var bottomMargin = 26;
    var stringGap    = (height - topMargin - bottomMargin) / (OPEN_STRINGS.length - 1);
    var fretGap      = (width - leftMargin - rightMargin) / FRETS_SHOWN;

    var svg = el('svg', {
      viewBox: '0 0 ' + width + ' ' + height,
      class: 'scale-fretboard-svg',
      role: 'img',
      'aria-label': 'Guitar fretboard, frets 1 through 12, low E at the bottom'
    });

    function stringY(i) { return (height - bottomMargin) - i * stringGap; }
    function fretX(f) { return leftMargin + f * fretGap; }

    svg.appendChild(el('line', {
      x1: fretX(0), x2: fretX(0),
      y1: stringY(0), y2: stringY(OPEN_STRINGS.length - 1),
      class: 'scale-nut'
    }));

    for (var f = 1; f <= FRETS_SHOWN; f++) {
      svg.appendChild(el('line', {
        x1: fretX(f), x2: fretX(f),
        y1: stringY(0), y2: stringY(OPEN_STRINGS.length - 1),
        class: 'scale-fretline'
      }));
    }

    var midY = (stringY(0) + stringY(OPEN_STRINGS.length - 1)) / 2;
    [3, 5, 7, 9].forEach(function (f) {
      svg.appendChild(el('circle', {
        cx: fretX(f) - fretGap / 2, cy: midY,
        r: 5, class: 'scale-fret-marker'
      }));
    });
    [-4, 4].forEach(function (offset) {
      svg.appendChild(el('circle', {
        cx: fretX(12) - fretGap / 2, cy: midY + offset,
        r: 5, class: 'scale-fret-marker'
      }));
    });

    OPEN_STRINGS.forEach(function (str, si) {
      var y = stringY(si);

      svg.appendChild(el('line', {
        x1: fretX(0), x2: fretX(FRETS_SHOWN),
        y1: y, y2: y,
        class: 'scale-stringline'
      }));

      var strLabel = el('text', {
        x: 16, y: y + 5,
        class: 'scale-string-label'
      });
      strLabel.textContent = str.label;
      svg.appendChild(strLabel);

      for (var fret = 1; fret <= FRETS_SHOWN; fret++) {
        var note = noteAt(str.index, fret);
        var degreeIdx = highlightFn(note, si, fret);

        if (degreeIdx === null || degreeIdx === undefined) continue;

        var palette = DEGREE_PALETTE[degreeIdx % DEGREE_PALETTE.length];
        var cx = fretX(fret) - fretGap / 2;

        svg.appendChild(el('circle', {
          cx: cx, cy: y, r: 11,
          class: 'scale-note-dot',
          fill: palette.bg
        }));

        var t = el('text', {
          x: cx, y: y + 5,
          class: 'scale-note-text',
          fill: palette.text
        });
        t.textContent = note;
        svg.appendChild(t);
      }
    });

    for (var fn = 1; fn <= FRETS_SHOWN; fn++) {
      var fLabel = el('text', {
        x: fretX(fn) - fretGap / 2,
        y: height - 6,
        class: 'scale-fret-number'
      });
      fLabel.textContent = fn;
      svg.appendChild(fLabel);
    }

    container.innerHTML = '';
    container.appendChild(svg);
  }

  // ---------------------------------------------------------------
  // DOM REFERENCES
  // ---------------------------------------------------------------
  var elName      = document.getElementById('scaleName');
  var elBadge     = document.getElementById('scaleBadge');
  var elRootRow   = document.getElementById('scaleRootRow');
  var elRootSel   = document.getElementById('scaleRoot');
  var elPoints    = document.getElementById('scalePoints');
  var elFormulaBlk = document.getElementById('scaleFormulaBlock');
  var elPattern   = document.getElementById('scalePattern');
  var elFormulaNt = document.getElementById('scaleFormulaNote');
  var elSeqBlk    = document.getElementById('scaleSequenceBlock');
  var elSequence  = document.getElementById('scaleSequence');
  var elBoard     = document.getElementById('scaleFretboard');
  var elLegend    = document.getElementById('scaleLegend');
  var tabButtons  = document.querySelectorAll('.scale-tab');

  // Zoom elements
  var zoomInBtn   = document.getElementById('zoomInBtn');
  var zoomOutBtn  = document.getElementById('zoomOutBtn');
  var zoomLabelEl = document.getElementById('zoomLevelLabel');
  var scrollHintEl = document.getElementById('scrollHint');

  var activeScaleId = 'chromatic';
  var currentZoomIndex = 3; // default = 1×

  // ---------------------------------------------------------------
  // PANEL RENDERERS
  // ---------------------------------------------------------------
  function getStepClass(label) {
    if (label === 'H') return 'step-h';
    if (label === 'W') return 'step-w';
    return 'step-3';
  }

  function renderPoints(points) {
    if (!elPoints) return;
    elPoints.innerHTML = '';
    points.forEach(function (p) {
      var li = document.createElement('li');
      li.textContent = p;
      elPoints.appendChild(li);
    });
  }

  function renderPattern(stepLabels) {
    if (!elPattern) return;
    elPattern.innerHTML = '';
    stepLabels.forEach(function (label) {
      var span = document.createElement('span');
      span.className = 'scale-step ' + getStepClass(label);
      span.textContent = label;
      elPattern.appendChild(span);
    });
  }

  function renderSequence(notes) {
    if (!elSequence) return;
    elSequence.innerHTML = '';

    var fullSeq = notes.concat([notes[0]]);

    fullSeq.forEach(function (note, idx) {
      var degreeIdx = notes.indexOf(note);
      if (degreeIdx === -1) degreeIdx = 0;
      var palette = DEGREE_PALETTE[degreeIdx % DEGREE_PALETTE.length];

      var span = document.createElement('span');
      span.className = 'seq-note';
      span.style.backgroundColor = palette.bg;
      span.style.color = palette.text;
      span.textContent = note;
      elSequence.appendChild(span);

      if (idx < fullSeq.length - 1) {
        var arrow = document.createElement('span');
        arrow.className = 'seq-arrow';
        arrow.setAttribute('aria-hidden', 'true');
        arrow.textContent = '\u2192';
        elSequence.appendChild(arrow);
      }
    });
  }

  function renderLegend(notes) {
    if (!elLegend) return;
    elLegend.innerHTML = '';

    notes.forEach(function (note, idx) {
      var palette = DEGREE_PALETTE[idx % DEGREE_PALETTE.length];

      var item = document.createElement('span');
      item.className = 'scale-legend-item';

      var dot = document.createElement('span');
      dot.className = 'scale-legend-dot';
      dot.style.backgroundColor = palette.bg;
      dot.style.color = palette.text;
      dot.textContent = note;
      item.appendChild(dot);

      if (idx === 0) {
        var lbl = document.createElement('span');
        lbl.className = 'scale-legend-root-label';
        lbl.textContent = 'root';
        item.appendChild(lbl);
      }

      elLegend.appendChild(item);
    });
  }

  // ---------------------------------------------------------------
  // ZOOM
  // ---------------------------------------------------------------
  function getBaseWidth() {
    var holder = document.querySelector('.scale-fretboard-holder');
    if (holder) {
      var w = holder.clientWidth - 20; // subtract padding
      return Math.max(260, w);
    }
    return Math.max(260, window.innerWidth - 40);
  }

  function applyZoom() {
    if (!elBoard) return;
    var svg = elBoard.querySelector('.scale-fretboard-svg');
    if (!svg) return;

    var level = ZOOM_LEVELS[currentZoomIndex];
    var baseW = getBaseWidth();
    var targetW = Math.round(baseW * level.scale);

    svg.style.minWidth = targetW + 'px';
    svg.style.width    = targetW + 'px';

    if (zoomLabelEl) zoomLabelEl.textContent = level.label;
    if (zoomOutBtn) zoomOutBtn.disabled = (currentZoomIndex === 0);
    if (zoomInBtn)  zoomInBtn.disabled  = (currentZoomIndex === ZOOM_LEVELS.length - 1);

    // Show the swipe hint only when the SVG is wider than its container
    var needsScroll = targetW > baseW + 4;
    if (scrollHintEl) scrollHintEl.classList.toggle('is-hidden', !needsScroll);
  }

  if (zoomInBtn) {
    zoomInBtn.addEventListener('click', function () {
      if (currentZoomIndex < ZOOM_LEVELS.length - 1) {
        currentZoomIndex++;
        applyZoom();
      }
    });
  }

  if (zoomOutBtn) {
    zoomOutBtn.addEventListener('click', function () {
      if (currentZoomIndex > 0) {
        currentZoomIndex--;
        applyZoom();
      }
    });
  }

  var resizeTimer = null;
  window.addEventListener('resize', function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(applyZoom, 120);
  });

  // ---------------------------------------------------------------
  // PANEL
  // ---------------------------------------------------------------
  function renderPanel() {
    var def = SCALE_DEFS[activeScaleId];
    if (!def) return;

    if (elName)  elName.textContent = def.name;
    if (elBadge) elBadge.textContent = def.badge;

    if (elRootRow) elRootRow.hidden = !def.hasRoot;

    if (elFormulaBlk) elFormulaBlk.hidden = !def.showFormula;
    if (elSeqBlk)     elSeqBlk.hidden     = !def.showSequence;

    var root = def.hasRoot
      ? (elRootSel ? elRootSel.value : 'C')
      : def.fixedStart;

    var scaleNotes = buildScaleNotes(root, def.buildSteps);

    renderPoints(def.points);

    if (def.showFormula) {
      renderPattern(def.stepLabels);
      if (elFormulaNt) elFormulaNt.textContent = def.formulaNote;
    }

    if (def.showSequence) {
      renderSequence(scaleNotes);
    }

    renderFretboard(elBoard, function (note) {
      var idx = scaleNotes.indexOf(note);
      return idx === -1 ? null : idx;
    });

    // Reapply the current zoom to the freshly rendered SVG
    applyZoom();

    renderLegend(scaleNotes);
  }

  function selectScale(id) {
    if (!SCALE_DEFS[id]) return;
    activeScaleId = id;

    tabButtons.forEach(function (t) {
      var isActive = t.getAttribute('data-scale') === id;
      t.classList.toggle('is-active', isActive);
      t.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    renderPanel();
  }

  // ---------------------------------------------------------------
  // WIRING
  // ---------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function () {
    if (!elBoard) return;

    tabButtons.forEach(function (tab) {
      tab.addEventListener('click', function () {
        selectScale(tab.getAttribute('data-scale'));
      });
    });

    if (elRootSel) {
      elRootSel.addEventListener('change', renderPanel);
    }

    var practiceList = document.getElementById('scalePracticeSteps');
    if (practiceList && !practiceList.children.length) {
      PRACTICE_STEPS.forEach(function (step) {
        var li = document.createElement('li');
        li.textContent = step;
        practiceList.appendChild(li);
      });
    }

    selectScale(activeScaleId);
  });
})();