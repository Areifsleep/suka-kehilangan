import * as React from "react";
import { cn } from "@/lib/utils";

const InputGroup = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("relative flex flex-col", className)}
      {...props}
    />
  );
});
InputGroup.displayName = "InputGroup";

const InputGroupAddon = React.forwardRef(({ className, align = "start", ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "absolute z-10 flex items-center px-3 text-sm text-muted-foreground",
        {
          "top-0 left-0": align === "start",
          "top-0 right-0": align === "end",
          "bottom-0 left-0": align === "block-start",
          "bottom-2 right-0": align === "block-end",
        },
        className
      )}
      {...props}
    />
  );
});
InputGroupAddon.displayName = "InputGroupAddon";

const InputGroupText = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn("text-xs text-muted-foreground", className)}
      {...props}
    />
  );
});
InputGroupText.displayName = "InputGroupText";

const InputGroupTextarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
});
InputGroupTextarea.displayName = "InputGroupTextarea";

export { InputGroup, InputGroupAddon, InputGroupText, InputGroupTextarea };
