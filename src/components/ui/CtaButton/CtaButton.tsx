import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";
import styles from "./CtaButton.module.css";

export type CtaVariant = "primary" | "secondary" | "accent" | "dark";
export type CtaSize = "small" | "medium" | "large";

interface SharedProps {
  variant?: CtaVariant;
  size?: CtaSize;
  children: ReactNode;
  className?: string;
}

type CtaButtonProps = SharedProps &
  (
    | ({ href: string } & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className" | "href">)
    | ({ href?: undefined } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className">)
  );

/** The 4 documented CTA styles (Primary/Secondary/Accent/Dark) x 3 sizes. */
export function CtaButton({
  variant = "primary",
  size = "medium",
  children,
  className,
  href,
  ...rest
}: CtaButtonProps) {
  const classes = [styles.button, styles[variant], styles[size], className]
    .filter(Boolean)
    .join(" ");

  if (href !== undefined) {
    return (
      <a
        className={classes}
        href={href}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      className={classes}
      type="button"
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
