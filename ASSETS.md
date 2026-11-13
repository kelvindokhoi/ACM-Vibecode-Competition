# Game Asset Plan

This document defines the visual, interface, animation, audio, and reference
assets needed for the four-level Maryville College campus game described in
`preplanning.txt`.

## Art Direction

- **Perspective:** three-quarter top-down 2D
- **Recommended style:** stylized pixel art or crisp low-resolution 2D art
- **Internal game resolution:** 480x270 or 640x360
- **Tile size:** 32x32 pixels
- **Character footprint:** approximately 32x48 or 48x48 pixels
- **Scaling:** integer scaling with nearest-neighbor texture filtering
- **Maryville colors:** garnet `#640A28`, orange `#FF6600`, with gray and
  yellow accents
- **Rival colors:** purple and white, with limited gold accents
- **Readability rule:** hazards, pickups, objectives, and attack telegraphs
  must remain recognizable at the actual gameplay resolution

All gameplay assets should share one camera angle, light direction, outline
weight, palette, and pixel density.

## Reference Pack

Collect or photograph references before producing final environment art.
Official photographs may be used as visual reference, but should not be copied
directly into the game unless the team has permission.

### Required Maryville References

- [ ] Sutton Science Center front, rear, and side exteriors
- [ ] Sutton entrance, windows, wall materials, and building signage
- [ ] Anderson Hall Tower silhouette and architectural details
- [ ] Covenant Stone and surrounding paths
- [ ] Campus paths, curbs, lamps, benches, trees, and signs
- [ ] Sutton makerspace layout
- [ ] Makerspace 3D printers, filament, workbenches, shelves, and tools
- [ ] Sutton chemistry-lab layout
- [ ] Chemistry benches, fume hoods, sinks, cabinets, glassware, and instruments

### Rival References

- [ ] Tiger anatomy and movement reference
- [ ] Purple, white, and gold rival color reference
- [ ] Arena or athletic-field reference

Do not reproduce either school's official logo or mascot artwork without
permission. The boss should be an original stylized purple tiger.

## Asset Naming

Use lowercase `snake_case` names with a category prefix:

```text
chr_player_run_down_01.png
chr_tiger_pounce_left_03.png
env_sutton_wall_brick_a.png
prop_lab_fume_hood.png
haz_fire_medium_02.png
fx_spray_impact_01.png
ui_icon_extinguisher.png
sfx_pickup_energy.ogg
mus_level_01_campus.ogg
```

Recommended top-level asset directories:

```text
assets/
  characters/
  environments/
  props/
  hazards/
  pickups/
  effects/
  ui/
  audio/
    music/
    sfx/
  references/
```

## Player Assets

Create one base player and add equipment/state overlays instead of duplicating
every animation for every power-up.

### Base Player Sprite Sheet

- [ ] Idle in four directions, 2-4 frames per direction
- [ ] Run in four directions, 6 frames per direction
- [ ] Hurt in four directions, 1-2 frames per direction
- [ ] Knockback animation
- [ ] Defeat/faint animation, 4-6 frames
- [ ] Victory animation, 4-6 frames

### Tool Animations

- [ ] Fire-extinguisher spray in four directions, 3-4 frames per direction
- [ ] Chemical-vial use in four directions, 3-4 frames per direction
- [ ] Pickup/reload animation

### Visible Player States

- [ ] Extinguisher backpack or held-extinguisher overlay
- [ ] Vial/tool overlay
- [ ] Low-health flash or damage tint
- [ ] Speed-boost aura, trail, or afterimage
- [ ] Brief invulnerability flash

The speed power-up must visibly change both the player's motion and appearance.

## Enemy and Boss Assets

### Toxic Zombies

Build one base animation set and create variants through heads, clothing,
damage, and palette swaps.

- [ ] Zombie variant A
- [ ] Zombie variant B
- [ ] Idle animation
- [ ] Walk in four directions, 4-6 frames per direction
- [ ] Attack in four directions, 3-4 frames per direction
- [ ] Hurt animation
- [ ] Defeat animation
- [ ] Toxic glow or drip overlay
- [ ] Spawn/emergence effect

### Tiger Boss

- [ ] Idle/roar animation
- [ ] Walk or stalk in four directions
- [ ] Charge/run in four directions
- [ ] Pounce animation
- [ ] Swipe animation
- [ ] Hurt animation
- [ ] Stunned or soaked state
- [ ] Defeat animation
- [ ] Shadow sprite
- [ ] Phase-change visual effect
- [ ] Attack telegraph markers
- [ ] Boss projectile or hazard, if used

The tiger should use an original silhouette and markings rather than an
official Sewanee mascot illustration.

## Environment Assets

## Shared Campus Tileset

- [ ] Grass tiles with 3-5 subtle variants
- [ ] Dirt and scorched-grass variants
- [ ] Concrete and brick paths
- [ ] Curbs and path corners
- [ ] Road or parking-lot tiles, if needed
- [ ] Exterior brick walls
- [ ] Interior wall tops and corners
- [ ] Floors for hallways, labs, and makerspace
- [ ] Doors in open and closed states
- [ ] Windows in normal, glowing, cracked, and smoky states
- [ ] Stairs and ramps
- [ ] Collision-only boundary tiles
- [ ] Campus trees and shrubs
- [ ] Benches, trash cans, lamps, planters, and signs
- [ ] Emergency-exit and directional signage
- [ ] Smoke-darkened and damaged overlays

## Recognizable Campus Landmarks

At least two recognizable campus details should be visible during gameplay.
The strongest combination is Sutton Science Center plus Anderson Hall Tower or
the Covenant Stone.

### Sutton Science Center

- [ ] Simplified but recognizable exterior facade
- [ ] Main entrance
- [ ] Building-name sign
- [ ] Distinctive window and wall pattern
- [ ] Normal exterior state
- [ ] Burning/smoke-damaged exterior overlays

### Anderson Hall / Covenant Stone

- [ ] Anderson Hall Tower background or map-edge landmark
- [ ] Tower silhouette for title or level-introduction art
- [ ] Covenant Stone prop
- [ ] Surrounding path and landscaping details

## Makerspace Prop Atlas

- [ ] 3D printer in idle and active states
- [ ] Printer filament rolls
- [ ] Workbench
- [ ] Tool wall
- [ ] Shelving and storage bins
- [ ] Computer workstation
- [ ] Safety goggles and gloves
- [ ] Small prototype objects
- [ ] Fire extinguisher wall bracket
- [ ] Burnt/damaged prop variants

## Chemistry-Lab Prop Atlas

- [ ] Lab bench segments and corners
- [ ] Sinks and faucets
- [ ] Fume hood
- [ ] Cabinets and drawers
- [ ] Stools
- [ ] Glassware set: beakers, flasks, tubes, and bottles
- [ ] Instrument silhouettes
- [ ] Chemical storage shelf
- [ ] Safety shower and eyewash station
- [ ] Hazard placards
- [ ] Spill-response equipment
- [ ] Normal, burning, contaminated, and neutralized prop states

## Gauntlet Damage Overlays

These should layer over existing tiles so the third level can reuse previous
environments while looking more dangerous.

- [ ] Scorch marks
- [ ] Toxic residue
- [ ] Cracks and broken tiles
- [ ] Smoke stains
- [ ] Warning tape
- [ ] Barricades
- [ ] Broken equipment
- [ ] Flickering-light overlay
- [ ] Zombie emergence points

## Rival Boss Arena

- [ ] Arena floor or athletic-field tiles
- [ ] Boundary walls, fencing, or bleachers
- [ ] Purple-and-white banners using original symbols
- [ ] Gold accent props
- [ ] Damaged and burning arena overlays
- [ ] Toxic puddle placement tiles
- [ ] Boss entrance area
- [ ] Victory/exit area
- [ ] Crowd or background silhouettes, if performance permits

## Hazards

### Fire

- [ ] Small fire loop, 4-6 frames
- [ ] Medium fire loop, 4-6 frames
- [ ] Large fire loop, 6-8 frames
- [ ] Fire growth transition
- [ ] Smoke puff and smoke column
- [ ] Ember particles
- [ ] Extinguishing steam cloud
- [ ] Wet/charred extinguished state
- [ ] Fire collision or warning decal

Use animated sprites for the flame core and code-driven particles for smoke and
embers.

### Toxic Waste

- [ ] Small, medium, and large puddle shapes
- [ ] Edge and corner tiles for larger spills
- [ ] Bubbling loop
- [ ] Toxic barrel in sealed, leaking, and broken states
- [ ] Dripping pipe or container
- [ ] Toxic splash effect
- [ ] Toxic vapor particles
- [ ] Neutralization effect
- [ ] Clean/neutralized puddle state
- [ ] Toxic damage indicator

## Pickups and Power-Ups

Each pickup needs a world sprite, HUD icon, pickup animation, and active-state
visual.

### Fire Extinguisher

- [ ] World pickup
- [ ] Refill canister
- [ ] HUD icon
- [ ] Ammo/refill meter
- [ ] Pickup glow
- [ ] Spray nozzle or equipment overlay

### Chemical Vials

- [ ] World pickup
- [ ] Refill crate or vial bundle
- [ ] HUD icon
- [ ] Charge meter
- [ ] Pickup glow
- [ ] Active-tool overlay

### Speed Boost

- [ ] Generic energy-drink can
- [ ] HUD icon
- [ ] Pickup glow
- [ ] Active timer ring or bar
- [ ] Speed trail/afterimage
- [ ] Player aura or palette accent

Use a fictional energy-drink name and original can design rather than the Red
Bull trademark or trade dress.

## Effects

- [ ] Extinguisher spray stream
- [ ] Spray impact cloud
- [ ] Chemical neutralizer stream or arc
- [ ] Chemical impact splash
- [ ] Pickup burst
- [ ] Speed trail
- [ ] Damage flash
- [ ] Player knockback streak
- [ ] Objective-complete burst
- [ ] Boss-hit effect
- [ ] Boss-phase transition
- [ ] Screen-edge danger vignette
- [ ] Victory confetti or campus-color particles

Prefer code-driven particles and shaders for effects that change size,
direction, or duration. Use sprite textures for the particle shapes.

## User Interface

Use SVG or engine-drawn shapes for scalable interface elements where possible.

### HUD

- [ ] Player health bar and heart/health icon
- [ ] Level timer
- [ ] Current objective panel
- [ ] Fire-clearance percentage meter
- [ ] Toxic-clearance percentage meter
- [ ] Extinguisher charge/ammo meter
- [ ] Vial charge meter
- [ ] Speed-boost timer
- [ ] Boss health bar and boss portrait
- [ ] Damage indicator
- [ ] Pause button or pause indicator

### Menus and Screens

- [ ] Game title treatment
- [ ] Title-screen background or animated scene
- [ ] Start, settings, credits, and quit buttons
- [ ] Level-select screen, if required
- [ ] Four level-introduction cards
- [ ] Control/tutorial panels
- [ ] Pause menu
- [ ] Victory screen
- [ ] Defeat screen
- [ ] Final completion screen
- [ ] Loading indicator
- [ ] Credits and attribution layout

### Objective Icons

- [ ] Fire icon
- [ ] Toxic-waste icon
- [ ] Zombie warning icon
- [ ] Tiger/boss icon
- [ ] Timer icon
- [ ] Health icon
- [ ] Extinguisher icon
- [ ] Vial icon
- [ ] Speed icon

## Level Asset Breakdown

### Level 1: Campus Dash

- [ ] Shared campus tileset
- [ ] Sutton exterior
- [ ] Anderson Hall Tower or Covenant Stone landmark
- [ ] Makerspace props
- [ ] Chemistry-lab props
- [ ] Small, medium, and large fires
- [ ] Extinguisher and refill pickups
- [ ] Fire-clearance UI
- [ ] Campus emergency music loop

### Level 2: Toxic Challenge

- [ ] Chemistry-lab tiles and props
- [ ] Toxic puddles and leaking containers
- [ ] Vial tool and refill pickups
- [ ] Neutralized-waste state
- [ ] Toxic-clearance UI
- [ ] Toxic lab music loop

### Level 3: The Gauntlet

- [ ] Campus and lab tiles reused from previous levels
- [ ] Burnt and contaminated overlays
- [ ] Zombie variants A and B
- [ ] Mixed fire and toxic hazards
- [ ] Generic energy-drink speed power-up
- [ ] Visible speed aura or trail
- [ ] Gauntlet music loop

### Level 4: Rival Showdown

- [ ] Rival arena tiles and props
- [ ] Tiger boss animation set
- [ ] Boss attacks and telegraphs
- [ ] Reused fire and toxic hazards
- [ ] Boss health UI
- [ ] Boss music loop
- [ ] Boss defeat and final-victory effects

## Audio

Export audio as `.ogg` where supported, with clean loop points and normalized
volume.

### Music

- [ ] Title/menu loop
- [ ] Level 1 campus emergency loop
- [ ] Level 2 toxic lab loop
- [ ] Level 3 gauntlet loop
- [ ] Level 4 boss loop
- [ ] Victory stinger
- [ ] Defeat stinger
- [ ] Final completion stinger

The four gameplay tracks should share a short musical theme while increasing in
intensity from level to level.

### Sound Effects

- [ ] Footsteps for indoor and outdoor surfaces
- [ ] Extinguisher spray loop
- [ ] Extinguisher empty click
- [ ] Refill sound
- [ ] Fire loop
- [ ] Fire extinguished hiss
- [ ] Toxic bubbling loop
- [ ] Chemical tool use
- [ ] Toxic spill neutralized
- [ ] Player hurt
- [ ] Player defeated
- [ ] Zombie idle/groan
- [ ] Zombie attack
- [ ] Zombie hurt
- [ ] Zombie defeated
- [ ] Tiger roar
- [ ] Tiger swipe
- [ ] Tiger pounce/land
- [ ] Tiger hurt
- [ ] Tiger defeated
- [ ] Pickup collected
- [ ] Speed boost activated
- [ ] Objective progress tick
- [ ] Objective completed
- [ ] UI hover, select, back, and pause sounds
- [ ] Timer warning

## Production Method

### Use Image Generation For

- Art-direction exploration
- Campus gameplay mockups
- Chemistry-lab and makerspace mood concepts
- Player and tiger character concepts
- Boss-arena concepts
- Static title or menu illustration, after manual cleanup

### Create Manually For

- Final sprite sheets
- Final tilesets
- Collision-aligned environment pieces
- HUD icons and meters
- School-specific architectural details
- Seamless animation frames
- Pixel-perfect pickup and hazard states

AI-generated images should not be used directly as sprite sheets. Frame sizes,
character proportions, transparency, and equipment placement must remain
consistent across every animation.

### Generate Procedurally In the Game For

- Smoke and embers
- Extinguisher mist
- Toxic vapor
- Speed trails
- Pickup glows
- Damage flashes
- Screen shake
- Boss attack telegraphs
- Objective-complete bursts

## Recommended Production Order

### Phase 1: Playable Level 1

- [ ] Player movement sheet
- [ ] Player extinguisher animation
- [ ] Basic campus tileset
- [ ] Sutton facade
- [ ] Fire animation and collision state
- [ ] Extinguisher spray effect
- [ ] Health, timer, and objective UI
- [ ] Essential Level 1 audio

### Phase 2: Toxic Mechanic

- [ ] Chemistry-lab and makerspace props
- [ ] Toxic-waste tiles and animation
- [ ] Vial-use animation and effects
- [ ] Toxic-clearance UI
- [ ] Level 2 audio

### Phase 3: Gauntlet

- [ ] Zombie base sheet and variants
- [ ] Damage and contamination overlays
- [ ] Speed pickup and visible player effect
- [ ] Mixed-hazard feedback
- [ ] Level 3 audio

### Phase 4: Boss and Presentation

- [ ] Tiger boss sheet
- [ ] Rival arena
- [ ] Boss telegraphs and health UI
- [ ] Menus, tutorials, victory, and defeat screens
- [ ] Boss music and remaining SFX

### Phase 5: Polish

- [ ] Additional environment variants
- [ ] Improved particles and lighting
- [ ] Accessibility/readability pass
- [ ] Animation timing pass
- [ ] Audio balancing
- [ ] Attribution and license review
- [ ] Performance and atlas-size review

## MVP Definition

The minimum complete asset set is:

- One player with movement, damage, extinguisher, and vial animations
- One campus tileset with Sutton and a second recognizable landmark
- One lab/makerspace interior kit
- Three fire sizes with extinguished states
- Toxic spills with neutralized states
- Two zombie variants based on one animation set
- One tiger boss with at least two attacks
- Extinguisher, vial, and speed pickups with visible active states
- Complete gameplay HUD
- Title, tutorial, victory, and defeat screens
- Five music loops or tracks and the essential gameplay sound effects

Decorative variants should be deferred until all four levels are playable and
every mechanic has clear visual and audio feedback.
