"use client"
import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button';
const GoToDashboard = () => {
  const router = useRouter();
  return (
    <div className='sm:px-5 md:px-0'> 
    <Button onClick={()=>{router.push("/dashboard")}}>
      Go To Dashboard
    </Button>
    </div>
  )
}

export default GoToDashboard
