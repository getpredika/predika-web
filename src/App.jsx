import {Routes, Route } from "react-router-dom";
import LandingPage from "@/pages/LandingPage";
import './App.css'
import AuthForm from "./components/auth/AuthForm";

function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthForm />} />
        </Routes>
       
    );
}

export default App
