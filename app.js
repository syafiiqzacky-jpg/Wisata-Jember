import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { APP_CONFIG } from './appConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT) || 3000;

function buildSystemInstruction(selectedIds = []) {
  const destinationCatalog = APP_CONFIG.products
    .map(
      (item, index) =>
        `${index + 1}. ${item.name} (${item.category} — Kec. ${item.district})
   - Jam Operasional: ${item.openHours}
   - Waktu Terbaik: ${item.bestTime}
   - Jarak dari Alun-Alun Jember: ${item.travelTimeFromCity}
   - Deskripsi & Info Harga: ${item.description}
   - Daya Tarik: ${item.highlights.join(', ')}`
    )
    .join('\n\n');

  const selectedNames = APP_CONFIG.products
    .filter((p) => selectedIds.includes(p.id))
    .map((p) => p.name);

  const itineraryNote =
    selectedNames.length > 0
      ? `\nCatatan Pengunjung: Saat ini pengunjung telah menandai destinasi berikut ke dalam Rencana Perjalanan mereka: ${selectedNames.join(', ')}.`
      : '';

  return `Anda adalah konsultan wisata senior resmi dari "${APP_CONFIG.brandName}" (${APP_CONFIG.businessType}).
Karakter Anda ramah, sopan, hangat, terstruktur, dan memahami rute wisata Kabupaten Jember, Jawa Timur.
Gunakan Bahasa Indonesia yang rapi dan mudah dibaca.
Prioritaskan penjadwalan berdasarkan kedekatan koridor wilayah:
- Koridor Selatan & Meru Betiri (Ambulu – Wuluhan – Puger – Tempurejo): Teluk Love, Pantai Payangan & Bukit Samboja, Pantai Watu Ulo, Pantai Papuma, Pantai Cemara, Taman Galaxy, Pantai Nanggelan, Pantai Bandealit.
- Koridor Kota & Utara (Kaliwates – Sukorambi – Arjasa): Alun-Alun Kabupaten Jember, Jember Mini Zoo, Taman Botani, Situs Calok Arjasa, Rembangan.
- Koridor Barat & Argopuro (Panti – Tanggul – Sumberbaru): Gunung Pasang, Air Terjun Tancak Panti, Pemandian Patemon, Air Terjun Antrokan, Air Terjun Tancak Tulis, Kebun Teh Gunung Gambir.
- Koridor Timur & Raung (Sumberjambe – Silo): Air Terjun 7 Bidadari dan Rest Area Puncak Gumitir.
Jika pengguna memerlukan reservasi atau pemandu lokal, arahkan ke WhatsApp (${APP_CONFIG.contact.whatsapp}) atau email (${APP_CONFIG.contact.email}) di ${APP_CONFIG.contact.address}.

Daftar Lengkap Destinasi Resmi ${APP_CONFIG.brandName}:
${destinationCatalog}${itineraryNote}`;
}

const app = express();
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    brand: APP_CONFIG.brandName,
    destinationsCount: APP_CONFIG.products.length,
  });
});

app.get('/api/config', (_req, res) => {
  res.json(APP_CONFIG);
});

app.post('/api/recommendation', async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return res.status(503).json({
      error: 'GEMINI_API_KEY belum terkonfigurasi pada environment server.',
    });
  }

  const { prompt, messages, selectedIds } = req.body || {};
  const normalizedMessages = [];

  if (Array.isArray(messages) && messages.length > 0) {
    for (const msg of messages) {
      if (msg && typeof msg.content === 'string' && msg.content.trim()) {
        normalizedMessages.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content.trim() }],
        });
      }
    }
  } else if (typeof prompt === 'string' && prompt.trim()) {
    normalizedMessages.push({
      role: 'user',
      parts: [{ text: prompt.trim() }],
    });
  }

  if (normalizedMessages.length === 0) {
    return res.status(400).json({
      error: 'Pertanyaan atau preferensi perjalanan tidak boleh kosong.',
    });
  }

  try {
    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: normalizedMessages,
      config: {
        systemInstruction: buildSystemInstruction(Array.isArray(selectedIds) ? selectedIds : []),
      },
    });

    const reply = response.text?.trim();
    if (!reply) {
      return res.status(502).json({
        error: 'Konsultan AI tidak mengembalikan jawaban. Silakan coba lagi.',
      });
    }

    return res.json({ reply });
  } catch (error) {
    console.error('Gemini API error:', error);
    return res.status(500).json({
      error: 'Terjadi gangguan sementara saat menghubungi Konsultan AI.',
    });
  }
});

app.use('/api/*', (_req, res) => {
  res.status(404).json({ error: 'Endpoint API tidak ditemukan.' });
});

const primaryDist = path.join(__dirname, 'dist');
const clientDist = path.join(__dirname, 'client', 'dist');
const staticDir = fs.existsSync(primaryDist) ? primaryDist : clientDist;

if (fs.existsSync(staticDir)) {
  app.use(express.static(staticDir));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(staticDir, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`${APP_CONFIG.brandName} production server listening on port ${PORT}`);
});
