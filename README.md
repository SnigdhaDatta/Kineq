# Kineq

Kineq is a full-stack web application to track shows/items across three personal states and features:

- watchlist
- ongoing
- completed (folder-based)
- chatbot (for searching about movies/series/animes information, getting   recommendations, etc)


The project is split into:

- `client/`: Next.js frontend (deployed on Vercel)
- `backend/`: Express + MongoDB + Redis API (Dockerized, deployable on AWS EC2)

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

## Deployment Overview

- Frontend: Vercel
- Backend image: GitHub Actions -> Docker Hub
- Backend runtime: AWS EC2 via Docker Compose

The backend CI/CD flow uses SHA-based image tags for immutable deployments and optionally `latest` for convenience.

## Notes

- Keep all sensitive values in environment variables.
- Do not commit `.env` files to the repository.
- For backend endpoint details and env keys, see [Backend README](backend/readme.md).
