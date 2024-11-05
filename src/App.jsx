import {Routes, Route } from "react-router-dom";
import LandingPage from "@/pages/landing-page";
import Blog from "@/pages/blog";
import NotFound from "@/pages/not-found";
import './App.css'

function App() {
    return (
        <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/atik" element={<Blog />} />
            <Route path="/*" element={<NotFound />} />
        </Routes>
    );
}

export default App
