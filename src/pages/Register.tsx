import { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, Loader2, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { getGoogleOAuthUrl } from "@/api/auth";
import predikaLogo from "@assets/predika-logo.png";

export default function Register() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string; general?: string }>({});
  const { toast } = useToast();
  const { register, isRegistering } = useAuth();

  const passwordRequirements = [
    { label: "Omwen 8 karaktè", met: password.length >= 8 },
    { label: "Gen yon chif", met: /\d/.test(password) },
    { label: "Gen yon lèt", met: /[a-zA-Z]/.test(password) },
  ];

  const clearError = (field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field as keyof typeof newErrors];
      delete newErrors.general;
      return newErrors;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: typeof errors = {};

    if (!fullName.trim()) {
      newErrors.name = "Tanpri antre non konplè ou";
    }

    if (password.length < 8) {
      newErrors.password = "Modpas dwe gen omwen 8 karaktè";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await register({ email, password, fullName: fullName.trim() });
      toast({
        title: "Kont kreye!",
        description: "Tanpri tcheke imèl ou pou wè kòd verifikasyon an."
      });
      setLocation(`/verify-email?email=${encodeURIComponent(email)}`);
    } catch (error: any) {
      const message = error?.message || "Enskripsyon echwe. Tanpri eseye ankò.";
      if (message.toLowerCase().includes("email")) {
        setErrors({ email: message });
      } else {
        setErrors({ general: message });
      }
    }
  };

  const handleGoogleClick = () => {
    window.location.href = getGoogleOAuthUrl();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0faf7] p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#40C4A7]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-64 h-64 bg-[#53CAB0]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-[#40C4A7]/5 rounded-full blur-2xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <Link href="/">
            <div className="inline-flex items-center gap-2 cursor-pointer">
              <img src={predikaLogo} alt="Predika" className="w-10 h-10 rounded-lg" />
              <span className="font-serif font-bold text-2xl">Predika</span>
            </div>
          </Link>
        </div>

        <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-2xl font-serif text-center">Kreye yon kont</CardTitle>
            <CardDescription className="text-center">
              Kòmanse vwayaj aprantisaj vokabilè ou jodi a
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full mb-2 text-gray-600 font-normal"
              type="button"
              onClick={handleGoogleClick}
              data-testid="button-google-register"
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
              Kontinye ak Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-muted-foreground">Oswa kontinye ak imèl</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Non konplè</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Jan Douz"
                    value={fullName}
                    onChange={(e) => { setFullName(e.target.value); clearError("name"); }}
                    className={`pl-10 ${errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    required
                    data-testid="input-full-name"
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Imèl</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="ou@egzanp.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); clearError("email"); }}
                    className={`pl-10 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    required
                    data-testid="input-email"
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Modpas</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Kreye yon modpas solid"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); clearError("password"); }}
                    className={`pl-10 pr-10 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                    required
                    data-testid="input-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    data-testid="button-toggle-password"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.password}
                  </p>
                )}
                {password && !errors.password && (
                  <div className="space-y-1 mt-2">
                    {passwordRequirements.map((req, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <Check className={`w-3 h-3 ${req.met ? "text-green-500" : "text-muted-foreground"}`} />
                        <span className={req.met ? "text-green-600" : "text-muted-foreground"}>
                          {req.label}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {errors.general && (
                <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 p-3 rounded-md" data-testid="error-message">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errors.general}</span>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isRegistering}
                data-testid="button-register"
              >
                {isRegistering ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Ap kreye kont...
                  </>
                ) : (
                  <>
                    Kreye kont
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              Ou deja gen yon kont?{" "}
              <Link href="/login">
                <span className="text-primary hover:underline font-medium cursor-pointer" data-testid="link-login">
                  Konekte
                </span>
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Lè w kreye yon kont, ou dakò ak{" "}
          <Link href="/terms">
            <span className="hover:underline cursor-pointer">Tèm</span>
          </Link>{" "}
          e{" "}
          <Link href="/privacy">
            <span className="hover:underline cursor-pointer">Politik Konfidansyalitè</span>
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
