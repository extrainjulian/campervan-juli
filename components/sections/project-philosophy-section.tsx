"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { Heart, Users, Shield, RefreshCw, Truck, MapPin } from "lucide-react";

export default function ProjectPhilosophySection() {
  return (
    <section id="projekt" className="py-20 bg-gradient-to-br from-[#D4A574]/10 via-white to-[#D4A574]/5">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div 
          className="text-center mb-16"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            variants={fadeInUp}
          >
            <span className="text-[#D4A574]">Peugeot Boxer</span> Selbstausbau
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed"
            variants={fadeInUp}
          >
            Ein persönliches Projekt ohne Gewinnabsicht – mit der Vision, Campervan-Besitz 
            in einer begeisterten Community zu teilen
          </motion.p>
        </motion.div>

        {/* Project Details Grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Vehicle Details */}
          <motion.div 
            className="bg-white rounded-2xl p-6 shadow-lg border border-[#D4A574]/20 hover:shadow-xl transition-shadow"
            variants={fadeInUp}
          >
            <Truck className="h-10 w-10 text-[#D4A574] mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Peugeot Boxer</h3>
            <p className="text-gray-600">
              Robuster Kastenwagen mit viel Platz für den kompletten Ausbau zu einem 
              vollwertigen Campervan mit allem Komfort.
            </p>
          </motion.div>

          {/* Community Vision */}
          <motion.div 
            className="bg-white rounded-2xl p-6 shadow-lg border border-[#D4A574]/20 hover:shadow-xl transition-shadow"
            variants={fadeInUp}
          >
            <Users className="h-10 w-10 text-[#D4A574] mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Community-Projekt</h3>
            <p className="text-gray-600">
              15 Menschen teilen sich einen Traum. Gemeinsam planen, bauen und nutzen 
              wir den Campervan in einer enthusiastischen Gemeinschaft.
            </p>
          </motion.div>

          {/* Simple Participation */}
          <motion.div 
            className="bg-white rounded-2xl p-6 shadow-lg border border-[#D4A574]/20 hover:shadow-xl transition-shadow"
            variants={fadeInUp}
          >
            <MapPin className="h-10 w-10 text-[#D4A574] mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Einfache Teilnahme</h3>
            <p className="text-gray-600">
              So simpel wie möglich: €1.000 für 1 Monat Urlaub. 
              Keine versteckten Kosten, keine komplizierte Abrechnung.
            </p>
          </motion.div>
        </motion.div>

        {/* Key Benefits */}
        <motion.div 
          className="grid md:grid-cols-2 gap-8 mb-16"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* No Profit Guarantee */}
          <motion.div 
            className="bg-gradient-to-br from-green-50 to-green-100/50 rounded-2xl p-8 border border-green-200"
            variants={fadeInUp}
          >
            <Heart className="h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Ohne Gewinnabsicht</h3>
            <p className="text-gray-700 mb-4">
              Dies ist ein persönliches Projekt aus Leidenschaft, nicht aus Profitgier. 
              Jeder Euro fließt in den Campervan oder zurück an die Community.
            </p>
            <div className="text-sm text-green-700 font-medium">
              ✓ Transparente Kostenaufstellung<br/>
              ✓ Keine versteckten Gebühren<br/>
              ✓ Community-orientiert
            </div>
          </motion.div>

          {/* Flexibility Guarantee */}
          <motion.div 
            className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-8 border border-blue-200"
            variants={fadeInUp}
          >
            <RefreshCw className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Volle Flexibilität</h3>
            <p className="text-gray-700 mb-4">
              Du kannst deine Reservierung jederzeit stornieren und bekommst 
              dein Geld schnellstmöglich zurück. Kein Risiko, keine Bindung.
            </p>
            <div className="text-sm text-blue-700 font-medium">
              ✓ Jederzeit kündbar<br/>
              ✓ Schnelle Rückerstattung<br/>
              ✓ Kein finanzielles Risiko
            </div>
          </motion.div>
        </motion.div>

        {/* Personal Message */}
        <motion.div 
          className="bg-gradient-to-br from-[#D4A574]/10 to-[#D4A574]/20 rounded-2xl p-8 text-center border border-[#D4A574]/30"
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
        >
          <Shield className="h-12 w-12 text-[#D4A574] mx-auto mb-6" />
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Hi, ich bin Julian</h3>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Ich mache dieses Projekt aus der Überzeugung, dass <strong>Teilen besser ist als Besitzen</strong>. 
            Mein Ziel: Abenteuer für alle zugänglich machen und den Traum vom Leben auf der Straße demokratisieren. 
            Zusammen arbeiten wir als Community daran, dass jeder von uns seinen Campervan-Traum leben kann.
          </p>
          <div className="mt-6 text-[#D4A574] font-semibold text-lg">
            Gemeinsam nutzen statt alleine besitzen 🚐
          </div>
        </motion.div>

      </div>
    </section>
  );
}