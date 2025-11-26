"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Battery, Zap, Navigation, Thermometer } from "lucide-react"
import {
    Area,
    AreaChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts"

import { TeslaVehicleData } from "@/lib/tesla"
import { wakeUp } from "@/app/actions"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

// Mock data for the charging curve (keep for now as history API is complex)
const mockHistoryData = [
    { time: "00:00", level: 45 },
    { time: "04:00", level: 42 },
    { time: "08:00", level: 40 },
    { time: "12:00", level: 35 },
    { time: "16:00", level: 60 }, // Charging started
    { time: "20:00", level: 85 },
    { time: "24:00", level: 82 },
]

interface BatteryDashboardProps {
    vehicleData?: TeslaVehicleData | null
    vehicleId?: number | null
    error?: string | null
}

export function BatteryDashboard({ vehicleData, vehicleId, error }: BatteryDashboardProps) {
    const [isWaking, setIsWaking] = useState(false)

    const handleWakeUp = async () => {
        if (!vehicleId) return
        setIsWaking(true)
        try {
            await wakeUp(vehicleId)
        } catch (error) {
            console.error("Failed to wake up", error)
        } finally {
            setIsWaking(false)
        }
    }

    if (error) {
        return (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-8 text-center text-destructive">
                <h3 className="text-lg font-semibold">Error Loading Data</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                    {error}
                </p>
                <div className="mt-4">
                    <Button variant="outline" onClick={() => window.location.reload()}>
                        Retry
                    </Button>
                </div>
            </div>
        )
    }

    if (!vehicleData) {
        return (
            <div className="text-center p-8 space-y-4">
                <p className="text-muted-foreground">
                    {vehicleId
                        ? "Vehicle is asleep or unreachable. Try waking it up."
                        : "No vehicle found. Please ensure your Tesla account has a vehicle linked."}
                </p>
                {vehicleId && (
                    <Button onClick={handleWakeUp} disabled={isWaking}>
                        {isWaking && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isWaking ? "Waking Up..." : "Wake Up Vehicle"}
                    </Button>
                )}
            </div>
        )
    }

    const { charge_state, drive_state, climate_state, vehicle_state } = vehicleData

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Battery Level</CardTitle>
                    <Battery className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{charge_state.battery_level}%</div>
                    <Progress value={charge_state.battery_level} className="mt-2" />
                    <p className="text-xs text-muted-foreground mt-2">
                        ~{charge_state.battery_range.toFixed(0)} mi range
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Charging Status</CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{charge_state.charging_state}</div>
                    <Badge variant={charge_state.charging_state === "Charging" ? "default" : "secondary"} className="mt-2">
                        {charge_state.charging_state === "Charging" ? `${charge_state.charge_rate} mph` : "Idle"}
                    </Badge>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Location</CardTitle>
                    <Navigation className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {drive_state.speed !== null ? `${drive_state.speed} mph` : "Parked"}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        Lat: {drive_state.latitude.toFixed(4)}, Long: {drive_state.longitude.toFixed(4)}
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Temperature</CardTitle>
                    <Thermometer className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{climate_state.outside_temp}°C</div>
                    <p className="text-xs text-muted-foreground">
                        Interior: {climate_state.inside_temp}°C
                    </p>
                </CardContent>
            </Card>

            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Battery History</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                    <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mockHistoryData}>
                                <defs>
                                    <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="time"
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                />
                                <YAxis
                                    stroke="#888888"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    tickFormatter={(value) => `${value}%`}
                                />
                                <Tooltip />
                                <Area
                                    type="monotone"
                                    dataKey="level"
                                    stroke="#8884d8"
                                    fillOpacity={1}
                                    fill="url(#colorLevel)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
