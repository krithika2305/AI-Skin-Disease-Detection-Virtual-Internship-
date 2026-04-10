import React, { createContext, useState, useContext, useEffect } from 'react';
import en from './i18n/en.json';
import hi from './i18n/hi.json';
import kn from './i18n/kn.json';

const translations = { en, hi, kn };
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');

    useEffect(() => {
        localStorage.setItem('lang', lang);
    }, [lang]);

    const t = (path) => {
        const keys = path.split('.');
        let result = translations[lang];
        for (const key of keys) {
            if (result && result[key]) {
                result = result[key];
            } else {
                return path; // Fallback to path name
            }
        }
        return result;
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
