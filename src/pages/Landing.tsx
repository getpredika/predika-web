import { Link } from "wouter";
import { motion } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";
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
  LogOut,
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
    title: "Smart Dictionary",
    description:
      "Look up words instantly with IPA and ARPAbet pronunciations, definitions, and example sentences.",
  },
  {
    icon: Mic,
    title: "Pronunciation Assessment",
    description:
      "Get real-time feedback on your pronunciation with detailed scoring and improvement tips.",
  },
  {
    icon: Volume2,
    title: "Text to Speech",
    description:
      "Convert any text to natural-sounding audio with multiple voice options and speed control.",
  },
  {
    icon: Brain,
    title: "Vocabulary Quizzes",
    description:
      "Test your knowledge with interactive quizzes and track your progress over time.",
  },
  {
    icon: Sparkles,
    title: "Grammar Correction",
    description:
      "Fix spelling, grammar, and punctuation errors with AI-powered suggestions.",
  },
  {
    icon: MessageSquare,
    title: "Speech to Text",
    description:
      "Transcribe audio with word-level timestamps and synchronized playback.",
  },
];

const stats = [
  { value: "10K+", label: "Words in Dictionary" },
  { value: "50+", label: "Quiz Categories" },
  { value: "98%", label: "Accuracy Rate" },
  { value: "24/7", label: "Available" },
];

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Language Student",
    content:
      "This app transformed how I learn vocabulary. The pronunciation feedback is incredibly helpful!",
    rating: 5,
  },
  {
    name: "Michael Torres",
    role: "ESL Teacher",
    content:
      "I recommend this to all my students. The quiz system keeps them engaged and motivated.",
    rating: 5,
  },
  {
    name: "Emma Williams",
    role: "Content Writer",
    content:
      "The grammar corrector saves me hours of proofreading. It catches errors I always miss.",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "Business Professional",
    content:
      "Perfect for improving my English presentation skills. The speech tools are fantastic!",
    rating: 5,
  },
  {
    name: "Lisa Anderson",
    role: "Graduate Student",
    content:
      "The vocabulary quizzes helped me prepare for my GRE. Highly recommended for test prep!",
    rating: 5,
  },
  {
    name: "James Wilson",
    role: "Software Developer",
    content:
      "Great for technical vocabulary. I use it daily to improve my documentation writing.",
    rating: 5,
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "Basic dictionary access",
      "5 quizzes per day",
      "Text to speech (limited)",
      "Community support",
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "per month",
    description: "For serious learners",
    features: [
      "Full dictionary access",
      "Unlimited quizzes",
      "All voice options",
      "Pronunciation assessment",
      "Grammar correction",
      "Progress tracking",
      "Priority support",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Team",
    price: "$29",
    period: "per month",
    description: "For classrooms & teams",
    features: [
      "Everything in Pro",
      "Up to 25 users",
      "Admin dashboard",
      "Usage analytics",
      "Custom word lists",
      "API access",
      "Dedicated support",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

const faqs = [
  {
    question: "How does the pronunciation assessment work?",
    answer:
      "Our pronunciation assessment uses advanced speech recognition to analyze your spoken words and compare them against native pronunciations. You'll receive a score and specific feedback on areas to improve.",
  },
  {
    question: "Can I use this app offline?",
    answer:
      "Some features like the dictionary and quizzes can be used offline once data is cached. However, features requiring AI processing like pronunciation assessment and grammar correction need an internet connection.",
  },
  {
    question: "Is my data private and secure?",
    answer:
      "Absolutely. We take privacy seriously and never share your personal data with third parties. All audio recordings are processed securely and not stored unless you explicitly save them.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Yes, you can cancel your subscription at any time with no questions asked. You'll continue to have access until the end of your billing period.",
  },
  {
    question: "Do you offer discounts for students?",
    answer:
      "Yes! Students with a valid .edu email address receive 50% off the Pro plan. Contact our support team with proof of enrollment to get your discount.",
  },
];

const howItWorks = [
  {
    step: "1",
    title: "Search & Discover",
    description:
      "Look up any word to see its definition, pronunciation, and usage examples.",
  },
  {
    step: "2",
    title: "Practice Speaking",
    description:
      "Use our pronunciation tools to practice speaking and get instant feedback.",
  },
  {
    step: "3",
    title: "Test Your Knowledge",
    description:
      "Take quizzes to reinforce learning and track your vocabulary growth.",
  },
  {
    step: "4",
    title: "Master Language",
    description:
      "Review your progress and continue building your language skills daily.",
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
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const duplicatedTestimonials = [...testimonials, ...testimonials];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationId: number;
    let scrollPosition = 0;
    const scrollSpeed = 0.5;

    const animate = () => {
      if (!isPaused && scrollContainer) {
        scrollPosition += scrollSpeed;
        const maxScroll = scrollContainer.scrollWidth / 2;
        if (scrollPosition >= maxScroll) {
          scrollPosition = 0;
        }
        scrollContainer.scrollLeft = scrollPosition;
      }
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  return (
    <div
      className="relative overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-hidden py-4"
        style={{ scrollBehavior: "auto" }}
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
              Most Popular
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
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={(e) => scrollToSection(e, "how-it-works")}
                className="text-sm text-muted-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full cursor-pointer"
                data-testid="link-nav-how-it-works"
              >
                How it Works
              </a>
              <a
                href="#pricing"
                onClick={(e) => scrollToSection(e, "pricing")}
                className="text-sm text-muted-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full cursor-pointer"
                data-testid="link-nav-pricing"
              >
                Pricing
              </a>
              <a
                href="#faq"
                onClick={(e) => scrollToSection(e, "faq")}
                className="text-sm text-muted-foreground hover:text-primary transition-colors relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full cursor-pointer"
                data-testid="link-nav-faq"
              >
                FAQ
              </a>
            </nav>
            <div className="flex items-center gap-3">
              {isLoading ? (
                <div className="w-20 h-9 bg-muted animate-pulse rounded-md" />
              ) : isAuthenticated && user ? (
                <>
                  <Link href="/app">
                    <Button variant="ghost" data-testid="button-dashboard">
                      Dashboard
                    </Button>
                  </Link>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage
                        src={user.profileImageUrl || undefined}
                        alt={user.firstName || "User"}
                      />
                      <AvatarFallback className="text-xs">
                        {user.firstName?.[0] ||
                          user.email?.[0]?.toUpperCase() ||
                          "U"}
                      </AvatarFallback>
                    </Avatar>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => logout()}
                      data-testid="button-logout"
                    >
                      <LogOut className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <a href="/api/login">
                    <Button variant="ghost" data-testid="button-login">
                      Log in
                    </Button>
                  </a>
                  <a href="/api/login">
                    <Button data-testid="button-get-started">
                      Get Started
                    </Button>
                  </a>
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
              Powered by AI
            </Badge>
            <div className="flex flex-col items-center justify-center gap-2 mb-6">
              <LayoutTextFlip
                text="Master Language with"
                words={["Confidence", "Fluency", "Ease", "Success"]}
                duration={2500}
              />
            </div>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              The all-in-one vocabulary and pronunciation learning platform.
              Look up words, practice speaking, take quizzes, and track your
              progress.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <Link href="/app">
                  <Button
                    size="lg"
                    className="text-base px-8"
                    data-testid="button-hero-start"
                  >
                    Start Learning Free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              ) : (
                <a href="/api/login">
                  <Button
                    size="lg"
                    className="text-base px-8"
                    data-testid="button-hero-start"
                  >
                    Start Learning Free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              )}
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8"
                data-testid="button-hero-demo"
              >
                <Play className="w-4 h-4 mr-2" />
                Watch Demo
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
                  Predika App
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
                          Serendipity
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          /ˌser.ənˈdɪp.ə.ti/
                        </p>
                      </div>
                    </div>
                    <p className="text-muted-foreground">
                      The occurrence of events by chance in a happy or
                      beneficial way.
                    </p>
                    <div className="p-3 rounded-lg bg-muted/50 border-l-2 border-primary">
                      <p className="text-sm italic">
                        "Finding that book was pure serendipity."
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm font-medium">
                        Pronunciation Score
                      </span>
                      <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        92%
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm font-medium">Words Learned</span>
                      <Badge variant="outline">247</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <span className="text-sm font-medium">Quiz Streak</span>
                      <Badge className="bg-primary/15 text-primary">
                        7 days
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
            <span className="text-sm mb-2">Explore Features</span>
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
              Features
            </Badge>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Everything You Need to{" "}
              <PointerHighlight pointerClassName="text-primary">
                <span>Learn</span>
              </PointerHighlight>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A complete toolkit for vocabulary building, pronunciation
              practice, and language mastery.
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
              How It Works
            </Badge>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Start Learning in{" "}
              <PointerHighlight pointerClassName="text-primary">
                <span>Minutes</span>
              </PointerHighlight>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our simple four-step process makes language learning effective and
              enjoyable.
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
              Testimonials
            </Badge>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Loved by{" "}
              <PointerHighlight pointerClassName="text-primary">
                <span>Learners</span>
              </PointerHighlight>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See what our users have to say about their learning experience.
            </p>
          </motion.div>

          <TestimonialCarousel />
        </div>
      </section>

      <section
        id="pricing"
        className="py-20 md:py-28 bg-muted/30 relative overflow-hidden"
      >
        <div className="absolute top-1/3 -left-16 w-64 h-64 bg-[#40C4A7]/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 right-1/4 w-72 h-72 bg-[#E6FFF7] rounded-full blur-3xl opacity-50" />
        {/* Grid pattern */}
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
              Pricing
            </Badge>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Simple,{" "}
              <PointerHighlight pointerClassName="text-primary">
                <span>Transparent</span>
              </PointerHighlight>{" "}
              Pricing
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that works best for you. All plans include a
              14-day free trial.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <PricingCard key={plan.name} plan={plan} index={index} />
            ))}
          </div>
        </div>
      </section>

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
              FAQ
            </Badge>
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Frequently Asked{" "}
              <PointerHighlight pointerClassName="text-primary">
                <span>Questions</span>
              </PointerHighlight>
            </h2>
            <p className="text-lg text-muted-foreground">
              Got questions? We've got answers.
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
              Ready to Start Learning?
            </h2>
            <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
              Join thousands of learners who are improving their vocabulary and
              pronunciation every day.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/app">
                <Button
                  size="lg"
                  variant="secondary"
                  className="text-base px-8"
                  data-testid="button-cta-start"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                data-testid="button-cta-demo"
              >
                Schedule Demo
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
                The modern way to learn vocabulary and improve pronunciation.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#features"
                    className="hover:text-foreground transition-colors"
                    data-testid="link-footer-features"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="hover:text-foreground transition-colors"
                    data-testid="link-footer-pricing"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                    data-testid="link-footer-api"
                  >
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                    data-testid="link-footer-about"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                    data-testid="link-footer-blog"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                    data-testid="link-footer-careers"
                  >
                    Careers
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-foreground transition-colors"
                    data-testid="link-footer-privacy"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-foreground transition-colors"
                    data-testid="link-footer-terms"
                  >
                    Terms
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-foreground transition-colors"
                    data-testid="link-footer-contact"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              2025 Predika. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-social-globe"
              >
                <Globe className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-social-users"
              >
                <Users className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="link-social-shield"
              >
                <Shield className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
