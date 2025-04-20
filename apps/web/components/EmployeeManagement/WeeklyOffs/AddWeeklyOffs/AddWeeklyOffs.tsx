"use client";

import { Button, PadBox, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import { Fragment, useRef } from "react";
import { useDisabledButtonsCache } from "../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../utils/errors";
import type { FormRef } from "./WeeklyOffsForm";
import { WeeklyOffsForm } from "./WeeklyOffsForm";
import { useAddWeeklyOffs } from "./hooks/useAddWeeklyOffs";

export const AddWeeklyOffs = () => {
  const router = useRouter();

  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { mutate, isPending } = useAddWeeklyOffs({
    options: {
      onSuccess: (data) => {
        toasts.success({ title: data.message });
        router.push("/employee-management/weekly-offs");
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const onCreateWeeklyOffs = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Fragment>
      <WeeklyOffsForm ref={formRef} />

      <PadBox padding={{ paddingRight: "20px" }}>
        <Stack direction="row" justifyContent="end" gap="10px">
          <Button
            variant="outlined"
            onClick={() => {
              router.push("/employee-management/weekly-offs");
            }}
          >
            Cancel
          </Button>
          <Button
            loading={isPending}
            onClick={onCreateWeeklyOffs}
            disabled={isDisabled()}
          >
            Save
          </Button>
        </Stack>
      </PadBox>
    </Fragment>
  );
};
