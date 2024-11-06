'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sparkles } from "lucide-react"
import {Link} from "react-router-dom";
import { Card } from "@/components/ui/card"

export default function OTPVerificationPage() {
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [timeLeft, setTimeLeft] = useState(60)
    const [canResend, setCanResend] = useState(false)

    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
            return () => clearTimeout(timerId)
        } else {
            setCanResend(true)
        }
    }, [timeLeft])

    const handleOtpChange = (index, value) => {
        if (value.length <= 1 && /^\d*$/.test(value)) {
            const newOtp = [...otp]
            newOtp[index] = value
            setOtp(newOtp)

            // Move focus to next input
            if (value && index < 5) {
                const nextInput = document.getElementById(`otp-${index + 1}`)
                nextInput?.focus()
            }
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const otpString = otp.join('')
        console.log('OTP submitted:', otpString)
        // Verify OTP and redirect to new password page
    }

    const handleResendCode = () => {
        if (canResend) {
            console.log('Resending code...')
            setTimeLeft(60)
            setCanResend(false)
            // Implement resend logic here
        }
    }

    return (
        <div className="min-h-screen bg-[#f0faf7] flex flex-col items-center justify-center p-4">
            <Card className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm">
                <div className="flex flex-col items-center space-y-2 mb-8">
                    <Link to="/" className="flex items-center space-x-2">
                        <Sparkles className="h-6 w-6 text-[#40c4a7]" />
                        <span className="font-bold text-xl text-[#2d2d5f]">Predika</span>
                    </Link>
                    <h1 className="text-2xl font-semibold text-[#2d2d5f]">Verifye kòd OTP</h1>
                    <p className="text-sm text-gray-500">Antre kòd 6 chif nou voye ba ou a.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex justify-between mb-4 space-x-3">
                        {otp.map((digit, index) => (
                            <Input
                                key={index}
                                id={`otp-${index}`}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                className="w-12 h-12 text-center text-2xl border-gray-200 focus:border-[#40c4a7] focus:ring-0"
                            />
                        ))}
                    </div>
                    <Link to="/nouvo-modpas">
                    <Button
                        type="submit"
                        className="w-full bg-[#2d2d5f] hover:bg-[#2d2d5f]/90 text-white"
                    >
                        Verifye kòd
                    </Button>
                </Link>
                </form>

                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-500">
                        Pa resevwa kòd la? {" "}
                        {canResend ? (
                            <button onClick={handleResendCode} className="text-[#40c4a7] hover:underline">
                                Revoye kòd
                            </button>
                        ) : (
                            <span>Revoye kòd nan {timeLeft} segonn</span>
                        )}
                    </p>
                </div>
            </Card>
        </div>
    )
}