import postgres from "postgres"

// Load env vars like Next.js does
try {
  process.loadEnvFile()
} catch (e) {
  console.log("No .env file loaded")
}

const url = process.env.DATABASE_URL || "postgres://postgres:postgres@localhost:5433/batterydashboard"

// Mask password for output
const maskedUrl = url.replace(/:([^:@]+)@/, ":****@")
console.log(`Connecting to: ${maskedUrl}`)

const sql = postgres(url)

async function check() {
  try {
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `
    
    console.log("Tables found:", tables.map(t => t.table_name))
    
    if (tables.length === 0) {
      console.log("WARNING: No tables found in public schema!")
    }
  } catch (e) {
    console.error("Connection failed:", e)
  } finally {
    await sql.end()
  }
}

check()
