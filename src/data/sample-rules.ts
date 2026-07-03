import type { RulesEntry } from '@/types'

// A small, honestly-scoped starter set of D&D 5e-flavored quick-reference
// entries — not the SRD. Real, usable rules text so the reference page
// isn't empty by default and "load sample rules" is demonstrably real.
export const sampleRulesEntries: Omit<RulesEntry, 'id'>[] = [
  {
    title: 'Advantage & Disadvantage',
    category: 'Core Mechanics',
    system: 'dnd5e',
    content:
      'Roll two d20s and take the higher (advantage) or lower (disadvantage). Advantage and disadvantage cancel out if a character has both — roll once normally.',
    tags: ['core', 'rolls'],
    isCustom: false,
    source: 'Sample',
    isFavorited: false,
  },
  {
    title: 'Grappling',
    category: 'Combat',
    system: 'dnd5e',
    content:
      'Use the Attack action to make a special melee attack: a grapple. Make a Strength (Athletics) check contested by the target\'s Strength (Athletics) or Dexterity (Acrobatics). On a success, the target is grappled — its speed becomes 0 and it can\'t benefit from bonuses to speed.',
    tags: ['combat', 'conditions'],
    isCustom: false,
    source: 'Sample',
    isFavorited: false,
  },
  {
    title: 'Opportunity Attacks',
    category: 'Combat',
    system: 'dnd5e',
    content:
      'When a hostile creature you can see moves out of your reach, you can use your reaction to make one melee attack against it, provided it did not use the Disengage action.',
    tags: ['combat', 'reactions'],
    isCustom: false,
    source: 'Sample',
    isFavorited: false,
  },
  {
    title: 'Death Saves',
    category: 'Combat',
    system: 'dnd5e',
    content:
      'At 0 HP, roll a d20 at the start of each turn (no action required). 10+ succeeds, below 10 fails. Three failures = death. A natural 20 regains 1 HP. Taking damage at 0 HP counts as a failure (two on a crit).',
    tags: ['combat', 'dying'],
    isCustom: false,
    source: 'Sample',
    isFavorited: false,
  },
  {
    title: 'Short Rest & Long Rest',
    category: 'Resting',
    system: 'dnd5e',
    content:
      'Short rest: at least 1 hour, may spend Hit Dice to heal. Long rest: at least 8 hours, regain all HP and half spent Hit Dice; a character needs at least 1 HP at the start to gain the benefit. Only one long rest per 24 hours.',
    tags: ['resting', 'recovery'],
    isCustom: false,
    source: 'Sample',
    isFavorited: false,
  },
  {
    title: 'Cover',
    category: 'Combat',
    system: 'dnd5e',
    content:
      'Half cover (+2 AC/Dex save): low wall, furniture. Three-quarters cover (+5 AC/Dex save): arrow slit, thick trunk. Total cover: can\'t be targeted directly.',
    tags: ['combat', 'terrain'],
    isCustom: false,
    source: 'Sample',
    isFavorited: false,
  },
]
