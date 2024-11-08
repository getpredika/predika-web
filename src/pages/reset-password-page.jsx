'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {Sparkles} from "lucide-react"
import {Link, useNavigate} from "react-router-dom"
import { Card } from "@/components/ui/card"
import {useAuth} from "@/context/auth-context.jsx";
import * as Yup from "yup";
import {useFormik} from "formik";

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
                navigate('/verifikasyon', { state: {type: 'PASSWORD_RESET', email: values.email} });
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
                        <Sparkles className="h-6 w-6 text-[#40c4a7]"/>
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
                            className={`border-gray-200 focus:border-[#40c4a7] focus:ring-0 ${
                                formik.errors.email && formik.touched.email ? "border-red-500" : ""
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