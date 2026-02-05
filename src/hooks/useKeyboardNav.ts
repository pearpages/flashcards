import { useEffect } from "react";

export function useKeyboardNav(
  onLeft: () => void,
  onRight: () => void,
  onReveal: () => void,
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        onLeft();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onRight();
      } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        onReveal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onLeft, onRight, onReveal]);
}
