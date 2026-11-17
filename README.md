# Jelajah Jember — Kurator Destinasi Wisata Kabupaten Jember

Portal direktori wisata Kabupaten Jember yang menyajikan 21 destinasi unggulan dari pesisir Samudra Hindia hingga lereng Pegunungan Argopuro dan Raung, dilengkapi penyusun rencana perjalanan interaktif serta konsultasi rute langsung melalui WhatsApp.

## Arsitektur Proyek

- `appConfig.js` — Sumber konfigurasi terpusat (tema warna, kontak, profil destinasi, galeri, testimoni, dan FAQ) yang dibaca secara dinamis oleh Frontend dan Backend.
- `server.ts` — Server Express full-stack terintegrasi dengan Vite middleware (development) dan static asset serving (production).
- `app.js` — Entry point ES Module murni untuk deployment Node.js Selector di cPanel Shared Hosting.
- `src/` — Aplikasi frontend React + TypeScript + Tailwind CSS v4 dengan font `Plus Jakarta Sans`.

## Daftar Destinasi Tersedia

1. Pantai Papuma (Wuluhan)
2. Pantai Watu Ulo (Ambulu)
3. Teluk Love (Ambulu)
4. Pantai Payangan & Bukit Samboja (Ambulu)
5. Pantai Cemara (Puger)
6. Pantai Bandealit (Tempurejo)
7. Pantai Nanggelan (Tempurejo)
8. Air Terjun Tancak Panti (Panti)
9. Air Terjun Tancak Tulis (Tanggul)
10. Air Terjun 7 Bidadari (Sumberjambe)
11. Air Terjun Antrokan (Tanggul)
12. Kebun Teh Gunung Gambir (Sumberbaru)
13. Rembangan (Arjasa)
14. Wisata Gunung Pasang (Panti)
15. Rest Area & Kafe Puncak Gumitir (Silo)
16. Taman Botani (Sukorambi)
17. Jember Mini Zoo (Kaliwates)
18. Taman Galaxy (Tempurejo)
19. Pemandian Patemon (Tanggul)
20. Alun-Alun Kabupaten Jember (Kaliwates)
21. Situs Megalitikum Calok Arjasa (Arjasa)

## Pengujian Lokal

1. Pastikan Node.js versi 20+ telah terpasang.
2. Instal seluruh dependensi:
   ```bash
   npm install
   ```
3. Jalankan mode pengembangan pada port `3000`:
   ```bash
   npm run dev
   ```
4. Bangun bundle produksi untuk pengujian:
   ```bash
   npm run build
   ```

## Panduan Deployment cPanel (Satelitweb Node.js Selector)

1. Jalankan `npm run build` di lokal untuk menghasilkan folder `dist/` yang berisi aset frontend dan gambar terkompresi.
2. Unggah seluruh proyek (kecuali `node_modules/`) termasuk folder `dist/`, `appConfig.js`, `app.js`, dan `package.json` ke direktori aplikasi pada cPanel File Manager.
3. Buka menu **Setup Node.js App** di cPanel:
   - **Node.js version**: pilih versi 20.x atau 22.x.
   - **Application mode**: `Production`.
   - **Application root**: arahkan ke folder unggahan Anda.
   - **Application startup file**: isi dengan `app.js`.
4. Klik **Run NPM Install** pada cPanel, lalu klik **Restart**.
5. Seluruh rute React SPA dan endpoint API otomatis berjalan melalui port dinamis `process.env.PORT` dari cPanel.
