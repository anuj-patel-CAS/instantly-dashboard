import axios from 'axios';

export type AnalyticsParams = {
  id?: string;
  ids?: string[];
  start_date?: string;
  end_date?: string;
  exclude_total_leads_count?: boolean;
};

export const CampaignStatus = {
  Draft: 0,
  Active: 1,
  Paused: 2,
  Completed: 3,
  RunningSubsequences: 4,
} as const;

export type CampaignStatusType = typeof CampaignStatus[keyof typeof CampaignStatus];

export type CampaignAnalytics = {
  campaign_name: string;
  campaign_id: string;
  campaign_status: CampaignStatusType;
  campaign_is_evergreen: boolean;
  leads_count: number;
  contacted_count: number;
  emails_sent_count: number;
  open_count: number;
  open_count_unique: number;
  reply_count: number;
  reply_count_unique: number;
  link_click_count: number;
  link_click_count_unique: number;
  bounced_count: number;
  unsubscribed_count: number;
  completed_count: number;
  new_leads_contacted_count: number;
  total_opportunities: number;
  total_opportunity_value: number;
};

const API_BASE_URL = '/api/v2';

class InstantlyClient {
  private client: ReturnType<typeof axios.create>;

  constructor(apiKey: string) {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
  }

  async getCampaignAnalytics(params: AnalyticsParams = {}): Promise<CampaignAnalytics[]> {
    const queryParams = new URLSearchParams();

    if (params.id) queryParams.append('id', params.id);
    if (params.ids) params.ids.forEach(id => queryParams.append('ids', id));
    if (params.start_date) queryParams.append('start_date', params.start_date);
    if (params.end_date) queryParams.append('end_date', params.end_date);
    if (params.exclude_total_leads_count !== undefined) {
      queryParams.append('exclude_total_leads_count', String(params.exclude_total_leads_count));
    }

    const response = await this.client.get<CampaignAnalytics[]>(
      `/campaigns/analytics?${queryParams.toString()}`
    );
    return response.data;
  }
}

let clientInstance: InstantlyClient | null = null;

export function getInstantlyClient(): InstantlyClient {
  if (!clientInstance) {
    const apiKey = import.meta.env.VITE_INSTANTLY_API_KEY;
    if (!apiKey) {
      throw new Error('VITE_INSTANTLY_API_KEY is not set in environment variables');
    }
    clientInstance = new InstantlyClient(apiKey);
  }
  return clientInstance;
}
