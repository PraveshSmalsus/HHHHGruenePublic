import { useEffect } from 'react';

const MatomoIntegration = () => {
  useEffect(() => {
    const initializeMatomo = () => {
      const _paq = (window._paq = window._paq || []);
      _paq.push(['trackPageView']);
      _paq.push(['enableLinkTracking']);
      _paq.push(['setTrackerUrl', 'https://gruene-weltweit.de/matomo/matomo.php']); // Replace with your Matomo URL
      _paq.push(['setSiteId', '1']); // Replace with your Matomo site ID

      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://gruene-weltweit.de/matomo/matomo.js'; // Replace with your Matomo URL
      script.type = 'text/plain';
      script.setAttribute('data-cookieconsent', 'statistics'); // Waits for "Statistics" consent
      document.head.appendChild(script);
    };

    const handleConsentUpdate = () => {
      const consent = window.CookieConsent && window.CookieConsent.consent;
      if (consent && consent.statistics) {
        initializeMatomo();
      }
    };

    // Check consent initially
    handleConsentUpdate();

    // Update on consent change
    window.addEventListener('CookiebotOnAccept', handleConsentUpdate);
    window.addEventListener('CookiebotOnDecline', handleConsentUpdate);

    return () => {
      window.removeEventListener('CookiebotOnAccept', handleConsentUpdate);
      window.removeEventListener('CookiebotOnDecline', handleConsentUpdate);
    };
  }, []);

  return null; // This component doesn't render anything
};

export default MatomoIntegration;
