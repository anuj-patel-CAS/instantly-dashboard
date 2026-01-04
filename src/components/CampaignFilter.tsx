import { useState, useRef, useEffect } from 'react';
import type { CampaignAnalytics } from '../api/instantly';

type CampaignFilterProps = {
  campaigns: CampaignAnalytics[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
};

export function CampaignFilter({ campaigns, selectedIds, onChange }: CampaignFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleCampaign = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((i) => i !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const selectAll = () => {
    onChange(campaigns.map((c) => c.campaign_id));
  };

  const clearAll = () => {
    onChange([]);
  };

  const selectedCount = selectedIds.length;
  const buttonLabel =
    selectedCount === 0
      ? 'All Campaigns'
      : selectedCount === campaigns.length
      ? 'All Campaigns'
      : `${selectedCount} Campaign${selectedCount > 1 ? 's' : ''} Selected`;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
        {buttonLabel}
        <svg className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 z-10 mt-2 w-72 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="p-2 border-b border-gray-200">
            <div className="flex gap-2">
              <button
                onClick={selectAll}
                className="flex-1 rounded px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50"
              >
                Select All
              </button>
              <button
                onClick={clearAll}
                className="flex-1 rounded px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100"
              >
                Clear All
              </button>
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto p-2">
            {campaigns.map((campaign) => (
              <label
                key={campaign.campaign_id}
                className="flex items-center gap-3 rounded px-3 py-2 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedIds.includes(campaign.campaign_id)}
                  onChange={() => toggleCampaign(campaign.campaign_id)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 truncate">{campaign.campaign_name}</span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
