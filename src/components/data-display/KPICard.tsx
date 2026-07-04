import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  icon?: ReactNode;
  sparklineData?: number[];
  onClick?: () => void;
}

export function KPICard({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon,
  sparklineData,
  onClick,
}: KPICardProps) {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-muted-foreground',
  };

  const trendIcons = {
    up: <TrendingUp className="w-4 h-4" />,
    down: <TrendingDown className="w-4 h-4" />,
    neutral: <Minus className="w-4 h-4" />,
  };

  return (
    <div
      className={`bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-200 ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-2xl font-bold text-foreground">{value}</h3>
        </div>
        {icon && (
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary shadow-sm">
            {icon}
          </div>
        )}
      </div>

      {subtitle && <p className="text-xs text-muted-foreground mb-2">{subtitle}</p>}

      {trend && trendValue && (
        <div className={`flex items-center gap-1 text-sm ${trendColors[trend]}`}>
          {trendIcons[trend]}
          <span className="font-medium">{trendValue}</span>
        </div>
      )}

      {sparklineData && sparklineData.length > 0 && (
        <div className="mt-4 h-12">
          <SparklineChart data={sparklineData} />
        </div>
      )}
    </div>
  );
}

function SparklineChart({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = range === 0 ? 50 : ((max - value) / range) * 100;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className="text-primary"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
