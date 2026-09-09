import { Article } from '@/types';

export const KNOWLEDGE_ARTICLES: Article[] = [
  {
    id: 'art_1',
    slug: 'macronutrients-micronutrients-guide',
    title: 'The Complete Guide to Macronutrients & Essential Micronutrients',
    titleHi: 'Macronutrients & Essential Micronutrients की Complete Guide',
    titlePa: 'Macronutrients & Essential Micronutrients ਦੀ Complete Guide',
    summary:
      'Understand how proteins, carbohydrates, healthy fats, vitamins, and minerals interact to power cellular energy, muscle protein synthesis, and hormone balance.',
    content: `## What Are Macronutrients?
Macronutrients are the nutrients your body requires in large daily amounts:
1. **Protein (4 kcal/g)**: The building blocks of life. Amino acids repair muscle tissue, produce enzymes, antibodies, and neurotransmitters. General needs range from 0.8g/kg for sedentary adults to 1.6–2.2g/kg for active athletes.
2. **Carbohydrates (4 kcal/g)**: Your central nervous system and muscles' preferred fuel source. Complex carbohydrates (oats, brown rice, whole wheat, millets) provide sustained glycogen without sharp insulin spikes.
3. **Dietary Fats (9 kcal/g)**: Crucial for steroid hormone production (testosterone, estrogen), cellular membrane integrity, and absorption of fat-soluble vitamins (A, D, E, K). Aim for 20–30% of total daily energy.

## Essential Micronutrients Often Lacking in Indian Diets
- **Vitamin D3 & B12**: Particularly low in indoor workers and pure vegetarians. B12 is essential for neurological function and red blood cell formation.
- **Iron & Calcium**: Women and adolescents must prioritize bioavailable iron (pairing leafy greens with vitamin C) and calcium for peak bone mass.
- **Magnesium & Zinc**: Vital for enzyme synthesis and deep sleep recovery.`,
    category: 'nutrition',
    ageGroups: ['teens', 'young_adults', 'mid_age', 'seniors'],
    goals: ['lose_fat', 'gain_muscle', 'maintain', 'general_health'],
    readTimeMinutes: 6,
    author: 'Zero FIT Clinical Nutrition Team',
    tags: ['Protein', 'Carbs', 'Fats', 'Vitamins', 'Bioavailability'],
    keyTakeaways: [
      'Protein is essential regardless of age; aim for at least 1.2–2.0g per kg depending on training activity.',
      'Do not eliminate dietary fats; healthy fats regulate hormones and joint fluid lubrication.',
      'Pair plant-based non-heme iron sources with Vitamin C (lemon juice, amla) to multiply absorption.',
    ],
    citations: [
      'Morton RW, et al. A systematic review and meta-analysis of protein supplementation. Br J Sports Med. 2018.',
      'Phillips SM. Dietary protein requirements and adaptive advantages in athletes. Br J Nutr. 2012.',
    ],
    createdAt: '2026-01-15',
  },
  {
    id: 'art_2',
    slug: 'punjabi-indian-high-protein-diet-guide',
    title: 'High-Protein Indian & Punjabi Diets: Roti, Dal, Paneer & Soya Done Right',
    titleHi: 'High-Protein Indian & Punjabi Diet: Roti, Dal, Paneer और Soya Done Right',
    titlePa: 'High-Protein Punjabi & Indian Diet: Roti, Dal, Paneer ਅਤੇ Soya Done Right',
    summary:
      'How to hit 100g–140g protein daily without relying on junk foods or giving up home-cooked Punjabi meals.',
    content: `## The Indian Dietary Dilemma
Traditional Indian thalis are often carb-heavy and fat-dense while lacking complete protein. A bowl of standard dal contains roughly 5–7g protein alongside 20g carbs. To build muscle or lose visceral body fat, we must rebalance the plate.

## Top High-Protein Vegetarian Staples
1. **Low-Fat Paneer & Chenna**: 100g provides ~18g protein. Making paneer from toned or double-toned milk drastically cuts saturated fat.
2. **Soya Chunks / Soya Granules**: 100g dry soya provides 52g protein with a complete amino acid profile. Soak in hot water with salt, squeeze thoroughly, and saute with onions and spices.
3. **Roasted Chana & Sattu**: 100g roasted black gram contains 20g protein and 17g fiber. A glass of savory sattu sharbat makes an excellent natural post-workout beverage.
4. **Greek Yogurt / Hung Curd**: Straining homemade dahi removes whey liquid, doubling protein density to ~10g per 100g.
5. **Multigrain / Protein Roti**: Blend whole wheat atta with 25% besan (chickpea flour) or sattu to increase protein and lower the glycemic index of every roti.

## For Non-Vegetarians & Eggetarians
- **Eggs**: 3 whole eggs + 2 egg whites yield 25g high-biological value protein.
- **Chicken Breast / Fish**: 150g grilled tandoori or lightly spiced chicken breast yields 45g pure protein with less than 3g fat.`,
    category: 'punjabi_indian',
    ageGroups: ['teens', 'young_adults', 'mid_age', 'seniors'],
    goals: ['lose_fat', 'gain_muscle', 'maintain', 'general_health'],
    readTimeMinutes: 7,
    author: 'Zero FIT Nutrition Lab',
    tags: ['Punjabi Diet', 'High Protein Veg', 'Paneer', 'Soya', 'Sattu'],
    keyTakeaways: [
      'Dal alone is an incomplete protein; combine legumes with grains (dal-chawal, rajma-roti) or add paneer/soya.',
      'Soya chunks do not raise estrogen in reasonable dietary amounts (30–50g daily is completely safe for men).',
      'Cut hidden calories by measuring cooking mustard/ghee with a spoon rather than free-pouring.',
    ],
    citations: [
      'Messina M. Soy and health update: evaluation of the clinical and epidemiologic literature. Nutrients. 2016.',
      'ICMR-NIN Dietary Guidelines for Indians. 2024.',
    ],
    createdAt: '2026-02-01',
  },
  {
    id: 'art_3',
    slug: 'weight-loss-calorie-deficit-science',
    title: 'The Science of Fat Loss: Calorie Deficit, Metabolism & Busting Myths',
    titleHi: 'Fat Loss Science: Calorie Deficit, Metabolism और Myths की Reality',
    titlePa: 'Fat Loss Science: Calorie Deficit, Metabolism ਅਤੇ Myths ਦੀ Reality',
    summary:
      'Learn why you cannot target belly fat specifically, how the first law of thermodynamics governs fat loss, and why extreme 800-calorie starvation diets destroy your metabolic rate.',
    content: `## The Immutable Law: Energy Balance
Fat tissue is stored chemical potential energy. To eliminate it, you must consistently expend more energy than you consume (Caloric Deficit). 

However, **extreme deficits (-1000 kcal) trigger metabolic adaptation**:
- Thyroid output (T3) down-regulates.
- Non-Exercise Activity Thermogenesis (NEAT) plummets (you subconsciously fidget, move, and walk less).
- Hunger hormones (Ghrelin) skyrocket, causing binge episodes.

## The Sustainable Protocol
1. Calculate your TDEE (Total Daily Energy Expenditure).
2. Create a modest, controlled deficit of **300 to 500 kcal per day**. This yields roughly 0.4kg to 0.7kg of pure fat loss per week without sacrificing lean muscle.
3. Keep protein high (1.6–2.0g/kg) to signal the body to preserve lean muscle tissue during the deficit.

## Common Fat Loss Myths Debunked
- **Myth: Warm lemon honey water burns belly fat.** Truth: It hydrates you and may delay breakfast, but does not oxidize fat molecules.
- **Myth: Carbs after 7 PM turn directly into fat.** Truth: Total 24-hour calorie balance dictates fat storage, not the clock.
- **Myth: Spot reduction works with 500 crunches.** Truth: You lose systemic fat genetically; crunches strengthen abdominal muscle underneath existing fat.`,
    category: 'fat_loss',
    ageGroups: ['teens', 'young_adults', 'mid_age', 'seniors'],
    goals: ['lose_fat', 'general_health'],
    readTimeMinutes: 5,
    author: 'Dr. R. Sharma, Sports Science Advisor',
    tags: ['Calorie Deficit', 'NEAT', 'Belly Fat', 'Metabolism'],
    keyTakeaways: [
      'A safe deficit of 350–500 kcal is superior to starvation diets for permanent fat loss.',
      'Strength training during fat loss prevents loose skin and sarcopenia.',
      'Prioritize 8,000–10,000 daily steps to keep daily NEAT energy expenditure elevated.',
    ],
    citations: [
      'Hall KD, et al. Maintenance of lost weight and long-term management of obesity. Med Clin North Am. 2018.',
      'Trexler ET, et al. Metabolic adaptation to weight loss: implications for the athlete. J Int Soc Sports Nutr. 2014.',
    ],
    createdAt: '2026-02-10',
  },
  {
    id: 'art_4',
    slug: 'muscle-hypertrophy-progressive-overload',
    title: 'Muscle Hypertrophy: Progressive Overload & Safe Strength Programming',
    titleHi: 'Muscle Hypertrophy: Progressive Overload और Safe Strength Training',
    titlePa: 'Muscle Hypertrophy: Progressive Overload ਅਤੇ Safe Strength Training',
    summary:
      'The definitive guide to muscle protein synthesis, mechanical tension, rep ranges, and training volume for natural lifters.',
    content: `## The Primary Driver of Growth: Mechanical Tension
Muscles do not grow from soreness or sweat; they grow when muscle fibers produce force against external resistance through a full active range of motion. This is called **mechanical tension**.

## What is Progressive Overload?
To keep growing, you must challenge muscles with greater stimulus over time:
- Adding 1–2 kg to the bar/dumbbell.
- Performing 1–2 more reps with the same weight.
- Improving execution control (e.g., 3-second eccentric tempo).
- Adding another working set per muscle group per week.

## Optimal Volume & Rep Ranges
- **Sets per muscle per week**: 10 to 20 quality working sets taken within 1–3 reps in reserve (RIR) from failure.
- **Rep Ranges**: Hypertrophy occurs equally between 6 and 30 reps, provided sets are taken close to muscular failure. 8–12 reps is the sweet spot for fatigue efficiency.
- **Frequency**: Hitting each muscle group twice per week (e.g., Upper/Lower or Push/Pull/Legs) produces superior protein synthesis compared to a once-a-week "bro split".`,
    category: 'muscle_gain',
    ageGroups: ['teens', 'young_adults', 'mid_age'],
    goals: ['gain_muscle'],
    readTimeMinutes: 6,
    author: 'Zero FIT Strength Coaches',
    tags: ['Hypertrophy', 'Progressive Overload', 'Reps in Reserve', 'Gym'],
    keyTakeaways: [
      'Log your weights and reps; you cannot progress what you do not measure.',
      'Leave 1 to 2 reps in the tank (RIR 1-2) on compound lifts like squats and deadlifts to protect spinal joints.',
      'Sleep and calorie surplus are non-negotiable for muscle tissue synthesis.',
    ],
    citations: [
      'Schoenfeld BJ, et al. Effects of resistance training frequency on measures of muscle hypertrophy. Sports Med. 2019.',
      'Helms ER, et al. Recommendations for natural bodybuilding contest preparation. J Sports Med Phys Fitness. 2015.',
    ],
    createdAt: '2026-02-18',
  },
  {
    id: 'art_5',
    slug: 'conditions-pcos-thyroid-diabetes-diet',
    title: 'Managing Chronic Conditions: Evidence-Based Nutrition for PCOS, Thyroid & Diabetes',
    titleHi: 'Health Conditions: PCOS, Thyroid और Diabetes के लिए Science-Based Nutrition',
    titlePa: 'Health Conditions: PCOS, Thyroid ਅਤੇ Diabetes ਲਈ Science-Based Nutrition',
    summary:
      'General educational insights on blood sugar stabilization, insulin sensitivity, hormonal health, and safe exercise pacing.',
    content: `## Medical Notice & Educational Boundaries
*This guide provides general lifestyle and nutritional education. It is not medical prescription or diagnosis. Always coordinate with your treating endocrinologist or physician.*

## 1. Type 2 Diabetes & Insulin Resistance
- **Glycemic Load Management**: Replace refined flour (maida), white bread, and sugary beverages with high-fiber grains (barley, oats, whole legumes).
- **Meal Sequencing**: Eat fibrous salad and protein first before touching starches. This blunts the glucose spike curve by up to 40%.
- **Post-Meal Walks**: A brisk 10-minute walk immediately after lunch and dinner uses GLUT-4 transporters to clear blood glucose without requiring excessive insulin.

## 2. Polycystic Ovary Syndrome (PCOS)
- Approximately 70% of women with PCOS suffer from underlying insulin resistance.
- Focus on anti-inflammatory fats (walnuts, flaxseeds, cold-pressed mustard oil) and adequate zinc.
- Resistance training is one of the most effective interventions for PCOS, dramatically increasing peripheral insulin sensitivity.

## 3. Hypothyroidism & Hashimoto's
- Avoid prolonged severe caloric restriction, which signals the liver to down-regulate deiodinase conversion of T4 into active T3.
- Ensure optimal selenium (Brazil nuts, sunflower seeds) and zinc levels.
- Cook cruciferous vegetables (cauliflower, cabbage) thoroughly to neutralize goitrogens.`,
    category: 'conditions',
    ageGroups: ['young_adults', 'mid_age', 'seniors'],
    goals: ['lose_fat', 'maintain', 'general_health'],
    readTimeMinutes: 8,
    author: 'Zero FIT Health Science Desk',
    tags: ['Diabetes', 'PCOS', 'Thyroid', 'Insulin Sensitivity', 'Hormones'],
    keyTakeaways: [
      'Never skip protein when dealing with insulin resistance.',
      'A 10-minute walk after meals is as effective as certain mild oral hypoglycemics for postprandial glucose management.',
      'Consult your physician before changing carbohydrate ratios if taking insulin or sulfonylureas.',
    ],
    citations: [
      'Colberg SR, et al. Exercise and Type 2 Diabetes: American College of Sports Medicine. Diabetes Care. 2016.',
      'Moran LJ, et al. Lifestyle changes in women with polycystic ovary syndrome. Cochrane Database Syst Rev. 2011.',
    ],
    createdAt: '2026-02-25',
  },
  {
    id: 'art_6',
    slug: 'supplements-guide-creatine-whey-safety',
    title: 'Supplements Decoded: What Works (Whey, Creatine, D3) & What Is Waste',
    titleHi: 'Supplements Decoded: Whey Protein, Creatine और Vitamin D3 की Safety Guide',
    titlePa: 'Supplements Decoded: Whey Protein, Creatine ਅਤੇ Vitamin D3 ਦੀ Safety Guide',
    summary:
      'Unbiased, scientific evaluation of fitness supplements. Discover the safety profile of Creatine Monohydrate and Whey Protein.',
    content: `## The Supplement Hierarchy
90% of your results come from food, sleep, and progressive training. Supplements only fill genuine nutritional gaps.

## 1. Whey Protein
- **What it is**: A natural byproduct of cheese making. High in branched-chain amino acids (leucine) with rapid digestion.
- **Safety**: Safe for healthy individuals. Does NOT cause kidney damage in people with normal renal function.
- **Who needs it**: Anyone struggling to meet their daily 1.4–2.0g/kg protein target through food alone.

## 2. Creatine Monohydrate
- **What it is**: The most researched ergogenic supplement in human history. Stored in muscles as phosphocreatine to rapidly regenerate ATP during explosive lifts.
- **Dose**: 3–5 grams daily at any consistent time. No loading phase or cycling required.
- **Safety**: Extremely safe across thousands of clinical trials. Does not cause hair loss (the dihydrotestosterone claim originated from a single flawed study in 2009 that was never replicated).

## 3. Micronutrient Essentials
- **Vitamin D3 (with K2)**: Critical for testosterone synthesis, immune defense, and calcium absorption.
- **Omega-3 Fish Oil / Algal Oil**: Reduces systemic inflammation, supports joint health and cognitive clarity.`,
    category: 'supplements',
    ageGroups: ['teens', 'young_adults', 'mid_age', 'seniors'],
    goals: ['lose_fat', 'gain_muscle', 'general_health'],
    readTimeMinutes: 6,
    author: 'Zero FIT Pharmacology Team',
    tags: ['Creatine', 'Whey Protein', 'Supplements', 'Safety', 'Vitamin D'],
    keyTakeaways: [
      'Creatine monohydrate is safe, affordable, and effective for both brain and muscle power.',
      'Whey is simply dehydrated dairy milk protein, not a chemical steroid.',
      'Avoid unregulated fat-burners and detox teas which often contain banned stimulants or harsh laxatives.',
    ],
    citations: [
      'Kreider RB, et al. International Society of Sports Nutrition position stand: safety and efficacy of creatine supplementation. J Int Soc Sports Nutr. 2017.',
      'Antonio J, et al. A high protein diet has no harmful effects: a one-year crossover study. J Nutr Metab. 2016.',
    ],
    createdAt: '2026-03-01',
  },
  {
    id: 'art_7',
    slug: 'mobility-joint-care-injury-prevention-45-plus',
    title: 'Longevity & Joint Care: Injury Prevention and Mobility for Ages 45+',
    titleHi: 'Mobility & Joint Care: 45+ Age के लिए Injury Prevention और Safe Exercises',
    titlePa: 'Mobility & Joint Care: 45+ Age ਲਈ Injury Prevention ਅਤੇ Safe Exercises',
    summary:
      'Protect your knees, hips, and lower back with joint-friendly exercise modifications, synovial fluid activation, and core bracing.',
    content: `## The Aging Joint: Synovial Fluid & Cartilage
As we age past 40, articular cartilage loses hydration and bone mineral density declines without mechanical load. The solution is not avoidance of exercise, but **smart movement selection**.

## Key Rules for Joint Longevity
1. **Never Skip Dynamic Warm-ups**: Warm synovial fluid lubricates joints like motor oil in an engine. Spend 8 minutes doing hip openers, cat-cow stretches, and shoulder dislocations before lifting.
2. **Substitutions for Knee Pain**:
   - Swap high-impact jump squats for slow-tempo Goblet Box Squats.
   - Swap running on hard concrete for incline treadmill walking or elliptical training.
3. **Protecting the Lumbar Spine**:
   - Master the hip hinge rather than rounding the lower back.
   - Use Romanian deadlifts with dumbbells or glute bridges instead of heavy barbell ground pulls if you have disc history.
4. **Scapular & Rotator Cuff Health**:
   - Add face pulls and band pull-aparts twice weekly to counteract desk-slouching and rounded shoulders.`,
    category: 'mobility',
    ageGroups: ['mid_age', 'seniors'],
    goals: ['maintain', 'general_health'],
    readTimeMinutes: 5,
    author: 'Dr. K. Patel, Orthopedic Physical Therapist',
    tags: ['Joint Health', 'Seniors', '45+ Fitness', 'Mobility', 'Knee Pain'],
    keyTakeaways: [
      'Movement is medicine for arthritic joints; resting completely stiffens joint capsules.',
      'Closed-chain exercises (squats, pushups) provide greater joint stability than open-chain machines.',
      'Adequate hydration (2.5L–3.5L) is required to maintain intervertebral disc and cartilage lubrication.',
    ],
    citations: [
      'Nelson ME, et al. Physical activity and public health in older adults: recommendation from ACSM and AHA. Circulation. 2007.',
      'American College of Sports Medicine. Exercise for older adults. 2021.',
    ],
    createdAt: '2026-03-02',
  },
  {
    id: 'art_8',
    slug: 'womens-fitness-cycle-syncing-postpartum',
    title: "Women's Fitness: Menstrual Cycle-Aware Training & Postpartum Recovery",
    titleHi: "Women's Fitness: Menstrual Cycle-Aware Training और Postpartum Recovery",
    titlePa: "Women's Fitness: Menstrual Cycle-Aware Training ਅਤੇ Postpartum Recovery",
    summary:
      'How fluctuating estrogen and progesterone affect strength, recovery, and metabolic flexibility across each phase of the female cycle.',
    content: `## Hormonal Architecture & The Cycle
A woman's physiology is not a smaller version of a man's. Hormonal shifts throughout the 28-day cycle influence energy, water retention, and ligament laxity.

## Phase-By-Phase Training Strategy
1. **Follicular Phase (Days 1–14)**:
   - Estrogen rises, increasing pain tolerance, insulin sensitivity, and recovery rate.
   - Ideal time for progressive overload, heavy strength lifts, and high-intensity intervals (HIIT).
2. **Ovulatory Window (Around Day 14)**:
   - Peak strength output. However, higher estrogen increases relaxin, making ligaments slightly more lax. Focus on strict exercise form.
3. **Luteal Phase (Days 15–28)**:
   - Progesterone dominates. Body temperature rises by ~0.5°C, metabolic rate increases slightly, and carb cravings may emerge.
   - Pivot toward steady-state cardio, moderate resistance volume, yoga, and mobility if energy wanes.

## Postpartum Safe Resumption
- Never rush into high-impact jumping or sit-ups postpartum.
- Focus first on pelvic floor activation, transverse abdominis breathing (preventing diastasis recti separation), and gentle walking.
- Seek medical clearance at the 6-week milestone before loading weights.`,
    category: 'womens_fitness',
    ageGroups: ['teens', 'young_adults', 'mid_age'],
    goals: ['lose_fat', 'gain_muscle', 'general_health'],
    readTimeMinutes: 7,
    author: 'Dr. Ananya Sen, Women’s Health Specialist',
    tags: ["Women's Fitness", 'Cycle Syncing', 'Postpartum', 'Pelvic Floor', 'Hormones'],
    keyTakeaways: [
      'Listen to your body in the late luteal phase; lower workout intensity is physiological, not a failure of willpower.',
      'Pelvic floor rehab must precede heavy abdominal crunches postpartum.',
      'Ensure adequate dietary iron during menstruation to prevent performance-sapping anemia.',
    ],
    citations: [
      'McNulty KL, et al. The effects of menstrual cycle phase on exercise performance in eumenorrheic women. Sports Med. 2020.',
      'De Souza MJ, et al. Female athlete triad coalition consensus statement. Br J Sports Med. 2014.',
    ],
    createdAt: '2026-03-03',
  },
  {
    id: 'art_9',
    slug: 'hydration-sleep-recovery-science',
    title: 'Sleep & Hydration: The Invisible Anabolic Drivers of Fat Loss & Muscle Repair',
    titleHi: 'Sleep & Hydration: Fat Loss और Muscle Recovery के Invisible Drivers',
    titlePa: 'Sleep & Hydration: Fat Loss ਅਤੇ Muscle Recovery ਦੇ Invisible Drivers',
    summary:
      'Why 6 hours of sleep cuts fat loss by 55%, how dehydration drops physical strength by 15%, and practical tips for deep restorative slow-wave sleep.',
    content: `## The Catabolic Danger of Sleep Deprivation
You do not build muscle in the gym; you break muscle down in the gym. You build muscle in your bed while sleeping.

During Stage 3 Slow-Wave Non-REM sleep:
- **Human Growth Hormone (HGH)** surges, repairing micro-tears in muscle tissue.
- **Cortisol** resets to healthy baseline levels.
- Chronic restriction (< 7 hours) shifts weight loss from fat to lean muscle mass while spiking ghrelin (the hunger hormone) by up to 24%.

## Hydration Architecture
- Muscle tissue is roughly 75% water. A mere **2% drop in body water content leads to a 10–15% decline in power output and workout stamina**.
- Drink 35ml per kilogram of body weight as a baseline.
- Add pink Himalayan salt or coconut water during intense summer training to replenish lost sodium and potassium.

## Sleep Hygiene Checklist
1. Keep the bedroom cool (18–21°C).
2. Eliminate blue light screens 60 minutes before bedtime or use night mode.
3. Stop caffeine consumption 8 hours before target sleep time.`,
    category: 'hydration_sleep',
    ageGroups: ['teens', 'young_adults', 'mid_age', 'seniors'],
    goals: ['lose_fat', 'gain_muscle', 'maintain', 'general_health'],
    readTimeMinutes: 5,
    author: 'Zero FIT Sleep & Recovery Lab',
    tags: ['Sleep', 'Hydration', 'Cortisol', 'HGH', 'Recovery'],
    keyTakeaways: [
      'Sleeping under 7 hours sabotages fat loss and elevates cravings for sugary junk food.',
      'Weigh yourself before and after heavy sweat sessions; replace each lost kg with 1.2L of water.',
      'Magnesium glycinate (200–300mg) before bed can support muscle relaxation.',
    ],
    citations: [
      'Nedeltcheva AV, et al. Insufficient sleep undermines dietary efforts to reduce adiposity. Ann Intern Med. 2010.',
      'Judelson DA, et al. Effect of hydration state on resistance exercise-induced endocrine markers. J Appl Physiol. 2008.',
    ],
    createdAt: '2026-03-04',
  },
];
