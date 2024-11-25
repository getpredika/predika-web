'use client'

import { Button } from "@/components/ui/button"
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision"
import MainHeader from "@/components/main-header.jsx";
import FeaturesSection from "@/components/features-section";
import CTASection from "@/components/cta-section";
import HowItWorksSection from "@/components/how-it-works-section";
import Footer from "@/components/footer";
import { Link } from "react-router-dom";
import { motion } from 'framer-motion'
import SEOHelmet from "@/components/seo-helmet.jsx";
import {useEffect} from "react";
import ReactGA from "react-ga4";

export default function LandingPage() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3,
                delayChildren: 0.2,
            },
        },
    }

    const lineVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.8,
                ease: [0.6, -0.05, 0.01, 0.99],
            },
        },
    }

    const fadeInUpVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut",
            },
        },
    }

    useEffect(() => {
        ReactGA.send({ hitType: "pageview", page: "/", title: "Home", });
    }, []);

    return (
        <>
            <SEOHelmet
                title="Koreksyon Tèks Kreyòl - Predika"
                description="Koreksyon tèks Kreyòl fasil e rapid ak zouti entèlijans atifisyèl ki adapte ak kilti lang Kreyòl Ayisyen."
                keywords="Koreksyon Tèks Kreyòl, Entèlijans Atifisyèl, zouti koreksyon, lang kreyòl"
                imageUrl="https://predika.app/public/predika-logo.png"
                url="https://predika.app/"
            />

            <div className="min-h-screen bg-[#f0faf7]">
                <MainHeader/>
                <BackgroundBeamsWithCollision>
                    <main className="relative z-10 flex-1">
                        <section className="w-full pt-40 md:pt-32 pb-24 md:py-24 lg:py-32 xl:py-48">
                            <div className="px-4 md:px-6">
                                <div className="flex flex-col items-center space-y-8 text-center">
                                    <div className="relative">
                                        <motion.h1
                                            className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none lg:text-7xl/none text-[#2d2d5f] max-w-3xl mx-auto"
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        <motion.span className="block" variants={lineVariants}>
                                            Koreksyon Tèks Kreyòl
                                        </motion.span>
                                        <motion.span className="block" variants={lineVariants}>
                                            Ak Entèlijans Atifisyèl
                                        </motion.span>
                                        <motion.span className="block" variants={lineVariants}>
                                            nan yon segond
                                        </motion.span>
                                    </motion.h1>
                                </div>
                                <motion.p
                                    className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400"
                                    variants={fadeInUpVariants}
                                    initial="hidden"
                                    animate="visible"
                                    transition={{ delay: 1 }}
                                >
                                    Optimize tèks ou avèk yon zouti ki konprann kilti ak nyans lang Kreyòl la pou bon jan presizyon ak efikasite.
                                </motion.p>
                                <motion.div
                                    className="space-x-4"
                                    variants={fadeInUpVariants}
                                    initial="hidden"
                                    animate="visible"
                                    transition={{ delay: 1.2 }}
                                >
                                    <Link to="/anregistre">
                                        <Button className="bg-[#2d2d5f] text-white hover:bg-[#2d2d5f]/90 px-8">
                                            Kreye Yon Kont
                                        </Button>
                                    </Link>
                                    <a href="#features">
                                        <Button
                                            variant="outline"
                                            className="border-[#40c4a7] text-[#40c4a7] hover:bg-[#40c4a7] hover:text-white px-8"
                                        >
                                            Aprann Plis
                                        </Button>
                                    </a>
                                </motion.div>
                            </div>
                        </div>
                    </section>
                </main>
            </BackgroundBeamsWithCollision>
            <FeaturesSection />
            <HowItWorksSection />
            <CTASection />
            <Footer />
        </div>
        </>
    )
}