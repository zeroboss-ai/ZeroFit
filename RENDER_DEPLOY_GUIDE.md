# 🚀 Deploying ZERO FIT to Render (Step-by-Step Guide)

Deploying **Zero FIT** to **Render** is the easiest and most reliable way to go live. Render runs a native Node.js server, meaning your database, Gemini AI, Next.js App Router, and authentication work with zero compatibility issues.

---

## 📋 Why Render is Ideal for Zero FIT:
- ✅ **Native Node.js Server**: Full support for MongoDB (Mongoose), JWT cookies, and Next.js 14 App Router.
- ✅ **API Key Security**: Your Google Gemini API key is safely hidden on the backend and never leaked to visitors.
- ✅ **Free SSL & Domain**: Free `https://zero-fit.onrender.com` domain with automated HTTPS.
- ✅ **Cloudflare Compatible**: You can easily point your custom domain (e.g. `zerofit.com`) through Cloudflare to your Render app for global CDN caching and DDoS protection.

---

## 🛠️ Step 1: Push Project to GitHub

Open a terminal or Command Prompt inside your project folder (`Zero FIT`):

```bash
git init
git add .
git commit -m "Zero FIT production release for Render"
git branch -M main
git remote add origin https://github.com/<YOUR_GITHUB_USERNAME>/zero-fit.git
git push -u origin main
```

*(Note: `.gitignore` is already configured in the folder, so `node_modules` and local cache files will be safely ignored).*

---

## ☁️ Step 2: Create a New Web Service on Render

1. Go to [dashboard.render.com](https://dashboard.render.com) and log in (you can sign in with GitHub).
2. Click the **+ New** button in the top right.
3. Select **Web Service**.
4. Click **Build and deploy from a Git repository** ➔ Click **Next**.
5. Connect your GitHub account and select your **`zero-fit`** repository.

---

## ⚙️ Step 3: Configure Settings

Render will ask for a few simple settings:

| Field | What to Enter |
| :--- | :--- |
| **Name** | `zero-fit` (or your company name) |
| **Region** | Select the closest region (e.g. `Singapore` for India/Asia, or `Oregon`/`Frankfurt`) |
| **Branch** | `main` |
| **Root Directory** | *(Leave blank)* |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Instance Type** | **Free** |

---

## 🔑 Step 4: Add Environment Variables

Scroll down to the **Environment Variables** section and click **Add Environment Variable**:

1. **`NODE_VERSION`**
   - Value: `20.17.0`
2. **`GEMINI_API_KEY`**
   - Value: `AQ.Ab8RN6L9FOq6GUt07_nxkoZAF0epj8seD3A8AZU74R0b2by20Q`
3. **`JWT_SECRET`**
   - Value: `zero_fit_production_jwt_secret_key_secure_2026`
4. **`MONGODB_URI`** *(Recommended)*
   - Value: *Your MongoDB Atlas connection string* (e.g. `mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/zerofit?retryWrites=true&w=majority`)
   - *(If left blank, the app will use its built-in store)*.

---

## 🚀 Step 5: Click "Deploy Web Service"

1. Click the **Deploy Web Service** button at the bottom.
2. Render will pull your GitHub repository, install dependencies, run the optimized Next.js build, and start the production server.
3. In ~2–3 minutes, your site will be live at:
   **`https://zero-fit.onrender.com`**

---

## 🌐 Step 6 (Optional): Connect Custom Domain & Cloudflare

Want your own custom domain like `zerofit.com` with Cloudflare's speed & DDoS shield?

1. In Render, go to your service ➔ **Settings** ➔ **Custom Domains**.
2. Click **Add Custom Domain** (e.g. `zerofit.com`).
3. In your **Cloudflare Dashboard**:
   - Add a `CNAME` record pointing `zerofit.com` to your Render address (`zero-fit.onrender.com`).
   - Turn **ON** the Cloudflare Orange Cloud icon (**Proxied**).
4. Now your visitors get the speed and DDoS protection of **Cloudflare**, backed by the reliability of **Render**!
