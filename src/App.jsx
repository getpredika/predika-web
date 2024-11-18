import { Routes, Route } from "react-router-dom";
import LandingPage from "@/pages/landing-page";
import Blog from "@/pages/blog";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import ResetPasswordPage from "@/pages/reset-password-page";
import OTPVerificationPage from "@/pages/otp-verification-page";
import NewPasswordPage from "@/pages/new-password-page";
import PasswordChangeSuccessPage from "@/pages/password-change-success-page";
import TextCorrectionPage from "@/pages/text-correction-page";
import TermsOfService from "@/pages/terms-of-service";
import PrivacyPolicy from "@/pages/privacy-policy";
import { AuthProvider } from "@/context/auth-context";
import PrivateRoute from "@/router/private-route";
import GoogleCallback from "./pages/google-callback";
import DictionaryPage from "./pages/dictionary-page";
import {HelmetProvider} from "react-helmet-async";

function App() {
    return (
        <HelmetProvider>
            <AuthProvider>
            <Routes>
                <Route path="/" index={true} element={<LandingPage />} />
                <Route path="/koneksyon" element={<LoginPage />} />
                <Route path="/anregistre" element={<RegisterPage />} />
                <Route path="/chanje-modpas" element={<ResetPasswordPage />} />
                <Route path="/verifikasyon" element={<OTPVerificationPage />} />
                <Route path="/nouvo-modpas" element={<NewPasswordPage />} />
                <Route path="/modpas-chanje-sikse" element={<PasswordChangeSuccessPage />} />
                <Route path="/atik" element={<Blog />} />
                <Route path="/*" element={<NotFound />} />
                <Route path="/politik-konfidansyalite" element={<PrivacyPolicy />} />
                <Route path="/tem" element={<TermsOfService />} />
                <Route path="/auth/google/callback" element={<GoogleCallback />} />
                <Route path="/diksyonè" element={<DictionaryPage />} />
                <Route
                    path="/koreksyon-grame"
                    element={
                        <PrivateRoute>
                            <TextCorrectionPage />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </AuthProvider>
        </HelmetProvider>
    );
}

export default App
