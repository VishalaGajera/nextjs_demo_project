import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRef } from "react";
import { onError } from "../../../../../utils/errors";
import type { LoanListType } from "../LoanList/hooks/useGetLoanList";
import { useEditLoanStatus } from "./hooks/useEditLoanStatus";
import { LoanDetailsSection } from "./LoanDetailsSection";
import { type FormRef, LoanStatusForm } from "./LoanStatusForm";

type ApproveLoanDialogProps = {
  loanDetails: LoanListType;
  open: boolean;
  onClose: () => void;
  onApproveSuccess: () => void;
};

export const ApproveLoanDialog = ({
  loanDetails,
  open,
  onClose,
  onApproveSuccess,
}: ApproveLoanDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { mutate, isPending } = useEditLoanStatus({
    loanId: loanDetails.id,
    status: "approved",
    options: {
      onSuccess: (data) => {
        onClose();
        onApproveSuccess();
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error),
    },
  });

  const onApproveLoanStatus = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      title="Approve Loan"
      open={open}
      isHideDividers
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <Button onClick={onApproveLoanStatus} loading={isPending}>
            Confirm
          </Button>
        </Stack>
      }
    >
      <Stack gap="30px">
        <LoanDetailsSection loanDetails={loanDetails} />

        <LoanStatusForm ref={formRef} status="approved" />
      </Stack>
    </Dialog>
  );
};
