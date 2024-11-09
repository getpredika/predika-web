'use client'

import { useState } from "react"
import { useFormik } from "formik"
import * as Yup from "yup"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/context/auth-context";
import { Link, useNavigate } from "react-router-dom";

const validationSchema = Yup.object().shape({
    email: Yup.string().email("Imèl la pa valid").required("Imèl obligatwa"),
    password: Yup.string()
        .min(8, "Modpas la dwe gen omwen 8 karaktè")
        .required("Modpas obligatwa"),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), null], "Modpas yo pa menm")
        .required("Konfime modpas obligatwa"),
})

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false)
    const { register, googleRedirect } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState(null)

    const formik = useFormik({
        initialValues: {
            email: "",
            password: "",
            confirmPassword: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                await register(values);
                navigate('/verifikasyon', { state: 'VERIFY_EMAIL' });
            } catch (responseError) {
                setError(responseError)
            }
        },
    })

    const handleGoogleAuth = async () => {
        await googleRedirect();
    }

    return (
        <div className="min-h-screen bg-[#f0faf7] flex flex-col items-center justify-center p-4">
            <Card className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm">
                <div className="flex flex-col items-center space-y-2 mb-8">
                    <div className="flex items-center space-x-2">
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
                    </div>
                    <h1 className="text-2xl font-semibold text-[#2d2d5f]">Kreye yon kont</h1>
                    <p className="text-sm text-gray-500">Antre enfòmasyon ou pou w ka kreye yon kont.</p>
                </div>

                <Button
                    onClick={handleGoogleAuth}
                    variant="outline"
                    className="w-full mb-6 text-gray-600 font-normal"
                >
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Kreye kont ak Google
                </Button>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">OUBYEN</span>
                    </div>
                </div>

                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Imèl</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="non@egzanp.com"
                            {...formik.getFieldProps('email')}
                            className={`border-gray-200 focus:border-[#40c4a7] focus:ring-0 ${formik.errors.email && formik.touched.email ? "border-red-500" : ""
                                }`}
                        />
                        {formik.errors.email && formik.touched.email && (
                            <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>
                        )}
                    </div>
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
                        {formik.isSubmitting ? "Ap kreye..." : "Kreye Kont"}
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Ou gen yon kont deja?{" "}
                    <Link to="/koneksyon" className="text-[#40c4a7] hover:underline">
                        Konekte
                    </Link>
                </p>
            </Card>
        </div>
    )
}