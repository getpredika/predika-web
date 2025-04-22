import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { MessageSquare, Smartphone, Bell, ExternalLink } from "lucide-react";

export default function WhatsAppChannelSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const benefits = [
    {
      icon: <Bell className="h-5 w-5 text-[#40c4a7]" aria-hidden="true" />,
      text: "Resevwa dènye mizajou ak nouvèl sou Predika",
    },
    {
      icon: <MessageSquare className="h-5 w-5 text-[#40c4a7]" aria-hidden="true" />,
      text: "Jwenn konsèy ak asistans pou amelyore ekriti Kreyòl ou",
    },
    {
      icon: <Smartphone className="h-5 w-5 text-[#40c4a7]" aria-hidden="true" />,
      text: "Aksè fasil ak rapid sou telefòn ou",
    },
  ];

  return (
    <section className="relative w-full py-12 md:py-24 lg:py-32 bg-white overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at center, #40c4a7 2.7px, transparent 2.7px)",
          backgroundSize: "24px 24px",
          opacity: 0.1,
          zIndex: 0,
        }}
      />
      <div className="container px-4 md:px-6">
        <motion.div
          ref={ref}
          className="grid lg:grid-cols-2 gap-10 items-center justify-items-center text-center lg:text-left"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          
          <div className="w-full max-w-xl space-y-6">
            <div className="inline-block rounded-lg bg-[#f0faf7] px-3 py-1 text-sm text-[#40c4a7]">
              Konekte ak Nou
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl text-[#2d2d5f]">
              Swiv Kanal WhatsApp Nou
            </h2>
            <p className="text-gray-500 md:text-lg">
              Rete konekte ak Predika sou WhatsApp pou resevwa dènye mizajou,
              konsèy, ak asistans pou amelyore ekriti Kreyòl ou.
            </p>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-3 text-left"
                  variants={itemVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#f0faf7] flex items-center justify-center">
                    {benefit.icon}
                  </div>
                  <p className="text-gray-600">{benefit.text}</p>
                </motion.div>
              ))}
            </div>

            <div className="pt-4">
              <a
                href="https://whatsapp.com/channel/0029VbBCVAuL7UVZSVBdt10x"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button className="bg-[#25D366] hover:bg-[#25D366]/90 text-white px-8 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" aria-hidden="true" />
                  Swiv Nou sou WhatsApp
                  <ExternalLink className="h-4 w-4 ml-1" aria-hidden="true" />
                </Button>
              </a>
            </div>
          </div>

        
          <div className="flex justify-center">
            <motion.div
              className="relative bg-white p-6 rounded-2xl shadow-lg border border-gray-100 max-w-xs"
              variants={itemVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#25D366] mb-3">
                  <MessageSquare className="h-6 w-6 text-white" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-semibold text-[#2d2d5f]">
                  Kanal Predika
                </h3>
                <p className="text-sm text-gray-500 mt-1">Eskane kòd QR la</p>
              </div>

              <div className="bg-white p-2 rounded-xl border border-gray-200 mb-4">
                <img
                  src="/channel-whatsapp-qr.jpeg"
                  alt="WhatsApp Channel QR Code"
                  width={200}
                  height={200}
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
