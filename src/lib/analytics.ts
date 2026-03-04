// Google Analytics event tracking utility
// Replace G-XXXXXXXXXX with your actual GA4 Measurement ID

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export const trackEvent = (eventName: string, params?: Record<string, string | number>) => {
  if (window.gtag) {
    window.gtag('event', eventName, params);
  }
  console.log(`[Analytics] ${eventName}`, params);
};

export const EVENTS = {
  PRIMARY_CTA_CLICK: 'primary_cta_click',
  SECONDARY_CTA_CLICK: 'secondary_cta_click',
  CALCULATOR_USED: 'calculator_used',
  FORM_SUBMITTED: 'form_submitted',
} as const;
