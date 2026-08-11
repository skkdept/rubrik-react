import { useEffect, useRef, useState } from "react";
import { Container } from "../../layout/Container/Container";
import { useScrollReveal } from "../../../lib/useScrollReveal";
import { useCountUp } from "../../../lib/useCountUp";
import { STAT_CARDS, type StatCard } from "../../../data/statCards";
import statCardAi from "../../../assets/stat-card-ai.webp";
import statCardSaas from "../../../assets/stat-card-saas.webp";
import styles from "./StatCardGrid.module.css";

// The source itself reuses a single photo across every "wide" card slot —
// matched here rather than sourcing distinct photography per card.
const IMAGES = [statCardAi, statCardSaas, statCardSaas, statCardSaas, statCardSaas];

// Every current stat is a leading integer plus a suffix ("42%", "3x") —
// splits those apart so the number can count up while the suffix stays put.
// Falls back to displaying the raw string unanimated if a future stat
// doesn't match that shape.
function parseStat(stat: string): { target: number; suffix: string } {
  const match = stat.match(/^(\d+)(.*)$/);
  if (!match) return { target: 0, suffix: stat };
  return { target: Number(match[1]), suffix: match[2] };
}

function StatCardFigure({ card, image }: { card: Omit<StatCard, "image" | "alt">; image: string }) {
  const cardClass = card.layout === "tall" ? `${styles.card} ${styles.tall}` : `${styles.card} ${styles.wide}`;
  const { target, suffix } = parseStat(card.stat);

  // Each card observes its OWN visibility rather than sharing one grid-wide
  // trigger. A shared trigger synced desktop's 2-column masonry nicely, but
  // broke mobile: below 768px this grid collapses to a single column (see
  // StatCardGrid.module.css), so all 5 cards stack across a column much
  // taller than any viewport — a trigger fired once near its top animated
  // every counter simultaneously, so cards further down had already
  // finished by the time they were actually scrolled into view (only the
  // first was ever seen mid-count). Per-card observation means each one
  // starts exactly as it individually arrives, correct on any layout. See
  // ASSUMPTIONS.md.
  const cardRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver((entries) => setInView(entries[0].isIntersecting), {
      threshold: 0.1,
      rootMargin: "0px 0px -5% 0px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const value = useCountUp(target, inView);
  return (
    <figure className={cardClass} ref={cardRef}>
      <img
        className={inView ? `${styles.image} ${styles.imageVisible}` : styles.image}
        src={image}
        alt=""
        loading="lazy"
        decoding="async"
      />
      <figcaption className={styles.content}>
        <span className={styles.chip}>{card.chip}</span>
        <div className={styles.statContainer}>
          <p className={styles.stat} data-reveal>
            {value}
            {suffix}
          </p>
          <p className={styles.caption} data-reveal>
            {card.caption}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}

export function StatCardGrid() {
  const sectionRef = useRef<HTMLElement>(null);
  useScrollReveal(sectionRef);
  const [first, ...rest] = STAT_CARDS;
  const left = [first, rest[0]];
  const right = rest.slice(1);

  return (
    <section className={styles.section} ref={sectionRef}>
      <h2 className="sr-only">Rubrik by the numbers</h2>
      <Container>
        <div className={styles.grid}>
          <div className={styles.column}>
            {left.map((card, i) => (
              <StatCardFigure card={card} image={IMAGES[i]} key={card.chip + card.stat} />
            ))}
          </div>
          <div className={styles.column}>
            {right.map((card, i) => (
              <StatCardFigure card={card} image={IMAGES[i + 2]} key={card.chip + card.stat} />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
