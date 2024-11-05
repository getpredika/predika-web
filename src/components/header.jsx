import {Link} from "react-router-dom";
import {HoverEffect} from "@/components/ui/card-hover-effect";
import {Button} from "@/components/ui/button";
import {Sun} from "lucide-react";
import React, {useEffect, useState} from "react";

const navItems = [
    { title: "Features", link: "#features" },
    { title: "Blog", link: "#blog" },
    { title: "Contact", link: "#contact" },
]

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false)

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

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 px-4 lg:px-6 h-16 flex items-center transition-all duration-300 mx-4 lg:mx-6 mt-4 ${
                isScrolled
                    ? 'bg-white/70 backdrop-blur-md backdrop-filter border border-white/20 shadow-lg rounded-full'
                    : 'bg-transparent'
            }`}>
            <Link className="flex items-center justify-center" to="/">
                <span className="font-bold text-2xl text-[#2d2d5f]">Predika</span>
            </Link>
            <nav className="ml-auto flex gap-6 sm:gap-8 items-center">
                <HoverEffect items={navItems}/>
                <Button
                    className="size-9 rounded-full"
                    size="icon"
                    variant="ghost"
                >
                    <Sun className="size-4"/>
                    <span className="sr-only">Toggle theme</span>
                </Button>
                <Button
                    className="text-sm font-medium hover:text-[#40c4a7]"
                    variant="ghost"
                >
                    Login
                </Button>
                <Button
                    className="bg-[#40c4a7] text-white hover:bg-[#40c4a7]/90"
                >
                    Book a call
                </Button>
            </nav>
        </header>
    )
}