"use client";

import { motion } from "framer-motion";
import { fadeInLeft, fadeInRight, staggerContainer } from "@/lib/animations";
import AvailabilityCalendar from "@/components/booking/availability-calendar";
import Image from "next/image";

export default function MountainSection() {
  
  return (
    <section id="availability" className="py-16 bg-[#2A2A2A] flex items-center" style={{ minHeight: '80vh' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Left Content - Date Picker */}
          <motion.div 
            className="space-y-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div variants={fadeInLeft}>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Verfügbare Zeiträume
              </h2>
              <p className="text-base text-gray-300 mb-6">
                Wähle deine gewünschten Reisedaten und buche direkt deinen Campervan für dein Abenteuer.
              </p>
            </motion.div>
            
            <motion.div variants={fadeInLeft} className="space-y-4">
              <AvailabilityCalendar />
              
              <div className="text-center">
                <button className="bg-[#D4A574] hover:bg-[#c19660] text-black font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm">
                  Jetzt buchen
                </button>
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
            {/* Image Container */}
            <div className="relative w-full mt-16">
              <Image
                src="/images/sideview.png"
                alt="CampervanJuli Seitenansicht Panorama"
                width={1000}
                height={600}
                className="w-full h-auto rounded-2xl shadow-2xl hover:scale-105 transition-transform duration-700 scale-110"
                style={{ filter: 'brightness(1.05) contrast(1.1)' }}
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}