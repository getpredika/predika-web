'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom"
import { Card } from "@/components/ui/card"
import { useAuth } from "@/context/auth-context.jsx";
import * as Yup from "yup";
import { useFormik } from "formik";

const validationSchema = Yup.object().shape({
    email: Yup.string().email("Imèl la pa valid").required("Imèl obligatwa"),
})

export default function ResetPasswordPage() {
    const { forgotPassword } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState(null)

    const formik = useFormik({
        initialValues: {
            email: "",
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                await forgotPassword(values);
                navigate('/verifikasyon', { state: { type: 'PASSWORD_RESET', email: values.email } });
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
                    <h1 className="text-2xl font-semibold text-[#2d2d5f]">Reyinisyalize modpas ou</h1>
                    <p className="text-sm text-gray-500">Antre imèl ou pou w ka reyinisyalize modpas ou.</p>
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

                    {error && (
                        <p className="text-red-500 text-xs mt-4 text-center">{error}</p>
                    )}

                    <Button
                        type="submit"
                        disabled={formik.isSubmitting}
                        className="w-full bg-[#2d2d5f] hover:bg-[#2d2d5f]/90 text-white"
                    >
                        {formik.isSubmitting ? "Tann..." : "Voye kòd reyinisyalizasyon"}
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Sonje modpas ou? {" "}
                    <Link to="/koneksyon" className="text-[#40c4a7] hover:underline">
                        Konekte
                    </Link>
                </p>
            </Card>
        </div>
    )
}