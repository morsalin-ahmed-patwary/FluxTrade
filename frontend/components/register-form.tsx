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
import { register as registerUser } from "@/lib/auth"
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const registerSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  profilePicture: z.string().url({ message: "Please enter a valid URL" }).optional(),
  referralCode: z.string().optional(), // Optional referral code field
})

type RegisterFormValues = z.infer<typeof registerSchema>

export default function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      profilePicture: "https://ui-avatars.com/api/?background=random",
      referralCode: "", // default empty referral code field
    },
  })

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      // Call the registerUser API passing referralCode (if provided)
      await registerUser(
        data.username,
        data.email,
        data.password,
        data.profilePicture || "https://ui-avatars.com/api/?background=random",
        data.referralCode
      )

      setSuccess("Account created successfully! You can now log in.")
      reset()
      toast({
        title: "Registration Successful",
        description: "Your trading account has been created. Please log in to start trading.",
      })

      // Automatically redirect to login after a short delay
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create account. Please try again."
      setError(errorMessage)
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="border-blue-200 overflow-hidden">
      <div className="h-2 bg-gradient-to-r from-blue-400 to-blue-600"></div>
      <CardHeader className="bg-blue-50">
        <CardTitle className="text-2xl text-blue-700">Create Trading Account</CardTitle>
        <CardDescription className="text-blue-600">
          Join our community of traders and start your journey today
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="username" className="text-blue-700 font-medium">Username</Label>
            <Input 
              id="username" 
              placeholder="johndoe" 
              {...register("username")} 
              disabled={isLoading} 
              className="border-blue-200 bg-blue-50 focus:border-blue-400 focus:ring-blue-300"
            />
            {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-blue-700 font-medium">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@example.com" 
              {...register("email")} 
              disabled={isLoading} 
              className="border-blue-200 bg-blue-50 focus:border-blue-400 focus:ring-blue-300"
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-blue-700 font-medium">Password</Label>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              {...register("password")} 
              disabled={isLoading} 
              className="border-blue-200 bg-blue-50 focus:border-blue-400 focus:ring-blue-300"
            />
            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="profilePicture" className="text-blue-700 font-medium">Profile Picture URL (optional)</Label>
            <Input
              id="profilePicture"
              placeholder="https://example.com/profile.jpg"
              {...register("profilePicture")}
              disabled={isLoading}
              className="border-blue-200 bg-blue-50 focus:border-blue-400 focus:ring-blue-300"
            />
            {errors.profilePicture && <p className="text-sm text-red-500">{errors.profilePicture.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="referralCode" className="text-blue-700 font-medium">Referral Code (if you have one)</Label>
            <Input
              id="referralCode"
              placeholder="Enter referral code (optional)"
              {...register("referralCode")}
              disabled={isLoading}
              className="border-blue-200 bg-blue-50 focus:border-blue-400 focus:ring-blue-300"
            />
            {errors.referralCode && <p className="text-sm text-red-500">{errors.referralCode.message}</p>}
          </div>

          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white mt-6" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...
              </>
            ) : (
              "Create Trading Account"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
