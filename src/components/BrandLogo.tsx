import React from 'react';

interface BrandLogoProps {
  name: string;
  variant?: 'dark' | 'light';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ name, variant = 'dark' }) => {
  const isLightText = variant === 'light';

  return (
    <span className="inline-flex items-center gap-3 whitespace-nowrap shrink-0">
      <svg
        width="34"
        height="34"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        <rect
          x="1"
          y="1"
          width="34"
          height="34"
          rx="8"
          fill={isLightText ? '#122D52' : '#0B1F3A'}
          stroke={isLightText ? '#60A5FA' : '#1D4ED8'}
          strokeWidth="1.25"
        />
        <path
          d="M7.5 23.5L14.2 12.5L18.6 18.8L22.3 14.3L28.5 23.5"
          stroke="#93C5FD"
          strokeWidth="1.65"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.5 26.8C11.8 25.4 14.9 25.4 18 26.8C21.1 28.2 24.2 28.2 27.5 26.8"
          stroke="#FFFFFF"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <circle cx="24.5" cy="10.2" r="1.6" fill="#60A5FA" />
      </svg>
      <span
        className={`text-base font-bold tracking-tight whitespace-nowrap ${
          isLightText ? 'text-white' : 'text-[#0B1F3A]'
        }`}
      >
        {name}
      </span>
    </span>
  );
};
