import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// import type { Message } from './services/api';
import { getAIResponse } from './services/api';
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
