import { FOOTER_COLUMNS, FOOTER_LEGAL_LINKS } from "../../../data/footerLinks";
import { RubrikMark } from "../../ui/RubrikMark/RubrikMark";
import styles from "./SiteFooter.module.css";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <nav className={styles.columns} aria-label="Footer">
        {FOOTER_COLUMNS.map((column) => (
          <div className={styles.column} key={column.heading}>
            <h2 className={styles.columnHeading}>{column.heading}</h2>
            <ul className={styles.linkList}>
              {column.links.map((link) => (
                <li key={link}>
                  <a className={styles.link} href="#">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className={styles.divider} />

      <div className={styles.bottomRow}>
        <div className={styles.legal}>
          <p className={styles.copyright}>© {year} Rubrik, Inc.</p>
          <ul className={styles.legalLinks}>
            {FOOTER_LEGAL_LINKS.map((link) => (
              <li key={link}>
                <a className={styles.legalLink} href="#">
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.brandRow}>
          <RubrikMark className={styles.mark} />
          <div className={styles.socialIcons} aria-hidden="true">
            <span className={styles.socialPlaceholder} />
            <span className={styles.socialPlaceholder} />
            <span className={styles.socialPlaceholder} />
          </div>
        </div>
      </div>
    </footer>
  );
}
