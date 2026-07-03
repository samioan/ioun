import { getSystemPreset } from '@/data/system-presets'
import type {
  Campaign,
  CalendarSystem,
  CalendarEvent,
  CampaignTopic,
  Player,
  NPC,
  Faction,
  Landmark,
  CampaignArc,
  Quest,
  BestiaryEntry,
  Enemy,
  LootItem,
  Dungeon,
  DungeonRoom,
  DungeonConnection,
  DungeonTrap,
  PreparedEncounter,
  Handout,
  RandomTable,
  RandomTableEntry,
  RulesEntry,
  HouseRule,
  AmbientCue,
  WorldMap,
  MapPin,
} from '@/types'

export const defaultCalendarSystem: CalendarSystem = {
  name: 'Standard Calendar',
  monthsPerYear: 12,
  months: Array.from({ length: 12 }, (_, i) => ({ name: `Month ${i + 1}`, days: 30 })),
  daysPerWeek: 7,
  weekDayNames: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
  hoursPerDay: 24,
  notes: 'Default placeholder calendar — customize in Settings any time.',
}

export function createDefaultCampaign(overrides: Partial<Omit<Campaign, 'id'>> = {}): Omit<Campaign, 'id'> {
  const now = new Date().toISOString()
  return {
    name: '',
    createdAt: now,
    updatedAt: now,
    description: '',
    systemDefinition: getSystemPreset('generic')!,
    calendarSystem: defaultCalendarSystem,
    currentWorldDate: { year: 1, month: 1, day: 1 },
    houseRules: [],
    tags: [],
    ...overrides,
  }
}

export function createDefaultPlayer(overrides: Partial<Omit<Player, 'id'>> = {}): Omit<Player, 'id'> {
  return {
    name: '',
    playerName: '',
    ancestry: '',
    characterClass: '',
    background: '',
    progressionValue: 1,
    experiencePoints: 0,
    stats: {},
    skills: {},
    health: { current: 0, max: 0, temp: 0 },
    derivedStats: [],
    conditions: [],
    resourcePools: [],
    features: [],
    inventory: [],
    currency: {},
    customFields: {},
    notes: '',
    backstory: '',
    appearance: '',
    personalityTraits: '',
    ideals: '',
    bonds: '',
    flaws: '',
    languages: [],
    proficiencies: [],
    allegiances: [],
    isAlive: true,
    attunedItemIds: [],
    relationshipMap: {},
    xpLog: [],
    trackers: [],
    ...overrides,
  }
}

export function createDefaultNPC(overrides: Partial<Omit<NPC, 'id'>> = {}): Omit<NPC, 'id'> {
  return {
    name: '',
    aliases: [],
    role: '',
    disposition: 'neutral',
    isAlive: true,
    description: '',
    appearance: '',
    personality: '',
    motivation: '',
    secretInfo: '',
    conversationLog: [],
    relationshipMap: {},
    tags: [],
    isRecurring: false,
    importanceLevel: 'minor',
    customFields: {},
    ...overrides,
  }
}

export function createDefaultFaction(overrides: Partial<Omit<Faction, 'id'>> = {}): Omit<Faction, 'id'> {
  return {
    name: '',
    type: '',
    alignment: '',
    description: '',
    goals: '',
    methods: '',
    secrets: '',
    memberIds: [],
    leaderIds: [],
    alliedFactionIds: [],
    enemyFactionIds: [],
    playerRelationship: {},
    reputationScore: {},
    notoriety: 0,
    resources: '',
    notes: '',
    isSecret: false,
    ...overrides,
  }
}

export function createDefaultLandmark(overrides: Partial<Omit<Landmark, 'id'>> = {}): Omit<Landmark, 'id'> {
  return {
    name: '',
    type: 'other',
    description: '',
    atmosphere: '',
    secretInfo: '',
    npcIds: [],
    lootIds: [],
    factionIds: [],
    hasBeenVisited: false,
    isKnownToPlayers: false,
    tags: [],
    mapNotes: '',
    rumors: [],
    questHooks: [],
    shops: [],
    ...overrides,
  }
}

export function createDefaultArc(overrides: Partial<Omit<CampaignArc, 'id'>> = {}): Omit<CampaignArc, 'id'> {
  return {
    name: '',
    order: 0,
    summary: '',
    theme: '',
    status: 'upcoming',
    beats: [],
    openingHook: '',
    climax: '',
    resolution: '',
    ...overrides,
  }
}

export function createDefaultQuest(overrides: Partial<Omit<Quest, 'id'>> = {}): Omit<Quest, 'id'> {
  return {
    title: '',
    type: 'side',
    status: 'available',
    priority: 'medium',
    description: '',
    dmNotes: '',
    objectives: [],
    rewards: [],
    consequences: '',
    linkedLandmarkIds: [],
    linkedNpcIds: [],
    linkedTopicIds: [],
    isSecret: false,
    notes: '',
    ...overrides,
  }
}

export function createDefaultBestiaryEntry(
  overrides: Partial<Omit<BestiaryEntry, 'id'>> = {},
): Omit<BestiaryEntry, 'id'> {
  return {
    name: '',
    systemId: '',
    source: 'Custom',
    isCustom: true,
    type: '',
    defaultHealth: 10,
    stats: {},
    derivedStats: [],
    actions: [],
    lore: '',
    tags: [],
    customFields: {},
    ...overrides,
  }
}

export function createDefaultEnemy(overrides: Partial<Omit<Enemy, 'id'>> = {}): Omit<Enemy, 'id'> {
  return {
    name: '',
    type: '',
    health: { current: 10, max: 10 },
    stats: {},
    derivedStats: [],
    conditions: [],
    actions: [],
    lore: '',
    tactics: '',
    weaknesses: [],
    resistances: [],
    immunities: [],
    vulnerabilities: [],
    senses: '',
    languages: [],
    customFields: {},
    isDefeated: false,
    isBoss: false,
    encounterIds: [],
    lootDropIds: [],
    notes: '',
    isCustom: true,
    ...overrides,
  }
}

export function createDefaultLootItem(overrides: Partial<Omit<LootItem, 'id'>> = {}): Omit<LootItem, 'id'> {
  return {
    name: '',
    type: '',
    description: '',
    value: '',
    isIdentified: true,
    attunementRequired: false,
    customFields: {},
    notes: '',
    ...overrides,
  }
}

export function createDefaultTopic(overrides: Partial<Omit<CampaignTopic, 'id'>> = {}): Omit<CampaignTopic, 'id'> {
  return {
    title: '',
    category: 'hook',
    description: '',
    dmNotes: '',
    status: 'open',
    linkedEntityIds: [],
    revealedToPlayers: false,
    priority: 'medium',
    ...overrides,
  }
}

export function createDefaultCalendarEvent(
  overrides: Partial<Omit<CalendarEvent, 'id'>> = {},
): Omit<CalendarEvent, 'id'> {
  return {
    name: '',
    worldDate: { year: 1, month: 1, day: 1 },
    type: 'custom',
    description: '',
    isRecurring: false,
    linkedEntityIds: [],
    isSecret: false,
    ...overrides,
  }
}

export function createDefaultDungeon(overrides: Partial<Omit<Dungeon, 'id'>> = {}): Omit<Dungeon, 'id'> {
  return {
    name: '',
    type: 'dungeon',
    description: '',
    atmosphere: '',
    history: '',
    secretInfo: '',
    rooms: [],
    connections: [],
    traps: [],
    tags: [],
    isCompleted: false,
    notes: '',
    ...overrides,
  }
}

export function createDefaultDungeonRoom(overrides: Partial<Omit<DungeonRoom, 'id'>> = {}): Omit<DungeonRoom, 'id'> {
  return {
    dungeonId: '',
    name: '',
    number: 1,
    type: 'chamber',
    description: '',
    dmNotes: '',
    secretInfo: '',
    lighting: 'dim',
    encounters: [],
    lootIds: [],
    trapIds: [],
    npcIds: [],
    isExplored: false,
    isSecret: false,
    notes: '',
    ...overrides,
  }
}

export function createDefaultDungeonConnection(
  overrides: Partial<Omit<DungeonConnection, 'id'>> = {},
): Omit<DungeonConnection, 'id'> {
  return {
    fromRoomId: '',
    toRoomId: '',
    type: 'door',
    isLocked: false,
    isSecret: false,
    isDiscovered: true,
    notes: '',
    ...overrides,
  }
}

export function createDefaultDungeonTrap(overrides: Partial<Omit<DungeonTrap, 'id'>> = {}): Omit<DungeonTrap, 'id'> {
  return {
    name: '',
    roomId: '',
    type: '',
    description: '',
    triggerDescription: '',
    effect: '',
    isTriggered: false,
    isDisarmed: false,
    notes: '',
    ...overrides,
  }
}

export function createDefaultPreparedEncounter(
  overrides: Partial<Omit<PreparedEncounter, 'id'>> = {},
): Omit<PreparedEncounter, 'id'> {
  return {
    name: '',
    difficulty: 'medium',
    enemies: [],
    description: '',
    triggers: '',
    terrain: '',
    complications: [],
    lootIds: [],
    rewardBudget: 0,
    rewardLabel: 'XP',
    notes: '',
    isUsed: false,
    ...overrides,
  }
}

export function createDefaultHandout(overrides: Partial<Omit<Handout, 'id'>> = {}): Omit<Handout, 'id'> {
  return {
    name: '',
    type: 'letter',
    content: '',
    isRevealed: false,
    linkedEntityIds: [],
    notes: '',
    ...overrides,
  }
}

export function createDefaultRandomTable(overrides: Partial<Omit<RandomTable, 'id'>> = {}): Omit<RandomTable, 'id'> {
  return {
    name: '',
    category: '',
    description: '',
    diceNotation: '1d20',
    entries: [],
    tags: [],
    isCustom: true,
    ...overrides,
  }
}

export function createDefaultRandomTableEntry(
  overrides: Partial<Omit<RandomTableEntry, 'id'>> = {},
): Omit<RandomTableEntry, 'id'> {
  return {
    minRoll: 1,
    maxRoll: 1,
    result: '',
    ...overrides,
  }
}

export function createDefaultRulesEntry(overrides: Partial<Omit<RulesEntry, 'id'>> = {}): Omit<RulesEntry, 'id'> {
  return {
    title: '',
    category: '',
    system: '',
    content: '',
    tags: [],
    isCustom: true,
    isFavorited: false,
    ...overrides,
  }
}

export function createDefaultHouseRule(overrides: Partial<Omit<HouseRule, 'id'>> = {}): Omit<HouseRule, 'id'> {
  return {
    title: '',
    category: '',
    description: '',
    isActive: true,
    ...overrides,
  }
}

export function createDefaultAmbientCue(overrides: Partial<Omit<AmbientCue, 'id'>> = {}): Omit<AmbientCue, 'id'> {
  return {
    name: '',
    url: '',
    type: 'ambience',
    tags: [],
    ...overrides,
  }
}

export function createDefaultWorldMap(overrides: Partial<Omit<WorldMap, 'id'>> = {}): Omit<WorldMap, 'id'> {
  return {
    name: '',
    imageUrl: '',
    pins: [],
    notes: '',
    ...overrides,
  }
}

export function createDefaultMapPin(overrides: Partial<Omit<MapPin, 'id'>> = {}): Omit<MapPin, 'id'> {
  return {
    label: '',
    x: 50,
    y: 50,
    isRevealed: true,
    notes: '',
    ...overrides,
  }
}
