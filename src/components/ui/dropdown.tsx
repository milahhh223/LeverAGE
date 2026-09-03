"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface DropdownContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DropdownContext = React.createContext<DropdownContextValue | null>(null);

export function Dropdown({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div ref={ref} className="relative inline-block">
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

function useDropdown() {
  const ctx = React.useContext(DropdownContext);
  if (!ctx) throw new Error("Dropdown.Trigger/Content must be used inside <Dropdown>");
  return ctx;
}

export function DropdownTrigger({ children }: { children: React.ReactElement<Record<string, unknown>> }) {
  const { open, setOpen } = useDropdown();
  return React.cloneElement(children, {
    "aria-expanded": open,
    "aria-haspopup": "menu",
    onClick: (event: React.MouseEvent) => {
      (children.props.onClick as ((e: React.MouseEvent) => void) | undefined)?.(event);
      setOpen(!open);
    },
  });
}

export function DropdownContent({ children, className }: { children: React.ReactNode; className?: string }) {
  const { open } = useDropdown();
  if (!open) return null;

  return (
    <div
      role="menu"
      className={cn(
        "absolute right-0 z-50 mt-2 min-w-[180px] rounded-md border border-border-strong bg-surface-elevated p-1 shadow-lg",
        className
      )}
    >
      {children}
    </div>
  );
}

export function DropdownItem({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      role="menuitem"
      type="button"
      className={cn(
        "flex w-full items-center gap-2 rounded-sm px-2.5 py-2 text-left text-body-sm text-foreground-muted transition-colors duration-fast hover:bg-surface hover:text-foreground",
        className
      )}
      {...props}
    />
  );
}
