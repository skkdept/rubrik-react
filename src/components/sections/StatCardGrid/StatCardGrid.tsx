import { useRef } from "react";
import { Container } from "../../layout/Container/Container";
import { useScrollReveal } from "../../../lib/useScrollReveal";
import { STAT_CARDS, type StatCard } from "../../../data/statCards";
import statCardAi from "../../../assets/stat-card-ai.png";
import statCardSaas from "../../../assets/stat-card-saas.png";
import styles from "./StatCardGrid.module.css";

// The source itself reuses a single photo across every "wide" card slot —
// matched here rather than sourcing distinct photography per card.
const IMAGES = [statCardAi, statCardSaas, statCardSaas, statCardSaas, statCardSaas];

function StatCardFigure({ card, image }: { card: Omit<StatCard, "image" | "alt">; image: string }) {
  const cardClass = card.layout === "tall" ? `${styles.card} ${styles.tall}` : `${styles.card} ${styles.wide}`;
  return (
    <figure className={cardClass}>
      <img className={styles.image} src={image} alt="" />
      <figcaption className={styles.content}>
        <span className={styles.chip}>{card.chip}</span>
        <div className={styles.statContainer}>
          <p className={styles.stat} data-reveal>
            {card.stat}
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
