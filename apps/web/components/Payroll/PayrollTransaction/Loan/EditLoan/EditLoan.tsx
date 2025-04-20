import { Button, PadBox, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRouter } from "next/navigation";
import { Fragment, useRef, useState } from "react";
import { useDisabledButtonsCache } from "../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../utils/errors";
import { EditAction } from "../../../../common/EditAction";
import { type FormRef, LoanForm } from "../AddLoan/LoanForm";
import { useEditLoan } from "./hooks/useEditLoan";
import { useGetLoan } from "./hooks/useGetLoan";

type EditLoanProps = {
  loanId: string;
};

export const EditLoan = ({ loanId }: EditLoanProps) => {
  const formRef = useRef<FormRef>(null);

  const [summaryMismatch, setSummaryMismatch] = useState(false);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const router = useRouter();

  const { data: loanData, isPending: isPendingLatestLoanData } = useGetLoan({
    loanId,
  });

  const { mutate, isPending } = useEditLoan({
    loanId,
    options: {
      onSuccess: (data) => {
        toasts.success({ title: data.message });
        router.push("/payroll/payroll-transaction/loan");
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const onEditLoan = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Fragment>
      <LoanForm
        ref={formRef}
        isEdit={true}
        defaultValues={loanData}
        loading={isPendingLatestLoanData}
        setSummaryMismatch={setSummaryMismatch}
      />

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

          <EditAction
            onClick={onEditLoan}
            loading={isPending}
            disabled={isDisabled() || summaryMismatch}
          />
        </Stack>
      </PadBox>
    </Fragment>
  );
};
