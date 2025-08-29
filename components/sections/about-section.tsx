"use client";

import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export default function AboutSection() {
  return (
    <section id="about" className="py-16 bg-[#2A2A2A] flex items-center" style={{ minHeight: '80vh' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center space-y-8"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div variants={fadeInUp}>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Das <span className="text-[#D4A574]">wuecamper</span> Konzept
            </h2>
          </motion.div>
          
          <motion.div variants={fadeInUp} className="max-w-3xl mx-auto space-y-6">
            <p className="text-lg text-gray-300 leading-relaxed">
              Die Idee ist einfach: Ich investiere <span className="text-[#D4A574] font-semibold">15.000€</span> für den Fahrzeugkauf und die Grundausstattung. 
              Wir brauchen zusätzlich ein crowdfinanziertes Budget von <span className="text-[#D4A574] font-semibold">10.000€</span> für den kompletten Ausbau. 
              Insgesamt rechne ich mit <span className="text-[#D4A574] font-semibold">25.000€</span> für die komplette Umrüstung.
            </p>
            
            <p className="text-lg text-gray-300 leading-relaxed">
              Du kannst mitmachen, indem du <span className="text-[#D4A574] font-semibold">mindestens 2 Wochen reservierst</span> - 
              das kostet dich <span className="text-[#D4A574] font-semibold">50€ pro Tag</span>, also 700€ für 14 Tage.
            </p>
            
            
            <p className="text-lg text-gray-300 leading-relaxed">
              Die Mindestreservierung von 2 Wochen sorgt dafür, dass wir als Community den Van effizient nutzen können 
              und jeder genug Zeit hat, richtig abzuschalten und das Vanlife zu genießen.
            </p>
            
            <div className="pt-6 text-center">
              <button 
                onClick={() => window.location.href = '/dashboard'}
                className="bg-[#D4A574] hover:bg-[#c19660] text-black font-semibold text-lg px-8 py-4 rounded-lg transition-colors"
              >
                Ich bin dabei
              </button>
              <p className="text-sm text-gray-400 mt-3">
                <span className="text-[#D4A574]">50€/Tag</span> × <span className="text-[#D4A574]">14 Tage minimum</span> = <span className="text-[#D4A574]">700€</span>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}