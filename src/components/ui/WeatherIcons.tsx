/**
 * Animated Weather Icons
 * Weather-themed SVG icons with subtle animations
 */

import { type FC, type SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
    size?: number;
    animate?: boolean;
};

// ============================================
// Animated Sun Icon
// ============================================

export const AnimatedSunIcon: FC<IconProps> = ({ size = 48, animate = true, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        {...props}
    >
        <style>
            {animate ? `
        @keyframes rotate-rays { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse-sun { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        .sun-rays { animation: rotate-rays 20s linear infinite; transform-origin: 24px 24px; }
        .sun-core { animation: pulse-sun 3s ease-in-out infinite; transform-origin: 24px 24px; }
      ` : ''}
        </style>

        {/* Rays */}
        <g className="sun-rays" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round">
            <line x1="24" y1="4" x2="24" y2="10" />
            <line x1="24" y1="38" x2="24" y2="44" />
            <line x1="4" y1="24" x2="10" y2="24" />
            <line x1="38" y1="24" x2="44" y2="24" />
            <line x1="9.86" y1="9.86" x2="14.1" y2="14.1" />
            <line x1="33.9" y1="33.9" x2="38.14" y2="38.14" />
            <line x1="9.86" y1="38.14" x2="14.1" y2="33.9" />
            <line x1="33.9" y1="14.1" x2="38.14" y2="9.86" />
        </g>

        {/* Core */}
        <circle className="sun-core" cx="24" cy="24" r="10" fill="url(#sunGradient)" />

        <defs>
            <radialGradient id="sunGradient" cx="0.3" cy="0.3" r="0.7">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="100%" stopColor="#fbbf24" />
            </radialGradient>
        </defs>
    </svg>
);

// ============================================
// Animated Cloud Icon
// ============================================

export const AnimatedCloudIcon: FC<IconProps> = ({ size = 48, animate = true, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        {...props}
    >
        <style>
            {animate ? `
        @keyframes float-cloud { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-2px); } }
        .cloud-body { animation: float-cloud 4s ease-in-out infinite; }
      ` : ''}
        </style>

        <g className="cloud-body">
            <path
                d="M36 32H14c-4.4 0-8-3.6-8-8 0-3.7 2.5-6.8 6-7.7C12 11.8 15.5 8 20 8c3.3 0 6.2 2 7.5 5 1-.6 2.2-1 3.5-1 4 0 7.3 3.1 7.9 7.1 3.1.8 5.1 3.5 5.1 6.9 0 3.9-3.1 6-8 6z"
                fill="url(#cloudGradient)"
                stroke="#94a3b8"
                strokeWidth="1"
            />
        </g>

        <defs>
            <linearGradient id="cloudGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
        </defs>
    </svg>
);

// ============================================
// Animated Rain Icon
// ============================================

export const AnimatedRainIcon: FC<IconProps> = ({ size = 48, animate = true, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        {...props}
    >
        <style>
            {animate ? `
        @keyframes rain-drop { 0% { transform: translateY(-4px); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateY(8px); opacity: 0; } }
        .rain-1 { animation: rain-drop 1s ease-in infinite; }
        .rain-2 { animation: rain-drop 1s ease-in infinite 0.3s; }
        .rain-3 { animation: rain-drop 1s ease-in infinite 0.6s; }
      ` : ''}
        </style>

        {/* Cloud */}
        <path
            d="M34 24H16c-3.3 0-6-2.7-6-6 0-2.8 1.9-5.1 4.5-5.8C14.5 9.1 17.2 6 21 6c2.5 0 4.7 1.5 5.6 3.8.8-.5 1.6-.8 2.6-.8 3 0 5.5 2.3 5.9 5.3 2.3.6 3.9 2.6 3.9 5.2 0 2.9-2.3 4.5-5 4.5z"
            fill="url(#rainCloudGradient)"
            stroke="#64748b"
            strokeWidth="1"
        />

        {/* Rain drops */}
        <g stroke="#3b82f6" strokeWidth="2" strokeLinecap="round">
            <line className="rain-1" x1="16" y1="28" x2="16" y2="36" />
            <line className="rain-2" x1="24" y1="30" x2="24" y2="42" />
            <line className="rain-3" x1="32" y1="28" x2="32" y2="36" />
        </g>

        <defs>
            <linearGradient id="rainCloudGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#64748b" />
            </linearGradient>
        </defs>
    </svg>
);

// ============================================
// Animated Storm Icon
// ============================================

export const AnimatedStormIcon: FC<IconProps> = ({ size = 48, animate = true, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        {...props}
    >
        <style>
            {animate ? `
        @keyframes flash { 0%, 90%, 100% { opacity: 1; } 95% { opacity: 0.3; } }
        .lightning { animation: flash 2s ease-in-out infinite; }
      ` : ''}
        </style>

        {/* Dark cloud */}
        <path
            d="M34 22H16c-3.3 0-6-2.7-6-6 0-2.8 1.9-5.1 4.5-5.8C14.5 7.1 17.2 4 21 4c2.5 0 4.7 1.5 5.6 3.8.8-.5 1.6-.8 2.6-.8 3 0 5.5 2.3 5.9 5.3 2.3.6 3.9 2.6 3.9 5.2 0 2.9-2.3 4.5-5 4.5z"
            fill="url(#stormCloudGradient)"
            stroke="#475569"
            strokeWidth="1"
        />

        {/* Lightning bolt */}
        <path
            className="lightning"
            d="M26 22L22 30h4l-4 10 8-12h-5l3-6z"
            fill="#fbbf24"
            stroke="#f59e0b"
            strokeWidth="0.5"
        />

        <defs>
            <linearGradient id="stormCloudGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#64748b" />
                <stop offset="100%" stopColor="#334155" />
            </linearGradient>
        </defs>
    </svg>
);
