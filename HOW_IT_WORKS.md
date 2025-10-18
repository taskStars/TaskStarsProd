# How Environment Switching Works

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         TaskStars App                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────┐              ┌─────────────────────┐   │
│  │   Client (Next.js) │◄────────────►│  Server (Express)   │   │
│  │                    │              │                     │   │
│  │  Uses:             │              │  Uses:              │   │
│  │  • .env.local      │              │  • .env.local       │   │
│  │  • .env.production │              │  • .env.production  │   │
│  └────────────────────┘              └─────────────────────┘   │
│           │                                     │                │
│           │                                     │                │
│           ▼                                     ▼                │
│  ┌────────────────────┐              ┌─────────────────────┐   │
│  │  config/api.js     │              │  Environment Vars   │   │
│  │                    │              │                     │   │
│  │  API_URL           │              │  CLIENT_URL         │   │
│  │  SOCKET_URL        │              │  SERVER_URL         │   │
│  │  BACKEND_URL       │              │  MONGO_URI          │   │
│  └────────────────────┘              │  JWT_SECRET         │   │
│                                       │  GOOGLE_CLIENT_*    │   │
│                                       │  GITHUB_CLIENT_*    │   │
│                                       └─────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Environment File Selection

### Server (`server/server.js`)

```javascript
if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" }); // ← Loads production config
} else {
  dotenv.config({ path: ".env.local" }); // ← Loads development config
}
```

### Client (Next.js Automatic)

Next.js automatically loads environment files based on `NODE_ENV`:

- `NODE_ENV=development` → Loads `.env.local`
- `NODE_ENV=production` → Loads `.env.production`

## Configuration Flow

### Development Mode

```
1. You run: npm run dev
   ↓
2. Sets: NODE_ENV=development
   ↓
3. Server loads: server/.env.local
4. Client loads: client/.env.local
   ↓
5. All API calls use: http://localhost:8080
6. All CORS allows: http://localhost:3000
7. OAuth redirects to: http://localhost:8080/api/auth/*/callback
```

### Production Mode

```
1. You run: npm start
   ↓
2. Sets: NODE_ENV=production
   ↓
3. Server loads: server/.env.production
4. Client loads: client/.env.production
   ↓
5. All API calls use: https://taskstars.onrender.com
6. All CORS allows: https://taskstars.onrender.com
7. OAuth redirects to: https://taskstars.onrender.com/api/auth/*/callback
```

## How Environment Variables Are Used

### Client Side (`config/api.js`)

```javascript
// Reads from environment variable set in .env.local or .env.production
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
export const SOCKET_URL =
  process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8080";
```

### Components Import and Use

```javascript
import { API_URL } from "@/config/api";

// Now all API calls use the configured URL
fetch(`${API_URL}/api/tasks/readtasks`);
```

### Server Side

```javascript
// CORS Configuration
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  })
);

// OAuth Callbacks
callbackURL: `${
  process.env.SERVER_URL || "http://localhost:8080"
}/api/auth/google/callback`;
```

## File Structure

```
TaskStars/
├── server/
│   ├── env.template          ← Template showing all variables
│   ├── .env.local            ← Your dev config (gitignored)
│   ├── .env.production       ← Your prod config (gitignored)
│   ├── server.js             ← Loads correct .env file
│   ├── config/
│   │   └── passportConfig.js ← Uses SERVER_URL for OAuth
│   └── routes/
│       └── authRoutes.js     ← Uses CLIENT_URL for redirects
│
├── client/
│   ├── env.template          ← Template showing all variables
│   ├── .env.local            ← Your dev config (gitignored)
│   ├── .env.production       ← Your prod config (gitignored)
│   ├── config/
│   │   └── api.js            ← Central config (NEW!)
│   ├── app/
│   │   ├── login/page.js     ← Imports from config/api.js
│   │   └── signup/page.js    ← Imports from config/api.js
│   └── components/
│       ├── TaskList.js       ← Imports from config/api.js
│       ├── TaskManager.js    ← Imports from config/api.js
│       └── ...               ← All import from config/api.js
│
└── package.json              ← Root scripts for easy switching
```

## What Changed vs Before

### Before ❌

```javascript
// Hardcoded in every file
const socket = io("https://taskstars.onrender.com");
fetch("https://taskstars.onrender.com/api/tasks");
cors({ origin: "https://taskstars.onrender.com" });
```

### After ✅

```javascript
// Dynamic based on environment
import { SOCKET_URL, API_URL } from "@/config/api";
const socket = io(SOCKET_URL);
fetch(`${API_URL}/api/tasks`);
cors({ origin: process.env.CLIENT_URL });
```

## Benefits

### 1. **Easy Development**

- One command: `npm run dev`
- Automatically uses local URLs
- No code changes needed

### 2. **Easy Production**

- One command: `npm start`
- Automatically uses production URLs
- No code changes needed

### 3. **Safe & Secure**

- All secrets in `.env` files
- Never committed to git
- Different credentials for dev/prod

### 4. **Team Friendly**

- Each developer can have their own `.env.local`
- Templates provided for easy setup
- Clear documentation

### 5. **Deployment Ready**

- Works with any hosting platform
- Set environment variables in platform dashboard
- No code changes for different environments

## Common Patterns

### Adding a New API Endpoint

**Client side:**

```javascript
import { API_URL } from "@/config/api";

const response = await fetch(`${API_URL}/api/your-new-endpoint`);
```

### Adding a New Environment Variable

**Server side:**

1. Add to `server/env.template`
2. Add to your `server/.env.local`
3. Add to your `server/.env.production`
4. Use with `process.env.YOUR_VARIABLE`

**Client side:**

1. Add to `client/env.template` (with `NEXT_PUBLIC_` prefix)
2. Add to your `client/.env.local`
3. Add to your `client/.env.production`
4. Use with `process.env.NEXT_PUBLIC_YOUR_VARIABLE`

## Testing Your Setup

### Test Development Mode

```bash
npm run dev
# Visit http://localhost:3000
# Should connect to local backend
```

### Test Production Mode

```bash
npm run build
npm start
# Should use production URLs
```

### Verify Environment Loading

```bash
# Server: Check console on startup
# Should print: "Server running on port 8080"
# Should print: "MongoDB Connected: [your-mongo-host]"

# Client: Check browser console
# API calls should go to the correct URL
```

## Quick Troubleshooting

| Problem                   | Solution                                          |
| ------------------------- | ------------------------------------------------- |
| API calls go to wrong URL | Check `NEXT_PUBLIC_API_URL` in client `.env` file |
| CORS errors               | Check `CLIENT_URL` in server `.env` file          |
| OAuth fails               | Check `SERVER_URL` in server `.env` file          |
| Changes not working       | Restart both server and client                    |
| Variables undefined       | Restart and check variable names                  |

## Summary

The key changes enable environment-based configuration:

1. **Centralized Config** (`client/config/api.js`)
2. **Environment Variables** (`.env.local` and `.env.production`)
3. **Automatic Selection** (Based on `NODE_ENV`)
4. **No More Hardcoding** (Dynamic URLs everywhere)
5. **Easy Switching** (Simple commands)

You can now develop locally and deploy to production without changing any code! 🎉
