import { Navigation } from "@/components/navigation"
import { RegistrationForm } from "@/components/registration-form"

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <RegistrationForm />
      </main>
    </div>
  )
}
