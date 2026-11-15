import 'dotenv/config';
import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { APP_CONFIG } from './appConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

function buildSystemInstruction(selectedIds: string[] = []): string {
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
      ? `\nCatatan Pengunjung: Saat ini pengunjung telah menandai destinasi berikut ke dalam Rencana Perjalanan mereka: ${selectedNames.join(', ')}. Prioritaskan penjadwalan rute yang logis berdasarkan posisi geografis kecamatan di Kabupaten Jember.`
      : '';

  return `Anda adalah konsultan wisata senior resmi dari "${APP_CONFIG.brandName}" (${APP_CONFIG.businessType}).
Karakter Anda ramah, sopan, hangat, terstruktur, dan sangat memahami geografi, kuliner khas, serta kondisi jalan di Kabupaten Jember, Jawa Timur.

Tugas utama Anda:
- Membantu wisatawan merencanakan kunjungan ke destinasi wisata terbaik di Kabupaten Jember.
- Memberikan saran rute harian yang efisien berdasarkan kedekatan koridor wilayah:
  * Koridor Selatan & Meru Betiri (Ambulu – Wuluhan – Puger – Tempurejo): Teluk Love, Pantai Payangan & Bukit Samboja, Pantai Watu Ulo, Pantai Papuma, Pantai Cemara, Taman Galaxy, Pantai Nanggelan, serta Pantai Bandealit.
  * Koridor Kota & Utara (Kaliwates – Sukorambi – Arjasa): Alun-Alun Kabupaten Jember, Jember Mini Zoo, Taman Botani Sukorambi, Situs Megalitikum Calok Arjasa, dan Puncak Rembangan.
  * Koridor Barat & Lereng Argopuro (Panti – Tanggul – Sumberbaru): Wisata Gunung Pasang, Air Terjun Tancak Panti, Pemandian Patemon, Air Terjun Antrokan, Air Terjun Tancak Tulis, dan Kebun Teh Gunung Gambir.
  * Koridor Timur & Lereng Raung (Sumberjambe – Silo): Air Terjun 7 Bidadari serta Rest Area & Kafe Puncak Gumitir.
- Menyertakan estimasi jam kunjungan terbaik, perkiraan biaya tiket masuk berdasarkan data resmi di bawah, dan tips perlengkapan praktis.
- Selalu gunakan Bahasa Indonesia yang rapi, elegan, dan mudah dibaca (gunakan poin bernomor atau bullet singkat, hindari paragraf terlalu panjang).
- Jika pengguna menanyakan destinasi di luar daftar resmi, tetap berikan informasi yang jujur namun arahkan kembali ke destinasi unggulan Jember yang tersedia.
- Jika pengguna membutuhkan reservasi transportasi, pemandu lokal, atau paket rombongan, arahkan dengan sopan ke layanan WhatsApp (${APP_CONFIG.contact.whatsapp}) atau email (${APP_CONFIG.contact.email}) yang beralamat di ${APP_CONFIG.contact.address}.

Daftar Lengkap Destinasi Resmi ${APP_CONFIG.brandName}:
${destinationCatalog}${itineraryNote}`;
}

interface ChatMessageInput {
  role: 'user' | 'assistant';
  content: string;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      brand: APP_CONFIG.brandName,
      destinationsCount: APP_CONFIG.products.length,
    });
  });

  app.get('/api/config', (_req: Request, res: Response) => {
    res.json(APP_CONFIG);
  });

  app.post('/api/recommendation', async (req: Request, res: Response) => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      res.status(503).json({
        error:
          'Layanan Konsultan AI belum terkonfigurasi. Silakan pastikan GEMINI_API_KEY telah diatur di Settings > Secrets.',
      });
      return;
    }

    const { prompt, messages, selectedIds } = req.body as {
      prompt?: string;
      messages?: ChatMessageInput[];
      selectedIds?: string[];
    };

    const normalizedMessages: { role: 'user' | 'model'; parts: { text: string }[] }[] = [];

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
      res.status(400).json({
        error: 'Pertanyaan atau preferensi perjalanan tidak boleh kosong.',
      });
      return;
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
          systemInstruction: buildSystemInstruction(
            Array.isArray(selectedIds) ? selectedIds : []
          ),
        },
      });

      const reply = response.text?.trim();
      if (!reply) {
        res.status(502).json({
          error: 'Konsultan AI tidak mengembalikan jawaban. Silakan coba ulangi pertanyaan Anda.',
        });
        return;
      }

      res.json({ reply });
    } catch (error: unknown) {
      const errMsg = error instanceof Error ? error.message : String(error);
      console.error('Gemini API error:', errMsg);

      if (errMsg.includes('PERMISSION_DENIED') || errMsg.includes('API_KEY_INVALID')) {
        res.status(403).json({
          error:
            'Kunci API Gemini tidak valid atau tidak memiliki izin. Silakan periksa kembali Settings > Secrets.',
        });
        return;
      }

      if (errMsg.includes('RESOURCE_EXHAUSTED') || errMsg.includes('429')) {
        res.status(429).json({
          error:
            'Permintaan sedang padat dan batas kuota tercapai sementara. Silakan tunggu beberapa saat lalu coba lagi.',
        });
        return;
      }

      res.status(500).json({
        error: 'Terjadi gangguan sementara saat menghubungi Konsultan AI. Silakan coba kembali.',
      });
    }
  });

  app.use('/api/*', (_req: Request, res: Response) => {
    res.status(404).json({ error: 'Endpoint API tidak ditemukan.' });
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (_req: Request, res: Response) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`${APP_CONFIG.brandName} server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
