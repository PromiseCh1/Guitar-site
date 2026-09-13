/**
 * scales.js
 * Scale-specific interactions only:
 *   - correct chromatic pitch calculation (12-tone equal temperament)
 *   - Chromatic Scale explanation + fretboard visualization
 *   - Major Scale explanation + root selector + fretboard visualization
 *
 * Music theory reference:
 *   NOTES is the chromatic sequence starting from A (index 0), using
 *   sharps only (no flats) to keep the beginner content simple.
 *   note_at(openStringNote, fret) = NOTES[(index(openStringNote) + fret) % 12]
 *
 *   Standard tuning open strings, low to high: E A D G B e
 *   Major scale step pattern (semitones): W W H W W W H = 2 2 1 2 2 2 1
 */
(function () {
  'use strict';

  var NOTES = ['A', 'A#', 'B', 'C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#'];

  // Standard tuning, low to high, as indices into NOTES.
  var OPEN_STRINGS = [
    { label: 'E', name: 'Low E', index: NOTES.indexOf('E') },
    { label: 'A', name: 'A', index: NOTES.indexOf('A') },
    { label: 'D', name: 'D', index: NOTES.indexOf('D') },
    { label: 'G', name: 'G', index: NOTES.indexOf('G') },
    { label: 'B', name: 'B', index: NOTES.indexOf('B') },
    { label: 'e', name: 'High E', index: NOTES.indexOf('E') }
  ];

  var MAJOR_SCALE_STEPS = [2, 2, 1, 2, 2, 2, 1]; // W W H W W W H

  var FRETS_SHOWN = 12;

  function noteAt(openIndex, fret) {
    return NOTES[(openIndex + fret) % 12];
  }

  /** Builds the full major scale note sequence (7 notes) starting at rootNote. */
  function buildMajorScale(rootNote) {
    var rootIndex = NOTES.indexOf(rootNote);
    var scale = [rootNote];
    var current = rootIndex;
    for (var i = 0; i < MAJOR_SCALE_STEPS.length - 1; i++) {
      current = (current + MAJOR_SCALE_STEPS[i]) % 12;
      scale.push(NOTES[current]);
    }
    return scale;
  }

  // ---------------------------------------------------------------
  // Fretboard SVG rendering (shared between chromatic + major views)
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

  /**
   * Renders a 6-string, 12-fret fretboard.
   * highlightFn(noteName, stringIdx, fret) -> 'root' | 'scale' | null
   * Used to decide how to color/mark each fret position.
   */
  function renderFretboard(container, highlightFn) {
    var width = 900;
    var height = 220;
    var leftMargin = 40;
    var rightMargin = 20;
    var topMargin = 20;
    var stringGap = (height - topMargin - 20) / (OPEN_STRINGS.length - 1);
    var fretGap = (width - leftMargin - rightMargin) / FRETS_SHOWN;

    var svg = el('svg', {
      viewBox: '0 0 ' + width + ' ' + height,
      class: 'scale-fretboard-svg',
      role: 'img',
      'aria-label': 'Guitar fretboard, frets 1 through 12'
    });

    function stringY(i) { return topMargin + i * stringGap; }
    function fretX(f) { return leftMargin + f * fretGap; }

    // Nut (before fret 1)
    svg.appendChild(el('line', {
      x1: fretX(0), x2: fretX(0),
      y1: stringY(0), y2: stringY(OPEN_STRINGS.length - 1),
      class: 'scale-nut'
    }));

    // Fret lines
    for (var f = 1; f <= FRETS_SHOWN; f++) {
      svg.appendChild(el('line', {
        x1: fretX(f), x2: fretX(f),
        y1: stringY(0), y2: stringY(OPEN_STRINGS.length - 1),
        class: 'scale-fretline'
      }));
    }

    // Classic single-dot fret markers (3,5,7,9) and double dot (12)
    [3, 5, 7, 9].forEach(function (f) {
      svg.appendChild(el('circle', {
        cx: fretX(f) - fretGap / 2, cy: (stringY(0) + stringY(OPEN_STRINGS.length - 1)) / 2,
        r: 5, class: 'scale-fret-marker'
      }));
    });
    [ -4, 4 ].forEach(function (offset) {
      svg.appendChild(el('circle', {
        cx: fretX(12) - fretGap / 2, cy: (stringY(0) + stringY(OPEN_STRINGS.length - 1)) / 2 + offset,
        r: 5, class: 'scale-fret-marker'
      }));
    });

    // Strings + note dots
    OPEN_STRINGS.forEach(function (str, si) {
      svg.appendChild(el('line', {
        x1: fretX(0), x2: fretX(FRETS_SHOWN),
        y1: stringY(si), y2: stringY(si),
        class: 'scale-stringline'
      }));

      var strLabel = el('text', {
        x: 12, y: stringY(si) + 4, class: 'scale-string-label'
      });
      strLabel.textContent = str.label;
      svg.appendChild(strLabel);

      for (var fret = 1; fret <= FRETS_SHOWN; fret++) {
        var note = noteAt(str.index, fret);
        var mark = highlightFn(note, si, fret);
        if (!mark) {
          continue;
        }
        var cx = fretX(fret) - fretGap / 2;
        var dot = el('circle', {
          cx: cx, cy: stringY(si), r: 10,
          class: 'scale-note-dot ' + (mark === 'root' ? 'scale-note-root' : 'scale-note-in-scale')
        });
        svg.appendChild(dot);
        var t = el('text', {
          x: cx, y: stringY(si) + 4, class: 'scale-note-text'
        });
        t.textContent = note;
        svg.appendChild(t);
      }
    });

    // Fret number labels along the bottom
    for (var fn = 1; fn <= FRETS_SHOWN; fn++) {
      var fLabel = el('text', {
        x: fretX(fn) - fretGap / 2, y: height - 4, class: 'scale-fret-number'
      });
      fLabel.textContent = fn;
      svg.appendChild(fLabel);
    }

    container.innerHTML = '';
    container.appendChild(svg);
  }

  // ---------------------------------------------------------------
  // Page wiring
  // ---------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function () {
    var chromaticBoard = document.getElementById('chromaticFretboard');
    var chromaticSequenceEl = document.getElementById('chromaticSequence');

    if (chromaticBoard) {
      // Chromatic scale starting on A, for the note-sequence display.
      var sequence = [];
      for (var i = 0; i < 12; i++) {
        sequence.push(NOTES[i]);
      }
      if (chromaticSequenceEl) {
        chromaticSequenceEl.textContent = sequence.join(' – ') + ' – (repeats)';
      }

      // Every fretted note is "in scale" for the chromatic scale — highlight all.
      renderFretboard(chromaticBoard, function (note, stringIdx, fret) {
        return 'scale';
      });
    }

    var majorBoard = document.getElementById('majorFretboard');
    var rootSelect = document.getElementById('majorRootSelect');
    var majorSequenceEl = document.getElementById('majorSequence');

    if (majorBoard && rootSelect) {
      function updateMajorScale() {
        var root = rootSelect.value;
        var scaleNotes = buildMajorScale(root);

        if (majorSequenceEl) {
          majorSequenceEl.textContent = scaleNotes.join(' – ');
        }

        renderFretboard(majorBoard, function (note) {
          if (note === root) {
            return 'root';
          }
          return scaleNotes.indexOf(note) !== -1 ? 'scale' : null;
        });
      }

      rootSelect.addEventListener('change', updateMajorScale);
      updateMajorScale();
    }
  });
})();
