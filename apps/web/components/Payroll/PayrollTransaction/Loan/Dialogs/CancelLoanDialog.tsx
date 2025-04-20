import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRef } from "react";
import { onError } from "../../../../../utils/errors";
import type { LoanListType } from "../LoanList/hooks/useGetLoanList";
import { useEditLoanStatus } from "./hooks/useEditLoanStatus";
import { LoanDetailsSection } from "./LoanDetailsSection";
import { type FormRef, LoanStatusForm } from "./LoanStatusForm";

type CancelLoanDialogProps = {
  loanDetails: LoanListType;
  open: boolean;
  onClose: () => void;
  onCancelSuccess: () => void;
};

export const CancelLoanDialog = ({
  loanDetails,
  open,
  onClose,
  onCancelSuccess,
}: CancelLoanDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { mutate, isPending } = useEditLoanStatus({
    loanId: loanDetails.id,
    status: "cancelled",
    options: {
      onSuccess: (data) => {
        onClose();
        onCancelSuccess();
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error),
    },
  });

  const onCancelLoanStatus = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      title="Cancel Loan"
      open={open}
      isHideDividers
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <Button onClick={onCancelLoanStatus} loading={isPending}>
            Confirm
          </Button>
        </Stack>
      }
    >
      <Stack gap="30px">
        <LoanDetailsSection loanDetails={loanDetails} />

        <LoanStatusForm ref={formRef} status="cancelled" />
      </Stack>
    </Dialog>
  );
};
