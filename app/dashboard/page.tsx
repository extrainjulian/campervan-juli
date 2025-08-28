"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { CalendarCheck, User, LogOut, Mail } from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/signup");
          return;
        }
        setUser(user);
      } catch (error) {
        console.error("Error checking user:", error);
        router.push("/signup");
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [router, supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2A2A2A] via-[#1A1A1A] to-[#2A2A2A] flex items-center justify-center">
        <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-white rounded-full" role="status" aria-label="loading">
          <span className="sr-only">Laden...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A2A2A] via-[#1A1A1A] to-[#2A2A2A] py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-12"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-white mb-6"
            variants={fadeInUp}
          >
            Willkommen zurück, <span className="text-[#D4A574]">{user?.user_metadata?.first_name || "Teilnehmer"}!</span>
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 mb-8"
            variants={fadeInUp}
          >
            Deine Campervan-Teilnahme wurde erfolgreich erstellt
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* User Info Card */}
          <motion.div 
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <div className="flex items-center gap-3 mb-6">
              <User className="h-6 w-6 text-[#D4A574]" />
              <h2 className="text-xl font-semibold text-white">Dein Profil</h2>
            </div>
            
            <div className="space-y-4 text-gray-300">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4" />
                <span>{user?.email}</span>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="mt-6 flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Abmelden
            </button>
          </motion.div>

          {/* Booking Status Card */}
          <motion.div 
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <div className="flex items-center gap-3 mb-6">
              <CalendarCheck className="h-6 w-6 text-[#D4A574]" />
              <h2 className="text-xl font-semibold text-white">Deine Teilnahme</h2>
            </div>
            
            <div className="space-y-4 text-gray-300">
              <div className="bg-amber-500/20 border border-amber-500/50 text-amber-300 px-4 py-3 rounded-lg">
                <p className="font-medium">Status: Ausstehend</p>
                <p className="text-sm mt-1">
                  Deine Teilnahme wird gerade bearbeitet. Du erhältst bald eine Bestätigung per E-Mail.
                </p>
              </div>
              
              <div className="text-sm">
                <p className="text-gray-400">Erstellt am:</p>
                <p>{new Date().toLocaleDateString("de-DE", { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Next Steps */}
        <motion.div 
          className="mt-12 bg-gradient-to-br from-[#D4A574]/10 to-[#D4A574]/20 rounded-2xl p-8 border border-[#D4A574]/30"
          variants={fadeInUp}
          initial="initial"
          animate="animate"
        >
          <h2 className="text-2xl font-semibold text-white mb-6 text-center">Nächste Schritte</h2>
          <div className="space-y-4 text-gray-300">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-[#D4A574] text-black rounded-full flex items-center justify-center text-sm font-bold mt-1">1</div>
              <div>
                <p className="font-medium">Bestätigung abwarten</p>
                <p className="text-sm text-gray-400">Du erhältst eine E-Mail-Bestätigung deiner Teilnahme</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-gray-600 text-gray-300 rounded-full flex items-center justify-center text-sm font-bold mt-1">2</div>
              <div>
                <p className="font-medium">Community beitreten</p>
                <p className="text-sm text-gray-400">Wir laden dich zur WhatsApp-Gruppe ein</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-gray-600 text-gray-300 rounded-full flex items-center justify-center text-sm font-bold mt-1">3</div>
              <div>
                <p className="font-medium">Ausbau mitverfolgen</p>
                <p className="text-sm text-gray-400">Verfolge den Fortschritt live mit</p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="text-center mt-8">
          <button
            onClick={() => router.push("/")}
            className="bg-[#D4A574] hover:bg-[#c19660] text-black font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Zurück zur Startseite
          </button>
        </div>
      </div>
    </div>
  );
}