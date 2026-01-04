import { useState, useRef, useEffect } from 'react';

export const StatusOptions = [
  { value: 1, label: 'Active', color: 'bg-blue-100 text-blue-800', dotColor: 'bg-blue-500' },
  { value: 2, label: 'Paused', color: 'bg-yellow-100 text-yellow-800', dotColor: 'bg-yellow-500' },
  { value: 0, label: 'Draft', color: 'bg-gray-100 text-gray-800', dotColor: 'bg-gray-500' },
  { value: 3, label: 'Completed', color: 'bg-green-100 text-green-800', dotColor: 'bg-green-500' },
  { value: -1, label: 'Stopped', color: 'bg-red-100 text-red-800', dotColor: 'bg-red-500' },
] as const;

type StatusFilterProps = {
  selectedStatuses: number[];
  onChange: (statuses: number[]) => void;
};

export function StatusFilter({ selectedStatuses, onChange }: StatusFilterProps) {
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

  const toggleStatus = (value: number) => {
    if (selectedStatuses.includes(value)) {
      onChange(selectedStatuses.filter((s) => s !== value));
    } else {
      onChange([...selectedStatuses, value]);
    }
  };

  const selectAll = () => {
    onChange(StatusOptions.map((s) => s.value));
  };

  const clearAll = () => {
    onChange([]);
  };

  const selectedCount = selectedStatuses.length;
  const buttonLabel =
    selectedCount === 0
      ? 'All Statuses'
      : selectedCount === StatusOptions.length
      ? 'All Statuses'
      : `${selectedCount} Status${selectedCount > 1 ? 'es' : ''} Selected`;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {buttonLabel}
        <svg className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 z-10 mt-2 w-56 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
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
          <div className="p-2">
            {StatusOptions.map((status) => (
              <label
                key={status.value}
                className="flex items-center gap-3 rounded px-3 py-2 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedStatuses.includes(status.value)}
                  onChange={() => toggleStatus(status.value)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.color}`}>
                  {status.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
