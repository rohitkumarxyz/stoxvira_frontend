import type { ElementType, ReactNode } from "react";

/**
 * The page measure. 1180px is the design's content width and lives only
 * here, so no screen has to repeat it.
 */
export function Container({
  as: Tag = "div",
  children,
  className = "",
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Tag className={`mx-auto w-full max-w-[1180px] px-6 ${className}`}>
      {children}
    </Tag>
  );
}
