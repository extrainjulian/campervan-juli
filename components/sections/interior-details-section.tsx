"use client";

import { motion } from "framer-motion";
import { fadeInLeft, fadeInRight, staggerContainer } from "@/lib/animations";
import Image from "next/image";

export default function InteriorDetailsSection() {
  const features = [
    { icon: "👥", text: "3 Sitzplätze für gemeinsame Abenteuer" },
    { icon: "🛏️", text: "1 gemütliches Bett für erholsame Nächte" },
    { icon: "🚿", text: "Außendusche für Frische in der Natur" },
    { icon: "🍳", text: "Vollwertige und ausgestattete Küche" },
    { icon: "🚽", text: "Trockentrenntoilette für Komfort" },
    { icon: "🚗", text: "Fahrbar mit B-Führerschein" },
    { icon: "🛡️", text: "Versicherung im Preis enthalten" }
  ];

  return (
    <section className="py-20 bg-[#F5F1EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content - Details */}
          <motion.div 
            className="space-y-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div variants={fadeInLeft}>
              <h2 className="text-4xl md:text-5xl font-bold text-[#2B5F75] mb-6">
                Peugeot Boxer
                <span className="block text-[#4A5D23]">Selbstausbau</span>
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                Unser handgefertigter Campervan bietet alles, was du für dein perfektes Abenteuer brauchst. 
                Durchdacht konzipiert und liebevoll ausgebaut.
              </p>
            </motion.div>
            
            <motion.div variants={fadeInLeft} className="space-y-6">
              <div className="grid gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-white/60 backdrop-blur-sm rounded-2xl border border-[#D4A574]/20 hover:bg-white/80 transition-all duration-300">
                    <span className="text-2xl">{feature.icon}</span>
                    <span className="text-gray-800 font-medium">{feature.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeInLeft} className="pt-6 border-t border-[#D4A574]/30">
              <div className="flex items-center gap-3 text-[#2B5F75]">
                <span className="text-3xl">✨</span>
                <div>
                  <p className="font-bold text-lg">Alles inklusive für €80/Tag</p>
                  <p className="text-gray-600">Mindestbuchung: 7 Tage</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div 
            className="w-full"
            variants={fadeInRight}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl" style={{ aspectRatio: '4/3' }}>
              <Image
                src="/images/interior.png"
                alt="Campervan Innenraum Layout"
                fill
                className="object-cover object-center hover:scale-105 transition-transform duration-700"
                style={{ filter: 'brightness(1.05) contrast(1.1)' }}
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}