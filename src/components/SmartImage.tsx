import React, { useState, useEffect } from 'react';
import { Mountain } from 'lucide-react';
import { resolveMediaAsset } from '../data/mediaAssets';

interface SmartImageProps {
  src: string;
  fallbackSrc?: string;
  alt: string;
  className?: string;
  loading?: 'eager' | 'lazy';
}

export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  fallbackSrc,
  alt,
  className = '',
  loading = 'lazy',
}) => {
  const primaryResolved = resolveMediaAsset(src, fallbackSrc);
  const backupResolved = fallbackSrc ? resolveMediaAsset(fallbackSrc) : '';

  const [currentSrc, setCurrentSrc] = useState<string>(primaryResolved);
  const [hasFailedAll, setHasFailedAll] = useState<boolean>(false);

  useEffect(() => {
    setCurrentSrc(resolveMediaAsset(src, fallbackSrc));
    setHasFailedAll(false);
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (backupResolved && currentSrc !== backupResolved) {
      setCurrentSrc(backupResolved);
    } else {
      setHasFailedAll(true);
    }
  };

  if (hasFailedAll) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex flex-col items-center justify-center bg-[#E8EEF6] text-[#475569] p-6 text-center ${className}`}
      >
        <Mountain className="w-8 h-8 text-[#1D4ED8] mb-2" strokeWidth={1.5} />
        <span className="text-xs font-medium tracking-tight text-[#0B1F3A]">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={handleError}
      className={className}
    />
  );
};
