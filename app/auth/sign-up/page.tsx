"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  
  useEffect(() => {
    router.replace("/signup");
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2A2A2A] via-[#1A1A1A] to-[#2A2A2A] flex items-center justify-center">
      <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-white rounded-full" role="status" aria-label="loading">
        <span className="sr-only">Weiterleitung...</span>
      </div>
    </div>
  );
}
