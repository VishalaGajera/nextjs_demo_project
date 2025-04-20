"use client";

import { Button, PadBox, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import { Fragment, useRef } from "react";
import { onError } from "../../../../../utils/errors";
import { type FormRef, PenaltyRulesForm } from "./PenaltyRulesForm";
import { useAddPenaltyRules } from "./hooks/useAddPenaltyRules";

export const AddPenaltyRules = () => {
  const router = useRouter();

  const formRef = useRef<FormRef>(null);

  const { mutate, isPending } = useAddPenaltyRules({
    options: {
      onSuccess: (data) => {
        toasts.success({ title: data.message });
        router.push("/policy-configuration/attendance/penalty-rules");
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const onCreatePenaltyRules = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Fragment>
      <PenaltyRulesForm ref={formRef} />

      <PadBox padding={{ paddingRight: "20px" }}>
        <Stack direction="row" justifyContent="end" gap="10px">
          <Button
            variant="outlined"
            onClick={() => {
              router.push("/policy-configuration/attendance/penalty-rules");
            }}
          >
            Cancel
          </Button>
          <Button loading={isPending} onClick={onCreatePenaltyRules}>
            Save
          </Button>
        </Stack>
      </PadBox>
    </Fragment>
  );
};
