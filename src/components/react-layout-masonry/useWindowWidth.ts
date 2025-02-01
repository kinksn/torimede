import { useCallback, useEffect, useState } from "react";

const useWindowWidth = (isResponsive: boolean = true): number => {
  const [windowWidth, setWindowSize] = useState<number | null>(null);

  const handleResize = useCallback(() => {
    if (typeof window !== "undefined") {
      setWindowSize(window.innerWidth);
    }
  }, []);

  useEffect(() => {
    handleResize();

    if (isResponsive) {
      window.addEventListener("resize", handleResize);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isResponsive, handleResize]);

  return windowWidth ?? 0;
};

export default useWindowWidth;
