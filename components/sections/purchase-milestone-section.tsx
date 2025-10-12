"use client";

import { motion } from "framer-motion";
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer } from "@/lib/animations";
import { CheckCircle, TrendingDown, Wrench } from "lucide-react";
import Image from "next/image";

export default function PurchaseMilestoneSection() {
  return (
    <section className="py-20 bg-[#F5F1EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <motion.div
          className="text-center mb-12"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-[#D4A574]/10 px-4 py-2 rounded-full mb-4"
            variants={fadeInUp}
          >
            <CheckCircle className="h-5 w-5 text-[#D4A574]" />
            <span className="text-[#2B5F75] font-semibold">04. Oktober 2025</span>
          </motion.div>

          <motion.h2
            className="text-4xl md:text-5xl font-bold text-[#2B5F75] mb-4"
            variants={fadeInUp}
          >
            Der <span className="text-[#D4A574]">Peugeot Boxer</span> ist gekauft!
          </motion.h2>

          <motion.p
            className="text-2xl font-bold text-[#4A5D23]"
            variants={fadeInUp}
          >
            8.100€
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Left Side - Image */}
          <motion.div
            variants={fadeInLeft}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div className="relative w-full rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/images/boxer.png"
                alt="Unser Peugeot Boxer L2H2 - frisch gekauft in Diedorf"
                width={800}
                height={600}
                className="object-cover w-full h-auto hover:scale-105 transition-transform duration-700"
              />
            </div>
          </motion.div>

          {/* Right Side - Journal Entry */}
          <motion.div
            variants={fadeInRight}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
            className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-[#D4A574]/20"
          >
            <div className="space-y-6 text-gray-700">
              {/* Vehicle specs first */}
              <div>
                <p className="font-semibold text-xl text-[#2B5F75] mb-4">Peugeot Boxer L2H2 - Baujahr 2015</p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-[#D4A574] flex-shrink-0" />
                    <span className="text-gray-700">Klimaanlage & Tempomat</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-[#D4A574] flex-shrink-0" />
                    <span className="text-gray-700">TÜV frisch erneuert</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-[#D4A574] flex-shrink-0" />
                    <span className="text-gray-700">Erste Hand, top gepflegt</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-[#D4A574] flex-shrink-0" />
                    <span className="text-gray-700">180.000 km Laufleistung</span>
                  </li>
                </ul>
              </div>

              {/* Story below */}
              <div className="pt-6 border-t border-[#D4A574]/20">
                <p className="text-lg leading-relaxed mb-4">
                  2½ Stunden Fahrt nach Diedorf bei Augsburg, zusammen mit Noah. Der Van stand online drin,
                  sah vielversprechend aus - also ab ins Auto und hingefahren.
                </p>
                <p className="text-lg leading-relaxed">
                  Sympathischer Verkäufer - Ofenbauer, erste Hand, hat uns direkt seine Familie vorgestellt.
                  Man merkt sofort: Die Karre wurde gepflegt, kein Händler-Bullshit. Nach kurzer Probefahrt war klar:
                  Das ist er. Deal gemacht, zurück nach Würzburg mit eigenem Van.
                </p>
              </div>
            </div>
          </motion.div>

        </div>

      </div>
    </section>
  );
}
