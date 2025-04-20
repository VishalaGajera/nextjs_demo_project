import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../utils/errors";
import type { LoanCategory } from "../LoanCategory/hooks/useGetLoanCategories";
import type { FormRef } from "./LoanCategoryForm";
import { LoanCategoryForm } from "./LoanCategoryForm";
import { useEditLoanCategory } from "./hooks/useEditLoanCategory";
import { useGetLoanCategory } from "./hooks/useGetLoanCategory";
import { EditAction } from "../../../../common/EditAction";

type EditLoanCategoryDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  loanCategoryId: LoanCategory["id"];
};

export const EditLoanCategoryDialog = ({
  loanCategoryId,
  open,
  onClose,
  onEditSuccess,
}: EditLoanCategoryDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const {
    data: latestLoanCategoryData,
    isPending: isPendingLatestLoanCategoryData,
  } = useGetLoanCategory({
    loanCategoryId,
  });

  const { mutate, isPending } = useEditLoanCategory({
    loanCategoryId,
    options: {
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const onEditLoanCategory = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title="Edit Loan Category"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={onEditLoanCategory}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <LoanCategoryForm
        ref={formRef}
        defaultValues={latestLoanCategoryData}
        loading={isPendingLatestLoanCategoryData}
      />
    </Dialog>
  );
};
