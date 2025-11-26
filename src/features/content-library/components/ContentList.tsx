import React from 'react';
import { Search, Library } from '../../../components/icons/index';
import { ContentItemCard } from './ContentItemCard';
import type { ContentItem } from '../../../types';
import { ContentItemCardSkeleton } from '../../../components/skeletons/ContentItemCardSkeleton';

interface ContentListProps {
    contentItems: ContentItem[];
    inProgressItems: ContentItem[];
    selectedContent: ContentItem | null;
    onSelectContent: (item: ContentItem) => void;
    searchValue: string;
    onSearchChange: (value: string) => void;
    isLoading: boolean;
}

export const ContentList: React.FC<ContentListProps> = ({ contentItems, inProgressItems, selectedContent, onSelectContent, searchValue, onSearchChange, isLoading }) => {
    return (
        <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-slate-200 lg:top-8">
            <div className="flex items-center space-x-2 mb-6">
                <Library className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold text-slate-800">Library</h2>
            </div>
          
            <div className="relative mb-6">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                    type="text"
                    name="search"
                    id="search"
                    className="w-full pl-10 py-2 text-sm text-slate-800 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-0 focus:ring-primary-focus focus:border-primary-focus placeholder-slate-400"
                    placeholder="Search content..."
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>

            <div className="space-y-2 overflow-y-auto overflow-x-hidden p-[1em] max-h-[calc(100vh-260px)]">
                {isLoading ? (
                    <>
                        <ContentItemCardSkeleton />
                        <ContentItemCardSkeleton />
                        <ContentItemCardSkeleton />
                    </>
                ) : (
                    <>
                        {inProgressItems.map(item => (
                            <ContentItemCard
                                key={item.id}
                                item={item}
                                isSelected={false}
                                onSelect={() => {}}
                            />
                        ))}
                        {contentItems.length > 0 ? (
                            contentItems.map((item) => (
                                <ContentItemCard
                                    key={item.id}
                                    item={item}
                                    isSelected={selectedContent?.id === item.id}
                                    onSelect={() => onSelectContent(item)}
                                />
                            ))
                        ) : (
                            inProgressItems.length === 0 && (
                                <div className="text-center py-10 px-4 text-sm text-slate-500 border border-dashed border-slate-200 rounded-lg">
                                    {searchValue ? `No results for "${searchValue}"` : 'No content found'}
                                </div>
                            )
                        )}
                    </>
                )}
            </div>
        </div>
    );
};