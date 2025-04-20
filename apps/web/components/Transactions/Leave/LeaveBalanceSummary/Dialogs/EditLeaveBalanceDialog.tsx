import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../utils/errors";
import { EditAction } from "../../../../common/EditAction";
import { type FormRef, LeaveBalanceForm } from "./LeaveBalanceForm";
import { useEditLeaveBalanceDetails } from "./hooks/useEditLeaveBalanceDetails";
import { useGetLeaveBalanceSummaryDetails } from "./hooks/useGetLeaveBalanceDetails";

type EditLeaveBalanceDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  employeeId: string;
};

export const EditLeaveBalanceDialog = ({
  employeeId,
  open,
  onClose,
  onEditSuccess,
}: EditLeaveBalanceDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: latestLeaveBalanceData, isPending: isPendingLeaveBalanceData } =
    useGetLeaveBalanceSummaryDetails({
      employeeId,
    });

  const { mutate, isPending } = useEditLeaveBalanceDetails({
    employeeId,
    options: {
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error),
    },
  });

  const onEditLeaveBalanceDetails = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  const defaultValues = useMemo(() => {
    if (latestLeaveBalanceData?.leave_balance) {
      const leaveBalanceFormFieldValues = {
        leave_balance: latestLeaveBalanceData.leave_balance.map(
          ({ id, available_balance, leave_type_name }) => ({
            leave_balance_id: id,
            leave_type_name,
            available_balance,
          })
        ),
      };

      return leaveBalanceFormFieldValues;
    }
  }, [latestLeaveBalanceData]);

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      title="Edit Leave Balance"
      actions={
        <Stack direction="row" gap="5px">
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <EditAction
            onClick={onEditLeaveBalanceDetails}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <LeaveBalanceForm
        ref={formRef}
        defaultValues={defaultValues}
        latestLeaveBalanceData={latestLeaveBalanceData}
        loading={isPendingLeaveBalanceData}
      />
    </Dialog>
  );
};
