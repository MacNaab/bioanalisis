// components/ScrollToTopButton.tsx
"use client";

import { ArrowUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ScrollToTopButton({ targetId }: { targetId?: string }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTarget = () => {
    const targetElement = document.getElementById(targetId ?? "");
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <Button
      onClick={scrollToTarget}
      aria-label="Remonter en haut"
      className={cn(
        "fixed bottom-6 right-6 z-50 rounded-full p-3 shadow-lg transition-all duration-300",
        "hover:shadow-xl hover:animate-bounce focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "h-12 w-12 cursor-pointer transition ease-in-out", // Taille fixe pour un cercle parfait
        isVisible
          ? "opacity-100 scale-100"
          : "opacity-0 scale-90 pointer-events-none"
      )}
      variant="outline"
    >
      <ArrowUp className="h-5 w-5" />
    </Button>
  );
}
