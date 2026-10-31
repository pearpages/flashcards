import { useEffect } from "react";

export function useKeyboardNav(
  onLeft: () => void,
  onRight: () => void,
  onReveal: () => void,
  onHide?: () => void,
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Leave keys alone while the user is typing (e.g. in the search field) or inside a dialog (the filters sheet)
      const target = e.target;
      if (target instanceof Element && target.closest("input, textarea, select, [contenteditable='true'], dialog, [role='dialog']")) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        onLeft();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onRight();
      } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        onReveal();
      } else if ((e.key === "h" || e.key === "H") && onHide && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        onHide();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onLeft, onRight, onReveal, onHide]);
}
