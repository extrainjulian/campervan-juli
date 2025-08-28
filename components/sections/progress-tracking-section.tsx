"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { CheckCircle, Clock, Users } from "lucide-react";

export default function ProgressTrackingSection() {
  const totalBudget = 25000;
  const currentFunding = 10000;
  const fundingProgress = (currentFunding / totalBudget) * 100;
  const totalParticipants = 15;
  const currentParticipants = 6;
  const availableSpots = totalParticipants - currentParticipants;

  return (
    <section id="progress" className="py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-4xl mx-auto"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Section Title */}
          <motion.div className="text-center mb-12" variants={fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Projekt <span className="text-[#D4A574]">Fortschritt</span>
            </h2>
            <p className="text-gray-300 text-lg">
              Verfolge live, wie aus unserem €10k Auto ein €25k Traumcampervan wird
            </p>
          </motion.div>

          {/* Progress Cards Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Funding Progress Card */}
            <motion.div 
              className="bg-gradient-to-br from-gray-800/60 to-gray-700/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-gray-600/30"
              variants={fadeInUp}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Finanzierung</h3>
                <div className="text-2xl font-bold text-[#D4A574]">
                  €{currentFunding.toLocaleString()} / €{totalBudget.toLocaleString()}
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-700/50 rounded-full h-4 mb-4">
                <div 
                  className="bg-gradient-to-r from-[#D4A574] to-[#c19660] h-4 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${fundingProgress}%` }}
                />
              </div>
              
              <div className="flex justify-between text-sm text-gray-300">
                <span>{Math.round(fundingProgress)}% finanziert</span>
                <span>€{(totalBudget - currentFunding).toLocaleString()} fehlen noch</span>
              </div>
            </motion.div>

            {/* Community Spots Card */}
            <motion.div 
              className="bg-gradient-to-br from-gray-800/60 to-gray-700/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-gray-600/30"
              variants={fadeInUp}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-white">Community</h3>
                <Users className="h-6 w-6 text-[#D4A574]" />
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">
                  {availableSpots} <span className="text-lg font-normal text-gray-300">von {totalParticipants}</span>
                </div>
                <p className="text-gray-300 mb-4">Plätze verfügbar</p>
                
                {/* Participant Spots Visual */}
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: totalParticipants }, (_, i) => (
                    <div
                      key={i}
                      className={`aspect-square rounded-lg flex items-center justify-center text-xs font-semibold ${
                        i < currentParticipants 
                          ? 'bg-[#D4A574] text-black' 
                          : 'bg-gray-600/50 text-gray-400 border border-gray-500/30'
                      }`}
                    >
                      {i < currentParticipants ? '✓' : i + 1}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Project Milestones */}
          <motion.div 
            className="bg-gradient-to-br from-gray-800/60 to-gray-700/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-gray-600/30"
            variants={fadeInUp}
          >
            <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <Clock className="h-5 w-5 text-[#D4A574]" />
              Projekt Meilensteine
            </h3>

            <div className="space-y-4">
              {/* Milestone 1 - Completed */}
              <div className="flex items-center gap-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-semibold text-green-300">Auto gekauft</div>
                  <div className="text-sm text-green-400">€10.000 • Abgeschlossen im Dezember 2024</div>
                </div>
              </div>

              {/* Milestone 2 - In Progress */}
              <div className="flex items-center gap-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <div className="h-5 w-5 border-2 border-amber-400 rounded-full flex-shrink-0 animate-pulse" />
                <div className="flex-1">
                  <div className="font-semibold text-amber-300">Ausbau geplant</div>
                  <div className="text-sm text-amber-400">€15.000 Budget • Start bei Vollfinanzierung</div>
                </div>
              </div>

              {/* Milestone 3 - Pending */}
              <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-500/10 border border-gray-500/30">
                <div className="h-5 w-5 border-2 border-gray-400 rounded-full flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-semibold text-gray-300">Erste Reise</div>
                  <div className="text-sm text-gray-400">Sommer 2026 • Nach Fertigstellung</div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Call to Action */}
          <motion.div 
            className="text-center mt-12"
            variants={fadeInUp}
          >
            <p className="text-lg text-gray-300 mb-4">
              Werde Teil des Projekts und sichere dir deine Urlaubsmonate
            </p>
            <div className="text-sm text-gray-400">
              Nächster Meilenstein: Vollfinanzierung bei €{totalBudget.toLocaleString()}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}