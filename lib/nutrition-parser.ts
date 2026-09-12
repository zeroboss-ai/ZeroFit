/**
 * ZeroFIT Clinical Sports-Science Nutrition & Physical Activity Parser
 * Accurately parses natural language food logs (quantities, Indian & global dishes)
 * and exercise logs (METs, durations, reps, steps).
 */

export interface ParsedFoodItem {
  item: string;
  portion: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface ParsedActivityItem {
  name: string;
  durationOrMetric: string;
  caloriesBurned: number;
}

interface FoodReference {
  keywords: string[];
  unitName: string;
  defaultQty: number;
  calsPerUnit: number;
  proteinPerUnit: number;
  carbsPerUnit: number;
  fatsPerUnit: number;
}

const FOOD_DATABASE: FoodReference[] = [
  {
    keywords: ['aloo paratha', 'alu paratha', 'stuffed paratha'],
    unitName: 'paratha',
    defaultQty: 1,
    calsPerUnit: 280,
    proteinPerUnit: 5.5,
    carbsPerUnit: 38,
    fatsPerUnit: 12,
  },
  {
    keywords: ['paratha', 'plain paratha'],
    unitName: 'paratha',
    defaultQty: 1,
    calsPerUnit: 230,
    proteinPerUnit: 4.5,
    carbsPerUnit: 30,
    fatsPerUnit: 10,
  },
  {
    keywords: ['roti', 'chapati', 'phulka', 'fulka'],
    unitName: 'roti',
    defaultQty: 1,
    calsPerUnit: 110,
    proteinPerUnit: 3.5,
    carbsPerUnit: 22,
    fatsPerUnit: 1.5,
  },
  {
    keywords: ['grilled chicken', 'chicken breast', 'boiled chicken'],
    unitName: '100g',
    defaultQty: 1, // multiplier of 100g
    calsPerUnit: 165,
    proteinPerUnit: 31,
    carbsPerUnit: 0,
    fatsPerUnit: 3.6,
  },
  {
    keywords: ['chicken curry', 'butter chicken', 'chicken tikka', 'chicken'],
    unitName: 'serving',
    defaultQty: 1,
    calsPerUnit: 260,
    proteinPerUnit: 26,
    carbsPerUnit: 6,
    fatsPerUnit: 14,
  },
  {
    keywords: ['whey protein', 'protein powder', 'whey', 'protein scoop', 'scoop whey'],
    unitName: 'scoop',
    defaultQty: 1,
    calsPerUnit: 125,
    proteinPerUnit: 24,
    carbsPerUnit: 2.5,
    fatsPerUnit: 1.5,
  },
  {
    keywords: ['greek yogurt', 'hung curd', 'protein curd'],
    unitName: 'serving (150g)',
    defaultQty: 1,
    calsPerUnit: 135,
    proteinPerUnit: 16,
    carbsPerUnit: 6,
    fatsPerUnit: 4.5,
  },
  {
    keywords: ['curd', 'dahi', 'plain yogurt'],
    unitName: 'bowl (150g)',
    defaultQty: 1,
    calsPerUnit: 110,
    proteinPerUnit: 5,
    carbsPerUnit: 7,
    fatsPerUnit: 6.5,
  },
  {
    keywords: ['almonds', 'badam', 'nuts'],
    unitName: 'handful (20g)',
    defaultQty: 1,
    calsPerUnit: 125,
    proteinPerUnit: 4.5,
    carbsPerUnit: 4.5,
    fatsPerUnit: 10.5,
  },
  {
    keywords: ['dal tadka', 'dal makhani', 'moong dal', 'chana dal', 'toor dal', 'yellow dal', 'dal'],
    unitName: 'bowl',
    defaultQty: 1,
    calsPerUnit: 175,
    proteinPerUnit: 9,
    carbsPerUnit: 24,
    fatsPerUnit: 5,
  },
  {
    keywords: ['paneer bhurji', 'paneer'],
    unitName: '100g serving',
    defaultQty: 1,
    calsPerUnit: 265,
    proteinPerUnit: 18,
    carbsPerUnit: 4,
    fatsPerUnit: 20,
  },
  {
    keywords: ['soya bhurji', 'soya chunks', 'soya', 'meal maker'],
    unitName: '50g serving',
    defaultQty: 1,
    calsPerUnit: 170,
    proteinPerUnit: 26,
    carbsPerUnit: 16,
    fatsPerUnit: 0.5,
  },
  {
    keywords: ['egg white', 'boiled egg white'],
    unitName: 'white',
    defaultQty: 1,
    calsPerUnit: 17,
    proteinPerUnit: 3.8,
    carbsPerUnit: 0.2,
    fatsPerUnit: 0.1,
  },
  {
    keywords: ['egg', 'boiled egg', 'scrambled egg', 'omelette', 'half fry'],
    unitName: 'egg',
    defaultQty: 1,
    calsPerUnit: 78,
    proteinPerUnit: 6.5,
    carbsPerUnit: 0.6,
    fatsPerUnit: 5.3,
  },
  {
    keywords: ['cup tea', 'cups tea', 'tea', 'chai', 'milk tea'],
    unitName: 'cup',
    defaultQty: 1,
    calsPerUnit: 65,
    proteinPerUnit: 1.5,
    carbsPerUnit: 10,
    fatsPerUnit: 2,
  },
  {
    keywords: ['coffee', 'cappuccino', 'latte', 'cold coffee'],
    unitName: 'cup',
    defaultQty: 1,
    calsPerUnit: 85,
    proteinPerUnit: 2,
    carbsPerUnit: 12,
    fatsPerUnit: 2.5,
  },
  {
    keywords: ['steamed rice', 'brown rice', 'white rice', 'rice', 'chawal'],
    unitName: 'bowl (150g)',
    defaultQty: 1,
    calsPerUnit: 195,
    proteinPerUnit: 4,
    carbsPerUnit: 43,
    fatsPerUnit: 0.5,
  },
  {
    keywords: ['banana', 'kela'],
    unitName: 'banana',
    defaultQty: 1,
    calsPerUnit: 105,
    proteinPerUnit: 1.3,
    carbsPerUnit: 27,
    fatsPerUnit: 0.3,
  },
  {
    keywords: ['apple', 'seb'],
    unitName: 'apple',
    defaultQty: 1,
    calsPerUnit: 95,
    proteinPerUnit: 0.5,
    carbsPerUnit: 25,
    fatsPerUnit: 0.3,
  },
  {
    keywords: ['milk', 'doodh'],
    unitName: 'glass (250ml)',
    defaultQty: 1,
    calsPerUnit: 155,
    proteinPerUnit: 8,
    carbsPerUnit: 12,
    fatsPerUnit: 8,
  },
  {
    keywords: ['oats', 'oatmeal'],
    unitName: 'bowl (50g)',
    defaultQty: 1,
    calsPerUnit: 190,
    proteinPerUnit: 6.5,
    carbsPerUnit: 33,
    fatsPerUnit: 3.5,
  },
  {
    keywords: ['sabzi', 'subzi', 'mix veg', 'bhindi', 'gobi'],
    unitName: 'bowl',
    defaultQty: 1,
    calsPerUnit: 130,
    proteinPerUnit: 3,
    carbsPerUnit: 14,
    fatsPerUnit: 7,
  },
  {
    keywords: ['salad', 'green salad', 'sprouts salad', 'sprouts'],
    unitName: 'bowl',
    defaultQty: 1,
    calsPerUnit: 60,
    proteinPerUnit: 3,
    carbsPerUnit: 10,
    fatsPerUnit: 0.5,
  },
  {
    keywords: ['samosa'],
    unitName: 'piece',
    defaultQty: 1,
    calsPerUnit: 260,
    proteinPerUnit: 4,
    carbsPerUnit: 32,
    fatsPerUnit: 14,
  },
  {
    keywords: ['pizza'],
    unitName: 'slice',
    defaultQty: 1,
    calsPerUnit: 280,
    proteinPerUnit: 12,
    carbsPerUnit: 32,
    fatsPerUnit: 11,
  },
  {
    keywords: ['burger'],
    unitName: 'piece',
    defaultQty: 1,
    calsPerUnit: 450,
    proteinPerUnit: 18,
    carbsPerUnit: 45,
    fatsPerUnit: 22,
  },
  {
    keywords: ['biryani', 'chicken biryani', 'mutton biryani'],
    unitName: 'plate',
    defaultQty: 1,
    calsPerUnit: 550,
    proteinPerUnit: 24,
    carbsPerUnit: 65,
    fatsPerUnit: 22,
  },
];

/**
 * Parses user free-text food logs into distinct items with quantities and macros
 */
export function parseFoodIntake(rawText: string): {
  items: ParsedFoodItem[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
} {
  if (!rawText || !rawText.trim()) {
    return { items: [], totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFats: 0 };
  }

  // Split by comma, newlines, or plus (+) signs
  const rawSegments = rawText
    .split(/[,+\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1);

  const parsedItems: ParsedFoodItem[] = [];
  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFats = 0;

  for (const segment of rawSegments) {
    const lower = segment.toLowerCase();

    // 1. Detect quantity like "12 Roti", "200g Grilled Chicken", "5 cup tea", "1 Scoop Whey", "6 Aloo Parathas"
    let qty = 1;
    let unitDesc = '';

    // Check for gram patterns like "200g" or "150 grams"
    const gramMatch = lower.match(/(\d+)\s*(g|grams|gm)/);
    // Check for counts like "12 roti", "6 aloo", "5 cup"
    const countMatch = lower.match(/^(\d+)\s+/);

    // 2. Find matching food in database (longest keyword match wins)
    let matchedFood: FoodReference | null = null;
    let matchedKw = '';

    for (const food of FOOD_DATABASE) {
      for (const kw of food.keywords) {
        if (lower.includes(kw)) {
          if (!matchedKw || kw.length > matchedKw.length) {
            matchedFood = food;
            matchedKw = kw;
          }
        }
      }
    }

    if (matchedFood) {
      if (gramMatch && (matchedFood.unitName.includes('100g') || matchedFood.unitName.includes('serving'))) {
        const grams = parseFloat(gramMatch[1]);
        qty = grams / 100;
        unitDesc = `${grams}g`;
      } else if (countMatch) {
        qty = parseFloat(countMatch[1]);
        unitDesc = `${qty} ${matchedFood.unitName}${qty > 1 ? 's' : ''}`;
      } else {
        qty = matchedFood.defaultQty;
        unitDesc = `1 ${matchedFood.unitName}`;
      }

      const itemCalories = Math.round(matchedFood.calsPerUnit * qty);
      const itemProtein = Math.round(matchedFood.proteinPerUnit * qty);
      const itemCarbs = Math.round(matchedFood.carbsPerUnit * qty);
      const itemFats = Math.round(matchedFood.fatsPerUnit * qty);

      parsedItems.push({
        item: segment,
        portion: unitDesc,
        calories: itemCalories,
        protein: itemProtein,
        carbs: itemCarbs,
        fats: itemFats,
      });

      totalCalories += itemCalories;
      totalProtein += itemProtein;
      totalCarbs += itemCarbs;
      totalFats += itemFats;
    } else {
      // Unrecognized dish fallback
      const cals = countMatch ? parseInt(countMatch[1]) * 150 : 200;
      parsedItems.push({
        item: segment,
        portion: 'Standard Serving',
        calories: cals,
        protein: 8,
        carbs: 22,
        fats: 6,
      });
      totalCalories += cals;
      totalProtein += 8;
      totalCarbs += 22;
      totalFats += 6;
    }
  }

  return {
    items: parsedItems,
    totalCalories,
    totalProtein,
    totalCarbs,
    totalFats,
  };
}

/**
 * Parses user physical activity logs and calculates sports-science MET calorie burn
 */
export function parsePhysicalActivity(
  rawText: string,
  userWeightKg: number = 75
): {
  items: ParsedActivityItem[];
  totalBurn: number;
} {
  if (!rawText || !rawText.trim()) {
    return { items: [], totalBurn: 0 };
  }

  const segments = rawText
    .split(/[,+\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 1);

  const items: ParsedActivityItem[] = [];
  let totalBurn = 0;

  for (const seg of segments) {
    const lower = seg.toLowerCase();
    const durationMatch = lower.match(/(\d+)\s*(m|min|mins|minutes|h|hr|hours)/);
    let mins = 30;
    if (durationMatch) {
      const val = parseInt(durationMatch[1]);
      const unit = durationMatch[2];
      mins = unit.startsWith('h') ? val * 60 : val;
    }

    const stepMatch = lower.match(/([\d,]+)\s*steps/);

    if (stepMatch) {
      const steps = parseInt(stepMatch[1].replace(/,/g, ''));
      // ~0.045 kcal per step for ~80kg body
      const burn = Math.round(steps * 0.045 * (userWeightKg / 80));
      items.push({
        name: seg,
        durationOrMetric: `${steps.toLocaleString()} steps`,
        caloriesBurned: burn,
      });
      totalBurn += burn;
    } else if (lower.includes('gym') || lower.includes('push') || lower.includes('pull') || lower.includes('leg') || lower.includes('lift') || lower.includes('chest')) {
      // Resistance training MET ~ 6.0
      const burn = Math.round((6.0 * 3.5 * userWeightKg / 200) * mins);
      items.push({
        name: seg,
        durationOrMetric: `${mins} mins`,
        caloriesBurned: burn,
      });
      totalBurn += burn;
    } else if (lower.includes('run') || lower.includes('jog')) {
      // Running MET ~ 8.5
      const burn = Math.round((8.5 * 3.5 * userWeightKg / 200) * mins);
      items.push({
        name: seg,
        durationOrMetric: `${mins} mins`,
        caloriesBurned: burn,
      });
      totalBurn += burn;
    } else if (lower.includes('home workout') || lower.includes('bodyweight') || lower.includes('hiit')) {
      // Bodyweight / HIIT MET ~ 5.5
      const burn = Math.round((5.5 * 3.5 * userWeightKg / 200) * mins);
      items.push({
        name: seg,
        durationOrMetric: `${mins} mins`,
        caloriesBurned: burn,
      });
      totalBurn += burn;
    } else if (lower.includes('walk')) {
      // Brisk walk MET ~ 3.5
      const burn = Math.round((3.5 * 3.5 * userWeightKg / 200) * mins);
      items.push({
        name: seg,
        durationOrMetric: `${mins} mins`,
        caloriesBurned: burn,
      });
      totalBurn += burn;
    } else if (lower.includes('mobility') || lower.includes('stretch') || lower.includes('yoga')) {
      // Mobility MET ~ 2.5
      const burn = Math.round((2.5 * 3.5 * userWeightKg / 200) * mins);
      items.push({
        name: seg,
        durationOrMetric: `${mins} mins`,
        caloriesBurned: burn,
      });
      totalBurn += burn;
    } else {
      // Generic exercise
      const burn = Math.round((4.0 * 3.5 * userWeightKg / 200) * mins);
      items.push({
        name: seg,
        durationOrMetric: `${mins} mins`,
        caloriesBurned: burn,
      });
      totalBurn += burn;
    }
  }

  return { items, totalBurn };
}
