import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import AdminLoginForm from "@/components/admin-login-form"

export default async function AdminLoginPage() {
  // Check if admin is already logged in
  const token = (await cookies()).get("admin-token")?.value

  if (token) {
    redirect("/admin/dashboard")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">FluxTrade Admin</h1>
        <p className="text-center text-gray-600 mb-8">Admin Access</p>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
          <AdminLoginForm />
        </div>
      </div>
    </main>
  )
}
