import { newId } from '@/utils/id'
import type { RandomTable } from '@/types'

// A small, honestly-scoped starter set of real, rollable tables — not a
// bundled generator library. Ranges are fully partitioned across each
// table's die size so every roll always lands on an entry.
export const sampleRandomTables: Omit<RandomTable, 'id'>[] = [
  {
    name: 'Weather',
    category: 'Weather',
    description: 'Roll at the start of a travel day or outdoor scene.',
    diceNotation: '1d20',
    entries: [
      { id: newId(), minRoll: 1, maxRoll: 4, result: 'Clear skies, mild temperature.' },
      { id: newId(), minRoll: 5, maxRoll: 9, result: 'Overcast, cool breeze.' },
      { id: newId(), minRoll: 10, maxRoll: 13, result: 'Light rain, muddy ground.' },
      { id: newId(), minRoll: 14, maxRoll: 16, result: 'Heavy rain, poor visibility.' },
      { id: newId(), minRoll: 17, maxRoll: 18, result: 'Thick fog rolls in.' },
      { id: newId(), minRoll: 19, maxRoll: 19, result: 'Thunderstorm — travel is dangerous.' },
      { id: newId(), minRoll: 20, maxRoll: 20, result: 'Unnaturally still — something feels wrong.' },
    ],
    tags: ['travel', 'weather'],
    isCustom: false,
    source: 'Sample',
  },
  {
    name: 'Tavern Rumors',
    category: 'Rumors',
    description: 'What the locals are whispering about.',
    diceNotation: '1d12',
    entries: [
      { id: newId(), minRoll: 1, maxRoll: 2, result: 'A merchant caravan went missing on the north road.' },
      { id: newId(), minRoll: 3, maxRoll: 4, result: 'Lights have been seen in the old watchtower at night.' },
      { id: newId(), minRoll: 5, maxRoll: 6, result: 'The blacksmith is paying well for monster teeth.' },
      { id: newId(), minRoll: 7, maxRoll: 8, result: "A noble's daughter has gone missing." },
      { id: newId(), minRoll: 9, maxRoll: 10, result: 'Strange sickness in the livestock outside town.' },
      { id: newId(), minRoll: 11, maxRoll: 12, result: 'An old adventurer swears the sewers have a new tenant.' },
    ],
    tags: ['town', 'hooks'],
    isCustom: false,
    source: 'Sample',
  },
  {
    name: 'Wandering Encounter',
    category: 'Encounters',
    description: 'Roll when the party lingers too long in the wilderness.',
    diceNotation: '1d10',
    entries: [
      { id: newId(), minRoll: 1, maxRoll: 3, result: 'Nothing — just the sounds of the wild.' },
      { id: newId(), minRoll: 4, maxRoll: 5, result: 'A pack of wild animals, wary but not hostile.' },
      { id: newId(), minRoll: 6, maxRoll: 7, result: 'Signs of recent travel — tracks, a cold campfire.' },
      { id: newId(), minRoll: 8, maxRoll: 9, result: 'A lone traveler in need of help (or trouble).' },
      { id: newId(), minRoll: 10, maxRoll: 10, result: 'Hostile creatures close in — roll for a fight.' },
    ],
    tags: ['wilderness', 'travel'],
    isCustom: false,
    source: 'Sample',
  },
  {
    name: 'Shop Trinkets',
    category: 'Loot',
    description: 'Odd little items a general store or curiosity shop might stock.',
    diceNotation: '1d8',
    entries: [
      { id: newId(), minRoll: 1, maxRoll: 1, result: 'A brass compass that never points north.' },
      { id: newId(), minRoll: 2, maxRoll: 2, result: 'A deck of cards missing the queen of every suit.' },
      { id: newId(), minRoll: 3, maxRoll: 3, result: 'A tiny bell that rings only when no one is listening.' },
      { id: newId(), minRoll: 4, maxRoll: 4, result: 'A jar of preserved fireflies, still faintly glowing.' },
      { id: newId(), minRoll: 5, maxRoll: 5, result: 'A single, perfectly smooth river stone.' },
      { id: newId(), minRoll: 6, maxRoll: 6, result: 'A folding knife with a cracked bone handle.' },
      { id: newId(), minRoll: 7, maxRoll: 7, result: 'A locket with a portrait of a stranger.' },
      { id: newId(), minRoll: 8, maxRoll: 8, result: 'A vial labeled only with a question mark.' },
    ],
    tags: ['shopping', 'flavor'],
    isCustom: false,
    source: 'Sample',
  },
]
