'use client'

import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import {Link} from "react-router-dom";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#f0faf7] flex flex-col items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <svg
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-12 h-12 mx-auto mb-6"
                >
                    <circle cx="50" cy="50" r="50" className="fill-[#2d2d5f]"/>
                    <path
                        d="M30 25H55C67.1503 25 77 34.8497 77 47C77 59.1503 67.1503 69 55 69H45V75H30V25ZM45 54H55C58.866 54 62 50.866 62 47C62 43.134 58.866 40 55 40H45V54Z"
                        className="fill-[#40c4a7]"
                    />
                </svg>
                <h1 className="text-4xl font-bold text-[#2d2d5f] mb-4">Paj sa a pa egziste</h1>
                <p className="text-xl text-gray-600 mb-8">
                    Nou pa ka jwenn paj ou ap chèche a. Li pa egziste ankò.
                </p>
                <div className="space-y-4">
                    <p className="text-lg text-gray-500">Men kèk lyen ki ka ede ou:</p>
                    <motion.div
                        initial={{opacity: 0}}
                        animate={{opacity: 1}}
                        transition={{delay: 0.2, duration: 0.5}}
                        className="flex flex-wrap justify-center gap-4"
                    >
                    <Link to="/">
                            <Button className="bg-[#40c4a7] text-white hover:bg-[#40c4a7]/90">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Retounen nan paj akèy la
                            </Button>
                        </Link>
                        <Link to="mailto:predika.ai@gmail.com">
                            <Button variant="outline" className="border-[#40c4a7] text-[#40c4a7] hover:bg-[#40c4a7] hover:text-white">
                                Kontakte nou
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </motion.div>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-12 text-center"
            >
                <p className="text-sm text-gray-500">
                    Si ou panse sa a se yon erè, tanpri{" "}
                    <Link to="mailto:predika.ai@gmail.com" className="text-[#40c4a7] hover:underline">
                        fè nou konnen
                    </Link>
                    .
                </p>
            </motion.div>
        </div>
    )
}