import React, { useEffect } from 'react';
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
  onNew?: () => void;
  onDelete?: (id: string) => void;
  onEditTitle?: (id: string, title: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  chats,
  selectedChatId,
  onSelect,
  onNew,
  onDelete,
  onEditTitle,
}) => {
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editValue, setEditValue] = React.useState('');
  const [openMenuId, setOpenMenuId] = React.useState<string | null>(null);
  const rootRef = React.useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      // close menu when clicking outside
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);
  return (
    <aside className='sidebar' ref={rootRef}>
      <div className='sidebar-header'>
        <h3>Previous Chats</h3>
      </div>

      <div className='chat-list'>
        {chats.length === 0 && <div className='empty'>No previous chats</div>}
        {chats.map((chat) => (
          <div
            key={chat.id}
            className={`chat-card ${
              chat.id === selectedChatId ? 'selected' : ''
            }`}
          >
            <div
              className='chat-card-main'
              onClick={() => onSelect(chat.id)}
              role='button'
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && onSelect(chat.id)}
            >
              {editingId === chat.id ? (
                <input
                  className='chat-title-input'
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onEditTitle &&
                        onEditTitle(chat.id, editValue.trim() || chat.title);
                      setEditingId(null);
                    } else if (e.key === 'Escape') {
                      setEditingId(null);
                    }
                  }}
                  onBlur={() => {
                    onEditTitle &&
                      onEditTitle(chat.id, editValue.trim() || chat.title);
                    setEditingId(null);
                  }}
                  autoFocus
                />
              ) : (
                <div className='chat-card-title' title={chat.title}>
                  {chat.title}
                </div>
              )}
            </div>
            <div className='chat-card-actions'>
              <div
                className={`dropdown ${openMenuId === chat.id ? 'open' : ''}`}
              >
                <button
                  className='dropdown-toggle'
                  aria-label='More'
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === chat.id ? null : chat.id);
                  }}
                >
                  ⋮
                </button>
                <div className='dropdown-menu'>
                  <button
                    className='dropdown-item'
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingId(chat.id);
                      setEditValue(chat.title || '');
                      setOpenMenuId(null);
                    }}
                  >
                    Edit title
                  </button>
                  <button
                    className='dropdown-item'
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete && onDelete(chat.id);
                      setOpenMenuId(null);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        <button
          className='new-chat-btn'
          onClick={() => (onNew ? onNew() : onSelect(null))}
        >
          + New
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
