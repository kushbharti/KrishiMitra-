import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-2xl border border-gray-200/80 bg-white/90 p-6 shadow-sm backdrop-blur-md transition-all dark:border-gray-800/80 dark:bg-gray-900/90",
      className,
    )}
    {...props}
  />
));
Card.displayName = "Card";

export { Card };
