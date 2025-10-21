import { useEffect, useMemo, useState } from 'react';
import Chat from './components/Chat';
import Sidebar from './components/Sidebar';
import './styles/styles.scss';

function App() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<any[]>([]);
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

  return (
    <div className='app-split'>
      <Sidebar
        chats={chats}
        selectedChatId={selectedChatId}
        onSelect={setSelectedChatId}
      />
      <main className='main-chat'>
        {loading ? (
          <div style={{ padding: 20 }}>Loading chats...</div>
        ) : error ? (
          <div style={{ padding: 20, color: 'red' }}>Error: {error}</div>
        ) : (
          <Chat
            initialHistory={selectedHistory}
            selectedChatId={selectedChatId}
          />
        )}
      </main>
    </div>
  );
}

export default App;
