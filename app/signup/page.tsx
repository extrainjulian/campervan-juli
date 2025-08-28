"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { fadeInUp, fadeInLeft, fadeInRight, staggerContainer } from "@/lib/animations";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams, useRouter } from "next/navigation";
import MonthSelector from "@/components/booking/month-selector";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { MonthRange } from "@/types/booking";
import { createMonthBooking } from "@/app/actions/create-booking";

function SignupPageContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [step, setStep] = useState(1); // 1: signup form, 2: email confirmation, 3: month selection
  const [user, setUser] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [selectedRange, setSelectedRange] = useState<MonthRange>({
    startMonth: null,
    startYear: null,
    endMonth: null,
    endYear: null
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  const supabase = createClient();

  // Get month selection from URL params
  const startMonth = searchParams.get("startMonth");
  const startYear = searchParams.get("startYear");
  const endMonth = searchParams.get("endMonth");
  const endYear = searchParams.get("endYear");

  // Initialize selected range from URL params
  useEffect(() => {
    if (startMonth && startYear) {
      setSelectedRange({
        startMonth: parseInt(startMonth),
        startYear: parseInt(startYear),
        endMonth: endMonth ? parseInt(endMonth) : null,
        endYear: endYear ? parseInt(endYear) : null
      });
    }
  }, [startMonth, startYear, endMonth, endYear]);

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setStep(3);
      }
    };

    checkUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          setUser(session.user);
          setStep(3);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Passwörter stimmen nicht überein");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Passwort muss mindestens 6 Zeichen haben");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`.trim(),
          }
        }
      });

      if (error) {
        setError(error.message);
      } else {
        setStep(2);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBooking = async () => {
    if (!user || !selectedRange.startMonth || !selectedRange.endMonth) return;

    setBookingLoading(true);
    setBookingError("");

    try {
      const result = await createMonthBooking({
        userId: user.id,
        userEmail: user.email,
        userName: user.user_metadata?.full_name || `${user.user_metadata?.first_name} ${user.user_metadata?.last_name}`.trim() || user.email,
        selectedRange
      });

      if (result.success) {
        router.push("/dashboard");
      } else {
        setBookingError(result.error || "Fehler beim Erstellen der Buchung");
      }
    } catch (err: unknown) {
      setBookingError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
    } finally {
      setBookingLoading(false);
    }
  };

  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2A2A2A] via-[#1A1A1A] to-[#2A2A2A] flex">
        {/* Left Content - Email Confirmation */}
        <motion.div 
          className="flex-1 flex items-center justify-center px-8 py-16"
          variants={fadeInLeft}
          initial="initial"
          animate="animate"
        >
          <div className="w-full max-w-md text-center">
            <Mail className="h-16 w-16 text-[#D4A574] mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4">
              E-Mail bestätigen
            </h2>
            <p className="text-gray-300 mb-6">
              Wir haben dir eine E-Mail an <strong>{email}</strong> gesendet. 
              Klicke auf den Link in der E-Mail, um dein Konto zu bestätigen.
            </p>
            <p className="text-sm text-gray-400">
              Nach der Bestätigung wirst du automatisch weitergeleitet.
            </p>
          </div>
        </motion.div>

        {/* Right Image */}
        <motion.div 
          className="hidden lg:flex flex-1 items-center justify-center p-8"
          variants={fadeInRight}
          initial="initial"
          animate="animate"
        >
          <div className="relative w-full h-full max-w-2xl max-h-[600px] rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src="/images/sideview.png"
              alt="CampervanJuli Seitenansicht"
              fill
              className="object-cover object-center hover:scale-105 transition-transform duration-700"
              style={{ filter: 'brightness(1.05) contrast(1.1)' }}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <h2 className="text-3xl font-bold text-white mb-3">
                Fast geschafft!
              </h2>
              <p className="text-white/90 text-lg">
                Überprüfe deine E-Mails und bestätige dein Konto
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  if (step === 3) {
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
              Willkommen, <span className="text-[#D4A574]">{user?.user_metadata?.first_name || "Teilnehmer"}!</span>
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-300 mb-8"
              variants={fadeInUp}
            >
              Wähle deine gewünschten Monate für die Campervan-Teilnahme
            </motion.p>
          </motion.div>

          <motion.div 
            className="flex flex-col items-center space-y-8"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <MonthSelector 
              initialSelection={selectedRange}
              onSelectionChange={setSelectedRange}
            />
            
            <div className="text-center">
              {bookingError && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm mb-4">
                  {bookingError}
                </div>
              )}
              
              <button 
                onClick={handleCreateBooking}
                disabled={!selectedRange.startMonth || !selectedRange.endMonth || bookingLoading}
                className="bg-[#D4A574] hover:bg-[#c19660] disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold px-8 py-4 rounded-lg transition-colors text-lg"
              >
                {bookingLoading ? "Wird erstellt..." : "Teilnahme bestätigen"}
              </button>
              
              {(!selectedRange.startMonth || !selectedRange.endMonth) && (
                <p className="text-sm text-gray-400 mt-2">
                  Bitte wähle einen Zeitraum aus
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A2A2A] via-[#1A1A1A] to-[#2A2A2A] flex">
      {/* Left Content - Auth Form */}
      <motion.div 
        className="flex-1 flex items-center justify-center px-8 py-16"
        variants={fadeInLeft}
        initial="initial"
        animate="animate"
      >
        <div className="w-full max-w-md">
          <motion.div className="text-center mb-8" variants={staggerContainer}>
            <User className="h-12 w-12 text-[#D4A574] mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">
              Konto erstellen
            </h1>
            <p className="text-gray-300">
              Werde Teil der Campervan-Community
            </p>
          </motion.div>

          <motion.form onSubmit={handleSignup} className="space-y-6">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Vorname
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-[#D4A574] focus:outline-none transition-colors"
                placeholder="Max"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nachname
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-[#D4A574] focus:outline-none transition-colors"
                placeholder="Mustermann"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              E-Mail
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-[#D4A574] focus:outline-none transition-colors"
                placeholder="max@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Passwort
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-[#D4A574] focus:outline-none transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Passwort bestätigen
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full pl-10 pr-12 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:border-[#D4A574] focus:outline-none transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#D4A574] hover:bg-[#c19660] disabled:opacity-50 text-black font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? "Wird erstellt..." : "Konto erstellen"}
          </button>
        </motion.form>

          <motion.div className="mt-6 text-center text-sm text-gray-400" variants={fadeInUp}>
            Bereits ein Konto?{" "}
            <button 
              onClick={() => router.push("/auth/login")}
              className="text-[#D4A574] hover:text-[#c19660] font-medium"
            >
              Anmelden
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Image */}
      <motion.div 
        className="hidden lg:flex flex-1 items-center justify-center p-8"
        variants={fadeInRight}
        initial="initial"
        animate="animate"
      >
        <div className="relative w-full h-full max-w-2xl max-h-[600px] rounded-3xl overflow-hidden shadow-2xl">
          <Image
            src="/images/sideview.png"
            alt="CampervanJuli Seitenansicht"
            fill
            className="object-cover object-center hover:scale-105 transition-transform duration-700"
            style={{ filter: 'brightness(1.05) contrast(1.1)' }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
            <h2 className="text-3xl font-bold text-white mb-3">
              Starte dein Abenteuer
            </h2>
            <p className="text-white/90 text-lg">
              Gemeinsam bauen und teilen wir den Traum vom Leben auf der Straße
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-[#2A2A2A] via-[#1A1A1A] to-[#2A2A2A] flex items-center justify-center">
        <div className="text-white text-lg">Lädt...</div>
      </div>
    }>
      <SignupPageContent />
    </Suspense>
  );
}