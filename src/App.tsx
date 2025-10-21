import { useEffect, useMemo, useState } from 'react';
import type { Message as MessageType } from './backend/services/api';
import Chat from './components/Chat';
import Sidebar from './components/Sidebar';
import './styles/styles.scss';

function App() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<any[]>([]);
  const [currentHistory, setCurrentHistory] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch('http://localhost:3001/api/pastChats');
        if (!res.ok) throw new Error(`Status ${res.status}`);
        const body = await res.json();
        if (mounted) setChats(body.data || []);
      } catch (err: any) {
        console.error('Failed to load chats', err);
        if (mounted) setError('Boopity-bop: ' + String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const selectedHistory = useMemo(() => {
    const found = chats.find((c) => c.id === selectedChatId);
    return found ? found.messages : [];
  }, [chats, selectedChatId]);

  // Save currentHistory to server: if id exists -> PUT, else POST
  const saveHistory = async (id?: string | null) => {
    if (!currentHistory || currentHistory.length === 0) return null;
    const firstSnippet = currentHistory[0]?.content || '';
    const title = firstSnippet ? firstSnippet.slice(0, 60) : `Chat ${Date.now()}`;
    if (id) {
      // update existing
      try {
        const res = await fetch(`http://localhost:3001/api/pastChats/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: currentHistory, title }),
        });
        if (!res.ok) throw new Error('update failed');
        await reloadChats();
        return id;
      } catch (err) {
        console.error('update failed', err);
        return null;
      }
    } else {
      // create new
      const newId = String(Date.now());
      const payload = { id: newId, title, messages: currentHistory };
      try {
        const res = await fetch('http://localhost:3001/api/saveChat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('create failed');
        await reloadChats();
        return newId;
      } catch (err) {
        console.error('create failed', err);
        return null;
      }
    }
  };

  const reloadChats = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/pastChats');
      if (!res.ok) throw new Error('load failed');
      const body = await res.json();
      setChats(body.data || []);
    } catch (err) {
      console.error('reload failed', err);
    }
  };

  const handleNewClick = async () => {
    // save current to existing selected id or create new
    if (selectedChatId) {
      await saveHistory(selectedChatId);
    } else {
      await saveHistory(null);
    }
    // clear UI
    setCurrentHistory([]);
    setSelectedChatId(null);
  };

  const handleSelect = async (id: string | null) => {
    if (id === selectedChatId) return;
    // save current first
    if (currentHistory && currentHistory.length > 0) {
      if (selectedChatId) await saveHistory(selectedChatId);
      else await saveHistory(null);
    }
    // load target chat
    if (id) {
      const found = chats.find((c) => c.id === id);
      setCurrentHistory(found ? found.messages : []);
      setSelectedChatId(id);
    } else {
      // new blank
      setCurrentHistory([]);
      setSelectedChatId(null);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/pastChats/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('delete failed');
      // if deleting currently selected, clear UI
      if (id === selectedChatId) {
        setCurrentHistory([]);
        setSelectedChatId(null);
      }
      await reloadChats();
    } catch (err) {
      console.error('delete failed', err);
    }
  };

  const handleEditTitle = async (id: string, title: string) => {
    try {
      const res = await fetch(`http://localhost:3001/api/pastChats/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error('edit title failed');
      await reloadChats();
    } catch (err) {
      console.error('edit title failed', err);
    }
  };

  return (
    <div className='app-split'>
      <Sidebar
        chats={chats}
        selectedChatId={selectedChatId}
        onSelect={handleSelect}
        onNew={handleNewClick}
        onDelete={handleDelete}
        onEditTitle={handleEditTitle}
      />
      <main className='main-chat'>
        {loading ? (
          <div style={{ padding: 20 }}>Loading chats...</div>
        ) : error ? (
          <div style={{ padding: 20, color: 'red' }}>Error: {error}</div>
        ) : (
          <Chat
            initialHistory={currentHistory.length ? currentHistory : selectedHistory}
            selectedChatId={selectedChatId}
            onHistoryChange={(h: MessageType[]) => setCurrentHistory(h)}
          />
        )}
      </main>
    </div>
  );
}

export default App;
