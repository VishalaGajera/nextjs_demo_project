import { Button, PadBox, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import { Fragment, useRef, useState } from "react";
import { useDisabledButtonsCache } from "../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../utils/errors";
import { useAddLoan } from "./hooks/useAddLoan";
import { LoanForm, type FormRef } from "./LoanForm";

export const AddLoan = () => {
  const router = useRouter();

  const [summaryMismatch, setSummaryMismatch] = useState(false);

  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { mutate, isPending } = useAddLoan({
    options: {
      onSuccess: (data) => {
        toasts.success({ title: data.message });
        router.push("/payroll/payroll-transaction/loan");
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const onCreateLoan = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Fragment>
      <LoanForm ref={formRef} setSummaryMismatch={setSummaryMismatch} />

      <PadBox padding={{ paddingRight: "20px" }}>
        <Stack direction="row" justifyContent="end" gap="10px">
          <Button
            variant="outlined"
            onClick={() => {
              router.push("/payroll/payroll-transaction/loan");
            }}
          >
            Cancel
          </Button>

          <Button
            loading={isPending}
            onClick={onCreateLoan}
            disabled={isDisabled() || summaryMismatch}
          >
            Save
          </Button>
        </Stack>
      </PadBox>
    </Fragment>
  );
};
