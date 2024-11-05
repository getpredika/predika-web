import {Link} from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card"
import {ArrowRight, CircleCheck, BookOpen, UserCheck} from "lucide-react"

const features = [
    {
        icon: CircleCheck,
        title: "Koreksyon Enstantane",
        description: "AI nou an rapidman idantifye ak korije erè gramè ak òtograf nan tèks ou, asire ke mesaj ou klè ak pwofesyonèl.",
        link: "#",
        linkText: "Wè Kijan Sa Fonksyone",
    },
    {
        icon: BookOpen,
        title: "Zouti Aprantisaj",
        description: "Amelyore konpetans lang ou ak zouti aprantisaj sa ki eksplike koreksyon yo ak ofri konsèy pou pi bon sentaks nan Kreyòl.",
        link: "#",
        linkText: "Eksplore Zouti Aprantisaj",
    },
    {
        icon: UserCheck,
        title: "Sijesyon Pèsonalize",
        description: "AI nou an konprann nyans ak tradisyon Kreyòl, bay ou koreksyon ak sijesyon ki respekte kilti a.",
        link: "#",
        linkText: "Dekouvri Karakteristik Pèsonalize",
    }
]

export default function FeaturesSection() {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-white" id="features">
            <div className="px-4 md:px-6">
                <div className="grid gap-12 lg:gap-16">
                    <div className="space-y-4 text-center">
            <span className="text-sm font-medium text-[#40c4a7]">
              KÒMANSE GRATIS
            </span>
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#2d2d5f]">
                            Verifye Gramè ak Òtograf
                        </h2>
                        <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                            Bay AI nou an tèks ou a, e li ap otomatikman korije li pou ou nan sèlman kèk segond.
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