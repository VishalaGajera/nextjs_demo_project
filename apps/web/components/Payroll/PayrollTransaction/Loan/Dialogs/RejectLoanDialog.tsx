import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRef } from "react";
import { onError } from "../../../../../utils/errors";
import type { LoanListType } from "../LoanList/hooks/useGetLoanList";
import { useEditLoanStatus } from "./hooks/useEditLoanStatus";
import { LoanDetailsSection } from "./LoanDetailsSection";
import { type FormRef, LoanStatusForm } from "./LoanStatusForm";

type RejectLoanDialogProps = {
  loanDetails: LoanListType;
  open: boolean;
  onClose: () => void;
  onRejectSuccess: () => void;
};

export const RejectLoanDialog = ({
  loanDetails,
  open,
  onClose,
  onRejectSuccess,
}: RejectLoanDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { mutate, isPending } = useEditLoanStatus({
    loanId: loanDetails.id,
    status: "rejected",
    options: {
      onSuccess: (data) => {
        onClose();
        onRejectSuccess();
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error),
    },
  });

  const onRejectLoanStatus = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      title="Reject Loan"
      open={open}
      isHideDividers
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <Button onClick={onRejectLoanStatus} loading={isPending}>
            Confirm
          </Button>
        </Stack>
      }
    >
      <Stack gap="30px">
        <LoanDetailsSection loanDetails={loanDetails} />

        <LoanStatusForm ref={formRef} status="rejected" />
      </Stack>
    </Dialog>
  );
};
