import { promises as fs } from 'fs';
import path from 'path';
import type { Message } from './services/api';

const dataDir = path.resolve(__dirname, 'data');
const chatsFile = path.join(dataDir, 'chats.json');

export interface ChatRecord {
  id: string;
  title: string;
  messages: Message[];
  createdAt?: string;
}

async function ensureDataFile() {
  try {
    await fs.access(chatsFile);
  } catch (err) {
    // create directory and file if they don't exist
    await fs.mkdir(dataDir, { recursive: true });
    await fs.writeFile(chatsFile, '[]', 'utf8');
  }
}

async function readAll(): Promise<ChatRecord[]> {
  await ensureDataFile();
  const raw = await fs.readFile(chatsFile, 'utf8');
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Failed to parse chats.json:', err);
    return [];
  }
}

async function writeAll(chats: ChatRecord[]) {
  await ensureDataFile();
  await fs.writeFile(chatsFile, JSON.stringify(chats, null, 2), 'utf8');
}

export async function getAllChats(): Promise<ChatRecord[]> {
  return readAll();
}

export async function getChatById(id: string): Promise<ChatRecord | null> {
  const chats = await readAll();
  return chats.find((c) => c.id === id) || null;
}

export async function saveChat(chat: ChatRecord): Promise<ChatRecord> {
  const chats = await readAll();
  chats.push({ ...chat, createdAt: new Date().toISOString() });
  await writeAll(chats);
  return chat;
}

export async function updateChat(id: string, patch: Partial<ChatRecord>): Promise<ChatRecord | null> {
  const chats = await readAll();
  const idx = chats.findIndex((c) => c.id === id);
  if (idx === -1) return null;
  const updated = { ...chats[idx], ...patch };
  chats[idx] = updated;
  await writeAll(chats);
  return updated;
}

export async function deleteChat(id: string): Promise<boolean> {
  const chats = await readAll();
  const filtered = chats.filter((c) => c.id !== id);
  if (filtered.length === chats.length) return false;
  await writeAll(filtered);
  return true;
}

export default {
  getAllChats,
  getChatById,
  saveChat,
  updateChat,
  deleteChat,
};
