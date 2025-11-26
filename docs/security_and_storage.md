# Security and Storage Architecture

This document outlines the security architecture and storage solution implemented for the Battery Dashboard application.

## 1. Secure Storage (PostgreSQL)

We use a self-hosted PostgreSQL database to securely store user sessions, account information, and authentication tokens.

### Infrastructure
- **Database**: PostgreSQL 16 (running via Docker)
- **ORM**: Drizzle ORM (Type-safe database interaction)
- **Adapter**: `@auth/drizzle-adapter` (Connects NextAuth to the database)

### Data Schema
The database schema is designed to securely store standard OAuth data:
- **Users**: Stores user identity (ID, name, email, image).
- **Accounts**: Stores OAuth tokens (Access Token, Refresh Token) linked to the user.
- **Sessions**: Stores active session tokens for maintaining user login state.

### Security Benefits
- **Persistence**: User tokens are stored in a persistent database, not just in memory or cookies.
- **Isolation**: The database runs in a containerized environment.
- **Type Safety**: Drizzle ORM ensures all database queries are type-safe, reducing the risk of SQL injection.

## 2. Authentication Flow (NextAuth.js)

The application uses NextAuth.js v5 for secure authentication with Tesla.

### Flow
1. **User initiates login**: Redirects to Tesla's OAuth 2.0 authorization page.
2. **Tesla authenticates user**: User grants permission to the app.
3. **Callback**: Tesla redirects back to the app with an authorization code.
4. **Token Exchange**: NextAuth exchanges the code for an Access Token and Refresh Token.
5. **Persistence**: 
   - The **Account** table is updated with the new tokens.
   - A **Session** is created in the database.
   - A secure, HTTP-only cookie is set in the user's browser containing the session token.

### Token Security
- **Access Tokens**: Stored in the database `account` table. They are retrieved server-side only when needed to make API calls to Tesla.
- **Refresh Tokens**: Also stored in the database. NextAuth can be configured to automatically rotate these tokens (future enhancement).
- **Client Secrets**: The Tesla Client ID and Secret are stored in environment variables (`.env`), never exposed to the client.

## 3. Environment Variables

The application relies on the following environment variables for security. 

**WARNING**: Never commit your `.env` file to version control.

```env
# Tesla API Configuration
TESLA_CLIENT_ID="your_client_id"
TESLA_CLIENT_SECRET="your_client_secret"

# Database Configuration
# format: postgres://user:password@host:port/dbname
DATABASE_URL="postgres://postgres:postgres@localhost:5433/batterydashboard"

# NextAuth Configuration
AUTH_SECRET="generated_secret_string" # Run `npx auth secret` to generate
```

## 4. Local Development Setup

To run the secure storage locally:

1. **Start the Database**:
   ```bash
   docker compose up -d
   ```
   This starts a PostgreSQL instance on port `5433`.

2. **Manage Schema**:
   - Generate migrations: `npx drizzle-kit generate`
   - Push changes: `npx drizzle-kit push`
   - View data (optional): `npx drizzle-kit studio`

3. **Run the App**:
   ```bash
   npm run dev
   ```

## 5. Future Security Enhancements

- **Token Encryption**: While the database is secure, adding application-level encryption (At-Rest Encryption) for the `access_token` and `refresh_token` columns would add another layer of security.
- **Refresh Token Rotation**: Implement logic to automatically use the refresh token to get a new access token when the current one expires.
