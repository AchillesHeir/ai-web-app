import React from 'react';
import type { Message as MessageType } from '../backend/services/api';

interface ChatCard {
  id: string;
  title: string;
  messages: MessageType[];
}

interface SidebarProps {
  chats: ChatCard[];
  selectedChatId?: string | null;
  onSelect: (chatId: string | null) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  chats,
  selectedChatId,
  onSelect,
}) => {
  return (
    <aside className='sidebar'>
      <div className='sidebar-header'>
        <h3>Previous Chats</h3>
        <button className='new-chat-btn' onClick={() => onSelect(null)}>
          + New
        </button>
      </div>

      <div className='chat-list'>
        {chats.length === 0 && <div className='empty'>No previous chats</div>}
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`chat-card ${
              chat.id === selectedChatId ? 'selected' : ''
            }`}
            onClick={() => onSelect(chat.id)}
            role='button'
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && onSelect(chat.id)}
          >
            <div className='chat-card-title'>{chat.title}</div>
            <div className='chat-card-snippet'>
              {chat.messages.length > 0
                ? chat.messages[chat.messages.length - 1].content
                : 'Empty chat'}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;
