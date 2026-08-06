import type { ElementType, ReactNode } from "react";
import styles from "./Container.module.css";

interface ContainerProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
}

/** Centers content within the 1440px page, applying the responsive side margins. */
export function Container({ as: Tag = "div", children, className }: ContainerProps) {
  return (
    <Tag className={className ? `${styles.container} ${className}` : styles.container}>
      {children}
    </Tag>
  );
}
