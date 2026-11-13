# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Entry for the ACM Mid-Southeast 2026 Vibe Coding Competition. Theme: "Mascot Mayhem: The Rivalry Run", an original side-scrolling platformer. Full rules and requirements are in `instructions.md`; the game concept is in `preplanning.txt`.

**Current state:** no code, build system, or tech stack exists yet. The repo holds only planning docs. `plan.md` and `agents.md` are empty placeholders. `assests/` (sic, keep the misspelling) is the empty media folder. Once a stack is chosen, add build/run/deploy commands here.

## Hard competition constraints (disqualification risks)

- **All code must be AI-generated.** Claude writes every code change itself. Never ask the user to hand-edit, paste in, or tweak code.
- **Assets must be AI-generated or public domain.** The only exception is official logos of schools in the competition, not altered in a way that misrepresents the school.
- **No reuse of code or assets from any previous project.**
- **Must be live at a public URL by the deadline.** Favor whatever deploys fastest (stack is not yet decided).
- **60-minute time limit** from the official start. Favor the simplest thing that works and is deployable over polish.
- **Deadline noted in `instructions.md`:** finish everything before 3:40pm on 2026-11-13.

## Deliverable requirements

- One playable hero inspired by the school mascot.
- Four levels, each with a clear beginning, middle, and finish:
  1. Campus Dash: at least two recognizable campus details.
  2. Themed challenge: a new setting or obstacle type.
  3. The Gauntlet: combines earlier challenges plus one new twist.
  4. Rivalry Showdown: boss fight against the rival school's mascot.
- At least one collectible power-up that visibly changes what the hero can do.
- A way to win and a way to fail, with clear feedback to the player.
- A playable build another team can try.

Judging is 1 to 5 on each of: adherence to theme, user experience, visual coherence.

## Game concept (from `preplanning.txt`)

Everything is on fire. The rival tiger mascot (Sewanee) is behind it.

- Level 1, Campus Dash: Sutton on fire; show the MCS3 makerspace and the chem lab. Put out at least 80% of fires before time runs out. HP bar; touching fire hurts.
- Level 2, Themed challenge: toxic waste from the chem lab, handled differently from fire.
- Level 3, Gauntlet: fires and toxic waste together, plus zombies spawned from the waste to avoid.
- Level 4, Rival: the tiger. Attack by spraying it with the fire extinguisher; cannot touch it.
- Pickups: fire extinguisher (puts out fires, refilled by collecting), vials (for toxic waste, same mechanic), an energy-drink speed boost.
- Win: clear enough fire/toxic waste. Lose: take too much hazard damage or run out of time.

The home school and hero mascot are not named in the docs. Confirm them before building character art or names.
