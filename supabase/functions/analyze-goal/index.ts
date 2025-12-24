// @ts-ignore
Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'GEMINI_API_KEY not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const { type, goal } = body;

    console.log(`Processing AI request type: ${type} for goal: ${goal}`);

    let prompt = `You are an AI career advisor. Goal: ${goal}\n`;

    if (type === 'reality-check-v2') {
      const { field, skillLevel, calibratedSkillLevel, hoursPerWeek, deadlineWeeks } = body;

      // Check if this is a competitive exam
      const isCompetitiveExam = field === 'exams' || field === 'govt';
      const deadlineMonths = Math.round(deadlineWeeks / 4);

      if (isCompetitiveExam) {
        // Special prompt for competitive exams - shows preparation paths, not pass/fail
        prompt += `You are an expert career advisor familiar with Indian coaching institute preparation models.
Goal: ${goal}
User's current level: ${calibratedSkillLevel || skillLevel}
Available time: ${hoursPerWeek} hours/week for ${deadlineMonths} months

CRITICAL RULES:
1. NEVER use words like "unrealistic", "impossible", or "guaranteed"
2. ALWAYS present preparation as CHOICES (paths), not verdicts
3. Use coaching institute terminology that Indian students recognize
4. Show trade-offs clearly (time, effort, lifestyle, burnout risk)

For competitive exams, evaluate using these models:
- If timeline <= 12 months: "Drop-Year / Full-Focus Preparation" (8-10 hrs/day, very high lifestyle trade-off)
- If timeline >= 24 months: "Long-Term / Sustainable Preparation" (5-6 hrs/day, moderate trade-off)
- If timeline is 12-24 months: Show BOTH paths and explain trade-offs

Return JSON ONLY:
{
  "feasibilityStatus": "achievable_with_conditions",
  "preparationApproach": "${deadlineMonths <= 12 ? 'drop_year' : deadlineMonths >= 24 ? 'long_term' : 'flexible'}",
  "requiredHours": number,
  "effectiveAvailableHours": number,
  "explanation": "Start with reassurance. Explain this is achievable under specific conditions. Use coaching terminology.",
  "preparationPaths": [
    {
      "pathName": "Drop-Year / Full-Focus Program",
      "duration": "10-12 months",
      "dailyStudyHours": "8-10 hours",
      "lifestyleTradeOff": "Very High - minimal entertainment, focused routine",
      "burnoutRisk": "High - requires mental resilience",
      "whoThisSuits": "Students who can dedicate full time without other commitments",
      "fitStatus": "achievable_with_commitment|needs_adjustment|high_pressure"
    },
    {
      "pathName": "Long-Term / Foundation Program", 
      "duration": "24-36 months",
      "dailyStudyHours": "5-6 hours",
      "lifestyleTradeOff": "Moderate - balanced with other activities",
      "burnoutRisk": "Lower - sustainable pace",
      "whoThisSuits": "Students starting early or preferring steady progress",
      "fitStatus": "good_fit|achievable_with_commitment"
    }
  ],
  "howToAchieve": {
    "minimumWeeklyCommitment": number,
    "recommendedWeeklyCommitment": number,
    "topPriorityAreas": ["string"],
    "timeToGoal": { "minimum": "string", "average": "string", "safe": "string" },
    "skillFitProjection": { "currentFit": number, "expectedFit": number },
    "alternativePositions": {
      "lowerAdjacent": { "title": "string", "description": "string" },
      "higherGrowth": { "title": "string", "description": "string" }
    },
    "recommendedResources": [{ "title": "string", "type": "string", "reason": "string" }],
    "healthyAdvice": "Advice about mental health, breaks, and sustainable preparation",
    "motivationalLine": "End with: Choose the model that fits your life, not just your ambition."
  }
}`;
      } else {
        // Original logic for non-exam goals (tech, skills, careers)
        prompt += `Analyze feasibility for a ${skillLevel} in ${field}. 
Available: ${hoursPerWeek}h/week for ${deadlineWeeks} weeks.
Return JSON ONLY:
{
  "feasibilityStatus": "realistic|risky|unrealistic",
  "requiredHours": number,
  "effectiveAvailableHours": number,
  "explanation": "string",
  "howToAchieve": {
    "minimumWeeklyCommitment": number,
    "recommendedWeeklyCommitment": number,
    "topPriorityAreas": ["string"],
    "timeToGoal": { "minimum": "string", "average": "string", "safe": "string" },
    "skillFitProjection": { "currentFit": number, "expectedFit": number },
    "alternativePositions": {
      "lowerAdjacent": { "title": "string", "description": "string" },
      "higherGrowth": { "title": "string", "description": "string" }
    },
    "recommendedResources": [{ "title": "string", "type": "string", "reason": "string" }],
    "healthyAdvice": "string",
    "motivationalLine": "string"
  }
}`;
      }
    } else if (type === 'decompose') {
      prompt += `Break this goal into atomic tasks (each < 90 mins). 
Return JSON ONLY:
{
  "phases": [
    {
      "id": "p1",
      "name": "Phase Name",
      "tasks": [
        {
          "id": "t1",
          "title": "Task Title",
          "microTasks": [
            { "id": "mt1", "title": "Micro-task", "estimatedMinutes": number }
          ]
        }
      ]
    }
  ],
  "totalHours": number,
  "motivation": "Encouraging string",
  "careerPositions": {
    "lower": { "title": "string", "description": "string", "salaryRange": "string", "marketDemand": "string", "difficulty": "string" },
    "target": { "title": "string", "description": "string", "salaryRange": "string", "marketDemand": "string", "difficulty": "string" },
    "higher": { "title": "string", "description": "string", "salaryRange": "string", "marketDemand": "string", "difficulty": "string" }
  }
}`;
    } else if (type === 'roadmap-v2') {
      const { skillLevel, hoursPerWeek, deadlineWeeks } = body;
      prompt += `Create a learning roadmap (6-9 phases) for a ${skillLevel} level.
Return JSON ONLY:
{
  "phases": [
    {
      "phaseNumber": number,
      "phaseName": "string",
      "goal": "string",
      "timeEstimate": "string",
      "whatToLearn": ["string"],
      "whatToDo": ["string"],
      "outcome": "string"
    }
  ],
  "whatToIgnore": ["string"],
  "finalRealityCheck": "string",
  "closingMotivation": "string"
}`;
    } else if (type === 'optimize') {
      const { availableMinutes, focusLevel, existingTasks, consistencyNote } = body;
      prompt += `User has ${availableMinutes} mins and ${focusLevel}% energy. 
Consistency: ${consistencyNote}.
Current tasks available: ${JSON.stringify(existingTasks)}.
Pick the best tasks for today or suggest rest.
Return JSON ONLY:
{
  "tasks": [
    { "id": "string", "title": "string", "estimatedMinutes": number, "priority": "critical|high|medium|light", "reason": "string", "difficulty": "easy|moderate|challenging" }
  ],
  "focusWarning": "string|null",
  "totalTime": number,
  "mentorNote": "string",
  "suggestRest": boolean
}`;
    } else {
      return new Response(JSON.stringify({ error: `Unsupported type: ${type}` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
        ],
        generationConfig: {
          temperature: 0.7,
          responseMimeType: 'application/json'
        }
      })
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error(`Gemini API Error [${geminiResponse.status}]:`, errorText);
      return new Response(JSON.stringify({ error: 'Gemini API failed', details: errorText, status: geminiResponse.status }), {
        status: 502, // Bad Gateway
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await geminiResponse.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      return new Response(JSON.stringify({ error: 'Empty response from AI', raw: data }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let result;
    try {
      const cleaned = content.replace(/```json\n?|```/g, '').trim();
      result = JSON.parse(cleaned);
    } catch (e) {
      return new Response(JSON.stringify({ error: 'Failed to parse AI JSON', content }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal Server Error', message: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
