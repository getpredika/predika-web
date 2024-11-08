'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import * as Yup from "yup";
import { useFormik } from "formik";

const validationSchema = Yup.object().shape({
    password: Yup.string()
        .min(8, "Modpas la dwe gen omwen 8 karaktè")
        .required("Modpas obligatwa"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Modpas yo pa menm")
        .required("Konfime modpas obligatwa"),
})

export default function NewPasswordPage() {
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState(null)
    const { resetPassword } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const formik = useFormik({
        initialValues: {
            password: "",
            confirmPassword: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                const data = { email: location.state, password: values.password, password_confirmation: values.confirmPassword }
                await resetPassword(data);
                navigate('/modpas-chanje-sikse');
            } catch (responseError) {
                setError(responseError)
            }
        },
    })

    return (
        <div className="min-h-screen bg-[#f0faf7] flex flex-col items-center justify-center p-4">
            <Card className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm">
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
                    <h1 className="text-2xl font-semibold text-[#2d2d5f]">Kreye nouvo modpas</h1>
                    <p className="text-sm text-gray-500">Antre nouvo modpas ou.</p>
                </div>

                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="password">Modpas</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="antre modpas ou"
                                {...formik.getFieldProps('password')}
                                className={`border-gray-200 focus:border-[#40c4a7] focus:ring-0 pr-10 ${formik.errors.password && formik.touched.password ? "border-red-500" : ""
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        {formik.errors.password && formik.touched.password && (
                            <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Konfime Modpas</Label>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                placeholder="konfime modpas ou"
                                {...formik.getFieldProps('confirmPassword')}
                                className={`border-gray-200 focus:border-[#40c4a7] focus:ring-0 pr-10 ${formik.errors.confirmPassword && formik.touched.confirmPassword ? "border-red-500" : ""
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? (
                                    <EyeOff className="h-5 w-5" />
                                ) : (
                                    <Eye className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                        {formik.errors.confirmPassword && formik.touched.confirmPassword && (
                            <p className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</p>
                        )}
                    </div>

                    {error && (
                        <p className="text-red-500 text-xs mt-4 text-center">{error}</p>
                    )}

                    <Button
                        type="submit"
                        disabled={formik.isSubmitting}
                        className="w-full bg-[#2d2d5f] hover:bg-[#2d2d5f]/90 text-white"
                    >
                        {formik.isSubmitting ? "Tann..." : "Chanje Modpas"}
                    </Button>
                </form>
            </Card>
        </div>
    )
}