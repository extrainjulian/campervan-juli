"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

export default function InteriorVideoSection() {
  return (
    <section id="interior" className="py-16 bg-[#F5F1EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        

        {/* Placeholder for Interior Content */}
        <motion.div 
          className="w-full"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-[#F5F1EB] to-[#D4A574]/30 flex items-center justify-center" style={{ aspectRatio: '16/9', minHeight: '60vh' }}>
            <div className="text-center">
              <div className="text-6xl mb-4">🚐</div>
              <span className="text-[#2B5F75] font-medium text-lg">Innenraum-Video wird bald verfügbar sein</span>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}