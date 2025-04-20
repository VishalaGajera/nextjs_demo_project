import { DeleteDialog, toasts } from "@codezee/sixtify-brahma";
import { useTranslation } from "react-i18next";
import { onError } from "../../../../../utils/errors";
import type { LoanPolicy } from "../LoanPolicyList/hooks/useGetLoanPolicies";
import { useDeleteLoanPolicy } from "./hooks/useDeleteLoanPolicy";

type DeleteLoanPolicyDialogProps = {
  open: boolean;
  onClose: () => void;
  onDeleteSuccess: () => void;
  loanPolicyData: LoanPolicy;
};

export const DeleteLoanPolicyDialog = ({
  loanPolicyData,
  open,
  onDeleteSuccess,
  onClose,
}: DeleteLoanPolicyDialogProps) => {
  const { t } = useTranslation();

  const { mutate, isPending } = useDeleteLoanPolicy({
    policyId: loanPolicyData.id,
    options: {
      onSuccess: (data) => {
        onClose();
        onDeleteSuccess();
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error),
    },
  });

  return (
    <DeleteDialog
      title={t("dialog.delete.message", {
        deleteMessage: `${loanPolicyData.loan_policy_name}  Loan Policy`,
      })}
      open={open}
      isDeleteLoading={isPending}
      onDelete={() => mutate()}
      onClose={() => onClose()}
    />
  );
};
