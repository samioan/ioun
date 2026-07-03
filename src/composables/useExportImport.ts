import { useCampaignStore } from '@/stores/campaign'
import { usePlayerStore } from '@/stores/players'
import { useNPCStore } from '@/stores/npcs'
import { useFactionStore } from '@/stores/factions'
import { useWorldStore } from '@/stores/world'
import { useSessionStore } from '@/stores/session'
import { useStoryStore } from '@/stores/story'
import { useEnemyStore } from '@/stores/enemies'
import { useBestiaryStore } from '@/stores/bestiary'
import { useLootStore } from '@/stores/loot'
import { useDiceStore } from '@/stores/dice'
import { useTopicsStore } from '@/stores/topics'
import { useCalendarStore } from '@/stores/calendar'
import { useTablesStore } from '@/stores/tables'
import { useHandoutsStore } from '@/stores/handouts'
import { useAmbientStore } from '@/stores/ambient'
import { useRulesStore } from '@/stores/rules'
import { useMilestonesStore } from '@/stores/milestones'
import { useQuestsStore } from '@/stores/quests'
import { useDungeonStore } from '@/stores/dungeons'
import { useMapsStore } from '@/stores/maps'
import type { CampaignExport } from '@/types'

// The one place that knows about every entity store — the first real
// consumer of CampaignExport, which existed as a fully-defined but never
// constructed/consumed type until this composable.
export function useExportImport() {
  const campaignStore = useCampaignStore()
  const playerStore = usePlayerStore()
  const npcStore = useNPCStore()
  const factionStore = useFactionStore()
  const worldStore = useWorldStore()
  const sessionStore = useSessionStore()
  const storyStore = useStoryStore()
  const enemyStore = useEnemyStore()
  const bestiaryStore = useBestiaryStore()
  const lootStore = useLootStore()
  const diceStore = useDiceStore()
  const topicsStore = useTopicsStore()
  const calendarStore = useCalendarStore()
  const tablesStore = useTablesStore()
  const handoutsStore = useHandoutsStore()
  const ambientStore = useAmbientStore()
  const rulesStore = useRulesStore()
  const milestonesStore = useMilestonesStore()
  const questsStore = useQuestsStore()
  const dungeonStore = useDungeonStore()
  const mapsStore = useMapsStore()

  function exportCampaign(): CampaignExport | null {
    const campaign = campaignStore.getActive()
    if (!campaign) return null
    return {
      version: '1',
      appName: 'ioun',
      exportedAt: new Date().toISOString(),
      campaign,
      players: Object.values(playerStore.items),
      npcs: Object.values(npcStore.items),
      factions: Object.values(factionStore.items),
      landmarks: Object.values(worldStore.items),
      sessions: Object.values(sessionStore.items),
      arcs: Object.values(storyStore.items),
      enemies: Object.values(enemyStore.items),
      customBestiary: Object.values(bestiaryStore.items),
      loot: Object.values(lootStore.items),
      topics: Object.values(topicsStore.items),
      quests: Object.values(questsStore.items),
      dungeons: Object.values(dungeonStore.items),
      maps: Object.values(mapsStore.items),
      calendarEvents: Object.values(calendarStore.items),
      randomTables: Object.values(tablesStore.items),
      handouts: Object.values(handoutsStore.items),
      ambientCues: Object.values(ambientStore.items),
      customRules: Object.values(rulesStore.items),
      milestones: Object.values(milestonesStore.items),
      diceHistory: Object.values(diceStore.items),
    }
  }

  function downloadCampaign(): boolean {
    const bundle = exportCampaign()
    if (!bundle) return false
    const filename = `ioun-${bundle.campaign.name.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'campaign'}-${new Date().toISOString().slice(0, 10)}.json`
    const blob = new Blob([JSON.stringify(bundle, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename
    anchor.click()
    URL.revokeObjectURL(url)
    return true
  }

  // Light shape check only — the same trust level usePersistence already
  // extends to whatever's sitting in localStorage. Every store's add()
  // accepts a supplied id and uses it as-is, so original ids survive the
  // round-trip (nanoid collision with existing data isn't a practical risk).
  function importCampaign(bundle: unknown): boolean {
    if (
      typeof bundle !== 'object' ||
      bundle === null ||
      (bundle as { appName?: string }).appName !== 'ioun' ||
      !(bundle as { campaign?: unknown }).campaign
    ) {
      return false
    }
    const data = bundle as CampaignExport

    const campaign = campaignStore.add(data.campaign)
    for (const p of data.players ?? []) playerStore.add(p)
    for (const n of data.npcs ?? []) npcStore.add(n)
    for (const f of data.factions ?? []) factionStore.add(f)
    for (const l of data.landmarks ?? []) worldStore.add(l)
    for (const s of data.sessions ?? []) sessionStore.add(s)
    for (const a of data.arcs ?? []) storyStore.add(a)
    for (const e of data.enemies ?? []) enemyStore.add(e)
    for (const b of data.customBestiary ?? []) bestiaryStore.add(b)
    for (const i of data.loot ?? []) lootStore.add(i)
    for (const t of data.topics ?? []) topicsStore.add(t)
    for (const q of data.quests ?? []) questsStore.add(q)
    for (const d of data.dungeons ?? []) dungeonStore.add(d)
    for (const m of data.maps ?? []) mapsStore.add(m)
    for (const c of data.calendarEvents ?? []) calendarStore.add(c)
    for (const rt of data.randomTables ?? []) tablesStore.add(rt)
    for (const h of data.handouts ?? []) handoutsStore.add(h)
    for (const ac of data.ambientCues ?? []) ambientStore.add(ac)
    for (const cr of data.customRules ?? []) rulesStore.add(cr)
    for (const ms of data.milestones ?? []) milestonesStore.add(ms)
    for (const dr of data.diceHistory ?? []) diceStore.add(dr)

    campaignStore.setActive(campaign.id)
    return true
  }

  return { exportCampaign, downloadCampaign, importCampaign }
}
