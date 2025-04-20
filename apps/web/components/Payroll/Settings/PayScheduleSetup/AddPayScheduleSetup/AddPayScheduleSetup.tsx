"use client";

import { Button, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import { Fragment, useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../utils/errors";
import { useAddPayScheduleSetup } from "./hooks/useAddPayScheduleSetup";
import { PayScheduleSetupForm, type FormRef } from "./PayScheduleSetupForm";

export const AddPayScheduleSetup = () => {
  const router = useRouter();

  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { mutate, isPending } = useAddPayScheduleSetup({
    options: {
      onSuccess: (data) => {
        toasts.success({ title: data.message });
        router.push("/payroll/settings/pay-schedule-setup");
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const onCreatePayScheduleSetup = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Fragment>
      <PayScheduleSetupForm ref={formRef} />

      <Stack
        paddingRight="20px"
        direction="row"
        justifyContent="end"
        gap="10px"
      >
        <Button
          variant="outlined"
          onClick={() => {
            router.push("/payroll/settings/pay-schedule-setup");
          }}
        >
          Cancel
        </Button>

        <Button
          loading={isPending}
          onClick={onCreatePayScheduleSetup}
          disabled={isDisabled()}
        >
          Save
        </Button>
      </Stack>
    </Fragment>
  );
};
