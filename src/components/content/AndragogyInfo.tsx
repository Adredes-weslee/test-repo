
import React from 'react';
import type { AndragogicalAnalysis } from '../../types';
import { Check, Sparkles, Goal, Rocket, Thinking, Eye, Briefcase, Users, PenTool, LayoutTemplate, Layers, Target } from '../icons';
import { SkeletonBar } from '../skeletons';

interface AndragogyInfoProps {
    analysis: AndragogicalAnalysis | null;
    isLoading: boolean;
}

const PrincipleCard: React.FC<{ title: string; description: string; evidence?: string; icon: React.ElementType; color?: string; isLoading: boolean }> = ({ title, description, evidence, icon: Icon, color = "text-primary", isLoading }) => (
    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 mb-3">
        <div className="flex items-center gap-2 mb-1">
            <Icon className={`w-4 h-4 ${color}`} />
            <h4 className="font-bold text-slate-800 text-sm">{title}</h4>
        </div>
        <p className="text-xs text-slate-500 mb-2 italic">{description}</p>
        <div className="flex items-start gap-2">
            <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
            {isLoading ? (
                <div className="flex-1 space-y-1">
                    <SkeletonBar height="0.75rem" width="90%" />
                    <SkeletonBar height="0.75rem" width="60%" />
                </div>
            ) : (
                <p className="text-xs text-slate-700 font-medium leading-snug">{evidence || "Analysis pending..."}</p>
            )}
        </div>
    </div>
);

export const AndragogyInfo: React.FC<AndragogyInfoProps> = ({ analysis, isLoading }) => {
    
    if (!analysis && !isLoading) {
        return <p className="text-sm text-slate-500 italic p-4">Andragogical analysis will appear here after generation.</p>;
    }

    return (
        <div className="space-y-8 animate-fadeIn">
            {/* 6 PoLD */}
            <div>
                <h3 className="text-sm font-semibold text-slate-800 mb-3 tracking-wider flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-primary" />
                    6 Principles of Learning Design
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                    <PrincipleCard isLoading={isLoading} title="Authentic" description="Real-world practices & complexity." evidence={analysis?.poLD.authentic} icon={Rocket} />
                    <PrincipleCard isLoading={isLoading} title="Alignment" description="Outcomes matched to activities." evidence={analysis?.poLD.alignment} icon={Goal} />
                    <PrincipleCard isLoading={isLoading} title="Holistic" description="Integrating Doing, Thinking, Feeling." evidence={analysis?.poLD.holistic} icon={Thinking} />
                    <PrincipleCard isLoading={isLoading} title="Feedback" description="Actionable & Dialogic." evidence={analysis?.poLD.feedback} icon={Check} />
                    <PrincipleCard isLoading={isLoading} title="Judgement" description="Evaluating quality & capability." evidence={analysis?.poLD.judgement} icon={Eye} />
                    <PrincipleCard isLoading={isLoading} title="Future-Oriented" description="Adaptability & Learning-to-learn." evidence={analysis?.poLD.future} icon={Sparkles} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-200 pt-6">
                {/* David Boud */}
                <div>
                    <h3 className="text-sm font-semibold text-slate-800 mb-3 uppercase tracking-wider flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-sky-600" />
                        Features of Practice
                    </h3>
                    <div className="space-y-2">
                        <PrincipleCard isLoading={isLoading} title="Situated & Embodied" description="Context and Role" evidence={analysis?.boud.situated} icon={LayoutTemplate} color="text-sky-600" />
                        <PrincipleCard isLoading={isLoading} title="Materially Mediated" description="Tools and Artifacts" evidence={analysis?.boud.mediated} icon={PenTool} color="text-sky-600" />
                        <PrincipleCard isLoading={isLoading} title="Relational" description="Social Context" evidence={analysis?.boud.relational} icon={Users} color="text-sky-600" />
                    </div>
                </div>

                {/* Stephen Billett */}
                <div>
                    <h3 className="text-sm font-semibold text-slate-800 mb-3 uppercase tracking-wider flex items-center gap-2">
                        <Users className="w-4 h-4 text-orange-500" />
                        Workplace Learning
                    </h3>
                    <div className="space-y-2">
                        <PrincipleCard isLoading={isLoading} title="Affordances for Learning" description="Invitations to Act" evidence={analysis?.billett.affordances} icon={LayoutTemplate} color="text-orange-500" />
                        <PrincipleCard isLoading={isLoading} title="Guided Participation" description="Scaffolding & Expert Guidance" evidence={analysis?.billett.guidance} icon={Users} color="text-orange-500" />
                    </div>
                </div>
            </div>

            {/* Merrill's First Principles */}
            <div className="border-t border-slate-200 pt-6">
                <h3 className="text-sm font-semibold text-slate-800 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <Target className="w-4 h-4 text-red-500" />
                    Merrill's First Principles
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <PrincipleCard isLoading={isLoading} title="Problem-centered" description="Engage in real-world problems." evidence={analysis?.merrill.problem} icon={Goal} color="text-red-500" />
                    <PrincipleCard isLoading={isLoading} title="Activation" description="Activate prior knowledge." evidence={analysis?.merrill.activation} icon={Sparkles} color="text-red-500" />
                    <PrincipleCard isLoading={isLoading} title="Demonstration" description="Demonstrate new knowledge." evidence={analysis?.merrill.demonstration} icon={Eye} color="text-red-500" />
                    <PrincipleCard isLoading={isLoading} title="Application" description="Apply new knowledge." evidence={analysis?.merrill.application} icon={PenTool} color="text-red-500" />
                    <PrincipleCard isLoading={isLoading} title="Integration" description="Integrate into learner's world." evidence={analysis?.merrill.integration} icon={Users} color="text-red-500" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-200 pt-6">
                {/* Vygotsky */}
                <div>
                    <h3 className="text-sm font-semibold text-slate-800 mb-3 uppercase tracking-wider flex items-center gap-2">
                        <Users className="w-4 h-4 text-cyan-600" />
                        Vygotsky's Social Constructivism
                    </h3>
                    <div className="space-y-2">
                        <PrincipleCard isLoading={isLoading} title="Zone of Proximal Development" description="Optimal Challenge" evidence={analysis?.vygotsky.zpd} icon={Goal} color="text-cyan-600" />
                        <PrincipleCard isLoading={isLoading} title="Scaffolding" description="Fading Support" evidence={analysis?.vygotsky.scaffolding} icon={LayoutTemplate} color="text-cyan-600" />
                        <PrincipleCard isLoading={isLoading} title="Most Knowledgeable Other" description="Expert Guidance" evidence={analysis?.vygotsky.mko} icon={Eye} color="text-cyan-600" />
                        <PrincipleCard isLoading={isLoading} title="Social Interaction" description="Collaboration" evidence={analysis?.vygotsky.social} icon={Users} color="text-cyan-600" />
                    </div>
                </div>

                {/* Bloom's Taxonomy */}
                <div>
                    <h3 className="text-sm font-semibold text-slate-800 mb-3 uppercase tracking-wider flex items-center gap-2">
                        <Layers className="w-4 h-4 text-purple-600" />
                        Cognitive Progression (Bloom)
                    </h3>
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-bold text-slate-800 text-sm">Targeted Cognitive Level</h4>
                        </div>
                        <div className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-green-500 flex-shrink-0 mt-0.5" />
                            {isLoading ? (
                                <SkeletonBar height="0.75rem" width="80%" />
                            ) : (
                                <p className="text-xs text-slate-700 font-medium leading-snug whitespace-pre-wrap">{analysis?.bloom.progression}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
