'use client';

import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Battery, Zap } from 'lucide-react';

interface BatteryGaugeProps {
  level: number;
  range: number;
  charging: boolean;
}

export function BatteryGauge({ level, range, charging }: BatteryGaugeProps) {
  const getBatteryColor = (level: number) => {
    if (level > 60) return 'battery-green';
    if (level > 20) return 'battery-yellow';
    return 'battery-red';
  };

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-white">
          <Battery className="h-5 w-5" />
          Battery Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <div className={`h-4 rounded-full ${getBatteryColor(level)} opacity-20`} />
          <Progress 
            value={level} 
            className="absolute top-0 h-4 bg-transparent"
            style={{
              background: `linear-gradient(to right, 
                ${level > 60 ? '#00d4aa' : level > 20 ? '#fdcb6e' : '#ff6b6b'} 0%, 
                ${level > 60 ? '#00d4aa' : level > 20 ? '#fdcb6e' : '#ff6b6b'} ${level}%, 
                transparent ${level}%, 
                transparent 100%)`
            }}
          />
        </div>
        
        <div className="flex justify-between items-center">
          <div>
            <p className="text-2xl font-bold text-white">{level}%</p>
            <p className="text-sm text-gray-400">Charge Level</p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white">{range}</p>
            <p className="text-sm text-gray-400">Miles Range</p>
          </div>
        </div>
        
        {charging && (
          <div className="flex items-center gap-2 text-green-400">
            <Zap className="h-4 w-4" />
            <span className="text-sm font-medium">Charging</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
