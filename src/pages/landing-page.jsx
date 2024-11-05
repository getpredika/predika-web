'use client'

import { Button } from "@/components/ui/button"
import React from "react"
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision"
import {useTypingEffect} from "@/hooks/use-typing-effect";
import Header from "@/components/header";
import FeaturesSection from "@/components/features-section";
import CTASection from "@/components/cta-section";
import HowItWorksSection from "@/components/how-it-works-section";
import Footer from "@/components/footer";

export default function LandingPage() {
    const animatedText1 = useTypingEffect("AI-Powered Creole Text")
    const animatedText2 = useTypingEffect("Correction in seconds,", 50, 1000)
    const animatedText3 = useTypingEffect("not hours.", 50, 2000)

    return (
        <div className="min-h-screen bg-[#f0faf7]">
            <Header/>
            <BackgroundBeamsWithCollision>
                <main className="relative z-10 flex-1">
                    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
                        <div className=" px-4 md:px-6">
                            <div className="flex flex-col items-center space-y-8 text-center">
                                <div className="relative">
                                    <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none lg:text-7xl/none text-[#2d2d5f] max-w-3xl mx-auto">
                                        <span className="block">{animatedText1}</span>
                                        <span className="block">{animatedText2}</span>
                                        <span className="block">{animatedText3}</span>
                                    </h1>
                                </div>
                                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                                    With our state of the art, cutting edge AI technology, you can perfect your Creole
                                    text instantly with cultural sensitivity and accuracy.
                                </p>
                                <div className="space-x-4">
                                    <Button className="bg-[#2d2d5f] text-white hover:bg-[#2d2d5f]/90 px-8">
                                        Create account
                                    </Button>
                                    <Button variant="outline"
                                            className="border-[#40c4a7] text-[#40c4a7] hover:bg-[#40c4a7] hover:text-white px-8">
                                        Book a call
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </BackgroundBeamsWithCollision>
            <FeaturesSection/>
            <HowItWorksSection/>
            <CTASection/>
            <Footer/>
        </div>
    )
}