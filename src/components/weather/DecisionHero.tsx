/**
 * DecisionHero Component
 * Main decision zone: Instant Answer (SAFE/CAUTION/RISK)
 */

'use client';

import { type FC } from 'react';
import { cn } from '@/lib/utils';
import { AnimatedSunIcon, AnimatedCloudIcon, AnimatedStormIcon } from '@/components/ui';
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
        <div className={cn('relative overflow-hidden rounded-2xl', style.glow, className)}>
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
                    'relative w-full py-10 px-6 flex flex-col items-center justify-center text-center transition-all duration-300',
                    style.bg,
                    style.text
                )}
            >
                {/* Weather Icon */}
                <div className="mb-3">
                    <WeatherIcon riskLevel={riskLevel} />
                </div>

                {/* Status label with subtle text shadow */}
                <h1
                    className="text-5xl md:text-6xl font-black tracking-tight mb-3"
                    style={{ textShadow: style.textShadow }}
                >
                    {style.label}
                </h1>

                <p className="text-lg md:text-xl font-medium max-w-lg opacity-90">
                    {summary}
                </p>

                {/* Bottom accent line */}
                <div className={cn('absolute bottom-0 left-0 right-0 h-1', style.accentBar)} />
            </div>
        </div>
    );
};

// Weather icon based on risk level
function WeatherIcon({ riskLevel }: { riskLevel: RiskLevel }) {
    switch (riskLevel) {
        case 'AMAN':
            return <AnimatedSunIcon size={64} />;
        case 'RISIKO_RINGAN':
            return <AnimatedCloudIcon size={64} />;
        case 'RISIKO_TINGGI':
            return <AnimatedStormIcon size={64} />;
        default:
            return <AnimatedCloudIcon size={64} />;
    }
}

// Helper for styles and labels
function getDecisionStyle(risk: RiskLevel) {
    switch (risk) {
        case 'AMAN':
            return {
                bg: 'bg-gradient-to-br from-green-500 to-emerald-600',
                text: 'text-white',
                label: 'AMAN',
                glow: 'shadow-[0_0_50px_rgba(34,197,94,0.3)]',
                textShadow: '0 2px 4px rgba(0,0,0,0.15)',
                accentBar: 'bg-gradient-to-r from-green-300 via-emerald-200 to-green-300',
            };
        case 'RISIKO_RINGAN':
            return {
                bg: 'bg-gradient-to-br from-amber-400 to-yellow-500',
                text: 'text-slate-900',
                label: 'WASPADA',
                glow: 'shadow-[0_0_50px_rgba(234,179,8,0.3)]',
                textShadow: '0 1px 2px rgba(255,255,255,0.3)',
                accentBar: 'bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200',
            };
        case 'RISIKO_TINGGI':
            return {
                bg: 'bg-gradient-to-br from-red-500 to-rose-600',
                text: 'text-white',
                label: 'RISIKO',
                glow: 'shadow-[0_0_50px_rgba(239,68,68,0.3)]',
                textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                accentBar: 'bg-gradient-to-r from-red-300 via-rose-200 to-red-300',
            };
        default:
            return {
                bg: 'bg-gradient-to-br from-slate-500 to-slate-600',
                text: 'text-white',
                label: 'INFO',
                glow: 'shadow-[0_0_30px_rgba(100,116,139,0.2)]',
                textShadow: '0 1px 2px rgba(0,0,0,0.1)',
                accentBar: 'bg-gradient-to-r from-slate-300 via-slate-200 to-slate-300',
            };
    }
}
