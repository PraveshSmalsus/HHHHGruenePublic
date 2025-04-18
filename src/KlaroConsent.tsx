import React, { useEffect } from 'react';
import './Klaro-config'; // Ensure the Klaro config is imported
import 'klaro/dist/klaro.css'; // Include Klaro styles

const getUserLanguage = () => {
  const lang = navigator.language;
  const supportedLanguages = ['en', 'de', 'fr', 'es'];
  return supportedLanguages.includes(lang.slice(0, 2)) ? lang.slice(0, 2) : 'en';
//   return lang.startsWith('de') ? 'de' : 'en'; // Default to English if not German
};

const ConsentManager = () => {
  const lang = getUserLanguage();
  console.log(`Load consent manager with language: ${lang}`);

  useEffect(() => {
    if (!window.klaroConfig) {
      console.error('Klaro configuration not found!');
      return;
    }

    window.klaroConfig.lang = lang; // Set Klaro language dynamically

    const script = document.createElement('script');
    script.src = 'https://cdn.kiprotect.com/klaro/latest/klaro.js';
    script.async = true;
    script.onload = () => {
      if (window.klaro?.getManager) {
        const manager = window.klaro.getManager();
        const consents = manager.consents;
        console.log('Klaro consents:', consents);

        if (!consents || Object.keys(consents).length === 0) {
          window.klaro.show();
        } else {
          console.log('Consent already given');
        }
      } else {
        console.error('Klaro failed to initialize!');
      }
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [lang]);

  return (
    <div id="klaro"></div>
  )
};

export default ConsentManager;
 