"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeInLeft, staggerContainer } from "@/lib/animations";
import WuecamperDatePicker from "@/components/booking/wuecamper-date-picker";
import { DateRangeSelection } from "@/types/booking";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { createDateBooking, getDateAvailability } from "@/app/actions/date-bookings";

export default function MountainSection() {
  const [selectedRange, setSelectedRange] = useState<DateRangeSelection>({
    startDate: null,
    endDate: null
  });
  const [blockedRanges, setBlockedRanges] = useState<Array<{ startDate: Date; endDate: Date; reason?: string }>>([]);
  const [user, setUser] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };

    const loadAvailability = async () => {
      const availability = await getDateAvailability();
      setBlockedRanges(availability.blockedRanges);
    };

    checkUser();
    loadAvailability();

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

    // Check if date range is selected
    if (!selectedRange.startDate || !selectedRange.endDate) {
      alert("Bitte wähle einen gültigen Zeitraum aus");
      return;
    }

    // If user is logged in, create booking directly
    if (user) {
      setLoading(true);
      
      try {
        const result = await createDateBooking({
          userId: user.id,
          userEmail: user.email || '',
          userName: user.user_metadata?.full_name || user.email || 'Unbekannt',
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
                Wähle deinen gewünschten Zeitraum zwischen 2026 und 2027. 
                Mindestens 2 Wochen, 50€ pro Tag.
              </p>
            </motion.div>
            
            <motion.div variants={fadeInLeft} className="space-y-6">
              <WuecamperDatePicker 
                onSelectionChange={setSelectedRange} 
                blockedRanges={blockedRanges}
              />
              
              <div className="text-center">
                <button 
                  onClick={handleReservation}
                  disabled={loading || !selectedRange.startDate || !selectedRange.endDate}
                  className="bg-[#D4A574] hover:bg-[#c19660] disabled:opacity-50 text-black font-semibold px-8 py-3 rounded-lg transition-colors text-base"
                >
                  {loading ? "Wird erstellt..." : "Zeitraum reservieren"}
                </button>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}