import { useEffect, useState } from "react";
import { maxSm, maxMd } from "@/lib/constants/breakpoints";

export const useMediaQuery = (query: string) => {
  const [value, setValue] = useState(false);

  useEffect(() => {
    function onChange(event: MediaQueryListEvent) {
      setValue(event.matches);
    }

    const result = matchMedia(query);
    result.addEventListener("change", onChange);
    setValue(result.matches);

    return () => result.removeEventListener("change", onChange);
  }, [query]);

  return value;
};

export const useBreakpoints = () => {
  // たとえば "(max-width: 845px)" に合致するかどうか
  const sm = useMediaQuery(`(max-width: ${maxSm})`);
  // "(max-width: 1280px)" に合致するかどうか
  const md = useMediaQuery(`(max-width: ${maxMd})`);

  return { sm, md };
};
