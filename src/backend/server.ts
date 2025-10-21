import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// import type { Message } from './services/api';
import { getAIResponse } from './services/api';
import mockDb from './mockDb';
import type { Request, Response } from 'express';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3001;

app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { personality, history } = req.body;

    const response = await getAIResponse(personality, history);

    res.status(200).json({
      success: true,
      message: 'Message recieved and responded',
      data: response,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Error while trying to get properties',
      error: error,
    });
  }
});

// Chats CRUD endpoints using mockDb
app.get('/api/pastChats', async (_req: Request, res: Response) => {
  try {
    const chats = await mockDb.getAllChats();
    res.status(200).json({ success: true, data: chats });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: String(err) });
  }
});

app.get('/api/pastChats/:id', async (req: Request, res: Response) => {
  try {
    const chat = await mockDb.getChatById(req.params.id);
    if (!chat)
      return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, data: chat });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: String(err) });
  }
});

app.post('/api/saveChat', async (req: Request, res: Response) => {
  try {
    const payload = req.body;
    // Minimal validation
    if (!payload || !payload.id) {
      return res
        .status(400)
        .json({ success: false, message: 'Invalid payload' });
    }
    const saved = await mockDb.saveChat(payload);
    res.status(201).json({ success: true, data: saved });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: String(err) });
  }
});

app.put('/api/pastChats/:id', async (req: Request, res: Response) => {
  try {
    const updated = await mockDb.updateChat(req.params.id, req.body || {});
    if (!updated)
      return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: String(err) });
  }
});

app.delete('/api/pastChats/:id', async (req: Request, res: Response) => {
  try {
    const ok = await mockDb.deleteChat(req.params.id);
    if (!ok)
      return res.status(404).json({ success: false, message: 'Not found' });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: String(err) });
  }
});

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

app.use((err: Error, _req: Request, res: Response) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: 'Server error',
    error: err.message,
  });
});

const startup = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`App listening on port: ${PORT}`);
    });
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

startup();
