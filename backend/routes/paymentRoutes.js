// backend/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const stripe = require('../config/stripe');
const Listing = require('../models/Listing');
const auth = require('../middleware/auth');

// Create a payment intent
router.post('/create-payment-intent', auth, async (req, res) => {
  try {
    const { listingId } = req.body;
    
    // Get listing details from database
    const listing = await Listing.findById(listingId);
    
    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }
    
    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(listing.price * 100), // Stripe uses cents
      currency: 'usd',
      metadata: {
        listingId: listing._id.toString(),
        buyerId: req.user.id,
        sellerId: listing.user.toString()
      }
    });
    
    res.status(200).json({ 
      clientSecret: paymentIntent.client_secret,
      listingId: listing._id,
      amount: listing.price
    });
  } catch (error) {
    console.error('Payment intent error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Webhook to handle successful payments
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).json({ message: `Webhook Error: ${err.message}` });
  }
  
  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    
    // Update listing status or create a transaction record
    const listingId = paymentIntent.metadata.listingId;
    const buyerId = paymentIntent.metadata.buyerId;
    
    // Update listing status to sold or create transaction record
    // This would depend on your business logic
    
    console.log(`Payment succeeded for listing ${listingId}`);
  }
  
  res.status(200).json({ received: true });
});

module.exports = router;