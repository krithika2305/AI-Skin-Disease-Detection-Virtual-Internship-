import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Detect from './pages/Detect';
import Recommendation from './pages/Recommendation';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';
import History from './pages/History';
import Admin from './pages/Admin';
import HowItWorks from './pages/HowItWorks';
import Chatbot from './components/Chatbot';

function App() {
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        const user = localStorage.getItem('user');
        setIsAuthenticated(!!user);
        setLoading(false);
    }, []);

    if (loading) return null;

    // Pages that don't require authentication
    const publicPages = ['/', '/about', '/login', '/register'];
    const isPublicPage = publicPages.includes(location.pathname);
    const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

    return (
        <div className="App">
            <Navbar isAuthenticated={isAuthenticated} />
            <main style={{ flex: 1 }}>
                <Routes location={location} key={location.pathname}>
                    {/* Public Routes */}
                    <Route path="/" element={<Home isAuthenticated={isAuthenticated} />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
                    <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />

                    {/* Protected Routes */}
                    <Route
                        path="/detect"
                        element={isAuthenticated ? <Detect /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/history"
                        element={isAuthenticated ? <History /> : <Navigate to="/login" />}
                    />
                    <Route
                        path="/recommendation"
                        element={isAuthenticated ? <Recommendation /> : <Navigate to="/login" />}
                    />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="/how-it-works" element={<HowItWorks />} />
                </Routes>
            </main>
            <Footer />
            <Chatbot />
        </div>
    );
}

export default App;
