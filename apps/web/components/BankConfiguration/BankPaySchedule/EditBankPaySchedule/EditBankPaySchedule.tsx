import { Button, PadBox, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import { useMemo, useRef } from "react";
import { onError } from "../../../../utils/errors";
import type { FormRef } from "../AddBankPaySchedule/BankPayScheduleForm";
import { BankPayScheduleForm } from "../AddBankPaySchedule/BankPayScheduleForm";
import { useEditBankPaySchedule } from "./hooks/useEditBankPaySchedule";
import { useGetBankPaySchedule } from "./hooks/useGetBankPaySchedule";

type EditBankPayScheduleProps = {
  bankPayScheduleId: string;
};

export const EditBankPaySchedule = ({
  bankPayScheduleId,
}: EditBankPayScheduleProps) => {
  const formRef = useRef<FormRef>(null);

  const router = useRouter();

  const {
    data: bankPayScheduleData,
    isPending: isPendingLatestBankPayScheduleData,
  } = useGetBankPaySchedule({
    bankPayScheduleId,
  });

  const { mutate, isPending } = useEditBankPaySchedule({
    bankPayScheduleId,
    options: {
      onSuccess: (data) => {
        toasts.success({ title: data.message });
        router.push("/bank-configurations/bank-pay-schedule");
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const defaultValues = useMemo(() => {
    if (bankPayScheduleData) {
      const bankPayScheduleValues = {
        ...bankPayScheduleData,
      };

      return bankPayScheduleValues;
    }
  }, [bankPayScheduleData]);

  const onEditBankPaySchedule = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Stack gap="20px">
      <BankPayScheduleForm
        ref={formRef}
        defaultValues={defaultValues}
        loading={isPendingLatestBankPayScheduleData}
        isEdit={true}
      />

      <PadBox padding={{ paddingRight: "20px" }}>
        <Stack direction="row" justifyContent="end" gap="10px">
          <Button
            variant="outlined"
            onClick={() => {
              router.push("/bank-configurations/bank-pay-schedule");
            }}
          >
            Cancel
          </Button>

          <Button loading={isPending} onClick={onEditBankPaySchedule}>
            Update
          </Button>
        </Stack>
      </PadBox>
    </Stack>
  );
};
