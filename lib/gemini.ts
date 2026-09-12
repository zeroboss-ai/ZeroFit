import { UserProfile, Language } from '@/types';
import { parseFoodIntake, parsePhysicalActivity } from './nutrition-parser';

export const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY?.trim() || '';

export const GEMINI_MODELS = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];
export const GEMINI_MODEL = 'gemini-1.5-flash';

export interface ActivityAnalysisResult {
  caloriesConsumed: number;
  proteinGrams: number;
  carbGrams: number;
  fatGrams: number;
  mealBreakdown: Array<{
    item: string;
    portion?: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  }>;
  caloriesBurned: number;
  activityBreakdown: Array<{
    name: string;
    durationOrMetric: string;
    caloriesBurned: number;
  }>;
  netCalories: number; // Consumed - Burned
  targetCalories: number;
  pacingRecommendation: 'deploy_more_effort' | 'go_slow_recover' | 'optimal_pace';
  pacingTitle: string;
  pacingExplanation: string;
  nextStepAdvice: string;
}

/**
 * Call Gemini 3.6 Flash to parse daily meals and activities,
 * calculate exact macros consumed and calories burned, and evaluate effort.
 */
export async function analyzeDailyActivityAndNutrition(
  foodText: string,
  activityText: string,
  profile: Partial<UserProfile>
): Promise<ActivityAnalysisResult> {
  const currentWeight = profile.weightKg || 75;
  const targetWeight = profile.targetWeightKg || currentWeight;
  const targetCalories = profile.targetCalories || 2000;
  const targetProtein = profile.proteinGrams || 140;

  const isFatLoss = targetWeight < currentWeight - 0.5 || profile.goal === 'lose_fat';
  const effectiveGoal = isFatLoss ? 'lose_fat' : profile.goal || 'general_health';
  const goalDescription = isFatLoss
    ? `Fat Loss & Body Recomposition (Target: ${currentWeight} kg down to ${targetWeight} kg, Goal: Burn Body Fat while Preserving Lean Muscle Mass)`
    : effectiveGoal === 'gain_muscle'
    ? `Hypertrophy & Muscle Gain (Target: ${currentWeight} kg up to ${targetWeight} kg)`
    : 'Health & Fitness Maintenance';

  const systemPrompt = `You are the ZeroFIT Clinical Nutrition & Sports Science Engine.
Analyze the user's daily food intake and physical activities.
Calculate accurate estimates based on Indian and International foods and exercise METs.

User Metrics & Objectives:
- Current Weight: ${currentWeight} kg
- Target Weight: ${targetWeight} kg
- Primary Goal: ${goalDescription}
- Daily Caloric Target: ${targetCalories} kcal (Caloric Deficit for Fat Loss)
- Daily Protein Target: ${targetProtein}g (for Muscle Preservation via mTOR stimulation)

Food Eaten Today:
"${foodText || 'None logged'}"

Activities Done Today:
"${activityText || 'None logged'}"

Return ONLY a valid, raw JSON object (without markdown code blocks, backticks, or preamble) matching this schema. Be concise with mealBreakdown (summarize into 3-5 main items):
{
  "caloriesConsumed": number,
  "proteinGrams": number,
  "carbGrams": number,
  "fatGrams": number,
  "mealBreakdown": [
    { "item": "string", "portion": "string", "calories": number, "protein": number, "carbs": number, "fats": number }
  ],
  "caloriesBurned": number,
  "activityBreakdown": [
    { "name": "string", "durationOrMetric": "string", "caloriesBurned": number }
  ],
  "netCalories": number,
  "pacingRecommendation": "deploy_more_effort" | "go_slow_recover" | "optimal_pace",
  "pacingTitle": "string",
  "pacingExplanation": "string",
  "nextStepAdvice": "string"
}

CRITICAL SCIENTIFIC PACING & EVALUATION LOGIC:
1. "optimal_pace":
   - For Fat Loss (Goal: ${goalDescription}): A caloric deficit is REQUIRED to burn fat! If calories consumed are within a healthy deficit range (e.g. 1,600 to ${targetCalories + 200} kcal), and the user is moving/exercising, they are in the OPTIMAL ZONE.
   - Pacing Title: "🎯 On Track: Optimal Fat Burning & Muscle Preservation"
   - Explanation: Explain how their calorie deficit mobilizes stored fat while their protein intake and workouts preserve lean muscle tissue.

2. "deploy_more_effort":
   - Trigger when: Consumed calories are in a SURPLUS (exceeding target by >300 kcal, e.g. binge eating, sugary drinks), OR activity was completely sedentary/zero movement so no deficit was achieved.
   - Pacing Title: "🚀 Deploy More Effort: Calorie Surplus / Sedentary Pattern"
   - Explanation: Encourage a 20-min brisk walk to clear glucose or reducing calorie-dense oils.

3. "go_slow_recover":
   - CRITICAL: NEVER trigger "go_slow_recover" simply because the user has a caloric deficit! Deficit is the entire point of fat loss!
   - ONLY trigger "go_slow_recover" in genuine clinical danger:
     a) Consumed calories are under 1,100–1,200 kcal (dangerous starvation / crash diet), OR
     b) Physical training is excessive overtraining (>2.5 hours of intense exhaustion risking injury and elevated cortisol).
   - Pacing Title: "🧘 Go Slow & Refuel: Critical Undereating / Overtraining Detected"`;

  try {
    const rawText = await queryGeminiAPI(systemPrompt, 3500, 0.2);

    if (!rawText) {
      return fallbackAnalysis(foodText, activityText, profile);
    }

    // Robust JSON extraction matching the outer-most { ... }
    let cleaned = rawText.trim();
    // Remove markdown code block wrappers like ```json ... ```
    cleaned = cleaned.replace(/^```json\s*/i, '').replace(/^```\s*/, '').replace(/\s*```$/, '');
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleaned = jsonMatch[0];
    }

    const parsed: ActivityAnalysisResult = JSON.parse(cleaned);

    parsed.targetCalories = targetCalories;
    if (parsed.netCalories === undefined) {
      parsed.netCalories = (parsed.caloriesConsumed || 0) - (parsed.caloriesBurned || 0);
    }

    return parsed;
  } catch (error) {
    console.error('Gemini Activity Analysis Error:', error);
    return fallbackAnalysis(foodText, activityText, profile);
  }
}

/**
 * Universal Gemini API caller with automatic model fallback (gemini-1.5-flash -> gemini-2.0-flash -> gemini-1.5-pro)
 */
async function queryGeminiAPI(
  prompt: string,
  maxTokens = 2500,
  temperature = 0.2
): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    console.warn(
      'Zero FIT: GEMINI_API_KEY is not configured in environment. Using evidence-based internal algorithms.'
    );
    return null;
  }

  for (const model of GEMINI_MODELS) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature,
            maxOutputTokens: maxTokens,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const candidateText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (candidateText) return candidateText.trim();
      } else {
        const errText = await response.text();
        console.warn(`Zero FIT: Gemini API returned status ${response.status} for ${model}:`, errText);
        // If 401 or 403, credentials are wrong, no need to retry other models
        if (response.status === 401 || response.status === 403) {
          console.error(
            'Zero FIT: GEMINI_API_KEY is invalid or unauthorized. Please verify that your API key is created at https://aistudio.google.com/app/apikey (starts with "AIzaSy...").'
          );
          return null;
        }
      }
    } catch (error: any) {
      console.warn(`Zero FIT: Network error attempting Gemini model ${model}:`, error.message);
    }
  }

  return null;
}

/**
 * Robust clinical fallback if offline or API limit reached
 */
function fallbackAnalysis(
  foodText: string,
  activityText: string,
  profile: Partial<UserProfile>
): ActivityAnalysisResult {
  const currentWeight = profile.weightKg || 75;
  const targetCalories = profile.targetCalories || 2000;
  const targetProtein = profile.proteinGrams || 140;
  const tdee = profile.tdee || Math.round(targetCalories * 1.25);

  // Parse natural language foods with exact quantities, Indian & international dishes
  const parsedFood = parseFoodIntake(foodText);
  // Parse physical activity with METs scaled by body weight
  const parsedAct = parsePhysicalActivity(activityText, currentWeight);

  const estimatedCals = parsedFood.totalCalories > 0 ? parsedFood.totalCalories : 1800;
  const estimatedProtein = parsedFood.totalProtein > 0 ? parsedFood.totalProtein : 85;
  const estimatedCarbs = parsedFood.totalCarbs > 0 ? parsedFood.totalCarbs : 210;
  const estimatedFats = parsedFood.totalFats > 0 ? parsedFood.totalFats : 55;

  // Base daily expenditure (BMR + Sedentary NEAT + Logged Exercise)
  // NOTE: We do NOT add workoutBurn on top of TDEE because TDEE already has exercise multipliers built in.
  const bmrEstimate = profile.bmr || Math.round(10 * currentWeight + 6.25 * 175 - 5 * 28 + 5);
  const sedentaryBaseline = Math.round(bmrEstimate * 1.15); // Resting burn + basic desk activities / TEF digestion
  const workoutBurn = parsedAct.totalBurn;

  // If workouts/steps were logged, Total Burn = Sedentary Base + Specific Workouts.
  // If no workouts were logged, default to standard maintenance TDEE.
  let totalBurned = workoutBurn > 0 ? sedentaryBaseline + workoutBurn : tdee;

  // Physiological cap for non-extreme training
  const maxRealisticBurn = Math.round(bmrEstimate * 2.1);
  if (totalBurned > maxRealisticBurn) {
    totalBurned = maxRealisticBurn;
  }

  const netCalories = estimatedCals - totalBurned;

  // SCIENTIFIC EVALUATION:
  // Target calories is the user's deficit target (e.g. 2,289 kcal vs 2,934 kcal burn).
  let pacingRecommendation: 'deploy_more_effort' | 'go_slow_recover' | 'optimal_pace' = 'optimal_pace';
  let pacingTitle = '🎯 Optimal Sweet Spot: On-Track Deficit & Progress';
  let pacingExplanation = `Your estimated intake of ${estimatedCals} kcal with ~${totalBurned} kcal total expenditure creates an effective fat-loss deficit. Protein (${estimatedProtein}g) supports muscle retention.`;

  const calorieDelta = estimatedCals - targetCalories;

  if (calorieDelta > 200) {
    pacingRecommendation = 'deploy_more_effort';
    pacingTitle = `⚠️ Deploy More Effort: +${calorieDelta} kcal Over Deficit Target`;
    pacingExplanation = `Your intake of ${estimatedCals} kcal exceeds your target of ${targetCalories} kcal by +${calorieDelta} kcal. Today's net energy deficit is ${Math.abs(netCalories)} kcal (vs your ideal ${Math.round(tdee - targetCalories)} kcal fat-loss target). To stay on track, moderate calorie-dense foods (parathas, sugary tea) and add a brisk post-meal walk.`;
  } else if (estimatedCals < 1250) {
    pacingRecommendation = 'go_slow_recover';
    pacingTitle = '🧘 Go Slow & Refuel: Critical Undereating Alert';
    pacingExplanation = `Your intake of ${estimatedCals} kcal is dangerously low (under 1,250 kcal). Severe starvation slows metabolism and accelerates muscle loss. Refuel with complex carbs and protein.`;
  }

  return {
    caloriesConsumed: estimatedCals,
    proteinGrams: estimatedProtein,
    carbGrams: estimatedCarbs,
    fatGrams: estimatedFats,
    mealBreakdown:
      parsedFood.items.length > 0
        ? parsedFood.items
        : [
            {
              item: foodText.slice(0, 50) || 'Daily Meals',
              portion: 'Estimated Intake',
              calories: estimatedCals,
              protein: estimatedProtein,
              carbs: estimatedCarbs,
              fats: estimatedFats,
            },
          ],
    caloriesBurned: totalBurned,
    activityBreakdown:
      parsedAct.items.length > 0
        ? parsedAct.items
        : [
            {
              name: 'Base Metabolism & Movement (TDEE)',
              durationOrMetric: '24 Hours',
              caloriesBurned: totalBurned,
            },
          ],
    netCalories,
    targetCalories,
    pacingRecommendation,
    pacingTitle,
    pacingExplanation,
    nextStepAdvice:
      calorieDelta > 200
        ? 'Drink 3.5L water, replace high-carb snacks with protein (paneer/whey), and do a post-meal walk.'
        : 'Drink 3.5L water, maintain your protein intake, and get 7.5 hours of restorative sleep tonight.',
  };
}

/**
 * Ask Gemini Live AI Coach for intelligent interactive fitness & nutrition advice
 */
export async function askGeminiCoach(
  query: string,
  profile: Partial<UserProfile> | null,
  lang: Language = 'en'
): Promise<string> {
  const systemPrompt = `You are the ZeroFIT AI Fitness & Clinical Nutrition Assistant.
Answer the user's question clearly, practically, and grounded in evidence-based sports science.
Language Preference: ${lang === 'pa' ? 'Punjabi (Gurmukhi script with common English terms)' : lang === 'hi' ? 'Hindi (Devanagari script with common English terms)' : 'English'}.
Keep advice focused on real Indian kitchens (roti, dal, paneer, soya, sattu), joint-friendly movement, progressive overload, and safety boundaries for health conditions (diabetes, PCOS, thyroid).
Never recommend extreme crash diets or unregulated fat burners.
Keep response concise and practical (2–4 short paragraphs).

User Context:
- Weight: ${profile?.weightKg || 75} kg, Target: ${profile?.targetWeightKg || 70} kg
- Goal: ${profile?.goal || 'lose_fat'}, Diet: ${profile?.dietPreference || 'veg'}

User Question: "${query}"`;

  try {
    const reply = await queryGeminiAPI(systemPrompt, 1000, 0.4);
    if (reply) return reply;
  } catch (err) {
    console.error('Gemini Chat Error:', err);
  }

  // Fallback if offline or API key not yet configured
  if (lang === 'pa') {
    return 'ਇੱਕ ਸਥਾਈ ਫਿਟਨੈਸ ਯਾਤਰਾ 3 ਮੁੱਖ ਗੱਲਾਂ ’ਤੇ ਨਿਰਭਰ ਕਰਦੀ ਹੈ: (1) ਆਪਣੇ ਟੀਚੇ ਅਨੁਸਾਰ ਕੈਲੋਰੀ ਸੰਤੁਲਨ, (2) ਹਫ਼ਤੇ ਵਿੱਚ 3–4 ਦਿਨ ਜੋੜਾਂ ਲਈ ਸੁਰੱਖਿਅਤ ਕਸਰਤ, ਅਤੇ (3) ਪ੍ਰੋਟੀਨ ਦੀ ਪੂਰਤੀ (ਦਾਲਾਂ, ਪਨੀਰ, ਸੋਇਆ, ਆਂਡੇ) ਨਾਲ 7–8 ਘੰਟੇ ਦੀ ਚੰਗੀ ਨੀਂਦ।';
  }
  if (lang === 'hi') {
    return 'एक टिकाऊ फिटनेस यात्रा 3 मुख्य स्तंभों पर आधारित है: (1) अपने लक्ष्य के अनुसार सही कैलोरी घाटा या अधिशेष, (2) जोड़ों को सुरक्षित रखते हुए सप्ताह में 3–4 दिन स्ट्रेंथ ट्रेनिंग, और (3) पर्याप्त प्रोटीन (दाल, पनीर, सोया, अंडे) के साथ 7–8 घंटे की नींद।';
  }
  return 'A sustainable fitness journey relies on three pillars: (1) A consistent caloric balance tailored to your goal, (2) Progressive resistance training with joint-safe form 3–4 days per week, and (3) Reaching at least 1.4–1.8g/kg of protein alongside 7–8 hours of restorative sleep.';
}
