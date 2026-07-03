import { useCampaignStore } from '@/stores/campaign'
import { advanceWorldDate } from '@/utils/worldDate'

// Stateful wrapper around the pure advanceWorldDate() math — mutates the
// active campaign's currentWorldDate in place (getActive() returns the
// live reactive record, so this persists like any other nested-field edit).
export function useWorldDate() {
  const campaignStore = useCampaignStore()

  function advance(amount: number, unit: 'hour' | 'day' | 'week' | 'month') {
    const campaign = campaignStore.getActive()
    if (!campaign) return
    campaign.currentWorldDate = advanceWorldDate(campaign.currentWorldDate, campaign.calendarSystem, amount, unit)
  }

  return { advance }
}
