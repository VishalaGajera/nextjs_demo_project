import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { isEqual } from "lodash";
import { useMemo, useRef, useState } from "react";
import { useDisabledButtonsCache } from "../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../../utils/errors";
import { EditAction } from "../../../../../common/EditAction";
import type { LeaveEmployeeDetails } from "../hooks/useGetLeaveEmployeeDetails";
import { useEditLeaveRequest } from "../PendingLeaveRequests/Dialogs/hooks/useEditLeaveRequest";
import { useGetLeaveRequest } from "../PendingLeaveRequests/Dialogs/hooks/useGetPendingLeaveRequest";
import { ApplyLeaveForm, type FormRef } from "./ApplyLeaveForm";

type EditLeaveRequestDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  employeeId: string;
  fromDate: string;
  toDate: string;
  leaveRequestId: string;
  leaveDetailsData?: LeaveEmployeeDetails;
};
export const EditLeaveRequestDialog = ({
  open,
  onClose,
  onEditSuccess,
  employeeId,
  fromDate,
  toDate,
  leaveRequestId,
  leaveDetailsData,
}: EditLeaveRequestDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const [hasValidationErrors, setHasValidationErrors] = useState(false);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: latestLeaveTypeData, isPending: isPendingLeaveTypeData } =
    useGetLeaveRequest({
      employeeId,
      leaveRequestId,
    });

  const defaultValues = useMemo(() => {
    const {
      from_date,
      to_date,
      from_half,
      to_half,
      leave_type_id,
      reason,
      attachments,
      ...rest
    } = latestLeaveTypeData || {};

    const updatedFromHalf =
      from_date &&
      to_date &&
      isEqual(from_date, to_date) &&
      from_half == "first_half" &&
      to_half == "second_half"
        ? "full_day"
        : from_half;

    return {
      ...rest,
      from_half: updatedFromHalf ?? null,
      from_date: from_date ?? null,
      to_date: to_date ?? null,
      to_half: to_half ?? null,
      leave_type_id: leave_type_id ?? null,
      reason: reason ?? null,
      attachments: attachments ?? [],
      notifies: latestLeaveTypeData?.notifies?.map(
        ({ employee_id }) => employee_id
      ),
    };
  }, [latestLeaveTypeData]);

  const { mutate, isPending } = useEditLeaveRequest({
    employeeId,
    leaveRequestId,
    options: {
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error),
    },
  });

  const onEditLeaveType = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="lg"
      onClose={onClose}
      open={open}
      title="Edit Leave Request"
      actions={
        <Stack direction="row" gap="5px">
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <EditAction
            onClick={onEditLeaveType}
            loading={isPending}
            disabled={isDisabled() || hasValidationErrors}
          />
        </Stack>
      }
    >
      <ApplyLeaveForm
        ref={formRef}
        defaultValues={defaultValues}
        leaveRequestId={leaveRequestId}
        leaveDetailsData={leaveDetailsData}
        fromPlanDate={fromDate}
        toPlanDate={toDate}
        loading={isPendingLeaveTypeData}
        setHasValidationErrors={setHasValidationErrors}
      />
    </Dialog>
  );
};
