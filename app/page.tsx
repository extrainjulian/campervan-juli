import HeroSection from "@/components/sections/hero-section";
import MountainSection from "@/components/sections/mountain-section";
import InteriorVideoSection from "@/components/sections/interior-video-section";
import InteriorDetailsSection from "@/components/sections/interior-details-section";
import ProjectPhilosophySection from "@/components/sections/project-philosophy-section";
import Footer from "@/components/layout/footer";

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <MountainSection />
      <InteriorVideoSection />
      <InteriorDetailsSection />
      <ProjectPhilosophySection />
      <Footer />
    </main>
  );
}
