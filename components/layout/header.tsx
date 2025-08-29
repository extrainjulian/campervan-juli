import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Header() {
  return (
    <header className="fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link 
            href="/" 
            className="text-2xl font-bold text-white hover:text-[#D4A574] transition-colors"
          >
            wuecamper
          </Link>
          
          <Button className="bg-[#D4A574] hover:bg-[#c19660] text-black font-semibold px-6 py-2">
            Jetzt buchen
          </Button>
        </div>
      </div>
    </header>
  );
}