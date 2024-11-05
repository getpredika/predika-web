import {Routes, Route } from "react-router-dom";
import LandingPage from "@/pages/landing-page";
import Blog from "@/pages/blog";
import NotFound from "@/pages/not-found";
import AuthForm from "@/pages/auth-form";
import TextCorrectionPage from "@/pages/text-correction-page";

function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/koneksyon" element={<AuthForm />} />
            <Route path="/koreksyon-grame" element={<TextCorrectionPage />} />
            <Route path="/atik" element={<Blog />} />
            <Route path="/*" element={<NotFound />} />
        </Routes>
       
    );
}

export default App
