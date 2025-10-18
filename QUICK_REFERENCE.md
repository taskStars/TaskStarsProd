# Quick Reference - Environment Switching

## 🚀 Quick Commands

### First Time Setup

```bash
npm install
npm run setup
# Edit server/.env.local and client/.env.local with your values
```

### Development

```bash
npm run dev
```

Runs on:

- Client: http://localhost:3000
- API: http://localhost:8080

### Production

```bash
npm run build
npm start
```

---

## 📝 Environment Files Cheat Sheet

### Development Setup

Create `server/.env.local`:

```env
NODE_ENV=development
PORT=8080
MONGO_URI=mongodb://localhost:27017/taskstars
JWT_SECRET=dev-secret-key
CLIENT_URL=http://localhost:3000
SERVER_URL=http://localhost:8080
GOOGLE_CLIENT_ID=your-dev-google-id
GOOGLE_CLIENT_SECRET=your-dev-google-secret
GITHUB_CLIENT_ID=your-dev-github-id
GITHUB_CLIENT_SECRET=your-dev-github-secret
```

Create `client/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_SOCKET_URL=http://localhost:8080
```

### Production Setup

Create `server/.env.production`:

```env
NODE_ENV=production
PORT=8080
MONGO_URI=your-mongodb-atlas-uri
JWT_SECRET=strong-random-production-secret
CLIENT_URL=https://taskstars.onrender.com
SERVER_URL=https://taskstars.onrender.com
GOOGLE_CLIENT_ID=your-prod-google-id
GOOGLE_CLIENT_SECRET=your-prod-google-secret
GITHUB_CLIENT_ID=your-prod-github-id
GITHUB_CLIENT_SECRET=your-prod-github-secret
```

Create `client/.env.production`:

```env
NEXT_PUBLIC_API_URL=https://taskstars.onrender.com
NEXT_PUBLIC_SOCKET_URL=https://taskstars.onrender.com
```

---

## 🔄 Switching Modes

| What You Want        | Command         | Requires                |
| -------------------- | --------------- | ----------------------- |
| Develop locally      | `npm run dev`   | `.env.local` files      |
| Run production build | `npm start`     | `.env.production` files |
| Build for production | `npm run build` | Nothing special         |

---

## ⚠️ Common Issues

**CORS errors?**
→ Check `CLIENT_URL` in `server/.env.local`

**OAuth not working?**
→ Verify callback URLs use the correct `SERVER_URL`

**Can't connect to database?**
→ Check `MONGO_URI` format and MongoDB is running

**Changes not taking effect?**
→ Restart the server after editing `.env` files

---

## 🔐 Security Reminders

- ✅ `.env` files are gitignored
- ✅ Never commit secrets to git
- ✅ Use different OAuth apps for dev/prod
- ✅ Use strong JWT secrets in production

---

## 📚 More Details

See `ENVIRONMENT_SETUP.md` for complete documentation.
