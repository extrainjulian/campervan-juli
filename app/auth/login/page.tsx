"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { fadeInLeft, fadeInRight, staggerContainer } from "@/lib/animations";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        // Wait for auth state to update, then redirect
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          // Use multiple fallback methods for mobile compatibility
          try {
            router.replace("/dashboard");
          } catch (routerError) {
            console.warn("Router failed, using window.location:", routerError);
            window.location.replace("/dashboard");
          }
        }
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password.length < 6) {
      setError("Passwort muss mindestens 6 Zeichen haben");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        setShowEmailConfirmation(true);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Ein Fehler ist aufgetreten");
    } finally {
      setLoading(false);
    }
  };

  if (showEmailConfirmation) {
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
              alt="wuecamper Seitenansicht"
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
            <LogIn className="h-12 w-12 text-[#D4A574] mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-white mb-2">
              {isLogin ? "Willkommen zurück" : "Jetzt teilnehmen"}
            </h1>
            <p className="text-gray-300">
              {isLogin ? "Melde dich in deinem Konto an" : "Werde Teil der Campervan-Community"}
            </p>
          </motion.div>

          <motion.form onSubmit={isLogin ? handleLogin : handleSignup} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

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
                  minLength={isLogin ? 1 : 6}
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#D4A574] hover:bg-[#c19660] disabled:opacity-50 text-black font-semibold py-3 rounded-lg transition-colors"
            >
              {loading 
                ? (isLogin ? "Wird angemeldet..." : "Wird registriert...") 
                : (isLogin ? "Anmelden" : "Teilnehmen")
              }
            </button>
          </motion.form>

          <motion.div className="mt-6 text-center space-y-4">
            <div className="text-sm text-gray-400">
              {isLogin ? "Noch kein Konto?" : "Bereits ein Konto?"}{" "}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="text-[#D4A574] hover:text-[#c19660] font-medium transition-colors"
              >
                {isLogin ? "Jetzt registrieren" : "Anmelden"}
              </button>
            </div>
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
            alt="wuecamper Seitenansicht"
            fill
            className="object-cover object-center hover:scale-105 transition-transform duration-700"
            style={{ filter: 'brightness(1.05) contrast(1.1)' }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
            <h2 className="text-3xl font-bold text-white mb-3">
              Dein Campervan-Abenteuer wartet
            </h2>
            <p className="text-white/90 text-lg">
              Werde Teil unserer Community und erlebe Freiheit auf vier Rädern
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
