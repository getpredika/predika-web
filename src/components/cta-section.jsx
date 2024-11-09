'use client'

import { Button } from "@/components/ui/button"
import { ArrowRight, Check } from "lucide-react"
import { Link } from "react-router-dom"
import { motion, useAnimation } from "framer-motion"
import { useEffect, useRef } from "react"

export default function CTASection() {
  const features = [
    "Pa bezwen kat kredi",
    "Plizyè zouti pou dekouvri",
  ]

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

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-[#f0faf7] [mask-image:radial-gradient(ellipse_at_center,black,transparent)] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at center, #40c4a7 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          opacity: 0.2
        }} />
      </div>
      <motion.div
        className="px-4 md:px-6 relative"
        initial="hidden"
        animate={controls}
        variants={containerVariants}
      >
        <div className="flex flex-col items-center text-center space-y-8">
          <motion.div className="space-y-6" variants={itemVariants}>
            <motion.span
              className="text-sm font-medium text-[#40c4a7] bg-[#40c4a7]/10 px-4 py-1.5 rounded-full inline-block"
              variants={itemVariants}
            >
              AMELYORE FASON OU EKRI
            </motion.span>
            <motion.h2
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#2d2d5f]"
              variants={itemVariants}
            >
              Fini Fot Gramè
            </motion.h2>
            <motion.p
              className="mx-auto max-w-[600px] text-gray-500 md:text-xl"
              variants={itemVariants}
            >
              Se tankou gen aksè a yon ekip ekspè ki ap korije tèks pou ou nan yon moman.
            </motion.p>
          </motion.div>
          <motion.div variants={itemVariants}>
            <Link to="koreksyon-grame">
              <Button
                className="bg-[#40c4a7] text-white hover:bg-[#40c4a7]/90 h-12 px-8 rounded-full text-base"
              >
                Kòmanse
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
          <motion.div
            className="flex flex-wrap justify-center gap-4 mt-8"
            variants={containerVariants}
          >
            {features.map((feature, i) => (
              <motion.div
                key={i}
                className="flex items-center space-x-2 text-sm text-gray-500"
                variants={itemVariants}
              >
                <motion.div
                  className="flex items-center justify-center w-5 h-5 rounded-full bg-[#40c4a7]/10"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.2, duration: 0.5 }}
                >
                  <Check className="h-3 w-3 text-[#40c4a7]" />
                </motion.div>
                <span>{feature}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}