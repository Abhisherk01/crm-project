import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Scrolls the window to the top whenever the URL path changes.
// Without this, navigating from a scrolled-down dashboard would
// leave the next page scrolled down too.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null; // renders nothing — exists purely for its side effect
}