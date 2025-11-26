import fs from "fs"
import path from "path"

const TESLA_AUTH_URL = "https://auth.tesla.com/oauth2/v3/token"
const TESLA_API_URL = "https://fleet-api.prd.na.vn.cloud.tesla.com"

// Load environment variables
try {
  process.loadEnvFile()
} catch (e) {
  console.log("No .env file found or failed to load it.")
}

async function register() {
  const clientId = process.env.TESLA_CLIENT_ID
  const clientSecret = process.env.TESLA_CLIENT_SECRET
  const domain = "batterydashboard.vercel.app" // Or your actual domain

  if (!clientId || !clientSecret) {
    console.error("Missing TESLA_CLIENT_ID or TESLA_CLIENT_SECRET env vars")
    process.exit(1)
  }

  console.log("1. Generating Partner Token...")
  const tokenRes = await fetch(TESLA_AUTH_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
      scope: "openid vehicle_device_data vehicle_cmds vehicle_charging_cmds",
      audience: TESLA_API_URL,
    }),
  })

  if (!tokenRes.ok) {
    console.error("Failed to get partner token:", await tokenRes.text())
    process.exit(1)
  }

  const tokenData = await tokenRes.json()
  const partnerToken = tokenData.access_token
  console.log("Partner Token acquired.")

  console.log(`2. Registering domain: ${domain}...`)
  const registerRes = await fetch(`${TESLA_API_URL}/api/1/partner_accounts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${partnerToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      domain: domain,
    }),
  })

  if (!registerRes.ok) {
    console.error("Failed to register domain:", await registerRes.text())
    // Don't exit, maybe it's already registered or there's another issue we can debug
  } else {
    console.log("Domain registered successfully!")
    console.log(await registerRes.json())
  }
  
  console.log("\nNote: You must also host your public key at https://<your-domain>/.well-known/appspecific/com.tesla.3p.public-key.pem")
}

register().catch(console.error)
