'use client'

import { Button } from "@/components/ui/button"
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision"
import {useTypingEffect} from "@/hooks/use-typing-effect";
import Header from "@/components/header";
import FeaturesSection from "@/components/features-section";
import CTASection from "@/components/cta-section";
import HowItWorksSection from "@/components/how-it-works-section";
import Footer from "@/components/footer";
import {Link} from "react-router-dom";

export default function LandingPage() {
    const animatedText1 = useTypingEffect("Kooreksyon Tèks Kreyòl", 50)
    const animatedText2 = useTypingEffect("AAk Entèlijans Atifisyèl", 50)
    const animatedText3 = useTypingEffect("nnan yon segond.", 50)

    return (
        <div className="min-h-screen bg-[#f0faf7]">
            <Header/>
            <BackgroundBeamsWithCollision>
                <main className="relative z-10 flex-1">
                    <section className="w-full pt-40 md:pt-32 pb-24 md:py-24 lg:py-32 xl:py-48">
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
                                    Optimize tèks ou avèk yon zouti ki konprann kilti ak nyans lang Kreyòl la pou bon jan presizyon ak efikasite.
                                </p>
                                <div className="space-x-4">
                                    <Link to="/anregistre">
                                    <Button className="bg-[#2d2d5f] text-white hover:bg-[#2d2d5f]/90 px-8">
                                        Kreye Yon Kont
                                    </Button>
                                    </Link>
                                    <Link to="/atik">
                                    <Button variant="outline"
                                            className="border-[#40c4a7] text-[#40c4a7] hover:bg-[#40c4a7] hover:text-white px-8">
                                        Aprann Plis
                                    </Button>
                                </Link>
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