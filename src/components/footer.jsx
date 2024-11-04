import { Sparkles } from "lucide-react"
import {Link} from "react-router-dom";

export default function Footer() {
    return (
        <footer className="w-full bg-white pt-16 pb-8">
            <div className=" px-4 md:px-6">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center space-x-2">
                            <Sparkles className="h-6 w-6 text-[#40c4a7]" />
                            <span className="font-bold text-xl text-[#2d2d5f]">Predika</span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Predika is an artificial intelligence trained to automate important tasks such as writing optimized product descriptions, high-converting ad copy, blog outlines, and more!
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm text-[#2d2d5f] uppercase tracking-wider">Company</h3>
                        <ul className="space-y-2">
                            <li><Link href="#" className="text-gray-500 hover:text-[#40c4a7] text-sm">About Us</Link></li>
                            <li><Link href="#" className="text-gray-500 hover:text-[#40c4a7] text-sm">Careers</Link></li>
                            <li><Link href="#" className="text-gray-500 hover:text-[#40c4a7] text-sm">Community</Link></li>
                            <li><Link href="#" className="text-gray-500 hover:text-[#40c4a7] text-sm">Creator Program</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm text-[#2d2d5f] uppercase tracking-wider">Use Case</h3>
                        <ul className="space-y-2">
                            <li><Link href="#" className="text-gray-500 hover:text-[#40c4a7] text-sm">Blog writing</Link></li>
                            <li><Link href="#" className="text-gray-500 hover:text-[#40c4a7] text-sm">Social media Ads</Link></li>
                            <li><Link href="#" className="text-gray-500 hover:text-[#40c4a7] text-sm">Creative writing</Link></li>
                            <li><Link href="#" className="text-gray-500 hover:text-[#40c4a7] text-sm">Magic command</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm text-[#2d2d5f] uppercase tracking-wider">Get in Touch</h3>
                        <ul className="space-y-2">
                            <li><Link href="#" className="text-gray-500 hover:text-[#40c4a7] text-sm">Contact Us</Link></li>
                            <li><Link href="#" className="text-gray-500 hover:text-[#40c4a7] text-sm">Weekly Demos</Link></li>
                            <li><Link href="#" className="text-gray-500 hover:text-[#40c4a7] text-sm">Report a Bug</Link></li>
                            <li><Link href="#" className="text-gray-500 hover:text-[#40c4a7] text-sm">Request a New Feature</Link></li>
                        </ul>
                        <div className="space-y-2 pt-2">
                            <p className="text-[#40c4a7] text-sm">support@predika.com</p>
                            <p className="text-gray-500 text-sm">+1 (642) 342 762 44</p>
                            <p className="text-gray-500 text-sm">442 Belle St Floor 7, San Francisco, AV 4206</p>
                        </div>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-gray-200 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <p className="text-gray-500 text-sm">
                        Copyright © 2024. Template Made by{" "}
                        <Link href="#" className="text-[#40c4a7] hover:text-[#2d2d5f]">
                            Softnio
                        </Link>
                    </p>
                    <div className="flex space-x-6">
                        <Link href="#" className="text-gray-500 hover:text-[#40c4a7] text-sm">
                            Terms
                        </Link>
                        <Link href="#" className="text-gray-500 hover:text-[#40c4a7] text-sm">
                            Privacy Policy
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}