"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, EyeOff } from "react-feather";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Form submitted");
  };

  const handleSocialLogin = (provider) => {
    console.log(`Logging in with ${provider}`);
  };

  const PasswordInput = ({ id }) => {
    const [isVisible, setIsVisible] = useState(false);
  
    return (
      <div className="relative">
        <Input
          id={id}
          type={isVisible ? "text" : "password"}
          required
          className="pr-10" // Ensure there's padding on the right
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center justify-center"
          onClick={() => setIsVisible(!isVisible)}
          aria-label={isVisible ? "Hide password" : "Show password"}
        >
          {isVisible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </Button>
      </div>
    );
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col lg:flex-row w-full max-w-4xl gap-8">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>{isLogin ? "Konekte" : "Anrejistre"}</CardTitle>
            <CardDescription>
              {isLogin
                ? "Antre imel ak modpas ou pou ou konekte."
                : "Kreye yon kont pou ou komanse."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login" onClick={() => setIsLogin(true)}>
                  Konekte
                </TabsTrigger>
                <TabsTrigger value="register" onClick={() => setIsLogin(false)}>
                  Anrejistre
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Imel</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="m@egzanp.com"
                      required
                    />
                  </div>
                  <div className="space-y-2 relative">
                    <Label htmlFor="login-password">Modpas</Label>
                    <PasswordInput
                      id="login-password"
                      showPassword={showPassword}
                      setShowPassword={setShowPassword}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Konekte
                  </Button>
                </form>
              </TabsContent>
              <TabsContent value="register">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Imel</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="m@egzanp.com"
                      required
                    />
                  </div>
                  <div className="space-y-2 relative">
                    <Label htmlFor="register-password">Modpas</Label>
                    <PasswordInput
                      id="register-password"
                      showPassword={showPassword}
                      setShowPassword={setShowPassword}
                    />
                  </div>
                  <div className="space-y-2 relative">
                    <Label htmlFor="confirm-password">Konfime modpas</Label>
                    <PasswordInput
                      id="confirm-password"
                      showPassword={showConfirmPassword}
                      setShowPassword={setShowConfirmPassword}
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Anrejistre
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Oubyen Konekte Avek
                  </span>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin("Google")}
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fab"
                    data-icon="google"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 488 512"
                  >
                    <path
                      fill="currentColor"
                      d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                    ></path>
                  </svg>
                  Google
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin("Facebook")}
                >
                  <svg
                    className="mr-2 h-4 w-4"
                    aria-hidden="true"
                    focusable="false"
                    data-prefix="fab"
                    data-icon="facebook-f"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 320 512"
                  >
                    <path
                      fill="currentColor"
                      d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"
                    ></path>
                  </svg>
                  Facebook
                </Button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
              <Button
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
                className="pl-1"
              >
                {isLogin ? "Register" : "Login"}
              </Button>
            </p>
          </CardFooter>
        </Card>

        <Card className="flex-1 bg-[#f0faf7] border border-lightGray rounded-lg shadow-lg p-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-sans text-2xl text-[#2d2d5f]">
              Byenvini sou PREDIKA
            </CardTitle>
            <CardDescription className="text-[#6b7280] text-lg">
              Yon entèlijans atifisyèl ki antrene korije tèks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-[#6b7280] text-base leading-relaxed">
              <p>
                Mèsi paske ou te vin jwenn nou. Ou ka kòmanse eksplore
                karakteristik nou yo ak amelyore konpetans ou nan ekriti. Nou la
                pou sipòte ou nan chak etap. Pa ezite sèvi ak zouti nou yo pou
                korije erè, jwenn sijesyon pou nouvo mo, ak aprann plis sou
                gramè Kreyòl Ayisyen.
              </p>
              <p>
                Nou swete ou yon bèl eksperyans pandan w ap itilize platfòm nan!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
