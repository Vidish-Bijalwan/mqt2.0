'use client';

import { useState } from 'react';

interface DurationFilterProps {
  value: string;
  minDays?: number | null;
  maxDays?: number | null;
}

/**
 * Duration select for the packages filter form. When "Custom duration" is
 * chosen, min/max day inputs appear so the custom range is explicit instead
 * of silently filtering on unparseable durations.
 */
export default function DurationFilter({ value, minDays, maxDays }: DurationFilterProps) {
  const [duration, setDuration] = useState(value);

  return (
    <div className="flex flex-col gap-2">
      <label className="sr-only" htmlFor="package-duration">Trip duration</label>
      <select
        id="package-duration"
        name="duration"
        value={duration}
        onChange={(e) => setDuration(e.target.value)}
        className="min-h-11 rounded-lg border border-brand-sage bg-white px-3 text-sm text-gray-800 outline-none transition focus:border-brand-river focus:ring-2 focus:ring-brand-river/20"
      >
        <option value="All">Any duration</option>
        <option value="3-5">3 to 5 days</option>
        <option value="6-9">6 to 9 days</option>
        <option value="10+">10+ days</option>
        <option value="custom">Custom duration</option>
      </select>
      {duration === "custom" && (
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="sr-only" htmlFor="package-duration-min">Minimum days</label>
            <input
              id="package-duration-min"
              name="durationMin"
              type="number"
              min={1}
              max={90}
              defaultValue={minDays ?? 3}
              placeholder="Min days"
              required
              className="min-h-11 w-full rounded-lg border border-brand-sage bg-white px-3 text-sm text-gray-800 outline-none transition focus:border-brand-river focus:ring-2 focus:ring-brand-river/20"
            />
          </div>
          <div className="flex-1">
            <label className="sr-only" htmlFor="package-duration-max">Maximum days</label>
            <input
              id="package-duration-max"
              name="durationMax"
              type="number"
              min={1}
              max={90}
              defaultValue={maxDays ?? 15}
              placeholder="Max days"
              required
              className="min-h-11 w-full rounded-lg border border-brand-sage bg-white px-3 text-sm text-gray-800 outline-none transition focus:border-brand-river focus:ring-2 focus:ring-brand-river/20"
            />
          </div>
        </div>
      )}
    </div>
  );
}
