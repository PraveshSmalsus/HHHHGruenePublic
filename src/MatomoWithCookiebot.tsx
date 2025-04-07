import React, { useEffect } from 'react';


// declare global {
//   interface Window {
//     klaro?: any;
//   }
// }

const ConsentManager = () => {
  console.log('load consent manager')
  useEffect(() => {
    if (!window.klaroConfig) {
      console.error('Klaro configuration not found!');
      return;
    }
  
    const script = document.createElement('script');
    script.src = 'https://cdn.kiprotect.com/klaro/latest/klaro.js';
    script.async = true;
    script.innerHTML = `
            function KlaroWatcher() {};
            KlaroWatcher.prototype.update = function(obj, name, data) { 
              if (data !== 'undefined' && data.hasOwnProperty('matomo')) {
                if (data.matomo) { 
                  _paq.push(['rememberCookieConsentGiven']);
                  _paq.push(['setConsentGiven']);
                } else {
                  _paq.push(['forgetCookieConsentGiven']);
                  _paq.push(['deleteCookies']);
                }
              }  
            }; 
            window.kw = new KlaroWatcher();

            var waitForTrackerCount = 0;
            function matomoWaitForTracker() {
              if (typeof _paq === 'undefined' || typeof klaro === 'undefined') {                
                if (waitForTrackerCount < 40) {
                  setTimeout(matomoWaitForTracker, 250);
                  waitForTrackerCount++;  
                  return;
                }
              } else {
                klaro.getManager().watch(kw);
              }
            }  
            document.addEventListener('DOMContentLoaded', matomoWaitForTracker());
        `;
        script.onload = () => {
          if (typeof window.klaro === 'object' && typeof window.klaro.getManager === 'function') {
            const manager = window.klaro.getManager();
        
            if (manager && typeof manager.getConsents === 'function') {
              const consents = manager.getConsents();
              console.log('Klaro consents:', consents);
        
              if (!consents || Object.keys(consents).length === 0) {
                window.klaro.show();
              } else {
                console.log('Consent already given');
              }
            } else {
              console.error('Klaro manager or getConsents method not available!');
            }
          } else {
            console.error('Klaro failed to initialize!');
          }
        };
    document.body.appendChild(script);
  
    return () => {
      document.body.removeChild(script);
    };
  }, []);
  

  return <div id="klaro"></div>; // Ensure this ID matches the one in klaroConfig
};

export default ConsentManager;
