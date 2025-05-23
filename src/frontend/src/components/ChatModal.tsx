'use client';

import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComments, faTimes, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const ChatModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([
        { text: 'Olá, preciso de ajuda!', sender: 'user' },
        { text: 'Claro, como posso te ajudar?', sender: 'assistant' },
    ]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const sendMessage = () => {
        if (message.trim()) {
            setMessages([
                ...messages,
                { text: message, sender: 'user' },
                { text: 'Entendido! Em que mais posso ajudar?', sender: 'assistant' },
            ]);
            setMessage('');
        }
    };

    return (
        <>
            <div
                onClick={toggleChat}
                className={`fixed bottom-10 right-8 w-16 h-16 rounded-full bg-[#022028] flex items-center justify-center cursor-pointer z-50 shadow-lg transition-opacity duration-300 ${
                    isOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
            >
                <FontAwesomeIcon icon={faComments} className="text-[#5CE1E6] text-2xl" />
            </div>

            {isOpen && (
                <div
                    className="fixed right-8 top-1/2 transform -translate-y-1/2 w-[87vw] max-w-[470px] h-[80vh] sm:h-[85vh] bg-[#022028] text-[#022028] shadow-lg rounded-lg p-4 flex flex-col transition-all duration-500 ease-in-out"
                >
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-[#5CE1E6]">Chat ao Vivo</h3>
                        <button
                            onClick={toggleChat}
                            className="text-[#5CE1E6] rounded-full p-2"
                        >
                            <FontAwesomeIcon icon={faTimes} className="text-xl" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto mb-4 custom-scrollbar">
                        <div className="space-y-4">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${
                                        msg.sender === 'user' ? 'justify-end' : 'justify-start'
                                    }`}
                                >
                                    <div
                                        className={`max-w-[70%] p-3 rounded-lg text-sm ${
                                            msg.sender === 'user'
                                                ? 'bg-[#5CE1E6] text-[#022028] mr-2'
                                                : 'bg-[#E6F7F8] text-[#555555] ml-2'
                                        }`}
                                    >
                                        <p className="font-semibold">
                                            {msg.sender === 'user' ? 'Você' : 'Consultor'}
                                        </p>
                                        <p>{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center mt-4">
                        <input
                            type="text"
                            className="w-full p-2 border border-[#DDDDDD] rounded-lg text-sm text-white bg-[#022028]"
                            placeholder="Digite sua mensagem..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                        />
                        <button
                            onClick={sendMessage}
                            className="ml-2 w-11 h-11 bg-[#5CE1E6] text-[#022028] rounded-full border-2 border-[#5CE1E6] hover:bg-[#3ec0d3] hover:text-[#022028] transition duration-300 flex items-center justify-center"
                        >
                            <FontAwesomeIcon icon={faPaperPlane} className="text-xl" />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatModal;
