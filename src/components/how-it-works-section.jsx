import { Button } from "@/components/ui/button"
import { Play } from "lucide-react"

export default function HowItWorksSection() {
    const steps = [
        {
            number: "1",
            title: "Select writing template",
            description: "Simply choose a template from available list to write content for blog posts, landing page, website content etc."
        },
        {
            number: "2",
            title: "Describe your topic",
            description: "Provide our AI content writer with few sentences on what you want to write, and it will start writing for you."
        },
        {
            number: "3",
            title: "Generate quality content",
            description: "Our powerful AI tools will generate content in few second, then you can export it to wherever you need."
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
            HOW IT WORKS
          </span>
                    <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#2d2d5f]">
                        Instruct to our AI and generate copy
                    </h2>
                    <p className="mx-auto max-w-[800px] text-gray-500 md:text-lg">
                        Give our AI a few descriptions and we'll automatically create blog articles, product descriptions and more for you within just few second.
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
                    <Button
                        className="bg-[#40c4a7] text-white hover:bg-[#40c4a7]/90 h-11 px-6 rounded-full text-base"
                    >
                        Start free trial today
                    </Button>
                    <Button
                        variant="outline"
                        className="h-11 px-6 rounded-full border-[#40c4a7] text-[#40c4a7] hover:bg-[#40c4a7] hover:text-white"
                    >
                        <Play className="w-4 h-4 mr-2" />
                        See action in video
                    </Button>
                </div>
            </div>
        </section>
    )
}