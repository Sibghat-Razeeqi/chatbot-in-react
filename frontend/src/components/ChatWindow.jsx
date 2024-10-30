import React, { useState, useEffect, useRef } from 'react';
import MessageInput from './MessageInput';
import { summarizeText, askQuestion } from '../api/api';

function ChatWindow({ conversationId, messages, onAddMessage }) {
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editText, setEditText] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (inputText) => {
    if (!inputText.trim()) return;

    const userMessage = { id: Date.now(), text: inputText, sender: 'user' };
    onAddMessage(conversationId, userMessage);

    let botResponse;
    try {
      if (inputText.toLowerCase().startsWith("summarize")) {
        const textToSummarize = inputText.replace("summarize", "").trim();
        botResponse = await summarizeText(textToSummarize);
      } else {
        botResponse = await askQuestion(inputText);
      }
    } catch (error) {
      botResponse = "Sorry, I couldn't process your request.";
    }

    const botMessage = { id: Date.now(), text: botResponse, sender: 'bot' };
    onAddMessage(conversationId, botMessage);
  };

  const startEditing = (message) => {
    setEditingMessageId(message.id);
    setEditText(message.text);
  };

  const saveEdit = (id) => {
    onAddMessage(conversationId, { id, text: editText, sender: 'user' });
    setEditingMessageId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditingMessageId(null);
    setEditText('');
  };

  return (
    <div className="chat-window">
      <div className="messages">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${msg.sender === 'user' ? 'user-message' : 'bot-message'}`}
          >
            {editingMessageId === msg.id ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="edit-input"
                />
                <button onClick={() => saveEdit(msg.id)} className="save-button">
                  Save
                </button>
                <button onClick={cancelEdit} className="cancel-button">
                  Cancel
                </button>
              </>
            ) : (
              <>
                {msg.text}
                {msg.sender === 'user' && (
                  <button onClick={() => startEditing(msg)} className="edit-button">
                    Edit
                  </button>
                )}
              </>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
}

export default ChatWindow;
