"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { useRouter } from "next/navigation";

export default function HeroSection() {
  const router = useRouter();

  const handleMitmachen = () => {
    router.push('/dashboard');
  };
  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/frontview-min.png"
          alt="wuecamper van on beach"
          fill
          className="object-cover"
          priority
        />
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Hero Content - Top center on mobile, top-right on desktop */}
      <motion.div 
        className="absolute top-32 left-1/2 transform -translate-x-1/2 md:inset-auto md:top-16 md:right-4 md:left-auto md:transform-none lg:top-20 lg:right-8 xl:top-24 xl:right-16 2xl:right-20 z-10 text-white max-w-md lg:max-w-lg xl:max-w-xl px-4 md:px-0"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <div className="text-center md:text-left">
          <motion.h1 
            className="text-2xl md:text-2xl lg:text-3xl xl:text-4xl font-bold mb-2 md:mb-4 leading-tight"
            variants={fadeInUp}
            style={{ textDecoration: 'none' }}
          >
            <span className="text-[#D4A574] block" style={{ textDecoration: 'none' }}>Campervan für 50€ am Tag</span>
          </motion.h1>
          
          <motion.h2 
            className="text-lg md:text-xl lg:text-2xl xl:text-3xl mb-4 md:mb-6"
            variants={fadeInUp}
          >
            Aufbau als Community unterstützen
          </motion.h2>

          {/* Desktop description text - hidden on mobile */}
          <motion.p 
            className="hidden md:block text-sm md:text-base lg:text-lg text-gray-200 mb-6 md:mb-8 leading-relaxed"
            variants={fadeInUp}
          >
            Gemeinsam finanzieren wir den Aufbau unseres Campervans. 
            Dein finanzieller Beitrag = Deine gebuchte Zeit mit dem Van.
          </motion.p>

          {/* Mobile Button - Inside hero text container */}
          <motion.div 
            className="md:hidden flex justify-center mt-8 sm:mt-24"
            variants={fadeInUp}
          >
            <Button 
              size="lg"
              className="bg-[#D4A574] hover:bg-[#c19660] text-black font-semibold text-lg px-8 py-3 h-auto"
              onClick={handleMitmachen}
            >
              Jetzt mitmachen
            </Button>
          </motion.div>

          {/* Desktop Button */}
          <motion.div 
            className="hidden md:flex justify-center mt-4"
            variants={fadeInUp}
          >
            <Button 
              size="lg"
              className="bg-[#D4A574] hover:bg-[#c19660] text-black font-semibold text-lg px-8 py-3 h-auto"
              onClick={handleMitmachen}
            >
              Jetzt mitmachen
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}