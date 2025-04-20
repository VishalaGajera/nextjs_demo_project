import { Box } from "@mui/material";
import type { FC, ReactNode } from "react";

type DocumentBoxContainerProps = {
  children: ReactNode;
  height?: string | number;
};

export const DocumentBoxContainer: FC<DocumentBoxContainerProps> = ({
  children,
  height = 640,
}) => (
  <Box sx={{ display: "flex", justifyContent: "center", height: "100%" }}>
    <Box sx={{ width: "100%", height }}>{children}</Box>
  </Box>
);
