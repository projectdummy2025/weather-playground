/**
 * Colorful SVG Icons
 * Replaces emoji with high-quality, colorful SVG icons
 */

import { type FC, type SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & {
    size?: number;
};

// ============================================
// Status Icons
// ============================================

export const CheckCircleIcon: FC<IconProps> = ({ size = 24, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        {...props}
    >
        <circle cx="12" cy="12" r="10" fill="#22c55e" />
        <path
            d="M8 12l2.5 2.5L16 9"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const WarningTriangleIcon: FC<IconProps> = ({ size = 24, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        {...props}
    >
        <path
            d="M12 2L1 21h22L12 2z"
            fill="#f59e0b"
            stroke="#f59e0b"
            strokeWidth="1"
            strokeLinejoin="round"
        />
        <path
            d="M12 9v4M12 17h.01"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
        />
    </svg>
);

export const InfoCircleIcon: FC<IconProps> = ({ size = 24, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        {...props}
    >
        <circle cx="12" cy="12" r="10" fill="#3b82f6" />
        <path
            d="M12 16v-4M12 8h.01"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
        />
    </svg>
);

// ============================================
// Weather Icons
// ============================================

export const SunIcon: FC<IconProps> = ({ size = 24, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        {...props}
    >
        <circle cx="12" cy="12" r="5" fill="#fbbf24" />
        <g stroke="#fbbf24" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </g>
    </svg>
);

export const CloudRainIcon: FC<IconProps> = ({ size = 24, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        {...props}
    >
        <path
            d="M20 17.58A5 5 0 0 0 18 8h-1.26A8 8 0 1 0 4 16.25"
            fill="#94a3b8"
            stroke="#64748b"
            strokeWidth="1.5"
        />
        <g stroke="#3b82f6" strokeWidth="2" strokeLinecap="round">
            <line x1="8" y1="19" x2="8" y2="21" />
            <line x1="12" y1="17" x2="12" y2="23" />
            <line x1="16" y1="19" x2="16" y2="21" />
        </g>
    </svg>
);

export const UmbrellaIcon: FC<IconProps> = ({ size = 24, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        {...props}
    >
        <path
            d="M12 2a9 9 0 0 1 9 9H3a9 9 0 0 1 9-9z"
            fill="#ef4444"
            stroke="#dc2626"
            strokeWidth="1"
        />
        <path
            d="M12 11v9a2 2 0 0 1-4 0"
            stroke="#78350f"
            strokeWidth="2"
            strokeLinecap="round"
        />
    </svg>
);

export const LightbulbIcon: FC<IconProps> = ({ size = 24, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        {...props}
    >
        <path
            d="M9 18h6M10 22h4"
            stroke="#fbbf24"
            strokeWidth="2"
            strokeLinecap="round"
        />
        <path
            d="M12 2a7 7 0 0 0-4 12.7V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.3A7 7 0 0 0 12 2z"
            fill="#fbbf24"
            stroke="#f59e0b"
            strokeWidth="1"
        />
    </svg>
);

export const ThermometerIcon: FC<IconProps> = ({ size = 24, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        {...props}
    >
        <path
            d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z"
            fill="#fecaca"
            stroke="#ef4444"
            strokeWidth="1.5"
        />
        <circle cx="11.5" cy="17.5" r="2" fill="#ef4444" />
    </svg>
);

export const CloudIcon: FC<IconProps> = ({ size = 24, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        {...props}
    >
        <path
            d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"
            fill="#e2e8f0"
            stroke="#94a3b8"
            strokeWidth="1.5"
        />
    </svg>
);

// ============================================
// Action Icons
// ============================================

export const MotorcycleIcon: FC<IconProps> = ({ size = 24, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        {...props}
    >
        <circle cx="5.5" cy="17.5" r="3.5" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
        <circle cx="18.5" cy="17.5" r="3.5" fill="#1e293b" stroke="#0f172a" strokeWidth="1" />
        <path
            d="M5.5 17.5L9 12l3-3h4l2 3 2.5 5.5"
            stroke="#3b82f6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export const StopHandIcon: FC<IconProps> = ({ size = 24, ...props }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        {...props}
    >
        <path
            d="M18 10V6a2 2 0 0 0-4 0M14 10V4a2 2 0 0 0-4 0v6M10 10V5a2 2 0 0 0-4 0v9a8 8 0 0 0 16 0v-4a2 2 0 0 0-4 0"
            fill="#fef3c7"
            stroke="#f59e0b"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);
