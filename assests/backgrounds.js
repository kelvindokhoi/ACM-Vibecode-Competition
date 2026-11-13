// Procedurally painted level backdrops (canvas -> Three.js texture).
// bg1: library reading room (day)       bg2: chem lab
// bg3: chem lab, contaminated (toxic)    bg4: reading room at night, on fire
// makeBackground(name, w, h) returns a THREE.Mesh plane, or null if unknown.
// The canvas maps to the full plane height; the floor line sits at 83% down,
// which lines up with game ground (y=0) for a 30-unit plane centered at y=10.
(function (root) {
  var S = 1024, FLOOR = 0.833;

  function rect(g, c, x, y, w, h) { g.fillStyle = c; g.fillRect(x * S, y * S, w * S, h * S); }
  function line(g, c, lw, x1, y1, x2, y2) { g.strokeStyle = c; g.lineWidth = lw; g.beginPath(); g.moveTo(x1 * S, y1 * S); g.lineTo(x2 * S, y2 * S); g.stroke(); }

  function library(g) {
    rect(g, '#eef0ec', 0, 0, 1, 0.38);                       // ceiling
    rect(g, '#dfe3df', 0, 0.33, 1, 0.05);                    // beam
    rect(g, '#b9d3d6', 0, 0.38, 1, FLOOR - 0.38);            // pale blue wall
    rect(g, '#f3f3ef', 0, 0.38, 1, 0.015);                   // crown molding
    rect(g, '#3b3b40', 0, FLOOR, 1, 1 - FLOOR);              // dark carpet
    for (var i = 0; i < 40; i++) rect(g, 'rgba(255,255,255,0.03)', Math.random(), FLOOR + Math.random() * 0.16, 0.05, 0.004);
    // Tall window
    rect(g, '#f4fafb', 0.09, 0.42, 0.13, 0.3);
    for (var r = 0; r < 4; r++) line(g, '#c8d4d4', 3, 0.09, 0.42 + r * 0.075, 0.22, 0.42 + r * 0.075);
    for (var c = 0; c < 3; c++) line(g, '#c8d4d4', 3, 0.09 + c * 0.043, 0.42, 0.09 + c * 0.043, 0.72);
    rect(g, '#ffffff', 0.08, 0.72, 0.15, 0.012);
    // Portraits
    [[0.25, '#2b3a6b'], [0.32, '#6b1f2a'], [0.39, '#1f2d55']].forEach(function (p) {
      rect(g, '#5a3d22', p[0], 0.5, 0.065, 0.09);
      rect(g, p[1], p[0] + 0.008, 0.508, 0.049, 0.074);
      rect(g, '#e7c9a3', p[0] + 0.024, 0.52, 0.018, 0.02);   // face
    });
    // Doorway with transom
    rect(g, '#f6f6f2', 0.6, 0.5, 0.11, FLOOR - 0.5);
    rect(g, '#c9dde0', 0.61, 0.51, 0.09, 0.05);
    rect(g, '#e9efee', 0.61, 0.57, 0.04, FLOOR - 0.58);
    rect(g, '#e9efee', 0.66, 0.57, 0.04, FLOOR - 0.58);
    // Columns
    [0.0, 0.5, 1.0].forEach(function (x) {
      rect(g, '#f7f7f3', x - 0.025, 0.36, 0.05, FLOOR - 0.36);
      rect(g, '#e4e4de', x - 0.035, 0.36, 0.07, 0.02);
      rect(g, '#6b4528', x - 0.035, FLOOR - 0.07, 0.07, 0.07); // wood base
    });
    // Pendant lights
    for (var k = 0; k < 6; k++) {
      var lx = 0.08 + k * 0.17;
      line(g, '#888', 2, lx, 0.33, lx, 0.4);
      rect(g, '#fafaf5', lx - 0.012, 0.4, 0.024, 0.025);
      g.fillStyle = 'rgba(255,240,200,0.18)'; g.beginPath(); g.arc(lx * S, 0.43 * S, 40, 0, Math.PI * 2); g.fill();
    }
    // Bookshelf with colorful books
    rect(g, '#7a5232', 0.76, 0.66, 0.2, FLOOR - 0.66);
    var cols = ['#c0392b', '#2e86c1', '#f1c40f', '#27ae60', '#8e44ad', '#e67e22', '#16a085'];
    for (var s = 0; s < 2; s++) for (var b = 0; b < 14; b++) {
      rect(g, cols[(b + s * 3) % cols.length], 0.765 + b * 0.0135, 0.675 + s * 0.08, 0.011, 0.06);
    }
    // Reading table + chairs
    rect(g, '#6b4528', 0.24, 0.75, 0.24, 0.018);
    rect(g, '#5a3a20', 0.25, 0.768, 0.012, FLOOR - 0.768);
    rect(g, '#5a3a20', 0.458, 0.768, 0.012, FLOOR - 0.768);
    [0.22, 0.47].forEach(function (x) {
      for (var sp = 0; sp < 4; sp++) line(g, '#4a2f18', 3, x + sp * 0.008, 0.7, x + sp * 0.008, 0.77);
      rect(g, '#4a2f18', x - 0.005, 0.77, 0.04, 0.008);
      line(g, '#4a2f18', 3, x, 0.778, x, FLOOR); line(g, '#4a2f18', 3, x + 0.03, 0.778, x + 0.03, FLOOR);
    });
  }

  function chemLab(g) {
    rect(g, '#2b2f33', 0, 0, 1, 0.38);                       // dark ceiling
    rect(g, '#8fbcb6', 0, 0.38, 1, FLOOR - 0.38);            // teal cinderblock
    for (var y = 0.38, row = 0; y < FLOOR; y += 0.024, row++) {
      line(g, 'rgba(40,70,66,0.35)', 2, 0, y, 1, y);
      for (var x = (row % 2) * 0.024; x < 1; x += 0.048) line(g, 'rgba(40,70,66,0.25)', 2, x, y, x, y + 0.024);
    }
    rect(g, '#d8c8a6', 0, FLOOR, 1, 1 - FLOOR);              // tan tile floor
    for (var t = 0; t < 1; t += 0.06) line(g, 'rgba(0,0,0,0.08)', 2, t, FLOOR, t, 1);
    line(g, '#2f6fb3', 3, 0, 0.4, 1, 0.41);                   // conduit/cables
    // Shelving unit with parts bins
    rect(g, '#2a2a2a', 0.02, 0.44, 0.12, 0.27);
    for (var r = 0; r < 4; r++) for (var c = 0; c < 4; c++) rect(g, '#b8bec4', 0.027 + c * 0.028, 0.45 + r * 0.06, 0.024, 0.05);
    // Fume hood with duct
    rect(g, '#9aa0a6', 0.29, 0.0, 0.04, 0.47);
    g.fillStyle = '#b4b9be';
    g.beginPath(); g.moveTo(0.22 * S, 0.56 * S); g.lineTo(0.27 * S, 0.47 * S); g.lineTo(0.35 * S, 0.47 * S); g.lineTo(0.4 * S, 0.56 * S); g.closePath(); g.fill();
    rect(g, '#7d8287', 0.22, 0.555, 0.18, 0.01);
    // Corkboard
    rect(g, '#6e5130', 0.43, 0.5, 0.13, 0.12);
    rect(g, '#c49a64', 0.435, 0.505, 0.12, 0.11);
    // Long counter with cabinets
    rect(g, '#1f1f22', 0, 0.68, 0.62, 0.02);
    rect(g, '#9b7a52', 0, 0.7, 0.62, FLOOR - 0.7);
    for (var d = 0; d < 0.62; d += 0.08) { line(g, '#6e5435', 2, d, 0.7, d, FLOOR); rect(g, '#d8d8d8', d + 0.035, 0.72, 0.012, 0.004); }
    // Bottles and glassware on counter
    [[0.17, '#5dade2'], [0.19, '#f5f5f5'], [0.21, '#f1948a'], [0.235, '#f5f5f5'], [0.47, '#82e0aa']].forEach(function (b) {
      rect(g, b[1], b[0], 0.63, 0.016, 0.05); rect(g, '#555', b[0] + 0.004, 0.62, 0.008, 0.01);
    });
    // Instruments on the right bench
    rect(g, '#f2f2f2', 0.7, 0.7, 0.3, 0.015);
    rect(g, '#ececec', 0.7, 0.715, 0.3, FLOOR - 0.715);
    rect(g, '#e6e2d6', 0.73, 0.6, 0.13, 0.1);
    rect(g, '#cfc9b8', 0.75, 0.62, 0.09, 0.02);
    rect(g, '#d9d9d9', 0.88, 0.62, 0.09, 0.08);
    rect(g, '#2ecc71', 0.95, 0.64, 0.008, 0.008);
    rect(g, '#e6e2d6', 0.74, 0.47, 0.08, 0.1);                // wall cabinet
    rect(g, '#f4f4f4', 0.88, 0.45, 0.1, 0.14);                 // whiteboard
  }

  function overlay(g, top, bottom) {
    var gr = g.createLinearGradient(0, 0, 0, S);
    gr.addColorStop(0, top); gr.addColorStop(1, bottom);
    g.fillStyle = gr; g.fillRect(0, 0, S, S);
  }

  var PAINT = {
    bg1: function (g) { library(g); overlay(g, 'rgba(255,102,0,0.05)', 'rgba(100,10,40,0.12)'); },
    bg2: function (g) { chemLab(g); overlay(g, 'rgba(0,0,0,0.05)', 'rgba(124,255,58,0.08)'); },
    bg3: function (g) {
      chemLab(g);
      overlay(g, 'rgba(10,30,10,0.45)', 'rgba(60,200,40,0.35)');
      for (var i = 0; i < 12; i++) {                           // toxic drips
        var x = Math.random(), len = 0.05 + Math.random() * 0.15;
        rect(g, 'rgba(124,255,58,0.6)', x, 0.38, 0.006, len);
        g.fillStyle = 'rgba(124,255,58,0.7)'; g.beginPath(); g.arc(x * S + 3, (0.38 + len) * S, 6, 0, Math.PI * 2); g.fill();
      }
    },
    bg4: function (g) {
      library(g);
      overlay(g, 'rgba(20,5,30,0.6)', 'rgba(255,90,0,0.45)');
      for (var i = 0; i < 25; i++) {                           // smoke + embers
        g.fillStyle = 'rgba(30,20,30,0.25)'; g.beginPath(); g.arc(Math.random() * S, Math.random() * 0.4 * S, 40 + Math.random() * 60, 0, Math.PI * 2); g.fill();
        rect(g, '#ffb347', Math.random(), 0.3 + Math.random() * 0.5, 0.004, 0.004);
      }
    },
  };

  root.makeBackground = function (name, w, h) {
    if (!PAINT[name] || typeof THREE === 'undefined') return null;
    var cv = document.createElement('canvas');
    cv.width = cv.height = S;
    PAINT[name](cv.getContext('2d'));
    var tex = new THREE.CanvasTexture(cv);
    tex.wrapS = THREE.RepeatWrapping;
    tex.repeat.set(Math.max(1, Math.round(w / h)), 1);        // square tiles, no stretching
    var m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex, color: 0xcccccc }));
    return m;
  };
})(typeof window !== 'undefined' ? window : globalThis);
