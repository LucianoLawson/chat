import { useState, useEffect }  from 'react';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from '@chatscope/chat-ui-kit-react';

const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

const App = () => {
  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm Robo! Ask me anything!",
      sentTime: "just now",
      sender: "Robo",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendRequest = async (message) => {
    const newMessage = {
      message,
      direction: 'outgoing',
      sender: "user",
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setIsTyping(true);

    const handleSendRequest = async (message) => {
    
      try {
        const response = await processMessageToChatGPT([...messages, newMessage]);
        if (!response.choices || response.choices.length === 0) {
          // Handle the case where no choices are returned
          console.error("No choices returned from the API.");
          // Optionally set an error state and display a message to the user
          return;
        }
        const content = response.choices[0]?.message?.content;
        if (content) {
          const chatGPTResponse = {
            message: content,
            sender: "Robo",
          };
          setMessages((prevMessages) => [...prevMessages, chatGPTResponse]);
        }
      } catch (error) {
        console.error("Error processing message:", error);
        // Handle the error state appropriately, e.g., display an error message to the user
      } finally {
        setIsTyping(false);
      }
    };
  }    

  async function processMessageToChatGPT(chatMessages) {
    const apiMessages = chatMessages.map((messageObject) => {
      const role = messageObject.sender === "Robo" ? "assistant" : "user";
      return { role, content: messageObject.message };
    });

    const apiRequestBody = {
      "model": "gpt-3.5-turbo",
      "messages": [
        { role: "system", content: "I'm a Student using ChatGPT for learning" },
        ...apiMessages,
      ],
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    });

    return response.json();
  }

  return (
    <div className="App">
      <div style={{ position:"relative", height: "800px", width: "700px"  }}>
        <MainContainer>
          <ChatContainer>       
            <MessageList 
              scrollBehavior="smooth" 
              typingIndicator={isTyping ? <TypingIndicator content="Robo🤖 is typing" /> : null}
            >
              {messages.map((message, i) => {
                console.log(message)
                return <Message key={i} model={message} />
              })}
            </MessageList>
            <MessageInput placeholder="Send a Message" onSend={handleSendRequest} />        
          </ChatContainer>
        </MainContainer>
      </div>
    </div>
    
  )
}

export default App;