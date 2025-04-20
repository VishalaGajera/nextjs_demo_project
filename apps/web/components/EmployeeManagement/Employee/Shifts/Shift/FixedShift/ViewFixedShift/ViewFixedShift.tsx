import { Button } from "@codezee/sixtify-brahma";
import { Box, Stack } from "@mui/material";
import { useMemo } from "react";

import { useRouter } from "next/navigation";
import { useGetShift } from "../../hooks/useGetShift";
import { FixedShiftForm } from "../AddFixedShift/FixedShiftForm";

type ViewFixedShiftProps = {
  shiftId: string;
};
export const ViewFixedShift = ({ shiftId }: ViewFixedShiftProps) => {
  const router = useRouter();

  const { data: shiftDetail, isLoading: isShiftLoading } = useGetShift({
    shiftId,
  });

  const defaultValues = useMemo(() => {
    if (shiftDetail) {
      const shiftFormValues = shiftDetail;

      return shiftFormValues;
    }
  }, [shiftDetail]);

  const onCancel = () => {
    router.push("/employee-management/shifts/shift");
  };

  return (
    <Stack spacing={2}>
      <FixedShiftForm
        defaultValues={defaultValues}
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
