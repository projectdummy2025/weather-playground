/**
 * ActionBanner Component
 * Secondary guidance: Direct actionable advice
 */

'use client';

import { type FC, useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { HourlyForecast } from '@/types/weather';
import { generateActionItems } from '@/services/interpreter';
import { CheckCircleIcon, WarningTriangleIcon, InfoCircleIcon } from '@/components/ui';

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
                    <ActionIcon type={action.type} />
                    <span>{action.text}</span>
                </div>
            ))}
        </div>
    );
};

function ActionIcon({ type }: { type: 'safe' | 'warning' | 'info' }) {
    switch (type) {
        case 'safe':
            return <CheckCircleIcon size={28} />;
        case 'warning':
            return <WarningTriangleIcon size={28} />;
        case 'info':
            return <InfoCircleIcon size={28} />;
    }
}

function getActionStyle(type: 'safe' | 'warning' | 'info') {
    const base = 'shadow-[0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.6)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.08)]';
    switch (type) {
        case 'safe':
            return `${base} bg-gradient-to-r from-green-50 to-green-100/80 text-green-900 border-l-4 border-green-500`;
        case 'warning':
            return `${base} bg-gradient-to-r from-amber-50 to-amber-100/80 text-amber-900 border-l-4 border-amber-500`;
        case 'info':
            return `${base} bg-gradient-to-r from-slate-50 to-slate-100/80 text-slate-900 border-l-4 border-slate-500`;
    }
}
