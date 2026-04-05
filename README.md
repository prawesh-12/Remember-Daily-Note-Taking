<h1 align="center">MERN Stack Note Taking App</h1>

![Demo App](/frontend/public/preview.png)

Highlights:

- Full-Stack App Built with the MERN Stack (MongoDB, Express, React, Node)
- Create, Update, and Delete Notes with Title & Description
- Build and Test a Fully Functional REST API
- Rate Limiting with Upstash Redis
- Completely Responsive UI

---

## .env Setup

### Backend (`/backend`)

```
MONGO_URI=<your_mongo_uri>

UPSTASH_REDIS_REST_URL=<your_redis_rest_url>
UPSTASH_REDIS_REST_TOKEN=<your_redis_rest_token>

GOOGLE_CLIENT_ID=<your_google_oauth_client_id>
GOOGLE_CLIENT_SECRET=<your_google_oauth_client_secret>
GOOGLE_REDIRECT_URI=postmessage

JWT_SECRET=<your_long_random_jwt_secret>

NODE_ENV=development
```

### Frontend (`/frontend`)

```
VITE_GOOGLE_CLIENT_ID=<your_google_oauth_client_id>
```

## Run the Backend

```
cd backend
npm install
npm run dev
```

## Run the Frontend

```
cd frontend
npm install
npm run dev
```
