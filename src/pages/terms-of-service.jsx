'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

const tableOfContents = [
    { title: "Sou Predika", href: "#apwopo" },
    { title: "Sèvis Nou Yo", href: "#sevis" },
    { title: "Kont Itilizatè", href: "#kont" },
    { title: "Responsablite", href: "#responsablite" },
    { title: "Dwa Pwopriyete", href: "#dwa" },
    { title: "Anilasyon", href: "#anilasyon" },
    { title: "Chanjman", href: "#chanjman" },
]

export default function TermsOfService() {
    const [activeSection, setActiveSection] = useState("")

    useEffect(() => {
        const handleScroll = () => {
            const sections = document.querySelectorAll('section[id]')
            const scrollPosition = window.scrollY + 100

            sections.forEach((section) => {
                if (section instanceof HTMLElement) {
                    const top = section.offsetTop
                    const height = section.offsetHeight

                    if (scrollPosition >= top && scrollPosition < top + height) {
                        setActiveSection(section.id)
                    }
                }
            })
        }

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <div className="min-h-screen bg-[#f0faf7]">
            <header className="bg-white shadow-sm fixed w-full top-0 z-50">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <Link to="/" className="flex items-center space-x-2">
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
                        <span className="font-bold text-xl text-[#2d2d5f]">Predika</span>
                    </Link>
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
                <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                    {/* Main content */}
                    <main className="lg:col-span-9">
                        <div className="prose prose-lg max-w-none">
                            <h1 className="text-4xl font-bold text-[#2d2d5f] mb-4">Kondisyon Itilizasyon</h1>
                            <p className="text-sm text-gray-500 mb-8">Dènye mizajou: 8 Novanm 2024</p>

                            <section id="apwopo" className="mb-12">
                                <h2 className="text-2xl font-semibold text-[#2d2d5f] mb-4">Sou Predika</h2>
                                <p className="text-gray-700">
                                    Predika se yon platfòm pou koreksyon gramè ak òtograf nan lang kreyòl ayisyen.
                                    Nou ofri zouti ak sèvis pou ede w amelyore ekriti w nan lang kreyòl.
                                </p>
                            </section>

                            <section id="sevis" className="mb-12">
                                <h2 className="text-2xl font-semibold text-[#2d2d5f] mb-4">Sèvis Nou Yo</h2>
                                <p className="text-gray-700">
                                    Nou ofri sèvis koreksyon gramè ak òtograf otomatik, ak lòt zouti pou amelyore
                                    kalite ekriti w nan lang kreyòl. Sèvis nou yo ka gen ladan yo tou resous
                                    aprantisaj ak materyèl referans.
                                </p>
                            </section>

                            <section id="kont" className="mb-12">
                                <h2 className="text-2xl font-semibold text-[#2d2d5f] mb-4">Kont Itilizatè</h2>
                                <p className="text-gray-700">
                                    Pou w ka itilize sèten fonksyonalite nan sèvis nou yo, ou ka bezwen kreye yon kont.
                                    Ou responsab pou kenbe enfòmasyon kont ou ajou epi sekirize modpas ou.
                                </p>
                            </section>

                            <section id="responsabilite" className="mb-12">
                                <h2 className="text-2xl font-semibold text-[#2d2d5f] mb-4">Responsablite</h2>
                                <p className="text-gray-700">
                                    Ou responsab pou asire ke ou sèvi ak sèvis Predika nan yon fason ki konfòm ak tout lwa ki aplikab.
                                    Ou dwe evite itilize platfòm nan pou nenpòt aktivite ki ilegal oswa ki vyole dwa lòt moun.
                                </p>
                            </section>

                            <section id="dwa" className="mb-12">
                                <h2 className="text-2xl font-semibold text-[#2d2d5f] mb-4">Dwa Pwopriyete</h2>
                                <p className="text-gray-700">
                                    Tout dwa pwopriyete entelektyèl sou kontni Predika rete nan men Predika, eksepte kote sa klèman endike otreman.
                                    Ou pa gen dwa repwodwi, distribye, oswa modifye nenpòt kontni san pèmisyon.
                                </p>
                            </section>

                            <section id="anilasyon" className="mb-12">
                                <h2 className="text-2xl font-semibold text-[#2d2d5f] mb-4">Anilasyon</h2>
                                <p className="text-gray-700">
                                    Predika gen dwa pou l sispann oswa anile kont itilizatè a nenpòt ki lè si itilizatè a vyole kondisyon itilizasyon sa yo.
                                    Ou ka anile kont ou nenpòt ki lè nan paramèt kont ou a.
                                </p>
                            </section>

                            <section id="chanjman" className="mb-12">
                                <h2 className="text-2xl font-semibold text-[#2d2d5f] mb-4">Chanjman</h2>
                                <p className="text-gray-700">
                                    Predika ka modifye kondisyon itilizasyon sa yo nenpòt ki lè. Nou pral notifye w sou nenpòt chanjman enpòtan.
                                    Nou rekòmande pou w tcheke kondisyon itilizasyon yo regilyèman pou w rete enfòme.
                                </p>
                            </section>

                        </div>
                    </main>

                    {/* Sidebar */}
                    <aside className="hidden lg:block lg:col-span-3">
                        <div className="sticky top-24">
                            <h2 className="text-lg font-semibold text-[#2d2d5f] mb-4">Nan paj sa a</h2>
                            <nav className="space-y-1">
                                {tableOfContents.map((item) => (
                                    <a
                                        key={item.href}
                                        href={item.href}
                                        className={`block py-2 px-3 text-sm rounded-md transition-colors ${activeSection === item.href.slice(1)
                                            ? 'bg-[#40c4a7]/10 text-[#40c4a7]'
                                            : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        {item.title}
                                    </a>
                                ))}
                            </nav>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}
