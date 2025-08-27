"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

export default function InteriorVideoSection() {
  return (
    <section id="interior" className="py-16 bg-[#F5F1EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          className="text-center mb-12"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#2B5F75] mb-4">
            Dein Zuhause auf Rädern
          </h2>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Erlebe den gemütlichen Innenraum unseres handgefertigten Campervans
          </p>
        </motion.div>

        {/* Fullscreen Video Container */}
        <motion.div 
          className="w-full"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl bg-gray-200" style={{ aspectRatio: '16/9', minHeight: '60vh' }}>
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover object-center"
              style={{ filter: 'brightness(1.05) contrast(1.1)' }}
            >
              <source src="/images/interior-video.webm" type="video/webm" />
              <div className="w-full h-full bg-gradient-to-br from-[#F5F1EB] to-[#D4A574]/30 flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 border-4 border-[#2B5F75] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <span className="text-[#2B5F75] font-medium">Video lädt...</span>
                </div>
              </div>
            </video>
          </div>
        </motion.div>

      </div>
    </section>
  );
}