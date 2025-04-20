"use client";

import { Button, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRef } from "react";
import { onError } from "../../../../../../../utils/errors";
import { useAddShift } from "../../hooks/useAddShift";

import { useRouter } from "next/navigation";
import { useDisabledButtonsCache } from "../../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../../hooks/useEnableDisableButtonToggle";
import { FlexiShiftForm, type FormRef } from "./FlexiShiftForm";

export const AddFlexiShift = () => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const router = useRouter();

  const { mutate, isPending } = useAddShift({
    options: {
      onSuccess: (data) => {
        toasts.success({ title: data.message });
        router.push("/employee-management/shifts/shift");
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const onAddFlexiShift = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  const onCancel = () => {
    router.push("/employee-management/shifts/shift");
  };

  return (
    <Stack gap="15px">
      <FlexiShiftForm ref={formRef} />

      <Stack direction="row" gap="15px" justifyContent="flex-end">
        <Button variant="outlined" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={onAddFlexiShift}
          loading={isPending}
          disabled={isDisabled()}
        >
          Save
        </Button>
      </Stack>
    </Stack>
  );
};
