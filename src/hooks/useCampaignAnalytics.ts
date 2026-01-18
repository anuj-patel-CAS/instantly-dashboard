import { useQuery } from '@tanstack/react-query';
import { getInstantlyClient } from '../api/instantly';
import type { AnalyticsParams, CampaignAnalytics } from '../api/instantly';

export type AnalyticsSummary = {
  totalEmailsSent: number;
  totalLeads: number;
  totalOpens: number;
  totalReplies: number;
  totalClicks: number;
  totalBounces: number;
  totalOpportunities: number;
  totalOpportunityValue: number;
  avgOpenRate: number;
  avgReplyRate: number;
  avgClickRate: number;
  bounceRate: number;
};

export function useCampaignAnalytics(params: AnalyticsParams = {}) {
  return useQuery({
    queryKey: ['campaignAnalytics', params],
    queryFn: () => getInstantlyClient().getCampaignAnalytics(params),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useAnalyticsOverview(params: AnalyticsParams = {}) {
  return useQuery({
    queryKey: ['analyticsOverview', params],
    queryFn: () => getInstantlyClient().getAnalyticsOverview(params),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function calculateSummary(campaigns: CampaignAnalytics[]): AnalyticsSummary {
  const totals = campaigns.reduce(
    (acc, campaign) => ({
      totalEmailsSent: acc.totalEmailsSent + campaign.emails_sent_count,
      totalLeads: acc.totalLeads + campaign.leads_count,
      totalOpens: acc.totalOpens + campaign.open_count,
      totalReplies: acc.totalReplies + campaign.reply_count,
      totalClicks: acc.totalClicks + campaign.link_click_count,
      totalBounces: acc.totalBounces + campaign.bounced_count,
      totalOpportunities: acc.totalOpportunities + campaign.total_opportunities,
      totalOpportunityValue: acc.totalOpportunityValue + campaign.total_opportunity_value,
    }),
    {
      totalEmailsSent: 0,
      totalLeads: 0,
      totalOpens: 0,
      totalReplies: 0,
      totalClicks: 0,
      totalBounces: 0,
      totalOpportunities: 0,
      totalOpportunityValue: 0,
    }
  );

  const safeDiv = (num: number, denom: number) => (denom > 0 ? (num / denom) * 100 : 0);

  return {
    ...totals,
    avgOpenRate: safeDiv(totals.totalOpens, totals.totalEmailsSent),
    avgReplyRate: safeDiv(totals.totalReplies, totals.totalEmailsSent),
    avgClickRate: safeDiv(totals.totalClicks, totals.totalEmailsSent),
    bounceRate: safeDiv(totals.totalBounces, totals.totalEmailsSent),
  };
}
