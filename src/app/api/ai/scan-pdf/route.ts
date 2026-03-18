import { NextResponse } from 'next/server';

const SYSTEM_PROMPT = `You are a citation metadata extractor. Given text from the first pages of a research paper or academic document, extract the following fields and return ONLY valid JSON (no markdown, no explanation):

{
  "title": "The full title of the paper/document",
  "authors": [
    { "firstName": "Given name", "lastName": "Family name", "condition": "general" }
  ],
  "year": "Publication year (4 digits)",
  "source": "Journal name, publisher, or conference name",
  "url": "DOI or URL if found in the text",
  "type": "article|book|website|thesis"
}

Rules:
- Extract ALL authors, maintaining their order
- If a field is not found, use an empty string ""
- For Thai names, put the first name in firstName and last name in lastName
- The "type" should be one of: article, book, website, thesis
- Return ONLY the JSON object, nothing else`;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text || text.trim().length < 20) {
      return NextResponse.json({ error: 'Text too short to extract citation data' }, { status: 400 });
    }

    const openaiKey = process.env.OPENAI_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    if (!openaiKey && !geminiKey) {
      return NextResponse.json({ 
        error: 'No AI API key configured. Please add OPENAI_API_KEY or GEMINI_API_KEY to your .env file.' 
      }, { status: 500 });
    }

    const errors: string[] = [];

    // Try OpenAI first
    if (openaiKey) {
      try {
        const result = await callOpenAI(openaiKey, text);
        if (result) return NextResponse.json(result);
      } catch (e: any) {
        console.error('OpenAI failed:', e.message);
        errors.push(`OpenAI: ${e.message}`);
      }
    }

    // Fallback to Gemini
    if (geminiKey) {
      try {
        const result = await retryWithDelay(() => callGemini(geminiKey, text), 2, 5000);
        if (result) return NextResponse.json(result);
      } catch (e: any) {
        console.error('Gemini failed:', e.message);
        errors.push(`Gemini: ${e.message}`);
      }
    }

    return NextResponse.json({ 
      error: `All AI providers failed. ${errors.join(' | ')}` 
    }, { status: 500 });
  } catch (error: any) {
    console.error('AI Scan error:', error);
    return NextResponse.json({ error: error.message || 'AI scan failed' }, { status: 500 });
  }
}

// Retry helper for rate-limited APIs
async function retryWithDelay(fn: () => Promise<any>, retries: number, delayMs: number): Promise<any> {
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (e: any) {
      if (i < retries && e.message?.includes('429')) {
        console.log(`Rate limited, retrying in ${delayMs / 1000}s... (attempt ${i + 2}/${retries + 1})`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      } else {
        throw e;
      }
    }
  }
}

async function callOpenAI(apiKey: string, text: string) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: `Extract citation metadata from this text:\n\n${text.substring(0, 4000)}` }
      ],
      temperature: 0.1,
      max_tokens: 1000
    })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenAI API error: ${err}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content?.trim();
  
  // Parse the JSON from the response
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  throw new Error('Could not parse AI response');
}

async function callGemini(apiKey: string, text: string) {
  // First, list available models to find ones that work
  const listRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
  
  if (!listRes.ok) {
    throw new Error('Failed to list Gemini models. Please check your API key.');
  }

  const listData = await listRes.json();
  const availableModels = listData.models || [];
  
  // Refined priority list (1.5-flash is most reliable for free tier)
  const preferredModelNames = [
    'gemini-1.5-flash',
    'gemini-2.0-flash-lite',
    'gemini-2.0-flash',
    'gemini-1.5-pro',
    'gemini-pro',
  ];
  
  const modelsToTry = preferredModelNames
    .map(name => availableModels.find((m: any) => 
      m.name?.includes(name) && m.supportedGenerationMethods?.includes('generateContent')
    ))
    .filter(Boolean);

  if (modelsToTry.length === 0) {
    // Last resort fallback
    const anyModel = availableModels.find((m: any) => m.supportedGenerationMethods?.includes('generateContent'));
    if (anyModel) modelsToTry.push(anyModel);
  }

  if (modelsToTry.length === 0) {
    throw new Error('No compatible Gemini model found for your API key.');
  }

  let lastError = null;
  for (const model of modelsToTry) {
    try {
      console.log(`Attempting Gemini model: ${model.name}`);
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/${model.name}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${SYSTEM_PROMPT}\n\nExtract citation metadata from this text:\n\n${text.substring(0, 4000)}`
            }]
          }],
          generationConfig: {
            temperature: 0.1,
            maxOutputTokens: 1000
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        const jsonMatch = content?.match(/\{[\s\S]*\}/);
        if (jsonMatch) return JSON.parse(jsonMatch[0]);
        continue; // Try next model if JSON parse fails
      }

      const errText = await res.text();
      console.warn(`Model ${model.name} failed:`, errText);
      
      // If it's a quota error or not found, try the next model
      if (res.status === 429 || res.status === 404) {
        lastError = new Error(`Gemini (${model.name}): ${errText}`);
        continue;
      }
      
      throw new Error(`Gemini API error (${model.name}): ${errText}`);
    } catch (e: any) {
      console.error(`Error with model ${model.name}:`, e.message);
      lastError = e;
      continue;
    }
  }

  throw lastError || new Error('All Gemini models failed');
}
