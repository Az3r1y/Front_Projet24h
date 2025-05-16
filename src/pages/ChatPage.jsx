import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../styles/ChatPage.css';

// Données simulées pour les messages du chat
const INITIAL_MESSAGES = [
  {
    id: 1,
    userId: 'system',
    username: 'Système',
    avatar: '/assets/system-avatar.png',
    message: 'Bienvenue dans le chat local de Lyon 2180!',
    timestamp: new Date().getTime() - 3600000,
    district: null
  },
  {
    id: 2,
    userId: 'user123',
    username: 'Claire',
    avatar: 'https://avatars.dicebear.com/api/initials/claire.svg',
    message: 'Alerte: Des inondations sont signalées dans le 7ème arrondissement près du parc Blandan',
    timestamp: new Date().getTime() - 1800000,
    district: 7
  },
  {
    id: 3,
    userId: 'user456',
    username: 'Marc',
    avatar: 'https://avatars.dicebear.com/api/initials/marc.svg',
    message: 'Les équipes de secours sont déjà sur place. Restez chez vous si possible!',
    timestamp: new Date().getTime() - 1200000,
    district: 7
  }
];

// Liste des arrondissements pour le filtre
const DISTRICTS = [
  { id: 0, name: 'Tous' },
  { id: 1, name: '1er' },
  { id: 2, name: '2ème' },
  { id: 3, name: '3ème' },
  { id: 4, name: '4ème' },
  { id: 5, name: '5ème' },
  { id: 6, name: '6ème' },
  { id: 7, name: '7ème' },
  { id: 8, name: '8ème' },
  { id: 9, name: '9ème' }
];

// Utilisateur par défaut pour le cas où l'authentification échoue
const DEFAULT_USER = {
  id: 'guest',
  name: 'Invité',
  avatar: 'https://avatars.dicebear.com/api/initials/guest.svg'
};

function ChatPage() {
  const auth = useAuth();
  const user = auth?.user || DEFAULT_USER;
  
  // Si l'utilisateur est authentifié mais n'a pas certaines propriétés, les compléter
  const currentUser = {
    id: user.id || DEFAULT_USER.id,
    name: user.name || user.email?.split('@')[0] || DEFAULT_USER.name,
    avatar: user.avatar || `https://avatars.dicebear.com/api/initials/${user.name || 'guest'}.svg`
  };

  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState(0);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!newMessage.trim()) return;
    
    const message = {
      id: Date.now(),
      userId: currentUser.id,
      username: currentUser.name,
      avatar: currentUser.avatar,
      message: newMessage,
      timestamp: Date.now(),
      district: selectedDistrict > 0 ? selectedDistrict : null
    };
    
    setMessages(prevMessages => [...prevMessages, message]);
    setNewMessage('');
  };

  const filteredMessages = selectedDistrict 
    ? messages.filter(msg => msg.district === selectedDistrict || msg.district === null)
    : messages;

  return (
    <div className="chat-page">
      <div className="chat-container">
        <div className="chat-header">
          <h2>Chat Local Lyon 2180</h2>
          <div className="district-filter">
            <label htmlFor="district-select">Arrondissement:</label>
            <select 
              id="district-select" 
              value={selectedDistrict} 
              onChange={(e) => setSelectedDistrict(parseInt(e.target.value))}
            >
              {DISTRICTS.map(district => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="chat-messages">
          {filteredMessages.map(msg => (
            <div 
              key={msg.id} 
              className={`message ${msg.userId === currentUser.id ? 'my-message' : ''} ${msg.userId === 'system' ? 'system-message' : ''}`}
            >
              <div className="message-avatar">
                <img src={msg.avatar} alt={msg.username} />
              </div>
              <div className="message-content">
                <div className="message-header">
                  <span className="username">{msg.username}</span>
                  <span className="timestamp">{formatTime(msg.timestamp)}</span>
                </div>
                <div className="message-text">{msg.message}</div>
                {msg.district && msg.district > 0 && (
                  <div className="message-district">
                    {msg.district}<sup>{msg.district === 1 ? 'er' : 'ème'}</sup> arrondissement
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <form className="message-form" onSubmit={handleSendMessage}>
          <div className="district-tag">
            {selectedDistrict > 0 && (
              <span className="selected-district">
                {selectedDistrict}<sup>{selectedDistrict === 1 ? 'er' : 'ème'}</sup>
              </span>
            )}
          </div>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Tapez votre message..."
            className="message-input"
          />
          <button type="submit" className="send-button">Envoyer</button>
        </form>
      </div>
      
      <div className="chat-sidebar">
        <div className="active-users">
          <h3>Utilisateurs en ligne</h3>
          <ul className="user-list">
            <li className="user-item">
              <img src={currentUser.avatar} alt={currentUser.name} className="user-avatar" />
              <span className="user-name">{currentUser.name}</span>
              <span className="user-status online"></span>
            </li>
            <li className="user-item">
              <img src="https://avatars.dicebear.com/api/initials/claire.svg" alt="Claire" className="user-avatar" />
              <span className="user-name">Claire</span>
              <span className="user-status online"></span>
            </li>
            <li className="user-item">
              <img src="https://avatars.dicebear.com/api/initials/marc.svg" alt="Marc" className="user-avatar" />
              <span className="user-name">Marc</span>
              <span className="user-status online"></span>
            </li>
          </ul>
        </div>
        
        <div className="chat-tips">
          <h3>Bon à savoir</h3>
          <ul>
            <li>Sélectionnez un arrondissement pour filtrer les messages</li>
            <li>Mentionnez un utilisateur avec @nom</li>
            <li>Les messages du système sont en bleu</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;