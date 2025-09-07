'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { useTaskFlowStore } from '@/lib/store';
import { useAuth } from '@/lib/hooks/useAuth';
import { LoadingSpinner } from './LoadingSpinner';

export function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, isLoading } = useTaskFlowStore();
  const { authenticateWithFarcaster } = useAuth();
  const [step, setStep] = useState<'connect' | 'verify'>('connect');

  if (!isAuthModalOpen) return null;

  const handleConnect = () => {
    // In a real implementation, this would trigger Farcaster authentication
    // For now, we'll simulate the process
    setStep('verify');
    
    // Simulate authentication
    setTimeout(() => {
      authenticateWithFarcaster(12345, 'mock-signature', 'mock-message');
      closeAuthModal();
      setStep('connect');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="glass-card max-w-md w-full p-6 relative">
        <button
          onClick={() => closeAuthModal()}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="text-center">
          <div className="w-16 h-16 bg-purple-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🔐</span>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">
            Connect with Farcaster
          </h2>
          
          <p className="text-gray-300 mb-6">
            Sign in with your Farcaster account to access TaskFlow and manage your tasks on-chain.
          </p>

          {step === 'connect' ? (
            <div className="space-y-4">
              <button
                onClick={handleConnect}
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <>
                    <span className="text-lg">🟣</span>
                    Connect Farcaster
                  </>
                )}
              </button>

              <div className="text-sm text-gray-400">
                <p>By connecting, you agree to our Terms of Service and Privacy Policy.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-center">
                <LoadingSpinner size="lg" />
              </div>
              
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Verifying your identity...
                </h3>
                <p className="text-gray-300 text-sm">
                  Please confirm the authentication request in your Farcaster client.
                </p>
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Secure
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                On-chain
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Decentralized
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
