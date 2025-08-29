"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  redirectTo = "/auth/login" 
}: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setIsAuthenticated(true);
        } else {
          router.push(redirectTo);
          return;
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        router.push(redirectTo);
        return;
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          router.push(redirectTo);
        } else if (event === 'SIGNED_IN' || session) {
          setIsAuthenticated(true);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [supabase.auth, router, redirectTo]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#2A2A2A] via-[#1A1A1A] to-[#2A2A2A] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-white rounded-full mb-4" role="status" aria-label="loading">
            <span className="sr-only">Laden...</span>
          </div>
          <p className="text-white text-lg">Authentifizierung wird überprüft...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect, so don't render anything
  }

  return <>{children}</>;
}