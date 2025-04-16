// frontend/app/listings/checkout/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '../../../lib/stripe';
import PaymentForm from '../../../components/checkout/payment-form';
import { useSearchParams } from 'next/navigation';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const listingId = searchParams.get('listingId');
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      if (!listingId) {
        setError('No listing specified');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/listings/${listingId}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch listing');
        }
        
        setListing(data);
      } catch (err) {
        setError('Error loading listing details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (error || !listing) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
        <h2 className="text-xl font-bold text-red-600">Error</h2>
        <p>{error || 'Listing not found'}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Elements stripe={stripePromise}>
        <PaymentForm 
          listingId={listingId as string} 
          price={listing.price} 
          title={listing.title} 
        />
      </Elements>
    </div>
  );
}