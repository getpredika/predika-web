import {Link} from "react-router-dom";
import React from "react";
import { Card, CardContent } from "@/components/ui/card"
import {  MessageSquare, Clock, Pencil, ArrowRight } from "lucide-react"

const features = [
    {
        icon: Clock,
        title: "Write blogs 10× faster",
        description: "Our AI-powered platform helps you write high-quality Creole content in a fraction of the time, maintaining authenticity and cultural nuance.",
        link: "#",
        linkText: "Try Blog Writers",
    },
    {
        icon: Pencil,
        title: "Write higher converting posts",
        description: "Create compelling Creole content that resonates with your audience and drives engagement, powered by cultural-aware AI.",
        link: "#",
        linkText: "Try Social Media Managers",
    },
    {
        icon: MessageSquare,
        title: "Write more engaging emails",
        description: "Craft professional Creole emails that maintain cultural authenticity while delivering your message effectively.",
        link: "#",
        linkText: "Email Marketers",
    }
]

export default function FeaturesSection() {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white" id="features">
            <div className="px-4 md:px-6">
                <div className="grid gap-12 lg:gap-16">
                    <div className="space-y-4 text-center">
            <span className="text-sm font-medium text-[#40c4a7]">
              GET STARTED FOR FREE
            </span>
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#2d2d5f]">
                            AI Generate content in seconds
                        </h2>
                        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                            Give our AI a few descriptions and we'll automatically create blog articles, product
                            descriptions and more for you within just few second.
                        </p>
                    </div>
                    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature, i) => (
                            <Card key={i} className="relative group overflow-hidden border-none shadow-lg">
                                <CardContent className="p-6">
                                    <div className="flex flex-col h-full space-y-4">
                                        <div
                                            className={`w-12 h-12 rounded-lg flex items-center justify-center bg-[#e6fff7] text-[#40c4a7]`}>
                                            <feature.icon className="w-6 h-6"/>
                                        </div>
                                        <h3 className="text-xl font-bold text-[#2d2d5f]">{feature.title}</h3>
                                        <p className="text-gray-500 flex-grow">{feature.description}</p>
                                        <Link
                                            href={feature.link}
                                            className="inline-flex items-center text-[#40c4a7] hover:text-[#2d2d5f] transition-colors"
                                        >
                                            {feature.linkText}
                                            <ArrowRight
                                                className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1"/>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}