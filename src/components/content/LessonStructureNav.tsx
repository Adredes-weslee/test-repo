import React, { useMemo } from 'react';
import { Goal, Lesson, Exercise, Quiz, Rocket as Project } from '../icons';
import type { LessonPlan } from '../../types';
import { useScrollspy } from '../../hooks/useScrollspy';

const SECTIONS_CONFIG = [
  { id: 'lesson-outcome', label: 'Outcome', icon: Goal, isPresent: (plan: LessonPlan) => !!plan.lessonOutcome },
  { id: 'lesson-outline', label: 'Lesson', icon: Lesson, isPresent: (plan: LessonPlan) => !!plan.lessonOutline },
  { id: 'lesson-exercises', label: 'Exercises', icon: Exercise, isPresent: (plan: LessonPlan) => plan.exercises && plan.exercises.length > 0 },
  { id: 'lesson-quiz', label: 'Quiz', icon: Quiz, isPresent: (plan: LessonPlan) => plan.quiz && plan.quiz.questions.length > 0 },
//   { id: 'lesson-project', label: 'Project', icon: Project, isPresent: (plan: LessonPlan) => !!plan.project?.description },
];

interface LessonStructureNavProps {
    lessonPlan: LessonPlan | null;
}

export const LessonStructureNav: React.FC<LessonStructureNavProps> = ({ lessonPlan }) => {
    const visibleSections = useMemo(() => {
        if (lessonPlan) {
            return SECTIONS_CONFIG.filter(sec => sec.isPresent(lessonPlan));
        }
        return SECTIONS_CONFIG.filter(sec => ['lesson-outcome', 'lesson-outline', 'lesson-exercises', 'lesson-quiz'].includes(sec.id));
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
                                className={`flex items-center space-x-2 p-2 rounded-md text-md transition-colors ${
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