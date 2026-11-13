// game.js - Scots on Fire: main loop, level flow, input, camera.
(function () {
  'use strict';

  var FALLBACK_LEVELS = [{
    name: 'Fallback Quad', intro: 'The Sewanee tiger set the quad on fire! Put out the flames.',
    bg: 'bg1', timeLimit: 90, length: 60,
    goal: { type: 'fire', fraction: 0.8 },
    platforms: [{ x: 15, y: 2, w: 4, h: 0.5 }, { x: 30, y: 3, w: 5, h: 0.5 }],
    fires: [{ x: 12, y: 0 }, { x: 25, y: 0 }, { x: 40, y: 0 }],
    toxics: [], zombies: [], pickups: [{ type: 'extinguisher', x: 20, y: 0.5 }],
    boss: null, landmarks: [{ x: 5, label: 'Maryville College' }]
  }];
  var BG_COLORS = { bg1: 0x223355, bg2: 0x332233, bg3: 0x223322, bg4: 0x331a1a };

  var renderer, scene, camera, clock;
  var levelObjs = [];
  var keys = {};
  var loggedFrameErr = false, loggedBuildErr = false;
  var levelClearTimer = null;
  var game = window.game = {
    scene: null, player: null, entities: [], solids: [], level: null,
    levelIndex: 0, timeLeft: 0, state: 'title', boss: null, totals: null
  };

  function levels() {
    return (typeof LEVELS !== 'undefined' && LEVELS && LEVELS.length) ? LEVELS : FALLBACK_LEVELS;
  }
  function ui(fn) {
    try {
      if (typeof UI !== 'undefined' && UI && typeof UI[fn] === 'function') {
        return UI[fn].apply(UI, Array.prototype.slice.call(arguments, 1));
      }
    } catch (e) { console.warn('UI.' + fn + ' failed', e); }
  }
  function screen(opts) {
    if (typeof UI !== 'undefined' && UI && UI.showScreen) { ui('showScreen', opts); }
    else if (opts.onClick) { setTimeout(opts.onClick, 0); }
  }

  function init() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.zIndex = '0';
    document.body.insertBefore(renderer.domElement, document.body.firstChild);

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111122);
    game.scene = scene;
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 500);
    camera.position.set(0, 5, 18);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x444466, 0.9));
    var dir = new THREE.DirectionalLight(0xffeedd, 0.8);
    dir.position.set(5, 10, 10);
    scene.add(dir);

    window.addEventListener('resize', function () {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', function (e) { keys[e.code] = false; });

    clock = new THREE.Clock();
    showTitle();
    requestAnimationFrame(loop);
  }

  function onKeyDown(e) {
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(e.code) >= 0) e.preventDefault();
    var wasDown = keys[e.code];
    keys[e.code] = true;
    if (wasDown || game.state !== 'playing' || !game.player) return;
    var p = game.player;
    try {
      if (e.code === 'Space' || e.code === 'KeyW' || e.code === 'ArrowUp') p.jump();
      else if (e.code === 'KeyJ') p.sprayExtinguisher(game);
      else if (e.code === 'KeyK') p.throwVial(game);
      else if (e.code === 'KeyR') startLevel(game.levelIndex, true);
    } catch (err) { console.warn('input error', err); }
  }

  function showTitle() {
    game.state = 'title';
    screen({
      title: 'Scots on Fire',
      body: 'The rival Sewanee tiger has set Maryville College ablaze! As the Scot, grab fire extinguishers, ' +
        'neutralizing vials and energy drinks to save campus and the Spirit trophy.<br><br>' +
        'Move: A/D or Arrows &nbsp; Jump: Space/W/Up &nbsp; Spray: J &nbsp; Vial: K &nbsp; Restart: R',
      button: 'Start',
      onClick: function () { ui('hideScreen'); ui('showControls'); startLevel(0, false); }
    });
  }

  function clearLevel() {
    var i;
    for (i = 0; i < game.entities.length; i++) {
      try { game.entities[i].destroy(); } catch (e) {}
    }
    if (game.player) { try { game.player.destroy(); } catch (e) {} }
    for (i = 0; i < levelObjs.length; i++) scene.remove(levelObjs[i]);
    levelObjs = [];
    game.entities = [];
    game.solids = [];
    game.player = null;
    game.boss = null;
  }

  function addObj(o) { scene.add(o); levelObjs.push(o); return o; }

  function placeLandmarkModel(text, x) {
    try {
      if (typeof MascotModels !== 'function') return;
      if (!window.__mascotModels) window.__mascotModels = MascotModels(THREE);
      var M = window.__mascotModels, t = text.toLowerCase(), b = null, hgt = 7;
      if (t.indexOf('sutton') >= 0) { b = M.sutton; hgt = 8; }
      else if (t.indexOf('makerspace') >= 0) { b = M.printer3d; hgt = 2.2; }
      else if (t.indexOf('anderson') >= 0) { b = M.andersonTower; hgt = 11; }
      else if (t.indexOf('covenant') >= 0) { b = M.covenantStone; hgt = 2.2; }
      else if (t.indexOf('chem') >= 0 || t.indexOf('hazmat') >= 0) { b = M.labBench; hgt = 2; }
      if (typeof b !== 'function') return;
      var model = b();
      var bb = new THREE.Box3().setFromObject(model), sz = new THREE.Vector3(); bb.getSize(sz);
      var sc = sz.y > 0 ? hgt / sz.y : 1; model.scale.setScalar(sc);
      bb = new THREE.Box3().setFromObject(model);
      var c = new THREE.Vector3(); bb.getCenter(c);
      model.position.set(x - c.x, -bb.min.y, -5 - c.z);
      addObj(model);
    } catch (e) { console.warn('landmark model failed', e); }
  }

  function makeSign(text, x) {
    placeLandmarkModel(text, x);
    var c = document.createElement('canvas');
    c.width = 512; c.height = 128;
    var g = c.getContext('2d');
    g.fillStyle = '#7a1f2b'; g.fillRect(0, 0, 512, 128);
    g.strokeStyle = '#ffffff'; g.lineWidth = 6; g.strokeRect(4, 4, 504, 120);
    g.fillStyle = '#ffffff'; g.font = 'bold 40px sans-serif';
    g.textAlign = 'center'; g.textBaseline = 'middle';
    g.fillText(text, 256, 64, 490);
    var tex = new THREE.CanvasTexture(c);
    var m = new THREE.Mesh(new THREE.PlaneGeometry(4, 1), new THREE.MeshBasicMaterial({ map: tex, transparent: true }));
    m.position.set(x, 5.5, -3);
    addObj(m);
    var post = new THREE.Mesh(new THREE.BoxGeometry(0.15, 5, 0.15), new THREE.MeshLambertMaterial({ color: 0x555555 }));
    post.position.set(x, 2.5, -3);
    addObj(post);
  }

  function safeNew(Cls, args) {
    try {
      if (typeof Cls !== 'function') return null;
      var o = new (Function.prototype.bind.apply(Cls, [null].concat(args)))();
      game.entities.push(o);
      return o;
    } catch (e) { console.warn('entity create failed', e); return null; }
  }

  function startLevel(idx, quick) {
    if (levelClearTimer) { clearTimeout(levelClearTimer); levelClearTimer = null; }
    var L = levels()[idx];
    game.levelIndex = idx;
    game.level = L;
    game.state = 'intro';
    try { buildLevel(L); } catch (e) {
      if (!loggedBuildErr) { console.error('level build error', e); loggedBuildErr = true; }
    }
    ui('setLevel', idx, L.name);
    ui('setBossHP', null);
    var go = function () { ui('hideScreen'); game.state = 'playing'; clock.getDelta(); };
    if (quick) { go(); ui('toast', 'Level restarted', 1200); return; }
    screen({
      title: 'Level ' + (idx + 1) + ': ' + L.name,
      body: L.intro || '',
      button: 'Go!',
      onClick: go
    });
  }

  function buildLevel(L) {
    clearLevel();
    var len = L.length || 60;
    game.timeLeft = L.timeLimit || 120;

    // Background
    try {
      var bg = (typeof makeBackground === 'function' && makeBackground(L.bg, len + 40, 30)) || ((typeof makeSprite === 'function')
        ? makeSprite(L.bg, len + 40, 30, BG_COLORS[L.bg] || 0x223355)
        : new THREE.Mesh(new THREE.PlaneGeometry(len + 40, 30), new THREE.MeshBasicMaterial({ color: BG_COLORS[L.bg] || 0x223355 })));
      bg.position.set(len / 2, 10, -8);
      addObj(bg);
    } catch (e) { console.warn('bg failed', e); }

    // Ground
    var ground = new THREE.Mesh(new THREE.BoxGeometry(len + 40, 1, 4), new THREE.MeshLambertMaterial({ color: 0x2a2a2a }));
    ground.position.set(len / 2, -0.5, 0);
    addObj(ground);
    var grass = new THREE.Mesh(new THREE.BoxGeometry(len + 40, 0.05, 4), new THREE.MeshLambertMaterial({ color: 0x2f5a2a }));
    grass.position.set(len / 2, 0.01, 0);
    addObj(grass);
    game.solids.push(new THREE.Box2(new THREE.Vector2(-20, -1), new THREE.Vector2(len + 20, 0)));

    // Platforms
    var plats = L.platforms || [];
    for (var i = 0; i < plats.length; i++) {
      var p = plats[i];
      var h = p.h || 0.5, w = p.w || 2;
      var mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, 2),
        new THREE.MeshLambertMaterial({ color: i % 2 ? 0x777777 : 0x7a1f2b }));
      // levels.js gives x,y as the CENTER of the platform box
      mesh.position.set(p.x, p.y, 0);
      addObj(mesh);
      game.solids.push(new THREE.Box2(new THREE.Vector2(p.x - w / 2, p.y - h / 2), new THREE.Vector2(p.x + w / 2, p.y + h / 2)));
    }

    // Landmarks
    var lm = L.landmarks || [];
    for (i = 0; i < lm.length; i++) { try { makeSign(lm[i].label, lm[i].x); } catch (e) {} }

    // Entities
    var list = function (arr, Cls, extra) {
      arr = arr || [];
      for (var j = 0; j < arr.length; j++) {
        var a = [scene, arr[j].x, arr[j].y];
        if (extra) a.push(arr[j].type);
        safeNew(Cls, a);
      }
    };
    list(L.fires, window.Fire || (typeof Fire !== 'undefined' ? Fire : null));
    list(L.toxics, window.Toxic || (typeof Toxic !== 'undefined' ? Toxic : null));
    list(L.zombies, window.Zombie || (typeof Zombie !== 'undefined' ? Zombie : null));
    list(L.pickups, window.Pickup || (typeof Pickup !== 'undefined' ? Pickup : null), true);
    if (L.boss && typeof Boss === 'function') {
      game.boss = safeNew(Boss, [scene, L.boss.x, L.boss.y]);
    }

    game.totals = {
      fire: (L.fires || []).length,
      toxic: (L.toxics || []).length
    };

    if (typeof Player === 'function') {
      game.player = new Player(scene, 2, 1);
    }
    camera.position.set(game.player ? game.player.mesh.position.x : 2, 4, 18);
  }

  function countCleared(Cls) {
    var n = 0;
    if (typeof Cls !== 'function') return 0;
    for (var i = 0; i < game.entities.length; i++) {
      var e = game.entities[i];
      if (e instanceof Cls && !e.alive) n++;
    }
    return n;
  }

  // Track cleared counts persistently since dead entities get removed.
  var cleared = { fire: 0, toxic: 0 };

  function checkGoal() {
    var L = game.level, g = L.goal || { type: 'fire', fraction: 0.8 };
    var frac = g.fraction == null ? 0.8 : g.fraction;
    var t = game.totals || { fire: 0, toxic: 0 };
    var text, done = false;
    if (g.type === 'boss') {
      var b = game.boss;
      var bhp = b ? Math.max(0, b.hp) : 0;
      text = 'Defeat the Sewanee tiger! (' + bhp + ' HP left)';
      done = !b || b.hp <= 0 || !b.alive;
    } else {
      var have, total, label;
      if (g.type === 'toxic') { have = cleared.toxic; total = t.toxic; label = 'Toxic spills cleaned'; }
      else if (g.type === 'both') { have = cleared.fire + cleared.toxic; total = t.fire + t.toxic; label = 'Hazards cleared'; }
      else { have = cleared.fire; total = t.fire; label = 'Fires out'; }
      var need = Math.max(1, Math.ceil(total * frac));
      if (total === 0) need = 0;
      text = label + ': ' + have + '/' + total + ' (need ' + need + ')';
      done = have >= need;
    }
    ui('setObjective', text);
    return done;
  }

  function lose(reason) {
    game.state = 'lost';
    screen({
      title: 'Campus is burning!',
      body: reason,
      button: 'Retry level',
      onClick: function () { ui('hideScreen'); startLevel(game.levelIndex, false); }
    });
  }

  function win() {
    game.state = 'won';
    screen({
      title: 'Spirit trophy saved!',
      body: 'The Sewanee tiger is defeated and Maryville College is safe. Go Scots!',
      button: 'Play again',
      onClick: function () { ui('hideScreen'); startLevel(0, false); }
    });
  }

  function levelComplete() {
    game.state = 'clear';
    ui('toast', 'Level clear!', 1500);
    levelClearTimer = setTimeout(function () {
      levelClearTimer = null;
      if (game.levelIndex + 1 < levels().length) startLevel(game.levelIndex + 1, false);
      else win();
    }, 1500);
  }

  function update(dt) {
    var p = game.player;
    if (!p) return;
    var dir = 0;
    if (keys.ArrowLeft || keys.KeyA) dir -= 1;
    if (keys.ArrowRight || keys.KeyD) dir += 1;
    p.moveInput(dir);
    p.update(dt, game);

    var FireC = typeof Fire === 'function' ? Fire : null;
    var ToxicC = typeof Toxic === 'function' ? Toxic : null;
    var PickupC = typeof Pickup === 'function' ? Pickup : null;
    var pbox = p.box();

    for (var i = game.entities.length - 1; i >= 0; i--) {
      var e = game.entities[i];
      try {
        if (e.alive) e.update(dt, game);
        if (e.alive && PickupC && e instanceof PickupC && e.box && pbox.intersectsBox(e.box())) {
          e.collect(game);
        }
      } catch (err) {
        if (!loggedFrameErr) { console.error('entity update error', err); loggedFrameErr = true; }
      }
      if (!e.alive && e !== game.boss) {
        if (FireC && e instanceof FireC) cleared.fire++;
        else if (ToxicC && e instanceof ToxicC) cleared.toxic++;
        try { e.destroy(); } catch (err2) {}
        game.entities.splice(i, 1);
      }
    }

    game.timeLeft -= dt;
    ui('setTimer', Math.max(0, Math.ceil(game.timeLeft)));
    ui('setHP', Math.max(0, p.hp), p.maxHp || 100);
    ui('setAmmo', p.ammo ? p.ammo.extinguisher : 0, p.ammo ? p.ammo.vial : 0);
    ui('setBoost', Date.now() < (p.speedBoostUntil || 0));
    if (game.boss) ui('setBossHP', Math.max(0, game.boss.hp), game.boss.maxHp || 10);

    if (checkGoal()) { levelComplete(); return; }
    if (p.hp <= 0) { lose('The Scot was overwhelmed. Watch out for flames, toxic spills and zombies!'); return; }
    if (game.timeLeft <= 0) { lose('Out of time! The fire spread across campus.'); return; }
  }

  function updateCamera(dt) {
    var p = game.player;
    if (!p || !p.mesh) return;
    var tx = p.mesh.position.x, ty = Math.max(3.5, p.mesh.position.y + 2.5);
    var k = Math.min(1, dt * 4);
    camera.position.x += (tx - camera.position.x) * k;
    camera.position.y += (ty - camera.position.y) * k;
    camera.position.z = 18;
    camera.lookAt(camera.position.x, camera.position.y - 1.5, 0);
  }

  var lastBossHp = null;
  function animateModels() {
    try {
      var t = performance.now() / 1000, now = Date.now();
      var p = game.player;
      if (p && p.mesh && p.mesh.userData.model) {
        var hm = p.mesh.userData.model.userData;
        var anim = 'idle';
        if (now - (p.lastSpray || 0) < 300) anim = 'spray';
        else if (now < (p.invulnUntil || 0) - 500) anim = 'hurt';
        else if (Math.abs(p.vx) > 0.5) anim = 'run';
        hm.anim = anim;
        if (hm.setState) hm.setState({ speed: now < (p.speedBoostUntil || 0), extinguisher: true, vial: false });
      }
      var b = game.boss;
      if (b && b.mesh && b.mesh.userData.model) {
        var bm = b.mesh.userData.model.userData;
        bm.anim = b.alive ? (b.onGround ? 'walk' : 'pounce') : 'stunned';
        if (lastBossHp !== null && b.hp < lastBossHp) bm.hit = 1;
        lastBossHp = b.hp;
      } else lastBossHp = null;
      var list = window.__animModels || [];
      for (var i = list.length - 1; i >= 0; i--) {
        var w = list[i];
        if (!w.parent) { list.splice(i, 1); continue; }
        var u = w.userData.model && w.userData.model.userData;
        if (u && typeof u.update === 'function') u.update(t);
      }
    } catch (e) { if (!window.__animWarned) { window.__animWarned = true; console.warn('animateModels', e); } }
  }

  function loop() {
    requestAnimationFrame(loop);
    var dt = Math.min(0.05, clock.getDelta());
    try {
      if (game.state === 'playing') update(dt);
      else if (game.state === 'clear' && game.player) {
        // keep idle animation running but no input
        try { game.player.moveInput(0); game.player.update(dt, game); } catch (e) {}
      }
      updateCamera(dt);
    } catch (e) {
      if (!loggedFrameErr) { console.error('frame error', e); loggedFrameErr = true; }
    }
    animateModels();
    renderer.render(scene, camera);
  }

  // Reset cleared counters whenever a level is built.
  var _build = buildLevel;
  buildLevel = function (L) { cleared = { fire: 0, toxic: 0 }; _build(L); };

  window.addEventListener('load', function () {
    if (typeof THREE === 'undefined') { console.error('THREE not loaded'); return; }
    init();
  });
})();
