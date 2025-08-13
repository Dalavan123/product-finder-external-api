import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { generateImprovedText } from './generate.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/generate', async (req, res) => {
  try {
    const { title, description, tone } = req.body || {};
    const text = await generateImprovedText({ title, description, tone });
    res.json({ text });
  } catch (e) {
    console.error('POST /api/generate error:', e);
    res.status(e.status || 500).json({ error: e.message || 'Serverfel' });
  }
});

const PORT = Number(process.env.PORT) || 5174;

// Hjälp att se oväntade fel
process.on('unhandledRejection', r => {
  console.error('UNHANDLED REJECTION:', r);
});
process.on('uncaughtException', e => {
  console.error('UNCAUGHT EXCEPTION:', e);
});

app.listen(PORT, () => {
  console.log(`API på http://localhost:${PORT}`);
});
