import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, Activity, Calendar, Trash2, FileImage } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function History() {
    const { t } = useLanguage();
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('detectionHistory') || '[]');
        setHistory(stored);
    }, []);

    const clearHistory = () => {
        if (window.confirm(t('common.clear_history') + '?')) {
            localStorage.removeItem('detectionHistory');
            setHistory([]);
        }
    };

    const deleteItem = (id) => {
        const updatedHistory = history.filter(item => item.id !== id);
        localStorage.setItem('detectionHistory', JSON.stringify(updatedHistory));
        setHistory(updatedHistory);
    };

    return (
        <div className="container" style={{ padding: '2rem 1.5rem' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '2rem' }}>
                        <Clock size={32} color="var(--primary)" /> {t('navbar.history')}
                    </h1>
                    {history.length > 0 && (
                        <button
                            onClick={clearHistory}
                            className="btn-outline"
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                padding: '0.5rem 1rem', border: '1px solid var(--error)',
                                color: 'var(--error)', borderRadius: '0.5rem', background: 'transparent',
                                cursor: 'pointer'
                            }}
                        >
                            <Trash2 size={18} /> {t('common.clear_history')}
                        </button>
                    )}
                </div>

                {history.length === 0 ? (
                    <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        <Clock size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
                        <p>{t('common.upload_image')}...</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        {history.map((item, index) => (
                            <motion.div
                                key={item.id || index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="glass-panel"
                                style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}
                            >
                                <div style={{ flex: 1, minWidth: '200px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                        <Calendar size={14} />
                                        {new Date(item.date || Date.now()).toLocaleString()}
                                    </div>
                                    <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', marginBottom: '0.25rem' }}>
                                        {t('predictions.' + item.prediction)}
                                    </h3>
                                    <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                                        <span style={{ opacity: 0.7 }}>{t('common.confidence')}:</span>
                                        <span style={{ fontWeight: 'bold' }}>{(item.confidence * 100).toFixed(1)}%</span>
                                    </p>
                                </div>

                                <div style={{ flex: 2, minWidth: '250px', borderLeft: '1px solid var(--glass-border)', paddingLeft: '1.5rem' }}>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
                                        {item.prediction === "Inconclusive" ? t('messages.inconclusive_desc') : 
                                         item.prediction === "Unknown" ? t('messages.unknown_desc') : 
                                         item.recommendation}
                                    </p>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem', minWidth: '150px' }}>
                                    {item.imageName && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.8rem', borderRadius: '100px' }}>
                                            <FileImage size={12} /> {item.imageName}
                                        </div>
                                    )}
                                    <button
                                        onClick={() => deleteItem(item.id)}
                                        style={{
                                            padding: '0.5rem',
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            border: '1px solid rgba(239, 68, 68, 0.2)',
                                            borderRadius: '8px',
                                            color: 'var(--error)',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.4rem',
                                            fontSize: '0.8rem',
                                            transition: 'var(--transition)',
                                            marginTop: 'auto'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                                        onMouseOut={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                                    >
                                        <Trash2 size={14} /> {t('common.remove')}
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
