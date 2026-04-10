import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Upload, Cpu, FileText, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home({ isAuthenticated }) {
    const navigate = useNavigate();

    const handleStartDetect = () => {
        if (isAuthenticated) {
            navigate('/detect');
        } else {
            navigate('/login');
        }
    };

    const steps = [
        {
            icon: <Upload size={32} className="text-blue-400" />,
            title: "Upload Photo",
            description: "Take a clear picture of the skin area and upload it."
        },
        {
            icon: <Cpu size={32} className="text-purple-400" />,
            title: "AI Analysis",
            description: "Our smart AI checks the photo instantly."
        },
        {
            icon: <FileText size={32} className="text-pink-400" />,
            title: "Get Results",
            description: "See what the AI found and its confidence score."
        },
        {
            icon: <CheckCircle size={32} className="text-green-400" />,
            title: "Next Steps",
            description: "Learn what you can do next based on the results."
        }
    ];

    return (
        <div className="home-container">
            {/* Hero Section */}
            <section style={{
                minHeight: '60vh',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'center',
                textAlign: 'center',
                padding: '12vh 1.5rem 4rem',
                position: 'relative',
                overflow: 'hidden',
                background: 'radial-gradient(circle at top right, rgba(99, 102, 241, 0.05), transparent 40%), radial-gradient(circle at bottom left, rgba(244, 114, 182, 0.05), transparent 40%)'
            }}>
                <div style={{ maxWidth: '1200px', position: 'relative', zIndex: 10 }}>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.5rem 1rem',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '100px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                marginBottom: '2rem',
                                fontSize: '0.9rem',
                                color: '#818cf8'
                            }}
                        >
                            <span style={{ display: 'inline-block', width: '8px', height: '8px', background: '#818cf8', borderRadius: '50%' }}></span>
                            AI Skin Analysis
                        </motion.div>

                        <h1 style={{
                            fontSize: 'clamp(3rem, 8vw, 5rem)',
                            fontWeight: 800,
                            background: 'linear-gradient(to right, #22d3ee, #818cf8, #f472b6)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginBottom: '1.5rem',
                            letterSpacing: '-2px',
                            lineHeight: 1.1
                        }}>
                            Check Your Skin <br />Instantly with AI
                        </h1>
                        <p style={{
                            fontSize: '1.25rem',
                            color: 'var(--text-muted)',
                            marginBottom: '3rem',
                            lineHeight: 1.6,
                            maxWidth: '700px',
                            marginInline: 'auto'
                        }}>
                            Get a quick and reliable check for skin conditions using our advanced AI.
                            It's fast, private, and easy to use.
                        </p>

                        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                            <button
                                onClick={handleStartDetect}
                                className="btn-primary"
                                style={{
                                    fontSize: '1.1rem',
                                    padding: '1rem 2.5rem',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.75rem',
                                    borderRadius: '100px',
                                    boxShadow: '0 10px 30px -10px var(--primary-color)'
                                }}
                            >
                                Start Diagnosis <ArrowRight size={20} />
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Animated Background Orbs */}
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.5, 0.3],
                    }}
                    transition={{ duration: 8, repeat: Infinity }}
                    style={{ position: 'absolute', top: '20%', right: '10%', width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0 }}
                ></motion.div>
            </section>

            {/* How It Works Section */}
            <section className="container" style={{ paddingBottom: '8rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>How It Works</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Follow these 4 simple steps to check your skin.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            className="glass-panel"
                            style={{ padding: '2.5rem', textAlign: 'center', borderRadius: '24px' }}
                            whileHover={{ y: -5 }}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <div style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                width: '64px',
                                height: '64px',
                                borderRadius: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 1.5rem'
                            }}>
                                {step.icon}
                            </div>
                            <h3 style={{ fontSize: '1.4rem', marginBottom: '0.75rem', fontWeight: 600 }}>{step.title}</h3>
                            <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}
