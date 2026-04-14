import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, AlertCircle, CheckCircle2, RefreshCw, ChevronRight, User, Phone, MapPin, Cpu } from 'lucide-react';
import { uploadImage, getDoctors } from '../services/api';
import { useLanguage } from '../LanguageContext';

export default function Detect() {
    const { t } = useLanguage();
    const [selectedImage, setSelectedImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [selectedCity, setSelectedCity] = useState('');
    const [localDoctors, setLocalDoctors] = useState([]);

    const cities = ["Bangalore", "Mysore", "Mangalore", "Chennai"];

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
            setResult(null);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!selectedImage) return;
        setLoading(true);
        setError(null);
        try {
            const data = await uploadImage(selectedImage);
            const newResult = {
                prediction: data.prediction,
                confidence: (data.confidence * 100).toFixed(1),
                confidence_label: data.confidence_label,
                risk_level: data.risk_level,
                class_key: data.class_key,
                status: data.status,
                recommendation: data.recommendation
            };
            setResult(newResult);

            // Save to history locally
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            const historyKey = user.username ? `detectionHistory_${user.username}` : 'detectionHistory';
            const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
            history.unshift({ ...newResult, date: new Date().toISOString(), imageName: selectedImage.name, id: Date.now() });
            localStorage.setItem(historyKey, JSON.stringify(history));
        } catch (err) {
            setError(err.recommendation || t('messages.unknown_desc'));
        } finally {
            setLoading(false);
        }
    };

    const fetchLocalDoctors = async (city) => {
        setSelectedCity(city);
        if (!city) {
            setLocalDoctors([]);
            return;
        }
        try {
            const doctors = await getDoctors(city);
            setLocalDoctors(doctors);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="container" style={{ padding: '2rem 1.5rem', display: 'grid', gap: '3rem' }}>
            {/* Split layout for desktop */}
            <div style={{ display: 'grid', gridTemplateColumns: preview ? '1fr 1fr' : '1fr', gap: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                
                {/* Upload Section */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="glass-panel" style={{ padding: '2.5rem', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                        <h2 style={{ marginBottom: '1.5rem' }}>{t('detect_page.title')}</h2>
                        <div style={{ width: '100%', maxWidth: '400px', height: '300px', border: '2px dashed rgba(34, 211, 238, 0.3)', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)', position: 'relative', overflow: 'hidden' }}>
                            {preview ? (
                                <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <>
                                    <Upload size={48} color="var(--primary)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                                    <p style={{ color: 'var(--text-muted)' }}>{t('detect_page.upload_text')}</p>
                                </>
                            )}
                            <input type="file" onChange={handleImageChange} accept="image/*" style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                        </div>

                        <button onClick={handleUpload} disabled={!selectedImage || loading} className="btn-primary" style={{ marginTop: '2rem', width: '100%', maxWidth: '400px' }}>
                            {loading ? <RefreshCw className="spin" /> : t('detect_page.predict_btn')}
                        </button>
                    </div>
                </motion.div>

                {/* Result Section */}
                <AnimatePresence>
                    {(result || error) && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                            <div className="glass-panel" style={{ padding: '2.5rem', height: '100%', borderLeft: `4px solid ${error ? '#ef4444' : '#22d3ee'}` }}>
                                {error ? (
                                    <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                                        <AlertCircle size={60} color="#ef4444" style={{ marginBottom: '1rem' }} />
                                        <h3>{t('detect_page.error_title')}</h3>
                                        <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>{error}</p>
                                    </div>
                                ) : (
                                    <>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                                            <CheckCircle2 color="#22d3ee" />
                                            <span style={{ fontWeight: 700, color: '#22d3ee', letterSpacing: '1px', textTransform: 'uppercase' }}>{t('detect_page.analyis_complete')}</span>
                                        </div>

                                        <h3 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 600 }}>{t('detect_page.predicted_condition')}</h3>
                                        <h2 style={{ fontSize: '2.2rem', marginBottom: '1.5rem', color: 'white', fontWeight: 800 }}>{t('predictions.' + result.prediction) || result.prediction}</h2>
                                        
                                        {/* Risk Level Badge */}
                                        <div style={{ 
                                            display: 'inline-block', 
                                            padding: '0.5rem 1rem', 
                                            borderRadius: '8px', 
                                            marginBottom: '2rem',
                                            background: result.risk_level === 'High' ? 'rgba(239, 68, 68, 0.2)' : result.risk_level === 'Medium' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(34, 211, 238, 0.2)',
                                            border: `1px solid ${result.risk_level === 'High' ? '#ef4444' : result.risk_level === 'Medium' ? '#f59e0b' : '#22d3ee'}`,
                                            color: result.risk_level === 'High' ? '#fca5a5' : result.risk_level === 'Medium' ? '#fcd34d' : '#22d3ee'
                                        }}>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginRight: '8px' }}>{t('detect_page.risk_level')}:</span>
                                            <span style={{ fontWeight: 600 }}>{t('risk_levels.' + (result.risk_level || 'Uncertain'))}</span>
                                        </div>

                                        <div style={{ marginBottom: '2rem' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                                <span>{t('detect_page.confidence')} ({result.confidence_label})</span>
                                                <span style={{ fontWeight: 700, color: '#22d3ee' }}>{result.confidence}%</span>
                                            </div>
                                            <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                                <motion.div 
                                                    initial={{ width: 0 }} 
                                                    animate={{ width: `${result.confidence}%` }} 
                                                    style={{ 
                                                        height: '100%', 
                                                        background: result.status === 'high' ? '#10b981' : result.status === 'medium' ? '#f59e0b' : '#3b82f6' 
                                                    }} 
                                                />
                                            </div>
                                        </div>

                                        <div style={{ display: 'grid', gap: '1.5rem' }}>
                                            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                                <h4 style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#22d3ee' }}>
                                                    <Cpu size={16} /> {t('detect_page.explanation_title')}
                                                </h4>
                                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6', fontStyle: 'italic' }}>
                                                    {t('explanations.' + (result.class_key || 'Inconclusive'))}
                                                </p>
                                            </div>

                                            <div style={{ background: 'rgba(34, 211, 238, 0.05)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(34, 211, 238, 0.1)' }}>
                                                <h4 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                    <AlertCircle size={16} color="#22d3ee" /> {t('detect_page.ai_recommendation')}
                                                </h4>
                                                <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{t('recommendations.' + result.prediction.replace(/ /g, '_')) || result.recommendation}</p>
                                            </div>
                                        </div>

                                        <div style={{ marginTop: '2rem', padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                            <p style={{ fontSize: '0.75rem', color: '#ef4444', textAlign: 'center', fontWeight: 600, lineHeight: 1.4 }}>
                                                ⚠️ {t('messages.disclaimer')}
                                            </p>
                                        </div>

                                        {/* Doctor Recommendation Section (NEW) */}
                                        <div style={{ marginTop: '2.5rem' }}>
                                            <h4 style={{ marginBottom: '1rem' }}>👩‍⚕️ Consult Nearby Dermatologists</h4>
                                            <select 
                                                value={selectedCity} 
                                                onChange={(e) => fetchLocalDoctors(e.target.value)}
                                                className="input-field" 
                                                style={{ marginBottom: '1.5rem', background: 'rgba(0,0,0,0.3)', border: '1.5px solid var(--primary)' }}
                                            >
                                                <option value="">Select your city...</option>
                                                {cities.map(city => <option key={city} value={city}>{city}</option>)}
                                            </select>

                                            <div style={{ display: 'grid', gap: '1rem' }}>
                                                {localDoctors.map((doc, idx) => (
                                                    <motion.div key={idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel" style={{ padding: '1rem', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <div>
                                                                <div style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '0.2rem' }}>{doc.name}</div>
                                                                <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{doc.specialization}</div>
                                                            </div>
                                                            <div style={{ display: 'flex', gap: '0.8rem' }}>
                                                                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(doc.hospital + " " + doc.city)}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary)' }}>
                                                                    <MapPin size={18} />
                                                                </a>
                                                                <a href={`tel:${doc.contact}`} style={{ color: 'var(--secondary)' }}>
                                                                    <Phone size={18} />
                                                                </a>
                                                            </div>
                                                        </div>
                                                        <div style={{ marginTop: '0.6rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)' }}>
                                                             {doc.hospital}, {doc.city}
                                                        </div>
                                                    </motion.div>
                                                ))}
                                                {selectedCity && localDoctors.length === 0 && (
                                                    <p style={{ fontSize: '0.9rem', textAlign: 'center', opacity: 0.5 }}>No doctors found in this city.</p>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
