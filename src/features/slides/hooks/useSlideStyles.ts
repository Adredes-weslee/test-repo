
import { UISlide } from '../types';

export const useSlideStyles = (slide: UISlide, variant: 'preview' | 'print') => {
    const isPrint = variant === 'print';
    const charCount = slide.bullets.reduce((acc, b) => acc + b.length, 0) + (slide.title?.length || 0);
    const lineCount = slide.bullets.length;

    let density = 'normal';
    if (charCount > 800 || lineCount > 10) density = 'very-high';
    else if (charCount > 400 || lineCount > 6) density = 'high';

    const getTitleClass = () => {
        if (isPrint) {
            if (density === 'very-high') return 'text-4xl mb-4';
            if (density === 'high') return 'text-5xl mb-6';
            return 'text-6xl mb-8';
        }
        if (density === 'very-high') return 'text-xl mb-2';
        if (density === 'high') return 'text-2xl mb-3';
        return 'text-3xl mb-4';
    };

    const getBodyClass = () => {
        if (isPrint) {
            if (density === 'very-high') return 'text-2xl leading-snug';
            if (density === 'high') return 'text-3xl leading-normal';
            return 'text-4xl leading-relaxed';
        }
        if (density === 'very-high') return 'text-xs leading-snug';
        if (density === 'high') return 'text-sm leading-normal';
        return 'text-lg leading-relaxed';
    };

    const getBulletSpacing = () => {
        if (isPrint) {
            if (density === 'very-high') return 'space-y-3';
            if (density === 'high') return 'space-y-4';
            return 'space-y-6';
        }
        if (density === 'very-high') return 'space-y-1.5';
        if (density === 'high') return 'space-y-2';
        return 'space-y-4';
    };

    const getBulletIconClass = () => {
         if (isPrint) {
            return density === 'very-high' ? 'w-3 h-3 mt-2' : 'w-4 h-4 mt-2.5';
         }
         return density === 'very-high' ? 'w-1.5 h-1.5 mt-1' : 'w-2 h-2 mt-1.5';
    };

    return {
        padding: isPrint ? 'p-16' : 'p-8',
        title: getTitleClass(),
        body: getBodyClass(),
        bulletSpacing: getBulletSpacing(),
        bulletIcon: getBulletIconClass(),
        footer: isPrint ? 'text-xl' : 'text-xs',
        isPrint,
    };
};
