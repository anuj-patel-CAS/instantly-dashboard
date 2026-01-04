import { useState, useMemo } from 'react';
import { useCampaignAnalytics, calculateSummary } from '../hooks/useCampaignAnalytics';
import { MetricCard } from './MetricCard';
import { DateRangePicker } from './DateRangePicker';
import { CampaignTable } from './CampaignTable';
import { EngagementChart } from './EngagementChart';
import { CampaignFilter } from './CampaignFilter';
import { StatusFilter } from './StatusFilter';

function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toLocaleString();
}

export function Dashboard() {
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [selectedCampaignIds, setSelectedCampaignIds] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<number[]>([]);

  const { data: campaigns, isLoading, error } = useCampaignAnalytics({
    start_date: startDate,
    end_date: endDate,
  });

  const filteredCampaigns = useMemo(() => {
    if (!campaigns) return [];

    let filtered = campaigns;

    // Filter by campaign IDs
    if (selectedCampaignIds.length > 0) {
      filtered = filtered.filter((c) => selectedCampaignIds.includes(c.campaign_id));
    }

    // Filter by status
    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((c) => selectedStatuses.includes(c.campaign_status));
    }

    return filtered;
  }, [campaigns, selectedCampaignIds, selectedStatuses]);

  const summary = useMemo(() => {
    return filteredCampaigns.length > 0 ? calculateSummary(filteredCampaigns) : null;
  }, [filteredCampaigns]);

  const hasActiveFilters = selectedCampaignIds.length > 0 || selectedStatuses.length > 0;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow p-8 max-w-md">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Data</h2>
          <p className="text-gray-600">
            {error instanceof Error ? error.message : 'Failed to fetch analytics data'}
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Make sure your VITE_INSTANTLY_API_KEY is set correctly in your .env file.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Instantly Analytics</h1>
            <div className="flex flex-wrap items-center gap-3">
              {campaigns && campaigns.length > 0 && (
                <>
                  <CampaignFilter
                    campaigns={campaigns}
                    selectedIds={selectedCampaignIds}
                    onChange={setSelectedCampaignIds}
                  />
                  <StatusFilter
                    selectedStatuses={selectedStatuses}
                    onChange={setSelectedStatuses}
                  />
                </>
              )}
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
              />
            </div>
          </div>
          {hasActiveFilters && (
            <p className="mt-2 text-sm text-gray-500">
              Showing {filteredCampaigns.length} of {campaigns?.length} campaigns
            </p>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredCampaigns.length > 0 && summary ? (
          <div className="space-y-8">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total Emails Sent"
                value={formatNumber(summary.totalEmailsSent)}
              />
              <MetricCard
                title="Open Rate"
                value={`${summary.avgOpenRate.toFixed(1)}%`}
                subtitle={`${formatNumber(summary.totalOpens)} opens`}
              />
              <MetricCard
                title="Reply Rate"
                value={`${summary.avgReplyRate.toFixed(1)}%`}
                subtitle={`${formatNumber(summary.totalReplies)} replies`}
              />
              <MetricCard
                title="Click Rate"
                value={`${summary.avgClickRate.toFixed(1)}%`}
                subtitle={`${formatNumber(summary.totalClicks)} clicks`}
              />
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <MetricCard
                title="Total Leads"
                value={formatNumber(summary.totalLeads)}
              />
              <MetricCard
                title="Bounce Rate"
                value={`${summary.bounceRate.toFixed(1)}%`}
                subtitle={`${formatNumber(summary.totalBounces)} bounces`}
                trend={summary.bounceRate > 5 ? 'down' : 'neutral'}
              />
              <MetricCard
                title="Filtered Campaigns"
                value={filteredCampaigns.length}
              />
            </div>

            {/* Engagement Chart */}
            <EngagementChart campaigns={filteredCampaigns} />

            {/* Campaign Table */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                {hasActiveFilters ? 'Filtered Campaigns' : 'All Campaigns'}
              </h2>
              <CampaignTable campaigns={filteredCampaigns} />
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">
              {campaigns && campaigns.length > 0
                ? 'No campaigns match the selected filters.'
                : 'No campaign data available for the selected date range.'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
