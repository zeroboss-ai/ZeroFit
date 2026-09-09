# 🚀 Deploying ZERO FIT to Cloudflare Pages (Step-by-Step Guide)

This guide walks you through deploying **Zero FIT** to **Cloudflare Pages** with full Next.js 14 support, Google Gemini AI, and MongoDB persistence.

---

## 📋 Prerequisites
1. A free [Cloudflare Account](https://dash.cloudflare.com).
2. A free [GitHub](https://github.com) account with your Zero FIT code pushed to a repository.
3. A free [MongoDB Atlas](https://www.mongodb.com/atlas) database cluster (or any MongoDB connection string) for persistent multi-region user data.

---

## 🛠️ Step 1: Push Code to GitHub

If you haven't pushed this folder to GitHub yet:
```bash
git init
git add .
git commit -m "Zero FIT production ready for Cloudflare Pages"
git branch -M main
git remote add origin https://github.com/<YOUR_USERNAME>/zero-fit.git
git push -u origin main
```

---

## ☁️ Step 2: Create a Cloudflare Pages Project

1. Log in to the [Cloudflare Dashboard](https://dash.cloudflare.com).
2. In the left sidebar, click **Workers & Pages**.
3. Click the **Create Application** button.
4. Select the **Pages** tab and click **Connect to Git**.
5. Select your GitHub account and choose your `zero-fit` repository.
6. Click **Begin setup**.

---

## ⚙️ Step 3: Configure Build Settings

Fill in the project setup form with these exact settings:

| Setting | Value |
| :--- | :--- |
| **Project name** | `zero-fit` (or your preferred name) |
| **Production branch** | `main` |
| **Framework preset** | `Next.js` |
| **Build command** | `npx @opennextjs/cloudflare build` |
| **Build output directory** | `.vercel/output/static` |
| **Root directory** | `/` (leave empty or slash) |

---

## 🔑 Step 4: Add Environment Variables

Before clicking Deploy, expand **Environment variables (advanced)** and add the following keys:

1. **`NODE_VERSION`**
   - Value: `20.17.0`
2. **`GEMINI_API_KEY`**
   - Value: `AQ.Ab8RN6L9FOq6GUt07_nxkoZAF0epj8seD3A8AZU74R0b2by20Q`
3. **`JWT_SECRET`**
   - Value: `zero_fit_production_jwt_secret_key_secure_2026` (or any random string)
4. **`MONGODB_URI`** *(Recommended)*
   - Value: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/zerofit?retryWrites=true&w=majority`
   - *(Note: Cloudflare Pages runs across 300+ global edge locations. A cloud database like MongoDB Atlas ensures your users' accounts and check-in logs persist everywhere).*

---

## ⚡ Step 5: Enable Node.js Compatibility Flag

1. Once the project is created, navigate to **Settings** > **Functions**.
2. Scroll to **Compatibility flags**.
3. Ensure the flag **`nodejs_compat`** is added for both **Production** and **Preview**.
4. Set the **Compatibility date** to `2024-09-23` or later.
5. Save changes.

---

## 🌐 Step 6: Deploy & Add Custom Domain

1. Click **Save and Deploy**. Cloudflare Pages will build and deploy your site in ~1–2 minutes.
2. Once complete, you will receive a free `https://zero-fit.pages.dev` URL.
3. **Custom Domain**:
   - In your project, go to the **Custom domains** tab.
   - Click **Set up a custom domain** (e.g. `zerofit.com` or `app.zerofit.com`).
   - Cloudflare will automatically provision a free SSL certificate and activate DDoS & WAF edge protection.

---

## ✅ Verification Checklist
- [x] VIP Demo Login button removed (clean production email/password login).
- [x] Next.js 14 build verified (`npm run build` exit code 0).
- [x] `wrangler.toml` pre-configured in project root.
- [x] Gemini API key configured for live activity & meal analysis.
