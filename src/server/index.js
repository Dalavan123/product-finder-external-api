import express from 'express';
import cors from 'cors';
import { generateImprovedText } from './generate.js';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/generate', async (req, res) => {
  try {
    const { title, description, tone } = req.body || {};
    const text = await generateImprovedText({ title, description, tone });
    res.json({ text });
  } catch (e) {
    res.status(e.status || 500).json({ error: e.message || 'Serverfel' });
  }
});

app.listen(5174, () => console.log('API på http://localhost:5174'));
