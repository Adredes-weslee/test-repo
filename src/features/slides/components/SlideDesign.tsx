
import React from 'react';
import { SlideSkeleton } from '../../../components/skeletons/SlideSkeleton';
import { UISlide } from '../types';
import { QuizLayout } from '../layouts/QuizLayout';
import { ExerciseLayout } from '../layouts/ExerciseLayout';
import { TitleLayout } from '../layouts/TitleLayout';
import { CenterLayout } from '../layouts/CenterLayout';
import { ImageRightLayout } from '../layouts/ImageRightLayout';
import { SidebarLayout } from '../layouts/SidebarLayout';
import { SplitLayout } from '../layouts/SplitLayout';
import { StandardLayout } from '../layouts/StandardLayout';

const getLayoutType = (suggestion: string): string => {
    const s = suggestion?.toLowerCase() || '';
    if (s.includes('title only') || s.includes('title slide') || s.includes('cover')) return 'title';
    if (s.includes('center') || s.includes('quote') || s.includes('thank you') || s.includes('start page') || s.includes('big number')) return 'center';
    if (s.includes('image right') || s.includes('image-right')) return 'image-right';
    if (s.includes('sidebar') || s.includes('image')) return 'sidebar';
    if (s.includes('two column') || s.includes('split') || s.includes('comparison')) return 'split';
    return 'standard';
};

interface SlideDesignProps {
    slide: UISlide;
    index: number;
    total: number;
    variant: 'preview' | 'print';
    deckTitle: string; // Kept for compatibility if needed, though unused in current layouts
}

export const SlideDesign: React.FC<SlideDesignProps> = (props) => {
    const { slide } = props;
    if (slide.isLoading) {
        return <SlideSkeleton />;
    }

    let layout = getLayoutType(slide.layoutSuggestion);
    if (slide.sectionId === 'quiz') layout = 'quiz';
    if (slide.sectionId === 'exercises') layout = 'exercise';

    switch (layout) {
        case 'quiz': return <QuizLayout {...props} />;
        case 'exercise': return <ExerciseLayout {...props} />;
        case 'title': return <TitleLayout {...props} />;
        case 'center': return <CenterLayout {...props} />;
        case 'image-right': return <ImageRightLayout {...props} />;
        case 'sidebar': return <SidebarLayout {...props} />;
        case 'split': return <SplitLayout {...props} />;
        default: return <StandardLayout {...props} />;
    }
};
