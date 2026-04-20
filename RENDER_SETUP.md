# Render Deployment Guide: Organic Farming Platform

Follow these steps to deploy your platform from scratch to **Render.com**.

## Phase 1: Database Setup (MongoDB Atlas)
Since Render doesn't host databases, you need a free MongoDB cluster.
1. Sign up/Login to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a **Free Cluster** (M0).
3. Under **Network Access**, click "Add IP Address" and select **"Allow Access from Anywhere"** (0.0.0.0/0).
4. Under **Database User**, create a user with a username and password (keep these safe).
5. Click **Connect** -> **Drivers** -> **Node.js** and copy your **Connection String**.
   - It will look like: `mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority`

## Phase 2: Deploy to Render
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
   Click the **Environment** tab and add these secrets:
   | Key | Value |
   |-----|-------|
   | `PORT` | `10000` |
   | `MONGO_URI` | *Your MongoDB Atlas Connection String* |
   | `JWT_SECRET` | *Any random string* |
   | `JWT_EXPIRES_IN` | `30d` |
   | `NODE_ENV` | `production` |

6. Click **Create Web Service**.

## Phase 3: Finalizing
1. Once the build is complete, you will see a URL at the top (e.g., `https://organic-farming.onrender.com`).
2. **Seed the Database**: 
   - Use the **Shell** tab on Render and run:
     ```bash
     npm run seed
     ```
3. Your platform is now LIVE!
