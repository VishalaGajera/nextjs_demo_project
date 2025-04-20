import { Button } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useRef } from "react";
import type { FormRef } from "../AddBankPaySchedule/BankPayScheduleForm";
import { BankPayScheduleForm } from "../AddBankPaySchedule/BankPayScheduleForm";
import { useGetBankPaySchedule } from "../EditBankPaySchedule/hooks/useGetBankPaySchedule";

export const ViewBankPaySchedule = () => {
  const formRef = useRef<FormRef>(null);

  const router = useRouter();

  const searchParams = useSearchParams();

  const bankPayScheduleId = searchParams.get("id") ?? "";

  const { data: bankPayScheduleDetails, isLoading: isBankPayScheduleLoading } =
    useGetBankPaySchedule({ bankPayScheduleId });

  const defaultValues = useMemo(() => {
    if (bankPayScheduleDetails) {
      const bankPayScheduleValues = bankPayScheduleDetails;

      return bankPayScheduleValues;
    }
  }, [bankPayScheduleDetails]);

  return (
    <Stack spacing={2}>
      <BankPayScheduleForm
        ref={formRef}
        defaultValues={defaultValues}
        loading={isBankPayScheduleLoading}
      />

      <Button
        variant="outlined"
        onClick={() => {
          router.push("/bank-configurations/bank-pay-schedule");
        }}
        sx={{ alignSelf: "flex-end", width: "max-content" }}
      >
        Cancel
      </Button>
    </Stack>
  );
};
