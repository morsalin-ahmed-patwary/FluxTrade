// frontend/app/listings/success/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const listingId = searchParams.get('listingId');
  const [listing, setListing] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Add error state

  useEffect(() => {
    const fetchListing = async () => {
      if (!listingId) {
        router.push('/');
        return;
      }

      try {
        const response = await fetch(`/api/listings/${listingId}`);
        const data = await response.json();
        
        if (response.ok) {
          setListing(data);
        } else {
          // Handle error response
          setError(data.message || 'Failed to fetch listing');
        }
      } catch (err) {
        console.error(err);
        setError('Error loading listing details');
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [listingId, router]);

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  // Add error handling UI
  if (error) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10 text-center">
        <h2 className="text-xl font-bold text-red-600">Error</h2>
        <p>{error}</p>
        <div className="mt-6">
          <Link href="/listings" className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 inline-block">
            Return to Listings
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10 text-center">
      <div className="mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
      </div>
      
      <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
      
      <p className="mb-6">
        Thank you for your purchase. Your payment for{' '}
        <span className="font-semibold">{listing?.title || 'this item'}</span> has been processed successfully.
      </p>
      
      <div className="mt-8">
        <Link href="/listings" className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 inline-block">
          Browse More Listings
        </Link>
      </div>
    </div>
  );
}