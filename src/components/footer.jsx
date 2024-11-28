import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="w-full bg-white pt-16 pb-8">
            <div className=" px-4 md:px-6">
                <div className="grid grid-cols-1 gap-14 md:grid-cols-4">
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center space-x-2">
                            <svg
                                viewBox="0 0 100 100"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6"
                            >
                                <circle cx="50" cy="50" r="50" className="fill-[#2d2d5f]"/>
                                <path
                                    d="M30 25H55C67.1503 25 77 34.8497 77 47C77 59.1503 67.1503 69 55 69H45V75H30V25ZM45 54H55C58.866 54 62 50.866 62 47C62 43.134 58.866 40 55 40H45V54Z"
                                    className="fill-[#40c4a7]"
                                />
                            </svg>
                            <span className="font-bold text-xl text-[#2d2d5f]">Predika</span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Predika se yon entèlijans atifisyèl ki antrene korije tèks, li asire ke tèks yo san erè.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm text-[#2d2d5f] uppercase tracking-wider">Konpayi</h3>
                        <ul className="space-y-2">
                            <li><a href="#detay" className="text-gray-500 hover:text-[#40c4a7] text-sm">Karakteristik</a></li>
                            <li><Link to="/atik" className="text-gray-500 hover:text-[#40c4a7] text-sm">Atik</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm text-[#2d2d5f] uppercase tracking-wider">Itilizasyon</h3>
                        <ul className="space-y-2">
                            <li><Link to="/koreksyon-grame" className="text-gray-500 hover:text-[#40c4a7] text-sm">Koreksyon Tèks</Link></li>
                            <li><Link to="/diksyonè" className="text-gray-500 hover:text-[#40c4a7] text-sm">Diksyonè</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm text-[#2d2d5f] uppercase tracking-wider">Kontak</h3>
                        <ul className="space-y-2">
                            <li><Link to="mailto:predika.ai@gmail.com" className="text-gray-500 hover:text-[#40c4a7] text-sm">Rapòte yon erè</Link></li>
                            <li><Link to="mailto:predika.ai@gmail.com" className="text-gray-500 hover:text-[#40c4a7] text-sm">Kontakte nou</Link></li>
                        </ul>
                        <div className="space-y-2 pt-2">
                            <p className="text-[#40c4a7] text-sm">support@predika.app</p>
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <p className="text-gray-500 text-sm">
                        Dwa òtè © 2024. {" "}
                        <Link to="/" className="text-[#40c4a7] hover:text-[#2d2d5f]">
                            Predika
                        </Link>
                    </p>
                    <div className="flex space-x-6">
                        <Link to="/tem" className="text-gray-500 hover:text-[#40c4a7] text-sm">
                            Tèm
                        </Link>
                        <Link to="/politik-konfidansyalite" className="text-gray-500 hover:text-[#40c4a7] text-sm">
                            Politik sou Konfidansyalite
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}