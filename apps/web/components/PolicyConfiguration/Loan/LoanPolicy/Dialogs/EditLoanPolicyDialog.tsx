import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../utils/errors";
import { EditAction } from "../../../../common/EditAction";
import { useEditLoanPolicy } from "./hooks/useEditLoanPolicy";
import { useGetLoanPolicy } from "./hooks/useGetLoanPolicy";
import type { FormRef, LoanPolicyFormFieldValues } from "./LoanPolicyForm";
import { LoanPolicyForm } from "./LoanPolicyForm";

type EditLoanPolicyDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  policyId: string;
};

export const EditLoanPolicyDialog = ({
  policyId,
  open,
  onClose,
  onEditSuccess,
}: EditLoanPolicyDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const {
    data: latestLoanPolicyData,
    isFetching: isPendingLatestLoanPolicyData,
  } = useGetLoanPolicy({
    policyId,
  });

  const { mutate, isPending } = useEditLoanPolicy({
    policyId,
    options: {
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const onEditLoanPolicy = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

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
      title="Edit Loan Policy"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={onEditLoanPolicy}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <LoanPolicyForm
        ref={formRef}
        defaultValues={defaultValues as LoanPolicyFormFieldValues}
        loading={isPendingLatestLoanPolicyData}
      />
    </Dialog>
  );
};
