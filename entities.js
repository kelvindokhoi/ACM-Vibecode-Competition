// entities.js - Scots on Fire entities (classic script, globals)

function makeSprite(name, w, h, fallbackColor) {
  // Prefer procedural 3D models from assests/models.js when available.
  try {
    if (typeof MascotModels === 'function' && name !== 'spray') {
      if (!window.__mascotModels) window.__mascotModels = MascotModels(THREE);
      var M = window.__mascotModels;
      var builder = M && M[name];
      if (typeof builder === 'function') {
        var model = builder();
        var wrap = new THREE.Group();
        var bb = new THREE.Box3().setFromObject(model);
        var sz = new THREE.Vector3(); bb.getSize(sz);
        var sc = sz.y > 0 ? h / sz.y : 1;
        model.scale.setScalar(sc);
        bb = new THREE.Box3().setFromObject(model);
        var c = new THREE.Vector3(); bb.getCenter(c);
        model.position.set(-c.x, -c.y, -c.z);
        wrap.add(model);
        wrap.userData.baseColor = fallbackColor;
        wrap.userData.model = model;
        // Fake material so flash/opacity code keeps working on a Group.
        wrap.material = { color: { set: function () {} }, opacity: 1, transparent: true, needsUpdate: false };
        return wrap;
      }
    }
  } catch (e) { console.warn('model build failed for ' + name, e); }
  const geo = new THREE.PlaneGeometry(w, h);
  const mat = new THREE.MeshBasicMaterial({
    color: fallbackColor,
    transparent: true,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.userData.baseColor = fallbackColor;
  try {
    new THREE.TextureLoader().load(
      'assests/' + name + '.png',
      (tex) => {
        tex.magFilter = THREE.NearestFilter;
        tex.minFilter = THREE.NearestFilter;
        mat.map = tex;
        mat.color.set(0xffffff);
        mesh.userData.baseColor = 0xffffff;
        mat.needsUpdate = true;
      },
      undefined,
      () => { /* keep fallback color */ }
    );
  } catch (e) { /* ignore */ }
  return mesh;
}

function makeLabel(text, color) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const fontSize = 48;
  ctx.font = 'bold ' + fontSize + 'px sans-serif';
  const tw = Math.ceil(ctx.measureText(text).width) + 32;
  canvas.width = tw;
  canvas.height = fontSize + 24;
  ctx.font = 'bold ' + fontSize + 'px sans-serif';
  ctx.fillStyle = 'rgba(0,0,0,0.55)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = color || '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);
  const tex = new THREE.CanvasTexture(canvas);
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true });
  const sprite = new THREE.Sprite(mat);
  const scale = 0.02;
  sprite.scale.set(canvas.width * scale, canvas.height * scale, 1);
  return sprite;
}

function _toast(text, ms) {
  if (typeof UI !== 'undefined' && UI && UI.toast) UI.toast(text, ms);
}

function _playerHit(self, game, amount) {
  if (!game || !game.player || !game.player.box) return;
  if (self.box().intersectsBox(game.player.box())) game.player.damage(amount);
}

class Entity {
  constructor(scene, x, y, name, w, h, color) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.alive = true;
    this.facing = 1;
    this.mesh = makeSprite(name, w, h, color);
    this.mesh.position.set(x, y + h / 2, 0);
    if (scene) scene.add(this.mesh);
  }
  box() {
    return new THREE.Box2(
      new THREE.Vector2(this.x - this.w / 2, this.y),
      new THREE.Vector2(this.x + this.w / 2, this.y + this.h)
    );
  }
  syncMesh() {
    this.mesh.position.set(this.x, this.y + this.h / 2, 0);
    this.mesh.scale.x = this.facing;
  }
  update(dt, game) {}
  destroy() {
    if (this.mesh && this.mesh.parent) this.mesh.parent.remove(this.mesh);
    else if (this.scene && this.mesh) this.scene.remove(this.mesh);
  }
}

class Player extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, 'hero', 1.0, 1.6, 0xFF6600);
    this.hp = 100;
    this.maxHp = 100;
    this.ammo = { extinguisher: 3, vial: 0 };
    this.speedBoostUntil = 0;
    this.vx = 0;
    this.vy = 0;
    this.onGround = false;
    this.facing = 1;
    this.invulnUntil = 0;
    this.lastSpray = 0;
    this.flashUntil = 0;
  }
  moveInput(dir) {
    let speed = 7;
    if (Date.now() < this.speedBoostUntil) speed *= 1.7;
    this.vx = dir * speed;
    if (dir > 0) this.facing = 1;
    else if (dir < 0) this.facing = -1;
  }
  jump() {
    if (this.onGround) {
      this.vy = 11;
      this.onGround = false;
    }
  }
  update(dt, game) {
    dt = Math.min(dt, 0.05);
    this.vy -= 28 * dt;
    const solids = (game && game.solids) || [];
    const hw = this.w / 2;

    // X axis
    this.x += this.vx * dt;
    for (const s of solids) {
      if (!s) continue;
      if (this.x + hw > s.min.x && this.x - hw < s.max.x &&
          this.y + this.h > s.min.y && this.y < s.max.y) {
        const penL = this.x + hw - s.min.x;
        const penR = s.max.x - (this.x - hw);
        if (penL < penR) this.x = s.min.x - hw;
        else this.x = s.max.x + hw;
      }
    }

    // Y axis
    const prevY = this.y;
    this.y += this.vy * dt;
    this.onGround = false;
    for (const s of solids) {
      if (!s) continue;
      if (this.x + hw > s.min.x && this.x - hw < s.max.x &&
          this.y + this.h > s.min.y && this.y < s.max.y) {
        if (this.vy <= 0 && prevY >= s.max.y - 0.05) {
          this.y = s.max.y;
          this.vy = 0;
          this.onGround = true;
        } else if (this.vy > 0) {
          this.y = s.min.y - this.h;
          this.vy = 0;
        } else {
          // fallback: push up
          this.y = s.max.y;
          this.vy = 0;
          this.onGround = true;
        }
      }
    }

    const len = (game && game.level && game.level.length) || 1000;
    this.x = Math.max(0.5, Math.min(len - 0.5, this.x));

    if (this.y < -5) this.damage(100);

    // flash handling
    const now = Date.now();
    const mat = this.mesh.material;
    if (now < this.flashUntil) {
      mat.color.set(0xff3333);
    } else {
      mat.color.set(this.mesh.userData.baseColor);
    }
    mat.opacity = now < this.invulnUntil ? (Math.floor(now / 80) % 2 ? 0.5 : 1) : 1;

    this.syncMesh();
  }
  damage(amount) {
    const now = Date.now();
    if (now < this.invulnUntil) return;
    this.hp -= amount;
    if (this.hp < 0) this.hp = 0;
    this.invulnUntil = now + 800;
    this.flashUntil = now + 150;
  }
  _fire(game, kind) {
    if (!game || !game.scene) return false;
    const now = Date.now();
    if (now - this.lastSpray < 250) return false;
    if (this.ammo[kind] <= 0) return false;
    this.ammo[kind]--;
    this.lastSpray = now;
    const s = new Spray(game.scene, this.x + this.facing * 0.8, this.y + 0.8, this.facing, kind);
    if (game.entities) game.entities.push(s);
    return true;
  }
  sprayExtinguisher(game) { return this._fire(game, 'extinguisher'); }
  throwVial(game) { return this._fire(game, 'vial'); }
}

class Fire extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, 'fire', 1.2, 1.4, 0xff4400);
    this.t = Math.random() * 10;
  }
  update(dt, game) {
    if (!this.alive) return;
    this.t += dt;
    const sy = 1 + Math.sin(this.t * 9) * 0.08 + Math.sin(this.t * 23) * 0.04;
    this.mesh.scale.y = sy;
    this.mesh.position.y = this.y + (this.h * sy) / 2;
    _playerHit(this, game, 10);
  }
  extinguish() {
    if (!this.alive) return;
    this.alive = false;
    _toast('Fire out!', 600);
  }
}

class Toxic extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, 'toxic', 1.6, 0.6, 0x39ff14);
    this.t = Math.random() * 10;
  }
  update(dt, game) {
    if (!this.alive) return;
    this.t += dt;
    this.mesh.scale.x = 1 + Math.sin(this.t * 3) * 0.04;
    _playerHit(this, game, 8);
  }
  neutralize() {
    this.alive = false;
  }
}

class Zombie extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, 'zombie', 1.0, 1.6, 0x557755);
    this.spawnX = x;
    this.facing = 1;
    this.t = 0;
  }
  update(dt, game) {
    if (!this.alive) return;
    this.t += dt;
    this.x += this.facing * 2 * dt;
    if (this.x > this.spawnX + 3) { this.x = this.spawnX + 3; this.facing = -1; }
    if (this.x < this.spawnX - 3) { this.x = this.spawnX - 3; this.facing = 1; }
    this.syncMesh();
    this.mesh.rotation.z = Math.sin(this.t * 6) * 0.06;
    _playerHit(this, game, 15);
  }
  kill() {
    this.alive = false;
  }
}

const PICKUP_COLORS = { extinguisher: 0xdd0000, vial: 0x44aaff, drink: 0xffff00 };

class Pickup extends Entity {
  constructor(scene, x, y, type) {
    type = type || 'extinguisher';
    super(scene, x, y, type, 0.8, 0.8, PICKUP_COLORS[type] || 0xffffff);
    this.type = type;
    this.t = Math.random() * 10;
  }
  update(dt, game) {
    if (!this.alive) return;
    this.t += dt;
    this.mesh.position.y = this.y + this.h / 2 + 0.2 + Math.sin(this.t * 3) * 0.15;
    if (game && game.player && game.player.box && this.box().intersectsBox(game.player.box())) {
      this.collect(game);
    }
  }
  collect(game) {
    if (!this.alive) return;
    const p = game && game.player;
    if (p) {
      if (this.type === 'extinguisher') {
        p.ammo.extinguisher += 3;
        _toast('+3 \u{1F9EF}', 900);
      } else if (this.type === 'vial') {
        p.ammo.vial += 3;
        _toast('+3 \u{1F9EA}', 900);
      } else if (this.type === 'drink') {
        p.speedBoostUntil = Date.now() + 6000;
        _toast('Speed boost!', 900);
      }
    }
    this.alive = false;
  }
}

class Boss extends Entity {
  constructor(scene, x, y) {
    super(scene, x, y, 'tiger', 2.6, 2.0, 0x5a2d82);
    this.hp = 10;
    this.maxHp = 10;
    this.vx = 0;
    this.vy = 0;
    this.onGround = true;
    this.pounceTimer = 2.5;
    this.flashUntil = 0;
    this.facing = -1;
  }
  update(dt, game) {
    if (!this.alive) return;
    dt = Math.min(dt, 0.05);
    const p = game && game.player;
    const dir = p ? (p.x > this.x ? 1 : -1) : this.facing;

    if (this.onGround) {
      this.vx = dir * 3;
      this.facing = dir;
      this.pounceTimer -= dt;
      if (this.pounceTimer <= 0 && p) {
        this.pounceTimer = 2.5;
        this.vy = 9;
        this.vx = dir * 6;
        this.onGround = false;
      }
    }
    this.vy -= 28 * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    if (this.y <= 0) {
      this.y = 0;
      this.vy = 0;
      this.onGround = true;
    }
    const len = (game && game.level && game.level.length) || 1000;
    this.x = Math.max(this.w / 2, Math.min(len - this.w / 2, this.x));

    const mat = this.mesh.material;
    if (Date.now() < this.flashUntil) mat.color.set(0xffffff), mat.opacity = 0.6;
    else mat.color.set(this.mesh.userData.baseColor), mat.opacity = 1;

    this.syncMesh();
    _playerHit(this, game, 20);
  }
  hit(amount, game) {
    if (!this.alive) return;
    this.hp -= amount;
    this.flashUntil = Date.now() + 150;
    let px = null;
    if (game && game.player) px = game.player.x;
    else if (typeof window !== 'undefined' && window.game && window.game.player) px = window.game.player.x;
    const away = px === null ? -this.facing : (this.x >= px ? 1 : -1);
    this.x += away * 1;
    this.syncMesh();
    if (this.hp <= 0) {
      this.hp = 0;
      this.alive = false;
    }
  }
}

class Spray extends Entity {
  constructor(scene, x, y, dir, kind) {
    kind = kind || 'extinguisher';
    const isExt = kind === 'extinguisher';
    const w = isExt ? 1.4 : 0.5;
    const h = isExt ? 0.8 : 0.5;
    // y passed is center height; convert to feet
    super(scene, x, y - h / 2, isExt ? 'spray' : 'vial', w, h, isExt ? 0xeeeeee : 0x44aaff);
    this.kind = kind;
    this.dir = dir || 1;
    this.facing = this.dir;
    this.life = isExt ? 0.35 : 1.2;
    this.vx = isExt ? this.dir * 12 : this.dir * 9;
    this.vy = isExt ? 0 : 5;
    this.hitSet = new Set();
    if (isExt) this.mesh.material.opacity = 0.8;
    this.syncMesh();
  }
  update(dt, game) {
    if (!this.alive) return;
    dt = Math.min(dt, 0.05);
    this.life -= dt;
    if (this.life <= 0) { this.alive = false; return; }
    if (this.kind === 'vial') this.vy -= 20 * dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    if (this.kind === 'vial') {
      this.mesh.rotation.z += dt * 10 * -this.dir;
      if (this.y < -1) { this.alive = false; return; }
    } else {
      const k = this.life / 0.35;
      this.mesh.material.opacity = 0.3 + 0.5 * k;
    }
    this.mesh.position.set(this.x, this.y + this.h / 2, 0);
    this.mesh.scale.x = this.facing;

    const ents = (game && game.entities) || [];
    const b = this.box();
    for (const e of ents) {
      if (!e || e === this || !e.alive || !e.box) continue;
      if (this.kind === 'extinguisher') {
        if (e instanceof Fire) {
          if (b.intersectsBox(e.box())) e.extinguish();
        } else if (e instanceof Boss) {
          if (!this.hitSet.has(e) && b.intersectsBox(e.box())) {
            this.hitSet.add(e);
            e.hit(1, game);
          }
        }
      } else {
        if (e instanceof Toxic) {
          if (b.intersectsBox(e.box())) { e.neutralize(); this.alive = false; return; }
        } else if (e instanceof Zombie) {
          if (b.intersectsBox(e.box())) { e.kill(); this.alive = false; return; }
        }
      }
    }
  }
}
