"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeInLeft, staggerContainer } from "@/lib/animations";
import MonthSelector from "@/components/booking/month-selector";
import { MonthRange } from "@/types/booking";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createMonthBooking } from "@/app/actions/create-booking";

export default function MountainSection() {
  const [selectedRange, setSelectedRange] = useState<MonthRange>({
    startMonth: null,
    startYear: null,
    endMonth: null,
    endYear: null
  });
  const [user, setUser] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleReservation = async () => {
    // If user is not logged in, redirect to auth/login immediately
    if (!user) {
      router.push("/auth/login");
      return;
    }

    // Check if at least startMonth is selected (single month selection is valid)
    if (!selectedRange.startMonth || !selectedRange.startYear) {
      alert("Bitte wähle einen Zeitraum aus");
      return;
    }

    // If user is logged in, create booking directly
    if (user) {
      setLoading(true);
      
      try {
        const result = await createMonthBooking({
          userId: user.id,
          userEmail: user.email,
          userName: user.user_metadata?.full_name || user.email,
          selectedRange
        });

        if (result.success) {
          router.push("/dashboard");
        } else {
          alert(result.error || "Fehler beim Erstellen der Buchung");
        }
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
      } finally {
        setLoading(false);
      }
    }
  };
  
  return (
    <section id="availability" className="py-16 bg-[#2A2A2A] flex items-center" style={{ minHeight: '80vh' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          
          {/* Content - Date Picker */}
          <motion.div 
            className="w-full max-w-lg space-y-8"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div variants={fadeInLeft} className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Deinen <span className="text-[#D4A574]">Zeitraum</span> auswählen
              </h2>
              <p className="text-base text-gray-300 mb-6">
                Wähle deine gewünschten Monate zwischen 2026 und 2027. 
                Jeder Monat kostet €1.000 für die Teilnahme am Projekt.
              </p>
            </motion.div>
            
            <motion.div variants={fadeInLeft} className="space-y-6">
              <MonthSelector onSelectionChange={setSelectedRange} />
              
              <div className="text-center">
                <button 
                  onClick={handleReservation}
                  disabled={loading}
                  className="bg-[#D4A574] hover:bg-[#c19660] disabled:opacity-50 text-black font-semibold px-8 py-3 rounded-lg transition-colors text-base"
                >
                  {loading ? "Wird erstellt..." : "Teilnahme reservieren"}
                </button>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}