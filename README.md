# Notes API setup

1. Copy `.env.example` to `.env` and set `MONGODB_URI` to your MongoDB connection string.
2. In Firebase Console, create a service-account key for the same Firebase project used by the client. Store the downloaded JSON file outside this repository and set `GOOGLE_APPLICATION_CREDENTIALS` to its absolute path.
3. Install dependencies with `npm install`, then start the API with `npm start`. The `.env` file and service-account keys are ignored by Git.

The API verifies Firebase ID tokens. Its notes endpoints require an `Authorization: Bearer <Firebase ID token>` header, and listing or deleting notes is restricted to the authenticated Firebase UID.

Notes created before UID ownership was added do not have an `ownerUid` and are intentionally excluded from the protected API. Migrate those records only after verifying their ownership.

For the client, copy `note-client/.env.example` to `note-client/.env` and set `VITE_API_URL` to the deployed API origin when deploying. The default is the local API at `http://localhost:1415`.
