import React, { useState, useEffect } from 'react';
import { Trash2, Users, MessageSquare, Star, BarChart2, Shield, LogIn, LogOut,
    Activity, Clipboard, TrendingUp
} from 'lucide-react';
import { getAdminStats, getAllFeedback, deleteFeedback } from '../services/api';

export default function Admin() {
    const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [loginError, setLoginError] = useState('');
    const [activeSection, setActiveSection] = useState('dashboard');
    const [stats, setStats] = useState({
        totalUsers: 0, totalFeedback: 0, totalPredictions: 0,
        averageRating: 0, averageConfidence: 0,
        diseaseDistribution: {}, ratingCounts: {}
    });
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (sessionStorage.getItem('adminToken') === 'true') {
            setIsAdminLoggedIn(true);
            loadData();
        }
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const statsData = await getAdminStats();
            const feedbackData = await getAllFeedback();
            setStats(statsData);
            setFeedback(feedbackData.reverse());
        } catch (err) {
            console.error("Admin Load Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = (e) => {
        e.preventDefault();
        if (credentials.username === 'admin' && credentials.password === 'admin123') {
            setIsAdminLoggedIn(true);
            sessionStorage.setItem('adminToken', 'true');
            loadData();
        } else {
            setLoginError('Invalid Credentials');
        }
    };

    const handleDeleteFeedback = async (date) => {
        if (window.confirm('Are you sure you want to delete this feedback?')) {
            try {
                await deleteFeedback(date);
                loadData(); // Refresh list
            } catch (err) {
                alert('Failed to delete feedback');
            }
        }
    };

    const handleLogout = () => {
        setIsAdminLoggedIn(false);
        sessionStorage.removeItem('adminToken');
    };

    if (!isAdminLoggedIn) {
        return (
            <div className="container" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="glass-panel" style={{ padding: '3rem', width: '380px', textAlign: 'center' }}>
                    <Shield size={48} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
                    <h2 style={{ marginBottom: '2rem' }}>Admin Gateway</h2>
                    <form onSubmit={handleLogin} style={{ display: 'grid', gap: '1rem' }}>
                        <input className="input-field" type="text" placeholder="Admin ID" value={credentials.username} onChange={(e) => setCredentials({ ...credentials, username: e.target.value })} />
                        <input className="input-field" type="password" placeholder="Passcode" value={credentials.password} onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} />
                        {loginError && <p style={{ color: 'var(--error)', fontSize: '0.8rem' }}>{loginError}</p>}
                        <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>Enter Dashboard</button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '2rem 1rem', display: 'grid', gridTemplateColumns: '240px 1fr', gap: '2rem' }}>
            {/* Simple Sidebar */}
            <aside className="glass-panel" style={{ padding: '2rem 1.5rem', borderRadius: '24px', height: 'fit-content' }}>
                <div style={{ fontWeight: 800, fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Shield size={20} /> Derma Admin
                </div>
                <div style={{ display: 'grid', gap: '0.5rem' }}>
                    <Tab active={activeSection === 'dashboard'} onClick={() => setActiveSection('dashboard')} icon={<BarChart2 size={18} />} label="Overview" />
                    <Tab active={activeSection === 'feedback'} onClick={() => setActiveSection('feedback')} icon={<MessageSquare size={18} />} label="Feedback" />
                    <Tab active={activeSection === 'stats'} onClick={() => setActiveSection('stats')} icon={<Activity size={18} />} label="Disease Data" />
                    <button onClick={handleLogout} style={{ marginTop: '2rem', padding: '0.8rem', background: 'rgba(239, 68, 68, 0.1)', border: 'none', color: '#ef4444', borderRadius: '12px', cursor: 'pointer', fontWeight: 600 }}>
                        <LogOut size={16} /> Logout
                    </button>
                </div>
            </aside>

            {/* Content area - Simplified to prevent lag */}
            <main>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '1.8rem', fontWeight: 700 }}>{activeSection.toUpperCase()}</h1>
                    <button onClick={loadData} className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Refresh</button>
                </div>

                {loading ? (
                    <div style={{ padding: '4rem', textAlign: 'center', opacity: 0.5 }}>Syncing data...</div>
                ) : (
                    <div style={{ display: 'grid', gap: '2rem' }}>
                        {activeSection === 'dashboard' && <Overview stats={stats} feedback={feedback} />}
                        {activeSection === 'feedback' && <FeedbackTable feedback={feedback} onDelete={handleDeleteFeedback} />}
                        {activeSection === 'stats' && <DiseaseStats stats={stats} />}
                    </div>
                )}
            </main>
        </div>
    );
}

function Tab({ active, onClick, icon, label }) {
    return (
        <button onClick={onClick} style={{
            display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.8rem 1rem',
            borderRadius: '12px', border: 'none', cursor: 'pointer',
            background: active ? 'var(--primary)' : 'transparent',
            color: active ? 'black' : 'var(--text)',
            fontWeight: active ? 700 : 400, transition: '0.2s'
        }}>
            {icon} {label}
        </button>
    );
}

function Overview({ stats, feedback }) {
    return (
        <div style={{ display: 'grid', gap: '2rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                <StatCard label="Total Users" value={stats.totalUsers} icon={<Users color="var(--primary)" />} />
                <StatCard label="Predictions" value={stats.totalPredictions} icon={<Activity color="var(--secondary)" />} />
                <StatCard label="AI Confidence" value={stats.averageConfidence + "%"} icon={<TrendingUp color="var(--success)" />} />
                <StatCard label="User Rating" value={stats.averageRating + " / 5"} icon={<Star color="#fbbf24" />} />
            </div>

            <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <h3 style={{ marginBottom: '1rem' }}>Latest Feedback</h3>
                {feedback.slice(0, 3).map((f, i) => (
                    <div key={i} style={{ padding: '1rem 0', borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                            <span style={{ fontWeight: 600 }}>{f.username}</span>
                            <span style={{ color: '#fbbf24' }}>{'★'.repeat(f.rating || 0)}</span>
                        </div>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{f.text || f.feedback}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

function DiseaseStats({ stats }) {
    const total = stats.totalPredictions || 1;
    return (
        <div className="glass-panel" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '2rem' }}>Disease Distribution</h3>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {Object.entries(stats.diseaseDistribution).map(([name, count]) => (
                    <div key={name}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                            <span>{name}</span>
                            <span style={{ fontWeight: 700 }}>{count} cases ({Math.round(count / total * 100)}%)</span>
                        </div>
                        <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${(count / total * 100)}%`, background: 'var(--primary)' }} />
                        </div>
                    </div>
                ))}
                {Object.keys(stats.diseaseDistribution).length === 0 && <p style={{ textAlign: 'center', opacity: 0.5 }}>No prediction data available.</p>}
            </div>
        </div>
    );
}

function FeedbackTable({ feedback, onDelete }) {
    return (
        <div className="glass-panel" style={{ overflowX: 'auto' }}>
            <table className="admin-table" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid var(--glass-border)' }}>
                        <th style={{ padding: '1rem' }}>User</th>
                        <th style={{ padding: '1rem' }}>Rating</th>
                        <th style={{ padding: '1rem' }}>Message</th>
                        <th style={{ padding: '1rem' }}>Date</th>
                        <th style={{ padding: '1rem' }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {feedback.map((f, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                            <td style={{ padding: '1rem', fontWeight: 600 }}>{f.username}</td>
                            <td style={{ padding: '1rem', color: '#fbbf24' }}>{'★'.repeat(f.rating || 0)}</td>
                            <td style={{ padding: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>{f.text || f.feedback}</td>
                            <td style={{ padding: '1rem', opacity: 0.6, fontSize: '0.8rem' }}>{new Date(f.date).toLocaleDateString()}</td>
                            <td style={{ padding: '1rem' }}>
                                <button
                                    onClick={() => onDelete(f.date)}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#ef4444',
                                        cursor: 'pointer',
                                        padding: '0.5rem',
                                        borderRadius: '8px',
                                        transition: '0.2s',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                                    onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function StatCard({ label, value, icon }) {
    return (
        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '12px', borderRadius: '12px' }}>{icon}</div>
            <div>
                <div style={{ fontSize: '1.4rem', fontWeight: 800 }}>{value}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</div>
            </div>
        </div>
    );
}
