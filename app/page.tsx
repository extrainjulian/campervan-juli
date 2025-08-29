import HeroSection from "@/components/sections/hero-section";
import AboutSection from "@/components/sections/about-section";
import InteriorDetailsSection from "@/components/sections/interior-details-section";
import ProjectPhilosophySection from "@/components/sections/project-philosophy-section";
import Footer from "@/components/layout/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <InteriorDetailsSection />
      <ProjectPhilosophySection />
      <Footer />
    </main>
  );
}
