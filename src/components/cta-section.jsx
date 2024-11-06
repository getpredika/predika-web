import { Button } from "@/components/ui/button"
import { ArrowRight, Check } from "lucide-react"
import {Link} from "react-router-dom";

export default function CTASection() {
  const features = [
    "Pa bezwen ka kredi",
    "Plizyè zouti pou dekouvri",
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-[#f0faf7] [mask-image:radial-gradient(ellipse_at_center,black,transparent)] pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at center, #40c4a7 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          opacity: 0.2
        }} />
      </div>
      <div className="px-4 md:px-6 relative">
        <div className="flex flex-col items-center text-center space-y-8">
          <div className="space-y-6">
            <span className="text-sm font-medium text-[#40c4a7] bg-[#40c4a7]/10 px-4 py-1.5 rounded-full">
              AMELYORE FASON OU EKRI
            </span>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-[#2d2d5f]">
              Fini Fot Gramè
            </h2>
            <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl">
              Se tankou gen aksè a yon ekip ekspè ki ap korije tèks pou ou nan yon moman.
            </p>
          </div>
          <Link to="koreksyon-grame">
          <Button
            className="bg-[#40c4a7] text-white hover:bg-[#40c4a7]/90 h-12 px-8 rounded-full text-base"
          >
            Kòmanse
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          </Link>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {features.map((feature, i) => (
              <div
                key={i}
                className="flex items-center space-x-2 text-sm text-gray-500"
              >
                <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[#40c4a7]/10">
                  <Check className="h-3 w-3 text-[#40c4a7]" />
                </div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}