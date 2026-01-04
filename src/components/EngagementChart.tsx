import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { CampaignAnalytics } from '../api/instantly';

type EngagementChartProps = {
  campaigns: CampaignAnalytics[];
};

export function EngagementChart({ campaigns }: EngagementChartProps) {
  const data = campaigns.slice(0, 10).map((campaign) => ({
    name: campaign.campaign_name.length > 20
      ? campaign.campaign_name.substring(0, 20) + '...'
      : campaign.campaign_name,
    Opens: campaign.open_count,
    Replies: campaign.reply_count,
    Clicks: campaign.link_click_count,
  }));

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Campaign Engagement</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={80}
              tick={{ fontSize: 12, fill: '#6B7280' }}
            />
            <YAxis tick={{ fontSize: 12, fill: '#6B7280' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
              }}
            />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Bar dataKey="Opens" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Replies" fill="#10B981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Clicks" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
