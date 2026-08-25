// Meta Pixel (Facebook Pixel) tracking helpers
// Pixel ID: 1616130006351651

declare global {
  interface Window {
    fbq: any;
    _fbq: any;
  }
}

type PixelEvent =
  | 'PageView'
  | 'ViewContent'
  | 'Search'
  | 'AddToCart'
  | 'AddToWishlist'
  | 'InitiateCheckout'
  | 'AddPaymentInfo'
  | 'Purchase'
  | 'Lead'
  | 'CompleteRegistration'
  | 'Contact'
  | 'CustomizeProduct'
  | 'Donate'
  | 'FindLocation'
  | 'Schedule'
  | 'StartTrial'
  | 'SubmitApplication'
  | 'Subscribe';

interface ViewContentParams {
  content_ids: string[];
  content_name?: string;
  content_category?: string;
  content_type?: 'product' | 'product_group';
  value?: number;
  currency?: string;
}

interface AddToCartParams {
  content_ids: string[];
  content_name?: string;
  content_category?: string;
  content_type?: 'product' | 'product_group';
  value: number;
  currency: string;
  num_items?: number;
}

interface InitiateCheckoutParams {
  content_ids: string[];
  content_name?: string;
  content_category?: string;
  content_type?: 'product' | 'product_group';
  value: number;
  currency: string;
  num_items?: number;
}

interface PurchaseParams {
  value: number;
  currency: string;
  content_ids: string[];
  content_type?: 'product' | 'product_group';
  num_items?: number;
}

export function trackPageView(): void {
  if (typeof window === 'undefined' || !window.fbq) return;
  window.fbq('track', 'PageView');
}

export function trackViewContent(params: ViewContentParams): void {
  if (typeof window === 'undefined' || !window.fbq) return;
  window.fbq('track', 'ViewContent', params);
}

export function trackAddToCart(params: AddToCartParams): void {
  if (typeof window === 'undefined' || !window.fbq) return;
  window.fbq('track', 'AddToCart', params);
}

export function trackInitiateCheckout(params: InitiateCheckoutParams): void {
  if (typeof window === 'undefined' || !window.fbq) return;
  window.fbq('track', 'InitiateCheckout', params);
}

export function trackPurchase(params: PurchaseParams): void {
  if (typeof window === 'undefined' || !window.fbq) return;
  window.fbq('track', 'Purchase', params);
}

export function trackCustomEvent(eventName: string, params?: Record<string, any>): void {
  if (typeof window === 'undefined' || !window.fbq) return;
  window.fbq('trackCustom', eventName, params);
}
