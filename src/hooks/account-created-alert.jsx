'use client'

import { useState, useEffect } from 'react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { CheckCircle2Icon, XIcon } from "lucide-react"
import { Button } from '@/components/ui/button'

export default function AccountCreatedAlert() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [isVisible])

  const showAlert = () => {
    setIsVisible(true)
  }


  return (
    <Alert className="mb-4 bg-green-50 border-green-200">
      <CheckCircle2Icon className="h-4 w-4 text-green-600" />
      <AlertTitle className="text-green-800">Success</AlertTitle>
      <AlertDescription className="text-green-700">
        kont ou an kreye avek sikse
      </AlertDescription>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 text-green-600 hover:text-green-800 hover:bg-green-100"
        
      >
        <XIcon className="h-4 w-4" />
      </Button>
    </Alert>
  )
}