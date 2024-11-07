'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, CheckCircle } from "lucide-react"
import { Link } from "react-router-dom"

export default function PasswordChangeSuccessPage() {
    return (
        <div className="min-h-screen bg-[#f0faf7] flex flex-col items-center justify-center p-4">
            <Card className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm">
                <div className="flex flex-col items-center space-y-6 mb-8">
                    <Link to="/" className="flex items-center space-x-2">
                        <Sparkles className="h-6 w-6 text-[#40c4a7]" />
                        <span className="font-bold text-xl text-[#2d2d5f]">Predika</span>
                    </Link>
                    <CheckCircle className="h-16 w-16 text-[#40c4a7]" />
                    <h1 className="text-2xl font-semibold text-[#2d2d5f] text-center">Modpas ou chanje avèk siksè!</h1>
                    <p className="text-sm text-gray-500 text-center">Ou ka kounye a konekte ak nouvo modpas ou a.</p>
                </div>

                <Link to="/koneksyon" className="block w-full">
                    <Button
                        className="w-full bg-[#2d2d5f] hover:bg-[#2d2d5f]/90 text-white"
                    >
                        Koneksyon
                    </Button>
                </Link>
            </Card>
        </div>
    )
}