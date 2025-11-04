import type { ClientModule } from '@docusaurus/types';

// Extend Window interface for ChatWidget
declare global {
  interface Window {
    ChatWidget?: any;
  }
}

const isCrawl = typeof navigator !== 'undefined' && /bot|crawler|spider|crawling/i.test(navigator.userAgent);

// Chat widget configuration
const chatWidgetConfig = {
  scriptUrl: 'https://chat.openmetal.app/widget/widget.js',
  settings: {
    theme: {
      primaryColor: '#007bff',
      position: 'bottom-right'
    },
    size: {
      width: '550px',
      height: '600px',
      bubbleSize: '60px'
    },
    branding: {
      companyName: 'OpenMetal',
      welcomeMessage: 'How can we help?'
    },
    features: {
      emailCollection: true,
      autoGreeting: true,
      scheduleMeeting: {
        enabled: true,
        meetingLink: 'https://meetings.hubspot.com/peterl6'
      }
    }
  }
};

// Load chat widget script
function loadChatWidget() {
  if (typeof window === 'undefined') {
    return;
  }

  // Don't load for bots/crawlers
  if (isCrawl) {
    console.log('Chat widget disabled for crawlers');
    return;
  }

  // Check if script already exists
  const existingScript = document.querySelector(`script[src*="widget.js"]`);
  if (existingScript) {
    return;
  }

  // Create and load the script
  const script = document.createElement('script');
  script.src = chatWidgetConfig.scriptUrl;
  script.async = true;
  script.id = 'openmetal-chat-widget';

  script.onload = () => {
    // Initialize the widget after script loads
    if (window.ChatWidget) {
      window.ChatWidget.init(chatWidgetConfig.settings);
      console.log('OpenMetal chat widget initialized');
    }
  };

  script.onerror = () => {
    console.error('Failed to load chat widget script');
  };

  document.head.appendChild(script);
}

// Initialize on client side
if (typeof window !== 'undefined') {
  loadChatWidget();
}

const clientModule: ClientModule = {
  onRouteUpdate({ location, previousLocation }) {
    // Ensure widget persists on route changes
    if (previousLocation && location.pathname !== previousLocation.pathname) {
      // Widget should automatically persist, but you can add
      // custom logic here if needed
    }
  }
};

export default clientModule;
