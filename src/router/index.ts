import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'dashboard', component: () => import('@/views/DashboardView.vue') },
  { path: '/players', name: 'players', component: () => import('@/views/PlayersView.vue') },
  { path: '/players/:id', name: 'player-detail', component: () => import('@/views/PlayerDetailView.vue') },
  {
    path: '/world',
    name: 'world',
    component: () => import('@/views/WorldView.vue'),
    meta: { worldTab: 'Overview' },
  },
  {
    path: '/world/landmarks',
    name: 'world-landmarks',
    component: () => import('@/views/WorldView.vue'),
    meta: { worldTab: 'Landmarks' },
  },
  {
    path: '/world/factions',
    name: 'world-factions',
    component: () => import('@/views/WorldView.vue'),
    meta: { worldTab: 'Factions' },
  },
  {
    path: '/world/npcs',
    name: 'world-npcs',
    component: () => import('@/views/WorldView.vue'),
    meta: { worldTab: 'NPCs' },
  },
  { path: '/world/map', name: 'world-map', component: () => import('@/views/MapView.vue') },
  { path: '/session', name: 'session', component: () => import('@/views/SessionView.vue') },
  { path: '/session/history', name: 'session-history', component: () => import('@/views/SessionHistoryView.vue') },
  { path: '/campaign', name: 'campaign', component: () => import('@/views/CampaignView.vue') },
  { path: '/loot', name: 'loot', component: () => import('@/views/LootView.vue') },
  { path: '/bestiary', name: 'bestiary', component: () => import('@/views/BestiaryView.vue') },
  { path: '/calendar', name: 'calendar', component: () => import('@/views/CalendarView.vue') },
  { path: '/tables', name: 'tables', component: () => import('@/views/TablesView.vue') },
  { path: '/handouts', name: 'handouts', component: () => import('@/views/HandoutsView.vue') },
  { path: '/ambient', name: 'ambient', component: () => import('@/views/AmbientView.vue') },
  { path: '/rules', name: 'rules', component: () => import('@/views/RulesView.vue') },
  { path: '/topics', name: 'topics', component: () => import('@/views/TopicsView.vue') },
  { path: '/quests', name: 'quests', component: () => import('@/views/QuestsView.vue') },
  { path: '/dungeons', name: 'dungeons', component: () => import('@/views/DungeonsView.vue') },
  { path: '/dungeons/:id', name: 'dungeon-detail', component: () => import('@/views/DungeonDetailView.vue') },
  { path: '/settings', name: 'settings', component: () => import('@/views/SettingsView.vue') },
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})
