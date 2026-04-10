import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Microscope, Activity, Info, Home, Clock, LogOut, LogIn, UserPlus, HelpCircle, Shield, Globe } from 'lucide-react';
import { useLanguage } from '../LanguageContext';

export default function Navbar({ isAuthenticated }) {
    const navigate = useNavigate();
    const { lang, setLang, t } = useLanguage();

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
        window.location.reload();
    };

    return (
        <header className="app-header">
            <div className="container nav-container">
                <NavLink to="/" className="logo">
                    <Microscope size={28} />
                    <span>DermaAI</span>
                </NavLink>
                <nav className="nav-links">
                    <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Home size={18} />
                            <span>{t('navbar.home')}</span>
                        </div>
                    </NavLink>

                    {isAuthenticated ? (
                        <>
                            <NavLink to="/detect" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Activity size={18} />
                                    <span>{t('navbar.detect')}</span>
                                </div>
                            </NavLink>
                            <NavLink to="/history" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <Clock size={18} />
                                    <span>{t('navbar.history')}</span>
                                </div>
                            </NavLink>
                            <NavLink to="/recommendation" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <span>{t('navbar.recommendations')}</span>
                                </div>
                            </NavLink>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <LogIn size={18} />
                                    <span>{t('navbar.login')}</span>
                                </div>
                            </NavLink>
                            <NavLink to="/register" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <UserPlus size={18} />
                                    <span>{t('navbar.register')}</span>
                                </div>
                            </NavLink>
                        </>
                    )}

                    <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Info size={18} />
                            <span>{t('navbar.about')}</span>
                        </div>
                    </NavLink>

                    {/* Admin option ONLY for admin users */}
                    {JSON.parse(localStorage.getItem('user'))?.role === 'admin' && (
                        <NavLink to="/admin" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Shield size={18} />
                                <span>{t('navbar.admin')}</span>
                            </div>
                        </NavLink>
                    )}

                    {isAuthenticated && (
                        <button onClick={handleLogout} className="nav-link" style={{ background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--error)' }}>
                            <LogOut size={18} />
                            <span>{t('navbar.logout')}</span>
                        </button>
                    )}

                    {/* Language Selector */}
                    <div className="language-selector" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: '1rem', background: 'rgba(255,255,255,0.05)', padding: '0.3rem 0.6rem', borderRadius: '20px' }}>
                        <Globe size={16} color="var(--primary)" />
                        <select 
                            value={lang} 
                            onChange={(e) => setLang(e.target.value)}
                            style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '0.85rem', cursor: 'pointer', outline: 'none' }}
                        >
                            <option value="en" style={{ background: '#1a1a1a' }}>English</option>
                            <option value="hi" style={{ background: '#1a1a1a' }}>हिन्दी</option>
                            <option value="kn" style={{ background: '#1a1a1a' }}>ಕನ್ನಡ</option>
                        </select>
                    </div>
                </nav>
            </div>
        </header>
    );
}
