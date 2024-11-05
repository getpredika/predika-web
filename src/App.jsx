import {Routes, Route } from "react-router-dom";
import LandingPage from "@/pages/landing-page";
import Blog from "@/pages/blog";
import NotFound from "@/pages/not-found";
import AuthForm from "@/pages/auth-form";

import './App.css'
import AuthForm from "./components/auth/AuthForm";

function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
<<<<<<< HEAD
            <Route path="/koneksyon" element={<AuthForm />} />
            <Route path="/atik" element={<Blog />} />
            <Route path="/*" element={<NotFound />} />
=======
            <Route path="/auth" element={<AuthForm />} />
>>>>>>> auth-form
        </Routes>
       
    );
}

export default App
