import React from 'react';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container">
                <p>&copy; {new Date().getFullYear()} AI Skin Disease Detection. All rights reserved.</p>
            </div>
        </footer>
    );
}
