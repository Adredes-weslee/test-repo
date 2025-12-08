
import React from 'react';
import { Sparkles, Briefcase, Users, Layers, Target, Eye, LayoutTemplate, Briefcase as VygotskyIcon } from '../icons';

export interface Badge {
    label: string;
    type: '6 PoLD' | 'Boud' | 'Billett' | 'Bloom' | 'Merrill' | 'Mayer' | 'UDL' | 'Vygotsky';
}

export const PedagogyBadge: React.FC<{ badge: Badge }> = ({ badge }) => {
    const styles = {
        '6 PoLD': 'bg-primary-lightest text-primary-dark border-primary-light', // Purple
        Boud: 'bg-sky-50 text-sky-700 border-sky-200', // Sky
        Billett: 'bg-orange-50 text-orange-700 border-orange-200', // Orange
        Bloom: 'bg-pink-50 text-pink-700 border-pink-200', // Pink
        Merrill: 'bg-red-50 text-red-700 border-red-200', // Red
        Mayer: 'bg-teal-50 text-teal-700 border-teal-200', // Teal
        UDL: 'bg-indigo-50 text-indigo-700 border-indigo-200', // Indigo
        Vygotsky: 'bg-cyan-50 text-cyan-700 border-cyan-200', // Cyan
    };

    const icons = {
        '6 PoLD': Sparkles,
        Boud: Briefcase,
        Billett: Users,
        Bloom: Layers,
        Merrill: Target,
        Mayer: Eye,
        UDL: LayoutTemplate,
        Vygotsky: Users, // Reusing Users icon or similar
    };

    const Icon = icons[badge.type] || Sparkles;

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${styles[badge.type]} whitespace-nowrap gap-1`}>
            <Icon className="w-3 h-3" />
            {`${badge.type}: ${badge.label}`}
        </span>
    );
};
