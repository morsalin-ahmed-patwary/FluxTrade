"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { adminLogin } from "@/lib/admin"
import { Loader2, AlertCircle, ShieldAlert } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

const adminLoginSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

type AdminLoginFormValues = z.infer<typeof adminLoginSchema>

export default function AdminLoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormValues>({
    resolver: zodResolver(adminLoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const onSubmit = async (data: AdminLoginFormValues) => {
    setIsLoading(true)
    setError(null)

    try {
      await adminLogin(data.username, data.password)

      toast({
        title: "Admin Login Successful",
        description: "Welcome to the admin dashboard.",
      })

      router.push("/admin/dashboard")
      router.refresh()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Invalid admin credentials. Please try again."
      setError(errorMessage)

      toast({
        title: "Admin Login Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="username">Admin Username</Label>
        <Input id="username" placeholder="adminUser" {...register("username")} disabled={isLoading} />
        {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" placeholder="••••••••" {...register("password")} disabled={isLoading} />
        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...
          </>
        ) : (
          <>
            <ShieldAlert className="mr-2 h-4 w-4" /> Admin Sign In
          </>
        )}
      </Button>
    </form>
  )
}
