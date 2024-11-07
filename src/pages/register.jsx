"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, Eye, EyeOff } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import AccountCreatedAlert from "@/hooks/account-created-alert";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isAccountCreated, setAccountCreated] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Modpas yo pa menm. Tanpri, eseye ankò.");
      return;
    }
    console.log("Form submitted:", formData);
    setAccountCreated(true);
  };

  return (
    <div className="min-h-screen bg-[#f0faf7] flex flex-col items-center justify-center p-4">
        {isAccountCreated && <AccountCreatedAlert />}
      <Card className="w-full max-w-md bg-white p-8 rounded-xl shadow-sm">
        <div className="flex flex-col items-center space-y-2 mb-8">
          <Link to="/" className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6 text-[#40c4a7]" />
            <span className="font-bold text-xl text-[#2d2d5f]">Predika</span>
          </Link>
          <h1 className="text-2xl font-semibold text-[#2d2d5f]">
            Kreye yon kont
          </h1>
          <p className="text-sm text-gray-500">
            Antre enfòmasyon ou pou w ka kreye yon kont.
          </p>
        </div>

        <Button
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Imèl</Label>
            <Input
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              type="email"
              placeholder="non@egzanp.com"
              className="border-gray-200 focus:border-[#40c4a7] focus:ring-0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Modpas</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                placeholder="antre modpas ou"
                value={formData.password}
                onChange={handleInputChange}
                type={showPassword ? "text" : "password"}
                className="border-gray-200 focus:border-[#40c4a7] focus:ring-0 pr-10"
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
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Konfime Modpas</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                placeholder="konfime modpas ou"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                type={showPassword ? "text" : "password"}
                className="border-gray-200 focus:border-[#40c4a7] focus:ring-0 pr-10"
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
          </div>
          <Button
            type="submit"
            className="w-full bg-[#2d2d5f] hover:bg-[#2d2d5f]/90 text-white"
          >
            Kreye Kont
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
  );
}
