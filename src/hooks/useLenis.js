import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

let lenisInstance = null;

export function getLenis() {
  return lenisInstance;
}

export default function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // easing function
      smooth: true,
      direction: "vertical", // "vertical" or "horizontal"
      gestureDirection: "vertical",
      smoothTouch: true,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisInstance = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => lenis.destroy(); // cleanup on unmount
  }, []);
}
