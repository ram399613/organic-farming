# 🚀 Deployment Guide: Organic Connect

Follow these steps to take your platform from local to live.

## 1. Setup MongoDB Atlas (Database)
1.  **Log in** to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2.  **Create a Cluster**: Use the Free Tier (Shared).
3.  **Database Access**: Create a user with a username and password. **Important: Remember these!**
4.  **Network Access**: Click "Add IP Address" and select **"Allow Access from Anywhere"** (0.0.0.0/0) so Render can connect.
5.  **Connection String**:
    - Click **Database** -> **Connect** -> **Drivers**.
    - Copy the connection string. It looks like: `mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    - Replace `<password>` with your database user password.

## 2. Push to GitHub
1.  **Initialize Git** (if not already): `git init`
2.  **Add files**: `git add .`
3.  **Commit**: `git commit -m "Prepare for deployment"`
4.  **Create Repository**: Create a new repo on GitHub named `organic-farming`.
5.  **Push**:
    ```bash
    git remote add origin https://github.com/ram399613/organic-farming.git
    git branch -M main
    git push -u origin main
    ```

## 3. Deploy to Render
1.  **Log in** to [Render.com](https://render.com).
2.  **New Web Service**: Click **New +** -> **Web Service**.
3.  **Connect GitHub**: Select your `organic-farming` repository.
4.  **Configure Service**:
    - **Name**: `organic-farming`
    - **Region**: Select the one closest to you.
    - **Runtime**: `Node`
    - **Build Command**: `npm install`
    - **Start Command**: `npm start`
5.  **Add Environment Variables**:
    - Click **Advanced** -> **Add Environment Variable**.
    - `MONGO_URI`: (Your MongoDB Atlas string from Step 1)
    - `JWT_SECRET`: (A random strong string, e.g., `OrganicConnect2024!`)
    - `JWT_EXPIRES_IN`: `30d`
    - `NODE_ENV`: `production`

## 4. Final Verification
1.  Once Render finishes deploying, it will give you a **Live URL** (e.g., `https://organic-farming.onrender.com`).
2.  Open the URL.
3.  **Seed the Database**: Since your database is new, you need to seed it once.
    - Go to the Render Dashboard.
    - Click **Shell** in the left sidebar.
    - Run: `npm run seed`
    - This will populate your live database with the default products and admin account.

## 🔑 Default Credentials (After Seeding)
- **Admin**: `admin@organic.com` / `password`
- **Farmer**: `farmer@organic.com` / `password`
- **Customer**: `user@organic.com` / `password`

> [!WARNING]
> Change these passwords immediately after logging in for the first time!
