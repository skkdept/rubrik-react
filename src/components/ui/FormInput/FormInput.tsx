import type { InputHTMLAttributes, ReactNode } from "react";
import styles from "./FormInput.module.css";

interface FormInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "className"> {
  id: string;
  label: string;
  visibleLabel?: boolean;
  /** Trailing slot for an attached submit/action button. */
  action?: ReactNode;
  /** Leading slot, e.g. a search/sparkle icon. */
  icon?: ReactNode;
  variant?: "default" | "dark";
}

/** Shared text/email/search input, with optional leading icon and trailing action button. */
export function FormInput({
  id,
  label,
  visibleLabel = false,
  action,
  icon,
  variant = "default",
  ...inputProps
}: FormInputProps) {
  return (
    <div className={variant === "dark" ? `${styles.field} ${styles.dark}` : styles.field}>
      <label htmlFor={id} className={visibleLabel ? styles.label : styles.visuallyHiddenLabel}>
        {label}
      </label>
      <div className={styles.inputRow}>
        {icon && (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        )}
        <input id={id} className={styles.input} {...inputProps} />
        {action}
      </div>
    </div>
  );
}
