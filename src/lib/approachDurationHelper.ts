import { getApproachesForField, ApproachDefinition } from "./approachDefinitions";

/**
 * Parses a duration range string and returns the average in weeks
 * Examples: "3-6 months" -> 18 weeks, "12-24 months" -> 72 weeks
 */
export function parseApproachDuration(durationRange: string): number {
    // Extract numbers from the duration string
    const numbers = durationRange.match(/\d+/g);

    if (!numbers || numbers.length === 0) {
        return 12; // Default to 12 weeks
    }

    const min = parseInt(numbers[0], 10);
    const max = numbers[1] ? parseInt(numbers[1], 10) : min;
    const average = (min + max) / 2;

    // Determine if it's months or weeks
    const isMonths = durationRange.toLowerCase().includes('month');

    if (isMonths) {
        return Math.round(average * 4); // Convert months to weeks
    }

    return Math.round(average); // Already in weeks
}

/**
 * Gets the approach definition by ID for a given field
 */
export function getApproachById(field: string, approachId: string): ApproachDefinition | null {
    const approaches = getApproachesForField(field);
    return approaches.find(a => a.id === approachId) || null;
}

/**
 * Gets the duration in weeks for a goal based on its selected approach
 * Falls back to goal deadline if no approach selected
 */
export function getGoalDurationWeeks(
    goal: {
        field?: string | null;
        selected_approach_id?: string | null;
        deadline: string;
    }
): { weeks: number; source: 'approach' | 'deadline'; approachName?: string } {
    // Try to get duration from selected approach
    if (goal.selected_approach_id && goal.field) {
        const approach = getApproachById(goal.field, goal.selected_approach_id);
        if (approach) {
            return {
                weeks: parseApproachDuration(approach.durationRange),
                source: 'approach',
                approachName: approach.name
            };
        }
    }

    // Fall back to goal deadline
    const deadlineWeeks = Math.ceil(
        (new Date(goal.deadline).getTime() - Date.now()) / (7 * 24 * 60 * 60 * 1000)
    );

    return {
        weeks: Math.max(1, deadlineWeeks),
        source: 'deadline'
    };
}
