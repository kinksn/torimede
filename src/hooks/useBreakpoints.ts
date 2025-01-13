import { useEffect, useState } from "react";
import { maxSm, maxMd } from "@/lib/constants/breakpoints";

const useMediaQuery = (query: string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);

    // 初期値
    setMatches(mediaQueryList.matches);

    // イベントリスナー
    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    mediaQueryList.addEventListener("change", listener);

    // クリーンアップ
    return () => mediaQueryList.removeEventListener("change", listener);
  }, [query]);

  return matches;
};

export const useBreakpoints = () => {
  // たとえば "(max-width: 845px)" に合致するかどうか
  const sm = useMediaQuery(`(max-width: ${maxSm})`);
  // "(max-width: 1280px)" に合致するかどうか
  const md = useMediaQuery(`(max-width: ${maxMd})`);

  return { sm, md };
};
