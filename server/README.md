# Zumar Law Firm Backend

Standalone Node.js backend for the Zumar Law Firm website. It uses MongoDB for production storage and seeds the first CMS document from the existing JSON content if the database is empty.

## Run

```powershell
cd server
Copy-Item .env.example .env
npm run start
```

The default API URL is `http://localhost:4000`.
The backend loads `server/.env` automatically.

## MongoDB

Default local connection:

```powershell
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DATABASE=zumar_law_firm
MONGODB_COLLECTION=cms_content
```

Atlas connection:

```powershell
MONGODB_URI=mongodb+srv://USER:PASSWORD@CLUSTER.mongodb.net/?retryWrites=true&w=majority
MONGODB_DATABASE=zumar_law_firm
MONGODB_COLLECTION=cms_content
```

The server stores CMS data as one document in `cms_content` with `_id: "singleton"`. On first startup, it seeds from `CMS_DATA_FILE`; if that file does not exist, it falls back to `client/data/cms-content.json`.

## Cache

The backend keeps CMS reads in memory for `CMS_CACHE_TTL_SECONDS` and clears that cache whenever admin content is changed. Public API responses also send cache headers controlled by `PUBLIC_CACHE_TTL_SECONDS` and `PUBLIC_STALE_TTL_SECONDS`.

## Image Uploads

Admin image fields upload files to the backend:

```powershell
UPLOAD_DIR=./uploads
UPLOAD_PUBLIC_URL=http://localhost:4000/uploads
MAX_UPLOAD_BYTES=8388608
```

Uploaded images are saved on disk in `server/uploads` and served publicly from `/uploads/<filename>`. The returned image URL is stored in MongoDB as part of the CMS content.

To push the current JSON CMS content into MongoDB manually:

```powershell
cd server
npm run seed:mongo
```

You can also pass a specific JSON file:

```powershell
npm run seed:mongo -- ../client/data/cms-content.json
```

## Admin Auth

Set these values in `.env` before production use:

- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `ADMIN_TOKEN`

Login with `POST /api/auth/login`. Admin endpoints also accept `Authorization: Bearer <ADMIN_TOKEN>`.

## Main Routes

- `GET /health`
- `POST /api/auth/login`
- `GET /api/content`
- `GET /api/admin/content`
- `PUT /api/admin/content`
- `POST /api/appointments`
- `GET /api/admin/appointments`
- `PATCH /api/admin/appointments/:id`
- `DELETE /api/admin/appointments/:id`
- `GET /api/:collection`
- `POST /api/admin/:collection`
- `PATCH /api/admin/:collection/:id`
- `DELETE /api/admin/:collection/:id`

Supported collections are `services`, `blogs`, `news`, `branches`, and `service-areas`.

## Connect The Next.js App

The existing Next API routes still work without this server. To have them proxy to the standalone backend, set these in the Next.js app environment:

```powershell
BACKEND_API_URL=http://localhost:4000
BACKEND_ADMIN_TOKEN=change-this-token-before-production
```

`BACKEND_ADMIN_TOKEN` must match the backend `ADMIN_TOKEN`.
