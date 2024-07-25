import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Chat.css'; // Import the CSS file for styling
import io from 'socket.io-client';
import '../styles/Chat.css';
import Chatlist from './Chatlist'; // Import ChatList component
import svg from "../assets/react.svg"; // Import SVG file

const Chat = ({ user, selectedUser, setSelectedUser }) => {
  const socket = io(`${import.meta.env.VITE_BACKEND_URL}`);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [file, setFile] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // State for app drawer

  useEffect(() => {
    if (selectedUser) {
      // Fetch previous messages
      const fetchMessages = async () => {
        try {
          const response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URL}/api/chat/history/${user.id}/${selectedUser.id}`
          );
          setMessages(response.data);
        } catch (error) {
          console.error('Error fetching messages', error);
        }
      };

      fetchMessages();

      socket.emit('join', user.id);

      socket.on('receiveMessage', (msg) => {
        if (msg.senderId === selectedUser.id || msg.receiverId === selectedUser.id) {
          setMessages((prevMessages) => [...prevMessages, msg]);
        }
      });
    }

    return () => {
      socket.off('receiveMessage');
    };
  }, [selectedUser, user.id]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const sendMessage = async () => {
    if (message.trim() || file) {
      try {
        let imageUrl = '';
        if (file) {
          const formData = new FormData();
          formData.append('file', file);
          const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/chat/upload`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
          imageUrl = response.data.imageUrl;
        }

        const newMessage = {
          senderId: user.id,
          receiverId: selectedUser.id,
          text: message,
          imageUrl: imageUrl,
        };

        socket.emi('sendMessage', newMessage);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setMessage('');
        setfile(null);
      } catch (error) {
        console.log('Error sending message');
      }
    }
  };

  return (
    <div className="chat-container">
      <div className={`drawer-toggle ${isDrawerOpen ? 'open' : ''}`} onClick={() => setIsDrawerOpen(!isDrawerOpen)}
      >
      </div>
      <div className={`chat-list-container ${isDrawerOpen ? 'open' : ''}`}>
        <Chatlist users={[selectedUser]} setSelectedUser={setSelectedUser} />
      </div>
      {message && (
          <div className="messages-container">
            <h2>Chat with {selectedUser ? selectedUser.username : '...'}</h2>
            {message.map((msg, index) => (
              <div key={index} className={`message-container ${msg.senderId === user.id ? 'own' : 'other'}`}>
                {msg.imageUrl ? (
                  <div className="message">
                    <img src={`${import.meta.env.VITE_BACKEND_URL}/uploads/${msg.imageUrl}`} alt="Uploaded" style={{maxWidth: '100%', maxHeight:'200px'}}/>
                  </div>
                ) : (
                  <div className="message">
                    <p>{msg.text}</p>
                  </div>
                )}
              </div>
            ))}
            {message.length === 0 && <p>No messages yet.</p>}
            </div>
      )}
          <div className="input-container">
            <input
              className="type-message"
            
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
            />
            <label className="upload-button">
              <input type="file" onChange={handleFieleChange} style={{ display: 'none' }} />
              <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff">
                <path d="M720-33q0 104-73 177T470-80q-104 0-177-73t-73-177v-370q0-75 52.5-127.5T400-880q75 0 127.5 52.5T580-700v350q0 46-32 78t-78 32q-46 0-78-32t-32-78v-370h80v370q0 13 8.5
                21.5T470-320q13 0 21.5-8.5T500-350v-350q-1-42-29.5-71T400-800q-42 0-71 29t-29 71v370q-1 71 49 120.5T470-160q70 0 119-49.5T640-330v-390h80v390Z" />
              </svg>
            </label>
            <button onClick={sendMessage}>Send</button>
          </div>
          </div>
  );
};

export default Chat;
