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

    const { type, goal, field, skillLevel, calibratedSkillLevel, hoursPerWeek, deadlineWeeks } = await req.json();

    console.log(`Processing ${type} for goal: ${goal}`);

    // Simple prompt construction
    let prompt = `You are an AI career advisor. Analyze this goal and return a JSON response.\n\nGoal: ${goal}\nType: ${type}\n`;

    if (type === 'roadmap-v2') {
      prompt += `Create a detailed roadmap with 6-9 phases. Return JSON with this structure:
{
  "phases": [
    {
      "phaseNumber": 1,
      "phaseName": "Phase name",
      "goal": "What this phase achieves",
      "timeEstimate": "2-3 weeks",
      "whatToLearn": ["concept1", "concept2"],
      "whatToDo": ["action1", "action2"],
      "outcome": "What you'll gain"
    }
  ],
  "whatToIgnore": ["distraction1", "distraction2"],
  "finalRealityCheck": "Honest assessment",
  "closingMotivation": "Encouraging message"
}`;
    } else if (type === 'reality-check-v2') {
      prompt += `Analyze feasibility. Return JSON with:
{
  "feasibilityStatus": "realistic|risky|unrealistic",
  "requiredHours": 500,
  "effectiveAvailableHours": 400,
  "explanation": "Clear explanation",
  "howToAchieve": {
    "minimumWeeklyCommitment": 10,
    "recommendedWeeklyCommitment": 15,
    "topPriorityAreas": ["area1", "area2"],
    "timeToGoal": { "minimum": "3 months", "average": "6 months", "safe": "9 months" },
    "skillFitProjection": { "currentFit": 40, "expectedFit": 85 },
    "alternativePositions": {
      "lowerAdjacent": { "title": "Junior role", "description": "desc" },
      "higherGrowth": { "title": "Senior role", "description": "desc" }
    },
    "recommendedResources": [{ "title": "Resource", "type": "course", "reason": "why" }],
    "healthyAdvice": "Supportive guidance",
    "motivationalLine": "Encouraging line"
  }
}`;
    }

    // Call Gemini
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

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
      console.error('Gemini API error:', errorText);
      return new Response(
        JSON.stringify({
          error: 'Gemini API failed',
          details: errorText,
          status: geminiResponse.status
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await geminiResponse.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!content) {
      console.error('Empty Gemini response:', data);
      return new Response(
        JSON.stringify({ error: 'Empty AI response', raw: data }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse JSON response
    let result;
    try {
      const cleaned = content.replace(/```json\n?|```/g, '').trim();
      result = JSON.parse(cleaned);
    } catch (e) {
      console.error('JSON parse error:', e);
      return new Response(
        JSON.stringify({ error: 'Failed to parse AI response', content }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Success!');
    return new Response(
      JSON.stringify({ result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Function error:', error);
    return new Response(
      JSON.stringify({
        error: 'Function crashed',
        message: error.message,
        stack: error.stack
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
