import * as styles from './KPICard.styles';
import type { ReactNode } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'bfd-icons';

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
    up: 'text-success-emphasis-mid',
    down: 'text-error-emphasis-mid',
    neutral: 'text-muted-foreground',
  };

  const trendIcons = {
    up: <TrendingUp className={styles.style1} />,
    down: <TrendingDown className={styles.style1} />,
    neutral: <Minus className={styles.style1} />,
  };

  return (
    <div
      className={`bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-200 ${
        onClick ? 'cursor-pointer' : ''
      }`}
      onClick={onClick}
    >
      <div className={styles.style2}>
        <div className={styles.style3}>
          <p className={styles.style4}>{title}</p>
          <h3 className={styles.style5}>{value}</h3>
        </div>
        {icon && (
          <div className={styles.style6}>
            {icon}
          </div>
        )}
      </div>

      {subtitle && <p className={styles.style7}>{subtitle}</p>}

      {trend && trendValue && (
        <div className={`flex items-center gap-1 text-sm ${trendColors[trend]}`}>
          {trendIcons[trend]}
          <span className={styles.style8}>{trendValue}</span>
        </div>
      )}

      {sparklineData && sparklineData.length > 0 && (
        <div className={styles.style9}>
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
    // eslint-disable-next-line no-restricted-syntax -- chart primitive drawn from data, not a duplicated icon
    <svg className={styles.style10} preserveAspectRatio="none" viewBox="0 0 100 100">
      <polyline
        points={points}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        className={styles.style11}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}
