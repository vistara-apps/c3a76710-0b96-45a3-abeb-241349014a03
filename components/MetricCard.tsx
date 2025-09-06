'use client';

import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'gradient';
}

export function MetricCard({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  variant = 'default' 
}: MetricCardProps) {
  const isGradient = variant === 'gradient';

  return (
    <div className={`animate-fade-in ${isGradient ? 'gradient-card p-6' : 'metric-card'}`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`text-sm font-medium ${isGradient ? 'text-white text-opacity-80' : 'text-gray-300'}`}>
            {title}
          </p>
          <p className={`text-2xl font-bold mt-2 ${isGradient ? 'text-white' : 'text-white'}`}>
            {value}
          </p>
          {subtitle && (
            <p className={`text-sm mt-1 ${isGradient ? 'text-white text-opacity-70' : 'text-gray-400'}`}>
              {subtitle}
            </p>
          )}
        </div>
        
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
          isGradient ? 'bg-white bg-opacity-20' : 'bg-purple-500 bg-opacity-20'
        }`}>
          <Icon className={`w-6 h-6 ${isGradient ? 'text-white' : 'text-purple-400'}`} />
        </div>
      </div>

      {trend && (
        <div className="flex items-center mt-4 space-x-2">
          <div className={`text-xs px-2 py-1 rounded-full ${
            trend.isPositive 
              ? 'bg-green-500 bg-opacity-20 text-green-400' 
              : 'bg-red-500 bg-opacity-20 text-red-400'
          }`}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </div>
          <span className={`text-xs ${isGradient ? 'text-white text-opacity-70' : 'text-gray-400'}`}>
            vs last week
          </span>
        </div>
      )}
    </div>
  );
}
