import hsl from "hsl-to-hex";
import { useCallback } from "react";
import { hslToHex } from "../utils/regex";

export const useConvertColorFormatHslToHex = () => {
  const convertHslToHex = useCallback((themeColor: string): string | null => {
    const getHexFromHsl = RegExp(hslToHex).exec(themeColor) || [];

    if (!getHexFromHsl) {
      return null;
    }

    const [, h, s, l] = getHexFromHsl.map(Number);

    return hsl(Number(h), Number(s), Number(l));
  }, []);

  return { convertHslToHex };
};
