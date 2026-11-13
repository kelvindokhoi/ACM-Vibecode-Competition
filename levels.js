// Scots on Fire - level data. Plain global, classic script.
const LEVELS = [
  {
    name: 'Campus Dash',
    intro: 'The rival Sewanee tiger snuck onto campus and set Maryville College ablaze! Run past Sutton Science Center, the MCS3 makerspace and Anderson Hall, spraying fires with your extinguisher. Put out 80% of the flames before time runs out.',
    bg: 'bg1',
    timeLimit: 90,
    length: 70,
    goal: { type: 'fire', fraction: 0.8 },
    platforms: [
      { x: 14, y: 0.75, w: 4, h: 0.5 },
      { x: 19, y: 2.25, w: 4, h: 0.5 },
      { x: 24, y: 3.25, w: 3, h: 0.5 },
      { x: 38, y: 1.25, w: 5, h: 0.5 },
      { x: 43, y: 2.75, w: 4, h: 0.5 },
      { x: 56, y: 1.25, w: 4, h: 0.5 }
    ],
    fires: [
      { x: 10, y: 0 }, { x: 19, y: 2.5 }, { x: 24, y: 3.5 }, { x: 30, y: 0 },
      { x: 34, y: 0 }, { x: 43, y: 3 }, { x: 48, y: 0 }, { x: 52, y: 0 },
      { x: 56, y: 1.5 }, { x: 63, y: 0 }
    ],
    toxics: [],
    zombies: [],
    pickups: [
      { type: 'extinguisher', x: 27, y: 0 },
      { type: 'extinguisher', x: 39, y: 1.5 },
      { type: 'extinguisher', x: 50, y: 0 },
      { type: 'vial', x: 60, y: 0 }
    ],
    boss: null,
    landmarks: [
      { x: 12, label: 'Sutton Science Center' },
      { x: 28, label: 'MCS3 Makerspace' },
      { x: 45, label: 'Anderson Hall Tower' },
      { x: 62, label: 'Covenant Stone' }
    ]
  },
  {
    name: 'Toxic Spill',
    intro: 'The fire cracked open the chem lab and toxic waste is oozing across campus. Grab neutralizer vials and splash every green puddle before it spreads. Neutralize 80% of the spills - and douse any stray flames.',
    bg: 'bg2',
    timeLimit: 90,
    length: 70,
    goal: { type: 'toxic', fraction: 0.8 },
    platforms: [
      { x: 15, y: 0.75, w: 4, h: 0.5 },
      { x: 20, y: 2.25, w: 3, h: 0.5 },
      { x: 32, y: 1.25, w: 6, h: 0.5 },
      { x: 46, y: 0.75, w: 3, h: 0.5 },
      { x: 50, y: 2.25, w: 3, h: 0.5 },
      { x: 54, y: 3.25, w: 3, h: 0.5 }
    ],
    fires: [ { x: 38, y: 0 }, { x: 64, y: 0 } ],
    toxics: [
      { x: 11, y: 0 }, { x: 15, y: 1 }, { x: 20, y: 2.5 }, { x: 28, y: 0 },
      { x: 32, y: 1.5 }, { x: 44, y: 0 }, { x: 54, y: 3.5 }, { x: 60, y: 0 }
    ],
    zombies: [],
    pickups: [
      { type: 'vial', x: 7, y: 0 },
      { type: 'vial', x: 25, y: 0 },
      { type: 'vial', x: 40, y: 0 },
      { type: 'drink', x: 46, y: 1 },
      { type: 'vial', x: 50, y: 2.5 },
      { type: 'extinguisher', x: 58, y: 0 }
    ],
    boss: null,
    landmarks: [
      { x: 9, label: 'Chem Lab' },
      { x: 30, label: 'Sutton Science Center' },
      { x: 52, label: 'Hazmat Zone' }
    ]
  },
  {
    name: 'The Gauntlet',
    intro: 'Fire and toxic sludge are everywhere - and the waste has started raising zombies! Spray flames with your extinguisher and hit puddles and zombies with vials. Clear 80% of the fires and spills to reach the tiger.',
    bg: 'bg3',
    timeLimit: 120,
    length: 90,
    goal: { type: 'both', fraction: 0.8 },
    platforms: [
      { x: 14, y: 0.75, w: 4, h: 0.5 },
      { x: 19, y: 2.25, w: 4, h: 0.5 },
      { x: 30, y: 1.25, w: 5, h: 0.5 },
      { x: 42, y: 0.75, w: 3, h: 0.5 },
      { x: 46, y: 2.25, w: 3, h: 0.5 },
      { x: 50, y: 3.75, w: 3, h: 0.5 },
      { x: 66, y: 1.25, w: 5, h: 0.5 },
      { x: 78, y: 1.75, w: 4, h: 0.5 }
    ],
    fires: [
      { x: 10, y: 0 }, { x: 19, y: 2.5 }, { x: 30, y: 1.5 }, { x: 50, y: 4 },
      { x: 55, y: 0 }, { x: 70, y: 0 }, { x: 78, y: 2 }, { x: 87, y: 0 }
    ],
    toxics: [
      { x: 14, y: 1 }, { x: 34, y: 0 }, { x: 46, y: 2.5 },
      { x: 66, y: 1.5 }, { x: 74, y: 0 }, { x: 85, y: 0 }
    ],
    zombies: [ { x: 24, y: 0 }, { x: 38, y: 0 }, { x: 58, y: 0 }, { x: 82, y: 0 } ],
    pickups: [
      { type: 'extinguisher', x: 6, y: 0 },
      { type: 'vial', x: 8, y: 0 },
      { type: 'vial', x: 27, y: 0 },
      { type: 'extinguisher', x: 40, y: 0 },
      { type: 'vial', x: 42, y: 1 },
      { type: 'drink', x: 44, y: 0 },
      { type: 'extinguisher', x: 62, y: 0 },
      { type: 'vial', x: 64, y: 0 },
      { type: 'drink', x: 72, y: 0 }
    ],
    boss: null,
    landmarks: [
      { x: 12, label: 'Chem Lab' },
      { x: 36, label: 'MCS3 Makerspace' },
      { x: 60, label: 'Anderson Hall' },
      { x: 84, label: 'Covenant Stone' }
    ]
  },
  {
    name: 'Rivalry Showdown',
    intro: 'The Sewanee tiger is cornered on the lawn by Anderson Hall. Dodge its pounces and hit it with your extinguisher ten times to send it home. Grab refills from the ledges - Go Scots!',
    bg: 'bg4',
    timeLimit: 120,
    length: 30,
    goal: { type: 'boss' },
    platforms: [
      { x: 10, y: 1.25, w: 4, h: 0.5 },
      { x: 18, y: 2.25, w: 3, h: 0.5 }
    ],
    fires: [],
    toxics: [],
    zombies: [],
    pickups: [
      { type: 'extinguisher', x: 7, y: 0 },
      { type: 'drink', x: 10, y: 1.5 },
      { type: 'extinguisher', x: 18, y: 2.5 },
      { type: 'extinguisher', x: 13, y: 0 }
    ],
    boss: { x: 22, y: 0 },
    landmarks: [
      { x: 5, label: 'Covenant Stone' },
      { x: 26, label: 'Anderson Hall Tower' }
    ]
  }
];
