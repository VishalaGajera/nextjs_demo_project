"use client";

import { Button, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useDisabledButtonsCache } from "../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../utils/errors";
import type { FormRef } from "./BankPayScheduleForm";
import { BankPayScheduleForm } from "./BankPayScheduleForm";
import { useAddBankPaySchedule } from "./hooks/useAddBankPaySchedule";

export const AddBankPaySchedule = () => {
  const router = useRouter();

  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { mutate, isPending } = useAddBankPaySchedule({
    options: {
      onSuccess: (data) => {
        toasts.success({ title: data.message });
        router.push("/bank-configurations/bank-pay-schedule");
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const onCreateBankPaySchedule = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Stack gap="70px">
      <BankPayScheduleForm ref={formRef} />

      <Stack
        paddingRight="20px"
        direction="row"
        justifyContent="end"
        gap="10px"
      >
        <Button
          variant="outlined"
          onClick={() => {
            router.push("/bank-configurations/bank-pay-schedule");
          }}
        >
          Cancel
        </Button>

        <Button
          loading={isPending}
          onClick={onCreateBankPaySchedule}
          disabled={isDisabled()}
        >
          Save
        </Button>
      </Stack>
    </Stack>
  );
};
