import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, User, Bot, Sparkles } from 'lucide-react';
import { askChatbot } from '../services/api';

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { text: "Hi! I'm your DermaAI Assistant. How can I help you today?", isBot: true }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input;
        setInput("");
        setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
        setLoading(true);

        try {
            const data = await askChatbot(userMsg);
            setMessages(prev => [...prev, { text: data.response, isBot: true }]);
        } catch (err) {
            setMessages(prev => [...prev, { text: "Sorry, I'm having trouble connecting. Please try again later.", isBot: true }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000 }}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="glass-panel"
                        style={{
                            width: '350px',
                            height: '500px',
                            display: 'flex',
                            flexDirection: 'column',
                            marginBottom: '1rem',
                            overflow: 'hidden',
                            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                            padding: 0
                        }}
                    >
                        {/* Header */}
                        <div style={{ padding: '1.25rem', background: 'var(--primary)', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <div style={{ background: 'rgba(255,255,255,0.2)', padding: '0.4rem', borderRadius: '50%' }}>
                                    <Sparkles size={18} />
                                </div>
                                <span style={{ fontWeight: 'bold' }}>DermaAI Assistant</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: '0.2rem' }}>
                                <X size={20} />
                            </button>
                        </div>

                        {/* Messages */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {messages.map((msg, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: msg.isBot ? -10 : 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    style={{
                                        alignSelf: msg.isBot ? 'flex-start' : 'flex-end',
                                        maxWidth: '85%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '0.4rem'
                                    }}
                                >
                                    <div style={{ 
                                        display: 'flex', 
                                        alignItems: 'center', 
                                        gap: '0.5rem', 
                                        flexDirection: msg.isBot ? 'row' : 'row-reverse',
                                        fontSize: '0.75rem',
                                        color: 'var(--text-muted)'
                                    }}>
                                        {msg.isBot ? <Bot size={12} /> : <User size={12} />}
                                        {msg.isBot ? "Assistant" : "You"}
                                    </div>
                                    <div style={{
                                        padding: '0.75rem 1rem',
                                        borderRadius: '1rem',
                                        borderTopLeftRadius: msg.isBot ? '0.2rem' : '1rem',
                                        borderTopRightRadius: msg.isBot ? '1rem' : '0.2rem',
                                        background: msg.isBot ? 'rgba(255,255,255,0.05)' : 'var(--primary)',
                                        color: 'white',
                                        fontSize: '0.9rem',
                                        lineHeight: 1.5,
                                        border: msg.isBot ? '1px solid var(--glass-border)' : 'none'
                                    }}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                            {loading && (
                                <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.05)', padding: '0.75rem 1rem', borderRadius: '1rem', borderTopLeftRadius: '0.2rem', opacity: 0.6 }}>
                                    Thinking...
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSend} style={{ padding: '1rem', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask about acne, dry skin..."
                                style={{
                                    flex: 1,
                                    background: 'rgba(255,255,255,0.05)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '0.5rem',
                                    padding: '0.6rem 0.8rem',
                                    color: 'white',
                                    outline: 'none'
                                }}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || loading}
                                style={{
                                    background: 'var(--primary)',
                                    border: 'none',
                                    borderRadius: '0.5rem',
                                    width: '38px',
                                    height: '38px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: 'white',
                                    cursor: 'pointer',
                                    opacity: (!input.trim() || loading) ? 0.5 : 1
                                }}
                            >
                                <Send size={18} />
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'var(--primary)',
                    border: 'none',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                    cursor: 'pointer'
                }}
            >
                {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
            </motion.button>
        </div>
    );
}
