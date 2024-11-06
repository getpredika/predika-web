import {Routes, Route } from "react-router-dom";
import LandingPage from "@/pages/landing-page";
import Blog from "@/pages/blog";
import NotFound from "@/pages/not-found";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import ResetPasswordPage from "@/pages/reset-password-page";
import OTPVerificationPage from "@/pages/otp-verification-page";
import NewPasswordPage from "@/pages/new-password-page";
import TextCorrectionPage from "@/pages/text-correction-page";
import {AuthProvider} from "@/context/auth-context";
import PrivateRoute from "@/router/private-route";

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/koneksyon" element={<LoginPage />} />
                <Route path="/anregistre" element={<RegisterPage />} />
                <Route path="/chanje-modpas" element={<ResetPasswordPage />} />
                <Route path="/verifikasyon" element={<OTPVerificationPage />} />
                <Route path="/nouvo-modpas" element={<NewPasswordPage />} />
                <Route path="/atik" element={<Blog />} />
                <Route path="/*" element={<NotFound />} />
                <Route
                    path="koreksyon-grame"
                    element={
                       <PrivateRoute>
                           <TextCorrectionPage />
                       </PrivateRoute>
                    }
                />
            </Routes>
        </AuthProvider>
    );
}

export default App
