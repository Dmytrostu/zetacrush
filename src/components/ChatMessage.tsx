import React from 'react';
import './ChatMessage.css';

interface ChatMessageProps {
  isUser: boolean;
  content: React.ReactNode;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ isUser, content }) => {
  return (
    <div className={`chat-message ${isUser ? 'user-message' : 'system-message'}`}>
      <div className="avatar">
        {isUser ? 'U' : 'A'}
      </div>
      <div className="message-content">
        {content}
      </div>
    </div>
  );
};

export default ChatMessage;
