import { auth } from "@/auth"
import { BatteryDashboard } from "@/components/battery-dashboard"
import { Button } from "@/components/ui/button"
import { signOut } from "@/auth"
import { getVehicles, getVehicleData } from "@/lib/tesla"

export default async function Home() {
  const session = await auth()
  let vehicleData = null
  let vehicleId = null
  let error = null

  if (session && (session as any).accessToken) {
    try {
      const vehicles = await getVehicles((session as any).accessToken)
      if (vehicles && vehicles.length > 0) {
        vehicleId = vehicles[0].id
        try {
          vehicleData = await getVehicleData((session as any).accessToken, vehicleId)
        } catch (err: any) {
          console.error("Error fetching vehicle data:", err)
          // If vehicle is asleep, we still want to show the dashboard with the wake button
        }
      }
    } catch (err: any) {
      console.error("Error fetching Tesla data:", err)
      error = err.message || "An unknown error occurred"
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-background">
      <div className="w-full max-w-6xl space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Welcome back, {session?.user?.name || "User"}
            </p>
          </div>
          <form
            action={async () => {
              "use server"
              await signOut()
            }}
          >
            <Button variant="outline">Sign Out</Button>
          </form>
        </div>

        <BatteryDashboard vehicleData={vehicleData} vehicleId={vehicleId} error={error} />
      </div>
    </main>
  )
}
