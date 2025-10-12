"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeInLeft, staggerContainer } from "@/lib/animations";
import { CheckCircle, Clock, Users, Euro } from "lucide-react";
import { getProjectBudget, type ProjectBudgetData } from "@/app/actions/project-budget";

export default function InteriorDetailsSection() {
  const [budgetData, setBudgetData] = useState<ProjectBudgetData>({
    currentBudget: 10000,
    totalBudget: 20000,
    progressPercentage: 50,
    totalDaysBooked: 0,
    targetDaysFor10k: 200,
    bookingProgressPercentage: 0,
    confirmedRevenue: 0,
    pendingRevenue: 0,
    personalInvestment: 10000
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
      title: "Peugeot Boxer gekauft!",
      description: "€8.100 • L2H2 Kastenwagen • Deal des Jahres",
      status: "completed",
      date: "04. Oktober 2025"
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
      description: "€20.000 erreicht",
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
                  
                  {/* Budget breakdown */}
                  <div className="pt-2 text-xs text-gray-500 space-y-1">
                    <div className="flex justify-between">
                      <span>Eigene Investition:</span>
                      <span className="font-medium">€{budgetData.personalInvestment.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Community Beiträge:</span>
                      <span className="font-medium">€{(budgetData.confirmedRevenue + budgetData.pendingRevenue).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Booking Progress */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-[#D4A574]/20">
                <div className="flex items-center gap-3 mb-4">
                  <Users className="h-6 w-6 text-[#D4A574]" />
                  <h3 className="text-xl font-semibold text-[#2B5F75]">Buchungsfortschritt</h3>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-[#2B5F75]">{budgetData.totalDaysBooked} Tage</span>
                    <span className="text-lg text-gray-600">von {budgetData.targetDaysFor10k} Tagen</span>
                  </div>
                  
                  {/* Progress Bar for Bookings */}
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-[#4A5D23] to-[#D4A574] h-3 rounded-full transition-all duration-700"
                      style={{ width: `${budgetData.bookingProgressPercentage}%` }}
                    />
                  </div>
                  
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>{Math.round(budgetData.bookingProgressPercentage)}% erreicht</span>
                    <span className="text-amber-600">{budgetData.targetDaysFor10k - budgetData.totalDaysBooked} Tage für 10k€-Ziel</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mt-4">
                  {budgetData.totalDaysBooked > 0 ? (
                    <>€{budgetData.confirmedRevenue + budgetData.pendingRevenue} durch Buchungen erreicht!</>
                  ) : (
                    <>Noch keine Buchungen vorhanden - sei der Erste!</>
                  )}
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
      </div>
    </section>
  );
}