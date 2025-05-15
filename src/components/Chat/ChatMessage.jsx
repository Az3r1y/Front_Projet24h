import React from 'react';
import styled from 'styled-components';

const MessageContainer = styled.div`
  display: flex;
  margin-bottom: 10px;
  flex-direction: ${props => props.isOwnMessage ? 'row-reverse' : 'row'};
`;

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${props => props.color || '#ccc'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${props => props.isOwnMessage ? '0' : '10px'};
  margin-left: ${props => props.isOwnMessage ? '10px' : '0'};
`;

const MessageBubble = styled.div`
  padding: 10px;
  border-radius: 10px;
  max-width: 70%;
  background-color: ${props => props.isOwnMessage ? '#4d9aff' : '#f1f1f1'};
  color: ${props => props.isOwnMessage ? 'white' : 'black'};
`;

const Username = styled.div`
  font-weight: bold;
  font-size: 0.9rem;
  margin-bottom: 3px;
`;

const Content = styled.div`
  word-wrap: break-word;
`;

const TimeStamp = styled.div`
  font-size: 0.7rem;
  color: ${props => props.isOwnMessage ? 'rgba(255, 255, 255, 0.8)' : 'gray'};
  text-align: right;
  margin-top: 3px;
`;

const ChatMessage = ({ message, isOwnMessage }) => {
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Génère une couleur basée sur le username pour l'avatar
  const getAvatarColor = (username) => {
    let hash = 0;
    for (let i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
  };

  const username = message.profiles?.username || 'Anonyme';
  const avatarColor = getAvatarColor(username);

  return (
    <MessageContainer isOwnMessage={isOwnMessage}>
      <Avatar color={avatarColor} isOwnMessage={isOwnMessage}>
        {username.charAt(0).toUpperCase()}
      </Avatar>
      <MessageBubble isOwnMessage={isOwnMessage}>
        <Username>{username}</Username>
        <Content>{message.content}</Content>
        <TimeStamp isOwnMessage={isOwnMessage}>
          {formatTime(message.created_at)}
        </TimeStamp>
      </MessageBubble>
    </MessageContainer>
  );
};

export default ChatMessage;