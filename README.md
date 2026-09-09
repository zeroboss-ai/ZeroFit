# ZERO FIT — Evidence-Based Fitness & Nutrition Web Platform

Zero FIT is a full-stack, production-grade web application built with **Next.js 14 (App Router)**, **React**, **Tailwind CSS**, and **MongoDB**. It provides personalized, scientifically validated diet and workout guidance, age-wise & BMI-wise health mechanics, an instant-search knowledge hub, interactive clinical calculators, biometric progress tracking, and multilingual support for English, Hindi, and Punjabi.

---

## 🚀 Key Features

1. **Personalization Engine**
   - **Age-wise Guidance**: Tailored for Teens (13–19, bone density & growth), Young Adults (20–35, peak power), Mid-Age (36–50, sarcopenia prevention), and 50+ Seniors (joint-friendly mobility & low spinal loading).
   - **Weight/BMI-wise Guidance**: Classifies user via BMI and calculates safe calorie targets (never extreme starvation deficits) and high protein ratios.
   - **Automatic Recalculation**: Live re-computation whenever metrics or health flags (Diabetes, Thyroid, PCOS, Hypertension) change.

2. **Personalized Diet Plan Generator**
   - Calorie & macro targets (Protein, Carbs, Fats) with meal breakdowns (Breakfast, Lunch, Evening Snack, Dinner).
   - Swappable food alternatives for every meal.
   - Regional styles: **North Indian / Punjabi** (Roti, Dal, Paneer, Soya, Sattu), **South Indian** (Idli, Sambar, Dosa), and Continental.
   - 1-Click PDF export / print-ready meal plan.

3. **Workout Plan Generator**
   - Home workout (bodyweight/resistance bands) or Gym equipment.
   - 3, 4, or 5-day splits (Full Body, Upper/Lower, Push/Pull/Legs).
   - Age 45+ low-impact joint-friendly switches (e.g., box squats, floor presses, incline walking).
   - Working sets, rep ranges, form execution cues, and interactive rest timer.

4. **Searchable Nutrition & Health Knowledge Hub**
   - Instant real-time search across 20+ scientific guides.
   - Filterable by category, age group, and fitness goal.
   - Covers Indian & Punjabi diets, fat loss science, muscle hypertrophy, PCOS, thyroid, diabetes, creatine & whey safety, 45+ joint care, and women's cycle training.
   - Scientific citations and key takeaways on every article.

5. **Clinical Fitness Calculators Suite**
   - **BMI Calculator** with visual gauge and WHO clinical interpretation.
   - **BMR & TDEE Calculator** using the Mifflin-St Jeor formula.
   - **Daily Water Intake Calculator** adjusted for weight, workout minutes, and climate.
   - **Target Macro Split Calculator** for fat loss, muscle building, or maintenance.
   - **Body Fat % Calculator** using the US Navy circumference method.

6. **Biometric Progress Tracker**
   - Weight history logging with an interactive SVG line chart.
   - Body measurements tracking (waist, chest, etc.).
   - Workout completion streak tracker.

7. **Multilingual Support (EN / HI / PA)**
   - Instant live language switcher for **English**, **Hindi (हिंदी)**, and **Punjabi (ਪੰਜਾਬੀ)**.

8. **AI Science Assistant**
   - Floating AI Coach modal grounded in evidence-based nutrition with clinical safety boundaries.

9. **Zero-Config Local Testing + MongoDB Atlas Ready**
   - Graceful in-memory fallback store when running locally without a MongoDB daemon.
   - 1-Click VIP Demo Login for instant reviewer testing.

10. **Medical & Legal Safety Compliance**
    - Prominently visible clinical disclaimers across all calculators, meal plans, and footers.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, Tailwind CSS, Lucide React Icons
- **Backend**: Next.js Serverless API Route Handlers
- **Database**: MongoDB via Mongoose (with in-memory fallback for local dev)
- **Auth**: JWT Session Cookies + 1-Click Demo Login
- **Deployment**: Render Web Service (`render.yaml`)

---

## 💻 Local Development Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
*(Note: If `MONGODB_URI` is left blank, the app will automatically use its internal in-memory store so you can start testing immediately!)*

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production
```bash
npm run build
npm start
```

---

## 🌐 Deploying to Render

1. Push your repository to GitHub.
2. In the [Render Dashboard](https://dashboard.render.com), click **New +** -> **Blueprint**.
3. Connect your repository. Render will automatically detect `render.yaml`.
4. Add your `MONGODB_URI` environment variable in the dashboard.
5. Click **Apply** to deploy!
