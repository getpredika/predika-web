'use client'

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

const tableOfContents = [
    { title: "Sou Predika", href: "#sou-predika" },
    { title: "Aplikabilite", href: "#aplikabilite" },
    {
        title: "Enfòmasyon Nou Kolekte", href: "#enfomasyon",
        subItems: [
            { title: "Ke Ou Bay Dirèkteman", href: "#bay-direkteman" },
            { title: "Nan Men Lòt Pati", href: "#nan-men-lòt-pati" },
            { title: "Nan Men Kliyan", href: "#nan-men-kliyan" },
            { title: "Otomatikman", href: "#otomatikman" },
        ]
    },
    { title: "Kijan Nou Itilize Enfòmasyon", href: "#kijan-itilize" },
    { title: "Kijan Nou Kenbe Enfòmasyon", href: "#kijan-kenbe" },
    { title: "Kijan Nou Pataje Enfòmasyon", href: "#kijan-pataje" },
]

export default function PrivacyPolicy() {
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
                            <h1 className="text-4xl font-bold text-[#2d2d5f] mb-4">Règleman sou Vi Prive</h1>
                            <p className="text-sm text-gray-500 mb-8">Dènye mizajou: 8 Novanm 2024</p>

                            <section id="sou-predika" className="mb-12">
                                <h2 className="text-2xl font-semibold text-[#2d2d5f] mb-4">Sou Predika</h2>
                                <p className="text-gray-700">
                                    Nan Predika, nou respekte bezwen vi prive kliyan nou yo. Nou ofri Sit ak Sèvis nou yo
                                    (defini anba a) bay kliyan ak itilizatè yo swa dirèkteman oswa atravè yon revandè.
                                </p>
                            </section>

                            <section id="aplikabilite" className="mb-12">
                                <h2 className="text-2xl font-semibold text-[#2d2d5f] mb-4">Aplikabilite</h2>
                                <p className="text-gray-700">
                                    Lè w itilize oswa aksede Sit ak Sèvis nou yo nan nenpòt fason, ou aksepte pratik ak
                                    règleman ki dekri nan Avi sou Vi Prive sa a epi ou rekonèt ke nou ka trete ak pataje
                                    enfòmasyon w.
                                </p>
                            </section>

                            <section id="enfomasyon" className="mb-12">
                                <h2 className="text-2xl font-semibold text-[#2d2d5f] mb-4">Enfòmasyon Nou Kolekte</h2>

                                <section id="bay-direkteman" className="ml-6 mb-6">
                                    <h3 className="text-xl font-semibold text-[#2d2d5f] mb-3">Ke Ou Bay Dirèkteman</h3>
                                    <p className="text-gray-700">
                                        Nou kolekte enfòmasyon ou bay dirèkteman lè w enskri pou yon kont, itilize sèvis nou yo,
                                        oswa kominike avèk nou.
                                    </p>
                                </section>

                                <section id="nan-men-lòt-pati" className="ml-6 mb-6">
                                    <h3 className="text-xl font-semibold text-[#2d2d5f] mb-3">Nan Men Lòt Pati</h3>
                                    <p className="text-gray-700">
                                        Nou ka resevwa enfòmasyon adisyonèl sou ou nan men lòt sous, tankou sèvis patenè nou yo.
                                    </p>
                                </section>

                                <section id="nan-men-kliyan" className="ml-6 mb-6">
                                    <h3 className="text-xl font-semibold text-[#2d2d5f] mb-3">Nan Men Kliyan</h3>
                                    <p className="text-gray-700">
                                        Nou ka kolekte enfòmasyon sou ou nan men kliyan ki itilize sèvis nou yo, tankou fidbak oswa rapò.
                                    </p>
                                </section>

                                <section id="otomatikman" className="ml-6 mb-6">
                                    <h3 className="text-xl font-semibold text-[#2d2d5f] mb-3">Otomatikman</h3>
                                    <p className="text-gray-700">
                                        Nou ka kolekte enfòmasyon sou ou otomatikman lè w itilize sit entènèt oswa aplikasyon nou yo,
                                        tankou itilizasyon, navigasyon, ak done ki sòti nan cookies.
                                    </p>
                                </section>
                            </section>

                            <section id="kijan-itilize" className="mb-12">
                                <h2 className="text-2xl font-semibold text-[#2d2d5f] mb-4">Kijan Nou Itilize Enfòmasyon</h2>
                                <p className="text-gray-700">
                                    Nou itilize enfòmasyon ou kolekte pou bay sèvis, amelyore eksperyans itilizatè, ak kominike avèk ou.
                                    Nou ka itilize enfòmasyon yo pou analize done, fè pwomosyon, ak amelyore platfòm nou an.
                                </p>
                            </section>

                            <section id="kijan-kenbe" className="mb-12">
                                <h2 className="text-2xl font-semibold text-[#2d2d5f] mb-4">Kijan Nou Kenbe Enfòmasyon</h2>
                                <p className="text-gray-700">
                                    Nou pran mezi sekirite pou pwoteje enfòmasyon ou. Sa gen ladan ankriptaj, restriksyon aksè, epi
                                    nou fè tout sa nou kapab pou anpeche aksè san otorizasyon.
                                </p>
                            </section>

                            <section id="kijan-pataje" className="mb-12">
                                <h2 className="text-2xl font-semibold text-[#2d2d5f] mb-4">Kijan Nou Pataje Enfòmasyon</h2>
                                <p className="text-gray-700">
                                    Nou ka pataje enfòmasyon ou ak patnè biznis, founisè sèvis, oswa si sa nesesè pou respekte lwa oswa pwoteksyon
                                    legal.
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
                                    <div key={item.href}>
                                        <a
                                            href={item.href}
                                            className={`block py-2 px-3 text-sm rounded-md transition-colors ${activeSection === item.href.slice(1)
                                                ? 'bg-[#40c4a7]/10 text-[#40c4a7]'
                                                : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            {item.title}
                                        </a>
                                        {item.subItems?.map((subItem) => (
                                            <a
                                                key={subItem.href}
                                                href={subItem.href}
                                                className={`block py-2 pl-6 pr-3 text-sm rounded-md transition-colors ${activeSection === subItem.href.slice(1)
                                                    ? 'text-[#40c4a7]'
                                                    : 'text-gray-500 hover:text-gray-900'
                                                    }`}
                                            >
                                                {subItem.title}
                                            </a>
                                        ))}
                                    </div>
                                ))}
                            </nav>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    )
}
