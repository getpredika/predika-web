import {Routes, Route } from "react-router-dom";
import LandingPage from "@/pages/landing-page";
import './App.css'
import Blog from "@/pages/blog";

function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/atik" element={<Blog />} />
        </Routes>
    );
}

export default App
