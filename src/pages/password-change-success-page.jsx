'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import { Link } from "react-router-dom"

export default function PasswordChangeSuccessPage() {
    return (
        <div className="min-h-screen bg-[#f0faf7] flex flex-col items-center justify-center p-4">
            <Card className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm">
                <div className="flex flex-col items-center space-y-6 mb-8">
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-6 h-6">
                            <svg
                                viewBox="0 0 100 100"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-full h-full"
                            >
                                <circle cx="50" cy="50" r="50" className="fill-[#2d2d5f]" />
                                <path
                                    d="M30 25H55C67.1503 25 77 34.8497 77 47C77 59.1503 67.1503 69 55 69H45V75H30V25ZM45 54H55C58.866 54 62 50.866 62 47C62 43.134 58.866 40 55 40H45V54Z"
                                    className="fill-[#40c4a7]"
                                />
                            </svg>
                        </div>
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