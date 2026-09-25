# DEV_STUDIO team portfolio

A static, responsive portfolio for the six person development and design team. The site is served from `public/`; project and member records live in `public/js/data.js`.

## Run locally

Requirements: Node.js 18 or newer.

```sh
npm install
npm run dev
```

Open `http://localhost:3000`. `npm start` runs the same Express server. The contact form posts to `/api/contact`. To send email, copy `.env.example` to `.env` and configure a Gmail account and app password. Never commit `.env` or credentials.

## Cloudflare Pages

The frontend is static and can be deployed from the `public` directory with no build command. The existing contact endpoint is an Express server and is not included in a static Pages deployment. For production contact delivery, deploy that API separately on a Node host and set the frontend endpoint to its HTTPS URL with a restricted origin, or port the route to a Cloudflare Pages Function using a supported mail provider. Do not deploy Express as a Pages static asset or put mail credentials in browser code.

## Project structure

- `public/` — static site, styles, images, and browser JavaScript
- `public/js/data.js` — centralized member, project, and service data
- `public/js/projects.js` — project search, filters, cards, and details modal
- `server.js` — Express static server and contact API
- `server/routes/contactRoutes.js` — reserved route module

## Adding portfolio data

Add a project with a stable ID, set `memberIds` to existing member IDs, and add that project ID to each owner's `projectIds`. Include only verified descriptions, technologies, status, and URLs. A missing `live` URL is displayed as “Live preview unavailable.” An external site can reject iframes; the detail view always offers an external link for URLs that are supplied.

## Git workflow and security

Use feature branches and review changes before merging to `main`. `.env`, dependencies, and build output are ignored. Contact input is size limited, validated, escaped in email HTML, protected by a basic in-memory rate limit, and served with security headers. The in-memory limiter is suitable only for a single server process; use a shared store for scaled deployments. The Express backend should not be exposed as the Cloudflare Pages static deployment.

No automated test suite is configured in this repository.
