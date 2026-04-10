import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Cpu, FileText, CheckCircle } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

const HowItWorks = () => {
    const { t } = useLanguage();
    
    const steps = [
        {
            icon: <Upload size={32} style={{ color: '#60a5fa' }} />,
            title: t('howitworks.step1_title'),
            description: t('howitworks.step1_desc')
        },
        {
            icon: <Cpu size={32} style={{ color: '#c084fc' }} />,
            title: t('howitworks.step2_title'),
            description: t('howitworks.step2_desc')
        },
        {
            icon: <FileText size={32} style={{ color: '#f472b6' }} />,
            title: t('howitworks.step3_title'),
            description: t('howitworks.step3_desc')
        },
        {
            icon: <CheckCircle size={32} style={{ color: '#4ade80' }} />,
            title: t('howitworks.step4_title'),
            description: t('howitworks.step4_desc')
        }
    ];

    return (
        <div className="container" style={{ padding: '6rem 1.5rem', minHeight: '100vh' }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
                style={{ marginBottom: '4rem' }}
            >
                <h1 style={{
                    fontSize: '3.5rem',
                    fontWeight: 800,
                    marginBottom: '1.5rem',
                    background: 'linear-gradient(to right, #60a5fa, #c084fc, #f472b6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                    {t('howitworks.title')}
                </h1>
                <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto' }}>
                    {t('howitworks.subtitle')}
                </p>
            </motion.div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '2.5rem',
                marginTop: '2rem'
            }}>
                {steps.map((step, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="glass-panel"
                        style={{
                            padding: '2.5rem',
                            textAlign: 'center',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '24px',
                            background: 'rgba(255, 255, 255, 0.03)',
                            backdropFilter: 'blur(10px)'
                        }}
                        whileHover={{ y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' }}
                    >
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            width: '80px',
                            height: '80px',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 2rem'
                        }}>
                            {step.icon}
                        </div>
                        <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 600 }}>{step.title}</h3>
                        <p style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>{step.description}</p>
                    </motion.div>
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                style={{
                    marginTop: '6rem',
                    padding: '3rem',
                    borderRadius: '32px',
                    background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(244, 114, 182, 0.1))',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    textAlign: 'center'
                }}
            >
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{t('howitworks.step4_title')}?</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{t('howitworks.subtitle')}</p>
                <button
                    onClick={() => window.location.href = '/detect'}
                    className="btn-primary"
                    style={{ padding: '1rem 3rem', fontSize: '1.1rem', borderRadius: '100px' }}
                >
                    {t('common.analyze')}
                </button>
            </motion.div>
        </div>
    );
};

export default HowItWorks;
