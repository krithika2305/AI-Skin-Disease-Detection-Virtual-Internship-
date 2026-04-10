import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, User, Lock, Mail, Type } from 'lucide-react';

const API_URL = 'http://localhost:5000';

export default function Register() {
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    username: formData.username,
                    password: formData.password
                })
            });

            const data = await response.json();

            if (response.ok) {
                navigate('/login');
            } else {
                setError(data.error || 'Registration failed');
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
            paddingTop: '5rem',
            paddingBottom: '2rem'
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-panel"
                style={{ padding: '3rem', width: '100%', maxWidth: '650px' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <div style={{
                        width: '60px', height: '60px', margin: '0 auto 1rem',
                        background: 'linear-gradient(135deg, var(--accent), var(--secondary))',
                        borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 10px 25px -5px rgba(244, 114, 182, 0.5)'
                    }}>
                        <UserPlus size={32} color="white" />
                    </div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Create Account</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Join DermaAI today</p>
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

                <form onSubmit={handleRegister}>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Email Address</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="john@example.com"
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

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Username</label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                            <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Choose a username"
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

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                        <div>
                            <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Password</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 0.5rem 0.75rem 2.5rem',
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
                        <div>
                            <label style={{ display: 'block', color: 'var(--text-muted)', marginBottom: '0.5rem', fontSize: '0.9rem' }}>Confirm</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 0.5rem 0.75rem 2.5rem',
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
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem' }}>
                        Create Account
                    </button>
                </form>

                <div style={{ marginTop: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '500' }}>
                        Sign In
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
