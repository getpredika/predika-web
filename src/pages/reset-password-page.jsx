'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Sparkles } from "lucide-react"
import {Link} from "react-router-dom";
import { Card } from "@/components/ui/card"

export default function ResetPasswordPage() {
    const [email, setEmail] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()
        // Handle password reset request
        console.log('Password reset requested for:', email)
        // Redirect to OTP page or show success message
    }

    return (
        <div className="min-h-screen bg-[#f0faf7] flex flex-col items-center justify-center p-4">
            <Card className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm">
                <div className="flex flex-col items-center space-y-2 mb-8">
                    <Link to="/" className="flex items-center space-x-2">
                        <Sparkles className="h-6 w-6 text-[#40c4a7]" />
                        <span className="font-bold text-xl text-[#2d2d5f]">Predika</span>
                    </Link>
                    <h1 className="text-2xl font-semibold text-[#2d2d5f]">Chanje modpas ou</h1>
                    <p className="text-sm text-gray-500">Antre imèl ou pou w ka chanje modpas ou.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Imèl</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="non@egzanp.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border-gray-200 focus:border-[#40c4a7] focus:ring-0"
                        />
                    </div>
                    <Link to="/verifikasyon">
                    <Button
                        type="submit"
                        className="w-full bg-[#2d2d5f] hover:bg-[#2d2d5f]/90 text-white"
                    >
                        Voye kòd reyinisyalizasyon
                    </Button>
                    </Link>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Sonje modpas ou? {" "}
                    <Link href="/login" className="text-[#40c4a7] hover:underline">
                        Konekte
                    </Link>
                </p>
            </Card>
        </div>
    )
}