import React, { useEffect } from 'react';
import { X, Clock, MapPin, Compass, Plus, Check, ArrowUpRight } from 'lucide-react';
import type { DestinationItem } from '../../appConfig';
import { SmartImage } from './SmartImage';

interface DestinationModalProps {
  destination: DestinationItem | null;
  fallbackImage: string;
  whatsappNumber: string;
  isInItinerary: boolean;
  onClose: () => void;
  onToggleItinerary: (id: string) => void;
}

export const DestinationModal: React.FC<DestinationModalProps> = ({
  destination,
  fallbackImage,
  whatsappNumber,
  isInItinerary,
  onClose,
  onToggleItinerary,
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

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Halo tim Jelajah Jember, saya ingin menanyakan informasi rute dan kunjungan ke ${destination.name} (Kec. ${destination.district}).`
  )}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1F3A]/75 backdrop-blur-xs p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="destination-modal-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white border border-[#D9E2EC] rounded-xl overflow-hidden shadow-xl max-h-[90vh] flex flex-col lg:grid lg:grid-cols-12"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Tutup detail destinasi"
          className="absolute top-4 right-4 z-10 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/95 text-[#0B1F3A] border border-[#D9E2EC] hover:bg-[#0B1F3A] hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="lg:col-span-6 bg-[#0B1F3A] relative min-h-[240px] lg:min-h-full">
          <SmartImage
            src={destination.image}
            fallbackSrc={fallbackImage}
            alt={destination.name}
            loading="eager"
            className="w-full h-64 sm:h-72 lg:h-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0B1F3A]/90 via-[#0B1F3A]/40 to-transparent pointer-events-none" />
          <div className="absolute bottom-4 left-5 right-5 text-white">
            <p className="text-xs font-medium text-[#93C5FD]">
              {destination.category} · Kec. {destination.district}
            </p>
            <p className="text-sm text-white/90 mt-0.5">{destination.travelTimeFromCity}</p>
          </div>
        </div>

        <div className="lg:col-span-6 p-6 sm:p-8 overflow-y-auto flex flex-col justify-between gap-6">
          <div>
            <div className="flex items-baseline justify-between gap-4 pr-10">
              <h2
                id="destination-modal-title"
                className="text-2xl font-bold tracking-tight text-[#0B1F3A]"
              >
                {destination.name}
              </h2>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#475569] pb-4 border-b border-[#D9E2EC]">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#1D4ED8]" />
                <span className="tabular-nums">{destination.openHours}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-[#1D4ED8]" />
                <span>Kec. {destination.district}, Jember</span>
              </span>
            </div>

            <p className="mt-4 text-[15px] leading-relaxed text-[#334155]">
              {destination.description}
            </p>

            <div className="mt-5 p-4 rounded-lg bg-[#F6F8FB] border border-[#D9E2EC]">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#1D4ED8]">
                <Compass className="w-4 h-4" />
                <span>Waktu Kunjungan Ideal</span>
              </div>
              <p className="mt-1 text-sm text-[#0B1F3A]">{destination.bestTime}</p>
            </div>

            <div className="mt-5">
              <h3 className="text-xs font-semibold text-[#475569]">
                Daya Tarik Utama
              </h3>
              <ul className="mt-2.5 grid grid-cols-1 gap-2">
                {destination.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex items-start gap-2.5 text-sm text-[#0B1F3A]"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-1.5 w-1.5 h-1.5 rounded-xs bg-[#1D4ED8] shrink-0"
                    />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-[#D9E2EC] flex flex-col sm:flex-row gap-3">
            <button
              type="button"
              onClick={() => onToggleItinerary(destination.id)}
              className={`flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] ${
                isInItinerary
                  ? 'bg-[#EFF6FF] text-[#1E3A8A] border border-[#93C5FD] hover:bg-[#DBEAFE]'
                  : 'bg-[#1D4ED8] text-white hover:bg-[#1E40AF]'
              }`}
            >
              {isInItinerary ? (
                <>
                  <Check className="w-4 h-4 text-[#1D4ED8]" />
                  <span>Dalam Rencana</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Tambah ke Rencana</span>
                </>
              )}
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold bg-white text-[#0B1F3A] border border-[#CBD5E1] hover:border-[#1D4ED8] hover:text-[#1D4ED8] transition-colors whitespace-nowrap focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
            >
              <span>Tanya via WhatsApp</span>
              <ArrowUpRight className="w-4 h-4 text-[#1D4ED8]" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
