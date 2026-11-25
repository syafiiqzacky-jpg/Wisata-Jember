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
    <div className="min-h-screen flex flex-col bg-[#F6F8FB] text-[#0B1F3A]">
      {/* Top Bar: 3-Zone Navigation Contract */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#D9E2EC]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
          <a
            href="#beranda"
            className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1D4ED8] rounded-md"
          >
            <BrandLogo name={APP_CONFIG.brandName} variant="dark" />
          </a>

          <nav
            aria-label="Navigasi utama"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-[#475569]"
          >
            <a
              href="#destinasi"
              className="hover:text-[#0B1F3A] hover:underline underline-offset-8 decoration-[#1D4ED8] transition-colors whitespace-nowrap shrink-0"
            >
              Destinasi
            </a>
            <a
              href="#galeri"
              className="hover:text-[#0B1F3A] hover:underline underline-offset-8 decoration-[#1D4ED8] transition-colors whitespace-nowrap shrink-0"
            >
              Galeri
            </a>
            <a
              href="#testimoni"
              className="hover:text-[#0B1F3A] hover:underline underline-offset-8 decoration-[#1D4ED8] transition-colors whitespace-nowrap shrink-0"
            >
              Testimoni
            </a>
            <a
              href="#faq"
              className="hover:text-[#0B1F3A] hover:underline underline-offset-8 decoration-[#1D4ED8] transition-colors whitespace-nowrap shrink-0"
            >
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`https://wa.me/${APP_CONFIG.contact.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#1D4ED8] text-white text-xs sm:text-sm font-semibold hover:bg-[#1E40AF] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
            >
              Hubungi Kami
            </a>

            <button
              type="button"
              onClick={() => setIsMobileNavOpen((prev) => !prev)}
              aria-label="Buka menu navigasi"
              aria-expanded={isMobileNavOpen}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#D9E2EC] text-[#0B1F3A] hover:bg-[#E8EEF6] transition-colors"
            >
              {isMobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {isMobileNavOpen && (
          <nav
            aria-label="Navigasi seluler"
            className="md:hidden border-t border-[#D9E2EC] bg-white px-4 py-3 flex flex-col gap-1"
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
                className="px-3 py-2.5 rounded-lg text-sm font-medium text-[#0B1F3A] hover:bg-[#E8EEF6] transition-colors"
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
                <p className="text-xs font-semibold text-[#1D4ED8]">
                  Kabupaten Jember · Jawa Timur
                </p>

                <h1 className="mt-3 text-[clamp(2.25rem,4vw,3.5rem)] font-bold tracking-tight text-[#0B1F3A] leading-[1.1]">
                  {APP_CONFIG.tagline}
                </h1>

                <p className="mt-5 text-base sm:text-[17px] text-[#475569] leading-relaxed max-w-xl">
                  Panduan lengkap {APP_CONFIG.products.length} destinasi wisata di Kabupaten Jember, mulai dari pesisir Tanjung Papuma dan Teluk Meru Betiri hingga kebun teh serta air terjun lereng Argopuro. Lengkap dengan jam buka, informasi tarif masuk, dan daftar rencana kunjungan.
                </p>

                <div className="mt-8 flex flex-wrap items-center gap-3.5">
                  <a
                    href="#destinasi"
                    className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#1D4ED8] text-white text-sm font-semibold hover:bg-[#1E40AF] transition-colors whitespace-nowrap"
                  >
                    Jelajahi Destinasi
                  </a>

                  <button
                    type="button"
                    onClick={() => setIsItineraryOpen(true)}
                    className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-white border border-[#CBD5E1] text-[#0B1F3A] text-sm font-semibold hover:border-[#1D4ED8] hover:text-[#1D4ED8] transition-colors whitespace-nowrap tabular-nums"
                  >
                    <BookmarkCheck className="w-4 h-4 text-[#1D4ED8]" />
                    <span>Rencana Perjalanan ({itineraryItems.length})</span>
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="relative h-72 sm:h-96 lg:h-full min-h-[340px] rounded-xl overflow-hidden bg-[#0B1F3A] border border-[#D9E2EC]">
                  <SmartImage
                    src={APP_CONFIG.heroImage}
                    fallbackSrc={APP_CONFIG.fallbackImage}
                    alt="Panorama matahari terbit pesisir selatan Kabupaten Jember"
                    loading="eager"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0B1F3A]/85 via-[#0B1F3A]/35 to-transparent pointer-events-none" />
                  <div className="absolute bottom-5 left-6 right-6 text-white flex items-end justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium text-[#93C5FD]">Koridor Pesisir Selatan</p>
                      <p className="text-sm sm:text-base font-semibold mt-0.5">
                        Tanjung Papuma &amp; Teluk Love Payangan
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Full-Width 4-Column Factual Summary Strip */}
            <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-[#D9E2EC] bg-white border border-[#D9E2EC] rounded-xl">
              <div className="p-5 sm:p-6">
                <p className="text-xl sm:text-2xl font-bold text-[#0B1F3A] tabular-nums">
                  {APP_CONFIG.products.length} Destinasi
                </p>
                <p className="mt-1 text-xs sm:text-sm text-[#475569]">
                  Pantai, air terjun, pegunungan, dan taman edukasi
                </p>
              </div>
              <div className="p-5 sm:p-6">
                <p className="text-xl sm:text-2xl font-bold text-[#0B1F3A] tabular-nums">
                  4 Koridor Utama
                </p>
                <p className="mt-1 text-xs sm:text-sm text-[#475569]">
                  Pesisir selatan, pusat kota, lereng Argopuro, serta timur Silo
                </p>
              </div>
              <div className="p-5 sm:p-6">
                <p className="text-xl sm:text-2xl font-bold text-[#0B1F3A] tabular-nums">
                  4 Kategori Wisata
                </p>
                <p className="mt-1 text-xs sm:text-sm text-[#475569]">
                  Pantai &amp; teluk, air terjun, pegunungan, hingga taman edukasi
                </p>
              </div>
              <div className="p-5 sm:p-6">
                <p className="text-xl sm:text-2xl font-bold text-[#0B1F3A] tabular-nums">
                  0 – 150 Menit
                </p>
                <p className="mt-1 text-xs sm:text-sm text-[#475569]">
                  Waktu tempuh dari pusat Alun-Alun Jember hingga Meru Betiri
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Destinations Collection Grid */}
        <section id="destinasi" className="py-14 sm:py-16 border-t border-[#D9E2EC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <p className="text-xs font-semibold text-[#1D4ED8]">
                  Direktori Lokasi
                </p>
                <h2 className="mt-1.5 text-2xl sm:text-3xl font-bold tracking-tight text-[#0B1F3A]">
                  Daftar Wisata Kabupaten Jember
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsItineraryOpen(true)}
                className="self-start md:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white border border-[#CBD5E1] text-sm font-semibold text-[#0B1F3A] hover:border-[#1D4ED8] hover:text-[#1D4ED8] transition-colors whitespace-nowrap tabular-nums"
              >
                <BookmarkCheck className="w-4 h-4 text-[#1D4ED8]" />
                <span>Lihat Rencana ({itineraryItems.length})</span>
              </button>
            </div>

            {/* Interactive Category Tabs & Search Control */}
            <div className="mt-8 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div
                role="tablist"
                aria-label="Filter kategori wisata"
                className="flex items-center gap-1.5 p-1 bg-[#E8EEF6] rounded-lg overflow-x-auto"
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
                          ? 'bg-[#1D4ED8] text-white'
                          : 'text-[#475569] hover:text-[#0B1F3A]'
                      }`}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>

              <div className="relative w-full lg:w-80 shrink-0">
                <Search className="w-4 h-4 text-[#64748B] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <label htmlFor="destination-search" className="sr-only">
                  Cari nama wisata atau kecamatan di Jember
                </label>
                <input
                  id="destination-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari destinasi atau kecamatan..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-white border border-[#CBD5E1] text-sm text-[#0B1F3A] placeholder:text-[#64748B] focus:outline-none focus:border-[#1D4ED8]"
                />
              </div>
            </div>

            {filteredDestinations.length === 0 ? (
              <div className="mt-10 p-10 rounded-xl bg-white border border-[#D9E2EC] text-center">
                <p className="text-base font-semibold text-[#0B1F3A]">
                  Tidak ada destinasi yang sesuai dengan pencarian Anda.
                </p>
                <p className="mt-1.5 text-sm text-[#475569]">
                  Coba gunakan kata kunci lain atau tampilkan seluruh kategori wisata.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('Semua');
                    setSearchQuery('');
                  }}
                  className="mt-5 inline-flex items-center px-4 py-2 rounded-lg bg-[#1D4ED8] text-white text-sm font-semibold hover:bg-[#1E40AF] transition-colors"
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
                      className="group bg-white border border-[#D9E2EC] rounded-xl overflow-hidden flex flex-col transition-colors duration-150 hover:border-[#94A3B8] hover:shadow-sm"
                    >
                      <button
                        type="button"
                        onClick={() => setActiveDestination(item)}
                        className="text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
                      >
                        <div className="aspect-[4/3] w-full overflow-hidden bg-[#E8EEF6]">
                          <SmartImage
                            src={item.image}
                            fallbackSrc={APP_CONFIG.fallbackImage}
                            alt={`${item.name} di Kecamatan ${item.district}, Kabupaten Jember`}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                          />
                        </div>
                      </button>

                      <div className="p-6 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 text-xs text-[#475569]">
                            <span>{item.category}</span>
                            <span aria-hidden="true">·</span>
                            <span>Kec. {item.district}</span>
                          </div>

                          <h3 className="mt-2 text-lg font-bold tracking-tight text-[#0B1F3A]">
                            <button
                              type="button"
                              onClick={() => setActiveDestination(item)}
                              className="text-left hover:text-[#1D4ED8] transition-colors"
                            >
                              {item.name}
                            </button>
                          </h3>

                          <p className="mt-2.5 text-sm text-[#475569] leading-relaxed">
                            {item.shortDescription}
                          </p>
                        </div>

                        <div className="mt-5 pt-4 border-t border-[#E8EEF6] flex items-center justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => setActiveDestination(item)}
                            className="text-xs font-semibold text-[#1D4ED8] hover:text-[#1E40AF] transition-colors whitespace-nowrap"
                          >
                            Lihat Detail
                          </button>

                          <button
                            type="button"
                            onClick={() => toggleItineraryItem(item.id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors whitespace-nowrap ${
                              isAdded
                                ? 'bg-[#EFF6FF] text-[#1E3A8A] border border-[#93C5FD]'
                                : 'bg-[#0B1F3A] text-white hover:bg-[#16335B]'
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-[#1D4ED8]" />
                                <span>Tersimpan</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5 text-[#93C5FD]" />
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
        <section id="galeri" className="py-14 sm:py-16 bg-[#0B1F3A] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <p className="text-xs font-semibold text-[#93C5FD]">
                  Galeri Foto Lapangan
                </p>
                <h2 className="mt-1.5 text-2xl sm:text-3xl font-bold tracking-tight">
                  Lanskap Pesisir hingga Dataran Tinggi
                </h2>
              </div>
              <p className="text-sm text-white/75 max-w-md leading-relaxed">
                Klik foto untuk memperbesar dokumentasi lokasi dari pesisir Meru Betiri, Ambulu, Sumberjambe, hingga lereng Argopuro.
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
                    className={`${spanClass} ${heightClass} group relative rounded-xl overflow-hidden bg-[#122D52] border border-white/10 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#60A5FA]`}
                  >
                    <SmartImage
                      src={item.image}
                      fallbackSrc={APP_CONFIG.fallbackImage}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0B1F3A]/90 via-[#0B1F3A]/45 to-transparent pointer-events-none" />
                    <div className="absolute bottom-4 left-5 right-5">
                      <p className="text-xs font-medium text-[#93C5FD]">{item.location}</p>
                      <h3 className="text-base font-semibold text-white mt-0.5">
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
        <section id="testimoni" className="py-14 sm:py-16 border-b border-[#D9E2EC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold text-[#1D4ED8]">
                Catatan Pengunjung
              </p>
              <h2 className="mt-1.5 text-2xl sm:text-3xl font-bold tracking-tight text-[#0B1F3A]">
                Pengalaman Berwisata di Jember
              </h2>
            </div>

            <div className="mt-9 grid grid-cols-1 md:grid-cols-3 gap-6">
              {APP_CONFIG.testimonials.map((t) => (
                <figure
                  key={t.id}
                  className="bg-white border border-[#D9E2EC] rounded-xl p-7 flex flex-col justify-between gap-6"
                >
                  <div>
                    <p className="text-xs font-semibold text-[#1D4ED8]">{t.destination}</p>
                    <blockquote className="mt-3 text-sm sm:text-[15px] leading-relaxed text-[#334155]">
                      “{t.quote}”
                    </blockquote>
                  </div>

                  <figcaption className="pt-4 border-t border-[#E8EEF6]">
                    <p className="text-sm font-bold text-[#0B1F3A]">{t.name}</p>
                    <p className="text-xs text-[#475569] mt-0.5">{t.role}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ & Direct Contact Section */}
        <section id="faq" className="py-14 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
              <div className="lg:col-span-5 flex flex-col justify-between gap-6">
                <div>
                  <p className="text-xs font-semibold text-[#1D4ED8]">
                    Informasi Praktis
                  </p>
                  <h2 className="mt-1.5 text-2xl sm:text-3xl font-bold tracking-tight text-[#0B1F3A]">
                    Pertanyaan Umum Wisata Jember
                  </h2>
                  <p className="mt-3 text-sm sm:text-[15px] text-[#475569] leading-relaxed">
                    Panduan ringkas mengenai musim kunjungan terbaik, penggabungan rute satu hari, dan rekomendasi ramah keluarga.
                  </p>
                </div>

                <div className="p-6 rounded-xl bg-white border border-[#D9E2EC]">
                  <h3 className="text-base font-bold text-[#0B1F3A]">
                    Butuh Jadwal Khusus Rombongan atau Keluarga?
                  </h3>
                  <p className="mt-2 text-sm text-[#475569] leading-relaxed">
                    Diskusikan preferensi destinasi, jadwal rombongan, dan kebutuhan transportasi Anda langsung bersama tim koordinator Jelajah Jember.
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <a
                      href={`https://wa.me/${APP_CONFIG.contact.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#1D4ED8] text-white text-sm font-semibold hover:bg-[#1E40AF] transition-colors whitespace-nowrap"
                    >
                      <Phone className="w-4 h-4" />
                      <span>WhatsApp {APP_CONFIG.contact.phoneDisplay}</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="divide-y divide-[#D9E2EC] border border-[#D9E2EC] bg-white rounded-xl px-6">
                  {APP_CONFIG.faq.map((item, idx) => {
                    const isOpen = openFaqIndex === idx;
                    return (
                      <div key={item.question} className="py-5">
                        <button
                          type="button"
                          aria-expanded={isOpen}
                          onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                          className="w-full flex items-center justify-between gap-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8] rounded-md"
                        >
                          <span className="text-sm sm:text-base font-semibold text-[#0B1F3A]">
                            {item.question}
                          </span>
                          <ChevronDown
                            className={`w-5 h-5 text-[#1D4ED8] shrink-0 transition-transform duration-200 ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <p className="mt-3 text-sm text-[#475569] leading-relaxed pr-8">
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

      {/* Footer */}
      <footer className="bg-[#0B1F3A] text-white border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-white/10">
            <div className="md:col-span-5">
              <BrandLogo name={APP_CONFIG.brandName} variant="light" />
              <p className="mt-4 text-sm text-white/75 leading-relaxed max-w-sm">
                {APP_CONFIG.businessType}. Menyajikan informasi terkurasi dan panduan rute untuk seluruh destinasi wisata Kabupaten Jember.
              </p>
            </div>

            <div className="md:col-span-3">
              <h3 className="text-xs font-semibold text-[#93C5FD]">
                Navigasi
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm text-white/80">
                <li>
                  <a href="#destinasi" className="hover:text-white transition-colors">
                    Daftar Destinasi
                  </a>
                </li>
                <li>
                  <a href="#galeri" className="hover:text-white transition-colors">
                    Galeri Foto
                  </a>
                </li>
                <li>
                  <a href="#testimoni" className="hover:text-white transition-colors">
                    Catatan Pengunjung
                  </a>
                </li>
                <li>
                  <a href="#faq" className="hover:text-white transition-colors">
                    Pertanyaan Umum
                  </a>
                </li>
              </ul>
            </div>

            <div className="md:col-span-4">
              <h3 className="text-xs font-semibold text-[#93C5FD]">
                Kontak &amp; Lokasi
              </h3>
              <ul className="mt-4 space-y-3 text-sm text-white/80">
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-[#93C5FD] mt-0.5 shrink-0" />
                  <span>{APP_CONFIG.contact.address}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#93C5FD] shrink-0" />
                  <a
                    href={`mailto:${APP_CONFIG.contact.email}`}
                    className="hover:text-white transition-colors"
                  >
                    {APP_CONFIG.contact.email}
                  </a>
                </li>
                <li className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#93C5FD] shrink-0" />
                  <a
                    href={`https://wa.me/${APP_CONFIG.contact.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors tabular-nums"
                  >
                    {APP_CONFIG.contact.phoneDisplay}
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/60">
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B1F3A]/90 p-4 sm:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={activeLightboxItem.title}
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="relative w-full max-w-4xl bg-[#0B1F3A] border border-white/15 rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setLightboxIndex(null)}
              aria-label="Tutup galeri"
              className="absolute top-4 right-4 z-10 inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#0B1F3A]/85 text-white border border-white/20 hover:bg-white hover:text-[#0B1F3A] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-[16/10] w-full bg-[#061224]">
              <SmartImage
                src={activeLightboxItem.image}
                fallbackSrc={APP_CONFIG.fallbackImage}
                alt={activeLightboxItem.title}
                loading="eager"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-5 sm:p-6 flex items-center justify-between gap-4 text-white">
              <div>
                <p className="text-xs font-medium text-[#93C5FD]">
                  {activeLightboxItem.location}
                </p>
                <h3 className="text-base sm:text-lg font-bold mt-0.5">
                  {activeLightboxItem.title}
                </h3>
                <p className="text-xs sm:text-sm text-white/75 mt-1">
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
        whatsappNumber={APP_CONFIG.contact.whatsapp}
        isInItinerary={
          activeDestination ? itineraryIds.includes(activeDestination.id) : false
        }
        onClose={() => setActiveDestination(null)}
        onToggleItinerary={toggleItineraryItem}
      />

      <ItineraryDrawer
        isOpen={isItineraryOpen}
        items={itineraryItems}
        fallbackImage={APP_CONFIG.fallbackImage}
        whatsappNumber={APP_CONFIG.contact.whatsapp}
        onClose={() => setIsItineraryOpen(false)}
        onRemoveItem={toggleItineraryItem}
        onClearAll={() => setItineraryIds([])}
      />
    </div>
  );
}
