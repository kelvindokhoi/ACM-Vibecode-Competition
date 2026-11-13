# Plan (written 15:17, deadline 15:40)

Target: 3D-rendered side-scroller in a single `index.html` (Three.js from CDN, no build step). 2D gameplay on one plane. One engine, four short data-driven levels. All visuals are 2D PNGs used as sprites/textures; every asset has a colored-shape fallback so a missing file never blocks the game.

## Roles
- Claude: writes all code in `index.html`. Nobody hand-edits code.
- User: deploy (GitHub Pages on this repo), playtest, submit URL. Any extra code goes through an AI session, never by hand.
- Asset A: hero, tiger boss, zombie. Transparent PNGs, side view, facing right.
- Asset B: fire, toxic puddle, extinguisher, vial, energy-drink can, four backdrops.

## Asset filenames (drop into `assests/`, exact names)
hero.png tiger.png zombie.png fire.png toxic.png extinguisher.png vial.png drink.png
bg1.png bg2.png bg3.png bg4.png (1024x512 wide backdrops)

## Cutoffs
- 15:25 placeholder page live at public URL
- 15:28 assets in
- 15:33 code freeze, last push
- 15:36 URL checked in a private window
- 15:40 submit
