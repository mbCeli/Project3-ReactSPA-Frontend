import { createContext, useState, useEffect } from "react";

const LanguageContext = createContext();

function LanguageProviderWrapper({ children }) {
  // Get initial language from localStorage or default to 'en'
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem("language") || "en";
  });

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "es" : "en"));
  };

  // Translations object
  const translations = {
    en: {
      welcome: "Welcome to Game Hub",
      home: "Home",
      games: "Games",
      profile: "Profile",
      login: "Login",
      signup: "Sign Up",
      logout: "Logout",
      // Add more translations as needed
    },
    es: {
      welcome: "Bienvenido a Game Hub",
      home: "Inicio",
      games: "Juegos",
      profile: "Perfil",
      login: "Iniciar Sesión",
      signup: "Registrarse",
      logout: "Cerrar Sesión",
      // Add more translations as needed
    },
  };

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
