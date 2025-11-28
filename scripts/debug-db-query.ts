import postgres from "postgres"

// Load env vars
try {
  process.loadEnvFile()
} catch (e) {
  console.log("No .env file loaded")
}

const url = process.env.DATABASE_URL
if (!url) {
    console.error("DATABASE_URL is not set")
    process.exit(1)
}

// Same config as src/db/index.ts
const client = postgres(url, { prepare: false })

async function testQuery() {
  try {
    console.log("Testing connection...")
    // Try a simple query first
    const now = await client`SELECT NOW()`
    console.log("Connection successful:", now)

    console.log("Testing session query...")
    // Try to select from session table (simulating NextAuth)
    const sessions = await client`select * from "session" limit 1`
    console.log("Session query successful. Rows:", sessions.length)

  } catch (e) {
    console.error("Query failed:", e)
  } finally {
    await client.end()
  }
}

testQuery()
