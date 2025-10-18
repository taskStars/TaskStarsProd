# 🚀 START HERE - Quick Setup Guide

## You're 3 Steps Away from Running TaskStars!

---

## Step 1️⃣: Create Your Environment Files

Run this command from the project root:

```bash
npm run setup
```

This creates:

- `server/.env.local`
- `client/.env.local`

---

## Step 2️⃣: Edit Your Environment Files

### Edit `server/.env.local`

Open the file and replace the placeholder values:

```bash
# Minimum required for local development:

NODE_ENV=development
PORT=8080
MONGO_URI=mongodb://localhost:27017/taskstars
JWT_SECRET=any-random-string-for-development
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:8080

# Optional (for OAuth features):
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# Optional (for AI features):
OPENAI_API_KEY=your-openai-key
```

**Don't have MongoDB installed?**

- Install locally: `brew install mongodb-community` (Mac)
- Or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free cloud)

### Edit `client/.env.local`

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_SOCKET_URL=http://localhost:8080
```

---

## Step 3️⃣: Run the App!

```bash
npm run dev
```

Visit: **http://localhost:3000** 🎉

---

## ✅ That's It!

Your app is now running with proper environment configuration.

---

## What Just Happened?

- ✅ All hardcoded URLs removed
- ✅ Environment-based configuration enabled
- ✅ Easy switching between dev and production
- ✅ Secrets kept safe in `.env` files
- ✅ 13 client files updated
- ✅ 4 server files updated

---

## Common First-Time Issues

### "Cannot connect to MongoDB"

**Solution:** Install and start MongoDB:

```bash
brew services start mongodb-community
```

### "OAuth not working"

**Solution:** OAuth features are optional. The app works without them! To enable:

1. Create Google/GitHub OAuth apps
2. Add credentials to `.env.local`
3. See `ENVIRONMENT_SETUP.md` for detailed steps

### "Port already in use"

**Solution:** Change the port in `server/.env.local`:

```bash
PORT=3001  # or any available port
```

---

## Next Steps

### Want OAuth? Set it up:

1. [Google OAuth Setup](https://console.cloud.google.com/)
2. [GitHub OAuth Setup](https://github.com/settings/developers)
3. See `ENVIRONMENT_SETUP.md` for step-by-step guide

### Want to Deploy?

1. Create `server/.env.production` and `client/.env.production`
2. Use your production URLs
3. See `SETUP_SUMMARY.md` for production setup

### Want to Understand How It Works?

- See `HOW_IT_WORKS.md` for architecture diagram
- See `QUICK_REFERENCE.md` for command cheat sheet

---

## Available Commands

| Command         | What it does                    |
| --------------- | ------------------------------- |
| `npm run dev`   | Start development mode          |
| `npm run build` | Build for production            |
| `npm start`     | Run production mode             |
| `npm run setup` | Create env files from templates |

---

## 📚 Documentation Index

1. **START_HERE.md** ← You are here! Quick setup
2. **QUICK_REFERENCE.md** - Command cheat sheet
3. **SETUP_SUMMARY.md** - What was changed
4. **ENVIRONMENT_SETUP.md** - Complete documentation
5. **HOW_IT_WORKS.md** - Architecture and flow

---

## Need Help?

If something's not working:

1. Check that `.env.local` files exist in both `server/` and `client/`
2. Verify MongoDB is running (if using local)
3. Restart the app: Stop with Ctrl+C, then `npm run dev` again
4. Check the console for error messages

---

## Files You Need to Create (not tracked by git)

```
TaskStars/
├── server/
│   ├── .env.local          ← YOU CREATE THIS
│   └── .env.production     ← CREATE LATER FOR PRODUCTION
└── client/
    ├── .env.local          ← YOU CREATE THIS
    └── .env.production     ← CREATE LATER FOR PRODUCTION
```

**These files are in `.gitignore`** - they won't be committed to git (that's good! keeps secrets safe)

---

## Quick Test

After setup, verify everything works:

```bash
# Terminal 1: Check server started
# Should see: "Server running on port 8080"
# Should see: "MongoDB Connected"

# Terminal 2: Open browser
# Visit: http://localhost:3000
# Should see: TaskStars app loading
```

---

## 🎉 Success!

If you see the app at http://localhost:3000, you're all set!

Now you can:

- ✅ Develop locally
- ✅ Switch to production easily
- ✅ Keep credentials safe
- ✅ Share code without exposing secrets

**Happy coding!** 🚀

---

## One More Thing...

Don't forget to:

- [ ] Create your `.env.local` files (Step 2)
- [ ] Start MongoDB (if using local)
- [ ] Add real credentials for features you want
- [ ] Never commit `.env` files to git
- [ ] Use different secrets for dev vs production

---

**Questions?** Check the other docs in this folder! 📖
