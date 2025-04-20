import { Button, Dialog } from "@codezee/sixtify-brahma";
import type { LoanCategory } from "../LoanCategory/hooks/useGetLoanCategories";
import { LoanCategoryForm } from "./LoanCategoryForm";
import { useGetLoanCategory } from "./hooks/useGetLoanCategory";

type ViewLoanCategoryDialogProps = {
  open: boolean;
  onClose: () => void;
  loanCategoryId: LoanCategory["id"];
};

export const ViewLoanCategoryDialog = ({
  loanCategoryId,
  open,
  onClose,
}: ViewLoanCategoryDialogProps) => {
  const { data: loanCategory, isPending: isPendingLatestLoanCategoryData } =
    useGetLoanCategory({
      loanCategoryId,
    });

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title="View Loan Category"
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <LoanCategoryForm
        defaultValues={loanCategory}
        loading={isPendingLatestLoanCategoryData}
        disabled
      />
    </Dialog>
  );
};
