import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom"
import { useState } from "react";

export const HoverEffect = ({ items, className }) => {
    let [hoveredIndex, setHoveredIndex] = useState(null)

    return (
        <div className={cn("flex items-center", className)}>
            {items.map((item, idx) => (
                <Link
                    to={item.link}
                    key={item.link}
                    className="relative group px-4 py-2"
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                >
                    <AnimatePresence>
                        {hoveredIndex === idx && (
                            <motion.span
                                className="absolute inset-0 bg-white/20 dark:bg-slate-800/[0.8] rounded-full"
                                layoutId="hoverBackground"
                                initial={{ opacity: 0 }}
                                animate={{
                                    opacity: 1,
                                    transition: { duration: 0.15 },
                                }}
                                exit={{
                                    opacity: 0,
                                    transition: { duration: 0.15, delay: 0.2 },
                                }}
                            />
                        )}
                    </AnimatePresence>
                    <span className="relative z-10 text-sm font-medium text-[#2d2d5f] group-hover:text-[#40c4a7]">
                        {item.title}
                    </span>
                </Link>
            ))}
        </div>
    )
}