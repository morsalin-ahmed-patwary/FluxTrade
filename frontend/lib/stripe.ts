// frontend/lib/stripe.ts
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

// Create a payment intent and redirect to checkout
export const initiatePayment = async (listingId: string) => {
  try {
    // Get payment intent from your API
    const response = await fetch('/api/payments/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Include auth token if needed
        'x-auth-token': localStorage.getItem('token') || ''
      },
      body: JSON.stringify({ listingId })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Payment initialization failed');
    }
    
    return data;
  } catch (error) {
    console.error('Payment initiation error:', error);
    throw error;
  }
};