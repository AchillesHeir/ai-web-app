import React from 'react';
import type { Message as MessageType } from '../backend/services/api';

interface MessageProps {
  message: MessageType;
}

const Message: React.FC<MessageProps> = ({ message }) => {
  return <div className={`message ${message.role}`}>{message.content}</div>;
};

export default Message;
