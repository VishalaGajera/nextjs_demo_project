import { TimePicker } from "@codezee/sixtify-brahma";
import { Box, Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";

export const AutoShiftTimingRow = () => {
  const { control } = useForm();

  return (
    <Stack direction="row" sx={{ minWidth: "100%" }} gap="10px">
      <Box width="100%" maxWidth="250px">
        <TimePicker control={control} name="" />
      </Box>

      <Box width="100%" maxWidth="250px">
        <TimePicker control={control} name="" />
      </Box>

      <Typography mt="10px" sx={{ width: "100%", maxWidth: "250px" }}>
        0h 0m
      </Typography>

      <Box width="100%" maxWidth="250px">
        <TimePicker control={control} name="" />
      </Box>

      <Box width="100%" maxWidth="250px">
        <TimePicker control={control} name="" />
      </Box>

      <Typography mt="10px" sx={{ width: "100%", maxWidth: "250px" }}>
        0h 0m
      </Typography>

      <Typography mt="10px" sx={{ width: "100%", maxWidth: "250px" }}>
        0h 0m
      </Typography>
    </Stack>
  );
};
