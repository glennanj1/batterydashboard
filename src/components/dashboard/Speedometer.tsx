'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gauge } from 'lucide-react';

interface SpeedometerProps {
  speed: number;
  maxSpeed: number;
  unit: 'mph' | 'km/h';
}

export function Speedometer({ speed, maxSpeed, unit }: SpeedometerProps) {
  const percentage = (speed / maxSpeed) * 100;
  
  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-white">
          <Gauge className="h-5 w-5" />
          Speed
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative w-48 h-48 mx-auto">
          <div className="absolute inset-0 rounded-full border-8 border-gray-800" />
          <div 
            className="absolute inset-0 rounded-full border-8 border-red-500 transition-all duration-500"
            style={{
              background: `conic-gradient(from 180deg, #ef4444 0deg, #ef4444 ${percentage * 3.6}deg, transparent ${percentage * 3.6}deg)`,
              transform: 'rotate(-90deg)'
            }}
          />
          <div className="absolute inset-4 rounded-full bg-gray-900 flex items-center justify-center">
            <div className="text-center">
              <p className="text-3xl font-bold text-white">{speed}</p>
              <p className="text-sm text-gray-400">{unit}</p>
            </div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-400">Current Speed</p>
        </div>
      </CardContent>
    </Card>
  );
}
