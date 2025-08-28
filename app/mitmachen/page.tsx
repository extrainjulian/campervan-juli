"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { Calculator, Shield, Users, TrendingUp, MapPin, Camera, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ParticipationPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <section className="py-20 bg-gradient-to-br from-[#D4A574]/10 to-transparent">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.h1 
              className="text-4xl md:text-6xl font-bold text-white mb-6"
              variants={fadeInUp}
            >
              Teile die <span className="text-[#D4A574]">Freiheit</span>
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-300 mb-8"
              variants={fadeInUp}
            >
              15 Menschen, 1 Vision: Gemeinsam einen Campervan bauen und die Freiheit teilen
            </motion.p>
            <motion.div 
              className="text-lg text-[#D4A574] font-semibold"
              variants={fadeInUp}
            >
              1 Monat Teilnahme = 1 Monat Campervan-Nutzung
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-6xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-white mb-12 text-center"
              variants={fadeInUp}
            >
              So funktioniert&apos;s
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-8">
              <motion.div 
                className="bg-gradient-to-br from-gray-800/60 to-gray-700/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-gray-600/30 text-center"
                variants={fadeInUp}
              >
                <Calculator className="h-12 w-12 text-[#D4A574] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">1. Mach mit</h3>
                <p className="text-gray-300">
                  €1.000 pro Monat, den du 2026 nutzen möchtest. Du kannst 1-12 Monate wählen.
                </p>
              </motion.div>

              <motion.div 
                className="bg-gradient-to-br from-gray-800/60 to-gray-700/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-gray-600/30 text-center"
                variants={fadeInUp}
              >
                <Wrench className="h-12 w-12 text-[#D4A574] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">2. Wir bauen</h3>
                <p className="text-gray-300">
                  Gemeinsam verwandeln wir das €10k Auto in einen €25k Traumcampervan.
                </p>
              </motion.div>

              <motion.div 
                className="bg-gradient-to-br from-gray-800/60 to-gray-700/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-gray-600/30 text-center"
                variants={fadeInUp}
              >
                <MapPin className="h-12 w-12 text-[#D4A574] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-3">3. Du reist</h3>
                <p className="text-gray-300">
                  Ab Sommer 2026 nutzt du deinen Campervan für deine reservierten Monate.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Budget Breakdown */}
      <section className="py-16 bg-gradient-to-br from-gray-800/50 to-transparent">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-white mb-12 text-center"
              variants={fadeInUp}
            >
              Budget <span className="text-[#D4A574]">Aufschlüsselung</span>
            </motion.h2>

            <motion.div 
              className="bg-gradient-to-br from-gray-800/60 to-gray-700/40 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-600/30"
              variants={fadeInUp}
            >
              <div className="space-y-6">
                <div className="flex justify-between items-center py-3 border-b border-gray-600/30">
                  <span className="text-white font-medium">Auto (bereits gekauft)</span>
                  <span className="text-[#D4A574] font-semibold">€10.000</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-600/30">
                  <span className="text-white font-medium">Ausbau Material & Technik</span>
                  <span className="text-[#D4A574] font-semibold">€12.000</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-600/30">
                  <span className="text-white font-medium">Arbeitskosten & Werkzeug</span>
                  <span className="text-[#D4A574] font-semibold">€2.000</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-600/30">
                  <span className="text-white font-medium">Versicherung & Anmeldung</span>
                  <span className="text-[#D4A574] font-semibold">€1.000</span>
                </div>
                <div className="flex justify-between items-center pt-3 text-xl">
                  <span className="text-white font-bold">Gesamtbudget</span>
                  <span className="text-[#D4A574] font-bold">€25.000</span>
                </div>
              </div>

              <div className="mt-8 p-4 bg-[#D4A574]/10 rounded-xl border border-[#D4A574]/30">
                <h4 className="text-[#D4A574] font-semibold mb-2">Was du bekommst:</h4>
                <ul className="text-gray-300 space-y-1 text-sm">
                  <li>• Vollausgestatteter Campervan mit Küche, Bett, Dusche</li>
                  <li>• Solaranlage & 12V/230V Strom</li>
                  <li>• Vollkasko-Versicherung inklusive</li>
                  <li>• Wartung & technischer Support</li>
                  <li>• Community-Zugang & Reise-Tipps</li>
                </ul>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Investment Benefits */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-6xl mx-auto"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-white mb-12 text-center"
              variants={fadeInUp}
            >
              Warum <span className="text-[#D4A574]">mitmachen</span>?
            </motion.h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div 
                className="bg-gradient-to-br from-gray-800/60 to-gray-700/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-gray-600/30 text-center"
                variants={fadeInUp}
              >
                <TrendingUp className="h-10 w-10 text-[#D4A574] mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-white mb-2">Günstiger als Miete</h4>
                <p className="text-gray-300 text-sm">€33/Tag vs. €80-120/Tag bei klassischer Vermietung</p>
              </motion.div>

              <motion.div 
                className="bg-gradient-to-br from-gray-800/60 to-gray-700/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-gray-600/30 text-center"
                variants={fadeInUp}
              >
                <Users className="h-10 w-10 text-[#D4A574] mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-white mb-2">Starke Community</h4>
                <p className="text-gray-300 text-sm">15 Gleichgesinnte, geteilte Erfahrungen, Tipps & Support</p>
              </motion.div>

              <motion.div 
                className="bg-gradient-to-br from-gray-800/60 to-gray-700/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-gray-600/30 text-center"
                variants={fadeInUp}
              >
                <Shield className="h-10 w-10 text-[#D4A574] mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-white mb-2">Rundum-Sorglos</h4>
                <p className="text-gray-300 text-sm">Versicherung, Wartung, Reparaturen - alles inklusive</p>
              </motion.div>

              <motion.div 
                className="bg-gradient-to-br from-gray-800/60 to-gray-700/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl border border-gray-600/30 text-center"
                variants={fadeInUp}
              >
                <Camera className="h-10 w-10 text-[#D4A574] mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-white mb-2">Transparenz</h4>
                <p className="text-gray-300 text-sm">Live-Updates vom Ausbau, jeder Euro dokumentiert</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-[#D4A574]/10 to-transparent">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-white mb-6"
              variants={fadeInUp}
            >
              Bereit für das Abenteuer?
            </motion.h2>
            <motion.p 
              className="text-lg text-gray-300 mb-8"
              variants={fadeInUp}
            >
              Nur noch 9 Plätze verfügbar. Sichere dir deine Monate für 2026.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Button 
                size="lg"
                className="bg-[#D4A574] hover:bg-[#c19660] text-black font-semibold text-lg px-12 py-6 h-auto"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Jetzt Monate reservieren
              </Button>
            </motion.div>

            <motion.div 
              className="mt-8 text-sm text-gray-400"
              variants={fadeInUp}
            >
              <p>Rechtlicher Hinweis: Dies ist eine Teilnahme an einem Gemeinschaftsprojekt.</p>
              <p>Detaillierte Bedingungen werden vor Vertragsschluss zur Verfügung gestellt.</p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}