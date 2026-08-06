import { SiteHeader } from "./components/sections/SiteHeader/SiteHeader";
import { HeroSection } from "./components/sections/HeroSection/HeroSection";
import { LogoStrip } from "./components/sections/LogoStrip/LogoStrip";
import { PlatformIntro } from "./components/sections/PlatformIntro/PlatformIntro";
import { StatCardGrid } from "./components/sections/StatCardGrid/StatCardGrid";
import { PlatformSurfacesStacked } from "./components/sections/PlatformSurfacesStacked/PlatformSurfacesStacked";
import { PlatformSurfacesTabbed } from "./components/sections/PlatformSurfacesTabbed/PlatformSurfacesTabbed";
import { TestimonialCarousel } from "./components/sections/TestimonialCarousel/TestimonialCarousel";
import { FaqSection } from "./components/sections/FaqSection/FaqSection";
import { CtaBanner } from "./components/sections/CtaBanner/CtaBanner";
import { SiteFooter } from "./components/sections/SiteFooter/SiteFooter";
import styles from "./App.module.css";

/**
 * Home page composition, per Guidelines.md §6 ("Home" row): Nav → Hero →
 * Heading/Subheading intro → Stat Cards → Desktop Section ×2 → Testimonial →
 * Desktop Section → Heading/Subheading intro → FAQ → CTA Section (split).
 *
 * Both PlatformSurfaces variants ship side by side in the "Desktop Section ×2"
 * slot per the user's own decision (kept for comparison, matching the old
 * App.tsx's stated intent). The second "Desktop Section" after the
 * testimonial and the second "Heading/Subheading intro" before FAQ have no
 * real content anywhere in the source — omitted rather than invented, see
 * ASSUMPTIONS.md.
 */
export default function App() {
  return (
    <div className={styles.page}>
      <SiteHeader />
      <main>
        <HeroSection />
        <LogoStrip />
        <PlatformIntro />
        <StatCardGrid />
        <PlatformSurfacesStacked />
        <PlatformSurfacesTabbed />
        <TestimonialCarousel />
        <FaqSection />
        <CtaBanner />
      </main>
      <SiteFooter />
    </div>
  );
}
