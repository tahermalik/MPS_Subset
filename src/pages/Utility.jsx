import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getLenis } from "../hooks/useLenis";

function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    const lenis = getLenis();

    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return null;
}

export default ScrollToTop;