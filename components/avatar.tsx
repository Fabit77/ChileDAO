import clsx from "clsx";

export function Avatar({ initials, size = "medium", index = 0 }: { initials: string; size?: "small" | "medium" | "large" | "hero"; index?: number }) {
  return <span className={clsx("avatar", `avatar-${size}`, `avatar-tone-${index % 6}`)} aria-hidden="true">{initials}</span>;
}
