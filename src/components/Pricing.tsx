import React, { useState } from 'react';
import { Check, Star, Crown, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface PricingTier {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  icon: React.ReactNode;
  popular?: boolean;
  buttonText: string;
}

const pricingTiers: PricingTier[] = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    description: 'Perfect for getting started with fitness tracking',
    icon: <Check className="h-6 w-6" />,
    features: [
      'Workout logging and basic goals',
      'Dashboard overview',
      'Water and step tracking',
      'Basic workout templates',
      'Community leaderboard'
    ],
    buttonText: 'Current Plan'
  },
  {
    name: 'Basic Premium',
    price: '$7.99',
    period: 'per month',
    description: 'Enhanced features for serious fitness enthusiasts',
    icon: <Star className="h-6 w-6" />,
    features: [
      'All Free features',
      'AI-powered workout plans',
      'Advanced analytics and insights',
      'Wearables sync (Google Fit, Apple Health)',
      'Enhanced health assessments',
      'Priority customer support'
    ],
    buttonText: 'Upgrade to Basic'
  },
  {
    name: 'Pro Premium',
    price: '$19.99',
    period: 'per month',
    description: 'Complete fitness management solution',
    icon: <Zap className="h-6 w-6" />,
    features: [
      'All Basic Premium features',
      'Nutrition tracking and meal logging',
      'Advanced social challenges',
      'Data export and detailed reports',
      'Custom goal templates',
      'Advanced progress tracking'
    ],
    buttonText: 'Upgrade to Pro'
  },
  {
    name: 'Elite',
    price: '$59.99',
    period: 'per month',
    description: 'Ultimate fitness experience with personal coaching',
    icon: <Crown className="h-6 w-6" />,
    popular: true,
    features: [
      'All Pro Premium features',
      '1-on-1 coaching sessions',
      'Direct trainer access',
      'Fully customized plans',
      'Exclusive premium content',
      'AI chatbot for motivation',
      'Advanced webinars and workshops'
    ],
    buttonText: 'Upgrade to Elite'
  }
];

export function Pricing() {
  const { user, updateSubscription } = useAuth();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const handleUpgrade = async (tier: string) => {
    if (!user) {
      alert('Please log in to upgrade your plan.');
      return;
    }

    // Map tier names to subscription values
    const subscriptionMap: { [key: string]: string } = {
      'Free': 'free',
      'Basic Premium': 'basic',
      'Pro Premium': 'pro',
      'Elite': 'elite'
    };

    const subscriptionValue = subscriptionMap[tier];

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ subscription: subscriptionValue })
        .eq('id', user.id)
        .select()
        .single();

      if (error) throw error;

      updateSubscription(subscriptionValue);
      alert(`Successfully upgraded to ${tier}! Your subscription has been updated.`);
      // In a real app, you would redirect to payment processor here
    } catch (error) {
      console.error('Error upgrading subscription:', error);
      alert('Failed to upgrade subscription. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Choose Your Plan</h1>
        <p className="text-lg text-gray-600">
          Unlock your full fitness potential with our premium features
        </p>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center mb-12">
        <span className={`mr-4 text-lg font-medium ${billingPeriod === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}>
          Monthly
        </span>
        <button
          onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
            billingPeriod === 'yearly' ? 'bg-blue-600' : 'bg-gray-300'
          }`}
          aria-label="Toggle billing period"
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
              billingPeriod === 'yearly' ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
        <span className={`ml-4 text-lg font-medium ${billingPeriod === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}>
          Yearly
          <span className="ml-2 text-sm text-green-600 font-semibold">Save 20%</span>
        </span>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {pricingTiers.map((tier) => (
          <div
            key={tier.name}
            className={`relative bg-gradient-to-br p-6 rounded-xl shadow-lg border-2 transition-transform transform hover:scale-105 ${
              tier.popular ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'
            }`}
          >
            {tier.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold tracking-wide">
                  Most Popular
                </span>
              </div>
            )}

            <div className="text-center mb-6">
              <div className={`inline-flex justify-center mb-4 p-4 rounded-full ${
                tier.name === 'Free' ? 'bg-gray-100 text-gray-600' :
                tier.name === 'Basic Premium' ? 'bg-yellow-100 text-yellow-600' :
                tier.name === 'Pro Premium' ? 'bg-purple-100 text-purple-600' :
                'bg-yellow-300 text-yellow-700'
              }`}>
                {tier.icon}
              </div>
              <h3 className="text-2xl font-extrabold text-gray-900 mb-2">{tier.name}</h3>
              <div className="mb-3">
                <span className="text-4xl font-extrabold text-gray-900">
                  {billingPeriod === 'yearly' && tier.name !== 'Free'
                    ? `$${Math.round(parseFloat(tier.price.slice(1)) * 12 * 0.8)}`
                    : tier.price
                  }
                </span>
                <span className="text-gray-600 ml-1">
                  {tier.name === 'Free' ? '' : billingPeriod === 'yearly' ? '/year' : ` ${tier.period}`}
                </span>
              </div>
              <p className="text-gray-700 text-sm">{tier.description}</p>
            </div>

            <ul className="space-y-3 mb-6 text-gray-700 text-sm">
              {tier.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleUpgrade(tier.name)}
              className={`w-full py-3 px-4 rounded-md font-semibold transition-colors ${
                tier.name === 'Free'
                  ? 'bg-gray-200 text-gray-700 cursor-default'
                  : tier.popular
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-800 text-white hover:bg-gray-900'
              }`}
              disabled={tier.name === 'Free'}
              aria-label={tier.buttonText}
            >
              {tier.buttonText}
            </button>
          </div>
        ))}
      </div>

      {/* FAQ Section */}
      <div className="mt-16 max-w-4xl mx-auto">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-10">Frequently Asked Questions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-gray-700 text-base">
          <div>
            <h3 className="font-semibold mb-2">Can I change plans anytime?</h3>
            <p>Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Is there a free trial?</h3>
            <p>Our Basic Premium plan includes a 7-day free trial. No credit card required to start.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
            <p>We accept all major credit cards, PayPal, and Apple Pay for your convenience.</p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
            <p>Absolutely! Cancel your subscription at any time with no penalties or hidden fees.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
