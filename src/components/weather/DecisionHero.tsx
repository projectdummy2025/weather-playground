/**
 * DecisionHero Component
 * Main decision zone: Instant Answer (SAFE/CAUTION/RISK)
 */

'use client';

import { type FC } from 'react';
import { cn } from '@/lib/utils';
import type { RiskLevel } from '@/types/weather';

interface DecisionHeroProps {
    riskLevel: RiskLevel;
    summary: string;
    className?: string;
}

export const DecisionHero: FC<DecisionHeroProps> = ({
    riskLevel,
    summary,
    className,
}) => {
    // Determine style based on risk level
    const style = getDecisionStyle(riskLevel);

    return (
        <div
            className={cn(
                'w-full py-12 px-6 flex flex-col items-center justify-center text-center transition-colors duration-300',
                style.bg,
                style.text,
                className
            )}
        >
            <h1 className="text-6xl font-black tracking-tight mb-2">
                {style.label}
            </h1>

            <p className="text-xl font-medium max-w-lg opacity-90">
                {summary}
            </p>
        </div>
    );
};

// Helper for styles and labels
function getDecisionStyle(risk: RiskLevel) {
    switch (risk) {
        case 'AMAN':
            return {
                bg: 'bg-green-600',
                text: 'text-white',
                label: 'AMAN',
            };
        case 'RISIKO_RINGAN':
            return {
                bg: 'bg-amber-400',
                text: 'text-slate-900',
                label: 'WASPADA',
            };
        case 'RISIKO_TINGGI':
            return {
                bg: 'bg-red-600',
                text: 'text-white',
                label: 'RISIKO',
            };
        default:
            return {
                bg: 'bg-slate-500',
                text: 'text-white',
                label: 'INFO',
            };
    }
}
