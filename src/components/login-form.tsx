"use client"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { signIn } from "next-auth/react"
import { Zap } from "lucide-react"

export function LoginForm() {
    return (
        <Card className="mx-auto max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl">Login</CardTitle>
                <CardDescription>
                    Connect your Tesla account to view your fleet dashboard.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4">
                    <Button
                        variant="outline"
                        className="w-full flex items-center gap-2"
                        onClick={() => signIn("tesla", { callbackUrl: "/" })}
                    >
                        <Zap className="h-4 w-4 fill-current" />
                        Sign in with Tesla
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
