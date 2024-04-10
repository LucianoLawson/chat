import React, { useState } from 'react';
import axios from 'axios';

const ChatWithAI = () => {
  const [userInput, setUserInput] = useState('');
  const [conversation, setConversation] = useState([]);

  const handleInputChange = (event) => {
    setUserInput(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userMessage = userInput.trim();
    if (!userMessage) return;

    // Update conversation with user message
    setConversation(conversation => [...conversation, { sender: 'User', message: userMessage }]);
    setUserInput('');

    try {
      const response = await axios.post('/api/chat', { message: userMessage });
      const aiMessage = response.data.message;

      // Update conversation with AI response
      setConversation(conversation => [...conversation, { sender: 'AI', message: aiMessage }]);
    } catch (error) {
      console.error('Error talking to the AI:', error);
      // Handle the error state appropriately
    }
  };

  return (
    <div>
      <div>
        {conversation.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.sender === 'User' ? 'right' : 'left' }}>
            <p><strong>{msg.sender}:</strong> {msg.message}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Say something..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
};

export default ChatWithAI;
