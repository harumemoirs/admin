import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export default async function AuthLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get("an_token")?.value

 
  if (token) {
    redirect("/dashboard")
  }

  return (
    <div>
      {children}
    </div>
  )
}
