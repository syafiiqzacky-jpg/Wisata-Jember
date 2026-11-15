import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Plus,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Menu,
  BookmarkCheck,
  MessageSquare,
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';
import { APP_CONFIG, type DestinationItem, type GalleryItem } from '../appConfig.js';
import { BrandLogo } from './components/BrandLogo';
import { SmartImage } from './components/SmartImage';
import { DestinationModal } from './components/DestinationModal';
import { ItineraryDrawer } from './components/ItineraryDrawer';
import { AiConsultantDrawer } from './components/AiConsultantDrawer';

const CATEGORIES = [
  'Semua',
  'Pantai & Teluk',
  'Air Terjun',
  'Pegunungan',
  'Taman & Edukasi',
] as const;

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeDestination, setActiveDestination] = useState<DestinationItem | null>(null);
  const [itineraryIds, setItineraryIds] = useState<string[]>([
    'teluk-love',
    'pantai-papuma',
  ]);
  const [isItineraryOpen, setIsItineraryOpen] = useState<boolean>(false);
  const [isAiOpen, setIsAiOpen] = useState<boolean>(false);
  const [pendingAiPrompt, setPendingAiPrompt] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);

  const filteredDestinations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return APP_CONFIG.products.filter((item) => {
      const matchesCategory =
        selectedCategory === 'Semua' || item.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!query) return true;
      return (
        item.name.toLowerCase().includes(query) ||
        item.district.toLowerCase().includes(query) ||
        item.shortDescription.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    });
  }, [selectedCategory, searchQuery]);

  const itineraryItems = useMemo(
    () => APP_CONFIG.products.filter((item) => itineraryIds.includes(item.id)),
    [itineraryIds]
  );

  const toggleItineraryItem = (id: string) => {
    setItineraryIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const openAiWithPrompt = (promptText?: string) => {
    if (promptText) {
      setPendingAiPrompt(promptText);
    }
    setIsAiOpen(true);
  };

  const handlePlanItineraryWithAi = () => {
    setIsItineraryOpen(false);
    const names = itineraryItems.map((i) => i.name).join(', ');
    openAiWithPrompt(
      `Tolong susunkan jadwal rute harian yang optimal (urutan kunjungan berdasarkan lokasi, jam tiba ideal, dan ringkasan estimasi biaya tiket masuk) untuk destinasi pilihan saya berikut: ${names}.`
    );
  };

  const handleAskAiForDestination = (destination: DestinationItem) => {
    setActiveDestination(null);
    openAiWithPrompt(
      `Berikan panduan lengkap berkunjung ke ${destination.name} (Kec. ${destination.district}): jam terbaik tiba, rute tercepat dari Alun-Alun Jember, tips perlengkapan, dan destinasi lain yang searah.`
    );
  };

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxIndex(null);
      } else if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev === null ? null : (prev + 1) % APP_CONFIG.gallery.length
        );
      } else if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null
            ? null
            : (prev - 1 + APP_CONFIG.gallery.length) % APP_CONFIG.gallery.length
        );
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxIndex]);

  const activeLightboxItem: GalleryItem | null =
    lightboxIndex !== null ? APP_CONFIG.gallery[lightboxIndex] ?? null : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1A1615]">
      {/* Top Bar: 3-Zone Navigation Contract */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#E6E0D4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          <a
            href="#beranda"
            className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37] rounded-md"
          >
            <BrandLogo name={APP_CONFIG.brandName} variant="dark" />
          </a>

          <nav
            aria-label="Navigasi utama"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#575049]"
          >
            <a
              href="#destinasi"
              className="hover:text-[#1A1615] hover:underline underline-offset-8 decoration-[#D4AF37] transition-colors whitespace-nowrap shrink-0"
            >
              Destinasi
            </a>
            <a
              href="#galeri"
              className="hover:text-[#1A1615] hover:underline underline-offset-8 decoration-[#D4AF37] transition-colors whitespace-nowrap shrink-0"
            >
              Galeri
            </a>
            <a
              href="#testimoni"
              className="hover:text-[#1A1615] hover:underline underline-offset-8 decoration-[#D4AF37] transition-colors whitespace-nowrap shrink-0"
            >
              Testimoni
            </a>
            <a
              href="#faq"
              className="hover:text-[#1A1615] hover:underline underline-offset-8 decoration-[#D4AF37] transition-colors whitespace-nowrap shrink-0"
            >
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsAiOpen(true)}
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#1A1615] text-[#FAF8F5] text-xs sm:text-sm font-semibold hover:bg-[#2E2725] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
            >
              Konsultasi Rute
            </button>

            <button
              type="button"
              onClick={() => setIsMobileNavOpen((prev) => !prev)}
              aria-label="Buka menu navigasi"
              aria-expanded={isMobileNavOpen}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#E6E0D4] text-[#1A1615] hover:bg-[#EDE8DF] transition-colors"
            >
              {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isMobileNavOpen && (
          <nav
            aria-label="Navigasi seluler"
            className="md:hidden border-t border-[#E6E0D4] bg-[#FAF8F5] px-4 py-3 flex flex-col gap-1"
          >
            {[
              { href: '#destinasi', label: 'Destinasi' },
              { href: '#galeri', label: 'Galeri' },
              { href: '#testimoni', label: 'Testimoni' },
              { href: '#faq', label: 'FAQ' },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileNavOpen(false)}
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-[#1A1615] hover:bg-[#EDE8DF] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section id="beranda" className="pt-10 pb-14 sm:pt-14 sm:pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
              <div className="lg:col-span-6 flex flex-col justify-center py-2">
                <p className="text-xs font-semibold tracking-wide text-[#8A6A0A] uppercase">
                  Kabupaten Jember · Jawa Timur
                </p>

                <h1 className="mt-4 text-[clamp(2.25rem,4vw,3.5rem)] font-bold tracking-tight text-[#1A1615] leading-[1.1]">
                  {APP_CONFIG.tagline}
                </h1>

                <p className="mt-5 text-base sm:text-[17px] text-[#575049] leading-relaxed max-w-xl">
                  Direktori resmi {APP_CONFIG.products.length} destinasi unggulan Kabupaten Jember—dari tanjung pasir putih Pantai Papuma, cagar alam Bandealit, hingga kebun teh dan air terjun di lereng Gunung Argopuro, lengkap dengan informasi tiket, waktu terbaik, serta perencana rute otomatis.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3.5">
                  <a
                    href="#destinasi"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#1A1615] text-[#FAF8F5] text-sm font-semibold hover:bg-[#2E2725] transition-colors whitespace-nowrap"
                  >
                    Jelajahi Destinasi
                  </a>

                  <button
                    type="button"
                    onClick={() => setIsItineraryOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-white border border-[#D8D0C2] text-[#1A1615] text-sm font-semibold hover:border-[#1A1615] transition-colors whitespace-nowrap tabular-nums"
                  >
                    <BookmarkCheck className="w-4 h-4 text-[#8A6A0A]" />
                    <span>Rencana Perjalanan ({itineraryItems.length})</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="relative h-72 sm:h-96 lg:h-full min-h-[340px] rounded-xl overflow-hidden bg-[#1A1615] border border-[#E6E0D4]">
                  <SmartImage
                    src={APP_CONFIG.heroImage}
                    fallbackSrc={APP_CONFIG.fallbackImage}
                    alt="Panorama matahari terbit pesisir selatan Kabupaten Jember"
                    loading="eager"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#1A1615]/85 via-[#1A1615]/35 to-transparent pointer-events-none" />
                  <div className="absolute bottom-5 left-6 right-6 text-[#FAF8F5] flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium text-[#D4AF37]">Koridor Pesisir Selatan</p>
                      <p className="text-sm sm:text-base font-semibold mt-0.5">
                        Tanjung Papuma &amp; Teluk Love Payangan
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Full-Width 4-Column Factual Summary Strip */}
            <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-[#E6E0D4] bg-white border border-[#E6E0D4] rounded-xl">
              <div className="p-5 sm:p-6">
                <p className="text-xl sm:text-2xl font-bold text-[#1A1615] tabular-nums">
                  {APP_CONFIG.products.length} Destinasi
                </p>
                <p className="mt-1 text-xs sm:text-sm text-[#575049]">
                  Pantai, air terjun, pegunungan, dan taman edukasi
                </p>
              </div>
              <div className="p-5 sm:p-6">
                <p className="text-xl sm:text-2xl font-bold text-[#1A1615] tabular-nums">
                  4 Koridor Utama
                </p>
                <p className="mt-1 text-xs sm:text-sm text-[#575049]">
                  Pesisir selatan, pusat kota, lereng Argopuro, serta timur Silo
                </p>
              </div>
              <div className="p-5 sm:p-6">
                <p className="text-xl sm:text-2xl font-bold text-[#1A1615] tabular-nums">
                  4 Kategori Wisata
                </p>
                <p className="mt-1 text-xs sm:text-sm text-[#575049]">
                  Pantai &amp; teluk, air terjun, pegunungan, hingga taman edukasi
                </p>
              </div>
              <div className="p-5 sm:p-6">
                <p className="text-xl sm:text-2xl font-bold text-[#1A1615] tabular-nums">
                  0 – 150 Menit
                </p>
                <p className="mt-1 text-xs sm:text-sm text-[#575049]">
                  Waktu tempuh dari pusat Alun-Alun Jember hingga Meru Betiri
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Destinations Collection Grid */}
        <section id="destinasi" className="py-14 sm:py-16 border-t border-[#E6E0D4]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#8A6A0A]">
                  Koleksi Destinasi Terkurasi
                </p>
                <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1615]">
                  Daftar Wisata Unggulan Kabupaten Jember
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsItineraryOpen(true)}
                className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#F3EFE8] border border-[#D8D0C2] text-sm font-semibold text-[#1A1615] hover:border-[#1A1615] transition-colors whitespace-nowrap tabular-nums"
              >
                <BookmarkCheck className="w-4 h-4 text-[#8A6A0A]" />
                <span>Lihat Rencana ({itineraryItems.length})</span>
              </button>
            </div>

            {/* Interactive Category Tabs & Search Control */}
            <div className="mt-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div
                role="tablist"
                aria-label="Filter kategori wisata"
                className="flex items-center gap-1.5 p-1 bg-[#EDE8DF] rounded-lg overflow-x-auto"
              >
                {CATEGORIES.map((category) => {
                  const isActive = selectedCategory === category;
                  return (
                    <button
                      key={category}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-3.5 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 ${
                        isActive
                          ? 'bg-[#1A1615] text-[#FAF8F5]'
                          : 'text-[#575049] hover:text-[#1A1615]'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>

              <div className="relative w-full lg:w-80 shrink-0">
                <Search className="w-4 h-4 text-[#7A7167] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <label htmlFor="destination-search" className="sr-only">
                  Cari nama wisata atau kecamatan di Jember
                </label>
                <input
                  id="destination-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari destinasi atau kecamatan..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-[#D8D0C2] text-sm text-[#1A1615] placeholder:text-[#7A7167] focus:outline-none focus:border-[#1A1615]"
                />
              </div>
            </div>

            {filteredDestinations.length === 0 ? (
              <div className="mt-10 p-10 rounded-xl bg-white border border-[#E6E0D4] text-center">
                <p className="text-base font-semibold text-[#1A1615]">
                  Tidak ada destinasi yang sesuai dengan pencarian Anda.
                </p>
                <p className="mt-1.5 text-sm text-[#575049]">
                  Coba gunakan kata kunci lain atau tampilkan seluruh kategori wisata.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('Semua');
                    setSearchQuery('');
                  }}
                  className="mt-5 inline-flex items-center px-4 py-2 rounded-lg bg-[#1A1615] text-[#FAF8F5] text-sm font-semibold hover:bg-[#2E2725] transition-colors"
                >
                  Tampilkan Semua Destinasi
                </button>
              </div>
            ) : (
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
                {filteredDestinations.map((item) => {
                  const isAdded = itineraryIds.includes(item.id);
                  return (
                    <article
                      key={item.id}
                      className="group bg-white border border-[#E6E0D4] rounded-xl overflow-hidden flex flex-col transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md"
                    >
                      <button
                        type="button"
                        onClick={() => setActiveDestination(item)}
                        className="text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
                      >
                        <div className="aspect-[4/3] w-full overflow-hidden bg-[#EDE8DF]">
                          <SmartImage
                            src={item.image}
                            fallbackSrc={APP_CONFIG.fallbackImage}
                            alt={`${item.name} di Kecamatan ${item.district}, Kabupaten Jember`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                          />
                        </div>
                      </button>

                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-xs text-[#575049]">
                            <span>{item.category}</span>
                            <span aria-hidden="true">·</span>
                            <span>Kec. {item.district}</span>
                          </div>

                          <h3 className="mt-2 text-lg font-bold tracking-tight text-[#1A1615]">
                            <button
                              type="button"
                              onClick={() => setActiveDestination(item)}
                              className="text-left hover:text-[#8A6A0A] transition-colors"
                            >
                              {item.name}
                            </button>
                          </h3>

                          <p className="mt-2.5 text-sm text-[#575049] leading-relaxed">
                            {item.shortDescription}
                          </p>
                        </div>

                        <div className="mt-5 pt-4 border-t border-[#EFEAE0] flex items-center justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => setActiveDestination(item)}
                            className="text-xs font-semibold text-[#1A1615] hover:text-[#8A6A0A] transition-colors whitespace-nowrap"
                          >
                            Detail Lokasi
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleItineraryItem(item.id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                              isAdded
                                ? 'bg-[#F3EFE8] text-[#1A1615] border border-[#D4AF37]'
                                : 'bg-[#1A1615] text-[#FAF8F5] hover:bg-[#2E2725]'
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-[#8A6A0A]" />
                                <span>Tersimpan</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5 text-[#D4AF37]" />
                                <span>Rencana</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Visual Gallery Section */}
        <section id="galeri" className="py-14 sm:py-16 bg-[#1A1615] text-[#FAF8F5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#D4AF37]">
                  Galeri Visual Lapangan
                </p>
                <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight">
                  Lanskap Pesisir hingga Dataran Tinggi
                </h2>
              </div>
              <p className="text-sm text-[#FAF8F5]/75 max-w-md leading-relaxed">
                Klik foto untuk memperbesar dokumentasi titik pandang ikonik dari pesisir Meru Betiri, Ambulu, Sumberjambe, hingga lereng Argopuro.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-5">
              {APP_CONFIG.gallery.map((item, idx) => {
                const spanClass =
                  idx === 0
                    ? 'lg:col-span-7'
                    : idx === 1
                    ? 'lg:col-span-5'
                    : idx === 2 || idx === 3 || idx === 4
                    ? 'lg:col-span-4'
                    : idx === 5 || idx === 6
                    ? 'lg:col-span-6'
                    : 'lg:col-span-12';

                const heightClass = idx === APP_CONFIG.gallery.length - 1 ? 'h-64 sm:h-80' : 'h-64 sm:h-72';

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setLightboxIndex(idx)}
                    className={`${spanClass} ${heightClass} group relative rounded-xl overflow-hidden bg-[#26211F] border border-white/10 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]`}
                  >
                    <SmartImage
                      src={item.image}
                      fallbackSrc={APP_CONFIG.fallbackImage}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#1A1615]/90 via-[#1A1615]/45 to-transparent pointer-events-none" />
                    <div className="absolute bottom-4 left-5 right-5">
                      <p className="text-xs font-medium text-[#D4AF37]">{item.location}</p>
                      <h3 className="text-base font-semibold text-[#FAF8F5] mt-0.5">
                        {item.title}
                      </h3>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimoni" className="py-14 sm:py-16 border-b border-[#E6E0D4]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#8A6A0A]">
                Catatan Pengunjung
              </p>
              <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1615]">
                Pengalaman Perjalanan Bersama Jelajah Jember
              </h2>
            </div>

            <div className="mt-9 grid grid-cols-1 md:grid-cols-3 gap-6">
              {APP_CONFIG.testimonials.map((t) => (
                <figure
                  key={t.id}
                  className="bg-white border border-[#E6E0D4] rounded-xl p-7 flex flex-col justify-between gap-6"
                >
                  <div>
                    <p className="text-xs font-semibold text-[#8A6A0A]">{t.destination}</p>
                    <blockquote className="mt-3 text-sm sm:text-[15px] leading-relaxed text-[#2A2421]">
                      “{t.quote}”
                    </blockquote>
                  </div>

                  <figcaption className="pt-4 border-t border-[#EFEAE0]">
                    <p className="text-sm font-bold text-[#1A1615]">{t.name}</p>
                    <p className="text-xs text-[#575049] mt-0.5">{t.role}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ & Direct Consultation Section */}
        <section id="faq" className="py-14 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
              <div className="lg:col-span-5 flex flex-col justify-between gap-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#8A6A0A]">
                    Informasi Praktis
                  </p>
                  <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-[#1A1615]">
                    Pertanyaan Umum Wisata Jember
                  </h2>
                  <p className="mt-3 text-sm sm:text-[15px] text-[#575049] leading-relaxed">
                    Panduan ringkas mengenai musim kunjungan terbaik, penggabungan rute satu hari, dan rekomendasi ramah keluarga.
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-white border border-[#E6E0D4]">
                  <h3 className="text-base font-bold text-[#1A1615]">
                    Butuh Jadwal Khusus Rombongan atau Keluarga?
                  </h3>
                  <p className="mt-2 text-sm text-[#575049] leading-relaxed">
                    Diskusikan preferensi destinasi Anda langsung bersama Konsultan AI kami atau tim koordinator di Jember.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setIsAiOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1A1615] text-[#FAF8F5] text-sm font-semibold hover:bg-[#2E2725] transition-colors whitespace-nowrap"
                    >
                      <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
                      <span>Tanya Konsultan AI</span>
                    </button>
                    <a
                      href={`https://wa.me/${APP_CONFIG.contact.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-[#FAF8F5] border border-[#D8D0C2] text-[#1A1615] text-sm font-semibold hover:border-[#1A1615] transition-colors whitespace-nowrap"
                    >
                      <span>WhatsApp</span>
                      <ArrowUpRight className="w-4 h-4 text-[#8A6A0A]" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="divide-y divide-[#E6E0D4] border-y border-[#E6E0D4] bg-white rounded-xl px-6">
                  {APP_CONFIG.faq.map((item, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div key={item.question} className="py-5">
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          className="w-full flex items-center justify-between gap-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] rounded-md"
                        >
                          <span className="text-sm sm:text-base font-semibold text-[#1A1615]">
                            {item.question}
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 text-[#8A6A0A] shrink-0 transition-transform duration-200 ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <p className="mt-3 text-sm text-[#575049] leading-relaxed pr-8">
                            {item.answer}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Executive Footer */}
      <footer className="bg-[#1A1615] text-[#FAF8F5] border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/10">
            <div className="md:col-span-5">
              <BrandLogo name={APP_CONFIG.brandName} variant="light" />
              <p className="mt-4 text-sm text-[#FAF8F5]/75 leading-relaxed max-w-sm">
                {APP_CONFIG.businessType}. Menyajikan informasi terkurasi dan perencanaan rute untuk seluruh ikon wisata Kabupaten Jember.
              </p>
            </div>

            <div className="md:col-span-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-[#D4AF37]">
                Navigasi
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-[#FAF8F5]/80">
                <li>
                  <a href="#destinasi" className="hover:text-[#FAF8F5] transition-colors">
                    Daftar Destinasi
                  </a>
                </li>
                <li>
                  <a href="#galeri" className="hover:text-[#FAF8F5] transition-colors">
                    Galeri Visual
                  </a>
                </li>
                <li>
                  <a href="#testimoni" className="hover:text-[#FAF8F5] transition-colors">
                    Testimoni Pengunjung
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-[#FAF8F5] transition-colors">
                    Pertanyaan Umum
                  </a>
                </li>
              </ul>
            </div>

            <div className="md:col-span-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-[#D4AF37]">
                Kontak &amp; Lokasi
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-[#FAF8F5]/80">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#D4AF37] mt-0.5 shrink-0" />
                  <span>{APP_CONFIG.contact.address}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <a
                    href={`mailto:${APP_CONFIG.contact.email}`}
                    className="hover:text-[#FAF8F5] transition-colors"
                  >
                    {APP_CONFIG.contact.email}
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                  <a
                    href={`https://wa.me/${APP_CONFIG.contact.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-[#FAF8F5] transition-colors tabular-nums"
                  >
                    +{APP_CONFIG.contact.whatsapp}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FAF8F5]/60">
            <p>
              &copy; {new Date().getFullYear()} {APP_CONFIG.brandName}. Seluruh hak cipta dilindungi.
            </p>
            <p>Kabupaten Jember, Jawa Timur</p>
          </div>
        </div>
      </footer>

      {/* Lightbox Modal for Visual Gallery */}
      {activeLightboxItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#1A1615]/90 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={activeLightboxItem.title}
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-[#1A1615] border border-white/15 rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              aria-label="Tutup galeri"
              className="absolute top-4 right-4 z-10 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#1A1615]/80 text-[#FAF8F5] border border-white/20 hover:bg-[#FAF8F5] hover:text-[#1A1615] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-[16/10] w-full bg-black">
              <SmartImage
                src={activeLightboxItem.image}
                fallbackSrc={APP_CONFIG.fallbackImage}
                alt={activeLightboxItem.title}
                loading="eager"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-5 sm:p-6 flex items-center justify-between gap-4 text-[#FAF8F5]">
              <div>
                <p className="text-xs font-medium text-[#D4AF37]">
                  {activeLightboxItem.location}
                </p>
                <h3 className="text-base sm:text-lg font-bold mt-0.5">
                  {activeLightboxItem.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#FAF8F5]/75 mt-1">
                  {activeLightboxItem.caption}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIndex((prev) =>
                      prev === null
                        ? null
                        : (prev - 1 + APP_CONFIG.gallery.length) %
                          APP_CONFIG.gallery.length
                    )
                  }
                  aria-label="Foto sebelumnya"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-white/20 hover:bg-white/10 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setLightboxIndex((prev) =>
                      prev === null ? null : (prev + 1) % APP_CONFIG.gallery.length
                    )
                  }
                  aria-label="Foto berikutnya"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-white/20 hover:bg-white/10 transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Modals & Drawers */}
      <DestinationModal
        destination={activeDestination}
        fallbackImage={APP_CONFIG.fallbackImage}
        isInItinerary={
          activeDestination ? itineraryIds.includes(activeDestination.id) : false
        }
        onClose={() => setActiveDestination(null)}
        onToggleItinerary={toggleItineraryItem}
        onAskAi={handleAskAiForDestination}
      />

      <ItineraryDrawer
        isOpen={isItineraryOpen}
        items={itineraryItems}
        fallbackImage={APP_CONFIG.fallbackImage}
        whatsappNumber={APP_CONFIG.contact.whatsapp}
        onClose={() => setIsItineraryOpen(false)}
        onRemoveItem={toggleItineraryItem}
        onClearAll={() => setItineraryIds([])}
        onPlanWithAi={handlePlanItineraryWithAi}
      />

      <AiConsultantDrawer
        isOpen={isAiOpen}
        onClose={() => setIsAiOpen(false)}
        selectedDestinations={itineraryItems}
        initialPrompt={pendingAiPrompt}
        onConsumeInitialPrompt={() => setPendingAiPrompt(null)}
      />
    </div>
  );
}
