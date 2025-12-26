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
      toast({ title: "Invalid code", description: "Please enter the 6-digit code", variant: "destructive" });
      return;
    }

    try {
      await verifyEmail({ email, token: fullCode });
      toast({ title: "Email verified!", description: "Your account is now active." });
      setLocation("/app");
    } catch (error: any) {
      const message = error?.message || "Verification failed. Please try again.";
      toast({ title: "Verification failed", description: message, variant: "destructive" });
    }
  };

  const handleResend = async () => {
    try {
      await resendVerification({ email });
      toast({ title: "Code sent!", description: "A new verification code has been sent to your email." });
      setCountdown(60);
      setCanResend(false);
      setCode(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } catch (error: any) {
      const message = error?.message || "Failed to resend code.";
      toast({ title: "Failed to resend", description: message, variant: "destructive" });
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
            <CardTitle className="text-2xl font-serif text-center">Check your email</CardTitle>
            <CardDescription className="text-center">
              We sent a verification code to<br />
              <span className="font-medium text-foreground">{email || "your email"}</span>
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
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify email
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Didn't receive the code?
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
                      Sending...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Resend code
                    </>
                  )}
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Resend in <span className="font-medium text-foreground">{countdown}s</span>
                </p>
              )}
            </div>

            <p className="text-center text-sm text-muted-foreground">
              <Link href="/login">
                <span className="text-primary hover:underline cursor-pointer" data-testid="link-back-login">
                  Back to login
                </span>
              </Link>
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Check your spam folder if you don't see the email
        </p>
      </motion.div>
    </div>
  );
}
