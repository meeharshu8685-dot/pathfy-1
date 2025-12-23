import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface AnalyzeRequest {
  type: "reality-check" | "decompose" | "roadmap" | "optimize";
  goal: string;
  skillLevel?: string;
  hoursPerWeek?: number;
  deadlineWeeks?: number;
  availableMinutes?: number;
  focusLevel?: number;
  existingTasks?: unknown[];
}

const SYSTEM_PROMPTS = {
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
    const { type, goal, skillLevel, hoursPerWeek, deadlineWeeks, availableMinutes, focusLevel, existingTasks } = body;

    console.log(`Processing ${type} request for goal: ${goal?.substring(0, 50)}...`);

    let userPrompt = "";
    
    switch (type) {
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
        temperature: 0.7,
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
