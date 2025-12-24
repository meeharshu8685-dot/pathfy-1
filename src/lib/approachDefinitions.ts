// Approach definitions for Goal Approach Planner
// These are rule-based, not AI-generated

export interface ApproachDefinition {
    id: string;
    name: string;
    durationRange: string;
    dailyEffortRange: string;
    intensityLevel: 'low' | 'moderate' | 'high';
    lifestyleTradeOff: 'low' | 'medium' | 'very_high';
    whoThisSuits: string;
    description: string;
}

export interface GoalApproaches {
    tech: ApproachDefinition[];
    exams: ApproachDefinition[];
    govt: ApproachDefinition[];
    business: ApproachDefinition[];
    creative: ApproachDefinition[];
    skills: ApproachDefinition[];
    sports: ApproachDefinition[];
    arts: ApproachDefinition[];
    medical: ApproachDefinition[];
    other: ApproachDefinition[];
    default: ApproachDefinition[];
}

// Universal approaches that work for most goals
const universalApproaches: ApproachDefinition[] = [
    {
        id: 'fast_intensive',
        name: 'Fast / Intensive',
        durationRange: '3-6 months',
        dailyEffortRange: '4-6 hours',
        intensityLevel: 'high',
        lifestyleTradeOff: 'very_high',
        whoThisSuits: 'Those who can dedicate full time and want quick results',
        description: 'Maximum effort for faster results. Requires significant lifestyle changes.'
    },
    {
        id: 'balanced_steady',
        name: 'Balanced / Steady',
        durationRange: '6-12 months',
        dailyEffortRange: '2-3 hours',
        intensityLevel: 'moderate',
        lifestyleTradeOff: 'medium',
        whoThisSuits: 'Working professionals or students with other commitments',
        description: 'Consistent progress while maintaining work-life balance.'
    },
    {
        id: 'longterm_sustainable',
        name: 'Long-Term / Sustainable',
        durationRange: '12-24 months',
        dailyEffortRange: '1-2 hours',
        intensityLevel: 'low',
        lifestyleTradeOff: 'low',
        whoThisSuits: 'Those who prefer gradual learning without pressure',
        description: 'Slow and steady approach with minimal lifestyle disruption.'
    }
];

// Competitive exam specific approaches
const examApproaches: ApproachDefinition[] = [
    {
        id: 'drop_year',
        name: 'Drop-Year / Full-Focus Program',
        durationRange: '10-12 months',
        dailyEffortRange: '8-10 hours',
        intensityLevel: 'high',
        lifestyleTradeOff: 'very_high',
        whoThisSuits: 'Students who can dedicate a full year without other commitments',
        description: 'Similar to coaching institute intensive programs. Requires full dedication.'
    },
    {
        id: 'long_term_foundation',
        name: 'Long-Term / Foundation Program',
        durationRange: '24-36 months',
        dailyEffortRange: '5-6 hours',
        intensityLevel: 'moderate',
        lifestyleTradeOff: 'medium',
        whoThisSuits: 'Students starting early while in school/college',
        description: 'Build strong fundamentals over time. More sustainable preparation.'
    },
    {
        id: 'parallel_preparation',
        name: 'Parallel Preparation',
        durationRange: '18-24 months',
        dailyEffortRange: '3-4 hours',
        intensityLevel: 'moderate',
        lifestyleTradeOff: 'medium',
        whoThisSuits: 'Those managing studies/work alongside exam preparation',
        description: 'Balance exam prep with regular studies or job.'
    }
];

// Tech career approaches
const techApproaches: ApproachDefinition[] = [
    {
        id: 'bootcamp_style',
        name: 'Bootcamp Style',
        durationRange: '3-6 months',
        dailyEffortRange: '6-8 hours',
        intensityLevel: 'high',
        lifestyleTradeOff: 'very_high',
        whoThisSuits: 'Career changers looking for quick entry into tech',
        description: 'Intensive learning path similar to coding bootcamps.'
    },
    {
        id: 'self_paced',
        name: 'Self-Paced Learning',
        durationRange: '6-12 months',
        dailyEffortRange: '2-4 hours',
        intensityLevel: 'moderate',
        lifestyleTradeOff: 'medium',
        whoThisSuits: 'Working professionals learning alongside their job',
        description: 'Flexible schedule with structured milestones.'
    },
    {
        id: 'deep_dive',
        name: 'Deep Dive / Mastery',
        durationRange: '12-18 months',
        dailyEffortRange: '2-3 hours',
        intensityLevel: 'moderate',
        lifestyleTradeOff: 'low',
        whoThisSuits: 'Those who want comprehensive understanding, not just job-ready skills',
        description: 'Thorough learning including fundamentals and advanced topics.'
    }
];

export const goalApproaches: GoalApproaches = {
    tech: techApproaches,
    exams: examApproaches,
    govt: examApproaches,
    business: universalApproaches,
    creative: universalApproaches,
    skills: universalApproaches,
    sports: universalApproaches,
    arts: universalApproaches,
    medical: examApproaches,
    other: universalApproaches,
    default: universalApproaches
};

export function getApproachesForField(field: string): ApproachDefinition[] {
    return goalApproaches[field as keyof GoalApproaches] || goalApproaches.default;
}
