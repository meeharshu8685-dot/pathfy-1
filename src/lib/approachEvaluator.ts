// Rule-based approach evaluator
// NO AI - uses simple logic to compare user data with approach requirements

import { ApproachDefinition } from './approachDefinitions';

export interface UserProfile {
    availableHoursPerDay: number;
    availableHoursPerWeek: number;
    timelineMonths: number;
    currentLevel: 'beginner' | 'intermediate' | 'advanced';
    hasOtherCommitments: boolean; // school, college, job
}

export interface ApproachEvaluation {
    approach: ApproachDefinition;
    fitStatus: 'good_fit' | 'needs_adjustment' | 'high_pressure';
    riskLevel: 'low' | 'moderate' | 'high';
    reasoning: string;
}

function parseHoursRange(range: string): { min: number; max: number } {
    const match = range.match(/(\d+)-(\d+)/);
    if (match) {
        return { min: parseInt(match[1]), max: parseInt(match[2]) };
    }
    // Single number
    const single = range.match(/(\d+)/);
    if (single) {
        return { min: parseInt(single[1]), max: parseInt(single[1]) };
    }
    return { min: 0, max: 0 };
}

function parseDurationRange(range: string): { min: number; max: number } {
    const match = range.match(/(\d+)-(\d+)/);
    if (match) {
        return { min: parseInt(match[1]), max: parseInt(match[2]) };
    }
    const single = range.match(/(\d+)/);
    if (single) {
        return { min: parseInt(single[1]), max: parseInt(single[1]) };
    }
    return { min: 0, max: 0 };
}

export function evaluateApproach(
    approach: ApproachDefinition,
    user: UserProfile
): ApproachEvaluation {
    const requiredHours = parseHoursRange(approach.dailyEffortRange);
    const durationRange = parseDurationRange(approach.durationRange);

    let fitStatus: 'good_fit' | 'needs_adjustment' | 'high_pressure' = 'good_fit';
    let riskLevel: 'low' | 'moderate' | 'high' = 'low';
    let reasoning = '';

    // Check if user has enough daily hours
    if (user.availableHoursPerDay < requiredHours.min) {
        fitStatus = 'high_pressure';
        riskLevel = 'high';
        reasoning = `This approach requires ${requiredHours.min}-${requiredHours.max} hours/day, but you have ${user.availableHoursPerDay} hours available.`;
    } else if (user.availableHoursPerDay < requiredHours.max) {
        fitStatus = 'needs_adjustment';
        riskLevel = 'moderate';
        reasoning = `You can manage this with your available ${user.availableHoursPerDay} hours, but the recommended is ${requiredHours.max} hours/day.`;
    } else {
        fitStatus = 'good_fit';
        riskLevel = 'low';
        reasoning = `Your available ${user.availableHoursPerDay} hours/day aligns well with this approach.`;
    }

    // Check timeline fit
    if (user.timelineMonths < durationRange.min) {
        if (fitStatus !== 'high_pressure') {
            fitStatus = 'high_pressure';
        }
        if (riskLevel !== 'high') {
            riskLevel = 'high';
        }
        reasoning += ` Your timeline of ${user.timelineMonths} months is shorter than the typical ${durationRange.min}-${durationRange.max} months for this approach.`;
    } else if (user.timelineMonths > durationRange.max) {
        // More time is generally good
        reasoning += ` You have ${user.timelineMonths} months, which gives you extra buffer beyond the typical ${durationRange.max} months.`;
    }

    // Check lifestyle trade-off vs commitments
    if (user.hasOtherCommitments && approach.lifestyleTradeOff === 'very_high') {
        if (fitStatus === 'good_fit') {
            fitStatus = 'needs_adjustment';
        }
        if (riskLevel === 'low') {
            riskLevel = 'moderate';
        }
        reasoning += ' This approach requires very high lifestyle trade-off which may conflict with your other commitments.';
    }

    return {
        approach,
        fitStatus,
        riskLevel,
        reasoning
    };
}

export function evaluateAllApproaches(
    approaches: ApproachDefinition[],
    user: UserProfile
): ApproachEvaluation[] {
    return approaches.map(approach => evaluateApproach(approach, user));
}
