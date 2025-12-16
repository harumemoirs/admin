/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState } from "react"
import { cn } from "@/src/lib/utils"
import { Button } from "@/src/components/ui/button"
import { toast } from "sonner"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/src/components/ui/field"
import { Input } from "@/src/components/ui/input"
import { loginAdmin } from "../functions/services/auth-service"
import { useRouter } from "next/navigation"
import Link from "next/link"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const data = await loginAdmin(email, password)
      console.log("Login successful:", data)

      toast.success("Logged in successfully! 🎉")
      router.push("/")
      
    } catch (err: any) {
      console.log(err)

      
      const status = err?.response?.status || err?.status

      if (status === 401) {
        toast.error("Wrong credentials ❌")
        setError("Incorrect email or password.")
      } 
      else if (status === 500) {
        toast.error("Server error. Try again later ⚠️")
        setError("Oops! Something went wrong on our end.")
      } 
      else {
        toast.error("Unexpected error occurred")
        setError(err?.message || "Something went wrong")
      }

    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Welcome back! Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </Field>

        <Field>
          <div className="flex items-center justify-between">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Link 
              href="/auth/forgot-password" 
              className="text-sm text-primary hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </Field>

        <Field>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  )
}