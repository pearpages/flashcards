import { useEffect } from "react";

export function useKeyboardNav(
  onLeft: () => void,
  onRight: () => void,
  onReveal: () => void,
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Leave arrow keys alone while the user is typing (e.g. in the search field)
      const target = e.target;
      if (target instanceof Element && target.closest("input, textarea, select, [contenteditable='true']")) return;

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
