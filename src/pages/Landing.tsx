import { Link } from "wouter";
import { motion } from "framer-motion";
import { useState, useCallback } from "react";
import {
  BookOpen,
  Mic,
  Volume2,
  Brain,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Star,
  Users,
  Zap,
  Shield,
  Globe,
  MessageSquare,
  ChevronDown,
  Play,
} from "lucide-react";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { PointerHighlight } from "@/components/ui/pointer-highlight";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import predikaLogo from "@assets/predika-logo.png";

const features = [
  {
    icon: BookOpen,
    title: "Diksyonè Entelijan",
    description:
      "Chèche mo rapidman ak pwononsyasyon IPA ak ARPAbet, definisyon, ak egzanp fraz.",
  },
  {
    icon: Mic,
    title: "Evalyasyon Pwononsyasyon",
    description:
      "Resevwa kòmantè an tan reyèl sou pwononsyasyon ou ak nòt detaye epi konsèy pou amelyore.",
  },
  {
    icon: Volume2,
    title: "Tèks an Lapawòl",
    description:
      "Konvèti nenpòt tèks an odyo natirèl ak plizyè opsyon vwa ak kontwòl vitès.",
  },
  {
    icon: Brain,
    title: "Quiz Vokabilè",
    description:
      "Teste konesans ou ak quiz entèraktif epi swiv pwogrè ou ak tan.",
  },
  {
    icon: Sparkles,
    title: "Koreksyon Gramè",
    description:
      "Korije erè òtograf, gramè, ak ponktyasyon ak sijesyon ki soti nan AI.",
  },
  {
    icon: MessageSquare,
    title: "Lapawòl an Tèks",
    description:
      "Transkripsyon odyo ak tan pou chak mo ak lekti senkonize.",
  },
];

const stats = [
  { value: "10K+", label: "Mo nan Diksyonè" },
  { value: "50+", label: "Kategori Quiz" },
  { value: "98%", label: "To Presizyon" },
  { value: "24/7", label: "Disponib" },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Elèv Lang",
    content:
      "Aplikasyon sa a transfòme fason m ap aprann vokabilè. Kòmantè sou pwononsyasyon an trè itil!",
    rating: 5,
  },
  {
    name: "Michael Torres",
    role: "Pwofesè Anglè",
    content:
      "Mwen rekòmande sa bay tout elèv mwen yo. Sistèm quiz la kenbe yo enterese epi motive.",
    rating: 5,
  },
  {
    name: "Emma Williams",
    role: "Ekriven Kontni",
    content:
      "Korektè gramè a ekonomize m plizyè èdtan nan revizyon. Li jwenn erè mwen toujou rate.",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "Pwofesyonèl Biznis",
    content:
      "Pafè pou amelyore konpetans prezantasyon Anglè mwen. Zouti lapawòl yo fantastik!",
    rating: 5,
  },
  {
    name: "Lisa Anderson",
    role: "Etidyan Gradye",
    content:
      "Quiz vokabilè yo ede m prepare pou GRE mwen. Rekòmande anpil pou preparasyon tès!",
    rating: 5,
  },
  {
    name: "James Wilson",
    role: "Devlopè Lojisyèl",
    content:
      "Ekselan pou vokabilè teknik. Mwen itilize l chak jou pou amelyore ekriti dokimantasyon mwen.",
    rating: 5,
  },
];

const pricingPlans = [
  {
    name: "Gratis",
    price: "$0",
    period: "pou tout tan",
    description: "Pafè pou kòmanse",
    features: [
      "Aksè diksyonè debaz",
      "5 quiz pa jou",
      "Tèks an lapawòl (limite)",
      "Sipò kominote",
    ],
    cta: "Kòmanse",
    popular: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "pa mwa",
    description: "Pou moun ki serye nan aprantisaj",
    features: [
      "Aksè diksyonè konplè",
      "Quiz san limit",
      "Tout opsyon vwa",
      "Evalyasyon pwononsyasyon",
      "Koreksyon gramè",
      "Swivi pwogrè",
      "Sipò priyorite",
    ],
    cta: "Kòmanse Esè Gratis",
    popular: true,
  },
  {
    name: "Ekip",
    price: "$29",
    period: "pa mwa",
    description: "Pou sal klas & ekip",
    features: [
      "Tout sa ki nan Pro",
      "Jiska 25 itilizatè",
      "Tablo bò administè",
      "Analize itilizasyon",
      "Lis mo pasonèl",
      "Aksè API",
      "Sipò dedye",
    ],
    cta: "Kontakte Vant",
    popular: false,
  },
];

const faqs = [
  {
    question: "Ki jan evalyasyon pwononsyasyon an fonksyone?",
    answer:
      "Evalyasyon pwononsyasyon nou an itilize rekonesèns lapawòl avanse pou analize mo ou pale yo epi konpare yo ak pwononsyasyon natif natal. Ou pral resevwa yon nòt ak kòmantè espesifik sou zòn pou amelyore.",
  },
  {
    question: "Èske mwen ka itilize aplikasyon sa a san entènèt?",
    answer:
      "Kèk fonksyonalite tankou diksyonè a ak quiz yo ka itilize san entènèt yon fwa done yo kache. Men, fonksyonalite ki mande tretèman AI tankou evalyasyon pwononsyasyon ak koreksyon gramè bezwen yon koneksyon entènèt.",
  },
  {
    question: "Èske done m yo prive epi sekirize?",
    answer:
      "Absoliman. Nou pran konfidansyalite o seryè epi nou pa janm pataje done pèsonèl ou ak tyès pati. Tout anrejistreman odyo trete an sekirite epi yo pa estoke sof si ou ekspèsiteman sove yo.",
  },
  {
    question: "Ki lang yo disponib sou platfòm nan?",
    answer:
      "Aktyèlman, nou sipòte Kreyòl Ayisyen. Nou ap travay pou ajoute plis lang nan tan ki ap vini pou ede plis moun aprann.",
  },
  {
    question: "Èske mwen bezwen mikwofòn espesyal pou evalyasyon pwononsyasyon?",
    answer:
      "Non, mikwofòn smartphone oswa òdinatè regilye ou byen ase. Men, yon mikwofòn ki gen pi bon kalite ka bay rezilta pi plis egzak.",
  },
];

const howItWorks = [
  {
    step: "1",
    title: "Chèche & Dekouvè",
    description:
      "Chèche nenpòt mo pou wè definisyon li, pwononsyasyon li, ak egzanp itilizasyon.",
  },
  {
    step: "2",
    title: "Pratike Pale",
    description:
      "Itilize zouti pwononsyasyon nou yo pou pratike pale epi resevwa kòmantè imedya.",
  },
  {
    step: "3",
    title: "Teste Konesans Ou",
    description:
      "Pran quiz pou ranfòse aprantisaj epi swiv kwasans vokabilè ou.",
  },
  {
    step: "4",
    title: "Metrize Lang",
    description:
      "Revize pwogrè ou epi kontinye konstwi konpetans lang ou chak jou.",
  },
];

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof features)[0];
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      key={feature.title}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        className="h-full relative overflow-visible transition-all duration-300"
        style={{
          boxShadow: isHovered
            ? "0 20px 40px -10px rgba(64, 196, 167, 0.15)"
            : "0 1px 3px rgba(0,0,0,0.1)",
          borderColor: isHovered ? "rgba(64, 196, 167, 0.3)" : undefined,
        }}
      >
        <div
          className="absolute top-0 right-0 w-24 h-24 pointer-events-none transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(circle at top right, rgba(64, 196, 167, 0.15), transparent 70%)",
            opacity: isHovered ? 1 : 0.5,
          }}
        />
        <CardContent className="p-6 relative">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-all duration-300"
            style={{
              backgroundColor: isHovered ? "#40C4A7" : "#E6FFF7",
            }}
          >
            <feature.icon
              className="w-6 h-6 transition-colors duration-300"
              style={{ color: isHovered ? "white" : "#53CAB0" }}
            />
          </div>
          <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
          <p className="text-muted-foreground">{feature.description}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function TestimonialCarousel() {
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <div className="relative overflow-hidden">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <div
        className="flex gap-6 py-4 animate-scroll"
        style={{ width: "max-content" }}
      >
        {duplicatedTestimonials.map((testimonial, index) => (
          <TestimonialCard
            key={`${testimonial.name}-${index}`}
            testimonial={testimonial}
          />
        ))}
      </div>
    </div>
  );
}

function TestimonialCard({
  testimonial,
}: {
  testimonial: (typeof testimonials)[0];
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="flex-shrink-0 w-[350px]"
    >
      <Card
        className="h-full relative overflow-visible transition-all duration-300"
        style={{
          boxShadow: isHovered
            ? "0 20px 40px -10px rgba(64, 196, 167, 0.2)"
            : "0 1px 3px rgba(0,0,0,0.1)",
          borderColor: isHovered ? "rgba(64, 196, 167, 0.3)" : undefined,
        }}
      >
        <div
          className="absolute top-0 right-0 w-20 h-20 pointer-events-none transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(circle at top right, rgba(64, 196, 167, 0.15), transparent 70%)",
            opacity: isHovered ? 1 : 0.5,
          }}
        />
        <CardContent className="p-6">
          <div className="flex gap-1 mb-4">
            {Array.from({ length: testimonial.rating }).map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 fill-yellow-400 text-yellow-400"
              />
            ))}
          </div>
          <p className="mb-4 text-muted-foreground">&quot;{testimonial.content}&quot;</p>
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
              style={{
                backgroundColor: isHovered ? "#40C4A7" : "#F0FAF7",
              }}
            >
              <span
                className="text-sm font-semibold transition-colors duration-300"
                style={{ color: isHovered ? "white" : "#53CAB0" }}
              >
                {testimonial.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </span>
            </div>
            <div>
              <div className="font-medium text-sm">{testimonial.name}</div>
              <div className="text-xs text-muted-foreground">
                {testimonial.role}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PricingCard({
  plan,
  index,
}: {
  plan: (typeof pricingPlans)[0];
  index: number;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      key={plan.name}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Card
        className={`h-full relative overflow-visible transition-all duration-300 ${plan.popular ? "border-primary" : ""}`}
        style={{
          boxShadow: isHovered
            ? "0 20px 40px -10px rgba(64, 196, 167, 0.2)"
            : plan.popular
              ? "0 10px 30px -10px rgba(64, 196, 167, 0.15)"
              : "0 1px 3px rgba(0,0,0,0.1)",
          borderColor: isHovered
            ? "rgba(64, 196, 167, 0.4)"
            : plan.popular
              ? undefined
              : undefined,
        }}
      >
        {plan.popular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge className="bg-primary text-primary-foreground">
              Pi Popilè
            </Badge>
          </div>
        )}
        <div
          className="absolute top-0 right-0 w-24 h-24 pointer-events-none transition-opacity duration-300"
          style={{
            background:
              "radial-gradient(circle at top right, rgba(64, 196, 167, 0.15), transparent 70%)",
            opacity: isHovered ? 1 : 0.5,
          }}
        />
        <CardContent className="p-6 relative">
          <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
          <p className="text-sm text-muted-foreground mb-4">
            {plan.description}
          </p>
          <div className="mb-6">
            <span className="text-4xl font-bold">{plan.price}</span>
            <span className="text-muted-foreground">/{plan.period}</span>
          </div>
          <ul className="space-y-3 mb-6">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <Button
            className="w-full"
            variant={plan.popular ? "default" : "outline"}
            data-testid={`button-pricing-${plan.name.toLowerCase()}`}
          >
            {plan.cta}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Landing() {
  const { user, isLoading, isAuthenticated, logout } = useAuth();

  const scrollToSection = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
      e.preventDefault();
      const element = document.getElementById(sectionId);
      if (element) {
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    },
    [],
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <img
                src={predikaLogo}
                alt="Predika"
                className="w-8 h-8 rounded-lg"
              />
              <span className="font-serif font-bold text-xl">Predika</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a
                href="#features"
                onClick={(e) => scrollToSection(e, "features")}
                className="text-sm text-muted-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full cursor-pointer"
                data-testid="link-nav-features"
              >
                Fonksyonalite
              </a>
              <a
                href="#how-it-works"
                onClick={(e) => scrollToSection(e, "how-it-works")}
                className="text-sm text-muted-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full cursor-pointer"
                data-testid="link-nav-how-it-works"
              >
                Ki Jan Sa Mache
              </a>
              {/* <a
                href="#pricing"
                onClick={(e) => scrollToSection(e, "pricing")}
                className="text-sm text-muted-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full cursor-pointer"
                data-testid="link-nav-pricing"
              >
                Pri
              </a> */}
              <a
                href="#faq"
                onClick={(e) => scrollToSection(e, "faq")}
                className="text-sm text-muted-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full cursor-pointer"
                data-testid="link-nav-faq"
              >
                Kesyon
              </a>
            </nav>
            <div className="flex items-center gap-3">
              {isLoading ? (
                <div className="w-20 h-9 bg-muted animate-pulse rounded-md" />
              ) : isAuthenticated && user ? (
                <>
                  <Link href="/studio">
                    <Button variant="ghost" data-testid="button-dashboard">
                      Tablo Bò
                    </Button>
                  </Link>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={user.avatar || undefined}
                        alt={user.fullName || "User"}
                      />
                      <AvatarFallback className="text-xs">
                        {user.fullName?.[0] ||
                          user.email?.[0]?.toUpperCase() ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                    {/* <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => logout()}
                      data-testid="button-logout"
                    >
                      <LogOut className="w-4 h-4" />
                    </Button> */}
                  </div>
                </>
              ) : (
                <>
                  <Button asChild variant="ghost" data-testid="button-login">
                    <a href="/login">Konekte</a>
                  </Button>
                  <Button asChild data-testid="button-get-started">
                    <a href="/login">Kòmanse</a>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#40C4A7]/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-32 w-64 h-64 bg-[#53CAB0]/10 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge variant="outline" className="mb-6 px-4 py-1.5">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Pouse pa AI
            </Badge>
            <div className="flex flex-col items-center justify-center gap-2 mb-6">
              <LayoutTextFlip
                text="Metrize Lang ak"
                words={["Konfyans", "Fliditè", "Fasilite", "Siksè"]}
                duration={2500}
              />
            </div>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Platfòm tout-nan-yon pou vokabilè, aprantisaj ak pwononsyasyon.
              Chèche mo, pratike pale, pran quiz, epi swiv pwogrè ou.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <Link href="/studio">
                  <Button
                    size="lg"
                    className="text-base px-8"
                    data-testid="button-hero-start"
                  >
                    Kòmanse Aprann Gratis
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              ) : (
                <Button asChild size="lg" className="text-base px-8" data-testid="button-hero-start">
                  <a href="/login">
                    Kòmanse Aprann Gratis
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              )}
              <Button asChild size="lg" variant="outline" className="text-base px-8" data-testid="button-hero-demo">
                <a href="https://cal.com/predika-g8xvz4" target="_blank" rel="noopener noreferrer">
                  <Play className="w-4 h-4 mr-2" />
                  Gade Demo
                </a>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-16 relative"
          >
            <div className="rounded-xl border shadow-2xl overflow-hidden bg-card max-w-5xl mx-auto">
              <div className="bg-muted/50 px-4 py-3 border-b flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span className="text-xs text-muted-foreground ml-2">
                  Aplikasyon Predika
                </span>
              </div>
              <div className="p-6 md:p-8 bg-gradient-to-br from-primary/5 to-transparent">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#E6FFF7] flex items-center justify-center">
                        <BookOpen
                          className="w-6 h-6"
                          style={{ color: "#53CAB0" }}
                        />
                      </div>
                      <div>
                        <h3 className="font-serif text-2xl font-bold">
                          Libète
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          /li.bɛ.te/
                        </p>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      Eta yon moun oswa yon pèp ki lib, ki pa anba opresyon ni dominasyon.
                    </p>
                    <div className="p-3 rounded-lg bg-muted/50 border-l-2 border-primary">
                      <p className="text-sm italic">
                        "Libète se dwa fondamantal tout moun."
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm font-medium">
                        Nòt Pwononsyasyon
                      </span>
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        92%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm font-medium">Mo Aprann</span>
                      <Badge variant="outline">247</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm font-medium">Sèri Quiz</span>
                      <Badge className="bg-primary/15 text-primary">
                        7 jou
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.a
            href="#features"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col items-center mt-12 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            data-testid="link-explore-features"
          >
            <span className="text-sm mb-2">Eksplore Fonksyon</span>
            <ChevronDown className="w-5 h-5 animate-bounce" />
          </motion.a>
        </div>
      </section>

      <section className="py-12 border-y bg-muted/30 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-48 h-48 bg-[#40C4A7]/5 rounded-full blur-3xl" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="features"
        className="py-20 md:py-28 relative overflow-hidden"
      >
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-[#E6FFF7] rounded-full blur-3xl opacity-50" />
        <div className="absolute top-40 -right-32 w-64 h-64 bg-[#53CAB0]/10 rounded-full blur-3xl" />
        {/* Dot pattern background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(#40C4A7 1.5px, transparent 1.5px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4">
              Fonksyonalite
            </Badge>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Tout Sa Ou Bezwen Pou{" "}
              <PointerHighlight pointerClassName="text-primary">
                <span>Aprann</span>
              </PointerHighlight>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Yon konplè zouti pou konstwi vokabilè, pratike pwononsyasyon,
              ak metriz lang.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                feature={feature}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

      <section
        id="how-it-works"
        className="py-20 md:py-28 bg-muted/30 relative overflow-hidden"
      >
        <div className="absolute top-20 left-1/4 w-56 h-56 bg-[#40C4A7]/8 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 right-1/3 w-48 h-48 bg-[#E6FFF7] rounded-full blur-3xl opacity-60" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(#40C4A7 1px, transparent 1px), linear-gradient(90deg, #40C4A7 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4">
              Ki Jan Sa Mache
            </Badge>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Kòmanse Aprann nan{" "}
              <PointerHighlight pointerClassName="text-primary">
                <span>Minit</span>
              </PointerHighlight>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Kat etap senp nou yo rann aprantisaj lang efikas ak agreab.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {index < howItWorks.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-border" />
                )}
                <div className="relative flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-bold mb-4 relative z-10">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute -top-20 right-0 w-80 h-80 bg-[#53CAB0]/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-[#E6FFF7] rounded-full blur-3xl opacity-40" />
        {/* Dot pattern background */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025]"
          style={{
            backgroundImage: "radial-gradient(#53CAB0 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4">
              Temwanyaj
            </Badge>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Renmen pa{" "}
              <PointerHighlight pointerClassName="text-primary">
                <span>Elèv</span>
              </PointerHighlight>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Gade sa itilizatè nou yo di sou eksperyans aprantisaj yo.
            </p>
          </motion.div>

          <TestimonialCarousel />
        </div>
      </section>

      {/* <section
        id="pricing"
        className="py-20 md:py-28 bg-muted/30 relative overflow-hidden"
      >
        <div className="absolute top-1/3 -left-16 w-64 h-64 bg-[#40C4A7]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 right-1/4 w-72 h-72 bg-[#E6FFF7] rounded-full blur-3xl opacity-50" />
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#40C4A7 1px, transparent 1px), linear-gradient(90deg, #40C4A7 1px, transparent 1px)`,
          backgroundSize: "32px 32px",
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">
            Pri
          </Badge>
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
            Senp,{" "}
            <PointerHighlight pointerClassName="text-primary">
              <span>Transparan</span>
            </PointerHighlight>{" "}
            Pri
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Chwazi plan ki pi bon pou ou. Tout plan gen 14 jou esè gratis.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {pricingPlans.map((plan, index) => (
            <PricingCard key={plan.name} plan={plan} index={index} />
          ))}
        </div>
      </div>
    </section> */}

      <section id="faq" className="py-20 md:py-28 relative overflow-hidden">
        <div className="absolute top-20 right-1/3 w-56 h-56 bg-[#53CAB0]/8 rounded-full blur-3xl" />
        {/* Dot pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.02]"
          style={{
            backgroundImage:
              "radial-gradient(#40C4A7 1.5px, transparent 1.5px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Badge variant="outline" className="mb-4">
              Kesyon
            </Badge>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Kesyon Ki Poze{" "}
              <PointerHighlight pointerClassName="text-primary">
                <span>Souvan</span>
              </PointerHighlight>
            </h2>
            <p className="text-lg text-muted-foreground">
              Ou gen kesyon? Nou gen repons.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Pare Pou Kòmanse Aprann?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Antre nan milye elèv k ap amelyore vokabilè yo ak pwononsyasyon yo chak jou.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/app">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-base px-8"
                  data-testid="button-cta-start"
                >
                  Kòmanse Gratis
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Button asChild size="lg" variant="outline" className="text-base px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10" data-testid="button-cta-demo">
                <a href="https://cal.com/predika-g8xvz4" target="_blank" rel="noopener noreferrer">
                  Pwograme Demo
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="py-12 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <img
                  src={predikaLogo}
                  alt="Predika"
                  className="w-8 h-8 rounded-lg"
                />
                <span className="font-serif font-bold text-xl">Predika</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Fòm modèn pou aprann vokabilè ak amelyore pwononsyasyon.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Pwodwi</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#features"
                    className="hover:text-foreground transition-colors"
                    data-testid="link-footer-features"
                  >
                    Fonksyonalite
                  </a>
                </li>
                {/* <li>
                  <a
                    href="#pricing"
                    className="hover:text-foreground transition-colors"
                    data-testid="link-footer-pricing"
                  >
                    Pri
                  </a>
                </li> */}
                <li>
                  <a
                    className="text-muted-foreground/60 cursor-default"
                    aria-disabled="true"
                    data-testid="link-footer-api"
                  >
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Konpayi</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    className="text-muted-foreground/60 cursor-default"
                    aria-disabled="true"
                    data-testid="link-footer-about"
                  >
                    Konsènan
                  </a>
                </li>
                <li>
                  <a
                    className="text-muted-foreground/60 cursor-default"
                    aria-disabled="true"
                    data-testid="link-footer-blog"
                  >
                    Blòg
                  </a>
                </li>
                <li>
                  <a
                    className="text-muted-foreground/60 cursor-default"
                    aria-disabled="true"
                    data-testid="link-footer-careers"
                  >
                    Karyè
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-foreground transition-colors"
                    data-testid="link-footer-privacy"
                  >
                    Konfidansyalite
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-foreground transition-colors"
                    data-testid="link-footer-terms"
                  >
                    Tèm
                  </Link>
                </li>
                <li>
                  <a
                    className="text-muted-foreground/60 cursor-default"
                    aria-disabled="true"
                    data-testid="link-footer-contact"
                  >
                    Kontakte
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Predika. Tout dwa rezève.
            </p>
            <div className="flex items-center gap-4">
              <button
                className="text-muted-foreground"
                aria-label="Sit wèb"
                data-testid="link-social-globe"
              >
                <Globe className="w-5 h-5" />
              </button>
              <button
                className="text-muted-foreground"
                aria-label="Kominote"
                data-testid="link-social-users"
              >
                <Users className="w-5 h-5" />
              </button>
              <button
                className="text-muted-foreground"
                aria-label="Sekirite"
                data-testid="link-social-shield"
              >
                <Shield className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div >
  );
}
