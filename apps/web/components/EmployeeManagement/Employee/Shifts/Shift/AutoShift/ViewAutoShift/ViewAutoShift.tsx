import { Button } from "@codezee/sixtify-brahma";
import { Box, Stack } from "@mui/material";

import { useRouter } from "next/navigation";
import { useGetShift } from "../../hooks/useGetShift";
import { AutoShiftForm } from "../AutoShiftForm/AutoShiftForm";

export type ViewAutoShiftProps = {
  shiftId: string;
};
export const ViewAutoShift = ({ shiftId }: ViewAutoShiftProps) => {
  const router = useRouter();

  const { data: shiftDetail, isLoading: isShiftLoading } = useGetShift({
    shiftId,
  });

  const onCancel = () => {
    router.push("/employee-management/shifts/shift");
  };

  return (
    <Stack spacing={2}>
      <AutoShiftForm
        defaultValues={shiftDetail}
        loading={isShiftLoading}
        disabled
      />

      <Box display="flex" justifyContent="flex-end">
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
      </Box>
    </Stack>
  );
};
