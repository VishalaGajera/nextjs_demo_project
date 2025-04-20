import { Skeleton, Stack } from "@mui/material";
import { v4 as uuidv4 } from "uuid";

export const MapLeavePlanTypeSkeletonForm = () => {
  return (
    <Stack flexDirection="row" flexWrap="wrap" gap={4}>
      {Array.from({ length: 6 }).map(() => (
        <Stack key={uuidv4()} gap="15px" flexDirection="row">
          <Skeleton
            height="25px"
            sx={{ transform: "scale(1)", width: "25px" }}
            animation="wave"
          />

          <Skeleton
            height="25px"
            sx={{ transform: "scale(1)", width: "200px" }}
            animation="wave"
          />
        </Stack>
      ))}
    </Stack>
  );
};
