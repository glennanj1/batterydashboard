"use server"

import { auth } from "@/auth"
import { wakeUpVehicle } from "@/lib/tesla"
import { revalidatePath } from "next/cache"

export async function wakeUp(vehicleId: number | string) {
  const session = await auth()
  if (!session || !(session as any).accessToken) {
    throw new Error("Unauthorized")
  }

  try {
    await wakeUpVehicle((session as any).accessToken, vehicleId)
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("Failed to wake up vehicle:", error)
    return { success: false, error: "Failed to wake up vehicle" }
  }
}
