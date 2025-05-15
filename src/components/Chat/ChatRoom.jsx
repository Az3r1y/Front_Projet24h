import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getMessages, sendMessage, subscribeToMessages } from '../../services/chat';
import ChatMessage from './ChatMessage';

const ChatRoom = ({ channelId = 'general' }) => {
  const { user, profile } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  // Charger les messages
  useEffect(() => {
    const loadMessages = async () => {
      setLoading(true);
      const { messages, error } = await getMessages(channelId);
      
      if (error) {
        setError(error.message);
      } else {
        setMessages(messages);
      }
      
      setLoading(false);
    };

    loadMessages();
  }, [channelId]);

  // S'abonner aux nouveaux messages
  useEffect(() => {
    const subscription = subscribeToMessages(channelId, (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      if (subscription && subscription.unsubscribe) {
        subscription.unsubscribe();
      }
    };
  }, [channelId]);

  // Faire défiler vers le bas lorsque de nouveaux messages arrivent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const { error } = await sendMessage(user.id, newMessage, channelId);
    
    if (error) {
      setError(error.message);
    } else {
      setNewMessage('');
    }
  };

  if (loading) return <div>Chargement des messages...</div>;
  if (error) return <div>Erreur: {error}</div>;

  return (
    <div className="chat-container">
      <div className="chat-header">
        <h2>Chat local - Zone {channelId}</h2>
      </div>
      
      <div className="chat-messages">
        {messages.map((msg) => (
          <ChatMessage 
            key={msg.id} 
            message={msg} 
            isOwnMessage={msg.profiles?.id === user?.id}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="chat-input-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Écrivez votre message..."
          disabled={!user}
        />
        <button type="submit" disabled={!user}>
          Envoyer
        </button>
      </form>
      
      {!user && (
        <div className="login-prompt">
          Connectez-vous pour participer au chat
        </div>
      )}
    </div>
  );
};

export default ChatRoom;