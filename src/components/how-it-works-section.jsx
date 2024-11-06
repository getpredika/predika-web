import { Button } from "@/components/ui/button"
import {Link} from "react-router-dom";

export default function HowItWorksSection() {
    const steps = [
        {
            number: "1",
            title: "Chwazi yon modèl AI",
            description: "Senpleman chwazi yon modèl ki adapte ak bezwen ou yo nan lis ki disponib la pou korije tèks ou a."
        },
        {
            number: "2",
            title: "Ekri tèks ou a",
            description: "Antre tèks ou a nan bwat ki endike a."
        },
        {
            number: "3",
            title: "Koreksyon",
            description: "AI la ap analize tèks ou a, kòmanse korije erè yo, epi montre ou tout fot yo."
        }
    ]



    return (
        <section className="w-full py-12 md:py-24 relative bg-white">
            <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle at center, #40c4a7 1px, transparent 1px)',
                backgroundSize: '24px 24px',
                opacity: 0.1
            }} />
            <div className="px-4 md:px-6 relative">
                <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <span className="text-sm font-medium text-[#40c4a7]">
            KIJAN SA FONKSYONE
          </span>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#2d2d5f]">
                        Pi Bon Fason Pou Korije Tèks
                    </h2>
                    <p className="mx-auto max-w-[800px] text-gray-500 md:text-lg">
                        Dekouvri kijan AI nou an fonksyone pou ofri ou koreksyon presi ak rapid.

                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-12">
                    {steps.map((step, i) => (
                        <div key={i} className="relative flex flex-col items-center text-center space-y-4">
                            <div className="text-8xl font-bold text-[#40c4a7]/10 mb-4">
                                {step.number}
                            </div>
                            <h3 className="text-xl font-bold text-[#2d2d5f]">{step.title}</h3>
                            <p className="text-gray-500">{step.description}</p>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link to="/koreksyon-grame">
                    <Button
                        className="bg-[#40c4a7] text-white hover:bg-[#40c4a7]/90 h-11 px-6 rounded-full text-base"
                    >
                        Kòmanse jodia
                    </Button>
                    </Link>
                    <Link to="/anregistre">
                    <Button
                        variant="outline"
                        className="h-11 px-6 rounded-full border-[#40c4a7] text-[#40c4a7] hover:bg-[#40c4a7] hover:text-white"
                    >
                        Kreyon kont
                    </Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}