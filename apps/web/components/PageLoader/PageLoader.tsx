import { FacebookCircularProgress } from "@codezee/sixtify-brahma";
import { Box } from "@mui/material";

export const PageLoader = () => {
  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      <FacebookCircularProgress size={60} />
    </Box>
  );
};
