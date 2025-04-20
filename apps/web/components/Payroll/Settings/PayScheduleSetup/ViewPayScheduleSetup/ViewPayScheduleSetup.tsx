import { Button } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useRef } from "react";
import {
  type FormRef,
  PayScheduleSetupForm,
} from "../AddPayScheduleSetup/PayScheduleSetupForm";
import { useGetPayScheduleSetup } from "../EditPayScheduleSetup/hooks/useGetPayScheduleSetup";

export const ViewPayScheduleSetup = () => {
  const formRef = useRef<FormRef>(null);

  const router = useRouter();

  const searchParams = useSearchParams();

  const payScheduleSetupId = searchParams.get("id") ?? "";

  const {
    data: payScheduleSetupDetails,
    isLoading: isPayScheduleSetupLoading,
  } = useGetPayScheduleSetup({ payScheduleSetupId });

  const defaultValues = useMemo(() => {
    if (payScheduleSetupDetails) {
      const payScheduleSetupValues = payScheduleSetupDetails;

      return payScheduleSetupValues;
    }
  }, [payScheduleSetupDetails]);

  return (
    <Stack spacing={2}>
      <PayScheduleSetupForm
        ref={formRef}
        defaultValues={defaultValues}
        loading={isPayScheduleSetupLoading}
      />

      <Button
        variant="outlined"
        onClick={() => {
          router.push("/payroll/settings/pay-schedule-setup");
        }}
        sx={{ alignSelf: "flex-end", width: "max-content" }}
      >
        Cancel
      </Button>
    </Stack>
  );
};
