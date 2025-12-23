'use client';

import React, { useState, useRef, useEffect } from 'react';
import { FaCommentDots, FaTimes, FaPaperPlane, FaRobot } from 'react-icons/fa';
import '../styles/chat-assistant.css';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
}

const ChatAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: 'Olá! Sou o IA do CineVault. 🍿', sender: 'bot' },
    { id: 2, text: 'Posso te ajudar a escolher o que assistir hoje? Me diga um gênero ou um filme que você gosta!', sender: 'bot' }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Rola para o fim sempre que chega mensagem nova
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping, isOpen]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;

    // 1. Adiciona mensagem do usuário
    const newUserMsg: Message = { id: Date.now(), text: inputValue, sender: 'user' };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    // 2. Simula resposta do Bot (Mock)
    setTimeout(() => {
      const botResponses = [
        "Ótima escolha! Baseado nisso, acho que você vai adorar 'Duna: Parte Dois'.",
        "Hmm, interessante. Já assistiu 'O Urso'? Está super em alta!",
        "Se você gosta desse estilo, precisa conferir 'Arcane' na nossa lista de Destaques.",
        "Vou procurar algo assim no meu cofre... Que tal 'Interestelar'?",
      ];
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];
      
      const newBotMsg: Message = { id: Date.now() + 1, text: randomResponse, sender: 'bot' };
      setMessages(prev => [...prev, newBotMsg]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="chat-widget-container">
      
      {/* --- JANELA DO CHAT (MODAL) --- */}
      <div className={`chat-window ${isOpen ? 'open' : ''}`}>
        
        {/* Header */}
        <div className="chat-header">
          <div className="chat-header-info">
            <div className="bot-avatar-small">
              <FaRobot />
            </div>
            <div>
              <h4>CineBot</h4>
              <span className="status-indicator">Online</span>
            </div>
          </div>
          <button className="close-chat-btn" onClick={() => setIsOpen(false)}>
            <FaTimes />
          </button>
        </div>

        {/* Área das Mensagens */}
        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`message-bubble ${msg.sender}`}>
              {msg.text}
            </div>
          ))}
          
          {isTyping && (
            <div className="message-bubble bot typing">
              <span></span><span></span><span></span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Área de Input */}
        <form className="chat-input-area" onSubmit={handleSendMessage}>
          <input 
            type="text" 
            placeholder="Digite sua mensagem..." 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button type="submit" disabled={!inputValue.trim()}>
            <FaPaperPlane />
          </button>
        </form>
      </div>

      {/* --- BOTÃO FLUTUANTE (REDONDO) --- */}
      <button 
        className={`chat-floating-btn ${isOpen ? 'hidden' : ''}`} 
        onClick={() => setIsOpen(true)}
        aria-label="Abrir Chat"
      >
        <FaCommentDots />
      </button>

    </div>
  );
};

export default ChatAssistant;