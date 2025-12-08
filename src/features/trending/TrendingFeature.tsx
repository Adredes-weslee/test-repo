
import React from 'react';
import { useTrending } from './hooks/useTrending';
import { industries, appConfig } from '../../config';
import { Button, Select } from '../../components/ui';
import { TopicListItem } from './components/TopicListItem';
import { TopicDetailView } from './components/TopicDetailView';
import { TrendingSkeleton } from './components/TrendingSkeleton';
import { MultiTrendChart } from './components/MultiTrendChart';

const TrendingFeature: React.FC = () => {
  const {
    selectedIndustry,
    setSelectedIndustry,
    trends,
    isLoading,
    isLoadingMore,
    hasMore,
    loadMoreTrends,
    activeTrend,
    setActiveTrend,
    isDetailLoading,
    handleGenerate,
    timePeriod,
    handleTimePeriodChange,
    timePeriods,
  } = useTrending();
  
  const activeTrendIndex = activeTrend ? trends.findIndex(t => t.topic === activeTrend.topic) : -1;
  const TREND_CHART_COLORS = appConfig.UI_SETTINGS.trendingFeature.chartColors;

  return (
    <div className="animate-fadeIn space-y-8">
      {/* Header and Filters */}
      <div>
        <div className="flex justify-between items-center mb-2">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Industry Trends</h2>
                <p className="text-slate-600 mt-1">Discover what's new and popular in the tech world.</p>
            </div>
            <div className="w-64">
              <Select
                id="industry-filter-trending"
                label="Industry"
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
              >
                {industries.map(industry => (
                  <option key={industry.value} value={industry.value}>
                    {industry.label}
                  </option>
                ))}
              </Select>
            </div>
        </div>
        <div className="flex justify-center flex-wrap gap-2 mt-4">
            {timePeriods.map(period => (
                <Button 
                    key={period} 
                    variant={timePeriod === period ? 'primary' : 'secondary'}
                    size="xs"
                    onClick={() => handleTimePeriodChange(period)}
                    className="!py-1.5 !font-semibold"
                >
                    {period}
                </Button>
            ))}
        </div>
      </div>
      
      {/* Main Chart */}
      <MultiTrendChart trends={trends} timePeriod={timePeriod} isLoading={isLoading} />

      {/* Main Content: List and Detail View */}
      {isLoading && trends.length === 0 ? (
        <TrendingSkeleton />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-1 space-y-4">
            <h3 className="text-xl font-bold text-slate-800">Topic Details</h3>
            {trends.map((trend, index) => (
              <TopicListItem
                key={trend.topic}
                trend={trend}
                isActive={activeTrend?.topic === trend.topic}
                onSelect={() => setActiveTrend(trend)}
                color={TREND_CHART_COLORS[index % TREND_CHART_COLORS.length]}
              />
            ))}
            {isLoadingMore && (
              <>
                <div className="bg-white p-4 rounded-lg border-2 border-slate-200 w-full animate-pulse"><div className="space-y-2"><div className="h-5 w-3/4 bg-slate-200 rounded"></div><div className="h-4 w-1/2 bg-slate-200 rounded"></div></div></div>
                <div className="bg-white p-4 rounded-lg border-2 border-slate-200 w-full animate-pulse"><div className="space-y-2"><div className="h-5 w-3/4 bg-slate-200 rounded"></div><div className="h-4 w-1/2 bg-slate-200 rounded"></div></div></div>
              </>
            )}
            {hasMore && !isLoading && (
              <div className="text-center pt-2">
                <Button onClick={loadMoreTrends} disabled={isLoadingMore} variant="secondary">
                  {isLoadingMore ? 'Loading...' : 'Load More'}
                </Button>
              </div>
            )}
          </div>
          <div className="lg:col-span-2">
            <TopicDetailView
              trend={activeTrend}
              onGenerate={handleGenerate}
              color={activeTrendIndex !== -1 ? TREND_CHART_COLORS[activeTrendIndex % TREND_CHART_COLORS.length] : '#6700e6'}
              isLoading={isDetailLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TrendingFeature;
