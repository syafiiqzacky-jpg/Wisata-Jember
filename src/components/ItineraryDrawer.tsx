import React, { useEffect } from 'react';
import { X, Trash2, Sparkles, ArrowUpRight, MapPin } from 'lucide-react';
import type { DestinationItem } from '../../appConfig';
import { SmartImage } from './SmartImage';

interface ItineraryDrawerProps {
  isOpen: boolean;
  items: DestinationItem[];
  fallbackImage: string;
  whatsappNumber: string;
  onClose: () => void;
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
  onPlanWithAi: () => void;
}

export const ItineraryDrawer: React.FC<ItineraryDrawerProps> = ({
  isOpen,
  items,
  fallbackImage,
  whatsappNumber,
  onClose,
  onRemoveItem,
  onClearAll,
  onPlanWithAi,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const whatsappText = encodeURIComponent(
    items.length > 0
      ? `Halo tim Jelajah Jember, saya ingin konsultasi rute dan transportasi untuk destinasi berikut: ${items
          .map((i) => i.name)
          .join(', ')}.`
      : 'Halo tim Jelajah Jember, saya ingin berkonsultasi mengenai rencana wisata di Kabupaten Jember.'
  );

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-[#1A1615]/60 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="itinerary-drawer-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md bg-[#FAF8F5] h-full border-l border-[#E6E0D4] shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 border-b border-[#E6E0D4] flex items-center justify-between gap-4 bg-white">
          <div>
            <h2
              id="itinerary-drawer-title"
              className="text-lg font-bold tracking-tight text-[#1A1615]"
            >
              Rencana Perjalanan
            </h2>
            <p className="text-xs text-[#575049] mt-0.5 tabular-nums">
              {items.length} destinasi dipilih
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup rencana perjalanan"
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#E6E0D4] text-[#1A1615] hover:bg-[#1A1615] hover:text-[#FAF8F5] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 px-4">
              <div className="w-12 h-12 rounded-lg bg-[#EDE8DF] flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6 text-[#8A6A0A]" />
              </div>
              <h3 className="text-base font-semibold text-[#1A1615]">
                Belum Ada Destinasi Dipilih
              </h3>
              <p className="mt-2 text-sm text-[#575049] max-w-xs leading-relaxed">
                Tambahkan destinasi dari daftar wisata Jember untuk menghitung estimasi tiket dan menyusun rute harian secara otomatis.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-[#575049]">
                  Daftar Titik Kunjungan
                </span>
                <button
                  type="button"
                  onClick={onClearAll}
                  className="text-xs font-medium text-[#575049] hover:text-[#1A1615] underline underline-offset-4"
                >
                  Kosongkan
                </button>
              </div>

              <ul className="divide-y divide-[#E6E0D4] border border-[#E6E0D4] rounded-xl bg-white overflow-hidden">
                {items.map((item, idx) => (
                  <li key={item.id} className="p-4 flex items-center gap-3.5">
                    <div className="w-16 h-12 rounded-md overflow-hidden shrink-0 bg-[#EDE8DF]">
                      <SmartImage
                        src={item.image}
                        fallbackSrc={fallbackImage}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1A1615] truncate">
                        {idx + 1}. {item.name}
                      </p>
                      <p className="text-xs text-[#575049] mt-0.5">
                        {item.category} · Kec. {item.district}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.id)}
                      aria-label={`Hapus ${item.name} dari rencana`}
                      className="p-2 rounded-lg text-[#575049] hover:text-[#1A1615] hover:bg-[#FAF8F5] transition-colors shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t border-[#E6E0D4] bg-white space-y-4">
            <p className="text-xs text-[#575049] leading-relaxed tabular-nums">
              {items.length} destinasi siap dirangkai ke dalam rute harian beserta rincian biaya di tiap lokasi.
            </p>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={onPlanWithAi}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-[#1A1615] text-[#FAF8F5] text-sm font-semibold hover:bg-[#2E2725] transition-colors whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span>Susun Rute Optimal dengan AI</span>
              </button>

              <a
                href={`https://wa.me/${whatsappNumber}?text=${whatsappText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-white text-[#1A1615] border border-[#E6E0D4] text-sm font-semibold hover:border-[#1A1615] transition-colors whitespace-nowrap"
              >
                <span>Konsultasi via WhatsApp</span>
                <ArrowUpRight className="w-4 h-4 text-[#8A6A0A]" />
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
