# Deployment Guide

## Deploy to Render (Recommended - Free Tier Available)

### Option 1: One-Click Deploy

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Sign in with your GitHub account
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repository: `Lkoenig2121/Myspace`
5. Configure the service:
   - **Name**: `myspace-clone` (or your preferred name)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
6. Click **"Create Web Service"**

Your app will be live at: `https://myspace-clone-xxxx.onrender.com`

### Option 2: Using render.yaml

The repository includes a `render.yaml` file. You can:

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **"New +"** → **"Blueprint"**
3. Connect your repository
4. Render will automatically detect the `render.yaml` configuration

---

## Deploy to Railway

1. Go to [Railway.app](https://railway.app/)
2. Sign in with GitHub
3. Click **"New Project"** → **"Deploy from GitHub repo"**
4. Select your `Lkoenig2121/Myspace` repository
5. Railway will automatically detect it's a Node.js app
6. Your app will be deployed automatically

---

## Deploy to Heroku

1. Install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)

2. Login to Heroku:
```bash
heroku login
```

3. Create a new Heroku app:
```bash
cd /path/to/myspace
heroku create myspace-clone-app
```

4. Push to Heroku:
```bash
git push heroku main
```

5. Open your app:
```bash
heroku open
```

---

## Deploy to Fly.io

1. Install [flyctl](https://fly.io/docs/hands-on/install-flyctl/)

2. Login:
```bash
fly auth login
```

3. Launch your app:
```bash
fly launch
```

4. Follow the prompts and deploy:
```bash
fly deploy
```

---

## Important Notes

### Database Persistence
The SQLite database will reset when the server restarts on free hosting tiers. For production, consider:
- Using a persistent volume (available on most platforms)
- Migrating to PostgreSQL or MongoDB for production use
- Using a managed database service

### Environment Variables
If you need to set environment variables (like secret keys), you can configure them in your hosting platform's dashboard.

### Demo Credentials
The demo accounts (`demo`/`password123` and `tom`/`test123`) will be automatically created on first startup thanks to the seeding script.

---

## Testing Your Deployment

After deployment, test:
1. Visit the login page
2. Use demo credentials: `demo` / `password123`
3. Edit your profile with custom HTML/CSS
4. Create a new account
5. Visit other user profiles

---

## Need Help?

- **Render**: [Documentation](https://render.com/docs)
- **Railway**: [Documentation](https://docs.railway.app/)
- **Heroku**: [Documentation](https://devcenter.heroku.com/)
- **Fly.io**: [Documentation](https://fly.io/docs/)

