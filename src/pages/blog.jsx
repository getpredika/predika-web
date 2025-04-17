"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import MainHeader from "@/components/main-header.jsx";
import SEOHelmet from "@/components/seo-helmet.jsx";
import { useEffect } from "react";
import ReactGA from "react-ga4";

export default function Blog() {
  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: "/atik", title: "Blog" });
  }, []);

  return (
    <>
      <SEOHelmet
        title="Atik - Predika"
        description="Nouvèl, konsèy, ak resous sou Predika."
        keywords="Atik, Nouvèl, Konsèy, PredikaAI"
        imageUrl="https://predika.app/public/predika-logo.png"
        url="https://predika.app/atik"
      />

      <div className="min-h-screen bg-white">
        <MainHeader />
        <section className="w-full py-12 md:py-24 lg:py-32 relative">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at center, #40c4a7 2px, transparent 2px)",
              backgroundSize: "24px 24px",
              opacity: 0.1,
            }}
          />
          <div className="container px-4 md:px-6 relative">
            <div className="flex flex-col items-center text-center space-y-8">
              <div className="space-y-6">
                <span className="text-sm font-medium text-[#40c4a7] bg-[#40c4a7]/10 px-4 py-1.5 rounded-full">
                  ATIK
                </span>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none text-[#2d2d5f] max-w-3xl mx-auto">
                  Nouvèl, konsèy ak resous
                  <br />
                  sou PredikaAI
                </h1>
              </div>
              <div className="w-full max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="search"
                    placeholder="Chèche atik"
                    className="w-full pl-10 py-6 text-base rounded-xl border-gray-200 bg-white/80 backdrop-blur-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
