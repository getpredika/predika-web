'use client'

import { Button } from "@/components/ui/button"
import { ArrowLeft, Sparkles } from "lucide-react"
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
                <Sparkles className="h-12 w-12 text-[#40c4a7] mx-auto mb-6" />
                <h1 className="text-4xl font-bold text-[#2d2d5f] mb-4">Oops! Paj sa a pa egziste</h1>
                <p className="text-xl text-gray-600 mb-8">
                    Nou pa ka jwenn paj ou ap chèche a. Li pa egziste ankò.
                </p>
                <div className="space-y-4">
                    <p className="text-lg text-gray-500">Men kèk lyen ki ka ede ou:</p>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="flex flex-wrap justify-center gap-4"
                    >
                        <Link to="/">
                            <Button className="bg-[#40c4a7] text-white hover:bg-[#40c4a7]/90">
                                <ArrowLeft className="mr-2 h-4 w-4" /> Retounen nan paj akèy la
                            </Button>
                        </Link>
                        <Link to="#">
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
                    <Link to="#" className="text-[#40c4a7] hover:underline">
                        fè nou konnen
                    </Link>
                    .
                </p>
            </motion.div>
        </div>
    )
}