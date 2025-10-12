import HeroSection from "@/components/sections/hero-section";
import AboutSection from "@/components/sections/about-section";
import PurchaseMilestoneSection from "@/components/sections/purchase-milestone-section";
import InteriorDetailsSection from "@/components/sections/interior-details-section";
import Footer from "@/components/layout/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <PurchaseMilestoneSection />
      <InteriorDetailsSection />
      <Footer />
    </main>
  );
}
