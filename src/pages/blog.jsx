'use client'

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Header from "@/components/header";
import React from "react";

export default function Blog() {
    return (
        <div className="min-h-screen bg-white">
            <Header/>
            <section className="w-full py-12 md:py-24 lg:py-32 relative">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at center, #40c4a7 1px, transparent 1px)',
                    backgroundSize: '24px 24px',
                    opacity: 0.1
                }}/>
                <div className="container px-4 md:px-6 relative">
                    <div className="flex flex-col items-center text-center space-y-8">
                        <div className="space-y-6">
            <span className="text-sm font-medium text-[#40c4a7] bg-[#40c4a7]/10 px-4 py-1.5 rounded-full">
              BLOG
            </span>
                            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl md:text-6xl/none text-[#2d2d5f] max-w-3xl mx-auto">
                                News, tips and resources
                                <br/>
                                about PredikaAI
                            </h1>
                        </div>
                        <div className="w-full max-w-2xl mx-auto">
                            <div className="relative">
                                <Search
                                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5"/>
                                <Input
                                    type="search"
                                    placeholder="Search for articles"
                                    className="w-full pl-10 py-6 text-base rounded-xl border-gray-200 bg-white/80 backdrop-blur-sm"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}