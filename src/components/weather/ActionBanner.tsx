/**
 * ActionBanner Component
 * Secondary guidance: Direct actionable advice
 */

'use client';

import { type FC, useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { HourlyForecast } from '@/types/weather';
import { generateActionItems } from '@/services/interpreter';

interface ActionBannerProps {
    forecasts: HourlyForecast[];
    className?: string;
}

export const ActionBanner: FC<ActionBannerProps> = ({
    forecasts,
    className,
}) => {
    const actions = useMemo(() => generateActionItems(forecasts), [forecasts]);

    // Take top 2 items max
    const topActions = actions.slice(0, 2);

    if (topActions.length === 0) return null;

    return (
        <div className={cn('w-full', className)}>
            {topActions.map((action, idx) => (
                <div
                    key={idx}
                    className={cn(
                        'flex items-center gap-3 p-4 mb-2 rounded-xl text-lg font-bold',
                        getActionStyle(action.type)
                    )}
                >
                    <span className="text-2xl">{getActionIcon(action.type)}</span>
                    <span>{action.text}</span>
                </div>
            ))}
        </div>
    );
};

function getActionStyle(type: 'safe' | 'warning' | 'info') {
    switch (type) {
        case 'safe':
            return 'bg-green-100 text-green-900 border-l-4 border-green-600';
        case 'warning':
            return 'bg-amber-100 text-amber-900 border-l-4 border-amber-600';
        case 'info':
            return 'bg-slate-100 text-slate-900 border-l-4 border-slate-600';
    }
}

function getActionIcon(type: 'safe' | 'warning' | 'info') {
    switch (type) {
        case 'safe': return '✅';
        case 'warning': return '⚠️';
        case 'info': return 'ℹ️';
    }
}
