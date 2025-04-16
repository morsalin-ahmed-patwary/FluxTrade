// frontend/app/components/checkout/payment-form.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { initiatePayment } from '../../lib/stripe';

interface PaymentFormProps {
  listingId: string;
  price: number;
  title: string;
}

const PaymentForm = ({ listingId, price, title }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      // Stripe.js hasn't loaded yet
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Get payment intent client secret
      const { clientSecret } = await initiatePayment(listingId);
      
      // Confirm payment with card element
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) return;
      
      const { error: paymentError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement },
      });
      
      if (paymentError) {
        setError(paymentError.message || 'Payment failed');
      } else if (paymentIntent.status === 'succeeded') {
        // Payment successful, redirect to success page
        router.push(`/listings/checkout/success?listingId=${listingId}`);
      }
    } catch (err) {
      setError('Payment processing failed. Please try again.');
      console.error('Payment error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Complete Your Purchase</h2>
      <div className="mb-6">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-xl font-bold text-green-600">${price.toFixed(2)}</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Card Details</label>
          <div className="border border-gray-300 rounded-md p-3">
            <CardElement options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }} />
          </div>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        
        <button 
          type="submit" 
          disabled={!stripe || loading} 
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Processing...' : `Pay $${price.toFixed(2)}`}
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;