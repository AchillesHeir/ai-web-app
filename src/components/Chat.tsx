import React, { useState, useEffect, useRef } from 'react';
import type { Message as MessageType } from '../backend/services/api';
import Message from './Message';
import PersonalitySelector from './PersonalitySelector';

interface Personality {
  name: string;
  image: string;
}

const personalities: Personality[] = [
  {
    name: 'Vanilla Gemini',
    image:
      'https://res.cloudinary.com/dnawvnj8p/image/upload/v1761004254/ai_tvbcyh.png',
  },
  {
    name: 'Duchess Delphinia',
    image:
      'https://res.cloudinary.com/dnawvnj8p/image/upload/v1761003762/queen_kcmemb.png',
  },
  {
    name: 'Cal',
    image:
      'https://res.cloudinary.com/dnawvnj8p/image/upload/v1761003313/surfer_dfuzbs.png',
  },
  {
    name: 'Tiffany',
    image:
      'https://res.cloudinary.com/dnawvnj8p/image/upload/v1761004305/optimist_vvrcsp.png',
  },
  {
    name: 'R2D3',
    image:
      'https://res.cloudinary.com/dnawvnj8p/image/upload/v1761004233/robot_wapatf.png',
  },
  {
    name: 'Stan the Grey',
    image:
      'https://res.cloudinary.com/dnawvnj8p/image/upload/v1761004323/wizard_nrxkdx.png',
  },
];

interface ChatProps {
  initialHistory?: MessageType[];
  selectedChatId?: string | null;
  onHistoryChange?: (h: MessageType[]) => void;
}

const Chat: React.FC<ChatProps> = ({
  initialHistory = [],
  onHistoryChange,
}) => {
  const [history, setHistory] = useState<MessageType[]>(initialHistory);
  const [input, setInput] = useState('');
  const [personality, setPersonality] = useState(personalities[0].name);
  const [isLoading, setIsLoading] = useState(false);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    // when initialHistory prop changes, load it
    setHistory(initialHistory);
    onHistoryChange && onHistoryChange(initialHistory);
  }, [initialHistory]);

  const handleSend = async () => {
    if (input.trim() === '') return;
    try {
      const userMessage: MessageType = { role: 'user', content: input };
      const newHistory = [...history, userMessage];
      setHistory(newHistory);
      setInput('');
      setIsLoading(true);

      const aiResponse = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personality,
          history: newHistory,
        }),
      });
      const data = await aiResponse.json();

      const assistantMessage: MessageType = {
        role: 'assistant',
        content: data.data,
      };
      setHistory([...newHistory, assistantMessage]);
      onHistoryChange && onHistoryChange([...newHistory, assistantMessage]);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      return;
    }
  };

  return (
    <div className='app-container'>
      <div className='controls'>
        <h1>Choose a Friend: </h1>
        <PersonalitySelector
          personalities={personalities}
          selectedPersonality={personality}
          onPersonalityChange={setPersonality}
        />
      </div>
      <div className='chat-window' ref={chatWindowRef}>
        {history.map((message, index) => (
          <Message key={index} message={message} />
        ))}
        {isLoading && <div className='message assistant'>Thinking...</div>}
      </div>
      <div className='input-area'>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder='Type your message...'
          disabled={isLoading}
        />
        <button className='send-btn' onClick={handleSend} disabled={isLoading}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
