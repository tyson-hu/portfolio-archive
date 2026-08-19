"use client";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { MoonIcon, SunIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import * as React from "react";

export const ModeToggle = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      ref={ref}
      type="button"
      variant="link"
      size="icon"
      aria-label="Toggle color theme"
      className={cn(className)}
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (!event.defaultPrevented) {
          setTheme(theme === "dark" ? "light" : "dark");
        }
      }}
    >
      <SunIcon aria-hidden="true" className="h-full w-full" />
      <MoonIcon aria-hidden="true" className="hidden h-full w-full" />
    </Button>
  );
});

ModeToggle.displayName = "ModeToggle";
