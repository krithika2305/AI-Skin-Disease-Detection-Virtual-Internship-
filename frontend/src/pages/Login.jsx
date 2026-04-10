import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, User, Lock, AlertCircle } from 'lucide-react';

const API_URL = 'http://localhost:5000';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPopup, setShowPopup] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // Successful login
                localStorage.setItem('user', JSON.stringify({ 
                    username: data.username, 
                    email: data.email,
                    role: data.role // Store role (admin or user)
                }));
                navigate('/', { replace: true });
                window.location.reload(); // Force reload to update auth state in App
            } else if (response.status === 404) {
                // User not registered
                setShowPopup(true);
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Failed to connect to server');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            background: 'var(--background-gradient)',
            position: 'relative',
            paddingTop: '5rem'
        }}>
            {/* Modal Popup for Not Registered */}
            {showPopup && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(5px)'
                }}>
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="glass-panel"
                        style={{ padding: '2rem', maxWidth: '400px', width: '90%', textAlign: 'center', border: '1px solid var(--error)' }}
                    >
                        <AlertCircle size={48} color="var(--error)" style={{ marginBottom: '1rem' }} />
                        <h2 style={{ color: 'var(--error)', marginBottom: '0.5rem' }}>Not Registered</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                            We couldn't find an account with that email. Please register to continue.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                            <button
                                onClick={() => setShowPopup(false)}
                                style={{
                                    background: 'transparent',
                                    border: '1px solid var(--text-muted)',
                                    color: 'var(--text-muted)',
                                    padding: '0.5rem 1.5rem',
                                    borderRadius: '0.5rem',
                                    cursor: 'pointer'
                                }}
                            >
                                Close
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="btn-primary"
                            >
                                Register Now
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-panel"
                style={{ padding: '3rem', width: '100%', maxWidth: '550px' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '60px', height: '60px', margin: '0 auto 1rem',
                        background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                        borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 10px 25px -5px rgba(6, 182, 212, 0.5)'
                    }}>
                        <LogIn size={32} color="white" />
                    </div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Sign in to access your AI Dermatologist</p>
                </div>

                {error && (
                    <div style={{
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid var(--error)',
                        color: 'var(--error)',
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        marginBottom: '1.5rem',
                        textAlign: 'center',
                        fontSize: '0.9rem'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem 0.75rem 3rem',
                                    background: 'rgba(0,0,0,0.2)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '0.5rem',
                                    color: 'var(--text)',
                                    outline: 'none',
                                    fontSize: '1rem'
                                }}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Password</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem 1rem 0.75rem 3rem',
                                    background: 'rgba(0,0,0,0.2)',
                                    border: '1px solid var(--glass-border)',
                                    borderRadius: '0.5rem',
                                    color: 'var(--text)',
                                    outline: 'none',
                                    fontSize: '1rem'
                                }}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem' }}>
                        Sign In
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '500' }}>
                        Register for free
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
