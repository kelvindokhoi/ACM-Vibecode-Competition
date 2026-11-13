// Mascot Mayhem: procedural low-poly 3D assets for Three.js (r150+).
// Maryville palette: garnet #640A28, orange #FF6600, gray + yellow accents.
// Rival palette: purple, white, gold.
//
// Usage (classic or module page, after Three.js is loaded):
//   const M = MascotModels(THREE);
//   const hero = M.hero(); scene.add(hero);
//   // each frame: hero.userData.update(timeSeconds)
//
// Conventions: side view, characters face +X, origin at feet (y = 0),
// characters ~1 unit tall, all objects are THREE.Group with userData.update(t).
(function (root) {
  function MascotModels(THREE) {
    const C = {
      garnet: 0x640a28, garnetDark: 0x3d0618, orange: 0xff6600, orangeLight: 0xff9a3c,
      gray: 0x8a8d91, grayDark: 0x4a4d52, yellow: 0xffd23f, skin: 0xf1c27d,
      white: 0xf5f5f5, black: 0x1a1a1a, purple: 0x4b2e83, purpleDark: 0x2e1a55,
      gold: 0xd4a017, toxic: 0x7cff3a, toxicDark: 0x2f8f10, zombieSkin: 0x8fbf6a,
      brick: 0x8a2a1c, glass: 0x9fd8ff,
    };

    const matCache = {};
    function mat(color, opts) {
      const key = color + JSON.stringify(opts || {});
      if (!matCache[key]) {
        matCache[key] = new THREE.MeshStandardMaterial(Object.assign(
          { color, flatShading: true, roughness: 0.7, metalness: 0.05 }, opts || {}));
      }
      return matCache[key];
    }
    function glow(color, intensity) {
      return mat(color, { emissive: color, emissiveIntensity: intensity == null ? 0.8 : intensity });
    }
    function mesh(geo, material, x, y, z, parent) {
      const m = new THREE.Mesh(geo, material);
      m.position.set(x || 0, y || 0, z || 0);
      m.castShadow = true; m.receiveShadow = true;
      if (parent) parent.add(m);
      return m;
    }
    const box = (w, h, d, m, x, y, z, p) => mesh(new THREE.BoxGeometry(w, h, d), m, x, y, z, p);
    const sphere = (r, m, x, y, z, p, seg) => mesh(new THREE.SphereGeometry(r, seg || 8, seg ? seg - 2 : 6), m, x, y, z, p);
    const cyl = (rt, rb, h, m, x, y, z, p, seg) => mesh(new THREE.CylinderGeometry(rt, rb, h, seg || 10), m, x, y, z, p);
    const cone = (r, h, m, x, y, z, p, seg) => mesh(new THREE.ConeGeometry(r, h, seg || 7), m, x, y, z, p);

    // Pivot group so limbs rotate from a joint instead of their center.
    function limb(parent, x, y, z) {
      const g = new THREE.Group(); g.position.set(x, y, z); parent.add(g); return g;
    }
    function group(name) {
      const g = new THREE.Group(); g.name = name; g.userData.update = () => {}; return g;
    }

    // ---------------- HERO: original Scot-inspired firefighter ----------------
    // Opts: { extinguisher: true, vial: false, speed: false } toggle visible state overlays.
    function hero(opts) {
      opts = Object.assign({ extinguisher: true, vial: false, speed: false }, opts);
      const g = group('hero');
      const body = new THREE.Group(); g.add(body);

      // Legs (pivot at hip)
      const legL = limb(body, 0, 0.42, 0.09), legR = limb(body, 0, 0.42, -0.09);
      [legL, legR].forEach((leg) => {
        box(0.1, 0.3, 0.1, mat(C.skin), 0, -0.15, 0, leg);
        box(0.12, 0.12, 0.12, mat(C.white), 0, -0.3, 0, leg);          // tall socks
        box(0.16, 0.06, 0.12, mat(C.black), 0.03, -0.39, 0, leg);      // boots
      });
      // Kilt: garnet with orange + yellow tartan stripes
      cyl(0.17, 0.24, 0.2, mat(C.garnet), 0, 0.43, 0, body, 8);
      cyl(0.205, 0.215, 0.025, mat(C.orange), 0, 0.46, 0, body, 8);
      cyl(0.225, 0.232, 0.02, mat(C.yellow), 0, 0.39, 0, body, 8);
      // Torso: orange jersey with garnet sash
      box(0.3, 0.28, 0.26, mat(C.orange), 0, 0.66, 0, body);
      const sash = box(0.32, 0.06, 0.28, mat(C.garnet), 0, 0.68, 0, body);
      sash.rotation.x = 0.6;
      // Head + red beard + tam o' shanter
      const head = limb(body, 0, 0.8, 0);
      box(0.24, 0.22, 0.22, mat(C.skin), 0, 0.11, 0, head);
      box(0.06, 0.04, 0.04, mat(C.black), 0.12, 0.15, 0.06, head);     // eyes
      box(0.06, 0.04, 0.04, mat(C.black), 0.12, 0.15, -0.06, head);
      box(0.08, 0.1, 0.2, mat(C.orangeLight), 0.1, 0.02, 0, head);      // beard
      cyl(0.17, 0.15, 0.06, mat(C.garnet), -0.01, 0.25, 0, head, 10);    // tam
      sphere(0.05, mat(C.orange), -0.01, 0.31, 0, head);                 // pom-pom
      // Arms (pivot at shoulder)
      const armF = limb(body, 0.02, 0.76, 0.18), armB = limb(body, 0.02, 0.76, -0.18);
      [armF, armB].forEach((arm) => {
        box(0.08, 0.26, 0.08, mat(C.orange), 0, -0.11, 0, arm);
        box(0.08, 0.06, 0.08, mat(C.skin), 0, -0.26, 0, arm);
      });
      // Tool overlays held in the front hand
      const tool = new THREE.Group(); tool.position.set(0, -0.26, 0.02); armF.add(tool);
      const ext = extinguisherMesh(0.55); ext.rotation.z = -Math.PI / 2; ext.position.x = 0.02; tool.add(ext);
      const vl = vialMesh(0.6); vl.rotation.z = -Math.PI / 2; vl.position.x = 0.04; tool.add(vl);
      // Speed-boost aura + trail
      const aura = sphere(0.55, mat(C.yellow, { transparent: true, opacity: 0.18, emissive: C.orange, emissiveIntensity: 0.6, depthWrite: false }), 0, 0.55, 0, g, 12);
      aura.castShadow = false;
      const trail = new THREE.Group(); g.add(trail);
      for (let i = 0; i < 3; i++) {
        const t = box(0.35 - i * 0.08, 0.04, 0.04, glow(i % 2 ? C.orange : C.yellow, 1), -0.35 - i * 0.18, 0.35 + i * 0.18, 0, trail);
        t.castShadow = false;
      }

      function setState(s) {
        Object.assign(opts, s);
        ext.visible = !!opts.extinguisher && !opts.vial;
        vl.visible = !!opts.vial;
        aura.visible = trail.visible = !!opts.speed;
      }
      setState({});

      // anim: 'idle' | 'run' | 'spray' | 'hurt'
      g.userData.anim = 'idle';
      g.userData.setState = setState;
      g.userData.parts = { body, head, legL, legR, armF, armB, tool, aura, trail };
      g.userData.update = (t) => {
        const a = g.userData.anim, sp = opts.speed ? 2 : 1;
        body.position.y = 0; body.rotation.z = 0;
        if (a === 'run') {
          const s = Math.sin(t * 14 * sp);
          legL.rotation.z = s * 0.7; legR.rotation.z = -s * 0.7;
          armB.rotation.z = s * 0.6; armF.rotation.z = -s * 0.6;
          body.position.y = Math.abs(Math.cos(t * 14 * sp)) * 0.04;
        } else if (a === 'spray') {
          legL.rotation.z = legR.rotation.z = 0;
          armF.rotation.z = Math.PI / 2 + Math.sin(t * 40) * 0.04;
          armB.rotation.z = Math.PI / 2.4;
        } else if (a === 'hurt') {
          body.rotation.z = 0.35; armF.rotation.z = armB.rotation.z = 2.4;
        } else {
          legL.rotation.z = legR.rotation.z = 0;
          armF.rotation.z = armB.rotation.z = Math.sin(t * 2) * 0.05;
          body.position.y = Math.sin(t * 3) * 0.01;
        }
        aura.scale.setScalar(1 + Math.sin(t * 10) * 0.06);
        trail.children.forEach((c, i) => (c.position.x = -0.35 - i * 0.18 - ((t * 3 + i * 0.3) % 0.3)));
      };
      return g;
    }

    // ---------------- RIVAL BOSS: original purple tiger ----------------
    function tiger() {
      const g = group('tiger');
      const body = new THREE.Group(); g.add(body);
      const P = mat(C.purple), W = mat(C.white), G = mat(C.gold);
      box(1.3, 0.55, 0.6, P, 0, 0.75, 0, body);                         // torso
      box(1.1, 0.12, 0.5, W, 0.05, 0.47, 0, body);                       // belly
      for (let i = 0; i < 4; i++) box(0.08, 0.57, 0.62, G, -0.45 + i * 0.28, 0.76, 0, body); // stripes
      // Head
      const head = limb(body, 0.75, 0.95, 0);
      box(0.5, 0.45, 0.5, P, 0.1, 0, 0, head);
      box(0.22, 0.2, 0.36, W, 0.4, -0.1, 0, head);                       // muzzle
      box(0.08, 0.07, 0.1, mat(C.black), 0.52, -0.02, 0, head);          // nose
      box(0.04, 0.1, 0.06, G, 0.36, 0.08, 0.15, head);                   // eyes (gold, angry)
      box(0.04, 0.1, 0.06, G, 0.36, 0.08, -0.15, head);
      const browL = box(0.03, 0.04, 0.14, mat(C.black), 0.37, 0.15, 0.15, head); browL.rotation.x = 0.4;
      const browR = box(0.03, 0.04, 0.14, mat(C.black), 0.37, 0.15, -0.15, head); browR.rotation.x = -0.4;
      cone(0.1, 0.18, P, 0.0, 0.28, 0.17, head, 4);                      // ears
      cone(0.1, 0.18, P, 0.0, 0.28, -0.17, head, 4);
      box(0.06, 0.45, 0.52, G, -0.05, 0.02, 0, head);                    // head stripe
      const jaw = limb(head, 0.25, -0.2, 0);
      box(0.3, 0.08, 0.3, W, 0.12, -0.03, 0, jaw);
      cone(0.025, 0.08, W, 0.24, 0.04, 0.1, jaw, 4).rotation.x = Math.PI; // fangs
      cone(0.025, 0.08, W, 0.24, 0.04, -0.1, jaw, 4).rotation.x = Math.PI;
      // Legs
      const legs = [[0.45, 0.2], [0.45, -0.2], [-0.45, 0.2], [-0.45, -0.2]].map(([x, z]) => {
        const l = limb(body, x, 0.55, z);
        box(0.18, 0.5, 0.18, P, 0, -0.25, 0, l);
        box(0.24, 0.08, 0.2, W, 0.04, -0.52, 0, l);
        return l;
      });
      // Tail (segmented, waves)
      const tail = limb(body, -0.65, 0.9, 0);
      const segs = [];
      let parent = tail;
      for (let i = 0; i < 5; i++) {
        const s = limb(parent, i === 0 ? 0 : -0.14, 0, 0);
        box(0.15, 0.08, 0.08, i % 2 ? G : P, -0.07, 0, 0, s);
        segs.push(s); parent = s;
      }
      // Hit flash: set g.userData.hit = 1 when sprayed; it decays.
      const flashMats = new Set();
      g.traverse((o) => { if (o.isMesh) { o.material = o.material.clone(); flashMats.add(o.material); } });
      g.userData.hit = 0;
      g.userData.anim = 'idle'; // 'idle' | 'walk' | 'pounce' | 'roar' | 'stunned'
      g.userData.parts = { body, head, jaw, legs, tail };
      g.userData.update = (t) => {
        const a = g.userData.anim;
        body.rotation.z = 0; body.position.y = 0;
        jaw.rotation.z = -Math.abs(Math.sin(t * 2)) * 0.15;
        if (a === 'walk' || a === 'pounce') {
          const k = a === 'pounce' ? 16 : 8, s = Math.sin(t * k);
          legs[0].rotation.z = legs[3].rotation.z = s * 0.5;
          legs[1].rotation.z = legs[2].rotation.z = -s * 0.5;
          if (a === 'pounce') { body.rotation.z = 0.25; body.position.y = 0.2 + Math.abs(s) * 0.2; }
        } else {
          legs.forEach((l) => (l.rotation.z = 0));
          body.position.y = Math.sin(t * 2) * 0.02;
        }
        if (a === 'roar') { jaw.rotation.z = -0.5; head.rotation.z = 0.2 + Math.sin(t * 30) * 0.03; }
        else head.rotation.z = Math.sin(t * 1.5) * 0.05;
        if (a === 'stunned') { body.rotation.z = Math.sin(t * 6) * 0.08; head.rotation.y = Math.sin(t * 4) * 0.4; }
        else head.rotation.y = 0;
        segs.forEach((s, i) => (s.rotation.z = 0.35 + Math.sin(t * 3 + i * 0.6) * 0.25));
        g.userData.hit = Math.max(0, g.userData.hit - 0.05);
        flashMats.forEach((m) => { m.emissive.setHex(0xffffff); m.emissiveIntensity = g.userData.hit * 0.9; });
      };
      return g;
    }

    // ---------------- TOXIC ZOMBIE ----------------
    // variant 'a' (garnet shirt, lab coat) or 'b' (gray hoodie)
    function zombie(variant) {
      const g = group('zombie');
      const body = new THREE.Group(); g.add(body);
      const shirt = variant === 'b' ? mat(C.grayDark) : mat(C.white);
      const pants = variant === 'b' ? mat(C.garnetDark) : mat(C.grayDark);
      const legL = limb(body, 0, 0.4, 0.08), legR = limb(body, 0, 0.4, -0.08);
      [legL, legR].forEach((l) => { box(0.11, 0.38, 0.11, pants, 0, -0.19, 0, l); box(0.15, 0.05, 0.12, mat(C.black), 0.02, -0.38, 0, l); });
      box(0.28, 0.36, 0.24, shirt, 0, 0.58, 0, body);
      box(0.1, 0.12, 0.26, glow(C.toxic, 0.6), -0.05, 0.5, 0, body);    // toxic stain
      const head = limb(body, 0.03, 0.76, 0);
      box(0.22, 0.22, 0.2, mat(C.zombieSkin), 0, 0.11, 0, head);
      box(0.04, 0.05, 0.05, glow(C.toxic, 1.5), 0.11, 0.14, 0.05, head);
      box(0.04, 0.05, 0.05, glow(C.toxic, 1.5), 0.11, 0.14, -0.05, head);
      box(0.03, 0.03, 0.12, mat(C.black), 0.11, 0.04, 0, head);
      const armF = limb(body, 0.05, 0.72, 0.16), armB = limb(body, 0.05, 0.72, -0.16);
      [armF, armB].forEach((a) => { box(0.3, 0.08, 0.08, mat(C.zombieSkin), 0.15, 0, 0, a); });
      // Drips
      const drips = [0, 1, 2].map((i) => sphere(0.025, glow(C.toxic, 1), 0.12 + i * 0.06, 0.65, 0.16, body));
      body.rotation.z = -0.12;
      g.userData.parts = { body, head, legL, legR, armF, armB };
      g.userData.update = (t) => {
        const s = Math.sin(t * 5);
        legL.rotation.z = s * 0.4; legR.rotation.z = -s * 0.4;
        armF.rotation.z = 0.1 + Math.sin(t * 3) * 0.1; armB.rotation.z = 0.1 - Math.sin(t * 3) * 0.1;
        head.rotation.x = Math.sin(t * 2) * 0.2;
        drips.forEach((d, i) => { const p = (t * 0.8 + i * 0.33) % 1; d.position.y = 0.65 - p * 0.6; d.visible = p < 0.95; });
      };
      return g;
    }

    // ---------------- HAZARDS ----------------
    // size: 'small' | 'medium' | 'large'. Set g.userData.strength 0..1 as it gets extinguished.
    function fire(size) {
      const k = { small: 0.6, medium: 1, large: 1.5 }[size || 'medium'];
      const g = group('fire');
      const flames = [];
      const layers = [[0.28, 0.8, C.garnet, 0.6], [0.22, 0.65, C.orange, 1.2], [0.13, 0.45, C.yellow, 1.6]];
      layers.forEach(([r, h, c, e], li) => {
        for (let i = 0; i < 3; i++) {
          const f = cone(r * k, h * k, glow(c, e), (i - 1) * 0.12 * k, (h * k) / 2, (li - 1) * 0.04, g, 5);
          f.castShadow = false; f.userData.base = h * k; f.userData.phase = i * 2.1 + li;
          flames.push(f);
        }
      });
      const embers = [0, 1, 2, 3].map(() => { const e = box(0.04, 0.04, 0.04, glow(C.yellow, 2), 0, 0, 0, g); e.castShadow = false; return e; });
      const light = new THREE.PointLight(C.orange, 1.2 * k, 3 * k);
      light.position.y = 0.5 * k; g.add(light);
      g.userData.strength = 1;
      g.userData.update = (t) => {
        const st = g.userData.strength;
        g.visible = st > 0.02;
        flames.forEach((f) => {
          const s = (0.85 + Math.sin(t * 9 + f.userData.phase) * 0.15) * st;
          f.scale.set(st, Math.max(0.01, s), st);
          f.position.y = (f.userData.base * s) / 2;
        });
        embers.forEach((e, i) => {
          const p = (t * 0.7 + i * 0.25) % 1;
          e.position.set(Math.sin(t * 3 + i) * 0.2 * k, p * 1.2 * k * st, 0);
          e.scale.setScalar((1 - p) * st);
        });
        light.intensity = (1 + Math.sin(t * 13) * 0.2) * 1.2 * k * st;
      };
      return g;
    }

    // Toxic puddle. Set g.userData.strength 0..1; at 0 it shows as neutralized (gray).
    function toxic(size) {
      const k = { small: 0.6, medium: 1, large: 1.5 }[size || 'medium'];
      const g = group('toxic');
      const puddle = cyl(0.6 * k, 0.65 * k, 0.04, glow(C.toxic, 0.5).clone(), 0, 0.02, 0, g, 12);
      puddle.scale.z = 0.5; puddle.castShadow = false;
      const rim = cyl(0.66 * k, 0.7 * k, 0.02, mat(C.toxicDark), 0, 0.01, 0, g, 12);
      rim.scale.z = 0.5;
      const bubbles = [0, 1, 2, 3, 4].map((i) => {
        const b = sphere(0.06 * k, glow(C.toxic, 1).clone(), (i - 2) * 0.2 * k, 0.05, ((i % 2) - 0.5) * 0.15 * k, g);
        b.material.transparent = true; b.castShadow = false; return b;
      });
      const vapor = [0, 1, 2].map((i) => {
        const v = sphere(0.1 * k, mat(C.toxic, { transparent: true, opacity: 0.3, emissive: C.toxic, emissiveIntensity: 0.5, depthWrite: false }), 0, 0, 0, g);
        v.castShadow = false; return v;
      });
      const clean = new THREE.Color(C.gray), dirty = new THREE.Color(C.toxic);
      g.userData.strength = 1;
      g.userData.update = (t) => {
        const st = g.userData.strength;
        puddle.material.color.copy(clean).lerp(dirty, st);
        puddle.material.emissive.copy(clean).lerp(dirty, st);
        puddle.material.emissiveIntensity = 0.5 * st;
        bubbles.forEach((b, i) => {
          const p = (t * 1.2 + i * 0.37) % 1;
          b.position.y = 0.04 + p * 0.08;
          b.scale.setScalar((0.5 + p) * st);
          b.material.opacity = (1 - p) * st;
        });
        vapor.forEach((v, i) => {
          const p = (t * 0.4 + i / 3) % 1;
          v.position.set(Math.sin(t + i * 2) * 0.3 * k, 0.1 + p * 0.9 * k, 0);
          v.scale.setScalar((0.5 + p) * st + 0.001);
          v.material.opacity = 0.3 * (1 - p) * st;
        });
      };
      return g;
    }

    // ---------------- PICKUPS ----------------
    function extinguisherMesh(s) {
      s = s || 1;
      const g = new THREE.Group();
      cyl(0.12 * s, 0.12 * s, 0.5 * s, mat(C.garnet, { metalness: 0.4, roughness: 0.4 }), 0, 0.25 * s, 0, g, 12);
      sphere(0.12 * s, mat(C.garnet, { metalness: 0.4, roughness: 0.4 }), 0, 0.5 * s, 0, g, 12);
      cyl(0.125 * s, 0.125 * s, 0.14 * s, mat(C.orange), 0, 0.28 * s, 0, g, 12);   // label band
      box(0.06 * s, 0.08 * s, 0.06 * s, mat(C.gray, { metalness: 0.8 }), 0, 0.64 * s, 0, g);
      box(0.18 * s, 0.03 * s, 0.04 * s, mat(C.black), 0.05 * s, 0.69 * s, 0, g);     // handle
      const hose = cyl(0.02 * s, 0.02 * s, 0.3 * s, mat(C.black), 0.1 * s, 0.55 * s, 0, g, 6);
      hose.rotation.z = -0.9;
      cone(0.04 * s, 0.1 * s, mat(C.grayDark), 0.24 * s, 0.65 * s, 0, g, 6).rotation.z = -Math.PI / 2;
      return g;
    }
    function vialMesh(s) {
      s = s || 1;
      const g = new THREE.Group();
      cyl(0.08 * s, 0.08 * s, 0.4 * s, mat(C.glass, { transparent: true, opacity: 0.35, roughness: 0.1 }), 0, 0.22 * s, 0, g, 10);
      cyl(0.07 * s, 0.07 * s, 0.26 * s, glow(C.orangeLight, 0.9), 0, 0.15 * s, 0, g, 10);  // neutralizer liquid
      sphere(0.08 * s, mat(C.glass, { transparent: true, opacity: 0.35 }), 0, 0.02 * s, 0, g, 10);
      cyl(0.09 * s, 0.09 * s, 0.08 * s, mat(C.garnet), 0, 0.45 * s, 0, g, 10);            // cap
      return g;
    }
    function drinkMesh(s) {
      s = s || 1;
      const g = new THREE.Group();
      cyl(0.12 * s, 0.12 * s, 0.42 * s, mat(C.orange, { metalness: 0.5, roughness: 0.3 }), 0, 0.21 * s, 0, g, 14);
      cyl(0.125 * s, 0.125 * s, 0.1 * s, mat(C.garnet, { metalness: 0.3 }), 0, 0.24 * s, 0, g, 14);
      // lightning bolt decal
      const bolt = box(0.03 * s, 0.16 * s, 0.02 * s, glow(C.yellow, 1.2), 0.0, 0.24 * s, 0.125 * s, g);
      bolt.rotation.z = 0.5;
      cyl(0.1 * s, 0.12 * s, 0.03 * s, mat(C.gray, { metalness: 0.9, roughness: 0.2 }), 0, 0.435 * s, 0, g, 14);
      return g;
    }
    // Wrap a pickup with a glowing ring + bob/spin.
    function pickup(name, inner, ringColor) {
      const g = group(name);
      const spin = new THREE.Group(); g.add(spin); spin.add(inner);
      const ring = mesh(new THREE.TorusGeometry(0.35, 0.025, 6, 20), glow(ringColor, 1.2), 0, 0.02, 0, g);
      ring.rotation.x = Math.PI / 2; ring.castShadow = false;
      g.userData.update = (t) => {
        spin.rotation.y = t * 2;
        spin.position.y = 0.1 + Math.sin(t * 3) * 0.06;
        ring.scale.setScalar(1 + Math.sin(t * 4) * 0.08);
      };
      return g;
    }
    const extinguisher = () => pickup('extinguisher', extinguisherMesh(1), C.orange);
    const vial = () => pickup('vial', vialMesh(1.1), C.toxic);
    const drink = () => pickup('drink', drinkMesh(1.2), C.yellow);

    // Spray stream for extinguisher / vial. g.userData.active toggles it. Points along +X.
    function spray(kind) {
      const g = group('spray');
      const color = kind === 'vial' ? C.orangeLight : C.white;
      const puffs = [];
      for (let i = 0; i < 14; i++) {
        const p = sphere(0.06, mat(color, { transparent: true, opacity: 0.7, emissive: color, emissiveIntensity: 0.4, depthWrite: false }), 0, 0, 0, g);
        p.castShadow = false; p.userData.o = i / 14; puffs.push(p);
      }
      g.userData.active = true; g.userData.range = 1.8;
      g.userData.update = (t) => {
        g.visible = g.userData.active;
        puffs.forEach((p, i) => {
          const k = (t * 2.5 + p.userData.o) % 1;
          p.position.set(k * g.userData.range, Math.sin(i * 7.1 + t * 10) * 0.12 * k, Math.cos(i * 3.3) * 0.1 * k);
          p.scale.setScalar(0.6 + k * 2.2);
          p.material.opacity = 0.75 * (1 - k);
        });
      };
      return g;
    }

    // ---------------- ENVIRONMENT ----------------
    // Platform: garnet-brick block with an orange trim cap. w = width in units.
    function platform(w, h) {
      w = w || 3; h = h || 0.5;
      const g = group('platform');
      box(w, h, 1.2, mat(C.brick), 0, -h / 2, 0, g);
      box(w + 0.04, 0.08, 1.24, mat(C.orange), 0, -0.04, 0, g);
      for (let x = -w / 2 + 0.25; x < w / 2; x += 0.5) box(0.02, h - 0.1, 0.02, mat(C.garnetDark), x, -h / 2 - 0.04, 0.61, g);
      return g;
    }
    function ground(w) {
      const g = group('ground');
      box(w || 40, 0.5, 4, mat(0x4f7a3a), 0, -0.25, 0, g);              // grass
      box(w || 40, 0.06, 1.2, mat(C.gray), 0, 0.02, 0.6, g);            // campus path
      return g;
    }

    // Sutton Science Center (stylized): brick facade, window grid, sign. On-fire flag adds smoke glow.
    function sutton(onFire) {
      const g = group('sutton');
      const W = 8, H = 4;
      box(W, H, 3, mat(C.brick), 0, H / 2, 0, g);
      box(W + 0.2, 0.2, 3.2, mat(C.gray), 0, H + 0.1, 0, g);            // roof trim
      const win = onFire ? glow(C.orange, 1) : mat(C.glass, { roughness: 0.2, metalness: 0.3 });
      for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) {
        if (r === 0 && c === 3) continue;
        box(0.6, 0.7, 0.05, win, -3 + c, 0.8 + r * 1.15, 1.51, g);
        box(0.66, 0.06, 0.08, mat(C.white), -3 + c, 0.43 + r * 1.15, 1.52, g);
      }
      box(1.2, 1.4, 0.1, mat(C.grayDark), 0, 0.7, 1.52, g);              // entrance
      cyl(0.08, 0.08, 1.6, mat(C.white), -0.75, 0.8, 1.7, g);            // columns
      cyl(0.08, 0.08, 1.6, mat(C.white), 0.75, 0.8, 1.7, g);
      box(2.6, 0.4, 0.1, mat(C.garnet), 0, 3.75, 1.53, g);               // sign plate
      g.userData.signAnchor = new THREE.Vector3(0, 3.75, 1.6);            // put SUTTON text sprite here
      return g;
    }
    // Anderson Hall tower (stylized landmark silhouette).
    function andersonTower() {
      const g = group('andersonTower');
      box(4, 2.5, 2.5, mat(C.brick), 0, 1.25, 0, g);
      box(1.4, 3.2, 1.4, mat(C.brick), 0, 4.1, 0, g);
      box(1.6, 0.15, 1.6, mat(C.white), 0, 5.75, 0, g);
      box(1.1, 0.9, 1.1, mat(C.white), 0, 6.3, 0, g);                    // belfry
      cyl(0.3, 0.3, 0.05, mat(C.white), 0, 4.8, 0.71, g, 16).rotation.x = Math.PI / 2; // clock
      cyl(0.25, 0.25, 0.06, mat(C.black), 0, 4.8, 0.72, g, 16).rotation.x = Math.PI / 2;
      cone(0.8, 1.6, mat(C.grayDark), 0, 7.55, 0, g, 4).rotation.y = Math.PI / 4; // spire
      for (let i = 0; i < 4; i++) box(0.5, 0.7, 0.05, mat(C.glass), -1.4 + i * 0.93, 1.3, 1.26, g);
      return g;
    }
    // Covenant Stone (stylized): rough boulder on a small base.
    function covenantStone() {
      const g = group('covenantStone');
      const s = mesh(new THREE.DodecahedronGeometry(0.6, 0), mat(0x9a948a), 0, 0.55, 0, g);
      s.scale.set(1.2, 0.9, 0.7);
      box(1.6, 0.12, 1, mat(C.gray), 0, 0.06, 0, g);
      box(0.5, 0.25, 0.04, mat(C.garnet), 0, 0.5, 0.42, g);              // plaque
      return g;
    }
    // Makerspace 3D printer and chem lab bench (indoor props).
    function printer3d() {
      const g = group('printer3d');
      box(0.8, 0.06, 0.6, mat(C.grayDark), 0, 0.03, 0, g);
      [[-0.37, -0.27], [0.37, -0.27], [-0.37, 0.27], [0.37, 0.27]].forEach(([x, z]) => box(0.05, 0.8, 0.05, mat(C.gray), x, 0.43, z, g));
      box(0.8, 0.06, 0.6, mat(C.grayDark), 0, 0.83, 0, g);
      const headP = box(0.14, 0.12, 0.12, mat(C.orange), 0, 0.7, 0, g);
      cyl(0.12, 0.12, 0.08, mat(C.garnet), 0, 0.1, 0, g, 12);           // print in progress
      cyl(0.12, 0.12, 0.06, mat(C.orange), 0.3, 0.98, 0, g, 12).rotation.x = Math.PI / 2; // filament spool
      g.userData.update = (t) => { headP.position.x = Math.sin(t * 3) * 0.25; headP.position.z = Math.cos(t * 2.3) * 0.15; };
      return g;
    }
    function labBench() {
      const g = group('labBench');
      box(2, 0.85, 0.8, mat(C.white), 0, 0.425, 0, g);
      box(2.05, 0.06, 0.85, mat(C.black), 0, 0.88, 0, g);
      for (let i = 0; i < 3; i++) box(0.55, 0.6, 0.02, mat(C.gray), -0.65 + i * 0.65, 0.42, 0.41, g);
      const fl = vialMesh(0.8); fl.position.set(-0.6, 0.91, 0); g.add(fl);
      const fl2 = vialMesh(0.6); fl2.position.set(-0.4, 0.91, 0.15); g.add(fl2);
      cyl(0.1, 0.15, 0.25, mat(C.glass, { transparent: true, opacity: 0.4 }), 0.5, 1.03, 0, g, 10); // beaker
      cyl(0.09, 0.14, 0.15, glow(C.toxic, 0.8), 0.5, 0.99, 0, g, 10);
      return g;
    }
    // Rival arena banner (original purple/white/gold design, no real logos).
    function rivalBanner() {
      const g = group('rivalBanner');
      cyl(0.04, 0.04, 2.4, mat(C.gold, { metalness: 0.7 }), 0, 1.2, 0, g, 6);
      const cloth = box(0.9, 1.2, 0.03, mat(C.purple), 0.47, 1.75, 0, g);
      box(0.9, 0.12, 0.04, mat(C.white), 0.47, 1.3, 0, g);
      const emblem = mesh(new THREE.OctahedronGeometry(0.18, 0), mat(C.gold, { metalness: 0.6 }), 0.47, 1.85, 0.05, g);
      g.userData.update = (t) => { cloth.rotation.y = Math.sin(t * 2) * 0.12; emblem.rotation.y = t; };
      return g;
    }

    // Shared scene lighting tuned for the palette.
    function lights(scene) {
      scene.add(new THREE.HemisphereLight(0xfff1e0, 0x3d0618, 0.9));
      const sun = new THREE.DirectionalLight(0xffffff, 1.4);
      sun.position.set(5, 10, 7); sun.castShadow = true;
      sun.shadow.mapSize.set(1024, 1024);
      Object.assign(sun.shadow.camera, { left: -15, right: 15, top: 10, bottom: -5 });
      scene.add(sun);
      return sun;
    }

    return {
      colors: C, mat, lights,
      hero, tiger, zombie,
      fire, toxic, spray,
      extinguisher, vial, drink, extinguisherMesh, vialMesh, drinkMesh,
      platform, ground, sutton, andersonTower, covenantStone, printer3d, labBench, rivalBanner,
    };
  }
  root.MascotModels = MascotModels;
  if (typeof module !== 'undefined' && module.exports) module.exports = MascotModels;
})(typeof window !== 'undefined' ? window : globalThis);
