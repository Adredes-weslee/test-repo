import React from 'react';

interface TrendChartProps {
  data: number[];
  className?: string;
  size?: 'small' | 'large';
}

export const TrendChart: React.FC<TrendChartProps> = ({ data, className, size = 'small' }) => {
  if (!data || data.length < 2) return null;

  const isLarge = size === 'large';
  const width = isLarge ? 300 : 120;
  const height = isLarge ? 100 : 40;
  const padding = isLarge ? 5 : 0;
  const strokeWidth = isLarge ? '2' : '1.5';

  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const maxVal = Math.max(...data);
  const minVal = Math.min(...data);
  const range = maxVal - minVal;

  const points = data
    .map((val, i) => {
      const x = padding + (i / (data.length - 1)) * chartWidth;
      const y = padding + chartHeight - ((val - minVal) / (range || 1)) * chartHeight;
      return `${x},${y}`;
    })
    .join(' ');
  
  const areaPoints = isLarge ? `${padding},${height - padding} ${points} ${width - padding},${height - padding}` : '';

  const isUpward = data[data.length - 1] > data[data.length - 2] || (data.length === 2 && data[1] > data[0]);
  const colorClass = isUpward ? 'green' : 'red';

  const strokeColorClass = `stroke-${colorClass}-500`;
  const stopColor1Class = `stop-color-${colorClass}-400`;
  const stopColor2Class = `stop-color-${colorClass}-100`;

  const gridLines = Array.from({ length: 3 }).map((_, i) => (
    <line
      key={i}
      x1={padding}
      y1={padding + (i + 1) * (chartHeight / 4)}
      x2={width - padding}
      y2={padding + (i + 1) * (chartHeight / 4)}
      className="stroke-slate-200/70"
      strokeWidth="0.5"
    />
  ));

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={className} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`gradient-green`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" className="stop-color-green-400" stopOpacity="0.4" />
          <stop offset="100%" className="stop-color-green-100" stopOpacity="0" />
        </linearGradient>
         <linearGradient id={`gradient-red`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" className="stop-color-red-400" stopOpacity="0.4" />
          <stop offset="100%" className="stop-color-red-100" stopOpacity="0" />
        </linearGradient>
        <style>{`.stop-color-green-400 { stop-color: #4ade80; } .stop-color-green-100 { stop-color: #dcfce7; } .stop-color-red-400 { stop-color: #f87171; } .stop-color-red-100 { stop-color: #fee2e2; }`}</style>
      </defs>
      
      {isLarge && gridLines}
      {isLarge && <polygon fill={`url(#gradient-${colorClass})`} points={areaPoints} />}
      
      <polyline
        fill="none"
        className={strokeColorClass}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
};