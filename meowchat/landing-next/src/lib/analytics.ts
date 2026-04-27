declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

function pushDataLayer(payload: Record<string, unknown>) {
  if (typeof window === 'undefined') return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(payload);
}

export function pageview(url: string) {
  if (typeof window === 'undefined') return;

  if (GA_MEASUREMENT_ID && typeof window.gtag === 'function') {
    window.gtag('config', GA_MEASUREMENT_ID, { page_path: url });
  }

  pushDataLayer({ event: 'page_view', page_path: url });
}

export function trackCTA(params: {
  location: string;
  label: string;
  destination: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
}) {
  const payload = {
    event: 'cta_click',
    cta_location: params.location,
    cta_label: params.label,
    cta_destination: params.destination,
    cta_variant: params.variant || 'primary',
  };

  if (typeof window !== 'undefined' && GA_MEASUREMENT_ID && typeof window.gtag === 'function') {
    window.gtag('event', 'cta_click', payload);
  }

  pushDataLayer(payload);
}
