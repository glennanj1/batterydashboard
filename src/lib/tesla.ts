export const TESLA_API_BASE_URL = "https://fleet-api.prd.na.vn.cloud.tesla.com"

export interface TeslaVehicle {
  id: number
  vehicle_id: number
  vin: string
  display_name: string
  option_codes: string
  color?: string
  state: string
}

export interface TeslaVehicleData {
  drive_state: {
    latitude: number
    longitude: number
    heading: number
    speed: number
  }
  charge_state: {
    battery_level: number
    battery_range: number
    charge_energy_added: number
    charge_miles_added_rated: number
    charge_rate: number
    charging_state: string
    time_to_full_charge: number
  }
  climate_state: {
    inside_temp: number
    outside_temp: number
    driver_temp_setting: number
    passenger_temp_setting: number
    is_climate_on: boolean
  }
  vehicle_state: {
    odometer: number
    locked: boolean
    car_version: string
  }
}

export async function wakeUpVehicle(accessToken: string, vehicleId: number | string): Promise<TeslaVehicle> {
  const res = await fetch(`${TESLA_API_BASE_URL}/api/1/vehicles/${vehicleId}/wake_up`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  })

  if (!res.ok) {
    throw new Error(`Failed to wake vehicle: ${res.statusText}`)
  }

  const data = await res.json()
  return data.response
}

export async function getVehicles(accessToken: string): Promise<TeslaVehicle[]> {
  const res = await fetch(`${TESLA_API_BASE_URL}/api/1/vehicles`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 60 }, // Cache for 60 seconds to respect rate limits
  })

  if (!res.ok) {
    const errorBody = await res.text()
    throw new Error(`Failed to fetch vehicles (${res.status} ${res.statusText}): ${errorBody}`)
  }

  const data = await res.json()
  return data.response
}

export async function getVehicleData(accessToken: string, vehicleId: number | string): Promise<TeslaVehicleData> {
  const res = await fetch(`${TESLA_API_BASE_URL}/api/1/vehicles/${vehicleId}/vehicle_data`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    next: { revalidate: 60 }, // Cache for 60 seconds
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch vehicle data: ${res.statusText}`)
  }

  const data = await res.json()
  return data.response
}
