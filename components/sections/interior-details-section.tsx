"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeInLeft, fadeInRight, staggerContainer } from "@/lib/animations";
import { CheckCircle, Clock, Users, Euro } from "lucide-react";
import Image from "next/image";
import { getProjectBudget, type ProjectBudgetData } from "@/app/actions/project-budget";

export default function InteriorDetailsSection() {
  const [budgetData, setBudgetData] = useState<ProjectBudgetData>({
    currentBudget: 10000,
    totalBudget: 25000,
    progressPercentage: 40,
    currentParticipants: 1,
    totalParticipants: 15,
    totalMonthsBooked: 0,
    pendingRevenue: 0,
    confirmedRevenue: 10000
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBudgetData = async () => {
      try {
        const response = await getProjectBudget();
        if (response.success && response.data) {
          setBudgetData(response.data);
        }
      } catch (error) {
        console.error('Error fetching project budget:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgetData();
  }, []);

  const milestones = [
    { 
      id: 1, 
      title: "Ausbauplanung", 
      description: "Design & Materialliste erstellt", 
      status: "completed",
      date: "August 2025"
    },
    { 
      id: 2, 
      title: "Auto gekauft", 
      description: "€10.000 • Peugeot Boxer L2H2", 
      status: "completed",
      date: "Oktober 2025"
    },
    { 
      id: 3, 
      title: "Ausbau beginnt", 
      description: "Community-Werkstatt", 
      status: "in_progress",
      date: "Dezember 2025"
    },
    { 
      id: 4, 
      title: "Vollfinanzierung", 
      description: "€25.000 erreicht", 
      status: "pending",
      date: "Januar 2026"
    },
    { 
      id: 5, 
      title: "Erste Reise", 
      description: "Mai 2026", 
      status: "pending",
      date: "Mai 2026"
    }
  ];

  return (
    <section className="py-20 bg-[#F5F1EB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Content - Project Progress */}
          <motion.div 
            className="space-y-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div variants={fadeInLeft}>
              <h2 className="text-4xl md:text-5xl font-bold text-[#2B5F75] mb-6">
                Campervan
                <span className="block text-[#4A5D23]">Selbstausbau</span>
              </h2>
              <p className="text-xl text-gray-700 mb-8">
                Verfolge live den Fortschritt unseres Community-Projekts – 
                vom gekauften Auto zum fertigen Traumcampervan.
              </p>
            </motion.div>
            
            {/* Budget Progress */}
            <motion.div variants={fadeInLeft} className="space-y-4">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#D4A574]/20">
                {loading && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="animate-spin inline-block w-4 h-4 border-[2px] border-current border-t-transparent text-[#D4A574] rounded-full" />
                    <span className="text-sm text-gray-600">Lade aktuelle Projektdaten...</span>
                  </div>
                )}
                
                <div className="flex items-center gap-3 mb-4">
                  <Euro className="h-6 w-6 text-[#D4A574]" />
                  <h3 className="text-xl font-semibold text-[#2B5F75]">Projektbudget</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-[#2B5F75]">€{budgetData.currentBudget.toLocaleString()}</span>
                    <span className="text-lg text-gray-600">von €{budgetData.totalBudget.toLocaleString()}</span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-[#D4A574] to-[#4A5D23] h-3 rounded-full transition-all duration-700"
                      style={{ width: `${budgetData.progressPercentage}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>{Math.round(budgetData.progressPercentage)}% finanziert</span>
                    {budgetData.currentBudget < budgetData.totalBudget && (
                      <span className="text-amber-600">€{(budgetData.totalBudget - budgetData.currentBudget).toLocaleString()} noch benötigt</span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* People Counter */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#D4A574]/20">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="h-6 w-6 text-[#D4A574]" />
                  <h3 className="text-xl font-semibold text-[#2B5F75]">Community</h3>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-bold text-[#2B5F75]">{budgetData.currentParticipants}</span>
                  <span className="text-gray-600">von {budgetData.totalParticipants} Menschen</span>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {budgetData.totalMonthsBooked} {budgetData.totalMonthsBooked === 1 ? 'Monat' : 'Monate'} bereits gebucht! 
                  {" "}{budgetData.totalParticipants - budgetData.currentParticipants} Plätze noch verfügbar.
                </p>
              </div>
            </motion.div>

            {/* Project Milestones */}
            <motion.div variants={fadeInLeft} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#D4A574]/20">
              <h3 className="text-xl font-semibold text-[#2B5F75] mb-6 flex items-center gap-3">
                <Clock className="h-6 w-6 text-[#D4A574]" />
                Projekt Meilensteine
              </h3>
              
              <div className="space-y-4">
                {milestones.map((milestone) => (
                  <div key={milestone.id} className="flex gap-4 items-start">
                    <div className="flex-shrink-0 mt-1">
                      {milestone.status === 'completed' ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : milestone.status === 'in_progress' ? (
                        <div className="h-5 w-5 border-2 border-[#D4A574] rounded-full animate-pulse bg-[#D4A574]/20" />
                      ) : (
                        <div className="h-5 w-5 border-2 border-gray-300 rounded-full" />
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`font-semibold ${
                          milestone.status === 'completed' 
                            ? 'text-green-700' 
                            : milestone.status === 'in_progress'
                            ? 'text-[#D4A574]'
                            : 'text-gray-600'
                        }`}>
                          {milestone.title}
                        </h4>
                        <span className="text-xs text-gray-500 ml-2">
                          {milestone.date}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                ))}
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
                src="/images/interior-min.png"
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