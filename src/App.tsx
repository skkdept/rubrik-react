import { Nav } from "./components/sections/Nav/Nav";
import { HeroSection } from "./components/sections/HeroSection/HeroSection";
import { LogoStrip } from "./components/sections/LogoStrip/LogoStrip";
import { PlatformIntro } from "./components/sections/PlatformIntro/PlatformIntro";
import { StatCardGrid } from "./components/sections/StatCardGrid/StatCardGrid";
// Temporarily hidden, see below.
// import { PlatformSurfacesStacked } from "./components/sections/PlatformSurfacesStacked/PlatformSurfacesStacked";
// import { PlatformSurfacesTabbed } from "./components/sections/PlatformSurfacesTabbed/PlatformSurfacesTabbed";
// import { TestimonialCarousel } from "./components/sections/TestimonialCarousel/TestimonialCarousel";
import { FaqSection } from "./components/sections/FaqSection/FaqSection";
import { Teaser50 } from "./components/sections/Teaser50/Teaser50";
import { Teaser100 } from "./components/sections/Teaser100/Teaser100";
import { SiteFooter } from "./components/sections/SiteFooter/SiteFooter";
import styles from "./App.module.css";

/**
 * Home page composition. Guidelines.md §6 documents a single "CTA Section
 * (split)" after FAQ, but the raw generated source
 * (`src/imports/HomePage/index.tsx:20117-20140`) has TWO distinct
 * `data-name="CTA Section"` blocks: the split 2-card one (`Teaser50`)
 * BEFORE the FAQ section, and a second, full-width single-banner one
 * (`Teaser100`) AFTER it — Guidelines.md only documented one of the
 * two. Order corrected to match the source. See ASSUMPTIONS.md.
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
      <Nav />
      <main>
        <HeroSection />
        <LogoStrip />
        <PlatformIntro />
        <StatCardGrid />
        {/* Temporarily hidden for review. */}
        {/* <PlatformSurfacesStacked /> */}
        {/* <PlatformSurfacesTabbed /> */}
        {/* <TestimonialCarousel /> */}
        <Teaser50 />
        <FaqSection />
        <Teaser100 />
      </main>
      <SiteFooter />
    </div>
  );
}
