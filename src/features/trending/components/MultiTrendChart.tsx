import React from 'react';
import { ResponsiveContainer, AreaChart, CartesianGrid, XAxis, YAxis, Tooltip, Area } from 'recharts';
import type { IndustryTrend } from '../../../types';
import { appConfig } from '../../../config';

interface MultiTrendChartProps {
  trends: IndustryTrend[];
  timePeriod: string;
  isLoading: boolean;
}

const ChartSkeleton: React.FC = () => (
    <div className="animate-pulse">
        <div className="h-4 w-1/4 bg-slate-200 rounded mb-4"></div>
        <div className="flex justify-center flex-wrap gap-x-4 gap-y-2 mb-4">
            <div className="h-5 w-24 bg-slate-200 rounded"></div>
            <div className="h-5 w-32 bg-slate-200 rounded"></div>
            <div className="h-5 w-28 bg-slate-200 rounded"></div>
        </div>
        <div className="h-80 w-full bg-slate-200 rounded"></div>
    </div>
);

const generateDateTimestamps = (numPoints: number, timePeriod: string): number[] => {
    const dates: number[] = [];
    const now = new Date();
    // Create a new Date object representing midnight UTC on the user's current local date.
    // This ensures the chart's "today" matches the user's "today", regardless of timezone.
    const today = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));

    for (let i = 0; i < numPoints; i++) {
        const date = new Date(today);
        if (timePeriod === '4 Weeks' || timePeriod === '1 Week') {
            date.setUTCDate(date.getUTCDate() - (numPoints - 1 - i));
        } else if (timePeriod === '3 Months' || timePeriod === '6 Months' || timePeriod === '1 Year') {
            date.setUTCDate(date.getUTCDate() - ((numPoints - 1 - i) * 7));
        } else if (timePeriod === '2 Years' || timePeriod === '3 Years') {
            // This logic correctly handles month rollovers, e.g., subtracting 1 month from March 31 results in the last day of Feb.
            date.setUTCMonth(date.getUTCMonth() - (numPoints - 1 - i));
        }
        dates.push(date.getTime());
    }
    return dates;
};

const formatDateTick = (tick: number, timePeriod: string): string => {
    const date = new Date(tick);
    switch (timePeriod) {
        case '4 Weeks':
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
        case '3 Months':
        case '6 Months':
            return date.toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' });
        case '1 Year':
        case '2 Years':
        case '3 Years':
            return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit', timeZone: 'UTC' });
        default:
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
    }
};

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const date = new Date(label);
      const dateStr = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
      
      const sortedPayload = [...payload].sort((a, b) => b.value - a.value);

      return (
        <div className="bg-slate-800 text-white p-2 rounded-md text-xs shadow-lg">
          <div className="font-bold mb-1">{dateStr}</div>
          <ul className="space-y-1">
            {sortedPayload.map((pld: any) => (
              <li key={pld.dataKey} className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: pld.stroke }}></div>
                <span className="flex-grow truncate" style={{ maxWidth: '150px' }}>{pld.dataKey}:</span>
                <span className="font-bold">{pld.value}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    }
    return null;
};

export const MultiTrendChart: React.FC<MultiTrendChartProps> = ({ trends, timePeriod, isLoading }) => {
    const timePeriodConfig = appConfig.UI_SETTINGS.trendingFeature.timePeriodConfig;
    const numPoints = timePeriodConfig[timePeriod as keyof typeof timePeriodConfig]?.points || 28;
    const dates = generateDateTimestamps(numPoints, timePeriod);
    const TREND_CHART_COLORS = appConfig.UI_SETTINGS.trendingFeature.chartColors;
    
    const transformedData = dates.map((date, i) => {
        const dataPoint: { date: number, [key: string]: number } = { date };
        trends.forEach(trend => {
            if (trend.trendData && trend.trendData[i] !== undefined) {
                dataPoint[trend.topic] = trend.trendData[i];
            }
        });
        return dataPoint;
    });

    if (isLoading && trends.length === 0) {
        return <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200"><ChartSkeleton /></div>;
    }
    
    if (trends.length === 0 && !isLoading) {
      return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center text-slate-500 h-[420px] flex flex-col justify-center items-center">
          <h3 className="text-lg font-semibold text-slate-700">No Trend Data Available</h3>
          <p className="mt-1">Please select an industry to view trending topics.</p>
        </div>
      );
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-4">
                {trends.map((trend, index) => (
                    <div key={trend.topic} className="flex items-center text-xs text-slate-600 font-medium">
                        <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: TREND_CHART_COLORS[index % TREND_CHART_COLORS.length] }}></div>
                        {trend.topic}
                    </div>
                ))}
            </div>
            <div className="relative w-full h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={transformedData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                        <defs>
                            {trends.map((_, index) => {
                                const color = TREND_CHART_COLORS[index % TREND_CHART_COLORS.length];
                                return (
                                <linearGradient key={`color-${index}`} id={`color-${index}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={color} stopOpacity={0.2}/>
                                    <stop offset="95%" stopColor={color} stopOpacity={0}/>
                                </linearGradient>
                                );
                            })}
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis 
                            type="number"
                            dataKey="date"
                            domain={['dataMin', 'dataMax']}
                            scale="time"
                            tickFormatter={(tick) => formatDateTick(tick, timePeriod)}
                            stroke="#475569"
                            tick={{ fontSize: 12 }}
                        />
                        <YAxis stroke="#475569" tick={{ fontSize: 12 }} />
                        <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#94a3b8', strokeWidth: 1, strokeDasharray: '3 3' }} />
                        {trends.map((trend, index) => (
                            <Area
                                key={trend.topic}
                                type="monotone"
                                dataKey={trend.topic}
                                stroke={TREND_CHART_COLORS[index % TREND_CHART_COLORS.length]}
                                fill={`url(#color-${index})`}
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 5, strokeWidth: 2, fill: TREND_CHART_COLORS[index % TREND_CHART_COLORS.length], stroke: '#fff' }}
                            />
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};