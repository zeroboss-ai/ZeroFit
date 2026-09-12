import {
  UserProfile,
  BMICategory,
  AgeGroup,
  FitnessGoal,
  DailyMealPlan,
  WorkoutPlan,
  WorkoutDay,
  ProgressLog,
  ProgramTimeline,
  ComprehensiveMovementPlan,
  RunningProtocol,
  WalkingProtocol,
  MobilityProtocol,
} from '@/types';

/**
 * Calculate BMI and classify category
 */
export function calculateBMI(weightKg: number, heightCm: number): { bmi: number; category: BMICategory } {
  if (heightCm <= 0 || weightKg <= 0) {
    return { bmi: 0, category: 'normal' };
  }
  const heightM = heightCm / 100;
  const bmi = parseFloat((weightKg / (heightM * heightM)).toFixed(1));

  let category: BMICategory = 'normal';
  if (bmi < 18.5) category = 'underweight';
  else if (bmi < 25) category = 'normal';
  else if (bmi < 30) category = 'overweight';
  else category = 'obese';

  return { bmi, category };
}

/**
 * Calculate BMR using Mifflin-St Jeor Formula
 */
export function calculateBMR(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: 'male' | 'female' | 'other'
): number {
  if (weightKg <= 0 || heightCm <= 0 || age <= 0) return 1500;
  // Mifflin - St Jeor Equation
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (gender === 'male') {
    return Math.round(base + 5);
  } else if (gender === 'female') {
    return Math.round(base - 161);
  } else {
    // Neutral average
    return Math.round(base - 78);
  }
}

/**
 * Calculate TDEE (Total Daily Energy Expenditure)
 */
export function calculateTDEE(bmr: number, activityLevel: string): number {
  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    very_active: 1.725,
    extra_active: 1.9,
  };
  const mult = multipliers[activityLevel] || 1.375;
  return Math.round(bmr * mult);
}

/**
 * Determine Age Group category
 */
export function getAgeGroup(age: number): AgeGroup {
  if (age < 20) return 'teens';
  if (age <= 35) return 'young_adults';
  if (age <= 50) return 'mid_age';
  return 'seniors';
}

/**
 * Compute personalized targets, age-wise & BMI-wise guidance
 */
export function computePersonalizedTargets(params: Partial<UserProfile>): UserProfile {
  const age = params.age || 28;
  const gender = params.gender || 'male';
  const heightCm = params.heightCm || 175;
  const weightKg = params.weightKg || 72;
  const targetWeightKg = params.targetWeightKg || weightKg;
  const activityLevel = params.activityLevel || 'moderate';
  const goal = params.goal || 'general_health';
  const dietPreference = params.dietPreference || 'veg';
  const cuisinePreference = params.cuisinePreference || 'north_indian';
  const healthFlags = params.healthFlags || {
    diabetes: false,
    thyroid: false,
    pcos: false,
    hypertension: false,
    jointIssues: false,
    heartCondition: false,
  };

  const { bmi, category: bmiCategory } = calculateBMI(weightKg, heightCm);
  const bmr = calculateBMR(weightKg, heightCm, age, gender);
  const tdee = calculateTDEE(bmr, activityLevel);
  const ageGroup = getAgeGroup(age);

  // Always honor the user's explicitly chosen fitness goal
  const effectiveGoal: FitnessGoal = goal || 'lose_fat';

  // Resting Maintenance (calories needed to maintain current weight on rest days)
  const restingMaintenance = bmr;

  // Deficit or surplus needed to reach target weight
  let targetDeficit = 0;
  let targetCalories = restingMaintenance;
  const safetyAdvice: string[] = [];

  // Goal adjustments
  if (effectiveGoal === 'lose_fat') {
    // Sustainable sports-science fat-loss deficit (450-500 kcal/day to burn ~0.5kg pure fat/week)
    targetDeficit = bmiCategory === 'obese' ? 550 : 450;
    // On active days, eating near resting maintenance while exercising creates the 450-500 kcal deficit
    targetCalories = Math.max(1400, Math.round(restingMaintenance));

    safetyAdvice.push(
      `Fat-Loss Protocol: Resting maintenance is ${restingMaintenance} kcal. A ${targetDeficit} kcal daily deficit burns stored body fat sustainably without muscle loss.`
    );
  } else if (effectiveGoal === 'gain_muscle') {
    if (targetWeightKg < weightKg - 0.5) {
      // Body Recomposition
      targetDeficit = 300;
      targetCalories = restingMaintenance;
      safetyAdvice.push(
        `Lean Hypertrophy & Recomp: High protein (2.0g/kg) and progressive overload stimulates muscle hypertrophy while burning fat.`
      );
    } else {
      // Clean Mass Surplus: +250 kcal
      targetDeficit = -250;
      targetCalories = Math.round(restingMaintenance + 250);
      safetyAdvice.push(
        `Muscle Hypertrophy Protocol: Controlled lean surplus of +250 kcal above resting maintenance (${restingMaintenance} kcal) for clean muscle gain.`
      );
    }
  } else if (effectiveGoal === 'maintain') {
    targetDeficit = 0;
    targetCalories = restingMaintenance;
    safetyAdvice.push(
      `Body Recomposition / Maintenance: Calorie target matched to your resting maintenance (${restingMaintenance} kcal). Focus on resistance training.`
    );
  } else {
    // general_health
    targetDeficit = 0;
    targetCalories = restingMaintenance;
    safetyAdvice.push(
      `Longevity & Heart Health: Balanced intake at ${restingMaintenance} kcal resting burn with anti-inflammatory whole foods and daily movement.`
    );
  }

  // Protein targets based on goal and bodyweight
  let proteinPerKg = 1.4;
  if (effectiveGoal === 'gain_muscle') {
    proteinPerKg = targetWeightKg < weightKg - 0.5 ? 2.0 : 1.9;
  } else if (effectiveGoal === 'lose_fat') {
    proteinPerKg = 1.8;
  } else if (effectiveGoal === 'maintain') {
    proteinPerKg = 1.6;
  }
  if (ageGroup === 'seniors') {
    proteinPerKg = Math.max(proteinPerKg, 1.5);
  }

  const proteinGrams = Math.round(weightKg * proteinPerKg);
  const proteinCalories = proteinGrams * 4;

  // Fat targets: 25-30% of total calories
  const fatCalories = targetCalories * 0.28;
  const fatGrams = Math.round(fatCalories / 9);

  // Carbs: remainder of calories
  const remainingCalories = Math.max(targetCalories - (proteinCalories + fatCalories), 400);
  const carbGrams = Math.round(remainingCalories / 4);

  // Water intake calculation (35ml per kg base + activity add-on)
  let waterLiters = (weightKg * 35) / 1000;
  if (activityLevel === 'very_active' || activityLevel === 'extra_active') {
    waterLiters += 0.75;
  } else if (activityLevel === 'moderate') {
    waterLiters += 0.5;
  }
  const waterIntakeLiters = parseFloat(waterLiters.toFixed(1));

  // Age-wise guidance notes
  if (ageGroup === 'teens') {
    safetyAdvice.push(
      'Teens (13–19): Your body is still growing. Focus on nutrient density and whole foods rather than harsh caloric deficits. Build good habits and bone density.'
    );
  } else if (ageGroup === 'young_adults') {
    safetyAdvice.push(
      'Young Adults (20–35): Peak metabolic plasticity. Focus on progressive overload in strength training and adequate sleep (7–9 hrs) for peak hormonal health.'
    );
  } else if (ageGroup === 'mid_age') {
    safetyAdvice.push(
      'Mid-Age (36–50): Metabolic preservation and stress management (cortisol) become key. Prioritize regular resistance training to protect against sarcopenia (muscle loss).'
    );
  } else {
    safetyAdvice.push(
      '50+ / Senior Fitness: Prioritize joint-friendly movements, balance training, and bone density preservation. Keep rest periods generous and warm up thoroughly.'
    );
  }

  // Weight/BMI-wise guidance notes
  if (bmiCategory === 'underweight') {
    safetyAdvice.push(
      'BMI indicates Underweight: Focus on nutrient-dense calorie surplus (nuts, seeds, dairy/soy, healthy fats) and progressive hypertrophy training.'
    );
  } else if (bmiCategory === 'overweight') {
    safetyAdvice.push(
      'BMI indicates Overweight: Maintain a sustainable 350–500 kcal deficit. High protein intake will preserve your muscle while burning fat.'
    );
  } else if (bmiCategory === 'obese') {
    safetyAdvice.push(
      'BMI indicates Obese: Protect knee and hip joints by starting with low-impact cardio (brisk walking, swimming, cycling) and consistent whole-food nutrition.'
    );
  }

  // Medical flags notes
  if (healthFlags.diabetes) {
    safetyAdvice.push(
      'Diabetes Flag: Prioritize high-fiber complex carbohydrates (whole grains, legumes) with low glycemic load. Monitor blood glucose closely before and after workouts.'
    );
  }
  if (healthFlags.thyroid) {
    safetyAdvice.push(
      'Thyroid Flag: Ensure adequate selenium, zinc, and iodine intake. Avoid extreme low-carb or starvation diets which can suppress T3 conversion.'
    );
  }
  if (healthFlags.pcos) {
    safetyAdvice.push(
      'PCOS Flag: Focus on insulin-sensitizing foods, anti-inflammatory whole meals, and strength training. Limit refined sugars and high-glycemic snacks.'
    );
  }
  if (healthFlags.hypertension) {
    safetyAdvice.push(
      'Hypertension Flag: Keep dietary sodium in check, increase potassium-rich greens, and avoid holding your breath (Valsalva maneuver) under heavy lifts.'
    );
  }
  if (healthFlags.jointIssues || ageGroup === 'seniors') {
    safetyAdvice.push(
      'Joint Care: Opt for closed-chain exercises, goblet squats, machine assistance, and swimming over high-impact plyometrics.'
    );
  }

  return {
    name: params.name || 'Athlete',
    email: params.email || '',
    age,
    gender,
    heightCm,
    weightKg,
    targetWeightKg,
    activityLevel,
    goal: effectiveGoal,
    dietPreference,
    cuisinePreference,
    healthFlags,
    bmi,
    bmiCategory,
    bmr,
    restingMaintenance,
    tdee,
    targetCalories,
    targetDeficit,
    proteinGrams,
    carbGrams,
    fatGrams,
    waterIntakeLiters,
    ageGroup,
    safetyAdvice,
    lastUpdated: new Date().toISOString(),
  };
}

/**
 * Generate customized diet meal plan based on profile
 */
export function generateMealPlan(profile: UserProfile): DailyMealPlan {
  const { goal, dietPreference, cuisinePreference, targetCalories, proteinGrams } = profile;

  const isNorthIndian = cuisinePreference === 'north_indian';
  const isSouthIndian = cuisinePreference === 'south_indian';
  const isMuscleGain = goal === 'gain_muscle';
  const isFatLoss = goal === 'lose_fat';
  const isNonVeg = dietPreference === 'non_veg' || dietPreference === 'eggetarian';
  const isVegan = dietPreference === 'vegan';
  const isVeg = !isNonVeg && !isVegan;

  const cuisineLabel = isNorthIndian ? 'North Indian / Punjabi' : isSouthIndian ? 'South Indian' : 'Continental';

  // 1. HYPERTROPHY & MUSCLE BUILDING PROTOCOL
  if (isMuscleGain) {
    const dietType = isVegan ? 'Plant-Powered Vegan' : isNonVeg ? 'High-Protein Non-Veg' : 'Lacto-Vegetarian';
    return {
      title: `${cuisineLabel} Muscle Hypertrophy Protocol (${dietType})`,
      totalCalories: targetCalories,
      totalProtein: proteinGrams,
      totalCarbs: profile.carbGrams,
      totalFats: profile.fatGrams,
      meals: {
        earlyMorning: {
          name: 'Warm Turmeric Almond Milk + 6 Soaked Almonds + 2 Walnuts + 1 Banana',
          nameHi: 'हल्का गुनगुना हल्दी-बादाम दूध + 6 भीगे बादाम + 2 अखरोट + 1 केला',
          namePa: 'ਕੋਸਾ ਹਲਦੀ ਬਦਾਮ ਦੁੱਧ + 6 ਭਿੱਜੇ ਬਦਾਮ + 2 ਅਖਰੋਟ + 1 ਕੇਲਾ',
          portion: '1 cup milk + 1 banana + nuts',
          calories: 220,
          protein: 6,
          carbs: 32,
          fats: 9,
          alternatives: ['Sattu protein shake in chilled water', 'Overnight chia pudding with oats'],
          notes: 'Pre-breakfast amino and carbohydrate priming to halt overnight muscular breakdown.',
        },
        breakfast: isNonVeg
          ? {
              name: '4 Whole Egg / White Scramble with Spinach & Mushrooms + 3 Slices Sourdough / Multigrain Toast + 1 Banana',
              nameHi: '4 अंडों का ऑमलेट हरी सब्जियों के साथ + 3 मल्टीग्रेन टोस्ट + 1 केला',
              namePa: '4 ਆਂਡਿਆਂ ਦਾ ਆਮਲੇਟ ਸਬਜ਼ੀਆਂ ਨਾਲ + 3 ਮਲਟੀਗ੍ਰੇਨ ਟੋਸਟ + 1 ਕੇਲਾ',
              portion: '4 eggs (2 whole, 2 whites) + 3 toasts',
              calories: Math.round(targetCalories * 0.28),
              protein: Math.round(proteinGrams * 0.32),
              carbs: Math.round(profile.carbGrams * 0.28),
              fats: Math.round(profile.fatGrams * 0.25),
              alternatives: ['Protein pancake stack with Greek yogurt', 'Boiled eggs with sweet potato chaat'],
              notes: 'Complete bioavailable amino acids trigger maximum muscle protein synthesis (MPS).',
            }
          : isVegan
          ? {
              name: '180g Tofu & Soya Granule Bhurji with Bell Peppers + 3 Multigrain Rotis + 1 Glass Soy Milk',
              nameHi: '180g टोफू भुर्जी शिमला मिर्च के साथ + 3 रोटी + 1 ग्लास सोया मिल्क',
              namePa: '180g ਟੋਫੂ ਭੁਰਜੀ ਸ਼ਿਮਲਾ ਮਿਰਚਾਂ ਨਾਲ + 3 ਰੋਟੀਆਂ + ਸੋਇਆ ਦੁੱਧ',
              portion: '180g tofu + 3 rotis + soy milk',
              calories: Math.round(targetCalories * 0.28),
              protein: Math.round(proteinGrams * 0.30),
              carbs: Math.round(profile.carbGrams * 0.28),
              fats: Math.round(profile.fatGrams * 0.24),
              alternatives: ['Peanut butter banana oatmeal with pumpkin seeds', 'Sprouted moong & tofu wrap'],
              notes: 'Combines multiple plant proteins for a full essential amino acid spectrum.',
            }
          : isNorthIndian
          ? {
              name: '150g Fresh Paneer Bhurji + 2–3 Multigrain Phulkas / Parathas + 1 Cup Low-Fat Curd OR Whey Oatmeal with Banana',
              nameHi: '150g पनीर भुर्जी + 2-3 मल्टीग्रेन रोटी/परांठे + 1 कटोरी ताजा दही',
              namePa: '150g ਪਨੀਰ ਭੁਰਜੀ + 2-3 ਮਲਟੀਗ੍ਰੇਨ ਰੋਟੀਆਂ/ਪਰੌਂਠੇ + 1 ਕੌਲੀ ਤਾਜ਼ਾ ਦਹੀਂ',
              portion: '150g fresh paneer + 2-3 rotis + 150g curd',
              calories: Math.round(targetCalories * 0.28),
              protein: Math.round(proteinGrams * 0.30),
              carbs: Math.round(profile.carbGrams * 0.28),
              fats: Math.round(profile.fatGrams * 0.26),
              alternatives: ['Soya bhurji with 3 rotis and lassi', 'Protein oats with peanut butter and pumpkin seeds'],
              notes: 'Over 3g of leucine triggers muscle protein synthesis for lean hypertrophy.',
            }
          : {
              name: '3 Steamed Idlis with Sambar + 1 Cup High-Protein Curd / Paneer Toss + Coconut Chutney',
              nameHi: '3 इडली सांभर के साथ + 1 कटोरी पनीर / दही + चटनी',
              namePa: '3 ਇਡਲੀ ਸਾਂਭਰ ਨਾਲ + 1 ਕੌਲੀ ਪਨੀਰ / ਦਹੀਂ + ਚਟਨੀ',
              portion: '3 idlis + sambar + 100g paneer/curd',
              calories: Math.round(targetCalories * 0.28),
              protein: Math.round(proteinGrams * 0.28),
              carbs: Math.round(profile.carbGrams * 0.28),
              fats: Math.round(profile.fatGrams * 0.22),
              alternatives: ['Pesarattu with paneer stuffing', 'Quinoa upma with edamame and curd'],
              notes: 'Sustained energy release with gut-friendly fermentation.',
            },
        midMorningSnack: {
          name: 'Hypertrophy Snack: 40g Roasted Bengal Gram (Chana) + 1 Banana + 15 Almonds (OR 1 Scoop Whey/Sattu Drink)',
          nameHi: '40g भुना चना + 1 केला + 15 बादाम (या 1 स्कूप व्हे/सत्तू प्रोटीन ड्रिंक)',
          namePa: '40g ਭੁੰਨੇ ਛੋਲੇ + 1 ਕੇਲਾ + 15 ਬਦਾਮ (ਜਾਂ 1 ਸਕੂਪ ਵੇਅ/ਸੱਤੂ ਡ੍ਰਿੰਕ)',
          portion: '40g chana + 1 fruit + handful nuts',
          calories: 230,
          protein: 10,
          carbs: 34,
          fats: 6,
          alternatives: ['Greek yogurt bowl with honey and chia seeds', 'Paneer cubes tossed with chaat masala'],
          notes: 'Mid-morning anabolic bridge maintaining steady positive nitrogen balance.',
        },
        lunch: isNonVeg
          ? {
              name: '200g Grilled Chicken Breast / Fish Curry + 1.5 Cups Steamed Rice / 3 Rotis + 1 Bowl Dal + Steamed Greens',
              nameHi: '200g ग्रिल्ड चिकन / फिश करी + 1.5 कप चावल / 3 रोटी + दाल + हरी सब्जियां',
              namePa: '200g ਗ੍ਰਿਲਡ ਚਿਕਨ / ਮੱਛੀ ਕਰੀ + 1.5 ਕੱਪ ਚੌਲ / 3 ਰੋਟੀਆਂ + ਦਾਲ + ਸਬਜ਼ੀ',
              portion: '200g meat + 150g rice/3 rotis + 150g dal',
              calories: Math.round(targetCalories * 0.33),
              protein: Math.round(proteinGrams * 0.35),
              carbs: Math.round(profile.carbGrams * 0.32),
              fats: Math.round(profile.fatGrams * 0.25),
              alternatives: ['Chicken tikka brown rice bowl', 'Fish curry with quinoa and green salad'],
              notes: 'High-density protein and glycogen-restoring complex carbs.',
            }
          : {
              name: '3-4 Phulkas OR 1.5 Cups Steamed Basmati Rice + 150g Soya Chunks or Low-Fat Paneer Curry + 1 Bowl Thick Dal + Cucumber Raita',
              nameHi: '3-4 फुल्के या चावल + 150g सोया चंक्स/पनीर करी + गाढ़ी दाल तड़का + खीरा रायता',
              namePa: '3-4 ਫੁਲਕੇ ਜਾਂ ਚੌਲ + 150g ਸੋਇਆ ਚੰਕਸ/ਪਨੀਰ ਕਰੀ + ਗਾੜ੍ਹੀ ਦਾਲ + ਖੀਰਾ ਰਾਇਤਾ',
              portion: '3-4 rotis + 150g soya/paneer curry + 1 bowl dal + raita',
              calories: Math.round(targetCalories * 0.33),
              protein: Math.round(proteinGrams * 0.33),
              carbs: Math.round(profile.carbGrams * 0.34),
              fats: Math.round(profile.fatGrams * 0.26),
              alternatives: ['Rajma chawal with 100g grilled paneer', 'Chole with brown rice and cucumber raita'],
              notes: 'Complete essential amino acid profile through legume and grain pairing.',
            },
        eveningSnack: {
          name: 'Pre-Workout Fuel: 2 Wholewheat Toasts with Peanut Butter + 1 Banana OR Spiced Buttermilk with 30g Roasted Peanuts',
          nameHi: 'प्री-वर्कआउट: 2 टोस्ट पीनट बटर व केले के साथ या छाछ + 30g भुनी मूंगफली',
          namePa: 'ਪ੍ਰੀ-ਵਰਕਆਊਟ: 2 ਟੋਸਟ ਪੀਨਟ ਬਟਰ ਤੇ ਕੇਲੇ ਨਾਲ ਜਾਂ ਲੱਸੀ + 30g ਭੁੰਨੀ ਮੂੰਗਫਲੀ',
          portion: '2 toasts + 1 tbsp peanut butter + banana',
          calories: 220,
          protein: 9,
          carbs: 32,
          fats: 7,
          alternatives: ['Whey protein scoop with water and 1 apple', 'Boiled sweet potato with pinch of chaat masala'],
          notes: 'Fast-acting complex carbohydrates and potassium boost intracellular hydration and muscle pumps.',
        },
        dinner: isNonVeg
          ? {
              name: '200g Lemon Garlic Chicken or Egg Curry + 2 Multigrain Phulkas + 1 Bowl Dal + Mixed Green Salad',
              nameHi: '200g लेमन चिकन या अंडा करी + 2 फुल्के + 1 कटोरी दाल + सलाद',
              namePa: '200g ਲੈਮਨ ਚਿਕਨ ਜਾਂ ਆਂਡਾ ਕਰੀ + 2 ਫੁਲਕੇ + 1 ਕੌਲੀ ਦਾਲ + ਸਲਾਦ',
              portion: '200g chicken/curry + 2 rotis + salad',
              calories: Math.round(targetCalories * 0.25),
              protein: Math.round(proteinGrams * 0.28),
              carbs: Math.round(profile.carbGrams * 0.22),
              fats: Math.round(profile.fatGrams * 0.24),
              alternatives: ['Grilled fish with tossed vegetables and 1 roti', 'Chicken clear soup with shredded chicken breast and rice'],
              notes: 'Promotes sustained overnight myofibrillar repair.',
            }
          : {
              name: '180g Low-Fat Grilled Paneer / Tofu Tikka with Sautéed Capsicum & Onions + 2 Multigrain Phulkas + 1 Bowl Moong Dal',
              nameHi: '180g ग्रिल्ड पनीर/टोफू टिक्का शिमला मिर्च के साथ + 2 फुल्के + 1 कटोरी मूंग दाल',
              namePa: '180g ਭੁੰਨਿਆ ਪਨੀਰ/ਟੋਫੂ ਟਿੱਕਾ ਸ਼ਿਮਲਾ ਮਿਰਚਾਂ ਨਾਲ + 2 ਫੁਲਕੇ + 1 ਕੌਲੀ ਮੂੰਗ ਦਾਲ',
              portion: '180g paneer/tofu + 2 rotis + dal',
              calories: Math.round(targetCalories * 0.25),
              protein: Math.round(proteinGrams * 0.28),
              carbs: Math.round(profile.carbGrams * 0.22),
              fats: Math.round(profile.fatGrams * 0.25),
              alternatives: ['Soya granule curry with 2 rotis and mint chutney', 'Moong dal khichdi with 100g paneer cubes'],
              notes: 'Slow-digesting casein and legumes deliver steady amino acids throughout the night.',
            },
        bedtime: {
          name: 'Warm Turmeric Cinnamon Milk with 4 Crushed Almonds',
          nameHi: 'हल्का गुनगुना हल्दी-दालचीनी दूध + 4 कुटे हुए बादाम',
          namePa: 'ਕੋਸਾ ਹਲਦੀ ਦਾਲਚੀਨੀ ਵਾਲਾ ਦੁੱਧ + 4 ਬਦਾਮ',
          portion: '1 small cup (180ml)',
          calories: 110,
          protein: 6,
          carbs: 8,
          fats: 4,
          alternatives: ['Warm almond milk with ashwagandha', 'Chamomile herbal tea with raw honey'],
          notes: 'Curcumin + casein accelerates joint recovery and deep sleep hormonal regeneration.',
        },
      },
      hydrationTips: `Aim for ${profile.waterIntakeLiters} Liters of water daily. Drink 500ml 1 hour before heavy training for optimal cellular hydration.`,
      cookingTips: [
        'Use moderate cooking oil (3-4 tsp/day) and prioritize cold-pressed mustard or coconut oil for healthy calories.',
        'Ensure daily protein is evenly divided into 4-5 feedings to maximize muscle protein synthesis pulses.',
      ],
    };
  }

  // 2. FAT-LOSS DEFICIT & HIGH-SATIETY PROTOCOL
  if (isFatLoss) {
    const dietType = isVegan ? 'Plant-Powered Vegan' : isNonVeg ? 'Lean Protein Non-Veg' : 'Vegetarian Satiety';
    return {
      title: `${cuisineLabel} Fat-Loss Deficit & Satiety Protocol (${dietType})`,
      totalCalories: targetCalories,
      totalProtein: proteinGrams,
      totalCarbs: profile.carbGrams,
      totalFats: profile.fatGrams,
      meals: {
        earlyMorning: {
          name: 'Warm Lemon Water with Soaked Chia Seeds + 4 Soaked Almonds',
          nameHi: 'हल्का गुनगुना नींबू पानी + भीगे चिया सीड्स + 4 भीगे बादाम',
          namePa: 'ਕੋਸਾ ਨਿੰਬੂ ਪਾਣੀ + ਭਿੱਜੇ ਚੀਆ ਬੀਜ + 4 ਭਿੱਜੇ ਬਦਾਮ',
          portion: '1 glass + 1 tbsp chia + 4 almonds',
          calories: 85,
          protein: 3,
          carbs: 4,
          fats: 6,
          alternatives: ['Apple cider vinegar in warm water', 'Cumin & fennel seed detox infusion'],
          notes: 'Prebiotic soluble fiber expands in stomach, significantly delaying early morning hunger.',
        },
        breakfast: isNonVeg
          ? {
              name: '3 Egg Whites + 1 Whole Egg Omelette with Spinach, Tomatoes & Mushrooms + 1 Slice Multigrain Toast',
              nameHi: '3 अंडे की सफेदी + 1 पूरा अंडा ऑमलेट पालक-टमाटर के साथ + 1 मल्टीग्रेन टोस्ट',
              namePa: '3 ਆਂਡੇ ਦੀ ਸਫੇਦੀ + 1 ਪੂਰਾ ਆਂਡਾ ਆਮਲੇਟ ਪਾਲਕ-ਟਮਾਟਰ ਨਾਲ + 1 ਮਲਟੀਗ੍ਰੇਨ ਟੋਸਟ',
              portion: '4-egg omelette + 1 toast',
              calories: Math.round(targetCalories * 0.25),
              protein: Math.round(proteinGrams * 0.30),
              carbs: Math.round(profile.carbGrams * 0.20),
              fats: Math.round(profile.fatGrams * 0.24),
              alternatives: ['Boiled egg white salad with cucumber and lemon dressing', 'Smoked salmon with 1 multigrain toast'],
              notes: 'Ultra-high satiety-to-calorie ratio; prevents mid-morning energy dips.',
            }
          : isNorthIndian
          ? {
              name: '2 Stuffed Besan or Moong Dal Chillas with Low-Fat Paneer (50g) + Fresh Mint Chutney + 1 Bowl Sprout Salad',
              nameHi: '2 बेसन/मूंग दाल चीला हल्के पनीर के साथ + पुदीना चटनी + स्प्राउट सलाद',
              namePa: '2 ਵੇਸਣ/ਮੂੰਗ ਦਾਲ ਚੀਲਾ ਪਨੀਰ ਨਾਲ + ਪੁਦੀਨਾ ਚਟਨੀ + ਸਪ੍ਰਾਊਟ ਸਲਾਦ',
              portion: '2 chillas (approx 160g) + 60g sprouts',
              calories: Math.round(targetCalories * 0.25),
              protein: Math.round(proteinGrams * 0.28),
              carbs: Math.round(profile.carbGrams * 0.22),
              fats: Math.round(profile.fatGrams * 0.22),
              alternatives: ['Tofu scramble with 1 multigrain roti and black coffee', 'Vegetable oats porridge with chia seeds'],
              notes: 'High volume and fiber blunt ghrelin secretion for 4–5 continuous hours.',
            }
          : {
              name: '2 Steamed Idlis or 1 Oats Dosa with Vegetable Sambar + High-Protein Moong Sprouts',
              nameHi: '2 इडली या ओट्स डोसा सांभर व मूंग स्प्राउट्स के साथ',
              namePa: '2 ਇਡਲੀ ਜਾਂ ਓਟਸ ਡੋਸਾ ਸਾਂਭਰ ਅਤੇ ਮੂੰਗ ਸਪ੍ਰਾਊਟਸ ਨਾਲ',
              portion: '2 idlis + 1 bowl sambar + sprouts',
              calories: Math.round(targetCalories * 0.25),
              protein: Math.round(proteinGrams * 0.26),
              carbs: Math.round(profile.carbGrams * 0.24),
              fats: Math.round(profile.fatGrams * 0.18),
              alternatives: ['Pesarattu with ginger chutney', 'Quinoa upma with green peas and curd'],
              notes: 'Low glycemic index carb sources maintain stable insulin and fat-burning state.',
            },
        midMorningSnack: {
          name: '1 Bowl Fresh Papaya or 1 Crisp Apple + 1 Cup Unsweetened Green Tea',
          nameHi: '1 कटोरी पपीता या 1 हरा सेब + 1 कप बिना चीनी की ग्रीन टी',
          namePa: '1 ਕੌਲੀ ਪਪੀਤਾ ਜਾਂ 1 ਹਰਾ ਸੇਬ + 1 ਕੱਪ ਗ੍ਰੀਨ ਟੀ',
          portion: '150g fruit + green tea',
          calories: 95,
          protein: 2,
          carbs: 22,
          fats: 0.5,
          alternatives: ['Cucumber slices sprinkled with chaat masala', 'Coconut water with tender coconut flesh'],
          notes: 'Green tea catechins (EGCG) promote mitochondrial fat oxidation during activity.',
        },
        lunch: isNonVeg
          ? {
              name: '160g Grilled Lemon-Herb Chicken Breast + Huge Tossed Green Salad FIRST + 1 Cup Steamed Brown Rice or 1 Phulka',
              nameHi: '160g ग्रिल्ड चिकन + बड़ा हरा सलाद पहले + 1 कप ब्राउन राइस या 1 रोटी',
              namePa: '160g ਗ੍ਰਿਲਡ ਚਿਕਨ + ਵੱਡਾ ਹਰਾ ਸਲਾਦ ਪਹਿਲਾਂ + 1 ਕੱਪ ਬ੍ਰਾਊਨ ਚੌਲ ਜਾਂ 1 ਰੋਟੀ',
              portion: '160g chicken + large salad + 1 cup rice/1 roti',
              calories: Math.round(targetCalories * 0.34),
              protein: Math.round(proteinGrams * 0.35),
              carbs: Math.round(profile.carbGrams * 0.30),
              fats: Math.round(profile.fatGrams * 0.24),
              alternatives: ['Tuna salad with lemon vinaigrette and 1 slice toast', 'Fish curry with steamed cauliflower rice'],
              notes: 'Lean protein preserves skeletal muscle while body runs in caloric deficit.',
            }
          : {
              name: 'High-Volume Protocol: 1 Large Plate Raw Salad FIRST + 2 Multigrain Phulkas (No Ghee) + 1.5 Bowls Yellow Dal + 1 Bowl Stir-Fried Gobhi/Beans',
              nameHi: 'बड़ा खीरा-टमाटर सलाद पहले + 2 सादी रोटी (बिना घी) + 1.5 कटोरी पतली दाल + हरी सब्ज़ी',
              namePa: 'ਵੱਡਾ ਖੀਰਾ-ਟਮਾਟਰ ਸਲਾਦ ਪਹਿਲਾਂ + 2 ਸਾਦੀਆਂ ਰੋਟੀਆਂ (ਬਿਨਾਂ ਘਿਓ) + 1.5 ਕੌਲੀ ਦਾਲ + ਸਬਜ਼ੀ',
              portion: 'Pre-meal salad + 2 rotis + 200g dal + 100g sabzi',
              calories: Math.round(targetCalories * 0.34),
              protein: Math.round(proteinGrams * 0.30),
              carbs: Math.round(profile.carbGrams * 0.33),
              fats: Math.round(profile.fatGrams * 0.24),
              alternatives: ['1 cup brown rice + 150g soya chunks curry + cucumber raita', 'Quinoa khichdi with plenty of spinach and curd'],
              notes: 'Pre-loading high-water fiber salad stretches gastric walls, reducing total calorie intake by 20% naturally.',
            },
        eveningSnack: {
          name: 'Craving Killer: 1 Glass Spiced Buttermilk (Chaas) with Jeera + 25g Dry-Roasted Foxnuts (Makhana)',
          nameHi: '1 गिलास जीरा-पुदीना छाछ + 25g भुना मखाना',
          namePa: '1 ਗਿਲਾਸ ਜੀਰਾ ਮਸਾਲਾ ਲੱਸੀ + 25g ਭੁੰਨੇ ਮਖਾਣੇ',
          portion: '250ml chaas + 25g makhana',
          calories: 105,
          protein: 5,
          carbs: 16,
          fats: 2,
          alternatives: ['Black coffee / Green tea with 20g roasted chana', 'Boiled edamame beans with pinch of salt'],
          notes: 'Zero added sugar and high electrolyte hydration prevents afternoon sugar cravings.',
        },
        dinner: isNonVeg
          ? {
              name: '160g Steamed Fish Curry or Chicken Clear Soup with Tossed Green Beans & Zucchini (Low-Carb Night)',
              nameHi: '160g स्टीम्ड फिश करी या चिकन क्लियर सूप हरी सब्जियों के साथ',
              namePa: '160g ਸਟੀਮਡ ਮੱਛੀ ਜਾਂ ਚਿਕਨ ਸੂਪ ਹਰੀਆਂ ਸਬਜ਼ੀਆਂ ਨਾਲ',
              portion: '160g fish/chicken + 150g vegetables',
              calories: Math.round(targetCalories * 0.25),
              protein: Math.round(proteinGrams * 0.28),
              carbs: Math.round(profile.carbGrams * 0.18),
              fats: Math.round(profile.fatGrams * 0.22),
              alternatives: ['Grilled chicken salad with apple cider vinaigrette', 'Egg white bhurji (4 whites) with 1 light phulka'],
              notes: 'Controlled nighttime carbohydrates encourage nocturnal lipolysis (fat mobilization).',
            }
          : {
              name: '150g Low-Fat Grilled Paneer / Soya Chunks Bhurji with Bell Peppers & Cabbage + 1 Light Phulka OR Clear Vegetable Soup',
              nameHi: '150g पनीर या सोया भुर्जी शिमला मिर्च के साथ + 1 हल्की रोटी या वेज सूप',
              namePa: '150g ਪਨੀਰ ਜਾਂ ਸੋਇਆ ਭੁਰਜੀ ਸ਼ਿਮਲਾ ਮਿਰਚ ਨਾਲ + 1 ਫੁਲਕਾ ਜਾਂ ਵੈੱਜ ਸੂਪ',
              portion: '150g paneer/soya + veggies + 1 phulka',
              calories: Math.round(targetCalories * 0.25),
              protein: Math.round(proteinGrams * 0.28),
              carbs: Math.round(profile.carbGrams * 0.20),
              fats: Math.round(profile.fatGrams * 0.24),
              alternatives: ['Moong dal soup with 100g grilled tofu cubes', 'Lentil stew with shredded cabbage and carrots'],
              notes: 'Digestive-friendly lean protein ensures restorative sleep without heavy metabolic stress.',
            },
        bedtime: {
          name: 'Warm Chamomile Herbal Infusion (or Warm Water with Lemon & Cinnamon)',
          nameHi: 'गुनगुनी कैमोमाइल टी (या हल्का गरम पानी दालचीनी के साथ)',
          namePa: 'ਕੋਸੀ ਕੈਮੋਮਾਈਲ ਚਾਹ (ਜਾਂ ਹਲਕਾ ਗਰਮ ਪਾਣੀ)',
          portion: '1 cup (150ml)',
          calories: 15,
          protein: 0.5,
          carbs: 2,
          fats: 0,
          alternatives: ['Fennel seed warm water', 'Warm water with pinch of pink salt'],
          notes: 'Lowers evening cortisol spikes and facilitates unbroken deep sleep.',
        },
      },
      hydrationTips: `Target ${profile.waterIntakeLiters} Liters of water daily. Drink 1 glass 30 minutes before each meal to naturally suppress appetite.`,
      cookingTips: [
        'Measure cooking oil with a teaspoon (strictly max 2–3 tsp per day) rather than pouring freely from the bottle.',
        'Cook rotis without excess ghee coating; add a single drop directly to dal or subzi if needed.',
        'Use spices like jeera, ajwain, turmeric, and black pepper to boost bioavailability and avoid bloat.',
      ],
    };
  }

  // 3. MAINTENANCE & LONGEVITY PROTOCOL (Default / General Health / Body Recomposition)
  return {
    title: `${cuisineLabel} Longevity & Metabolic Balance Protocol (${isVeg ? 'Vegetarian' : isNonVeg ? 'Non-Veg' : 'Plant-Powered'})`,
    totalCalories: targetCalories,
    totalProtein: proteinGrams,
    totalCarbs: profile.carbGrams,
    totalFats: profile.fatGrams,
    meals: {
      earlyMorning: {
        name: 'Warm Lemon Water + 5 Soaked Almonds + 2 Walnuts',
        nameHi: 'हल्का गुनगुना नींबू पानी + 5 भीगे बादाम + 2 अखरोट',
        namePa: 'ਕੋਸਾ ਨਿੰਬੂ ਪਾਣੀ + 5 ਭਿੱਜੇ ਬਦਾਮ + 2 ਅਖਰੋਟ',
        portion: '1 glass + handful',
        calories: 110,
        protein: 4,
        carbs: 4,
        fats: 9,
        alternatives: ['Chia seed water', 'Jeera / Fennel seed detox tea'],
        notes: 'Kicks off metabolism and provides healthy brain fats.',
      },
      breakfast: isNorthIndian
        ? {
            name: '2 Stuffed Paneer/Besan Chillas with Mint Chutney + 1 Bowl High-Protein Sprouts Chaat',
            nameHi: '2 बेसन या पनीर चीला पुदीना चटनी के साथ + स्प्राउट्स चाट',
            namePa: '2 ਵੇਸਣ ਜਾਂ ਪਨੀਰ ਚੀਲਾ ਪੁਦੀਨੇ ਦੀ ਚਟਨੀ ਨਾਲ + ਸਪ੍ਰਾਊਟਸ ਚਾਟ',
            portion: '2 chillas (approx 180g) + 2 tbsp chutney',
            calories: Math.round(targetCalories * 0.26),
            protein: Math.round(proteinGrams * 0.28),
            carbs: Math.round(profile.carbGrams * 0.24),
            fats: Math.round(profile.fatGrams * 0.26),
            alternatives: ['Tofu bhurji with 2 multigrain rotis', 'Oats cooked in low-fat milk with pumpkin seeds'],
            notes: 'Rich in fiber and sustained complex carbs to prevent mid-day slumps.',
          }
        : isSouthIndian
        ? {
            name: '3 Steamed Idlis or 1 Oats Dosa with Sambar + Peanut Chutney (moderated)',
            nameHi: '3 इडली या ओट्स डोसा सांभर व पीनट चटनी के साथ',
            namePa: '3 ਇਡਲੀ ਜਾਂ ਓਟਸ ਡੋਸਾ ਸਾਂਭਰ ਅਤੇ ਚਟਨੀ ਨਾਲ',
            portion: '3 idlis + 1 bowl dal-rich sambar',
            calories: Math.round(targetCalories * 0.25),
            protein: Math.round(proteinGrams * 0.24),
            carbs: Math.round(profile.carbGrams * 0.27),
            fats: Math.round(profile.fatGrams * 0.22),
            alternatives: ['Pesarattu (Moong dal dosa) with ginger chutney', 'Quinoa Upma with mixed vegetables'],
            notes: 'Fermented foods support healthy gut flora.',
          }
        : {
            name: 'Greek Yogurt Bowl with Berries, Chia Seeds & Rolled Oats',
            nameHi: 'ग्रीक योगर्ट बाउल बेरीज़, चिया सीड्स व ओट्स के साथ',
            namePa: 'ਗ੍ਰੀਕ ਦਹੀਂ ਬਾਊਲ ਬੇਰੀਆਂ, ਚੀਆ ਬੀਜ ਅਤੇ ਓਟਸ ਨਾਲ',
            portion: '200g Greek yogurt + 40g oats',
            calories: Math.round(targetCalories * 0.25),
            protein: Math.round(proteinGrams * 0.28),
            carbs: Math.round(profile.carbGrams * 0.25),
            fats: Math.round(profile.fatGrams * 0.23),
            alternatives: ['Protein oatmeal bowl', 'Peanut butter banana wholewheat toast'],
            notes: 'Probiotic-rich and high-bioavailability protein.',
          },
      midMorningSnack: {
        name: 'Seasonal Fruit (Apple or Papaya) + Roasted Chana (Bengal Gram)',
        nameHi: 'मौसमी फल (सेब/पपीता) + भुना चना',
        namePa: 'ਮੌਸਮੀ ਫਲ (ਸੇਬ/ਪਪੀਤਾ) + ਭੁੰਨੇ ਛੋਲੇ',
        portion: '1 medium fruit + 30g roasted chana',
        calories: 140,
        protein: 6,
        carbs: 24,
        fats: 2,
        alternatives: ['Coconut water with tender coconut pulp', 'Buttermilk (Chaas) with roasted cumin'],
        notes: 'High-fiber snack to maintain stable blood glucose between meals.',
      },
      lunch: isNorthIndian
        ? {
            name: '2-3 Phulkas (Multigrain/Wheat) + 1 Cup Dal Tadka / Rajma + 1 Bowl Mixed Sabzi + Cucumber Salad',
            nameHi: '2-3 फुल्के + 1 कटोरी दाल/राजमा + 1 कटोरी मौसमी सब्ज़ी + सलाद',
            namePa: '2-3 ਫੁਲਕੇ + 1 ਕੌਲੀ ਦਾਲ/ਰਾਜਮਾ + 1 ਕੌਲੀ ਸਬਜ਼ੀ + ਖੀਰਾ ਸਲਾਦ',
            portion: '2-3 rotis + 150g dal + 100g sabzi + raw salad',
            calories: Math.round(targetCalories * 0.33),
            protein: Math.round(proteinGrams * 0.32),
            carbs: Math.round(profile.carbGrams * 0.33),
            fats: Math.round(profile.fatGrams * 0.28),
            alternatives: ['1 cup brown rice + Chole (chickpea curry) + cucumber raita', 'Quinoa pulao with low-fat paneer cubes and broccoli'],
            notes: 'Pairing legumes with grains provides a complete amino acid profile.',
          }
        : {
            name: '1 Cup Brown Rice / 2 Rotis + Sambar / Dal + Stir-Fried Greens (Poriyal) + Curd',
            nameHi: '1 कप ब्राउन राइस/रोटी + सांभर + पोरियाल सब्ज़ी + दही',
            namePa: '1 ਕੱਪ ਬ੍ਰਾਊਨ ਚੌਲ/ਰੋਟੀ + ਸਾਂਭਰ + ਹਰੀ ਸਬਜ਼ੀ + ਦਹੀਂ',
            portion: '1 cup cooked rice/2 rotis + 150g dal + 100g greens',
            calories: Math.round(targetCalories * 0.33),
            protein: Math.round(proteinGrams * 0.30),
            carbs: Math.round(profile.carbGrams * 0.34),
            fats: Math.round(profile.fatGrams * 0.28),
            alternatives: ['Millet khichdi with curd and spinach', 'Lentil soup bowl with roasted vegetables'],
            notes: 'Easily digestible and antioxidant dense.',
          },
      eveningSnack: {
        name: 'Spiced Buttermilk (Chaas) or Green Tea + Handful of Makhana (Foxnuts)',
        nameHi: 'छाछ या ग्रीन टी + भुना मखाना',
        namePa: 'ਮਸਾਲੇ ਵਾਲੀ ਲੱਸੀ ਜਾਂ ਗ੍ਰੀਨ ਟੀ + ਭੁੰਨੇ ਮਖਾਣੇ',
        portion: '1 glass chaas + 25g roasted makhana',
        calories: 120,
        protein: 5,
        carbs: 18,
        fats: 3,
        alternatives: ['Boiled edamame beans', 'Roasted soya beans snack'],
        notes: 'Low glycemic index and calcium-dense.',
      },
      dinner: {
        name: 'Grilled Low-Fat Paneer / Tofu / Fish (150g) with Colorful Bell Peppers + 1 Small Roti / Soup',
        nameHi: 'ग्रिल्ड पनीर/टोफू शिमला मिर्च के साथ + 1 हल्की रोटी या सूप',
        namePa: 'ਭੁੰਨਿਆ ਪਨੀਰ/ਟੋਫੂ ਸ਼ਿਮਲਾ ਮਿਰਚਾਂ ਨਾਲ + 1 ਫੁਲਕਾ ਜਾਂ ਸੂਪ',
        portion: '150g protein + veggies + 1 phulka',
        calories: Math.round(targetCalories * 0.26),
        protein: Math.round(proteinGrams * 0.28),
        carbs: Math.round(profile.carbGrams * 0.23),
        fats: Math.round(profile.fatGrams * 0.28),
        alternatives: ['Warm lentil and vegetable stew with crushed walnuts', 'Moong dal khichdi with ghee tempering and roasted papad'],
        notes: 'Light on carbs before sleeping to promote restorative digestion.',
      },
      bedtime: {
        name: 'Warm Turmeric Cinnamon Milk (Low-Fat or Almond Milk)',
        nameHi: 'हल्का गुनगुना हल्दी और दालचीनी वाला दूध',
        namePa: 'ਕੋਸਾ ਹਲਦੀ ਅਤੇ ਦਾਲਚੀਨੀ ਵਾਲਾ ਦੁੱਧ',
        portion: '1 small cup (150ml)',
        calories: 80,
        protein: 4,
        carbs: 7,
        fats: 3,
        alternatives: ['Chamomile herbal tea', 'Ashwagandha warm infusion'],
        notes: 'Curcumin + casein aids deep tissue repair and calm sleep.',
      },
    },
    hydrationTips: `Aim for ${profile.waterIntakeLiters} Liters of water daily. Drink 1 glass 30 mins before major meals to aid satiety and enzyme secretion.`,
    cookingTips: [
      'Measure cooking oil with a teaspoon (limit to 3–4 tsp/day) rather than pouring freely from the bottle.',
      'Cook rotis without excess ghee coating; add a single drop directly to dal or subzi if needed.',
      'Use spices like jeera, ajwain, turmeric, and black pepper to boost bioavailability and avoid bloat.',
    ],
  };
}

/**
 * Generate customized workout plan based on profile and user preferences
 */
export function generateWorkoutPlan(
  profile: UserProfile,
  options?: {
    environment?: 'home' | 'gym';
    daysPerWeek?: number;
    difficulty?: 'beginner' | 'intermediate' | 'advanced';
    splitType?: 'full_body' | 'push_pull_legs' | 'upper_lower' | 'bro_split';
  }
): WorkoutPlan {
  const env = options?.environment || 'gym';
  const days = options?.daysPerWeek || (profile.age >= 50 ? 3 : 4);
  const diff = options?.difficulty || (profile.age >= 50 ? 'beginner' : 'intermediate');
  const isSeniorOrJoint = profile.age >= 50 || profile.healthFlags.jointIssues;
  const isMuscleGain = profile.goal === 'gain_muscle';
  const isFatLoss = profile.goal === 'lose_fat';

  const safetyNotes: string[] = [];
  if (isSeniorOrJoint) {
    safetyNotes.push('Low-Impact Mode Activated: Reduced spinal axial loading; controlled tempo with joint protection.');
    safetyNotes.push('Warm-up minimum 8–10 minutes: dynamic arm circles, hip openers, and ankle rotations.');
  } else if (isMuscleGain) {
    safetyNotes.push('Progressive Overload Principle: Aim to add 1 repetition or +1kg weight each week once target reps are cleanly achieved.');
    safetyNotes.push('Rest intervals: Take full 90–120 seconds between compound sets to replenish ATP-CP energy stores for peak mechanical tension.');
  } else if (isFatLoss) {
    safetyNotes.push('Metabolic Afterburn (EPOC): Keep rest periods strictly under 60 seconds to maintain elevated heart rate and mitochondrial density.');
    safetyNotes.push('Preserve Lean Mass: Lift with full effort and clean form; never sacrifice resistance weight just to move faster.');
  }

  const schedule: WorkoutDay[] = [];

  // ==========================================
  // 1. SENIORS / JOINT ISSUES / 3-DAY ROUTINE
  // ==========================================
  if (days === 3 || isSeniorOrJoint || profile.goal === 'general_health') {
    schedule.push({
      dayNumber: 1,
      dayName: 'Day 1: Full Body Strength & Joint Stability',
      focus: 'Quads, Chest, Back & Core Foundation',
      cooldownNotes: '5 minutes deep diaphragmatic breathing + quad & chest doorway stretch',
      exercises: [
        {
          name: env === 'gym' ? 'Goblet Squat (Dumbbell or Kettlebell)' : 'Chair Assisted Squat / Bodyweight Box Squat',
          category: 'strength',
          targetMuscles: ['Quadriceps', 'Glutes', 'Core'],
          sets: 3,
          reps: isSeniorOrJoint ? '10-12 (controlled)' : '8-10',
          restSeconds: 90,
          notes: 'Keep chest high, brace abs. Sit back into hips rather than driving knees forward.',
          jointFriendlyAlternative: 'Wall Sit (Hold 30s) or Glute Bridge',
          difficulty: diff,
        },
        {
          name: env === 'gym' ? 'Seated Cable Row / Lat Pulldown' : 'Resistance Band Row / Doorframe Incline Pull',
          category: 'strength',
          targetMuscles: ['Lats', 'Rhomboids', 'Biceps'],
          sets: 3,
          reps: '10-12',
          restSeconds: 75,
          notes: 'Pull through elbows, squeeze shoulder blades together for 1 full second.',
          difficulty: diff,
        },
        {
          name: env === 'gym' ? 'Dumbbell Flat / Incline Bench Press' : 'Incline Push-ups (Hands on Table / Wall)',
          category: 'strength',
          targetMuscles: ['Pectorals', 'Triceps', 'Anterior Deltoid'],
          sets: 3,
          reps: '10-12',
          restSeconds: 75,
          notes: 'Avoid flared elbows (keep at 45 degree angle to torso).',
          jointFriendlyAlternative: 'Floor Press (limits shoulder hyper-extension)',
          difficulty: diff,
        },
        {
          name: 'Dead Bug / Bird-Dog Core Stability',
          category: 'core',
          targetMuscles: ['Transverse Abdominis', 'Lower Back Stabilizers'],
          sets: 3,
          reps: '8 reps per side',
          restSeconds: 60,
          notes: 'Press lower back flat against the floor; move opposing arm and leg slowly.',
          difficulty: diff,
        },
      ],
    });

    schedule.push({
      dayNumber: 2,
      dayName: 'Day 2: Hinge, Shoulder & Functional Mobility',
      focus: 'Hamstrings, Shoulders & Posterior Chain',
      cooldownNotes: 'Hamstring towel stretch and child’s pose for lower back de-compression',
      exercises: [
        {
          name: env === 'gym' ? 'Romanian Deadlift (Dumbbells)' : 'Single-Leg Balance or Good Mornings (Band)',
          category: 'strength',
          targetMuscles: ['Hamstrings', 'Glutes', 'Erector Spinae'],
          sets: 3,
          reps: '10-12',
          restSeconds: 90,
          notes: 'Hinge hips backwards with slight soft knee bend. Stop when hamstrings are fully loaded.',
          jointFriendlyAlternative: 'Hip Thrust on Floor / Glute Bridges',
          difficulty: diff,
        },
        {
          name: env === 'gym' ? 'Seated Dumbbell Shoulder Press' : 'Pike Push-up or Resistance Band Overhead Press',
          category: 'strength',
          targetMuscles: ['Deltoids', 'Triceps'],
          sets: 3,
          reps: '10-12',
          restSeconds: 75,
          notes: 'Neutral grip (palms facing each other) is safest for rotator cuffs.',
          jointFriendlyAlternative: 'Dumbbell Lateral Raises (light weight)',
          difficulty: diff,
        },
        {
          name: env === 'gym' ? 'Leg Press or Step-ups' : 'Step-ups on Sturdy Low Bench / Stair',
          category: 'strength',
          targetMuscles: ['Glutes', 'Quads', 'Calves'],
          sets: 3,
          reps: '10 per leg',
          restSeconds: 75,
          notes: 'Drive down through the heel of the leading leg.',
          difficulty: diff,
        },
        {
          name: 'Farmer’s Carry (Loaded Walk)',
          category: 'core',
          targetMuscles: ['Grip', 'Forearms', 'Obliques', 'Traps'],
          sets: 3,
          reps: '40-second slow walk',
          restSeconds: 60,
          notes: 'Stand tall with shoulders pinned back, do not lean to either side.',
          difficulty: diff,
        },
      ],
    });

    schedule.push({
      dayNumber: 3,
      dayName: 'Day 3: Conditioning, Core & Total Body Balance',
      focus: 'Endurance, Anti-Rotation & Muscular Balance',
      cooldownNotes: 'Cobra stretch, pigeon pose, and foam rolling calves & thoracic spine',
      exercises: [
        {
          name: env === 'gym' ? 'Leg Curl (Machine) or Bulgarian Split Squat' : 'Reverse Lunges with Bodyweight',
          category: 'strength',
          targetMuscles: ['Quads', 'Glutes', 'Hamstrings'],
          sets: 3,
          reps: '10-12 reps',
          restSeconds: 90,
          notes: 'Take a generous step backwards to keep knee behind toes.',
          difficulty: diff,
        },
        {
          name: env === 'gym' ? 'Cable Face Pulls' : 'Prone Cobra / Band Pull-Aparts',
          category: 'mobility',
          targetMuscles: ['Rear Deltoids', 'Rotator Cuff', 'Upper Back'],
          sets: 3,
          reps: '15 reps',
          restSeconds: 60,
          notes: 'Vital for desk workers: pulls shoulders back and corrects forward head posture.',
          difficulty: diff,
        },
        {
          name: 'Plank Hold with Knee Taps',
          category: 'core',
          targetMuscles: ['Abdominals', 'Serratus Anterior'],
          sets: 3,
          reps: '30-45 seconds',
          restSeconds: 60,
          notes: 'Maintain a straight line from crown of head to heels without sagging hips.',
          jointFriendlyAlternative: 'Incline Plank (hands on bench/sofa)',
          difficulty: diff,
        },
        {
          name: env === 'gym' ? 'Incline Treadmill Walk or Stationary Bike' : 'Brisk Walking or Low-Impact March in Place',
          category: 'cardio',
          targetMuscles: ['Cardiovascular System', 'Calves'],
          sets: 1,
          reps: '15-20 minutes',
          restSeconds: 0,
          notes: 'Zone 2 cardio: you should be able to hold a conversation without gasping.',
          difficulty: diff,
        },
      ],
    });
  }

  // ==========================================================
  // 2. HYPERTROPHY & LEAN MUSCLE GAIN PROTOCOL (4-DAY SPLIT)
  // ==========================================================
  else if (isMuscleGain) {
    schedule.push({
      dayNumber: 1,
      dayName: 'Day 1: Upper Body Hypertrophy (Chest & Back Width)',
      focus: 'Pectorals, Lats, Rhomboids & Biceps Growth',
      cooldownNotes: 'Doorway pectoral stretch and lat foam rolling',
      exercises: [
        {
          name: env === 'gym' ? 'Barbell or Heavy Dumbbell Flat Bench Press' : 'Weighted / Deficit Push-ups (Hands on Books)',
          category: 'strength',
          targetMuscles: ['Pectoralis Major', 'Triceps', 'Anterior Deltoids'],
          sets: 4,
          reps: '8-10',
          restSeconds: 120,
          notes: 'Lower the weight with a 3-second eccentric tempo; explosive press up.',
          difficulty: diff,
        },
        {
          name: env === 'gym' ? 'Incline Dumbbell Press (30-Degree Angle)' : 'Feet-Elevated Decline Push-ups',
          category: 'strength',
          targetMuscles: ['Upper Clavicular Chest'],
          sets: 4,
          reps: '10-12',
          restSeconds: 90,
          notes: 'Maximizes upper chest shelf development without excessive front delt takeover.',
          difficulty: diff,
        },
        {
          name: env === 'gym' ? 'Bent-Over Barbell or Heavy DB Row' : 'Inverted Table Rows / Heavy Resistance Band Rows',
          category: 'strength',
          targetMuscles: ['Lats', 'Middle Trapezius', 'Biceps'],
          sets: 4,
          reps: '8-10',
          restSeconds: 90,
          notes: 'Keep spine completely neutral; pull toward lower belly button.',
          difficulty: diff,
        },
        {
          name: env === 'gym' ? 'Lat Pulldowns (Wide / Neutral Grip)' : 'Towel Doorframe Pull-ins / Band Pulldowns',
          category: 'strength',
          targetMuscles: ['Latissimus Dorsi', 'Teres Major'],
          sets: 4,
          reps: '10-12',
          restSeconds: 75,
          notes: 'Drive elbows down into your hip pockets; squeeze lats at the bottom.',
          difficulty: diff,
        },
        {
          name: env === 'gym' ? 'Incline Dumbbell Bicep Curls' : 'Resistance Band Bicep Curls (3-Second Negative)',
          category: 'strength',
          targetMuscles: ['Biceps Long Head'],
          sets: 3,
          reps: '12-15',
          restSeconds: 60,
          notes: 'Full stretch at the bottom; do not swing hips or shoulders.',
          difficulty: diff,
        },
      ],
    });

    schedule.push({
      dayNumber: 2,
      dayName: 'Day 2: Lower Body Hypertrophy (Quads & Hamstring Mass)',
      focus: 'Squats, Hinges, Calves & Core Rigidity',
      cooldownNotes: 'Deep couch stretch for hip flexors and seated hamstring stretch',
      exercises: [
        {
          name: env === 'gym' ? 'Barbell Back Squat or Hack Squat' : 'Bulgarian Split Squats (Heavy Backpack / Dumbbells)',
          category: 'strength',
          targetMuscles: ['Quadriceps', 'Gluteus Maximus'],
          sets: 4,
          reps: '8-10',
          restSeconds: 120,
          notes: 'Break parallel depth cleanly; push through midfoot.',
          difficulty: diff,
        },
        {
          name: env === 'gym' ? 'Romanian Deadlift (RDL)' : 'Single-Leg Dumbbell Romanian Deadlift',
          category: 'strength',
          targetMuscles: ['Hamstrings', 'Glutes', 'Erectors'],
          sets: 4,
          reps: '8-10',
          restSeconds: 120,
          notes: 'Push hips backward until deep hamstring stretch; drive through heels.',
          difficulty: diff,
        },
        {
          name: env === 'gym' ? 'Leg Press or Dumbbell Walking Lunges' : 'Bodyweight Jump Squats into Walking Lunges',
          category: 'strength',
          targetMuscles: ['Quads', 'Adductors', 'Glutes'],
          sets: 3,
          reps: '10-12',
          restSeconds: 90,
          notes: 'Keep torso upright; take generous strides for maximum glute loading.',
          difficulty: diff,
        },
        {
          name: env === 'gym' ? 'Standing Calf Raises (Machine or Smith)' : 'Single-Leg Calf Raises on Stair Edge (2s Peak Pause)',
          category: 'strength',
          targetMuscles: ['Gastrocnemius', 'Soleus'],
          sets: 4,
          reps: '15-20',
          restSeconds: 60,
          notes: 'Hold peak contraction for 2 full seconds at the top; feel the burn.',
          difficulty: diff,
        },
        {
          name: 'Hanging Leg Raises / Lying Leg Curls',
          category: 'core',
          targetMuscles: ['Lower Rectus Abdominis'],
          sets: 3,
          reps: '12-15',
          restSeconds: 60,
          notes: 'Curl hips upward toward ribs rather than swinging legs with momentum.',
          difficulty: diff,
        },
      ],
    });

    schedule.push({
      dayNumber: 3,
      dayName: 'Day 3: Push Hypertrophy (Shoulders & Triceps 3D Cap)',
      focus: 'Deltoid Width, Upper Chest & Tricep Thickness',
      cooldownNotes: 'Cross-body shoulder stretch and tricep overhead reach',
      exercises: [
        {
          name: env === 'gym' ? 'Standing Overhead Barbell or Dumbbell Press' : 'Pike Push-ups or Handstand Push-up Progressions',
          category: 'strength',
          targetMuscles: ['Anterior Deltoid', 'Lateral Deltoid', 'Triceps'],
          sets: 4,
          reps: '8-10',
          restSeconds: 90,
          notes: 'Lock glutes and brace core; press straight overhead without backward lean.',
          difficulty: diff,
        },
        {
          name: env === 'gym' ? 'Dumbbell / Cable Lateral Raises' : 'Water Bottle / Band Lateral Raises (High Volume)',
          category: 'strength',
          targetMuscles: ['Lateral Deltoids (Shoulder Width)'],
          sets: 4,
          reps: '12-15',
          restSeconds: 60,
          notes: 'Raise in the scapular plane with pinky slightly elevated; build 3D shoulders.',
          difficulty: diff,
        },
        {
          name: env === 'gym' ? 'Cable Rope Tricep Pushdown' : 'Close-Grip Diamond Push-ups or Chair Dips',
          category: 'strength',
          targetMuscles: ['Triceps Lateral & Medial Head'],
          sets: 4,
          reps: '12-15',
          restSeconds: 60,
          notes: 'Spread the rope apart at the bottom lockout; keep elbows pinned to ribs.',
          difficulty: diff,
        },
        {
          name: env === 'gym' ? 'Overhead Cable Tricep Extension' : 'Overhead Dumbbell Tricep Extension',
          category: 'strength',
          targetMuscles: ['Triceps Long Head'],
          sets: 3,
          reps: '12-15',
          restSeconds: 60,
          notes: 'Deep stretch behind head targets the largest head of the triceps.',
          difficulty: diff,
        },
        {
          name: env === 'gym' ? 'Pec Deck Flyes or Cable Crossover' : 'Wide Stance Floor Push-ups with 2s Chest Stretch',
          category: 'strength',
          targetMuscles: ['Sternal Pectorals'],
          sets: 3,
          reps: '12-15',
          restSeconds: 60,
          notes: 'Hug a big tree movement; intense peak contraction.',
          difficulty: diff,
        },
      ],
    });

    schedule.push({
      dayNumber: 4,
      dayName: 'Day 4: Pull Hypertrophy & Posterior Chain Power',
      focus: 'Deadlift Power, Traps, Rear Delts & Forearm Grip',
      cooldownNotes: 'Child’s pose, foam rolling thoracic spine, and forearm stretches',
      exercises: [
        {
          name: env === 'gym' ? 'Conventional or Trap Bar Deadlift' : 'Heavy Banded Good Mornings / Single-Leg RDL',
          category: 'strength',
          targetMuscles: ['Hamstrings', 'Glutes', 'Lats', 'Traps', 'Erectors'],
          sets: 4,
          reps: '6-8',
          restSeconds: 150,
          notes: 'Reset after every rep; engage lats and push floor away with your legs.',
          difficulty: diff,
        },
        {
          name: env === 'gym' ? 'Seated Cable Row (Close-Grip V-Bar)' : 'Resistance Band Rows with 2-Second Hold',
          category: 'strength',
          targetMuscles: ['Rhomboids', 'Mid-Trapezius', 'Lats'],
          sets: 4,
          reps: '10-12',
          restSeconds: 75,
          notes: 'Retract shoulder blades fully before pulling arms back.',
          difficulty: diff,
        },
        {
          name: env === 'gym' ? 'Cable Face Pulls (to Forehead)' : 'Band Pull-Aparts / Prone Y-Raises',
          category: 'mobility',
          targetMuscles: ['Rear Deltoids', 'Rotator Cuff', 'Lower Traps'],
          sets: 4,
          reps: '15',
          restSeconds: 60,
          notes: 'Externally rotate hands at end of pull; builds round shoulders and fixes posture.',
          difficulty: diff,
        },
        {
          name: env === 'gym' ? 'Dumbbell Hammer Curls' : 'Resistance Band Hammer Curls',
          category: 'strength',
          targetMuscles: ['Brachialis', 'Brachioradialis', 'Biceps'],
          sets: 3,
          reps: '12-15',
          restSeconds: 60,
          notes: 'Neutral grip thickens upper arm and strengthens grip for heavy deadlifts.',
          difficulty: diff,
        },
        {
          name: 'Ab Wheel Rollouts or Extended Plank Hold',
          category: 'core',
          targetMuscles: ['Full Abdominal Wall', 'Serratus Anterior'],
          sets: 3,
          reps: '10-12 rollouts (or 60s hold)',
          restSeconds: 60,
          notes: 'Do not let lower back sag; maintain a strong posterior pelvic tilt.',
          difficulty: diff,
        },
      ],
    });
  }

  // ==========================================================
  // 3. FAT-LOSS & METABOLIC CONDITIONING PROTOCOL (4-DAY SPLIT)
  // ==========================================================
  else if (isFatLoss) {
    schedule.push({
      dayNumber: 1,
      dayName: 'Day 1: Metabolic Push & Core Intervals',
      focus: 'Thrusters, Upper Pushing, High-Heart-Rate EPOC',
      cooldownNotes: '5 minutes brisk walk + doorway chest stretch and child’s pose',
      exercises: [
        {
          name: env === 'gym' ? 'Dumbbell Thrusters (Squat to Overhead Press)' : 'Bodyweight Thrusters (or with Backpack)',
          category: 'strength',
          targetMuscles: ['Quads', 'Glutes', 'Shoulders', 'Core'],
          sets: 4,
          reps: '12-15',
          restSeconds: 60,
          notes: 'Explosive full-body movement that spikes cardiac output and calorie burning.',
          difficulty: diff,
        },
        {
          name: env === 'gym' ? 'Dumbbell Bench Press Superset with Push-ups' : 'Standard Push-ups Superset with Mountain Climbers',
          category: 'strength',
          targetMuscles: ['Chest', 'Triceps', 'Core'],
          sets: 4,
          reps: '12 reps + 10 push-ups',
          restSeconds: 60,
          notes: 'Minimal rest between exercises forces high muscular endurance and glycogen depletion.',
          difficulty: diff,
        },
        {
          name: 'Mountain Climbers to High Plank Hold',
          category: 'core',
          targetMuscles: ['Abdominals', 'Hip Flexors', 'Shoulders'],
          sets: 3,
          reps: '45 seconds continuous',
          restSeconds: 45,
          notes: 'Keep hips level with shoulders; drive knees rapidly toward chest.',
          difficulty: diff,
        },
        {
          name: env === 'gym' ? 'Incline Treadmill Power Walk (12% Incline, 4.8 km/h)' : 'Brisk Outdoor Hill Walk or Stair Climbing',
          category: 'cardio',
          targetMuscles: ['Cardiovascular System', 'Calves', 'Glutes'],
          sets: 1,
          reps: '15 minutes',
          restSeconds: 0,
          notes: 'Zone 2 aerobic flush: mobilizes free fatty acids released during the lifting circuit.',
          difficulty: diff,
        },
      ],
    });

    schedule.push({
      dayNumber: 2,
      dayName: 'Day 2: Metabolic Pull & Posterior Chain Density',
      focus: 'Kettlebell Swings, DB Rows & High Density',
      cooldownNotes: 'Hamstring stretch and cat-cow spine de-compression',
      exercises: [
        {
          name: env === 'gym' ? 'Kettlebell or Heavy Dumbbell Swings' : 'Banded Explosive Hip Hinges / Swings',
          category: 'strength',
          targetMuscles: ['Glutes', 'Hamstrings', 'Lower Back', 'Core'],
          sets: 4,
          reps: '15-20',
          restSeconds: 60,
          notes: 'Snap hips forward explosively; this is a hinge movement, not a squat.',
          difficulty: diff,
        },
        {
          name: env === 'gym' ? 'Dumbbell Renegade Rows (Push-up Position)' : 'Plank Alternating Shoulder Taps',
          category: 'strength',
          targetMuscles: ['Lats', 'Core Anti-Rotation', 'Biceps'],
          sets: 4,
          reps: '10 per arm',
          restSeconds: 60,
          notes: 'Widen feet for stability; resist hip twisting as each dumbbell is rowed.',
          difficulty: diff,
        },
        {
          name: env === 'gym' ? 'Lat Pulldowns Superset with Band Face Pulls' : 'Doorframe Rows Superset with Band Pull-Aparts',
          category: 'strength',
          targetMuscles: ['Lats', 'Upper Back', 'Rotator Cuff'],
          sets: 3,
          reps: '12-15 reps',
          restSeconds: 60,
          notes: 'Keeps upper back dense while posture is maintained under fatigue.',
          difficulty: diff,
        },
        {
          name: 'Russian Twists with Dumbbell or Medicine Ball',
          category: 'core',
          targetMuscles: ['Obliques', 'Transverse Abdominis'],
          sets: 3,
          reps: '20 twists total',
          restSeconds: 45,
          notes: 'Elevate heels off ground for added difficulty; rotate through thoracic spine.',
          difficulty: diff,
        },
      ],
    });

    schedule.push({
      dayNumber: 3,
      dayName: 'Day 3: Lower Body High-Volume Calorie Burn',
      focus: 'Goblet Squats, Walking Lunges & Jump Intervals',
      cooldownNotes: 'Pigeon pose stretch and quad doorway stretch',
      exercises: [
        {
          name: env === 'gym' ? 'Goblet Squats with 1-Second Bottom Pause' : 'Bodyweight Squats with 1-Second Bottom Pause',
          category: 'strength',
          targetMuscles: ['Quadriceps', 'Glutes', 'Core'],
          sets: 4,
          reps: '12-15',
          restSeconds: 60,
          notes: 'Eliminating the stretch reflex forces pure muscular work and high calorie burn.',
          difficulty: diff,
        },
        {
          name: env === 'gym' ? 'Walking Dumbbell Lunges' : 'Walking Bodyweight Lunges',
          category: 'strength',
          targetMuscles: ['Quads', 'Glutes', 'Hamstrings'],
          sets: 3,
          reps: '12 steps per leg',
          restSeconds: 60,
          notes: 'Continuous lunges elevate cardiovascular burn while building leg definition.',
          difficulty: diff,
        },
        {
          name: env === 'gym' ? 'Romanian Deadlift (Moderate Weight, Fast Tempo)' : 'Single-Leg Bodyweight Deadlift',
          category: 'strength',
          targetMuscles: ['Hamstrings', 'Glutes'],
          sets: 3,
          reps: '12-15',
          restSeconds: 60,
          notes: 'Controlled eccentric descent; squeeze glutes at the top.',
          difficulty: diff,
        },
        {
          name: 'Jump Rope or High Knees Cardio Intervals',
          category: 'cardio',
          targetMuscles: ['Calves', 'Cardiovascular System'],
          sets: 4,
          reps: '45 seconds on / 15 seconds rest',
          restSeconds: 45,
          notes: 'High-intensity interval finisher to exhaust glycogen and maximize EPOC.',
          difficulty: diff,
        },
      ],
    });

    schedule.push({
      dayNumber: 4,
      dayName: 'Day 4: Total Body Density Circuit & Aerobic Flush',
      focus: 'Full-Body Density, Farmer’s Carries & Fat Burn',
      cooldownNotes: 'Full-body foam rolling and 5 minutes deep nasal breathing',
      exercises: [
        {
          name: env === 'gym' ? 'Dumbbell Clean & Push Press' : 'Burpees into Step-backs (Controlled Form)',
          category: 'strength',
          targetMuscles: ['Total Body Compound'],
          sets: 4,
          reps: '10-12',
          restSeconds: 60,
          notes: 'Coordinate legs and shoulders in one fluid, powerful movement.',
          difficulty: diff,
        },
        {
          name: env === 'gym' ? 'Farmer’s Carry (Heavy Dumbbells in each hand)' : 'Overhead Water Jug Carry / Slow March',
          category: 'core',
          targetMuscles: ['Grip', 'Traps', 'Core Stability'],
          sets: 4,
          reps: '45 seconds walking',
          restSeconds: 60,
          notes: 'Walk with tall posture; do not allow shoulders to roll forward.',
          difficulty: diff,
        },
        {
          name: 'Plank with Alternating Knee Taps',
          category: 'core',
          targetMuscles: ['Rectus Abdominis', 'Obliques'],
          sets: 3,
          reps: '45 seconds',
          restSeconds: 45,
          notes: 'Lock in core tightness; tap knees gently to floor one at a time.',
          difficulty: diff,
        },
        {
          name: env === 'gym' ? 'Steady-State Stationary Bike or Elliptical' : 'Brisk Outdoor Walk / Jog',
          category: 'cardio',
          targetMuscles: ['Cardiovascular System', 'Fat Oxidation'],
          sets: 1,
          reps: '20 minutes',
          restSeconds: 0,
          notes: 'Zone 2 aerobic zone (115–130 bpm) utilizes fat as primary fuel source.',
          difficulty: diff,
        },
      ],
    });
  }

  // ==========================================================
  // 4. MAINTENANCE & RECOMPOSITION (4-DAY SPLIT)
  // ==========================================================
  else {
    schedule.push({
      dayNumber: 1,
      dayName: 'Day 1: Upper Body Strength & Posture',
      focus: 'Chest, Upper Back, Shoulders & Arms',
      cooldownNotes: 'Doorway chest stretch and band dislocations',
      exercises: [
        {
          name: env === 'gym' ? 'Barbell / Dumbbell Bench Press' : 'Standard Push-ups',
          category: 'strength',
          targetMuscles: ['Chest', 'Triceps'],
          sets: 4,
          reps: '8-10',
          restSeconds: 90,
          notes: 'Retract scapula and drive feet into ground.',
          difficulty: diff,
        },
        {
          name: env === 'gym' ? 'Bent-Over Barbell or Dumbbell Row' : 'Inverted Row / Band Rows',
          category: 'strength',
          targetMuscles: ['Lats', 'Mid-back'],
          sets: 4,
          reps: '8-10',
          restSeconds: 90,
          notes: 'Keep spine neutral, pull to lower ribcage.',
          difficulty: diff,
        },
        {
          name: env === 'gym' ? 'Standing Overhead Barbell/Dumbbell Press' : 'Pike Push-ups',
          category: 'strength',
          targetMuscles: ['Shoulders', 'Triceps'],
          sets: 3,
          reps: '10-12',
          restSeconds: 75,
          notes: 'Squeeze glutes to prevent lower back arching.',
          difficulty: diff,
        },
        {
          name: env === 'gym' ? 'Incline Dumbbell Bicep Curls' : 'Resistance Band Bicep Curls',
          category: 'strength',
          targetMuscles: ['Biceps'],
          sets: 3,
          reps: '12-15',
          restSeconds: 60,
          notes: 'Full range of motion, avoid swinging hips.',
          difficulty: diff,
        },
      ],
    });

    schedule.push({
      dayNumber: 2,
      dayName: 'Day 2: Lower Body Power & Core Stability',
      focus: 'Quads, Hamstrings, Calves & Deep Core',
      cooldownNotes: 'Couch stretch for hip flexors and seated forward fold',
      exercises: [
        {
          name: env === 'gym' ? 'Barbell Back Squat / Hack Squat' : 'Bulgarian Split Squats',
          category: 'strength',
          targetMuscles: ['Quads', 'Glutes'],
          sets: 4,
          reps: '8-10',
          restSeconds: 120,
          notes: 'Hit parallel depth with knees tracking over second toe.',
          difficulty: diff,
        },
        {
          name: env === 'gym' ? 'Romanian Deadlift (RDL)' : 'Single-Leg Romanian Deadlift',
          category: 'strength',
          targetMuscles: ['Hamstrings', 'Glutes'],
          sets: 4,
          reps: '10-12',
          restSeconds: 90,
          notes: 'Feel deep stretch in hamstrings before explosive hip drive.',
          difficulty: diff,
        },
        {
          name: env === 'gym' ? 'Standing Calf Raises' : 'Single-Leg Calf Raises on Stair Edge',
          category: 'strength',
          targetMuscles: ['Gastrocnemius', 'Soleus'],
          sets: 3,
          reps: '15-20',
          restSeconds: 60,
          notes: 'Hold peak contraction for 2 seconds at the top.',
          difficulty: diff,
        },
        {
          name: 'Hanging Leg Raises / Lying Leg Raises',
          category: 'core',
          targetMuscles: ['Lower Abs', 'Hip Flexors'],
          sets: 3,
          reps: '12-15',
          restSeconds: 60,
          notes: 'Curl pelvis up at the peak; do not use momentum.',
          difficulty: diff,
        },
      ],
    });

    schedule.push({
      dayNumber: 3,
      dayName: 'Day 3: Upper Body Hypertrophy & Delts',
      focus: 'Upper Chest, Lat Width, Rear Delts & Triceps',
      cooldownNotes: 'Cross-body shoulder stretch and thoracic foam rolling',
      exercises: [
        {
          name: env === 'gym' ? 'Incline Dumbbell Press' : 'Feet-Elevated Push-ups',
          category: 'strength',
          targetMuscles: ['Upper Clavicular Pectorals'],
          sets: 4,
          reps: '10-12',
          restSeconds: 75,
          notes: '30-degree incline maximizes upper chest without excessive front delt takeover.',
          difficulty: diff,
        },
        {
          name: env === 'gym' ? 'Lat Pulldowns (Wide or Neutral Grip)' : 'Towel Pull-Ups or Doorframe Incline Rows',
          category: 'strength',
          targetMuscles: ['Lats', 'Teres Major'],
          sets: 4,
          reps: '10-12',
          restSeconds: 75,
          notes: 'Lead with elbows downwards toward hip pockets.',
          difficulty: diff,
        },
        {
          name: 'Dumbbell / Water Bottle Lateral Raises',
          category: 'strength',
          targetMuscles: ['Lateral Deltoids'],
          sets: 4,
          reps: '12-15',
          restSeconds: 60,
          notes: 'Slight forward lean, raise arms in scapular plane.',
          difficulty: diff,
        },
        {
          name: env === 'gym' ? 'Overhead Cable Tricep Extension' : 'Bench or Chair Dips',
          category: 'strength',
          targetMuscles: ['Triceps Long Head'],
          sets: 3,
          reps: '12-15',
          restSeconds: 60,
          notes: 'Keep elbows tucked in close to ears.',
          difficulty: diff,
        },
      ],
    });

    schedule.push({
      dayNumber: 4,
      dayName: 'Day 4: Lower Body Volume & Functional Chain',
      focus: 'Glutes, Adductors, Hamstrings & Obliques',
      cooldownNotes: 'Pigeon pose stretch and butterfly groin stretch',
      exercises: [
        {
          name: env === 'gym' ? 'Barbell or Dumbbell Hip Thrust' : 'Single-Leg Elevated Glute Bridges',
          category: 'strength',
          targetMuscles: ['Gluteus Maximus'],
          sets: 4,
          reps: '10-12',
          restSeconds: 90,
          notes: 'Tuck chin into chest, pause at full lockout for 2 seconds.',
          difficulty: diff,
        },
        {
          name: env === 'gym' ? 'Walking Dumbbell Lunges' : 'Walking Bodyweight Lunges',
          category: 'strength',
          targetMuscles: ['Quads', 'Glutes', 'Core Balance'],
          sets: 3,
          reps: '12 steps per leg',
          restSeconds: 90,
          notes: 'Keep torso upright, take big strides to hit glutes.',
          difficulty: diff,
        },
        {
          name: env === 'gym' ? 'Seated or Lying Leg Curl' : 'Slider Hamstring Curls (Towel on floor)',
          category: 'strength',
          targetMuscles: ['Hamstrings'],
          sets: 3,
          reps: '12-15',
          restSeconds: 60,
          notes: 'Control the eccentric descent over 3 slow seconds.',
          difficulty: diff,
        },
        {
          name: 'Pallof Press or Russian Twists',
          category: 'core',
          targetMuscles: ['Obliques', 'Rotational Stability'],
          sets: 3,
          reps: '15 per side',
          restSeconds: 60,
          notes: 'Resist rotational twist to lock in core rigidity.',
          difficulty: diff,
        },
      ],
    });
  }

  // Dynamic Title based on User Objective & Environment
  let planTitle = `${env === 'gym' ? 'Personalized Gym' : 'Home'} Workout (${days}-Day Split)`;
  if (isSeniorOrJoint) {
    planTitle = `Joint-Safe & Longevity ${env === 'gym' ? 'Gym' : 'Home'} Protocol (${days}-Day Split)`;
  } else if (isMuscleGain) {
    planTitle = `Personalized Hypertrophy & Muscle Growth (${env === 'gym' ? 'Gym' : 'Home'} • ${days}-Day Split)`;
  } else if (isFatLoss) {
    planTitle = `Personalized Fat-Loss & Metabolic Burn (${env === 'gym' ? 'Gym' : 'Home'} • ${days}-Day Split)`;
  } else {
    planTitle = `Body Recomposition & Functional Strength (${env === 'gym' ? 'Gym' : 'Home'} • ${days}-Day Split)`;
  }

  return {
    id: `plan_${Date.now()}`,
    title: planTitle,
    environment: env,
    daysPerWeek: days,
    splitType: days === 3 || isSeniorOrJoint ? 'full_body' : 'upper_lower',
    difficulty: diff,
    ageGroupSafety: safetyNotes,
    schedule,
  };
}

/**
 * Calculate dynamic program timeline and ZeroFIT AI next-step guidance
 * based on user blueprint metrics and actual daily progress logs.
 */
export function calculateProgramTimeline(
  profile: UserProfile,
  logs: ProgressLog[] = []
): ProgramTimeline {
  const hasLogs = logs.length > 0;
  const startWeightKg = hasLogs ? logs[0].weightKg : profile.weightKg || 75;
  const currentWeightKg = hasLogs ? logs[logs.length - 1].weightKg : profile.weightKg || 75;
  const targetWeightKg = profile.targetWeightKg || startWeightKg;

  const isFatLoss = profile.goal === 'lose_fat' || targetWeightKg < startWeightKg;
  const isMuscleGain = profile.goal === 'gain_muscle' || targetWeightKg > startWeightKg;

  // Evidence-based safe pace: 0.5 kg/week for fat loss, 0.25 kg/week for lean muscle gain
  let weeklyRateKg = 0.5;
  if (isFatLoss) {
    weeklyRateKg = profile.bmiCategory === 'obese' ? 0.65 : 0.5;
  } else if (isMuscleGain) {
    weeklyRateKg = 0.25;
  }

  const totalChangeNeeded = Math.abs(startWeightKg - targetWeightKg);
  let totalDays = 90; // Default 90-day conditioning baseline

  if (totalChangeNeeded > 0) {
    const totalWeeks = totalChangeNeeded / weeklyRateKg;
    totalDays = Math.max(14, Math.round(totalWeeks * 7));
  }

  // Calculate current program day
  let currentDay = 1;
  if (logs.length > 1) {
    const d1 = new Date(logs[0].date).getTime();
    const d2 = new Date(logs[logs.length - 1].date).getTime();
    const diffDays = Math.max(0, Math.floor((d2 - d1) / (1000 * 60 * 60 * 24)));
    currentDay = Math.min(totalDays, diffDays + 1);
  } else if (logs.length === 1) {
    currentDay = 1;
  }

  const remainingChangeKg = Math.max(0, parseFloat(Math.abs(currentWeightKg - targetWeightKg).toFixed(1)));
  const totalChangeKg = parseFloat((startWeightKg - currentWeightKg).toFixed(1));

  let daysRemaining = 0;
  if (remainingChangeKg > 0) {
    const weeksLeft = remainingChangeKg / weeklyRateKg;
    daysRemaining = Math.max(1, Math.round(weeksLeft * 7));
  }

  let percentComplete = 0;
  if (totalChangeNeeded > 0) {
    const progressDone = totalChangeNeeded - remainingChangeKg;
    percentComplete = Math.min(100, Math.max(0, Math.round((progressDone / totalChangeNeeded) * 100)));
  } else {
    percentComplete = Math.min(100, Math.round((currentDay / totalDays) * 100));
  }

  // Generate ZeroFIT AI Dynamic Guidance
  const latestLog = hasLogs ? logs[logs.length - 1] : null;

  // 1. Status Summary
  let statusSummary = `Day ${currentDay} of your ${totalDays}-Day Transformation Program. Targeting ${targetWeightKg} kg from ${startWeightKg} kg.`;
  if (remainingChangeKg > 0) {
    statusSummary += ` (${remainingChangeKg} kg remaining to goal, ~${daysRemaining} days at safe ${weeklyRateKg} kg/week pace).`;
  } else {
    statusSummary += ` 🎉 Target goal reached! Focus on metabolic maintenance and strength consistency.`;
  }

  // 2. Nutrition Next Step
  let nextStepNutrition = `Daily Calorie Target: ${profile.targetCalories} kcal with ${profile.proteinGrams}g Protein.`;
  if (latestLog?.dietAdherence === 'over_calories' || latestLog?.dietAdherence === 'cheat_day') {
    nextStepNutrition = `Reset smoothly tomorrow: Do not skip meals or starve. Return strictly to ${profile.targetCalories} kcal with ${profile.proteinGrams}g Protein. Drink an extra 500ml water to flush sodium water retention and take a 15-minute walk after lunch.`;
  } else if (latestLog?.dietAdherence === 'under_calories') {
    nextStepNutrition = `Important: You were under calories today. Avoid extreme deficits below ${Math.max(1400, profile.targetCalories - 200)} kcal as they trigger metabolic adaptation and muscle loss. Hit your ${profile.proteinGrams}g Protein target with whole foods.`;
  } else if (latestLog?.dietAdherence === 'on_track') {
    nextStepNutrition = `Outstanding consistency! Keep daily intake at ${profile.targetCalories} kcal (${profile.proteinGrams}g Protein). Prioritize whole grains, dal, paneer/soya, or lean meats with fibrous vegetables.`;
  } else {
    nextStepNutrition = `Nutrition Priority: Keep calories within ${profile.targetCalories} kcal with ${profile.proteinGrams}g Protein (${profile.dietPreference === 'veg' ? 'Paneer, Soya, Dal, Greek Curd' : 'Eggs, Chicken Breast, Fish, Dal'}).`;
  }

  // 3. Workout Next Step
  let nextStepWorkout = '';
  const isSeniorOrJoint = profile.age >= 50 || profile.healthFlags.jointIssues;
  if (latestLog?.workoutCompleted) {
    nextStepWorkout = `Great effort completing today's ${latestLog.workoutType || 'workout'}! Tomorrow: Focus on ${
      isSeniorOrJoint
        ? 'Joint-Safe Mobility & Core Bracing (30 min)'
        : 'scheduled resistance training with controlled 3-second eccentric tempo'
    }. Keep rest intervals generous (60–90s).`;
  } else {
    nextStepWorkout = `Tomorrow's Workout Priority: Complete your ${
      isSeniorOrJoint
        ? 'Low-Impact Joint-Safe Routine (Box Squats, Band Pull-Aparts, 30 min Incline Walk)'
        : 'scheduled 45-min Strength Training Split'
    }. If you cannot hit the gym, target 8,000 brisk steps to keep NEAT elevated.`;
  }

  // 4. Recovery & Hydration
  const nextStepRecovery = `Hydration Goal: ${profile.waterIntakeLiters} Liters. Target 7.5 to 8 hours of deep restorative sleep tonight to reset cortisol and release HGH for muscle repair and fat burning.`;

  // 5. Actionable Micro-Habit
  const actionableTask =
    profile.goal === 'lose_fat'
      ? 'Walk 1,000 steps immediately after your next meal to clear postprandial glucose.'
      : 'Prep your morning high-protein breakfast tonight to guarantee your daily leucine trigger.';

  return {
    totalDays,
    currentDay,
    daysRemaining,
    startWeightKg,
    currentWeightKg,
    targetWeightKg,
    totalChangeKg,
    remainingChangeKg,
    percentComplete,
    weeklyRateKg,
    aiGuidance: {
      statusSummary,
      nextStepNutrition,
      nextStepWorkout,
      nextStepRecovery,
      actionableTask,
    },
  };
}

/**
 * Generate a complete, multi-modal movement plan:
 * Gym/Resistance split + Running pacing + Daily Walking/Steps + Joint Mobility
 */
export function generateComprehensiveMovementPlan(
  profile: UserProfile,
  env: 'gym' | 'home' = 'gym',
  days: number = 4
): ComprehensiveMovementPlan {
  const gym = generateWorkoutPlan(profile, { environment: env, daysPerWeek: days });
  const isSeniorOrJoint = profile.age >= 50 || profile.healthFlags.jointIssues;

  // Running & Cardio Protocol
  const running: RunningProtocol = isSeniorOrJoint
    ? {
        frequencyPerWeek: 2,
        targetDistanceKm: 2.5,
        pacingStyle: 'Low-Impact Run/Walk Intervals (Joint-Friendly)',
        heartRateZone: 'Zone 1–2 (100–120 bpm)',
        intervals: [
          { phase: 'Warm-up', duration: '5 mins', speedOrPace: '4.5 km/h brisk walk', notes: 'Pump arms, warm up ankles and knees.' },
          { phase: 'Run/Walk Cycles', duration: '15 mins', speedOrPace: '6.0 km/h jog for 45s, 4.8 km/h walk for 90s', notes: 'Land softly on midfoot, preferably on grass or cushioned treadmill.' },
          { phase: 'Cool-down', duration: '5 mins', speedOrPace: '4.0 km/h easy stroll', notes: 'Breathe deeply through nose to lower heart rate.' },
        ],
        guidance: 'For joints over 45, low-impact run-walk intervals improve cardiac stroke volume without excessive knee impact force.',
      }
    : {
        frequencyPerWeek: 3,
        targetDistanceKm: profile.goal === 'lose_fat' ? 4.5 : 3.0,
        pacingStyle: 'Zone 2 Aerobic Base (Mitochondrial Fat Oxidation)',
        heartRateZone: 'Zone 2 (125–145 bpm) — Conversational Pace',
        intervals: [
          { phase: 'Dynamic Warm-up', duration: '5 mins', speedOrPace: 'Brisk walk + leg swings', notes: 'Activate glutes and calves before running.' },
          { phase: 'Steady-State Aerobic Run', duration: '20–25 mins', speedOrPace: '7.5–9.0 km/h conversational pace', notes: 'Maintain nasal breathing or ability to speak short sentences; burns visceral fat directly.' },
          { phase: 'Flush & Cool-down', duration: '5 mins', speedOrPace: '5.0 km/h easy walk', notes: 'Flushes metabolic lactic acid from calves.' },
        ],
        guidance: 'Zone 2 running trains your mitochondria to burn fatty acids for fuel while keeping cortisol low, protecting your hard-earned muscle.',
      };

  // Walking & Daily Step Protocol
  const walking: WalkingProtocol = {
    dailyStepTarget: profile.goal === 'lose_fat' ? 10000 : 8000,
    estimatedCalorieBurn: profile.goal === 'lose_fat' ? 420 : 320,
    postMealWalkMinutes: 15,
    glucoseClearanceTip:
      'A brisk 10–15 minute walk right after lunch and dinner uses GLUT-4 transporters to clear blood glucose without requiring excessive insulin spikes.',
    weeklyStepsGoal: profile.goal === 'lose_fat' ? 70000 : 56000,
  };

  // Mobility & Joint Care Protocol
  const mobility: MobilityProtocol = {
    routineName: isSeniorOrJoint ? 'Joint Longevity & Synovial Fluid Activation' : 'Athletic Hip, Spine & Shoulder Decompression',
    durationMinutes: 12,
    jointFocus: ['Lumbar Spine', 'Hip Capsule', 'Knee Joint', 'Thoracic Spine', 'Rotator Cuff'],
    exercises: [
      {
        name: 'Cat-Cow Spinal Waves',
        focusJoint: 'Thoracic & Lumbar Spine',
        repsOrHold: '10 slow breaths',
        instruction: 'Inhale arching gently, exhale rounding your back toward the ceiling, releasing trapped disc pressure.',
      },
      {
        name: '90/90 Hip Switches',
        focusJoint: 'Hip Capsule & Pelvic Floor',
        repsOrHold: '8 reps per side',
        instruction: 'Sit with both legs at 90 degrees; rotate knees across the floor to unlock internal and external hip rotation.',
      },
      {
        name: 'Shoulder Dislocates (Towel or Band)',
        focusJoint: 'Scapula & Rotator Cuff',
        repsOrHold: '12 smooth reps',
        instruction: 'Hold band wide with straight arms, take overhead and behind back without shrugging to counteract desk slouching.',
      },
      {
        name: "World's Greatest Stretch",
        focusJoint: 'Groin, Thoracic Spine, Hamstrings',
        repsOrHold: '5 reps per side',
        instruction: 'Lunge forward with elbow inside knee, then reach arm toward ceiling opening chest.',
      },
      {
        name: isSeniorOrJoint ? 'Box Supported Deep Squat Hold' : 'Full Deep Squat (Asian Squat) Hold',
        focusJoint: 'Ankle Dorsiflexion & Knee Cartilage',
        repsOrHold: '45–60 seconds',
        instruction: 'Sink into bottom squat keeping heels flat on floor. Push knees out with elbows to hydrate cartilage.',
      },
    ],
    jointSafetyNote: 'Mobility is essential: movement pumps nutrient-rich synovial fluid into cartilage that lacks direct blood supply.',
  };

  return {
    gym,
    running,
    walking,
    mobility,
  };
}
