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
    const apiKey = Deno.env.get('AZURE_OPENAI_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'AZURE_OPENAI_API_KEY not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    const { type, goal } = body;

    console.log(`Processing AI request type: ${type} for goal: ${goal}`);

    let systemPrompt = `You are an expert AI career and learning advisor. Always respond with valid JSON only, no markdown or extra text.`;
    let userPrompt = `Goal: ${goal}\n`;

    if (type === 'reality-check-v2') {
      const { field, skillLevel, calibratedSkillLevel, hoursPerWeek, deadlineWeeks } = body;

      // Check if this is a competitive exam
      const isCompetitiveExam = field === 'exams' || field === 'govt';
      const deadlineMonths = Math.round(deadlineWeeks / 4);

      if (isCompetitiveExam) {
        systemPrompt = `You are an expert career advisor familiar with Indian coaching institute preparation models. 
CRITICAL RULES:
1. NEVER use words like "unrealistic", "impossible", or "guaranteed"
2. ALWAYS present preparation as CHOICES (paths), not verdicts
3. Use coaching institute terminology that Indian students recognize
4. Show trade-offs clearly (time, effort, lifestyle, burnout risk)
Always respond with valid JSON only.`;

        userPrompt += `User's current level: ${calibratedSkillLevel || skillLevel}
Available time: ${hoursPerWeek} hours/week for ${deadlineMonths} months

For competitive exams, evaluate using these models:
- If timeline <= 12 months: "Drop-Year / Full-Focus Preparation" (8-10 hrs/day, very high lifestyle trade-off)
- If timeline >= 24 months: "Long-Term / Sustainable Preparation" (5-6 hrs/day, moderate trade-off)
- If timeline is 12-24 months: Show BOTH paths and explain trade-offs

Return JSON:
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
        userPrompt += `Analyze feasibility for a ${skillLevel} in ${field}. 
Available: ${hoursPerWeek}h/week for ${deadlineWeeks} weeks.
Return JSON:
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
      userPrompt += `Break this goal into atomic tasks (each < 90 mins). 
Return JSON:
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

      systemPrompt = `You are an expert learning mentor and career advisor. You create detailed, actionable learning roadmaps.
CRITICAL: You MUST return valid JSON only with no additional text, markdown, or formatting.
The JSON must follow the EXACT structure specified.`;

      userPrompt = `Create a comprehensive learning roadmap for achieving this goal: ${goal}

Learner Profile:
- Current skill level: ${skillLevel}
- Weekly time commitment: ${hoursPerWeek} hours
- Timeline: approximately ${deadlineWeeks} weeks

STRICT REQUIREMENTS:
1. Create exactly 6 to 8 phases (not more, not less)
2. Each phase MUST have ALL fields shown in the structure below
3. whatToLearn and whatToDo arrays MUST each have 3-5 items
4. Time estimates should add up to roughly ${deadlineWeeks} weeks total
5. Be specific with skills and tasks - no vague descriptions

Return this EXACT JSON structure:
{
  "phases": [
    {
      "phaseNumber": 1,
      "phaseName": "Foundation Setup",
      "goal": "Specific goal for this phase",
      "timeEstimate": "2 weeks",
      "whatToLearn": ["Skill 1", "Skill 2", "Skill 3"],
      "whatToDo": ["Task 1", "Task 2", "Project 1"],
      "outcome": "What you can do after completing this phase"
    },
    {
      "phaseNumber": 2,
      "phaseName": "Core Fundamentals",
      "goal": "Build on foundation",
      "timeEstimate": "2 weeks",
      "whatToLearn": ["Advanced Skill 1", "Advanced Skill 2", "Advanced Skill 3"],
      "whatToDo": ["Practice Task 1", "Build Project 1", "Exercise 1"],
      "outcome": "Measurable skill gained"
    }
  ],
  "whatToIgnore": ["Distraction 1", "Premature optimization", "Things to avoid"],
  "finalRealityCheck": "Honest, encouraging advice about the journey",
  "closingMotivation": "An inspiring message to keep them motivated"
}

Continue this pattern for all 6-8 phases. Make each phase build on the previous one logically.`;
    } else if (type === 'optimize') {
      const { availableMinutes, focusLevel, existingTasks, consistencyNote } = body;
      userPrompt += `User has ${availableMinutes} mins and ${focusLevel}% energy. 
Consistency: ${consistencyNote}.
Current tasks available: ${JSON.stringify(existingTasks)}.
Pick the best tasks for today or suggest rest.
Return JSON:
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

    // Azure OpenAI endpoint
    const azureEndpoint = 'https://roadmap-explaiener-resource.cognitiveservices.azure.com';
    const deploymentName = 'gpt-4o-mini'; // Your deployment name
    const apiVersion = '2024-12-01-preview';
    const azureUrl = `${azureEndpoint}/openai/deployments/${deploymentName}/chat/completions?api-version=${apiVersion}`;

    // Retry logic for transient failures
    let lastError = null;
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`Attempt ${attempt} for ${type}`);

        const azureResponse = await fetch(azureUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'api-key': apiKey
          },
          body: JSON.stringify({
            messages: [
              { role: 'system', content: systemPrompt },
              { role: 'user', content: userPrompt }
            ],
            temperature: 0.6,
            max_tokens: 4096,
            response_format: { type: 'json_object' }
          })
        });

        if (!azureResponse.ok) {
          const errorText = await azureResponse.text();
          console.error(`Azure OpenAI API Error [${azureResponse.status}] Attempt ${attempt}:`, errorText);

          // If rate limited or server error, retry
          if (azureResponse.status === 429 || azureResponse.status >= 500) {
            lastError = `Azure OpenAI API error: ${azureResponse.status}`;
            await new Promise(r => setTimeout(r, 1000 * attempt)); // Exponential backoff
            continue;
          }

          return new Response(JSON.stringify({ error: 'Azure OpenAI API failed', details: errorText, status: azureResponse.status }), {
            status: 502,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        const data = await azureResponse.json();
        const content = data.choices?.[0]?.message?.content;

        if (!content) {
          console.error('Empty content from Azure OpenAI, attempt', attempt);
          lastError = 'Empty response from AI';
          continue;
        }

        let result;
        try {
          // Parse the JSON response
          let cleaned = content.trim();

          // Remove markdown code blocks if present
          cleaned = cleaned.replace(/```json\n?/g, '').replace(/```\n?/g, '');

          // Try to find JSON object boundaries if the response has extra text
          const jsonStart = cleaned.indexOf('{');
          const jsonEnd = cleaned.lastIndexOf('}');
          if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
            cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
          }

          result = JSON.parse(cleaned);

          // Validate the result has expected structure for roadmap
          if (type === 'roadmap-v2') {
            if (!result.phases || !Array.isArray(result.phases) || result.phases.length === 0) {
              console.error('Invalid roadmap structure, missing phases');
              lastError = 'Invalid roadmap structure';
              continue;
            }
          }

        } catch (e) {
          console.error(`JSON parse error attempt ${attempt}:`, e);
          lastError = 'Failed to parse AI response';
          continue;
        }

        console.log(`Success on attempt ${attempt}`);
        return new Response(JSON.stringify({ result }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      } catch (fetchError: any) {
        console.error(`Fetch error attempt ${attempt}:`, fetchError);
        lastError = fetchError?.message || 'Network error';
        await new Promise(r => setTimeout(r, 1000 * attempt));
      }
    }

    // All retries failed
    return new Response(JSON.stringify({ error: 'Failed after 3 attempts', lastError }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    console.error('Unhandled error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error', message: error?.message || 'Unknown error' }), {
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
    });
  }
});
