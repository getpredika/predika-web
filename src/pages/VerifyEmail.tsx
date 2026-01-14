import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import predikaLogo from "@assets/predika-logo.png";

export default function VerifyEmail() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const emailFromUrl = params.get("email") || "";
  const typeFromUrl = params.get("type");
  const isPasswordReset = typeFromUrl === "password_reset";

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [email] = useState(emailFromUrl);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const { toast } = useToast();
  const { verifyEmail, isVerifying, resendVerification, isResendingVerification } = useAuth();

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      const newCode = [...code];
      pastedCode.forEach((char, i) => {
        if (index + i < 6) {
          newCode[index + i] = char;
        }
      });
      setCode(newCode);
      const nextIndex = Math.min(index + pastedCode.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fullCode = code.join("");
    if (fullCode.length !== 6) {
      toast({ title: "Kòd envalid", description: "Tanpri antre kòd 6 chif la", variant: "destructive" });
      return;
    }

    try {
      await verifyEmail({ otp: fullCode, type: isPasswordReset ? "PASSWORD_RESET" : "VERIFY_EMAIL" });
      if (isPasswordReset) {
        toast({ title: "Kòd verifye!", description: "Ou kapab mete nouvo modpas ou kounye a." });
        setLocation(`/reset-password?email=${encodeURIComponent(email)}`);
      } else {
        toast({ title: "Imèl verifye!", description: "Kont ou aktif kounye a." });
        setLocation("/app");
      }
    } catch (error: any) {
      const message = error?.message || "Verifikasyon echwe. Tanpri eseye ankò.";
      toast({ title: "Verifikasyon echwe", description: message, variant: "destructive" });
    }
  };

  const handleResend = async () => {
    try {
      await resendVerification({ email, type: isPasswordReset ? "PASSWORD_RESET" : "VERIFY_EMAIL" });
      toast({ title: "Kòd voye!", description: "Yon nouvo kòd verifikasyon te voye nan imèl ou." });
      setCountdown(60);
      setCanResend(false);
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      const message = error?.message || "Echwe voye kòd.";
      toast({ title: "Echwe voye", description: message, variant: "destructive" });
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
          <CardHeader className="space-y-1 pb-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-serif text-center">
              {isPasswordReset ? "Antre kòd reyinisyalizasyon" : "Tcheke imèl ou"}
            </CardTitle>
            <CardDescription className="text-center">
              Nou voye yon kòd {isPasswordReset ? "reyinisyalizasyon modpas" : "verifikasyon"} bay<br />
              <span className="font-medium text-foreground">{email || "imèl ou"}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center gap-2">
                {code.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value.replace(/\D/g, ""))}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-mono"
                    data-testid={`input-code-${index}`}
                  />
                ))}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isVerifying || code.join("").length !== 6}
                data-testid="button-verify"
              >
                {isVerifying ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Ap verifye...
                  </>
                ) : (
                  <>
                    {isPasswordReset ? "Verifye kòd" : "Verifye imèl"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Ou pa resevwa kòd la?
              </p>
              {canResend ? (
                <Button
                  variant="ghost"
                  onClick={handleResend}
                  disabled={isResendingVerification}
                  className="text-primary"
                  data-testid="button-resend"
                >
                  {isResendingVerification ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Ap voye...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Voye kòd ankò
                    </>
                  )}
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Voye ank\u00f2 nan <span className="font-medium text-foreground">{countdown}s</span>
                </p>
              )}
            </div>

            <p className="text-center text-sm text-muted-foreground">
              <Link href="/login">
                <span className="text-primary hover:underline cursor-pointer" data-testid="link-back-login">
                  Retounen nan koneksyon
                </span>
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Tcheke dosye spam ou si w pa wè im\u00e8l la
        </p>
      </motion.div>
    </div>
  );
}
