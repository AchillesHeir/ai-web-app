import React, { useState, useEffect, useRef } from 'react';
import type { Message as MessageType } from '../backend/services/api';
import Message from './Message';
import PersonalitySelector from './PersonalitySelector';

const personalities = [
  'Duchess Delphinia',
  'Cal',
  'Tiffany',
  'R2D3',
  'Stan the Grey',
];

const Chat: React.FC = () => {
  const [history, setHistory] = useState<MessageType[]>([]);
  const [input, setInput] = useState('');
  const [personality, setPersonality] = useState(personalities[0]);
  const [isLoading, setIsLoading] = useState(false);
  // const [error, setError] = useState('');
  const chatWindowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [history]);

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

      //     const results = await fetch('http://localhost:3001/api/movies');
      // const data = await results.json();
      const assistantMessage: MessageType = {
        role: 'assistant',
        content: data.data,
      };
      setHistory([...newHistory, assistantMessage]);
      setIsLoading(false);
    } catch (error) {
      // setError(error)
      console.error(error);
      setIsLoading(false);
      return;
    }
  };

  const handleClear = () => {
    setHistory([]);
  };

  return (
    <div className='app-container'>
      <div className='controls'>
        <PersonalitySelector
          personalities={personalities}
          selectedPersonality={personality}
          onPersonalityChange={setPersonality}
        />
        <button onClick={handleClear}>Clear Chat</button>
      </div>
      <div className='chat-window' ref={chatWindowRef}>
        {history.map((message, index) => (
          <Message key={index} message={message} />
        ))}
        {isLoading && <div className='message assistant'>Thinking...</div>}
        {/* {error && <div>{error}</div>} */}
      </div>
      <div className='input-area'>
        <input
          type='text'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder='Type your message...'
          disabled={isLoading}
        />
        <button onClick={handleSend} disabled={isLoading}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
