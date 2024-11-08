'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/context/auth-context";

export default function OTPVerificationPage() {
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [timeLeft, setTimeLeft] = useState(60)
    const [canResend, setCanResend] = useState(false)
    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const { verifyOtp, sendOtp } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

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
            setError("")

            // Move focus to next input
            if (value && index < 5) {
                const nextInput = document.getElementById(`otp-${index + 1}`)
                nextInput?.focus()
            }
            // Move focus to previous input on backspace
            if (value === "" && index > 0) {
                const prevInput = document.getElementById(`otp-${index - 1}`)
                prevInput?.focus()
            }
        }
    }

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`)
            prevInput?.focus()
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const otpString = otp.join('')

        if (otpString.length !== 6) {
            setError("Tanpri antre yon kòd OTP ki gen 6 chif")
            return
        }

        setIsSubmitting(true)
        setError("")

        try {
            await verifyOtp({ otp: otpString, type: location.state.type });
            if (location.state.type === 'PASSWORD_RESET') {
                navigate('/nouvo-modpas', { state: location.state.email })
            } else {
                navigate('/');
            }
        } catch (responseError) {
            setError(responseError)
            setIsSubmitting(false)
        }
    }

    const handleResendCode = async () => {
        if (canResend) {
            setTimeLeft(60)
            setCanResend(false)
            setOtp(['', '', '', '', '', ''])
            setError("")

            try {
                await sendOtp({ email: location.state.email, type: location.state.type });
            } catch (responseError) {
                setError(responseError)
            }
        }
    }

    return (
        <div className="min-h-screen bg-[#f0faf7] flex flex-col items-center justify-center p-4">
            <Card className="w-full max-w-md bg-white p-4 sm:p-8 rounded-xl shadow-sm">
                <div className="flex flex-col items-center space-y-2 mb-8">
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
                    <h1 className="text-2xl font-semibold text-[#2d2d5f]">Verifye kòd OTP</h1>
                    <p className="text-sm text-gray-500">Antre kòd 6 chif nou voye ba ou a.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-6 gap-2 sm:gap-3">
                        {otp.map((digit, index) => (
                            <Input
                                key={index}
                                id={`otp-${index}`}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-full h-12 sm:h-14 text-center text-lg sm:text-2xl border-2 focus:border-[#40c4a7] focus:ring-1 focus:ring-[#40c4a7] transition-all duration-200"
                                aria-label={`Digit ${index + 1}`}
                            />
                        ))}
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 text-center mt-2" role="alert">
                            {error}
                        </p>
                    )}

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-[#2d2d5f] hover:bg-[#2d2d5f]/90 text-white h-11"
                    >
                        {isSubmitting ? "Verifikasyon..." : "Verifye kòd"}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        Pa resevwa kòd la? {" "}
                        {canResend ? (
                            <button
                                onClick={handleResendCode}
                                className="text-[#40c4a7] hover:underline focus:outline-none focus:ring-2 focus:ring-[#40c4a7] focus:ring-offset-2 rounded-sm"
                            >
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