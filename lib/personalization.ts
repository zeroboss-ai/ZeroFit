import {
  UserProfile,
  BMICategory,
  AgeGroup,
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

  // Automatically align goal with target weight if user set a lower or higher target
  let effectiveGoal = goal;
  if (targetWeightKg < weightKg - 0.5) {
    effectiveGoal = 'lose_fat';
  } else if (targetWeightKg > weightKg + 0.5) {
    effectiveGoal = 'gain_muscle';
  }

  // Caloric adjustment based on goal and BMI safety bounds
  let targetCalories = tdee;
  const safetyAdvice: string[] = [];

  // Goal adjustments
  if (effectiveGoal === 'lose_fat') {
    // Evidence-based 20-25% deficit below TDEE
    const deficitPercentage = bmiCategory === 'obese' || bmiCategory === 'overweight' ? 0.22 : 0.18;
    const deficitKcal = Math.max(500, Math.round(tdee * deficitPercentage));
    targetCalories = Math.round(tdee - deficitKcal);

    // Physiological ceiling for realistic, steady fat loss (avoids inflated 3,000+ kcal targets for 100kg users)
    const maxFatLossCap = gender === 'female' ? 1950 : 2350;
    if (targetCalories > maxFatLossCap) {
      targetCalories = maxFatLossCap;
    }
    const minFloor = gender === 'female' ? 1250 : 1500;
    if (targetCalories < minFloor) targetCalories = minFloor;
  } else if (effectiveGoal === 'gain_muscle') {
    // Lean surplus: 250-350 kcal
    const surplus = bmiCategory === 'underweight' ? 350 : 250;
    targetCalories = tdee + surplus;
  } else {
    targetCalories = tdee;
  }

  // Protein targets based on goal and bodyweight
  // Fat loss: 1.8-2.2g/kg (to preserve lean muscle mass during deficit via mTOR stimulus)
  // Muscle gain: 1.8-2.2g/kg
  // Health/Maintenance: 1.2-1.6g/kg
  let proteinPerKg = 1.4;
  if (effectiveGoal === 'lose_fat' || effectiveGoal === 'gain_muscle') {
    proteinPerKg = 1.8;
  }
  if (ageGroup === 'seniors') {
    // Seniors require slightly higher protein efficiency for muscle retention
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
    tdee,
    targetCalories,
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
  const { dietPreference, cuisinePreference, targetCalories, proteinGrams } = profile;

  // Regional options generator
  const isNorthIndian = cuisinePreference === 'north_indian';
  const isSouthIndian = cuisinePreference === 'south_indian';

  // Base structures customized by diet & cuisine
  if (dietPreference === 'veg') {
    return {
      title: `${isNorthIndian ? 'North Indian / Punjabi' : isSouthIndian ? 'South Indian' : 'Wholesome'} Vegetarian Plan`,
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
              name: '2 Stuffed Paneer/Besan Chilla with Mint Chutney OR High-Protein Sprouts Chaat',
              nameHi: '2 बेसन या पनीर चीला पुदीना चटनी के साथ या स्प्राउट्स चाट',
              namePa: '2 ਵੇਸਣ ਜਾਂ ਪਨੀਰ ਚੀਲਾ ਪੁਦੀਨੇ ਦੀ ਚਟਨੀ ਨਾਲ ਜਾਂ ਸਪ੍ਰਾਊਟਸ ਚਾਟ',
              portion: '2 chillas (approx 180g) + 2 tbsp chutney',
              calories: Math.round(targetCalories * 0.26),
              protein: Math.round(proteinGrams * 0.28),
              carbs: Math.round(profile.carbGrams * 0.24),
              fats: Math.round(profile.fatGrams * 0.26),
              alternatives: [
                'Tofu bhurji with 2 multigrain rotis',
                'Oats cooked in low-fat milk with pumpkin seeds',
              ],
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
          notes: 'High-fiber snack to curb hunger between meals.',
        },
        lunch: isNorthIndian
          ? {
              name: '2 Phulkas (Multigrain/Wheat) + 1 Cup Dal Tadka / Rajma + 1 Bowl Mixed Sabzi + Cucumber Salad',
              nameHi: '2 फुल्के + 1 कटोरी दाल/राजमा + 1 कटोरी मौसमी सब्ज़ी + सलाद',
              namePa: '2 ਫੁਲਕੇ + 1 ਕੌਲੀ ਦਾਲ/ਰਾਜਮਾ + 1 ਕੌਲੀ ਸਬਜ਼ੀ + ਖੀਰਾ ਸਲਾਦ',
              portion: '2 rotis + 150g dal + 100g sabzi + raw salad',
              calories: Math.round(targetCalories * 0.33),
              protein: Math.round(proteinGrams * 0.32),
              carbs: Math.round(profile.carbGrams * 0.33),
              fats: Math.round(profile.fatGrams * 0.3),
              alternatives: [
                '1 cup brown rice + Chole (chickpea curry) + cucumber raita',
                'Quinoa pulao with low-fat paneer cubes and broccoli',
              ],
              notes: 'Pairing legumes with grains provides a complete amino acid profile.',
            }
          : {
              name: '1 Cup Brown Rice / 2 Rotis + Sambar / Dal + Stir-Fried Greens (Poriyal) + Curd',
              nameHi: '1 कप ब्राउन राइस/रोटी + सांभर + पोरियाल सब्ज़ी + दही',
              namePa: '1 ਕੱਪ ਬ੍ਰਾਊਨ ਚੌਲ/ਰੋਟੀ + ਸਾਂਭਰ + ਹਰੀ ਸਬਜ਼ੀ + ਦਹੀਂ',
              portion: '1 cup cooked rice/2 rotis + 150g dal + 100g greens',
              calories: Math.round(targetCalories * 0.33),
              protein: Math.round(proteinGrams * 0.3),
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
          name: 'Grilled Low-Fat Paneer / Tofu Stir-Fry (150g) with Colorful Bell Peppers + 1 Small Roti / Soup',
          nameHi: 'ग्रिल्ड पनीर/टोफू शिमला मिर्च के साथ + 1 हल्की रोटी या सूप',
          namePa: 'ਭੁੰਨਿਆ ਪਨੀਰ/ਟੋਫੂ ਸ਼ਿਮਲਾ ਮਿਰਚਾਂ ਨਾਲ + 1 ਫੁਲਕਾ ਜਾਂ ਸੂਪ',
          portion: '150g paneer/tofu + veggies + 1 phulka',
          calories: Math.round(targetCalories * 0.26),
          protein: Math.round(proteinGrams * 0.28),
          carbs: Math.round(profile.carbGrams * 0.23),
          fats: Math.round(profile.fatGrams * 0.28),
          alternatives: [
            'Warm lentil and vegetable stew with crushed walnuts',
            'Moong dal khichdi with ghee tempering and roasted papad',
          ],
          notes: 'Light on carbs before sleeping to promote restorative digestion and human growth hormone release.',
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

  // Non-Veg / Eggetarian / Vegan fallback
  const isNonVeg = dietPreference === 'non_veg' || dietPreference === 'eggetarian';
  return {
    title: `${isNonVeg ? 'High-Protein' : 'Plant-Powered'} ${isNorthIndian ? 'North Indian' : 'Continental'} Plan`,
    totalCalories: targetCalories,
    totalProtein: proteinGrams,
    totalCarbs: profile.carbGrams,
    totalFats: profile.fatGrams,
    meals: {
      earlyMorning: {
        name: 'Warm Lemon Water + Soaked Walnuts & Chia Seeds',
        nameHi: 'गुनगुना नींबू पानी + भीगे अखरोट व चिया सीड्स',
        namePa: 'ਕੋਸਾ ਨਿੰਬੂ ਪਾਣੀ + ਭਿੱਜੇ ਅਖਰੋਟ ਅਤੇ ਚੀਆ ਬੀਜ',
        portion: '1 glass + handful',
        calories: 120,
        protein: 4,
        carbs: 4,
        fats: 9,
        alternatives: ['Apple cider vinegar in warm water', 'Green tea with ginger'],
      },
      breakfast: {
        name: isNonVeg
          ? '3 Whole Egg / White Omelette with Spinach & Mushrooms + 2 Slices Sourdough / Multigrain Toast'
          : 'High-Protein Tofu Scramble with Turmeric & Sourdough Toast',
        nameHi: isNonVeg ? '3 अंडों का ऑमलेट पालक-मशरूम के साथ + 2 मल्टीग्रेन टोस्ट' : 'मसाला टोफू भुर्जी + 2 मल्टीग्रेन टोस्ट',
        namePa: isNonVeg ? '3 ਆਂਡਿਆਂ ਦਾ ਆਮਲੇਟ ਪਾਲਕ-ਮਸ਼ਰੂਮ ਨਾਲ + 2 ਮਲਟੀਗ੍ਰੇਨ ਟੋਸਟ' : 'ਮਸਾਲਾ ਟੋਫੂ ਭੁਰਜੀ + 2 ਮਲਟੀਗ੍ਰੇਨ ਟੋਸਟ',
        portion: '3 eggs (or 150g tofu) + 2 toasts',
        calories: Math.round(targetCalories * 0.28),
        protein: Math.round(proteinGrams * 0.32),
        carbs: Math.round(profile.carbGrams * 0.25),
        fats: Math.round(profile.fatGrams * 0.28),
        alternatives: ['Protein pancake stack with Greek yogurt', 'Boiled eggs with sweet potato chaat'],
        notes: 'Optimal leucine threshold reached for muscle protein synthesis (MPS).',
      },
      midMorningSnack: {
        name: '1 Apple or Orange + 15 Almonds',
        nameHi: '1 सेब या संतरा + 15 बादाम',
        namePa: '1 ਸੇਬ ਜਾਂ ਸੰਤਰਾ + 15 ਬਦਾਮ',
        portion: '1 fruit + 15g almonds',
        calories: 150,
        protein: 4,
        carbs: 22,
        fats: 7,
        alternatives: ['Cucumber slices with hummus', 'Whey protein shake in water'],
      },
      lunch: {
        name: isNonVeg
          ? '180g Grilled Chicken Breast / Fish Curry + 1 Cup Steamed Basmati/Brown Rice + Steamed Broccoli & Greens'
          : '180g Soya Chunks Curry / Black Bean Bowl + 1 Cup Brown Rice + Tossed Salad',
        nameHi: isNonVeg ? '180g ग्रिल्ड चिकन / फिश करी + 1 कप चावल + उबली ब्रोकली' : '180g सोया चंक्स करी + 1 कप चावल + सलाद',
        namePa: isNonVeg ? '180g ਗ੍ਰਿਲਡ ਚਿਕਨ / ਮੱਛੀ ਕਰੀ + 1 ਕੱਪ ਚੌਲ + ਬ੍ਰੋਕਲੀ' : '180g ਸੋਇਆ ਚੰਕਸ ਕਰੀ + 1 ਕੱਪ ਚੌਲ + ਸਲਾਦ',
        portion: '180g lean meat/soya + 150g rice + salad',
        calories: Math.round(targetCalories * 0.33),
        protein: Math.round(proteinGrams * 0.36),
        carbs: Math.round(profile.carbGrams * 0.32),
        fats: Math.round(profile.fatGrams * 0.26),
        alternatives: ['Chicken tikka wrap with mint yogurt in whole wheat roti', 'Tuna salad with lime and olive oil'],
        notes: 'High bio-availability amino acids for tissue recovery.',
      },
      eveningSnack: {
        name: 'Whey / Plant Protein Scoop with Water or Buttermilk + 1 Rice Cake with Peanut Butter',
        nameHi: 'प्रोटीन शेक या छाछ + पीनट बटर राइस केक',
        namePa: 'ਪ੍ਰੋਟੀਨ ਸ਼ੇਕ ਜਾਂ ਲੱਸੀ + ਪੀਨਟ ਬਟਰ ਰਾਈਸ ਕੇਕ',
        portion: '1 scoop + 1 rice cake',
        calories: 180,
        protein: 26,
        carbs: 12,
        fats: 4,
        alternatives: ['Boiled egg whites with black pepper', 'Roasted chana with lemon juice'],
      },
      dinner: {
        name: isNonVeg
          ? 'Pan-Seared Salmon or Lemon Herb Chicken (150g) + Grilled Asparagus & Sweet Potato Mash'
          : 'Lentil & Chickpea Protein Bowl with Roasted Bell Peppers & Quinoa',
        nameHi: isNonVeg ? 'लेमन हर्ब चिकन / फिश + ग्रिल्ड सब्ज़ियां व शकरकंद' : 'क्विनोआ और चना प्रोटीन बाउल',
        namePa: isNonVeg ? 'ਲੈਮਨ ਹਰਬ ਚਿਕਨ / ਮੱਛੀ + ਭੁੰਨੀਆਂ ਸਬਜ਼ੀਆਂ' : 'ਕਵਿਨੋਆ ਅਤੇ ਛੋਲੇ ਪ੍ਰੋਟੀਨ ਬਾਊਲ',
        portion: '150g protein source + 150g roast veggies',
        calories: Math.round(targetCalories * 0.24),
        protein: Math.round(proteinGrams * 0.26),
        carbs: Math.round(profile.carbGrams * 0.21),
        fats: Math.round(profile.fatGrams * 0.25),
        alternatives: ['Clear chicken vegetable soup with sourdough crouton', 'Tofu & bok choy broth bowl'],
      },
    },
    hydrationTips: `Drink minimum ${profile.waterIntakeLiters}L fluids. Keep electrolyte levels optimal with pink salt or lemon water during workouts.`,
    cookingTips: [
      'Use an air-fryer or non-stick grill to cook meats with minimal added fats.',
      'Marinate poultry/fish with yogurt, lemon, ginger-garlic paste, and Indian spices for tender texture without calorie bloat.',
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

  const safetyNotes: string[] = [];
  if (isSeniorOrJoint) {
    safetyNotes.push('Low-Impact Mode Activated: Reduced spinal axial loading; controlled tempo with joint protection.');
    safetyNotes.push('Warm-up minimum 8–10 minutes: dynamic arm circles, hip openers, and ankle rotations.');
  }

  const schedule: WorkoutDay[] = [];

  if (days === 3 || isSeniorOrJoint) {
    // 3 Days Full Body (ideal for general health, seniors, beginners)
    schedule.push({
      dayNumber: 1,
      dayName: 'Day 1: Full Body Strength & Stability',
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
      dayName: 'Day 3: Conditioning, Core & Total Body Power',
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
  } else {
    // 4-Day Upper / Lower Split
    schedule.push({
      dayNumber: 1,
      dayName: 'Day 1: Upper Body Power',
      focus: 'Chest, Upper Back, Shoulders & Arms',
      cooldownNotes: 'Doorway chest stretch and band dislocations for shoulders',
      exercises: [
        {
          name: env === 'gym' ? 'Barbell / Dumbbell Bench Press' : 'Decline or Standard Push-ups',
          category: 'strength',
          targetMuscles: ['Chest', 'Triceps'],
          sets: 4,
          reps: '8-10',
          restSeconds: 90,
          notes: 'Retract scapula and drive feet into ground.',
          difficulty: diff,
        },
        {
          name: env === 'gym' ? 'Bent-Over Barbell or Dumbbell Row' : 'Inverted Row under Table / Heavy Band Rows',
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
      dayName: 'Day 2: Lower Body Power & Core',
      focus: 'Quads, Hamstrings, Calves & Deep Core',
      cooldownNotes: 'Couch stretch for hip flexors and seated forward fold',
      exercises: [
        {
          name: env === 'gym' ? 'Barbell Back Squat / Hack Squat' : 'Bulgarian Split Squats (Foot elevated)',
          category: 'strength',
          targetMuscles: ['Quads', 'Glutes'],
          sets: 4,
          reps: '8-10',
          restSeconds: 120,
          notes: 'Hit parallel depth with knees tracking over second toe.',
          difficulty: diff,
        },
        {
          name: env === 'gym' ? 'Romanian Deadlift (RDL)' : 'Single-Leg Romanian Deadlift (Bodyweight/Water bottle)',
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
          notes: 'Slight forward lean, raise arms in scapular plane (not straight out to sides).',
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
      dayName: 'Day 4: Lower Body Volume & Functional Posterior Chain',
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
          name: env === 'gym' ? 'Seated or Lying Leg Curl' : 'Slider Hamstring Curls (Towel on smooth floor)',
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

  return {
    id: `plan_${Date.now()}`,
    title: `${profile.age >= 50 ? 'Longevity & Joint-Safe' : 'Personalized'} ${env === 'gym' ? 'Gym' : 'Home'} Workout (${days}-Day Split)`,
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
