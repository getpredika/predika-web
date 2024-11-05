import { Link } from "react-router-dom"
import { HoverEffect } from "@/components/ui/card-hover-effect"
import { Button } from "@/components/ui/button"
import { Sparkles, Sun, Menu, X } from "lucide-react"
import React, { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

const navItems = [
    { title: "Koreksyon Gramè", link: "/koreksyon-grame" },
    { title: "Karakteristik", link: "#Karakteristik" },
    { title: "Atik", link: "/atik" },
]

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setIsScrolled(true)
            } else {
                setIsScrolled(false)
            }
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 px-4 lg:px-6 h-16 flex items-center transition-all duration-300 mx-4 lg:mx-6 mt-4 ${
                isScrolled
                    ? 'bg-white/70 backdrop-blur-md backdrop-filter border border-white/20 shadow-lg rounded-full'
                    : 'bg-transparent'
            }`}>
            <Link className="flex items-center justify-center space-x-2" to="/">
                <Sparkles className="h-6 w-6 text-[#40c4a7]" />
                <span className="font-bold text-2xl text-[#2d2d5f]">Predika</span>
            </Link>
            <nav className="ml-auto hidden md:flex gap-6 sm:gap-8 items-center">
                <HoverEffect items={navItems}/>
                <Button
                    className="text-sm font-medium text-[#2d2d5f] border border-gray-200 hover:bg-[#2d2d5f]/90 hover:text-white hover:border-[#2d2d5f]/90"
                    variant="ghost"
                >
                    Konekte
                </Button>
                <Button
                    className="bg-[#40c4a7] text-white hover:bg-[#40c4a7]/90"
                >
                    Kòmanse
                </Button>
            </nav>
            <div className="ml-auto md:hidden">
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
                    onClick={toggleMobileMenu}
                >
                    {isMobileMenuOpen ? (
                        <X className="h-6 w-6 text-[#2d2d5f]" />
                    ) : (
                        <Menu className="h-6 w-6 text-[#2d2d5f]" />
                    )}
                </Button>
            </div>
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-2xl mt-2 py-4 px-4"
                    >
                        <nav className="flex flex-col space-y-4">
                            {navItems.map((item) => (
                                <Link
                                    key={item.link}
                                    to={item.link}
                                    className="text-[#2d2d5f] hover:text-[#40c4a7] transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {item.title}
                                </Link>
                            ))}
                            <Button
                                className="text-sm font-medium text-[#2d2d5f] border border-gray-200 hover:bg-[#2d2d5f]/90 hover:text-white hover:border-[#2d2d5f]/90"
                                variant="ghost"
                            >
                                Konekte
                            </Button>
                            <Button
                                className="bg-[#40c4a7] text-white hover:bg-[#40c4a7]/90 w-full"
                            >
                                Kòmanse
                            </Button>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}