# 3D Game Asset Plan

This document defines the assets needed for the four-level Maryville College
game in `preplanning.txt`. The game is 3D and will run in Three.js.

The asset team will work **bottom up**: establish technical standards and small
reusable pieces first, then assemble props, rooms, landmarks, levels, and final
set dressing. Another teammate can use these assets in the top-down level and
game design.

## Three.js Technical Contract

### Delivery Format

- Ship runtime models as binary glTF 2.0 files (`.glb`).
- Keep editable Blender source files as `.blend`; never load these at runtime.
- Use separate GLBs for reusable props and characters.
- Use glTF PBR materials compatible with `MeshStandardMaterial` or
  `MeshPhysicalMaterial`.
- Store character animation clips in the character GLB.
- Use PNG textures during production and KTX2/Basis for optimized builds.
- Do not use OBJ or FBX as final runtime formats.

Three.js recommends glTF for runtime delivery because it supports meshes,
materials, textures, skins, skeletons, morph targets, and animations in a
compact render-ready format.

### Coordinates and Scale

- One Blender unit equals one meter.
- Use `+Y` as up.
- Define character forward as `+Z` and validate it in-game before animating.
- Apply transforms before export: scale `(1, 1, 1)` with clean rotation.
- Put static-prop origins at ground center.
- Put modular-piece origins at a documented snapping corner.
- Put character origins between the feet at ground level.
- Snap modular architecture to a 0.25 m grid.
- Standard wall module: 2 m wide, 3 m high, 0.2 m deep.
- Standard interior floor module: 2 m by 2 m.
- Standard door opening: 1 m wide by 2.1 m high.

### Mesh Rules

- Triangulate on export and use outward-facing normals.
- Remove non-manifold geometry, hidden faces, and unused nodes.
- Use smooth shading with intentional hard edges.
- Create simple collision proxies; do not collide against detailed meshes.
- Create LOD variants for landmarks and expensive characters.
- Reuse geometry and materials wherever possible.
- Support instancing for repeated trees, lamps, chairs, benches, bottles,
  extinguishers, and lab props.

### Suggested Geometry Budgets

| Asset type | Target triangles | LOD requirement |
|---|---:|---|
| Tiny pickup or bottle | 100-800 | No |
| Small prop | 300-1,500 | Optional |
| Furniture or medium prop | 800-4,000 | Optional |
| Tree or large decoration | 1,000-5,000 | Yes if numerous |
| Building module | 500-4,000 | Usually no |
| Landmark building | 10,000-40,000 | LOD0, LOD1, LOD2 |
| Player | 8,000-20,000 | LOD0 and LOD1 |
| Zombie | 5,000-12,000 | LOD0 and LOD1 |
| Tiger boss | 12,000-30,000 | LOD0 and LOD1 |

### Materials and Textures

- Use a stylized low-poly PBR look.
- Share materials and texture atlases across asset families.
- Treat base-color and emissive textures as sRGB.
- Treat normal, roughness, metallic, occlusion, and mask textures as non-color.
- Use 512x512 for small props, 1024x1024 for prop atlases, and 2048x2048
  only for landmarks or hero characters.
- Avoid unique 4K textures.
- Prefer alpha masking over alpha blending.
- Use emissive maps for fire, toxic waste, warning lights, and power-ups.

Maryville's palette is garnet `#640A28` and orange `#FF6600`. Rival assets use
purple and white with limited gold accents.

### Naming and Folders

Use lowercase `snake_case` filenames:

```text
chr_player.glb
chr_zombie_a.glb
chr_tiger_boss.glb
env_sutton_lod0.glb
mod_wall_brick_2m.glb
prop_lab_fume_hood.glb
haz_fire_medium.glb
pick_extinguisher.glb
col_sutton.glb
tex_lab_props_basecolor.ktx2
```

Use these node prefixes:

```text
mesh_   visible render mesh
col_    collision proxy
sock_   attachment socket
spawn_  gameplay spawn marker
fx_     effect anchor
lod0_   highest-detail mesh
lod1_   medium-detail mesh
lod2_   lowest-detail mesh
```

Runtime assets:

```text
public/assets/
  models/
    characters/
    environment/
    modular/
    props/
    hazards/
    pickups/
  textures/
  audio/music/
  audio/sfx/
  ui/
  data/
```

Editable sources:

```text
art-source/
  blender/
  textures/
  references/
  exports/
```

## Bottom-Up Production Order

## 1. Asset Test Kit

Build these first to prove the complete Blender-to-Three.js pipeline:

- [ ] One 1 m reference cube
- [ ] One 2x2 m floor module
- [ ] One 2 m wall module
- [ ] One simple bench prop
- [ ] One pickup with an emissive material
- [ ] One animated test character with `idle` and `run` clips
- [ ] One collision proxy
- [ ] One KTX2 test texture
- [ ] One instancing test with at least 50 repeated props

The kit is complete only when scale, orientation, materials, animation,
shadows, collision, compression, and disposal work correctly in Three.js.

## 2. Shared Modular Architecture

### Exterior Modules

- [ ] Grass, dirt, and scorched-ground planes
- [ ] Concrete and brick paths
- [ ] Straight, corner, and ramp curbs
- [ ] Road or parking-lot module if needed
- [ ] Brick walls: solid, corner, window, and doorway
- [ ] Exterior steps and ramp
- [ ] Roof edge and parapet
- [ ] Intact, glowing, cracked, and smoky windows
- [ ] Closed, open, and damaged doors

### Interior Modules

- [ ] Hallway floor and wall modules
- [ ] Lab floor and wall modules
- [ ] Makerspace floor and wall modules
- [ ] Corners, door frames, stairs, baseboards, and trim
- [ ] Ceiling or upper-wall occluders if required by the camera

### Shared Campus Props

- [ ] Trees with two or three variations
- [ ] Shrubs and planters
- [ ] Campus bench
- [ ] Lamp post
- [ ] Trash and recycling cans
- [ ] Bollard
- [ ] Directional and building signs
- [ ] Bike rack
- [ ] Outdoor table and chair
- [ ] Emergency call station

Repeated props must share materials and work with `THREE.InstancedMesh`.

## 3. Interior Prop Kits

### Makerspace

- [ ] 3D printer with idle and active states
- [ ] Filament rolls
- [ ] Modular workbenches
- [ ] Tool wall
- [ ] Shelving and storage bins
- [ ] Computer workstation
- [ ] Safety goggles and gloves
- [ ] Prototype-object set
- [ ] Extinguisher wall bracket
- [ ] Burnt/damaged material variants

### Chemistry Lab

- [ ] Straight, corner, sink, and end bench modules
- [ ] Fume hood
- [ ] Upper and lower cabinets
- [ ] Stool
- [ ] Beaker, flask, test tube, and bottle set
- [ ] Instrument silhouettes
- [ ] Chemical-storage shelf
- [ ] Safety shower and eyewash station
- [ ] Hazard placards
- [ ] Spill-response equipment
- [ ] Normal, contaminated, and damaged material variants

Keep small glassware low-poly and limit transparent materials.

## 4. Gameplay Pickups and Tools

Each pickup needs a model, UI icon, effect anchor, collision trigger, and
visible player state.

### Fire Extinguisher

- [ ] World pickup and refill canister
- [ ] Player-held extinguisher
- [ ] Nozzle attachment socket
- [ ] HUD icon
- [ ] Pickup glow/rotation setup

### Chemical Vials

- [ ] Vial pickup and refill crate
- [ ] Player-held neutralizer tool
- [ ] Tool attachment socket
- [ ] HUD icon and pickup glow

### Speed Boost

- [ ] Original generic energy-drink can
- [ ] HUD icon
- [ ] Speed-trail anchor
- [ ] Active aura material or mesh

Do not use the Red Bull name, logo, or trade dress.

## 5. Hazards and Effects

Build dynamic hazards from small meshes, animated materials, and particles
rather than complex animated geometry.

### Fire

- [ ] Small, medium, and large fire bases
- [ ] Flame flipbook texture
- [ ] Smoke and ember particle textures
- [ ] Point-light and effect anchors
- [ ] Simple collision proxy
- [ ] Charred decal or ground mesh
- [ ] Extinguished/wet state and steam texture

### Toxic Waste

- [ ] Small, medium, and large puddle meshes
- [ ] Modular spill edges
- [ ] Sealed, leaking, and broken barrels
- [ ] Dripping pipe/container
- [ ] Bubble and vapor effects
- [ ] Simple collision proxy
- [ ] Neutralized material state

### Tool and Combat Effects

- [ ] Extinguisher spray and impact cloud
- [ ] Chemical stream/projectile and impact splash
- [ ] Damage flash material
- [ ] Pickup burst and speed trail
- [ ] Boss attack telegraphs
- [ ] Objective-complete burst

## 6. Characters

### Character Contract

- Reuse one humanoid rig for player and zombies if practical.
- Export stable, named animation clips.
- Remove control-rig objects and unused bones before export.
- Disable root motion unless gameplay explicitly supports it.
- Provide attachment sockets for held tools.
- Test every clip through Three.js `AnimationMixer`.

### Player

- [ ] Garnet-and-orange player mesh and humanoid skeleton
- [ ] `idle`, `run`, `hurt`, `defeat`, and `victory`
- [ ] `spray_extinguisher` and `use_vial`
- [ ] Extinguisher and tool sockets
- [ ] Visible speed-boost state
- [ ] LOD1 mesh and capsule collision specification

### Toxic Zombies

- [ ] Base zombie plus two head/clothing variants
- [ ] Toxic/emissive material accents
- [ ] `idle`, `walk`, `attack`, `hurt`, and `defeat`
- [ ] LOD1 mesh and capsule collision specification

### Tiger Boss

- [ ] Original stylized tiger mesh and skeleton
- [ ] Purple-and-white styling with limited gold accents
- [ ] `idle`, `stalk`, `run`, `roar`, `pounce`, `swipe`, `hurt`,
  `stunned`, and `defeat`
- [ ] Phase-change state
- [ ] Effect anchors for mouth, paws, and landing point
- [ ] LOD1 mesh and simplified collision volumes

The tiger must not reproduce Sewanee's official mascot artwork.

## 7. Maryville Landmarks

Collect approved reference photographs before modeling.

### Sutton Science Center

- [ ] Recognizable massing, facade, entrance, sign, and window pattern
- [ ] Simplified roofline and playable interior shell
- [ ] Collision proxy
- [ ] LOD0, LOD1, and LOD2
- [ ] Fire, smoke, and damage effect anchors
- [ ] Burnt/damaged material overlays

### Second Recognizable Detail

Use Anderson Hall Tower or the Covenant Stone so the game reads as Maryville
College rather than a generic campus.

- [ ] Tower or stone model
- [ ] Collision proxy if reachable
- [ ] LOD0, LOD1, and LOD2 for the tower
- [ ] Surrounding landscaping

## 8. Level Assemblies

### Level 1: Campus Dash

- [ ] Modular campus exterior
- [ ] Sutton Science Center
- [ ] Anderson Hall Tower or Covenant Stone
- [ ] Makerspace and chemistry-lab room assemblies
- [ ] Fire, extinguisher, and refill placement variants

### Level 2: Toxic Challenge

- [ ] Expanded chemistry lab
- [ ] Toxic spills, leaking containers, and barrels
- [ ] Vial/refill placements and neutralized room state

### Level 3: The Gauntlet

- [ ] Reused campus and lab modules
- [ ] Scorch, crack, contamination, and damage decals
- [ ] Warning tape, barricades, and broken equipment
- [ ] Zombie spawn markers
- [ ] Mixed-hazard and speed-boost placements

### Level 4: Rival Showdown

- [ ] Arena floor or athletic-field modules
- [ ] Fence, wall, or bleacher boundary
- [ ] Original purple-and-white banners
- [ ] Boss entrance and effect anchors
- [ ] Fire/toxic placements and victory area

## 9. UI and 2D Support

- [ ] Health, timer, and objective UI
- [ ] Fire- and toxic-clearance meters
- [ ] Extinguisher, vial, and speed icons/meters
- [ ] Boss portrait and health bar
- [ ] Fire, toxic, zombie, and boss objective icons
- [ ] Title treatment and four level cards
- [ ] Controls/tutorial panel
- [ ] Pause, victory, defeat, and completion screens

Prefer SVG or web UI components for the HUD.

## 10. Audio

### Music

- [ ] Menu and four level loops
- [ ] Victory, defeat, and completion stingers

### Sound Effects

- [ ] Indoor/outdoor footsteps
- [ ] Extinguisher spray, empty, refill, and extinguish
- [ ] Fire loop and steam hiss
- [ ] Toxic bubbling and neutralization
- [ ] Chemical tool use and impact
- [ ] Player hurt and defeat
- [ ] Zombie idle, attack, hurt, and defeat
- [ ] Tiger roar, swipe, pounce, hurt, and defeat
- [ ] Pickup, boost, objective, UI, and timer-warning sounds

Export web-ready audio as `.ogg`, with fallback formats only if required.

## Collision Deliverables

| Asset | Collision |
|---|---|
| Player and zombies | Capsule |
| Tiger boss | Several simple capsules/boxes |
| Walls and buildings | Boxes or simplified static mesh |
| Blocking furniture | Box or convex proxy |
| Fire and toxic waste | Cylinder, box, or trigger volume |
| Pickups | Sphere trigger |
| Trees and lamps | Cylinder |

Never use a high-poly visual mesh as a dynamic collider.

## GLB Validation Checklist

Every GLB must pass before handoff:

- [ ] Loads through `GLTFLoader` without console warnings
- [ ] Uses the intended meter scale and orientation
- [ ] Has correct colors under neutral lighting
- [ ] Has no missing/external texture paths
- [ ] Uses a reasonable mesh and material count
- [ ] Has clean node and animation names
- [ ] Animation clips play through `AnimationMixer`
- [ ] Attachment sockets are correctly oriented
- [ ] Collider aligns with the render mesh
- [ ] Shadows and transparent materials render acceptably
- [ ] LODs align without position jumps
- [ ] Repeated props work with instancing
- [ ] Optimized output matches the source visually
- [ ] Works on the target browsers and representative low-power hardware

## Optimization

- Add Meshopt or Draco compression only after the base pipeline works.
- Use KTX2/Basis for GPU-compressed textures.
- Keep uncompressed exports for debugging.
- Atlas small props but keep gameplay objects separate.
- Share materials aggressively to reduce draw calls.
- Instance repeated identical meshes.
- Prefer baked detail and decals over extra geometry.
- Profile draw calls, texture memory, load time, and frame time.

## Immediate First Batch

- [ ] `ref_scale_cube.glb`
- [ ] `mod_floor_2m.glb`
- [ ] `mod_wall_brick_2m.glb`
- [ ] `prop_campus_bench.glb`
- [ ] `pick_extinguisher.glb`
- [ ] `chr_test.glb` with `idle` and `run`
- [ ] Collision proxies for the wall, bench, and pickup
- [ ] One shared PBR texture set
- [ ] A manifest listing dimensions, materials, animations, and collider types

Do not begin detailed Sutton or final characters until this batch has loaded
and passed validation in the game. This prevents scale, orientation, material,
and animation mistakes from spreading through the full asset library.
