import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getRandomUserData } from './core.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());


app.get('/api/user', async (req, res) => {
  try {
    const data = await getRandomUserData();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Something went wrong' });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
