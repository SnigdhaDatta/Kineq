<div align="center">

# <img src="https://ph-files.imgix.net/9898312c-0f50-4be6-a0a4-9e2dc8d1cb5e.png?auto=compress,format&amp;codec=mozjpeg&amp;cs=strip&amp;fit=crop&amp;h=80&amp;w=80" width="38" height="38" style="vertical-align: middle; border-radius: 8px; margin-right: 4px;" alt="Kineq Logo"> Kineq
 
**Your AI-Powered Tracker Cum Organizer**

<img src="https://img.shields.io/badge/version-1.0.0-brightgreen?style=for-the-badge" height="28" style="vertical-align: middle;"> <img src="https://img.shields.io/badge/users-34-red?style=for-the-badge" height="28" style="vertical-align: middle;"> <a href="https://www.producthunt.com/products/kineq?embed=true&amp;utm_source=badge-featured&amp;utm_medium=badge&amp;utm_campaign=badge-kineq" target="_blank" rel="noopener noreferrer"><img alt="Kineq - Your AI-Powered Watchlist Organizer Tracker | Product Hunt" height="28" src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1171559&amp;theme=light&amp;t=1782559757484" style="vertical-align: middle;"></a>

</div>
</br>
Kineq is a full-stack web application with LLM-powered semantic search (via Tavily) to track shows/movies across three personal states with Features:

- watchlist
- ongoing
- completed (folder-based)
- link sharing (share folders/lists via unique public links)
- scheduled automated reminder in form of emails and web-push notifications
- chatbot (for searching about movies/series/animes information, getting recommendations, etc)

## Why Kineq

Kineq exists to keep a user's watch history, current progress, and future picks in one place instead of spreading them across notes, bookmarks, and streaming apps.

- It gives a single workflow for tracking watchlist, ongoing, and completed items.
- It makes sharing curated lists and folders simple with unique public links.
- It reduces forgotten shows and movies by using reminder emails and web-push notifications.
- It helps users discover what to watch next with chatbot-based search and recommendations.
- It keeps the experience fast with Redis-backed reads and clean data updates in MongoDB.

## Architecture Visualizer

```mermaid
flowchart LR
	U[User Browser] --> FE[Next.js Client]
	FE --> UI[Pages / Components]
	UI --> API[Fetch to /api]
	API --> BFF[Express API]

	subgraph Auth Flow
		BFF --> SIGNUP[POST /api/user/signup]
		BFF --> LOGIN[POST /api/user/login]
		BFF --> OTPSEND[POST /api/user/sendOtp]
		BFF --> OTPVERIFY[POST /api/user/verifyEmail]
		SIGNUP --> JWT[Access token + refresh cookie]
		LOGIN --> JWT
		OTPSEND --> REDISOTP[(Redis OTP cache, TTL 120s)]
		OTPSEND --> MAIL[Email service]
		OTPVERIFY --> REDISOTP
		OTPVERIFY --> OTPDONE[Verify OTP and delete key]
	end

	subgraph Read Flow
		BFF --> GETS[GET watchlist / ongoing / completed / shared]
		GETS --> CACHEHIT{Redis hit?}
		CACHEHIT -->|Yes| REDISCACHE[(Redis cache)]
		REDISCACHE --> RESP[Return cached JSON]
		CACHEHIT -->|No| MDB[(MongoDB)]
		MDB --> SETCACHE[Set Redis cache with TTL]
		SETCACHE --> RESP
	end

	subgraph Write Flow
		BFF --> WRITES[POST / PATCH / DELETE / move]
		WRITES --> MDB
		WRITES --> INVALIDATE[Delete affected Redis keys]
		INVALIDATE --> REDISCACHE
	end

	subgraph Other Services
		BFF --> CHAT[Chatbot / Tavily]
		BFF --> SHARED[Public share routes]
		CRON[Cron jobs] --> NOTIF[Email + web push reminders]
		NOTIF --> MAIL
	end
```

## Demo (Click the below image)

[![Manage Your Anime, K-dramas, C-dramas, Movies & More With Kineq](/client/public/images/mockup.png)](https://youtu.be/aVinODlbkMQ)

Backend behavior in plain terms:

- GET requests for watchlist, ongoing, completed, and shared views check Redis first, then fall back to MongoDB on cache miss.
- POST, PATCH, DELETE, and move actions write to MongoDB first and then clear the relevant Redis keys so the next GET rebuilds the cache.
- OTP verification uses Redis as a short-lived store for `otp:<email>` and deletes the key after successful verification or expiry.
- Login and signup issue JWT access tokens plus an HTTP-only refresh cookie.
- Chatbot requests go through the backend and use Tavily, while reminder jobs run from cron and trigger mail / web-push notifications.

The project is split into:

- `client/`: Next.js frontend (deployed on Vercel)
- `backend/`: Express + MongoDB + Redis API + Tavily Search(LLM) (Dockerized, deployable on AWS EC2)
- `backend/`: Express + MongoDB + Redis API + Tavily Search (LLM-powered search) (Dockerized, deployable on AWS EC2)

## Quick Links

- Backend detailed documentation: [Backend README](backend/readme.md)

## Project Structure

```text
Kineq/
	client/
		app/
		components/
		lib/
	backend/
		controllers/
		cron/
		middlewares/
		models/
		routes/
		services/
		Dockerfile
		docker-compose.yml
```

## Local Development

### Frontend

```bash
cd client
npm install
npm run dev
```

### Backend

```bash
cd backend
npm install
npm run dev
```

## Tech Stack

**Frontend:** `Next.js 15` • `React 19` • `TypeScript` • `Tailwind CSS 4` • `lucide-react` • `clsx` • `tailwind-merge`

**Backend:** `Node.js` • `Express 5` • `MongoDB` • `Mongoose` • `Redis` • `JWT` • `bcrypt` • `cookie-parser` • `cors` • `node-cron` • `Resend` • `Tavily Core`

**Dev / Tooling:** `Nodemon` • `ESLint` • `Turbopack` • `dotenv`

## Deployment Overview

<table>
  <thead>
    <tr>
      <th align="left" style="width: 25%; min-width: 140px;">Frontend</th>
      <th align="left" style="width: 35%; min-width: 200px;">Backend Image</th>
      <th align="left" style="width: 40%; min-width: 220px;">Backend Runtime</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Vercel</td>
      <td>GitHub Actions<br>Docker Hub</td>
      <td>AWS EC2<br>Docker Compose</td>
    </tr>
  </tbody>
</table>

## Notes

- Keep all sensitive values in environment variables.
- Do not commit `.env` files to the repository.
- For backend endpoint details and env keys, see [Backend README](backend/readme.md).
- Browser cookies: If your browser blocks third-party cookies, the HTTP-only refresh cookie may not be sent during cross-origin token refresh. This can cause frequent logouts or 400 errors for missing refresh token. Allow third-party cookies for the site (or set cookie SameSite=None and secure) to remain logged in longer.
- CORS & runtime caution: Be careful when configuring CORS and cross-origin behavior — incorrect settings can cause abnormal client/server behavior in production. Also pin and verify package versions carefully; mismatched or deprecated libraries (CommonJS vs ESM differences) can cause runtime failures. Pin dependencies and test in a staging environment before production.
