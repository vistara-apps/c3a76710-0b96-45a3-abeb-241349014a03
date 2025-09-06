'use client';

import { useState } from 'react';
import { X, Check, Zap, Bell, FolderOpen } from 'lucide-react';
import { useTaskFlowStore } from '@/lib/store';
import { useAuth } from '@/lib/hooks/useAuth';
import { LoadingSpinner } from './LoadingSpinner';

const FEATURES = [
  {
    id: 'notifications',
    name: 'Smart Notifications',
    description: 'Get daily task reminders and milestone alerts',
    price: '0.001 ETH',
    icon: Bell,
    benefits: [
      'Daily task reminders',
      'Project milestone alerts',
      'Custom notification timing',
      'Farcaster cast notifications',
    ],
  },
  {
    id: 'project_linking',
    name: 'Project Linking',
    description: 'Organize tasks by projects with visual progress tracking',
    price: '0.002 ETH',
    icon: FolderOpen,
    benefits: [
      'Unlimited projects',
      'Task-project associations',
      'Visual progress tracking',
      'Project status management',
    ],
  },
  {
    id: 'premium_bundle',
    name: 'Premium Bundle',
    description: 'Get both features at a discounted price',
    price: '0.0025 ETH',
    icon: Zap,
    benefits: [
      'All notification features',
      'All project features',
      'Priority support',
      'Early access to new features',
    ],
    popular: true,
  },
];

export function PremiumModal() {
  const { isPremiumModalOpen, setPremiumModalOpen, user, isLoading } = useTaskFlowStore();
  const { refreshUserFeatures } = useAuth();
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isPremiumModalOpen) return null;

  const handlePurchase = async (featureId: string) => {
    if (!user) return;

    try {
      setIsProcessing(true);
      setSelectedFeature(featureId);

      // In a real implementation, this would:
      // 1. Open a wallet connection modal
      // 2. Request payment to the contract address
      // 3. Wait for transaction confirmation
      // 4. Activate the feature

      // Simulate payment process
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock transaction hash
      const mockTxHash = `0x${Math.random().toString(16).substr(2, 64)}`;

      // Activate subscription
      const response = await fetch('/api/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.userId,
          featureType: featureId,
          transactionHash: mockTxHash,
        }),
      });

      if (response.ok) {
        await refreshUserFeatures(user.userId);
        setPremiumModalOpen(false);
      }
    } catch (error) {
      console.error('Purchase error:', error);
    } finally {
      setIsProcessing(false);
      setSelectedFeature(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
        <button
          onClick={() => setPremiumModalOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="text-white" size={24} />
          </div>

          <h2 className="text-3xl font-bold text-white mb-2">
            Unlock Premium Features
          </h2>
          
          <p className="text-gray-300 text-lg">
            Pay once, use for 30 days. Powered by Base blockchain.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            const isSelected = selectedFeature === feature.id;
            const isProcessingThis = isProcessing && isSelected;

            return (
              <div
                key={feature.id}
                className={`relative glass-card p-6 transition-all duration-200 ${
                  feature.popular
                    ? 'ring-2 ring-purple-500 scale-105'
                    : 'hover:scale-105'
                }`}
              >
                {feature.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-purple-400" size={20} />
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2">
                    {feature.name}
                  </h3>

                  <p className="text-gray-300 text-sm mb-4">
                    {feature.description}
                  </p>

                  <div className="text-2xl font-bold text-purple-400 mb-6">
                    {feature.price}
                  </div>

                  <ul className="space-y-2 mb-6 text-left">
                    {feature.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-center gap-2 text-sm text-gray-300">
                        <Check size={16} className="text-green-400 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handlePurchase(feature.id)}
                    disabled={isProcessing}
                    className={`w-full py-3 px-4 rounded-lg font-semibold transition-colors ${
                      feature.popular
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                    } disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2`}
                  >
                    {isProcessingThis ? (
                      <>
                        <LoadingSpinner size="sm" />
                        Processing...
                      </>
                    ) : (
                      `Purchase ${feature.name}`
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-gray-700 pt-6">
          <div className="grid md:grid-cols-3 gap-6 text-center text-sm text-gray-400">
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>Secure Base Network</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              <span>30-Day Access</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              <span>Instant Activation</span>
            </div>
          </div>

          <div className="mt-4 text-center text-xs text-gray-500">
            <p>
              Payments are processed on the Base network. Features activate immediately after payment confirmation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
