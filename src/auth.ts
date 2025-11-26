import NextAuth from "next-auth"

// Custom Tesla Provider Configuration
// Reference: https://developer.tesla.com/docs/fleet-api/authentication/overview
const TeslaProvider = {
  id: "tesla",
  name: "Tesla",
  type: "oauth" as const,
  issuer: "https://auth.tesla.com/oauth2/v3/nts",
  authorization: {
    url: "https://auth.tesla.com/oauth2/v3/authorize",
    params: {
      scope: "openid email offline_access user_data vehicle_device_data vehicle_cmds vehicle_charging_cmds",
      // Note: Tesla requires the redirect_uri to be exactly as registered.
      // NextAuth defaults to [origin]/api/auth/callback/[provider]
    },
  },
  token: "https://auth.tesla.com/oauth2/v3/token",
  client: {
    token_endpoint_auth_method: "client_secret_post",
  },
  userinfo: "https://fleet-api.prd.na.vn.cloud.tesla.com/api/1/users/me",
  clientId: process.env.TESLA_CLIENT_ID,
  clientSecret: process.env.TESLA_CLIENT_SECRET,
  profile(profile: any) {
    return {
      id: profile.email,
      name: profile.full_name || "Tesla User",
      email: profile.email,
      image: profile.profile_image_url,
    }
  },
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    {
      ...TeslaProvider,
      // Fallback for mock environment
      clientId: process.env.TESLA_CLIENT_ID,
      clientSecret: process.env.TESLA_CLIENT_SECRET,
    },
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
        token.refreshToken = account.refresh_token
        token.expiresAt = account.expires_at
      }
      return token
    },
    async session({ session, token }) {
      // @ts-ignore
      session.accessToken = token.accessToken
      // @ts-ignore
      session.refreshToken = token.refreshToken
      return session
    },
  },
})
