# Render Deployment Guide: Organic Farming (Demo Mode)

This platform is configured in **Demo Mode**, meaning it uses an in-memory database. No external database setup (like MongoDB Atlas) is required!

## Phase 1: Deploy to Render
1. Sign up/Login to [Render](https://render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub account and select the `organic-farming` repository.
4. **Configure the Web Service**:
   - **Name**: `organic-farming`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: `Free`

5. **Set Environment Variables**:
   Click the **Environment** tab and add:
   | Key | Value |
   |-----|-------|
   | `PORT` | `10000` |
   | `JWT_SECRET` | `organic_demo_secret_123` |
   | `NODE_ENV` | `production` |

6. Click **Create Web Service**.

## Phase 2: Live!
1. Your platform will be live at the URL provided by Render (e.g., `https://organic-farming.onrender.com`).
2. **Note**: Since this is a demo using memory storage, any data you create (new users, new orders) will be reset if the server restarts or stays inactive for too long.
3. **Pre-seeded data**: The platform comes pre-loaded with products and demo accounts.
   - **Admin**: `admin@organic.com` / `password`
   - **Farmer**: `farmer@organic.com` / `password`
   - **Customer**: `user@organic.com` / `password`

