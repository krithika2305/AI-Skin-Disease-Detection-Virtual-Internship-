import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Droplet, Shield, Heart, MapPin, Phone, MessageSquare, Send, Star, ExternalLink } from 'lucide-react';
import { submitFeedback } from '../services/api';
import { useLanguage } from '../LanguageContext';

export default function Recommendation() {
    const { t } = useLanguage();
    const [activeCity, setActiveCity] = useState('Bangalore');
    const [feedback, setFeedback] = useState('');
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [submitted, setSubmitted] = useState(false);

    const guidelines = [
        {
            icon: <Sun size={32} color="#fcd34d" />,
            title: t('recommendations_page.sun_title'),
            desc: t('recommendations_page.sun_desc')
        },
        {
            icon: <Droplet size={32} color="#60a5fa" />,
            title: t('recommendations_page.water_title'),
            desc: t('recommendations_page.water_desc')
        },
        {
            icon: <Shield size={32} color="#4ade80" />,
            title: t('recommendations_page.exam_title'),
            desc: t('recommendations_page.exam_desc')
        },
        {
            icon: <Heart size={32} color="#f472b6" />,
            title: t('recommendations_page.habits_title'),
            desc: t('recommendations_page.habits_desc')
        }
    ];

    const hospitals = {
        'Bangalore': [
            { name: "Victoria Hospital (BMC)", address: "Fort Road, Bangalore", contact: "080 2670 1150" },
            { name: "Manipal Hospital", address: "Old Airport Road, Bangalore", contact: "080 2502 4444" },
            { name: "St. John's Medical College", address: "Sarjapur Road, Bangalore", contact: "080 2206 5000" }
        ],
        'Mangalore': [
            { name: "KMC Hospital", address: "Attavar/Jyothi, Mangalore", contact: "0824 244 5858" },
            { name: "Father Muller Hospital", address: "Kanthi, Mangalore", contact: "0824 223 8000" },
            { name: "Yenepoya Specialty", address: "Kodialbail, Mangalore", contact: "0824 423 8855" }
        ],
        'Mysore': [
            { name: "JSS Hospital", address: "Ramanuja Road, Mysore", contact: "0821 233 5555" },
            { name: "Apollo BGS Hospital", address: "Kuvempunagar, Mysore", contact: "0821 256 8888" },
            { name: "K.R. Hospital (MMC)", address: "Irwin Road, Mysore", contact: "0821 242 3222" }
        ]
    };

    const handleFeedback = async (e) => {
        e.preventDefault();
        if (!feedback.trim()) return;

        const user = JSON.parse(localStorage.getItem('user'));
        const username = user?.username || 'Anonymous';

        try {
            await submitFeedback({
                feedback: feedback,
                rating: rating,
                username: username
            });
            setSubmitted(true);
            setFeedback('');
            setRating(0);
            setTimeout(() => setSubmitted(false), 3000);
        } catch (err) {
            console.error("Failed to submit feedback:", err);
        }
    };

    return (
        <div className="container" style={{ padding: '2rem 1.5rem', display: 'grid', gap: '5rem' }}>
            {/* Guidelines Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                style={{ textAlign: 'center' }}
            >
                <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', marginBottom: '1rem', fontWeight: 800, background: 'linear-gradient(to right, #22d3ee, #818cf8, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    {t('recommendations_page.title')}
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '800px', margin: '0 auto' }}>
                    {t('recommendations_page.subtitle')}
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '3rem' }}>
                    {guidelines.map((item, idx) => (
                        <div key={idx} className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px' }}>
                            <div style={{ marginBottom: '1rem' }}>{item.icon}</div>
                            <h4 style={{ marginBottom: '0.5rem' }}>{item.title}</h4>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Hospital Recommendations */}
            <section>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>{t('recommendations_page.nearby_title')}</h2>
                    <p style={{ color: 'var(--text-muted)' }}>{t('recommendations_page.nearby_subtitle')}</p>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
                        {Object.keys(hospitals).map(city => (
                            <button
                                key={city}
                                onClick={() => setActiveCity(city)}
                                style={{
                                    padding: '0.75rem 2rem',
                                    borderRadius: '100px',
                                    border: 'none',
                                    background: activeCity === city ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                                    color: 'white',
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'var(--transition)'
                                }}
                            >
                                {city}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    <AnimatePresence mode="wait">
                        {hospitals[activeCity].map((hospital, idx) => (
                            <motion.div
                                key={`${activeCity}-${idx}`}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="glass-panel"
                                style={{ padding: '2rem', borderRadius: '24px' }}
                            >
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary)' }}>{hospital.name}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', color: 'var(--text-muted)' }}>
                                    <MapPin size={18} /> {hospital.address}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--text)' }}>
                                    <Phone size={18} color="var(--secondary)" /> {hospital.contact}
                                </div>
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospital.name + " " + hospital.address)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-primary"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: '0.5rem',
                                        padding: '0.6rem',
                                        fontSize: '0.9rem',
                                        borderRadius: '10px',
                                        textDecoration: 'none',
                                        background: 'rgba(34, 211, 238, 0.1)',
                                        border: '1px solid var(--primary)',
                                        color: 'var(--primary)'
                                    }}
                                >
                                    <ExternalLink size={16} /> {t('recommendations_page.view_map')}
                                </a>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </section>

            {/* Feedback Section (RESTORED & LOCALIZED) */}
            <section className="glass-panel" style={{ padding: '3rem', borderRadius: '32px', textAlign: 'center' }}>
                <MessageSquare size={48} color="var(--primary)" style={{ opacity: 0.3, marginBottom: '1rem' }}>
                </MessageSquare>
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>{t('messages.feedback_title')}</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{t('messages.feedback_subtitle')}</p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                            key={star}
                            size={32}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHover(star)}
                            onMouseLeave={() => setHover(0)}
                            style={{
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                                transform: (hover || rating) >= star ? 'scale(1.2)' : 'scale(1)',
                                fill: (hover || rating) >= star ? '#fbbf24' : 'transparent',
                                color: (hover || rating) >= star ? '#fbbf24' : 'var(--text-muted)'
                            }}
                        />
                    ))}
                </div>

                <form onSubmit={handleFeedback} style={{ maxWidth: '900px', margin: '0 auto', position: 'relative' }}>
                    <textarea
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        placeholder={t('messages.feedback_placeholder')}
                        style={{
                            width: '100%',
                            minHeight: '150px',
                            background: 'rgba(0,0,0,0.2)',
                            border: '1px solid var(--glass-border)',
                            borderRadius: '16px',
                            padding: '1.5rem',
                            color: 'white',
                            fontSize: '1rem',
                            outline: 'none',
                            marginBottom: '1.5rem',
                            resize: 'none'
                        }}
                    />
                    <button
                        type="submit"
                        className="btn-primary"
                        style={{
                            width: '100%',
                            padding: '1rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.75rem',
                            borderRadius: '12px',
                            fontSize: '1.1rem'
                        }}
                    >
                        {submitted ? t('messages.feedback_thankyou') : <><Send size={18} /> {t('messages.feedback_submit')}</>}
                    </button>
                    {submitted && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ color: 'var(--success)', marginTop: '1rem' }}
                        >
                            {t('messages.feedback_success')}
                        </motion.p>
                    )}
                </form>
            </section>
        </div>
    );
}
