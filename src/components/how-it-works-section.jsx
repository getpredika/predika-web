'use client'

import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { motion, useAnimation } from "framer-motion"
import { useEffect, useRef } from "react"

export default function HowItWorksSection() {
    const controls = useAnimation()
    const ref = useRef(null)

    const steps = [
        {
            number: "1",
            title: "Chwazi yon modèl AI",
            description: "Senpleman chwazi yon modèl ki adapte ak bezwen ou yo nan lis ki disponib la pou korije tèks ou a."
        },
        {
            number: "2",
            title: "Ekri tèks ou a",
            description: "Antre tèks ou a nan bwat ki endike a."
        },
        {
            number: "3",
            title: "Koreksyon",
            description: "AI la ap analize tèks ou a, kòmanse korije erè yo, epi montre ou tout fot yo."
        }
    ]

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    controls.start("visible")
                }
            },
            {
                threshold: 0.3,
                rootMargin: "-50px 0px"
            }
        )

        if (ref.current) {
            observer.observe(ref.current)
        }

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current)
            }
        }
    }, [controls])

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3,
            },
        },
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                damping: 15,
                stiffness: 100,
            },
        },
    }

    const stepVariants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                damping: 10,
                stiffness: 100,
            },
        },
    }

    return (
        <section className="w-full py-12 relative bg-white" ref={ref}>
            <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at center, #40c4a7 1px, transparent 1px)',
                backgroundSize: '24px 24px',
                opacity: 0.1
            }} />
            <motion.div
                className="px-4 md:px-6 relative"
                initial="hidden"
                animate={controls}
                variants={containerVariants}
            >
                <motion.div className="flex flex-col items-center text-center space-y-4 mb-12" variants={itemVariants}>
                    <motion.span className="text-sm font-medium text-[#40c4a7]" variants={itemVariants}>
                        KIJAN SA FONKSYONE
                    </motion.span>
                    <motion.h2
                        className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#2d2d5f]"
                        variants={itemVariants}
                    >
                        Pi Bon Fason Pou Korije Tèks
                    </motion.h2>
                    <motion.p
                        className="mx-auto max-w-[800px] text-gray-500 md:text-lg"
                        variants={itemVariants}
                    >
                        Dekouvri kijan AI nou an fonksyone pou ofri ou koreksyon presi ak rapid.
                    </motion.p>
                </motion.div>

                <motion.div
                    className="grid md:grid-cols-3 gap-8 md:gap-12 mb-12"
                    variants={containerVariants}
                >
                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            className="relative flex flex-col items-center text-center space-y-4"
                            variants={stepVariants}
                        >
                            <motion.div
                                className="text-8xl font-bold text-[#40c4a7]/10 mb-4"
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: i * 0.2, duration: 0.5 }}
                            >
                                {step.number}
                            </motion.div>
                            <h3 className="text-xl font-bold text-[#2d2d5f]">{step.title}</h3>
                            <p className="text-gray-500">{step.description}</p>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    variants={itemVariants}
                >
                    <Link to="/koreksyon-grame">
                        <Button
                            className="bg-[#40c4a7] text-white hover:bg-[#40c4a7]/90 h-11 px-6 rounded-full text-base"
                        >
                            Kòmanse jodia
                        </Button>
                    </Link>
                    <Link to="/anregistre">
                        <Button
                            variant="outline"
                            className="h-11 px-6 rounded-full border-[#40c4a7] text-[#40c4a7] hover:bg-[#40c4a7] hover:text-white"
                        >
                            Kreye yon kont
                        </Button>
                    </Link>
                </motion.div>
            </motion.div>
        </section>
    )
}