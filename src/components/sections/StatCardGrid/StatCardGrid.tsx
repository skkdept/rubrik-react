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

function StatCardFigure({
  card,
  image,
  countUpTrigger,
}: {
  card: Omit<StatCard, "image" | "alt">;
  image: string;
  countUpTrigger: boolean;
}) {
  const cardClass = card.layout === "tall" ? `${styles.card} ${styles.tall}` : `${styles.card} ${styles.wide}`;
  const { target, suffix } = parseStat(card.stat);
  const value = useCountUp(target, countUpTrigger);
  return (
    <figure className={cardClass}>
      <img className={styles.image} src={image} alt="" loading="lazy" decoding="async" />
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

  // One shared trigger for every card's count-up, based on the grid as a
  // whole entering view — not each card's own position. The grid is a
  // 2-column masonry (tall AI card + short SaaS below it vs. 3 even wide
  // cards), so a card sitting beneath a taller neighbor can be pushed
  // several hundred px lower on the page than its row-mates; counting up
  // independently per-card made those specific cards visibly lag behind
  // the others during a normal scroll. See ASSUMPTIONS.md.
  const gridRef = useRef<HTMLDivElement>(null);
  const [countUpTrigger, setCountUpTrigger] = useState(false);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    // Keeps observing (doesn't disconnect after the first fire) so
    // `countUpTrigger` tracks intersection continuously — see
    // useCountUp's own doc comment for why replaying on re-entry matters.
    const observer = new IntersectionObserver(
      (entries) => setCountUpTrigger(entries[0].isIntersecting),
      { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section} ref={sectionRef}>
      <h2 className="sr-only">Rubrik by the numbers</h2>
      <Container>
        <div className={styles.grid} ref={gridRef}>
          <div className={styles.column}>
            {left.map((card, i) => (
              <StatCardFigure card={card} image={IMAGES[i]} countUpTrigger={countUpTrigger} key={card.chip + card.stat} />
            ))}
          </div>
          <div className={styles.column}>
            {right.map((card, i) => (
              <StatCardFigure
                card={card}
                image={IMAGES[i + 2]}
                countUpTrigger={countUpTrigger}
                key={card.chip + card.stat}
              />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
