import React, { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    nav: {
      home: 'Home',
      detector: 'AI Detector',
      dashboard: 'Dashboard',
      history: 'History',
      about: 'About AI',
      contact: 'Contact',
      admin: 'Admin Panel',
      login: 'Sign In',
      register: 'Get Started',
      profile: 'My Profile',
      logout: 'Sign Out'
    },
    hero: {
      badge: 'Powered by NLP & Machine Learning',
      title: 'Detect Fake News instantly with High-Precision AI',
      subtitle: 'Analyze news headlines, full articles, text files, and images to uncover misinformation and verify truth.',
      startBtn: 'Analyze News Now',
      demoBtn: 'Explore Live Dashboard'
    },
    detector: {
      headlineTab: 'Headline / Text',
      fileTab: 'Upload Document (.txt)',
      voiceTab: 'Voice Input',
      ocrTab: 'Scan Image (OCR)',
      headlinePlaceholder: 'Enter news headline or paste news article text here...',
      submitBtn: 'Analyze with TruthLens AI',
      clearBtn: 'Clear Input',
      presets: 'Sample Test Cases:'
    }
  },
  es: {
    nav: {
      home: 'Inicio',
      detector: 'Detector IA',
      dashboard: 'Panel',
      history: 'Historial',
      about: 'Sobre la IA',
      contact: 'Contacto',
      admin: 'Panel Admin',
      login: 'Iniciar Sesión',
      register: 'Registrarse',
      profile: 'Mi Perfil',
      logout: 'Cerrar Sesión'
    },
    hero: {
      badge: 'Impulsado por PLN y Aprendizaje Automático',
      title: 'Detecta Noticias Falsas al instante con IA de Alta Precisión',
      subtitle: 'Analiza titulares, artículos, archivos de texto e imágenes para desmentir la desinformación.',
      startBtn: 'Analizar Noticia Ahora',
      demoBtn: 'Explorar Panel en Vivo'
    },
    detector: {
      headlineTab: 'Titular / Texto',
      fileTab: 'Subir Documento (.txt)',
      voiceTab: 'Entrada de Voz',
      ocrTab: 'Escanear Imagen (OCR)',
      headlinePlaceholder: 'Ingrese el titular de la noticia o pegue el texto aquí...',
      submitBtn: 'Analizar con TruthLens IA',
      clearBtn: 'Limpiar',
      presets: 'Casos de prueba de muestra:'
    }
  },
  fr: {
    nav: {
      home: 'Accueil',
      detector: 'Détecteur IA',
      dashboard: 'Tableau de bord',
      history: 'Historique',
      about: 'À propos',
      contact: 'Contact',
      admin: 'Admin',
      login: 'Connexion',
      register: 'Inscription',
      profile: 'Mon Profil',
      logout: 'Déconnexion'
    },
    hero: {
      badge: 'Propulsé par le Traitement du Langage Naturel',
      title: 'Détectez les Fausses Nouvelles instantanément grâce à l’IA',
      subtitle: 'Analysez les titres, articles complets, fichiers texte et images pour vérifier la vérité.',
      startBtn: 'Analyser une nouvelle',
      demoBtn: 'Explorer le tableau de bord'
    },
    detector: {
      headlineTab: 'Titre / Texte',
      fileTab: 'Fichier Texte (.txt)',
      voiceTab: 'Entrée Vocale',
      ocrTab: 'Scanner une Image (OCR)',
      headlinePlaceholder: 'Entrez le titre ou collez le texte de l’article ici...',
      submitBtn: 'Analyser avec TruthLens IA',
      clearBtn: 'Effacer',
      presets: 'Exemples de test :'
    }
  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('truthlens_lang') || 'en');

  const changeLanguage = (newLang) => {
    if (translations[newLang]) {
      setLang(newLang);
      localStorage.setItem('truthlens_lang', newLang);
    }
  };

  const t = (keyPath) => {
    const keys = keyPath.split('.');
    let current = translations[lang] || translations.en;
    for (const k of keys) {
      if (current[k] === undefined) return keyPath;
      current = current[k];
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ lang, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
