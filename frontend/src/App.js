import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import './App.css';

function App() {
  const [conversations, setConversations] = useState([]);
  const [currentConversationId, setCurrentConversationId] = useState(null);

  const handleNewConversation = () => {
    const newConversation = {
      id: Date.now(),
      title: `Conversation ${conversations.length + 1}`,
      messages: [],
    };
    setConversations([...conversations, newConversation]);
    setCurrentConversationId(newConversation.id); // Set new conversation as active
  };

  const handleDeleteConversation = (id) => {
    setConversations(conversations.filter((conv) => conv.id !== id));
    if (currentConversationId === id) setCurrentConversationId(null);
  };

  const handleAddMessage = (conversationId, newMessage) => {
    setConversations((prevConversations) =>
      prevConversations.map((conv) =>
        conv.id === conversationId
          ? { ...conv, messages: [...conv.messages, newMessage] }
          : conv
      )
    );
  };

  // Find the active conversation based on currentConversationId
  const activeConversation = conversations.find(conv => conv.id === currentConversationId);

  return (
    <div className="app-container">
      <Sidebar 
        conversations={conversations} 
        onDelete={handleDeleteConversation} 
        onNewConversation={handleNewConversation}
        onSelectConversation={(id) => setCurrentConversationId(id)} // Set conversation on click
      />
      <ChatWindow 
        conversationId={currentConversationId} 
        messages={activeConversation ? activeConversation.messages : []} 
        onAddMessage={handleAddMessage} 
      />
      
    </div>
  );
}

export default App;