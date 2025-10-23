import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop component
 * Automatically scrolls to the top of the page when the route changes
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when pathname changes
    setTimeout(() => {
      window.scrollTo(0, 0);
      document.body.scrollTo({ top: 0 });
    }, 300);
  }, [pathname]);

  return null;
}
