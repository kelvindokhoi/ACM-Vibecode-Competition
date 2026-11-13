// ui.js - DOM HUD + screen overlays for Scots on Fire. Exposes window.UI.
(function () {
  'use strict';

  function $(id) { return document.getElementById(id); }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function num(v, d) { v = Number(v); return isFinite(v) ? v : d; }

  var screenCb = null;
  var screenOpen = false;
  var screenShownAt = 0;
  var toastTimer = null;

  function triggerButton() {
    if (!screenOpen) return;
    var cb = screenCb;
    UI.hideScreen();
    if (typeof cb === 'function') {
      try { cb(); } catch (e) { console.error('UI screen onClick error:', e); }
    }
  }

  var UI = {
    setHP: function (current, max) {
      max = num(max, 100) || 1;
      current = clamp(num(current, 0), 0, max);
      var pct = (current / max) * 100;
      var fill = $('hp-fill');
      if (fill) {
        fill.style.width = pct + '%';
        if (pct < 30) fill.classList.add('low'); else fill.classList.remove('low');
      }
      var t = $('hp-text');
      if (t) t.textContent = Math.ceil(current) + ' / ' + Math.round(max);
    },

    setTimer: function (secondsLeft) {
      var el = $('hud-timer');
      if (!el) return;
      var s = Math.max(0, Math.ceil(num(secondsLeft, 0)));
      var m = Math.floor(s / 60);
      var r = s % 60;
      el.textContent = m + ':' + (r < 10 ? '0' : '') + r;
      if (s < 10) el.classList.add('warn'); else el.classList.remove('warn');
    },

    setObjective: function (text) {
      var el = $('hud-objective');
      if (el) el.textContent = text == null ? '' : String(text);
    },

    setAmmo: function (extinguisher, vial) {
      var a = $('ammo-ext'), b = $('ammo-vial');
      if (a) a.textContent = Math.max(0, Math.floor(num(extinguisher, 0)));
      if (b) b.textContent = Math.max(0, Math.floor(num(vial, 0)));
    },

    setLevel: function (levelIndexZeroBased, levelName) {
      var el = $('hud-level');
      if (!el) return;
      var n = Math.floor(num(levelIndexZeroBased, 0)) + 1;
      el.textContent = 'Level ' + n + (levelName ? ': ' + levelName : '');
    },

    setBoost: function (active) {
      var el = $('hud-boost');
      if (!el) return;
      if (active) el.classList.add('on'); else el.classList.remove('on');
    },

    setBossHP: function (current, max) {
      var wrap = $('boss-wrap');
      if (!wrap) return;
      if (current == null) { wrap.classList.remove('on'); return; }
      max = num(max, 100) || 1;
      current = clamp(num(current, 0), 0, max);
      wrap.classList.add('on');
      var fill = $('boss-fill');
      if (fill) fill.style.width = (current / max) * 100 + '%';
      var t = $('boss-text');
      if (t) t.textContent = Math.ceil(current) + ' / ' + Math.round(max);
    },

    showScreen: function (opts) {
      opts = opts || {};
      var scr = $('screen');
      if (!scr) return;
      var title = $('screen-title'), body = $('screen-body'), btn = $('screen-btn');
      if (title) title.textContent = opts.title || '';
      if (body) body.innerHTML = opts.body || '';
      if (btn) {
        btn.textContent = opts.button || 'Continue';
        btn.onclick = function (e) { if (e) e.preventDefault(); triggerButton(); };
      }
      screenCb = opts.onClick || null;
      screenOpen = true;
      screenShownAt = Date.now();
      scr.classList.add('on');
      if (btn) { try { btn.focus({ preventScroll: true }); } catch (e) { /* ignore */ } }
    },

    hideScreen: function () {
      var scr = $('screen');
      if (scr) scr.classList.remove('on');
      screenOpen = false;
      screenCb = null;
      var btn = $('screen-btn');
      if (btn) { btn.onclick = null; try { btn.blur(); } catch (e) { /* ignore */ } }
    },

    isScreenOpen: function () { return screenOpen; },

    toast: function (text, ms) {
      var el = $('toast');
      if (!el) return;
      ms = num(ms, 1500);
      el.textContent = text == null ? '' : String(text);
      el.classList.add('on');
      if (toastTimer) clearTimeout(toastTimer);
      toastTimer = setTimeout(function () { el.classList.remove('on'); toastTimer = null; }, ms);
    },

    showControls: function () {
      var el = $('hud-controls');
      if (!el) return;
      el.textContent = '←→/AD move · Space/W jump · J spray extinguisher · K throw vial · R restart';
      el.classList.add('on');
    }
  };

  // Enter/Space triggers the screen button. Capture phase so the game doesn't also see it.
  window.addEventListener('keydown', function (e) {
    if (!screenOpen) return;
    var k = e.key, c = e.code;
    var isGo = k === 'Enter' || k === ' ' || k === 'Spacebar' || c === 'Space' || c === 'Enter' || c === 'NumpadEnter';
    if (!isGo) return;
    e.preventDefault();
    e.stopPropagation();
    if (e.stopImmediatePropagation) e.stopImmediatePropagation();
    if (e.repeat || Date.now() - screenShownAt < 250) return;
    triggerButton();
  }, true);

  window.UI = UI;
})();
