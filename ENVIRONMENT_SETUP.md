# Environment Setup Guide

This guide explains how to configure and switch between development and production environments for TaskStars.

## Quick Start

### First Time Setup

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment files:**

   ```bash
   npm run setup
   ```

   This will create `.env.local` files in both `server/` and `client/` directories.

3. **Edit your environment files:**
   - Edit `server/.env.local` with your development values
   - Edit `client/.env.local` with your development values
   - See the templates below for required variables

---

## Environment Files

### Server Environment Variables

The server uses different `.env` files based on `NODE_ENV`:

- **Development:** `.env.local` (when `NODE_ENV=development`)
- **Production:** `.env.production` (when `NODE_ENV=production`)

#### Required Server Variables

```env
# Server Configuration
PORT=8080
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/taskstars

# JWT Secret
JWT_SECRET=your-secret-key

# OAuth - Google
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# OAuth - GitHub
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# URLs
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:8080

# OpenAI (optional)
OPENAI_API_KEY=your-openai-key
```

### Client Environment Variables

The Next.js client also uses environment-specific files:

- **Development:** `.env.local`
- **Production:** `.env.production`

#### Required Client Variables

```env
# Must start with NEXT_PUBLIC_ to be available in browser
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_SOCKET_URL=http://localhost:8080
```

---

## Running the Application

### Development Mode

Run both server and client in development:

```bash
npm run dev
```

Or run them separately:

```bash
# Terminal 1 - Server
cd server
npm run dev

# Terminal 2 - Client
cd client
npm run dev
```

**Development URLs:**

- Client: http://localhost:3000
- Server API: http://localhost:8080

### Production Mode

1. **Build the client:**

   ```bash
   npm run build
   ```

2. **Run in production:**
   ```bash
   npm start
   ```

---

## Switching Between Environments

### Option 1: Use Different .env Files (Recommended)

1. **For Development:**

   - Create `server/.env.local` with development settings
   - Create `client/.env.local` with development settings
   - Run: `npm run dev`

2. **For Production:**
   - Create `server/.env.production` with production settings
   - Create `client/.env.production` with production settings
   - Run: `npm start`

### Option 2: Manual Environment Variable

Set `NODE_ENV` explicitly:

```bash
# Development
NODE_ENV=development node server/server.js

# Production
NODE_ENV=production node server/server.js
```

---

## Configuration Details

### How It Works

1. **Server (`server/server.js`):**

   - Checks `NODE_ENV` environment variable
   - Loads `.env.production` if `NODE_ENV=production`
   - Loads `.env.local` otherwise (development)

2. **Code Changes Made:**
   - CORS origins now use `process.env.CLIENT_URL`
   - OAuth callback URLs now use `process.env.SERVER_URL`
   - Socket.io origins now use `process.env.CLIENT_URL`

### Environment-Specific Values

| Variable     | Development             | Production                       |
| ------------ | ----------------------- | -------------------------------- |
| `CLIENT_URL` | `http://localhost:3000` | `https://taskstars.onrender.com` |
| `SERVER_URL` | `http://localhost:8080` | `https://taskstars.onrender.com` |
| `MONGO_URI`  | Local MongoDB           | MongoDB Atlas URL                |
| `NODE_ENV`   | `development`           | `production`                     |

---

## OAuth Setup

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create/select a project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - Dev: `http://localhost:8080/api/auth/google/callback`
   - Prod: `https://taskstars.onrender.com/api/auth/google/callback`

### GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Add authorization callback URLs:
   - Dev: `http://localhost:8080/api/auth/github/callback`
   - Prod: `https://taskstars.onrender.com/api/auth/github/callback`

---

## Troubleshooting

### CORS Errors

- Verify `CLIENT_URL` in server `.env` matches your client URL
- Check browser console for exact origin mismatch

### OAuth Callback Errors

- Ensure `SERVER_URL` matches the URL in OAuth provider settings
- Verify redirect URIs are correctly configured in Google/GitHub

### Database Connection Issues

- Check `MONGO_URI` format
- Ensure MongoDB is running (for local dev)
- Verify network access (for MongoDB Atlas)

### Environment Variables Not Loading

- Ensure you're using the correct `.env` file name
- Check `NODE_ENV` is set correctly
- Restart the server after changing `.env` files

---

## File Reference

```
TaskStars/
├── server/
│   ├── env.template          # Template for environment variables
│   ├── .env.local            # Your development config (gitignored)
│   ├── .env.production       # Your production config (gitignored)
│   └── .gitignore            # Protects sensitive env files
├── client/
│   ├── env.template          # Template for client environment variables
│   ├── .env.local            # Your development config (gitignored)
│   └── .env.production       # Your production config (gitignored)
└── package.json              # Root scripts for easy management
```

---

## Security Notes

⚠️ **Important:**

- Never commit `.env`, `.env.local`, or `.env.production` files
- Use strong, random values for `JWT_SECRET` in production
- Keep OAuth secrets private
- Store production credentials securely (use environment variables in hosting platform)

---

## Deployment to Render (Production)

When deploying to Render:

1. **Set Environment Variables in Render Dashboard:**

   - Go to your service settings
   - Add all variables from `.env.production`
   - Render will automatically set `NODE_ENV=production`

2. **Update Build & Start Commands:**

   - Build Command: `npm run build`
   - Start Command: `npm start`

3. **Verify Configuration:**
   - Ensure `CLIENT_URL` and `SERVER_URL` match your Render URL
   - Test OAuth callbacks work with production URLs

---

## Need Help?

If you encounter issues:

1. Check that all required environment variables are set
2. Verify `NODE_ENV` is correct for your environment
3. Ensure `.env` files are in the correct directories
4. Check the console for specific error messages
5. Refer to the templates in `env.template` files
