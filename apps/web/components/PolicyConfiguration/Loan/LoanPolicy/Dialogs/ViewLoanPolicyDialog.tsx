import { Button, Dialog } from "@codezee/sixtify-brahma";
import { useMemo } from "react";
import {
  LoanPolicyForm,
  type LoanPolicyFormFieldValues,
} from "./LoanPolicyForm";
import { useGetLoanPolicy } from "./hooks/useGetLoanPolicy";

type ViewLoanPolicyDialogProps = {
  open: boolean;
  onClose: () => void;
  policyId: string;
};

export const ViewLoanPolicyDialog = ({
  policyId,
  open,
  onClose,
}: ViewLoanPolicyDialogProps) => {
  const {
    data: latestLoanPolicyData,
    isFetching: isPendingLatestLoanPolicyData,
  } = useGetLoanPolicy({
    policyId,
  });

  const defaultValues = useMemo(() => {
    if (latestLoanPolicyData) {
      const initialWorkFlow = latestLoanPolicyData?.approval_levels;

      const loanPolicyValues = {
        ...latestLoanPolicyData,
        ...latestLoanPolicyData?.approval_levels,
        approval_levels: initialWorkFlow?.map((workFlow) => {
          return {
            ...workFlow,
            level_approvers: workFlow.level_approvers?.map(
              (item) => item.employee_id
            ),
          };
        }) ?? [{ level_approvers: null }],
      };

      return loanPolicyValues;
    }
  }, [latestLoanPolicyData]);

  return (
    <Dialog
      maxWidth="lg"
      onClose={onClose}
      open={open}
      title="View Loan Policy"
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <LoanPolicyForm
        defaultValues={defaultValues as LoanPolicyFormFieldValues}
        loading={isPendingLatestLoanPolicyData}
        disabled
      />
    </Dialog>
  );
};
