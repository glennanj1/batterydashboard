# Project Status & Roadmap

**Date:** November 26, 2025

## 1. Latest Changes

### Database & Storage
- **Switched to Neon (Cloud PostgreSQL)**: We moved from a local Docker-based PostgreSQL setup to your Neon cloud database. This ensures data persistence across restarts and makes deployment easier.
- **Drizzle ORM Setup**: Configured Drizzle ORM for type-safe database interactions.
- **Schema Synchronization**: Successfully pushed the database schema (Users, Accounts, Sessions) to the Neon instance.
- **NextAuth Adapter**: Integrated `@auth/drizzle-adapter`. User sessions and Tesla access tokens are now securely stored in the database, not just in temporary cookies.

### Error Handling
- **Tesla API Errors**: Improved error handling to capture and display the raw response from Tesla (e.g., "Precondition Failed"), which helped identify the registration issue.

## 2. Does this help authorize the URL?

**No, the database changes do not fix the "Authorize URL" (Domain Registration) issue.**

These are two separate parts of the system:
1.  **Database (Solved)**: Handles *storing* the keys once a user logs in.
2.  **Tesla Registration (Pending)**: Handles *allowing* your app to talk to Tesla in the first place.

You still need to complete the **Tesla Domain Registration** to fix the "Precondition Failed" error.

## 3. Immediate To-Dos (Critical Path)

To fix the Tesla "Precondition Failed" error, you must follow this exact sequence:

### Step 1: Deploy for Verification
Tesla needs to see a specific file on your website to prove you own it.
- [ ] **Push code to GitHub**: Ensure the `public/.well-known` folder is included.
- [ ] **Deploy to Vercel**: This will make the public key accessible at `https://your-app.vercel.app/.well-known/appspecific/com.tesla.3p.public-key.pem`.

### Step 2: Update Tesla Dashboard
- [ ] Go to [Tesla Developer Dashboard](https://developer.tesla.com/dashboard).
- [ ] Update **Allowed Origin** to your Vercel domain (e.g., `https://your-app.vercel.app`).
- [ ] Add `https://your-app.vercel.app/api/auth/callback/tesla` to Redirect URIs.
- [ ] Add `http://localhost:3000/api/auth/callback/tesla` to Redirect URIs (for local dev).

### Step 3: Run Registration Script
- [ ] Open `scripts/register-app.ts`.
- [ ] Update the `domain` variable to match your Vercel domain.
- [ ] Run the script:
  ```bash
  npx tsx scripts/register-app.ts
  ```

### Step 4: Resume Development
- [ ] Once registered, restart your local server (`npm run dev`).
- [ ] Log in. The "Precondition Failed" error should be gone.

## 4. Considerations

- **Environment Variables**: Your `.env` file now contains the production Neon database URL. **Never share this file.**
- **Local vs. Prod**: You can continue to develop on `localhost`. The Vercel deployment is primarily needed for the one-time domain verification step.
- **Token Security**: With the new database setup, user tokens are encrypted at rest (by Neon) and stored securely. This allows for future features like background battery monitoring.
