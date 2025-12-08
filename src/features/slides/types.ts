
import { Slide } from '../../api/generateSlides';

export interface UISlide extends Slide {
    id: string;
    sectionId: string;
    sectionTitle: string;
    isLoading?: boolean;
}

export interface Deck {
    title: string;
    slides: UISlide[];
}

export interface SlideLayoutProps {
    slide: UISlide;
    index: number;
    total: number;
    variant: 'preview' | 'print';
}
