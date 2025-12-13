/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import axios from "axios"

export function useAdmin() {
  const [admin, setAdmin] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/kairos/v1/admin/auth/me`,
          {
            withCredentials: true,
          }
        )
        setAdmin(res.data.admin)
      } catch (error) {
        console.error("Failed to fetch /me", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMe()
  }, [])

  return { admin, loading }
}
