import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, ArrowRight, Loader2, Check, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import predikaLogo from "@assets/predika-logo.png";

export default function ResetPassword() {
  const [, setLocation] = useLocation();
  const [emailFromUrl, setEmailFromUrl] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setEmailFromUrl(params.get("email") || "");
  }, []);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();
  const { resetPassword, isResettingPassword } = useAuth();

  const passwordRequirements = [
    { label: "Omwen 8 karaktè", met: password.length >= 8 },
    { label: "Gen yon chif", met: /\d/.test(password) },
    { label: "Gen yon lèt", met: /[a-zA-Z]/.test(password) },
    { label: "Modpas yo matche", met: password.length > 0 && password === confirmPassword },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password.length < 8) {
      toast({ title: "Modpas twò kòt", description: "Modpas dwe gen omwen 8 karaktè", variant: "destructive" });
      return;
    }

    if (password !== confirmPassword) {
      toast({ title: "Modpas yo pa matche", description: "Tanpri asire ou modpas yo menm", variant: "destructive" });
      return;
    }

    if (!emailFromUrl) {
      toast({ title: "Lyen envalid", description: "Lyen reyinisyalizasyon modpas sa a envalid. Tanpri mande yon nouvo.", variant: "destructive" });
      return;
    }

    try {
      await resetPassword({ email: emailFromUrl, password, password_confirmation: confirmPassword });
      setSuccess(true);
    } catch (error: any) {
      const message = error?.message || "Echwe reyinisyalize modpas.";
      toast({ title: "Reyinisyalizasyon echwe", description: message, variant: "destructive" });
    }
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
          {success ? (
            <>
              <CardHeader className="space-y-1 pb-4">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-serif text-center">Modpas reyinisyalize!</CardTitle>
                <CardDescription className="text-center">
                  Modpas ou te reyinisyalize ak siksè. Ou kapab konekte kounye a ak nouvo modpas ou.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/login">
                  <Button className="w-full" data-testid="button-go-login">
                    Alé nan koneksyon
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </>
          ) : (
            <>
              <CardHeader className="space-y-1 pb-4">
                <CardTitle className="text-2xl font-serif text-center">Mete nouvo modpas</CardTitle>
                <CardDescription className="text-center">
                  Kreye yon modpas solid pou kont ou
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Nouvo modpas</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Antre nouvo modpas"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10 pr-10"
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
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Konfime modpas</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Konfime nouvo modpas"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 pr-10"
                        required
                        data-testid="input-confirm-password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        data-testid="button-toggle-confirm-password"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {(password || confirmPassword) && (
                    <div className="space-y-1">
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

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isResettingPassword || !passwordRequirements.every(r => r.met)}
                    data-testid="button-reset-password"
                  >
                    {isResettingPassword ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Ap reyinisyalize...
                      </>
                    ) : (
                      <>
                        Reyinisyalize modpas
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>

                <p className="text-center text-sm text-muted-foreground">
                  <Link href="/login">
                    <span className="text-primary hover:underline cursor-pointer" data-testid="link-back-login">
                      Back to login
                    </span>
                  </Link>
                </p>
              </CardContent>
            </>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
