import React from 'react';

function Sidebar({ conversations, onDelete, onNewConversation, onSelectConversation, activeConversationId }) {
  return (
    <div className="sidebar">
      <h2>Conversations</h2>
      <button onClick={onNewConversation} className="new-conversation-button">
        + New Chat
      </button>
      <ul>
        {conversations.map((conv) => (
          <li
            key={conv.id}
            className={`conversation-item ${conv.id === activeConversationId ? 'active' : ''}`}
            onClick={() => onSelectConversation(conv.id)}
          >
            <span>{conv.title}</span>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent selecting the conversation
                onDelete(conv.id);
              }}
              className="delete-button"
              aria-label="Delete conversation"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
