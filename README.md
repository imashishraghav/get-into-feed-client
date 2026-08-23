# Get Into Feed Digital Agency Website

Full-stack website for a digital marketing agency.

- React frontend
- Node/Express backend
- Dynamic services, case studies, testimonials, pricing and FAQs from API
- Contact lead capture saved in `backend/data/leads.json`
- Blog publishing, editable site content and an admin dashboard at `/admin`
- Career applications saved in `backend/data/applications.json`
- SEO title, metadata, JSON-LD, robots.txt and sitemap.xml

## Run Locally

```bash
pnpm install
pnpm dev
```

Frontend: `http://localhost:5173`

Backend API: `http://localhost:5000`

## Production

```bash
pnpm build
pnpm start
```

In production, the backend serves the built React frontend from `frontend/dist`.

## Customize

- Website sections and package content: `backend/data/agencyContent.js`
- React UI: `frontend/src/App.jsx`
- Styling: `frontend/src/styles.css`
- SEO files: `frontend/index.html`, `frontend/public/robots.txt`, `frontend/public/sitemap.xml`
- Leads: `backend/data/leads.json`

## Admin Dashboard

Open `http://localhost:5000/admin` and enter the `ADMIN_TOKEN` value from `.env`.

The dashboard can create, edit and delete services, work/results, testimonials, blog posts and careers. It also shows contact requests and career applications in one inbox. Change the local admin key in `.env` before deploying the website publicly.
