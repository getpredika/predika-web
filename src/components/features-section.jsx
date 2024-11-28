'use client'

import { Link } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowRight, CircleCheck, BookOpen, UserCheck } from "lucide-react"
import { motion, useAnimation } from "framer-motion"
import { useEffect, useRef } from "react"

const features = [
    {
        icon: CircleCheck,
        title: "Koreksyon Enstantane",
        description: "AI nou an rapidman idantifye ak korije erè gramè ak òtograf nan tèks ou, asire ke mesaj ou klè ak pwofesyonèl.",
        link: "/koreksyon-grame",
        linkText: "Wè Kijan Sa Fonksyone",
    },
    {
        icon: BookOpen,
        title: "Zouti Aprantisaj",
        description: "Amelyore konpetans lang ou ak zouti aprantisaj sa ki eksplike koreksyon yo ak ofri konsèy pou pi bon sentaks nan Kreyòl.",
        link: "/diksyonè",
        linkText: "Eksplore Zouti Aprantisaj",
    },
    {
        icon: UserCheck,
        title: "Sijesyon Pèsonalize",
        description: "AI nou an konprann nyans ak tradisyon Kreyòl, bay ou koreksyon ak sijesyon ki respekte kilti a.",
        link: "/atik",
        linkText: "Dekouvri Karakteristik Pèsonalize",
    }
]

export default function FeaturesSection() {
    const controls = useAnimation()
    const ref = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    controls.start("visible")
                }
            },
            {
                threshold: 0.2,
                rootMargin: "-100px 0px"
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

    const iconVariants = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: {
                type: "spring",
                damping: 10,
                stiffness: 100,
                delay: 0.2,
            },
        },
    }

    return (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white" id="features" ref={ref}>
            <motion.div
                className="px-4 md:px-6"
                initial="hidden"
                animate={controls}
                variants={containerVariants}
            >
                <div className="grid gap-12 lg:gap-16">
                    <motion.div className="space-y-4 text-center" variants={itemVariants}>
                        <motion.span className="text-sm font-medium text-[#40c4a7]" variants={itemVariants}>
                            KÒMANSE GRATIS
                        </motion.span>
                        <motion.h2
                            className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#2d2d5f]"
                            variants={itemVariants}
                        >
                            Verifye Gramè ak Òtograf
                        </motion.h2>
                        <motion.p
                            className="mx-auto max-w-[700px] text-gray-500 md:text-xl"
                            variants={itemVariants}
                        >
                            Bay AI nou an tèks ou a, e li ap otomatikman korije li pou ou nan sèlman kèk segond.
                        </motion.p>
                    </motion.div>
                    <motion.div
                        className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
                        variants={containerVariants}
                    >
                        {features.map((feature, i) => (
                            <motion.div key={i} variants={itemVariants}>
                                <Card className="relative group overflow-hidden border-none shadow-lg">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col h-full space-y-4">
                                            <motion.div
                                                className={`w-12 h-12 rounded-lg flex items-center justify-center bg-[#e6fff7] text-[#40c4a7]`}
                                                variants={iconVariants}
                                            >
                                                <feature.icon className="w-6 h-6" />
                                            </motion.div>
                                            <h3 className="text-xl font-bold text-[#2d2d5f]">{feature.title}</h3>
                                            <p className="text-gray-500 flex-grow">{feature.description}</p>
                                            <Link
                                                to={feature.link}
                                                className="inline-flex items-center text-[#40c4a7] hover:text-[#2d2d5f] transition-colors"
                                            >
                                                {feature.linkText}
                                                <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </motion.div>
        </section>
    )
}