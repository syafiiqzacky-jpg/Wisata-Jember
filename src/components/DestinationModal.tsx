import React, { useEffect } from 'react';
import { X, Clock, MapPin, Compass, Plus, Check, MessageSquare } from 'lucide-react';
import type { DestinationItem } from '../../appConfig';
import { SmartImage } from './SmartImage';

interface DestinationModalProps {
  destination: DestinationItem | null;
  fallbackImage: string;
  isInItinerary: boolean;
  onClose: () => void;
  onToggleItinerary: (id: string) => void;
  onAskAi: (destination: DestinationItem) => void;
}

export const DestinationModal: React.FC<DestinationModalProps> = ({
  destination,
  fallbackImage,
  isInItinerary,
  onClose,
  onToggleItinerary,
  onAskAi,
}) => {
  useEffect(() => {
    if (!destination) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [destination, onClose]);

  if (!destination) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1615]/70 backdrop-blur-xs p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="destination-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#FAF8F5] border border-[#E6E0D4] rounded-xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col lg:grid lg:grid-cols-12"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup detail destinasi"
          className="absolute top-4 right-4 z-10 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#FAF8F5]/95 text-[#1A1615] border border-[#E6E0D4] hover:bg-[#1A1615] hover:text-[#FAF8F5] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="lg:col-span-6 bg-[#1A1615] relative min-h-[240px] lg:min-h-full">
          <SmartImage
            src={destination.image}
            fallbackSrc={fallbackImage}
            alt={destination.name}
            loading="eager"
            className="w-full h-64 sm:h-72 lg:h-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#1A1615]/85 via-[#1A1615]/35 to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-5 right-5 text-[#FAF8F5]">
            <p className="text-xs font-medium text-[#D4AF37]">
              {destination.category} · Kec. {destination.district}
            </p>
            <p className="text-sm text-[#FAF8F5]/90 mt-0.5">{destination.travelTimeFromCity}</p>
          </div>
        </div>

        <div className="lg:col-span-6 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between gap-6">
          <div>
            <div className="flex items-baseline justify-between gap-4 pr-10">
              <h2
                id="destination-modal-title"
                className="text-2xl font-bold tracking-tight text-[#1A1615]"
              >
                {destination.name}
              </h2>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#575049] pb-4 border-b border-[#E6E0D4]">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#8A6A0A]" />
                <span className="tabular-nums">{destination.openHours}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#8A6A0A]" />
                <span>Kec. {destination.district}, Jember</span>
              </span>
            </div>

            <p className="mt-4 text-[15px] leading-relaxed text-[#3A342F]">
              {destination.description}
            </p>

            <div className="mt-5 p-4 rounded-lg bg-[#F3EFE8] border border-[#E6E0D4]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#8A6A0A]">
                <Compass className="w-4 h-4" />
                <span>Waktu Kunjungan Ideal</span>
              </div>
              <p className="mt-1 text-sm text-[#1A1615]">{destination.bestTime}</p>
            </div>

            <div className="mt-5">
              <h3 className="text-xs font-semibold tracking-wide text-[#575049] uppercase">
                Daya Tarik Utama
              </h3>
              <ul className="mt-2.5 grid grid-cols-1 gap-2">
                {destination.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-2.5 text-sm text-[#1A1615]"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1.5 w-1.5 h-1.5 rounded-xs bg-[#8A6A0A] shrink-0"
                    />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-[#E6E0D4] flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => onToggleItinerary(destination.id)}
              className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] ${
                isInItinerary
                  ? 'bg-[#EDE8DF] text-[#1A1615] border border-[#C9C0B0] hover:bg-[#E4DDD0]'
                  : 'bg-[#1A1615] text-[#FAF8F5] hover:bg-[#2E2725]'
              }`}
            >
              {isInItinerary ? (
                <>
                  <Check className="w-4 h-4 text-[#8A6A0A]" />
                  <span>Dalam Rencana</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 text-[#D4AF37]" />
                  <span>Tambah ke Rencana</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => onAskAi(destination)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-white text-[#1A1615] border border-[#D4AF37] hover:bg-[#D4AF37]/10 transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
            >
              <MessageSquare className="w-4 h-4 text-[#8A6A0A]" />
              <span>Tanya Konsultan AI</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
