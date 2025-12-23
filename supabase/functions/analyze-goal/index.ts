import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AnalyzeRequest {
  type: "reality-check" | "reality-check-v2" | "decompose" | "roadmap" | "optimize";
  goal: string;
  field?: string;
  skillLevel?: string;
  calibratedSkillLevel?: string;
  hoursPerWeek?: number;
  deadlineWeeks?: number;
  availableMinutes?: number;
  focusLevel?: number;
  existingTasks?: unknown[];
  quizResults?: unknown;
}

const FIELD_EFFORT_TABLES = `
CONSERVATIVE EFFORT TABLES BY FIELD (base hours for intermediate level):

TECH:
- Entry-level developer: 400-600 hours
- Mid-level developer: 800-1200 hours
- Senior developer: 1500-2000 hours
- Data Science entry: 500-700 hours
- Machine Learning: 800-1200 hours

EXAMS:
- Competitive exams (GATE, CAT): 800-1200 hours
- Professional certifications: 200-400 hours
- Government exams (UPSC): 2000-3000 hours

BUSINESS:
- MBA preparation: 400-600 hours
- Startup basics: 300-500 hours
- Management skills: 200-400 hours

SPORTS:
- Amateur competitive: 500-800 hours
- Semi-professional: 1500-2500 hours
- Elite level: 3000+ hours

ARTS/CREATIVE:
- Portfolio-ready: 300-500 hours
- Professional level: 800-1200 hours
- Expert level: 1500-2500 hours

GOVERNMENT:
- Entry-level positions: 600-1000 hours
- Mid-level positions: 1000-1500 hours

SKILL LEVEL MULTIPLIERS:
- beginner: 1.4x
- intermediate: 1.0x
- advanced: 0.7x

REAL-LIFE REDUCTION: Apply 0.7 factor to available hours (30% lost to life circumstances)
`;

const SYSTEM_PROMPTS = {
  "reality-check-v2": `You are a strict, honest career advisor for students. Your job is to validate if a goal is achievable and provide a comprehensive achievement plan.

${FIELD_EFFORT_TABLES}

ANALYSIS RULES:
1. Use CONSERVATIVE estimates always
2. Apply the 0.7 real-life reduction factor to available hours
3. If effective hours < 70% of required, mark as "unrealistic"
4. If effective hours are 70-90% of required, mark as "risky"
5. Only mark as "realistic" if buffer exists
6. NEVER encourage impossible timelines
7. This system MUST be able to say NO

OUTPUT RULES:
- Never show 100% for skill fit projections (cap at 92%)
- Never guarantee success
- Provide calm, neutral explanations
- Only ONE motivational line, field-specific, no hype

Return a JSON object with EXACTLY this structure:
{
  "feasibilityStatus": "realistic" | "risky" | "unrealistic",
  "requiredHours": number,
  "effectiveAvailableHours": number,
  "explanation": "neutral, clear 2-3 sentence explanation without motivational fluff",
  "howToAchieve": {
    "minimumWeeklyCommitment": number,
    "recommendedWeeklyCommitment": number,
    "topPriorityAreas": ["area1", "area2", "area3", "area4", "area5"],
    "timeToGoal": {
      "minimum": "X months",
      "average": "Y months",
      "safe": "Z months"
    },
    "skillFitProjection": {
      "currentFit": number (0-100),
      "expectedFit": number (0-92, never 100)
    },
    "alternativePositions": {
      "lowerAdjacent": { "title": "position name", "description": "brief description" },
      "higherGrowth": { "title": "position name", "description": "brief description" }
    },
    "recommendedResources": [
      { "title": "resource name", "type": "book|video|course|article|community", "reason": "why this helps" }
    ],
    "healthyAdvice": "2-3 sentences of calm, realistic, supportive guidance",
    "motivationalLine": "exactly one field-specific, non-hype motivational line"
  }
}`,

  "reality-check": `You are a strict career advisor for students. Your job is to validate if a goal is achievable.

RULES:
- Use CONSERVATIVE time estimates (always assume things take longer)
- If confidence is low, mark as "risky"
- If effort gap is large (>30%), mark as "unrealistic"
- Never encourage impossible timelines
- This system must be able to say NO

Use these time estimates for common goals:
- Basic web development: 200-300 hours
- Backend engineering fundamentals: 400-600 hours
- Full-stack development: 600-900 hours
- Data Science basics: 300-500 hours
- Machine Learning: 500-800 hours
- Mobile development: 300-500 hours
- DevOps fundamentals: 200-400 hours

For skill levels, multiply by:
- complete-beginner: 1.5x
- beginner: 1.2x
- intermediate: 1.0x
- advanced: 0.7x

Return a JSON object with EXACTLY this structure:
{
  "status": "realistic" | "risky" | "unrealistic",
  "requiredHours": number,
  "availableHours": number,
  "gap": number (positive = buffer, negative = shortage),
  "gapExplanation": "detailed explanation of the gap",
  "recommendations": ["action 1", "action 2", ...]
}`,

  "decompose": `You are a task decomposition expert. Break goals into atomic, executable tasks.

RULES:
- NO task longer than 90 minutes
- NO vague verbs like "learn", "understand", "study"
- USE action verbs: "implement", "write", "debug", "test", "read", "document"
- Every task must be MEASURABLE (can verify completion)
- Tasks must respect prerequisites (order matters)
- Include time estimates for each micro-task

Return a JSON array of phases:
[{
  "id": "1",
  "name": "Phase 1: Foundations",
  "tasks": [{
    "id": "1-1",
    "title": "Task title with action verb",
    "microTasks": [{
      "id": "1-1-1",
      "title": "Micro task with measurable outcome",
      "estimatedMinutes": 45
    }]
  }]
}]`,

  "roadmap": `You are a roadmap builder that creates dependency-aware learning paths.

RULES:
- Enforce CORRECT learning order (fundamentals before advanced)
- Each step has dependencies (prerequisite step IDs)
- First step has no dependencies (empty array)
- Lock tasks until prerequisites are completed
- Insert milestones at logical checkpoints
- NO parallel overload (max 1 step unlocked at a time)

Return a JSON array:
[{
  "id": 1,
  "task": "Step description",
  "dependencies": [array of step IDs that must be completed first],
  "estimatedHours": number,
  "status": "unlocked" (only first step) or "locked",
  "milestone": "optional milestone name"
}]`,

  "optimize": `You are a study session optimizer. Decide what the student should do TODAY.

RULES:
- Suggest MAXIMUM 3 tasks
- Match task difficulty to available time and focus level
- Prefer critical-path tasks (those blocking other tasks)
- If time < 30 min, suggest review/revision only
- If focus is low (<30), avoid new concepts entirely
- Be honest about what can be accomplished

Focus level guide:
- 0-30: Low focus - only passive review, no new learning
- 31-70: Medium focus - can do moderate tasks
- 71-100: High focus - can tackle complex tasks

Return a JSON object:
{
  "tasks": [{
    "id": "1",
    "title": "Task description",
    "estimatedMinutes": number,
    "priority": "critical" | "high" | "medium",
    "reason": "why this task now"
  }],
  "focusWarning": "optional warning if focus is low",
  "totalTime": total minutes
}`
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const body: AnalyzeRequest = await req.json();
    const { type, goal, field, skillLevel, calibratedSkillLevel, hoursPerWeek, deadlineWeeks, availableMinutes, focusLevel, existingTasks, quizResults } = body;

    console.log(`Processing ${type} request for goal: ${goal?.substring(0, 50)}...`);

    let userPrompt = "";
    
    switch (type) {
      case "reality-check-v2":
        const effectiveLevel = calibratedSkillLevel || skillLevel || "beginner";
        const totalWeeks = deadlineWeeks || 12;
        const weeklyHours = hoursPerWeek || 10;
        const rawAvailableHours = weeklyHours * totalWeeks;
        
        userPrompt = `Analyze this career/learning goal for a student:

GOAL: ${goal}
FIELD: ${field || "other"}
SKILL LEVEL (self-declared): ${skillLevel || "beginner"}
CALIBRATED SKILL LEVEL (from quiz): ${effectiveLevel}
${quizResults ? `QUIZ CONFIDENCE: ${JSON.stringify(quizResults)}` : ""}

AVAILABLE TIME:
- Hours per week: ${weeklyHours}
- Timeline: ${totalWeeks} weeks
- Raw available hours: ${rawAvailableHours}
- After 0.7 real-life reduction: ${Math.round(rawAvailableHours * 0.7)} effective hours

Provide a comprehensive, HONEST assessment. Use the effort tables for the "${field || "other"}" field.
Apply the skill level multiplier to required hours.
This feature MUST be able to say NO if the goal is unrealistic.
Provide exactly 3-5 recommended resources.`;
        break;

      case "reality-check":
        const availableHours = (hoursPerWeek || 10) * (deadlineWeeks || 12);
        userPrompt = `Analyze this goal for feasibility:
Goal: ${goal}
Current skill level: ${skillLevel || "beginner"}
Available hours per week: ${hoursPerWeek || 10}
Deadline: ${deadlineWeeks || 12} weeks (${availableHours} total hours available)

Provide a realistic assessment. Be conservative. This feature must be able to say NO.`;
        break;

      case "decompose":
        userPrompt = `Decompose this goal into atomic tasks:
Goal: ${goal}

Create 3-5 phases with 2-4 tasks each. Each task should have 2-5 micro-tasks.
Remember: NO task > 90 minutes, NO vague verbs, all tasks must be measurable.`;
        break;

      case "roadmap":
        userPrompt = `Build a dependency-locked roadmap for:
Goal: ${goal}

Create 8-15 sequential steps with proper dependencies. Include 3-4 milestones.
First step is unlocked, all others are locked until prerequisites complete.`;
        break;

      case "optimize":
        userPrompt = `Optimize today's study session:
Available time: ${availableMinutes || 60} minutes
Focus level: ${focusLevel || 50}/100
${existingTasks ? `Pending tasks: ${JSON.stringify(existingTasks)}` : "No specific pending tasks"}

Suggest what to do RIGHT NOW. Maximum 3 tasks. Be realistic about what can be done.`;
        break;

      default:
        throw new Error(`Unknown analysis type: ${type}`);
    }

    const systemPrompt = SYSTEM_PROMPTS[type];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error("No response from AI");
    }

    console.log("AI response received, parsing...");

    // Extract JSON from response (handle markdown code blocks)
    let jsonStr = content;
    const jsonMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    try {
      const result = JSON.parse(jsonStr);
      console.log(`Successfully parsed ${type} response`);
      
      return new Response(
        JSON.stringify({ result, type }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (parseError) {
      console.error("JSON parse error:", parseError, "Content:", content.substring(0, 500));
      throw new Error("Failed to parse AI response as JSON");
    }

  } catch (error) {
    console.error("Error in analyze-goal:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
