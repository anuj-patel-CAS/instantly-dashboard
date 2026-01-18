import { CampaignStatus } from '../api/instantly';
import type { CampaignAnalytics, CampaignStatusType } from '../api/instantly';

const CampaignStatusLabels: Record<number, string> = {
  [CampaignStatus.Draft]: 'Draft',
  [CampaignStatus.Active]: 'Active',
  [CampaignStatus.Paused]: 'Paused',
  [CampaignStatus.Completed]: 'Completed',
  [CampaignStatus.RunningSubsequences]: 'Running',
  [-1]: 'Stopped',
};

const StatusColors: Record<number, string> = {
  [CampaignStatus.Draft]: 'bg-gray-100 text-gray-800',
  [CampaignStatus.Active]: 'bg-blue-100 text-blue-800',
  [CampaignStatus.Paused]: 'bg-yellow-100 text-yellow-800',
  [CampaignStatus.Completed]: 'bg-green-100 text-green-800',
  [CampaignStatus.RunningSubsequences]: 'bg-purple-100 text-purple-800',
  [-1]: 'bg-red-100 text-red-800',
};

type CampaignTableProps = {
  campaigns: CampaignAnalytics[];
};

function formatPercent(value: number, total: number): string {
  if (total === 0) return '0%';
  return `${((value / total) * 100).toFixed(1)}%`;
}

function StatusBadge({ status }: { status: CampaignStatusType }) {
  const colorClass = StatusColors[status] || 'bg-gray-100 text-gray-800';
  const label = CampaignStatusLabels[status] || 'Unknown';

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClass}`}>
      {label}
    </span>
  );
}

export function CampaignTable({ campaigns }: CampaignTableProps) {
  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Campaign
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Leads
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sent
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Opens
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Replies
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Opportunities
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Clicks
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bounces
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {campaigns.map((campaign) => (
              <tr key={campaign.campaign_id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{campaign.campaign_name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={campaign.campaign_status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  {campaign.leads_count.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                  {campaign.emails_sent_count.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <span className="text-gray-900">{campaign.open_count.toLocaleString()}</span>
                  <span className="text-gray-500 ml-1">
                    ({formatPercent(campaign.open_count, campaign.emails_sent_count)})
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <span className="text-gray-900">{campaign.reply_count.toLocaleString()}</span>
                  <span className="text-gray-500 ml-1">
                    ({formatPercent(campaign.reply_count, campaign.emails_sent_count)})
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <span className="text-green-600 font-medium">{campaign.total_opportunities.toLocaleString()}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <span className="text-gray-900">{campaign.link_click_count.toLocaleString()}</span>
                  <span className="text-gray-500 ml-1">
                    ({formatPercent(campaign.link_click_count, campaign.emails_sent_count)})
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <span className="text-gray-900">{campaign.bounced_count.toLocaleString()}</span>
                  <span className="text-gray-500 ml-1">
                    ({formatPercent(campaign.bounced_count, campaign.emails_sent_count)})
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
