import { Box, useTheme } from "@mui/material";
import { type PropsWithChildren, useEffect, useRef } from "react";
import { CustomAgGridStyles } from "./CustomAgGridStyles";

export const AgGridStickyHeaderProvider = ({
  children,
  stickValue,
}: PropsWithChildren & { stickValue: number }) => {
  const gridParentRef = useRef<HTMLElement>(null);

  const theme = useTheme();

  const { slate } = theme.palette.app.color;

  useEffect(() => {
    const updateElementStyle = (
      element: HTMLElement,
      position = "relative",
      top = 0,
      zIndex = "0",
      isHidden = true
    ) => {
      const headerGapElement = gridParentRef.current?.querySelector(
        ".ag-custom-gap"
      ) as HTMLElement;

      if (headerGapElement) {
        headerGapElement.style.position = position;
        headerGapElement.style.top = `${top - 10}px`;
        headerGapElement.style.zIndex = zIndex;
        headerGapElement.style.width = "100%";
        headerGapElement.style.background = slate[800] ?? "";
        headerGapElement.style.height = "10px";
        headerGapElement.style.display = isHidden ? "none" : "block";
      }

      element.style.position = position;
      element.style.top = `${top}px`;
      element.style.zIndex = zIndex;
      element.style.width = "auto";
    };

    const onScroll = () => {
      const headerElement = gridParentRef.current?.querySelector(
        ".ag-header"
      ) as HTMLElement;

      const agRoot = gridParentRef.current?.querySelector(
        ".ag-root-wrapper"
      ) as HTMLElement;

      if (!headerElement || !agRoot) {
        return;
      }

      if (document.documentElement.scrollTop > stickValue) {
        updateElementStyle(headerElement, "fixed", 74, "1", false);
      } else {
        updateElementStyle(headerElement);
      }
    };

    window.addEventListener("scroll", onScroll);
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <Box ref={gridParentRef}>
      <CustomAgGridStyles />
      <Box className="ag-custom-gap"></Box>
      {children}
    </Box>
  );
};
