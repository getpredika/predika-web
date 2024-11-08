'use client'

import { Link } from "react-router-dom"
import { HoverEffect } from "@/components/ui/card-hover-effect"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useAuth } from "@/context/auth-context"

const navItems = [
    { title: "Koreksyon Gramè", link: "/koreksyon-grame" },
    { title: "Atik", link: "/atik" },
]

export default function MainHeader() {
    const [isScrolled, setIsScrolled] = useState(false)
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const { user } = useAuth()

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
            className={`fixed top-0 left-0 right-0 z-50 px-4 lg:px-6 h-16 flex items-center transition-all duration-300 mx-4 lg:mx-6 mt-4 ${isScrolled
                ? 'bg-white/70 backdrop-blur-md backdrop-filter border border-white/20 shadow-lg rounded-full'
                : 'bg-transparent'
                }`}>
            <Link className="flex items-center justify-center space-x-2" to="/">
                <div className="w-6 h-6">
                    <svg
                        viewBox="0 0 100 100"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-full h-full"
                    >
                        <circle cx="50" cy="50" r="50" className="fill-[#2d2d5f]" />
                        <path
                            d="M30 25H55C67.1503 25 77 34.8497 77 47C77 59.1503 67.1503 69 55 69H45V75H30V25ZM45 54H55C58.866 54 62 50.866 62 47C62 43.134 58.866 40 55 40H45V54Z"
                            className="fill-[#40c4a7]"
                        />
                    </svg>
                </div>
                <span className="font-bold text-2xl text-[#2d2d5f]">Predika</span>
            </Link>
            <nav className="ml-auto hidden md:flex gap-6 sm:gap-8 items-center">
                <HoverEffect items={navItems} />
                {!user && (
                    <Link to="/koneksyon">
                        <Button
                            className="text-sm font-medium text-[#2d2d5f] border border-gray-200 hover:bg-[#2d2d5f]/90 hover:text-white hover:border-[#2d2d5f]/90"
                            variant="ghost"
                        >
                            Konekte
                        </Button>
                    </Link>
                )}
                <Link to="/koreksyon-grame">
                    <Button
                        className="bg-[#40c4a7] text-white hover:bg-[#40c4a7]/90"
                    >
                        Kòmanse
                    </Button>
                </Link>
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
                            {!user && (
                                <Link to="/koneksyon">
                                    <Button
                                        className="text-sm font-medium text-[#2d2d5f] border border-gray-200 hover:bg-[#2d2d5f]/90 hover:text-white hover:border-[#2d2d5f]/90 w-full"
                                        variant="ghost"
                                    >
                                        Konekte
                                    </Button>
                                </Link>
                            )}
                            <Link to="/koreksyon-grame">
                                <Button
                                    className="bg-[#40c4a7] text-white hover:bg-[#40c4a7]/90 w-full"
                                >
                                    Kòmanse
                                </Button>
                            </Link>
                        </nav>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}