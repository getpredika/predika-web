import { Sparkles } from "lucide-react"
import {Link} from "react-router-dom";

export default function Footer() {
    return (
        <footer className="w-full bg-white pt-16 pb-8">
            <div className=" px-4 md:px-6">
                <div className="grid grid-cols-1 gap-14 md:grid-cols-4">
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center space-x-2">
                            <Sparkles className="h-6 w-6 text-[#40c4a7]" />
                            <span className="font-bold text-xl text-[#2d2d5f]">Predika</span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Predika se yon entèlijans atifisyèl ki antrene korije tèks, li asire ke tèks yo san erè.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm text-[#2d2d5f] uppercase tracking-wider">Konpayi</h3>
                        <ul className="space-y-2">
                            <li><Link to="#" className="text-gray-500 hover:text-[#40c4a7] text-sm">Karakteristik</Link></li>
                            <li><Link to="/atik" className="text-gray-500 hover:text-[#40c4a7] text-sm">Atik</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm text-[#2d2d5f] uppercase tracking-wider">Itilizasyon</h3>
                        <ul className="space-y-2">
                            <li><Link to="koreksyon-grame" className="text-gray-500 hover:text-[#40c4a7] text-sm">Koreksyon Tèks</Link></li>
                            <li><Link to="#" className="text-gray-500 hover:text-[#40c4a7] text-sm">Zouti Aprantisaj</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm text-[#2d2d5f] uppercase tracking-wider">Kontak</h3>
                        <ul className="space-y-2">
                            <li><Link to="#" className="text-gray-500 hover:text-[#40c4a7] text-sm">Rapòte yon erè</Link></li>
                            <li><Link to="#" className="text-gray-500 hover:text-[#40c4a7] text-sm">Kontakte nou</Link></li>
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
                        <Link to="#" className="text-gray-500 hover:text-[#40c4a7] text-sm">
                            Tèm
                        </Link>
                        <Link href="#" className="text-gray-500 hover:text-[#40c4a7] text-sm">
                            Politik sou Konfidansyalite
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}