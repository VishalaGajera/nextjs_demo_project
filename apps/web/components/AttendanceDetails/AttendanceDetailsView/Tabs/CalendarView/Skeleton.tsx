import { Box, Skeleton as MuiSkeleton, useTheme } from "@mui/material";

export const Skeleton = () => {
  const theme = useTheme();

  const { slate } = theme.palette.app.color;

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(7, 1fr)",
        gap: "1px",
      }}
    >
      {Array.from({ length: 35 }).map((_, index) => (
        <MuiSkeleton
          // eslint-disable-next-line sonarjs/no-array-index-key
          key={index}
          sx={{
            height: "192px",
            transform: "scale(1)",
            border: `1px solid ${slate[800]}`,
          }}
        />
      ))}
    </Box>
  );
};
