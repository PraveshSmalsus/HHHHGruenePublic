export {}; // Ensure this file is treated as a module

declare global {
  interface Window {
    klaroConfig?: any;
    klaro?:any; 
    klaroInitialized?:boolean // Declare klaroConfig as optional
  }
}

// Define klaroConfig globally on the window object
window.klaroConfig = {
  version: 1,
  elementID: 'klaro', // The ID of the Klaro container
  storageMethod: 'cookie', // Use 'cookie' or 'localStorage'
  cookieName: 'klaro-consent', // The name of the consent cookie
  cookieExpiresAfterDays: 180, // Cookie expiration time
  privacyPolicy: '/Datenschutz', // URL of your privacy policy
  default: true, // Whether to ask for consent for all services by default
  mustConsent: false, // Require user consent before loading the app
  acceptAll: true, // Allow users to accept all services
  // noAutoLoad: true,
  services: [
    {
      name: 'matomo',
      title: 'Matomo Analytics',
      purposes: ['analytics'],
      cookies: [/^pk.*$/, /^mtm.*$/, /^MATOMO.*$/],
      // default: true,
      required: false, // Set true if this is essential for the app
      // optOut: false,
      // onlyOnce: true,
    },
  ],
  translations: {
    zz: {
      privacyPolicyUrl: '/#privacy',
    },
    en: {
      consentModal: {
        title: 'Privacy Settings',
        description: 'We use cookies to improve your experience. Manage your preferences below.',
      },
      matomo: {
        description: 'Collects anonymous usage data to help us improve our website.',
      },
      purposes: {
        analytics: 'Analytics',
      },
    },
    de: {
      privacyPolicyUrl: '/#datenschutz',
      consentModal: {
        description:
          'Wir verwenden Cookies, um Ihr Erlebnis zu verbessern. Verwalten Sie unten Ihre Präferenzen.',
      },
  },
},
  styling: {
    theme: ['dark', 'bottom'],
  },
  additionalClass: 'klaro-short-bottom-right',
};
