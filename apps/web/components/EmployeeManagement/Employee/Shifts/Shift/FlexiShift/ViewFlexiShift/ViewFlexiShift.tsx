import { Button } from "@codezee/sixtify-brahma";
import { Box, Stack } from "@mui/material";

import { useRouter } from "next/navigation";
import { FlexiShiftForm } from "../AddFlexiShift/FlexiShiftForm";
import { useGetFlexiShift } from "../EditFlexiShift/hooks/useGetFlexiShift";

type ViewFlexiShiftProps = {
  shiftId: string;
};
export const ViewFlexiShift = ({ shiftId }: ViewFlexiShiftProps) => {
  const router = useRouter();

  const { data: shiftDetail, isLoading: isShiftLoading } = useGetFlexiShift({
    shiftId,
  });

  const onCancel = () => {
    router.push("/employee-management/shifts/shift");
  };

  return (
    <Stack spacing={2}>
      <FlexiShiftForm
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
