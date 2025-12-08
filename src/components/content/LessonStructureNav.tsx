
import React, { useMemo } from 'react';
import { Goal, Lesson, Exercise, Quiz, Sparkles, Eye, PenTool, Briefcase, Thinking, File } from '../icons';
import type { LessonPlan } from '../../types';
import { useScrollspy } from '../../hooks/useScrollspy';

const SECTIONS_CONFIG = [
  { id: 'lesson-overview', label: 'Overview', icon: File, isPresent: (plan: LessonPlan) => !!plan.overview || !!plan.lessonOutcome },
  { id: 'lesson-activation', label: 'Activation', icon: Sparkles, isPresent: (plan: LessonPlan) => !!plan.activation },
  { id: 'lesson-demonstration', label: 'Demonstration', icon: Eye, isPresent: (plan: LessonPlan) => !!plan.demonstration || !!plan.lessonOutline },
  { id: 'lesson-application', label: 'Application', icon: PenTool, isPresent: (plan: LessonPlan) => !!plan.application },
  { id: 'lesson-integration', label: 'Integration', icon: Briefcase, isPresent: (plan: LessonPlan) => !!plan.integration },
  { id: 'lesson-reflection', label: 'Feedback', icon: Thinking, isPresent: (plan: LessonPlan) => !!plan.reflectionAndAssessment },
  { id: 'lesson-exercises', label: 'Exercises', icon: Exercise, isPresent: (plan: LessonPlan) => plan.exercises && plan.exercises.length > 0 },
  { id: 'lesson-quiz', label: 'Quiz', icon: Quiz, isPresent: (plan: LessonPlan) => plan.quiz && plan.quiz.questions.length > 0 },
];

interface LessonStructureNavProps {
    lessonPlan: LessonPlan | null;
}

export const LessonStructureNav: React.FC<LessonStructureNavProps> = ({ lessonPlan }) => {
    const visibleSections = useMemo(() => {
        if (lessonPlan) {
            return SECTIONS_CONFIG.filter(sec => sec.isPresent(lessonPlan));
        }
        return SECTIONS_CONFIG; // Show all skeletons if loading? Or maybe just empty.
    }, [lessonPlan]);
    
    const sectionIds = useMemo(() => visibleSections.map(sec => sec.id), [visibleSections]);

    const activeId = useScrollspy(sectionIds, { rootMargin: '0px 0px -80% 0px' });

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        
        if (visibleSections.length > 0 && id === visibleSections[0].id) {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        const element = document.getElementById(id);
        if (element) {
            const yOffset = -100;
            const y = element.getBoundingClientRect().top + window.scrollY + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
        }
    };
    
    return (
        <nav className="w-48 sticky top-36 hidden md:block">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">On this page</h3>
            <ul className="space-y-1">
                {visibleSections.map(({ id, label, icon: Icon }) => {
                    const isActive = activeId === id;
                    return (
                        <li key={id}>
                            <a 
                                href={`#${id}`}
                                onClick={(e) => handleNavClick(e, id)}
                                className={`flex items-center space-x-2 p-2 rounded-md text-sm transition-colors ${
                                    isActive 
                                        ? 'bg-primary-lightest text-primary-text font-semibold' 
                                        : 'text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? 'text-primary-text' : 'text-slate-500'}`} />
                                <span>{label}</span>
                            </a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};
