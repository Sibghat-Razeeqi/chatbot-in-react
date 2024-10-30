import React, { useState } from 'react';

function MessageInput({ onSendMessage }) {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput(''); // Clear input after sending
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="message-input">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress} // Send message on Enter key press
        placeholder="Type a message..."
      />
      <button onClick={handleSend} disabled={!input.trim()}>
        Send
      </button>
    </div>
  );
}

export default MessageInput;
