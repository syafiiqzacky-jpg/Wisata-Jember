import 'dotenv/config';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { APP_CONFIG } from './appConfig.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = Number(process.env.PORT) || 3000;

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
