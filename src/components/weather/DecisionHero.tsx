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
        <div className={cn('relative overflow-hidden', style.glow, className)}>
            {/* Subtle pattern overlay */}
            <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='6' height='6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 6L6 0' stroke='white' stroke-width='0.5'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Main content */}
            <div
                className={cn(
                    'relative w-full py-14 px-6 flex flex-col items-center justify-center text-center transition-all duration-300',
                    style.bg,
                    style.text
                )}
            >
                {/* Status label with subtle text shadow */}
                <h1
                    className="text-6xl font-black tracking-tight mb-3"
                    style={{ textShadow: style.textShadow }}
                >
                    {style.label}
                </h1>

                <p className="text-xl font-medium max-w-lg opacity-90">
                    {summary}
                </p>

                {/* Bottom accent line */}
                <div className={cn('absolute bottom-0 left-0 right-0 h-1', style.accentBar)} />
            </div>
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
                glow: 'shadow-[0_0_40px_rgba(34,197,94,0.25)]',
                textShadow: '0 2px 4px rgba(0,0,0,0.15)',
                accentBar: 'bg-gradient-to-r from-green-400 via-emerald-300 to-green-400',
            };
        case 'RISIKO_RINGAN':
            return {
                bg: 'bg-amber-400',
                text: 'text-slate-900',
                label: 'WASPADA',
                glow: 'shadow-[0_0_40px_rgba(234,179,8,0.25)]',
                textShadow: '0 1px 2px rgba(255,255,255,0.3)',
                accentBar: 'bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-300',
            };
        case 'RISIKO_TINGGI':
            return {
                bg: 'bg-red-600',
                text: 'text-white',
                label: 'RISIKO',
                glow: 'shadow-[0_0_40px_rgba(239,68,68,0.25)]',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                accentBar: 'bg-gradient-to-r from-red-400 via-rose-300 to-red-400',
            };
        default:
            return {
                bg: 'bg-slate-500',
                text: 'text-white',
                label: 'INFO',
                glow: 'shadow-[0_0_20px_rgba(100,116,139,0.2)]',
                textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                accentBar: 'bg-gradient-to-r from-slate-400 via-slate-300 to-slate-400',
            };
    }
}

