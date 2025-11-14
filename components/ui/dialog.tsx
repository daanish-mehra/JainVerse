"use client";

import * as React from "react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const Dialog = ({ open, onOpenChange, children }: DialogProps) => {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={() => onOpenChange(false)}
    >
      <div
        className={cn(
          "relative bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto",
          "animate-in fade-in-0 zoom-in-95 duration-200"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

interface DialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
}

const DialogContent = React.forwardRef<
  HTMLDivElement,
  DialogContentProps
>(({ className, children, onClose, ...props }, ref) => (
  <div ref={ref} className={cn("relative p-6", className)} {...props}>
    {onClose && (
      <button
        onClick={onClose}
        className="absolute top-4 right-4 rounded-full p-1 hover:bg-gray-100 transition-colors"
      >
        <X className="w-4 h-4 text-gray-500" />
      </button>
    )}
    {children}
  </div>
));

DialogContent.displayName = "DialogContent";

const DialogHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 text-center sm:text-left mb-4", className)}
    {...props}
  />
));

DialogHeader.displayName = "DialogHeader";

const DialogTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-xl font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));

DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));

DialogDescription.displayName = "DialogDescription";

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription };

