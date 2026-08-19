import { SiteHeader } from "@/components/portfolio/site-header";
import { HeroSection } from "@/components/portfolio/hero-section";
import { SelectedWork } from "@/components/portfolio/selected-work";
import { ApproachSection } from "@/components/portfolio/approach-section";
import { BackgroundSection } from "@/components/portfolio/background-section";
import { CapabilitiesSection } from "@/components/portfolio/capabilities-section";
import { ContactFooter } from "@/components/portfolio/contact-footer";

export default function Page() {
  return (
    <>
      <span className="portfolio-top-anchor" id="top" tabIndex={-1} />
      <SiteHeader />
      <main className="portfolio-page">
        <HeroSection />
        <SelectedWork />
        <ApproachSection />
        <BackgroundSection />
        <CapabilitiesSection />
      </main>
      <ContactFooter />
    </>
  );
}
