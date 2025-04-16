"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { login } from "@/lib/auth"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
})

type LoginFormValues = z.infer<typeof loginSchema>

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true)
    setError(null)

    try {
      await login(data.email, data.password)

      toast({
        title: "Login Successful",
        description: "Welcome to Trading Platform! You've been logged in successfully.",
      })

      router.push("/profile")
      router.refresh()
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Invalid email or password. Please try again."
      setError(errorMessage)

      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
    <CardHeader className="space-y-1">
      <CardTitle className="text-2xl">Sign in</CardTitle>
      <CardDescription>Enter your email and password to sign in</CardDescription>
    </CardHeader>
    <CardContent className="grid gap-4">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-blue-700">Welcome Back</h2>
          <p className="text-gray-600">Sign in to your trading account</p>
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-blue-700 font-medium">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            {...register("email")}
            disabled={isLoading}
            className="bg-blue-50 border-blue-200 focus:border-blue-400 focus:ring-blue-300"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
        </div>
        <div className="grid gap-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-blue-700 font-medium">
              Password
            </Label>
            <Button variant="link" className="p-0 h-auto text-xs text-blue-600 hover:text-blue-800">
              Forgot password?
            </Button>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            {...register("password")}
            disabled={isLoading}
            className="bg-blue-50 border-blue-200 focus:border-blue-400 focus:ring-blue-300"
          />
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
        </div>
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-800 text-white"
          disabled={isLoading}
        >
          Sign In
        </Button>
      </form>
    </CardContent>
  </Card>
  )
}
