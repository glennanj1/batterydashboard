import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { LoginForm } from "@/components/login-form"

export default async function LandingPage() {
    const session = await auth()

    if (session) {
        redirect("/dashboard")
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight">Tesla Dashboard</h1>
                    <p className="mt-2 text-muted-foreground">
                        Monitor and control your Tesla fleet securely.
                    </p>
                </div>
                <LoginForm />
            </div>
        </div>
    )
}
