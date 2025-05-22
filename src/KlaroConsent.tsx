
import React, { useEffect, useState } from 'react';
import './Klaro-config'; // your Klaro config
import 'klaro/dist/klaro.css';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const getUserLanguage = () => {
  const lang = navigator.language;
  const supportedLanguages = ['en', 'de', 'fr', 'es'];
  return supportedLanguages.includes(lang.slice(0, 2)) ? lang.slice(0, 2) : 'en';
};

const ConsentManager = () => {
  const lang = getUserLanguage();
  const [showButton, setShowButton] = useState(false);
  const [matomoConsent, setMatomoConsent] = useState(null);

  // Utility: Send Matomo event to track consent
  const trackMatomoConsent = (accepted) => {
    if (window._paq) {
      window._paq.push([
        'trackEvent',
        'CookieConsent',
        accepted ? 'Accepted' : 'Declined',
      ]);
    }
  };

  // You could also fetch Matomo user consent from your server API or Matomo API here,
  // but this requires backend and proper API auth. Usually, the local consent is the source of truth.

  useEffect(() => {
    if (!window.klaroConfig) {
      console.error('Klaro configuration not found!');
      return;
    }
    window.klaroConfig.lang = lang;

    const script = document.createElement('script');
    script.src = 'https://cdn.kiprotect.com/klaro/latest/klaro.js';
    script.async = true;

    script.onload = () => {
      const klaro = window.klaro;
      if (!klaro?.getManager) {
        console.error('Klaro manager is not available');
        return;
      }

      const manager = klaro.getManager();

      // Show Klaro popup if no confirmation yet
      if (!manager.confirmed) {
        klaro.show();
      }

      const updateState = () => {
        const consents = manager.consents || {};
        const acceptedAny = Object.values(consents).some(v => v === true);
        setShowButton(acceptedAny);
        setMatomoConsent(consents['matomo'] ?? null);

        // Track Matomo consent event
        if (typeof consents['matomo'] === 'boolean') {
          trackMatomoConsent(consents['matomo']);
        }
      };

      updateState();

      // Watch for changes - pass object with update fn to avoid "n.update is not a function" error
      manager.watch({
        update: () => {
          updateState();
        },
      });
    };

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [lang]);

  const resetCookies = () => {
    if (window.klaro?.getManager) {
      window.klaro.show();
    } else {
      console.error('Klaro manager not ready');
    }
  };

  return (
    <>
      <div id="klaro"></div>

      {showButton && (
        <OverlayTrigger overlay={<Tooltip id="tooltip-1">Manage Cookie Preferences</Tooltip>}>
          <span
            className='Klaro-reset-Btn'
            onClick={resetCookies}
            style={{ cursor: 'pointer' }}
          >
            {/* Your SVG icon here */}
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="32" viewBox="0 0 30 32" fill="none">
              <path fillRule="evenodd" clipRule="evenodd" d="M0 3C0 1.34315 1.43909 0 3.21429 0H26.7857C28.561 0 30 1.34315 30 3V14.3389C30 16.2592 29.9677 18.5203 28.8967 20.4738C27.9445 22.211 26.4485 23.7793 24.3114 25.5297C22.1777 27.2772 19.335 29.2609 15.6356 31.8051C15.2576 32.065 14.7424 32.065 14.3644 31.8051C10.665 29.2609 7.82226 27.2772 5.68863 25.5297C3.55142 23.7793 2.05558 22.211 1.10324 20.4738C0.0322468 18.5203 0 16.2592 0 14.3389V3ZM21.0739 10.7433C21.5137 10.3738 21.5494 9.74154 21.1535 9.33103C20.7576 8.92052 20.0802 8.88724 19.6404 9.2567L13.2142 14.6546L10.3596 12.2567C9.91977 11.8872 9.24231 11.9205 8.84647 12.331C8.45062 12.7415 8.48628 13.3738 8.92611 13.7433L12.4976 16.7433C12.905 17.0856 13.5236 17.0856 13.931 16.7433L21.0739 10.7433Z" fill="#005437" />
            </svg>
          </span>
        </OverlayTrigger>
      )}

      <div style={{ marginTop: 12, fontSize: 14 }}>
        <strong>Matomo Consent Status:</strong>{' '}
        {matomoConsent === null
          ? 'No decision yet'
          : matomoConsent
            ? 'Accepted'
            : 'Declined'}
      </div>
    </>
  );
};

export default ConsentManager;
