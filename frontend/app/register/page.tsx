import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import RegisterForm from "@/components/register-form"

export default async function RegisterPage() {
  // Check if user is already logged in
  const token = (await cookies()).get("auth-token")?.value

  if (token) {
    redirect("/profile")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <RegisterForm />
      </div>
    </main>
  )
}
