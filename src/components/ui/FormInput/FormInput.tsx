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
  variant?: "default" | "dark" | "pill";
  /** Scoped override hook for the outer wrapper, e.g. per-instance sizing. */
  className?: string;
}

/** Shared text/email/search input, with optional leading icon and trailing action button. */
export function FormInput({
  id,
  label,
  visibleLabel = false,
  action,
  icon,
  variant = "default",
  className,
  ...inputProps
}: FormInputProps) {
  const fieldClasses = [styles.field, variant !== "default" && styles[variant], className]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={fieldClasses}>
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
