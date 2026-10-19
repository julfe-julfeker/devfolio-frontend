# DevFolio — Developer Portfolio & Blog

A responsive personal portfolio and blog frontend built with React. Visitors can explore projects, read and search blog posts, like posts, submit comments, and send contact messages. The owner manages content through a protected dashboard.

## Tech stack

- React + Vite
- JavaScript / JSX
- Tailwind CSS
- Django REST Framework backend with JWT authentication

## Features

- Responsive portfolio home and project showcase
- Blog list and post detail pages
- Blog search and filters
- Post likes and visitor comments
- Contact form
- Owner login and protected dashboard
- Owner content management and comment moderation
- Light/dark appearance (where enabled in the UI)

## Getting started

```powershell
git clone https://github.com/julfe-julfeker/devfolio-frontend.git
cd devfolio-frontend
npm install
npm run dev
```

Open the local address printed by Vite (usually `http://localhost:5173`). Run the backend separately at `http://127.0.0.1:8000`.

### Environment configuration

Create `.env` in the frontend project root **if your API client reads a Vite environment variable**:

```dotenv
VITE_API_BASE_URL=http://127.0.0.1:8000/api
```

**Important:** Check the actual environment variable name in your frontend API client before using this example. Do not commit `.env` or real credentials. If the API URL is configured directly in source code, adjust it there instead.

## Pages and access

| Page | Access | Purpose |
| --- | --- | --- |
| Home (`/`) | Public | Portfolio introduction |
| Projects | Public | Project showcase |
| Blog | Public | Published posts, search and filtering |
| Blog details | Public | Article, likes and comments |
| Login (`/login`) | Public | Owner sign-in |
| Dashboard | Owner only | Manage portfolio, blog, comments and messages |

> Exact route paths other than `/` and `/login` depend on the React Router configuration. Check `src/App.jsx` or your router file before replacing these page labels with URLs.

## Design direction and design tokens

This interface aims for a clean, readable developer portfolio with responsive layouts and clear separation between public pages and owner controls.

Document the **actual** design option (A/B/C/D) selected for the assignment here: `TODO: selected direction`.

| Token | Value |
| --- | --- |
| Primary/accent color | `TODO: copy actual Tailwind/CSS value` |
| Background/text colors | `TODO: copy actual light and dark values` |
| Font family | `TODO: copy actual font` |
| Spacing scale | Tailwind utility scale (confirm custom values) |
| Border radius | `TODO: copy actual classes or theme values` |

## Screenshots

Add screenshots in `screenshots/` and commit them to this repository. Capture real application screens; do not substitute mockups.

| Screen | Screenshot |
| --- | --- |
| Home — light | `screenshots/home-light.png` |
| Home — dark | `screenshots/home-dark.png` |
| Blog list | `screenshots/blog-list.png` |
| Blog details | `screenshots/blog-details.png` |
| Owner dashboard | `screenshots/dashboard.png` |

Once screenshots exist, replace the table paths with embedded Markdown images, for example `![Home light](screenshots/home-light.png)`.

## Project structure

The frontend follows a Vite/React layout. See `src/` for actual pages, components, API services, and state management. Update this section with the final directory tree if required by the evaluator.

## Security notes

The frontend hides protected dashboard screens from visitors, while the **backend** enforces access control on private API endpoints. Do not rely on frontend route guards alone for authorization. Keep passwords and JWTs out of the repository and screenshots.

## Future improvements

- Automated component and end-to-end tests
- Better accessibility and keyboard navigation
- Deployment with environment-specific API configuration
- Performance and image optimization

## Repositories and demo

- **Backend:** https://github.com/julfe-julfeker/devfolio-backend
- **Postman collection:** https://github.com/julfe-julfeker/devfolio-backend/blob/main/DevFolio%20API.postman_collection.json
- **Frontend:** https://github.com/julfe-julfeker/devfolio-frontend
- **Live frontend:** `TODO: add URL if deployed`
- **Live backend:** `TODO: add URL if deployed`
- **Demo video:** `TODO: add public-viewable Google Drive or Loom URL`

## Demo checklist (4–6 minutes)

Show the visitor flow (home → projects → blog → search/filter → like → comment → contact), prove the dashboard is inaccessible while logged out, then log in as the demo owner and show creating/publishing/editing/deleting a post, approving a comment, and a mobile-width layout.
