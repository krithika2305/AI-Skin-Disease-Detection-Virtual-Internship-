import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../LanguageContext';

export default function About() {
    const { t } = useLanguage();

    return (
        <div className="container" style={{ padding: '3rem 1.5rem', minHeight: '80vh' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}
            >
                <h1 style={{
                    fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                    fontWeight: 800,
                    background: 'linear-gradient(to right, #22d3ee, #818cf8, #f472b6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    marginBottom: '2rem'
                }}>
                    {t('about_page.title')}
                </h1>

                <div className="glass-panel" style={{ padding: '3rem', borderRadius: '24px' }}>
                    <p style={{ fontSize: '1.4rem', lineHeight: 1.6, marginBottom: '2.5rem', fontWeight: 500, color: 'var(--text)' }}>
                        {t('about_page.main')}
                    </p>

                    <div style={{ textAlign: 'left', display: 'grid', gap: '1.5rem' }}>
                        <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', borderLeft: '4px solid var(--primary)' }}>
                            <h3 style={{ color: 'var(--primary)', marginBottom: '0.75rem', fontSize: '1.5rem' }}>{t('about_page.sec1_title')}</h3>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                <li>• {t('about_page.sec1_item1')}</li>
                                <li>• {t('about_page.sec1_item2')}</li>
                                <li>• {t('about_page.sec1_item3')}</li>
                            </ul>
                        </div>

                        <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', borderLeft: '4px solid var(--secondary)' }}>
                            <h3 style={{ color: 'var(--secondary)', marginBottom: '0.75rem', fontSize: '1.5rem' }}>{t('about_page.sec2_title')}</h3>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                <li>• {t('about_page.sec2_item1')}</li>
                                <li>• {t('about_page.sec2_item2')}</li>
                                <li>• {t('about_page.sec2_item3')}</li>
                            </ul>
                        </div>

                        <div style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', borderLeft: '4px solid var(--accent)' }}>
                            <h3 style={{ color: 'var(--accent)', marginBottom: '0.75rem', fontSize: '1.5rem' }}>{t('about_page.sec3_title')}</h3>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--text-muted)', lineHeight: '1.6' }}>
                                <li>• {t('about_page.sec3_item1')}</li>
                                <li>• {t('about_page.sec3_item2')}</li>
                                <li>• {t('about_page.sec3_item3')}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
