import { useEffect, useId, useState } from "react";
import { CtaButton } from "../../ui/CtaButton/CtaButton";
import { RubrikLogotype } from "../../ui/RubrikMark/RubrikLogotype";
import styles from "./SiteHeader.module.css";

const PRIMARY_LINKS = ["Products", "Solutions", "Knowledge Hub", "About Us"];
const SECONDARY_LINKS = ["Zero Labs", "CXO", "Partners", "Support"];

function MenuIcon({ open }: { open: boolean }) {
  return open ? (
    <svg viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  ) : (
    <svg viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <path d="M2 5h14M2 9h14M2 13h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function LinkList({ links, className }: { links: string[]; className?: string }) {
  return (
    <ul className={className}>
      {links.map((link) => (
        <li key={link}>
          <a className={styles.navLink} href="#">
            {link}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  return (
    <header className={styles.header}>
      <div className={styles.bar}>
        <div className={styles.primaryGroup}>
          <a className={styles.logo} href="/">
            <RubrikLogotype className={styles.logotype} />
          </a>
          <nav className={styles.navGroups} aria-label="Primary">
            <LinkList links={PRIMARY_LINKS} className={styles.navList} />
          </nav>
        </div>

        <div className={styles.secondaryGroup}>
          <nav className={styles.navGroups} aria-label="Secondary">
            <LinkList links={SECONDARY_LINKS} className={styles.navList} />
          </nav>
          <CtaButton variant="dark" size="small" href="#contact" className={styles.navCta}>
            Contact Sales
          </CtaButton>
          <button
            type="button"
            className={styles.menuToggle}
            aria-expanded={menuOpen}
            aria-controls={panelId}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id={panelId} className={styles.mobilePanel} aria-label="Mobile">
          <LinkList links={[...PRIMARY_LINKS, ...SECONDARY_LINKS]} className={styles.mobileNavList} />
        </nav>
      )}
    </header>
  );
}
