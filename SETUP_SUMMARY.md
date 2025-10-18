# Setup Complete! 🎉

Your codebase has been successfully configured to easily switch between development and production environments.

## What Was Changed

### 1. **Server-Side Changes** (`/server`)

#### Files Modified:

- ✅ `server.js` - Updated CORS and Socket.io to use `CLIENT_URL` environment variable
- ✅ `config/passportConfig.js` - Updated OAuth callback URLs to use `SERVER_URL` environment variable
- ✅ `routes/authRoutes.js` - Updated OAuth redirect URLs to use `CLIENT_URL` environment variable
- ✅ `package.json` - Added convenient `dev` and `start` scripts
- ✅ `.gitignore` - Updated to ignore all environment files

#### Files Created:

- ✅ `env.template` - Template showing all required environment variables

### 2. **Client-Side Changes** (`/client`)

#### Files Created:

- ✅ `config/api.js` - Centralized API configuration using environment variables

#### Files Modified (Updated to use `config/api.js`):

- ✅ `app/login/page.js`
- ✅ `app/signup/page.js`
- ✅ `app/productivity/page.js`
- ✅ `components/TaskList.js`
- ✅ `components/TaskManager.js`
- ✅ `components/TaskCard.js`
- ✅ `components/FriendsProductivity.js`
- ✅ `components/LockInTimer.js`
- ✅ `components/apitest.js`
- ✅ `components/SearchUser/FriendSearch.js`
- ✅ `components/OpenAITaskCreator/AIModal.js`
- ✅ `components/CurrentUserProductivity/UserProductivity.js`
- ✅ `.gitignore` - Updated to ignore environment files
- ✅ `package.json` - Updated scripts

#### Files Created:

- ✅ `env.template` - Template for client environment variables

### 3. **Root Changes**

#### Files Modified:

- ✅ `package.json` - Added `dev`, `setup`, and improved scripts

#### Files Created:

- ✅ `ENVIRONMENT_SETUP.md` - Complete setup documentation
- ✅ `QUICK_REFERENCE.md` - Quick command reference
- ✅ `SETUP_SUMMARY.md` - This file

---

## Quick Start (First Time)

### Step 1: Create Environment Files

Run this command from the project root:

```bash
npm run setup
```

This creates:

- `server/.env.local`
- `client/.env.local`

### Step 2: Edit Environment Files

**Edit `server/.env.local`:**

```env
NODE_ENV=development
PORT=8080
MONGO_URI=mongodb://localhost:27017/taskstars
JWT_SECRET=your-dev-secret-key
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:8080
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
OPENAI_API_KEY=your-openai-key
```

**Edit `client/.env.local`:**

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_SOCKET_URL=http://localhost:8080
```

### Step 3: Run Development Mode

```bash
npm run dev
```

This will start both the server and client in development mode.

---

## Production Setup

### Step 1: Create Production Environment Files

**Create `server/.env.production`:**

```env
NODE_ENV=production
PORT=8080
MONGO_URI=your-mongodb-atlas-uri
JWT_SECRET=strong-production-secret
CLIENT_URL=https://taskstars.onrender.com
SERVER_URL=https://taskstars.onrender.com
GOOGLE_CLIENT_ID=your-prod-google-client-id
GOOGLE_CLIENT_SECRET=your-prod-google-client-secret
GITHUB_CLIENT_ID=your-prod-github-client-id
GITHUB_CLIENT_SECRET=your-prod-github-client-secret
OPENAI_API_KEY=your-openai-key
```

**Create `client/.env.production`:**

```env
NEXT_PUBLIC_API_URL=https://taskstars.onrender.com
NEXT_PUBLIC_SOCKET_URL=https://taskstars.onrender.com
```

### Step 2: Build and Run

```bash
npm run build
npm start
```

---

## Commands Reference

| Command              | Description                                      |
| -------------------- | ------------------------------------------------ |
| `npm run setup`      | Create initial `.env.local` files from templates |
| `npm run dev`        | Run in development mode (both server & client)   |
| `npm run build`      | Build production client                          |
| `npm start`          | Run in production mode                           |
| `npm run server:dev` | Run only server in dev mode                      |
| `npm run client:dev` | Run only client in dev mode                      |

---

## Environment Variables Explained

### Server Variables

| Variable               | Purpose                 | Example                               |
| ---------------------- | ----------------------- | ------------------------------------- |
| `NODE_ENV`             | Environment mode        | `development` or `production`         |
| `PORT`                 | Server port             | `8080`                                |
| `MONGO_URI`            | Database connection     | `mongodb://localhost:27017/taskstars` |
| `JWT_SECRET`           | JWT signing secret      | Random string                         |
| `CLIENT_URL`           | Frontend URL (for CORS) | `http://localhost:3000`               |
| `SERVER_URL`           | Backend URL (for OAuth) | `http://localhost:8080`               |
| `GOOGLE_CLIENT_ID`     | Google OAuth ID         | From Google Cloud Console             |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Secret     | From Google Cloud Console             |
| `GITHUB_CLIENT_ID`     | GitHub OAuth ID         | From GitHub Settings                  |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth Secret     | From GitHub Settings                  |
| `OPENAI_API_KEY`       | OpenAI API key          | From OpenAI dashboard                 |

### Client Variables

| Variable                 | Purpose         | Example                 |
| ------------------------ | --------------- | ----------------------- |
| `NEXT_PUBLIC_API_URL`    | Backend API URL | `http://localhost:8080` |
| `NEXT_PUBLIC_SOCKET_URL` | WebSocket URL   | `http://localhost:8080` |

> **Note:** Next.js requires `NEXT_PUBLIC_` prefix for variables used in browser code.

---

## OAuth Configuration

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create credentials (OAuth 2.0)
3. Add authorized redirect URIs:
   - Dev: `http://localhost:8080/api/auth/google/callback`
   - Prod: `https://taskstars.onrender.com/api/auth/google/callback`

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create OAuth App
3. Add authorization callback URL:
   - Dev: `http://localhost:8080/api/auth/github/callback`
   - Prod: `https://taskstars.onrender.com/api/auth/github/callback`

---

## Troubleshooting

### "CORS Error"

→ Check `CLIENT_URL` in `server/.env.local` matches your client URL

### "OAuth Callback Failed"

→ Verify `SERVER_URL` in `server/.env.local` matches the URL in OAuth provider settings

### "Can't Connect to Database"

→ Ensure MongoDB is running (for local dev) and `MONGO_URI` is correct

### "Environment Variables Not Working"

→ Restart both server and client after changing `.env` files

### "API Calls Failing"

→ Check `NEXT_PUBLIC_API_URL` in `client/.env.local` is correct

---

## Security Checklist

- ✅ `.env` files are in `.gitignore`
- ✅ Never commit real credentials
- ✅ Use strong JWT secrets in production
- ✅ Use separate OAuth apps for dev/prod
- ✅ Keep production credentials secure

---

## Next Steps

1. ✅ Create your `.env.local` files using `npm run setup`
2. ✅ Fill in your actual credentials and settings
3. ✅ Set up OAuth apps in Google and GitHub
4. ✅ Test with `npm run dev`
5. ✅ When ready for production, create `.env.production` files
6. ✅ Deploy with confidence!

---

## Need More Help?

- See `ENVIRONMENT_SETUP.md` for detailed documentation
- See `QUICK_REFERENCE.md` for command cheat sheet
- Check the `env.template` files for variable examples

---

**You're all set!** 🚀 Your codebase can now easily switch between development and production environments.
