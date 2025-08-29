"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { CalendarCheck, User, LogOut, Plus, Calendar, Euro, Trash2, CheckCircle, AlertCircle } from "lucide-react";
import WuecamperDatePicker from "@/components/booking/wuecamper-date-picker";
import { DateRangeSelection, DateBooking } from "@/types/booking";
import { createDateBooking, getDateAvailability, getUserDateBookings, cancelDateBooking } from "@/app/actions/date-bookings";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import ProtectedRoute from "@/components/auth/protected-route";

function DashboardContent() {
  const [user, setUser] = useState<any>(null); // eslint-disable-line @typescript-eslint/no-explicit-any
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null);
  const [userBookings, setUserBookings] = useState<DateBooking[]>([]);
  const [blockedRanges, setBlockedRanges] = useState<Array<{ startDate: Date; endDate: Date; reason?: string }>>([]);
  const [selectedRange, setSelectedRange] = useState<DateRangeSelection>({
    startDate: null,
    endDate: null,
  });
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return; // ProtectedRoute handles auth
        
        setUser(user);
        
        // Load user's bookings and availability
        const [bookings, availability] = await Promise.all([
          getUserDateBookings(user.id),
          getDateAvailability()
        ]);
        
        setUserBookings(bookings);
        setBlockedRanges(availability.blockedRanges);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [supabase.auth]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const handleCreateBooking = async () => {
    if (!selectedRange.startDate || !selectedRange.endDate || !user) {
      return;
    }

    setBookingLoading(true);
    
    try {
      const result = await createDateBooking({
        userId: user.id,
        userEmail: user.email || '',
        userName: user.user_metadata?.full_name || user.email || 'Unbekannt',
        selectedRange
      });

      if (result.success) {
        // Reload bookings and availability
        const [bookings, availability] = await Promise.all([
          getUserDateBookings(user.id),
          getDateAvailability()
        ]);
        
        setUserBookings(bookings);
        setBlockedRanges(availability.blockedRanges);
        setSelectedRange({ startDate: null, endDate: null });
        setShowBookingForm(false);
        
        setMessage({ type: 'success', text: 'Buchung erfolgreich erstellt!' });
        setTimeout(() => setMessage(null), 5000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Fehler beim Erstellen der Buchung' });
        setTimeout(() => setMessage(null), 5000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten' });
      setTimeout(() => setMessage(null), 5000);
    } finally {
      setBookingLoading(false);
    }
  };

  const getTotalCost = (): number => {
    return userBookings
      .filter(booking => booking.status !== 'cancelled')
      .reduce((total, booking) => total + booking.totalCost, 0);
  };

  const getTotalDays = (): number => {
    return userBookings
      .filter(booking => booking.status !== 'cancelled')
      .reduce((total, booking) => total + booking.totalDays, 0);
  };

  const getContributionPercentage = (): number => {
    const totalCost = getTotalCost();
    const targetAmount = 10000; // 10k€ crowdfunding target
    return Math.min((totalCost / targetAmount) * 100, 100);
  };

  const handleCancelBooking = async (bookingId: string) => {
    if (!user) return;
    
    try {
      const result = await cancelDateBooking(bookingId, user.id);
      
      if (result.success) {
        // Reload bookings and availability
        const [bookings, availability] = await Promise.all([
          getUserDateBookings(user.id),
          getDateAvailability()
        ]);
        
        setUserBookings(bookings);
        setBlockedRanges(availability.blockedRanges);
        setMessage({ type: 'success', text: 'Buchung erfolgreich storniert!' });
        setTimeout(() => setMessage(null), 5000);
      } else {
        setMessage({ type: 'error', text: result.error || 'Fehler beim Stornieren der Buchung' });
        setTimeout(() => setMessage(null), 5000);
      }
    } catch (err) {
      setMessage({ type: 'error', text: err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten' });
      setTimeout(() => setMessage(null), 5000);
    }
    
    setConfirmCancel(null);
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'confirmed': return 'text-green-400 bg-green-400/20 border-green-400/50';
      case 'pending': return 'text-amber-400 bg-amber-400/20 border-amber-400/50';
      case 'cancelled': return 'text-red-400 bg-red-400/20 border-red-400/50';
      default: return 'text-gray-400 bg-gray-400/20 border-gray-400/50';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'confirmed': return 'Bestätigt';
      case 'pending': return 'Ausstehend';
      case 'cancelled': return 'Storniert';
      default: return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2A2A2A] via-[#1A1A1A] to-[#2A2A2A] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-white rounded-full mb-4" role="status" aria-label="loading">
            <span className="sr-only">Laden...</span>
          </div>
          <p className="text-white text-lg">Dashboard wird geladen...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A2A2A] via-[#1A1A1A] to-[#2A2A2A] py-16 px-4">
      <div className="max-w-6xl mx-auto">
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
            Dashboard - <span className="text-[#D4A574]">wuecamper</span>
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-300 mb-8"
            variants={fadeInUp}
          >
            Willkommen zurück, {user?.user_metadata?.full_name || user?.email}!
          </motion.p>
        </motion.div>

        {/* Message Component */}
        {message && (
          <motion.div
            className={`mb-6 p-4 rounded-lg border flex items-center gap-3 ${
              message.type === 'success' 
                ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {message.type === 'success' ? (
              <CheckCircle className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span>{message.text}</span>
          </motion.div>
        )}

        {/* Confirmation Dialog */}
        {confirmCancel && (
          <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => setConfirmCancel(null)}
          >
            <motion.div
              className="bg-gray-800/90 backdrop-blur-lg rounded-2xl p-6 max-w-md mx-4 border border-gray-600/20"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-semibold text-white mb-4">Oh nein! 😢</h3>
              <p className="text-gray-300 mb-6">
                Willst du wirklich gehen? Ohne dich wird mein Campervan-Traum um ein paar Euro ärmer! 🚐💸
                <br /><br />
                <span className="text-sm text-gray-400">(Aber kein Stress - du bekommst natürlich dein Geld zurück! 😉)</span>
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => handleCancelBooking(confirmCancel)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  Ja, stornieren
                </button>
                <button
                  onClick={() => setConfirmCancel(null)}
                  className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  Abbrechen
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div 
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <div className="flex items-center gap-3 mb-4">
              <Calendar className="h-6 w-6 text-[#D4A574]" />
              <h3 className="text-lg font-semibold text-white">Buchungen</h3>
            </div>
            <p className="text-2xl font-bold text-white">{userBookings.length}</p>
            <p className="text-sm text-gray-400">{getTotalDays()} Tage gesamt</p>
          </motion.div>

          <motion.div 
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <div className="flex items-center gap-3 mb-4">
              <Euro className="h-6 w-6 text-[#D4A574]" />
              <h3 className="text-lg font-semibold text-white">Gesamtkosten</h3>
            </div>
            <p className="text-2xl font-bold text-white">€{getTotalCost()}</p>
            <p className="text-sm text-gray-400">50€ pro Tag</p>
          </motion.div>

          <motion.div 
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <div className="flex items-center gap-3 mb-4">
              <User className="h-6 w-6 text-[#D4A574]" />
              <h3 className="text-lg font-semibold text-white">Profil</h3>
            </div>
            <p className="text-sm text-gray-300 mb-2">{user?.email}</p>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors text-sm"
            >
              <LogOut className="h-4 w-4" />
              Abmelden
            </button>
          </motion.div>
        </div>

        {/* Contribution Impact */}
        {getTotalCost() > 0 && (
          <motion.div 
            className="mb-8 bg-gradient-to-br from-[#D4A574]/20 to-[#4A5D23]/20 backdrop-blur-lg rounded-2xl p-6 border border-[#D4A574]/30"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-4">🚀 Dein Impact</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-lg text-gray-300">
                    Mit deinem Beitrag von <span className="text-[#D4A574] font-bold text-xl">€{getTotalCost()}</span> finanzierst du
                  </p>
                  <p className="text-3xl font-bold text-[#D4A574] my-2">
                    {getContributionPercentage().toFixed(1)}%
                  </p>
                  <p className="text-lg text-gray-300">
                    des gesamten Community-Projekts!
                  </p>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-[#D4A574] to-[#4A5D23] h-4 rounded-full transition-all duration-700 flex items-center justify-end pr-2"
                    style={{ width: `${Math.max(getContributionPercentage(), 5)}%` }}
                  >
                    {getContributionPercentage() > 10 && (
                      <span className="text-xs font-bold text-white">
                        {getContributionPercentage().toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-sm text-gray-400 mt-4">
                  {getContributionPercentage() < 5 
                    ? "Jeder Euro zählt! Du hilfst dabei, den Traum zu verwirklichen! 🌟"
                    : getContributionPercentage() < 15
                    ? "Wow! Du machst einen echten Unterschied! 💪"
                    : "Unglaublich! Du bist ein Community-Hero! 🏆"
                  }
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Booking Calendar */}
          <motion.div 
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">Neue Buchung</h2>
              {!showBookingForm && (
                <button
                  onClick={() => setShowBookingForm(true)}
                  className="flex items-center gap-2 bg-[#D4A574] hover:bg-[#c19660] text-black font-semibold px-4 py-2 rounded-lg transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Termin buchen
                </button>
              )}
            </div>

            {showBookingForm ? (
              <div className="space-y-6">
                <WuecamperDatePicker 
                  onSelectionChange={setSelectedRange} 
                  blockedRanges={blockedRanges}
                />
                
                <div className="flex gap-4">
                  <button
                    onClick={handleCreateBooking}
                    disabled={bookingLoading || !selectedRange.startDate || !selectedRange.endDate}
                    className="flex-1 bg-[#D4A574] hover:bg-[#c19660] disabled:opacity-50 text-black font-semibold px-6 py-3 rounded-lg transition-colors"
                  >
                    {bookingLoading ? "Wird erstellt..." : "Buchung erstellen"}
                  </button>
                  <button
                    onClick={() => {
                      setShowBookingForm(false);
                      setSelectedRange({ startDate: null, endDate: null });
                    }}
                    className="px-6 py-3 border border-gray-600 text-gray-300 hover:text-white hover:border-gray-500 rounded-lg transition-colors"
                  >
                    Abbrechen
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Klicke auf &quot;Termin buchen&quot; um eine neue Buchung zu erstellen</p>
              </div>
            )}
          </motion.div>

          {/* User Bookings */}
          <motion.div 
            className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            variants={fadeInUp}
            initial="initial"
            animate="animate"
          >
            <div className="flex items-center gap-3 mb-6">
              <CalendarCheck className="h-6 w-6 text-[#D4A574]" />
              <h2 className="text-xl font-semibold text-white">Deine Buchungen</h2>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {userBookings.length > 0 ? userBookings.map((booking) => (
                <div key={booking.id} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-white font-medium">
                        {format(booking.startDate, "dd. MMM", { locale: de })} - {format(booking.endDate, "dd. MMM yyyy", { locale: de })}
                      </p>
                      <p className="text-sm text-gray-400">{booking.totalDays} Tage</p>
                    </div>
                    <div className="text-right flex items-start gap-3">
                      <div>
                        <p className="text-white font-medium">€{booking.totalCost}</p>
                        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(booking.status)}`}>
                          {getStatusText(booking.status)}
                        </span>
                      </div>
                      {booking.status !== 'cancelled' && (
                        <button
                          onClick={() => setConfirmCancel(booking.id)}
                          className="text-red-400 hover:text-red-300 p-1 rounded transition-colors"
                          title="Buchung stornieren"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  {booking.notes && (
                    <p className="text-xs text-gray-500 mt-2">{booking.notes}</p>
                  )}
                </div>
              )) : (
                <div className="text-center py-12 text-gray-400">
                  <CalendarCheck className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Noch keine Buchungen vorhanden</p>
                  <p className="text-sm mt-2">Erstelle deine erste Buchung um loszulegen!</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Navigation */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.push("/")}
            className="bg-gray-600 hover:bg-gray-500 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
          >
            Zurück zur Startseite
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}