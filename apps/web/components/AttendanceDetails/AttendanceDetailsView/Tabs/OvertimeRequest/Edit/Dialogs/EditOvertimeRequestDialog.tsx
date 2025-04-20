import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { isFunction } from "lodash";
import { useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../../../utils/errors";
import { EditAction } from "../../../../../../common/EditAction";
import type { AttendanceDetailsMeta } from "../../../../../../Transactions/Attendance/AttendanceOverview/Dialogs/hooks/type";
import type { AttendanceDetails } from "../../../../../AttendanceSummary/hooks/type";
import {
  AddOvertimeRequestForm,
  type FormRef,
} from "../../Add/AddOvertimeRequestForm";
import { useGetOneOvertimeRequest } from "../../Add/hooks/useGetOneOvertimeRequest";
import { useEditOvertimeRequest } from "../Hooks/useEditOvertimeRequest";

type EditOvertimeRequestDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  attendanceDetails: AttendanceDetails;
  otRequestId: string;
  employeeId: string;
  metaData: AttendanceDetailsMeta;
};

export const EditOvertimeRequestDialog = ({
  open,
  onClose,
  onEditSuccess,
  attendanceDetails,
  otRequestId,
  employeeId,
  metaData,
}: EditOvertimeRequestDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: overtimeRequest, isPending: isRequestOtRequestPending } =
    useGetOneOvertimeRequest({
      employeeId,
      otRequestId,
    });

  const { mutate, isPending } = useEditOvertimeRequest({
    OTRequestId: otRequestId,
    employeeId,
    options: {
      onSuccess: (data) => {
        onClose();

        if (isFunction(onEditSuccess)) {
          onEditSuccess();
        }

        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const onEditTCreateOTRequest = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  const defaultValues = {
    overtime_date: overtimeRequest?.overtime_date ?? null,
    in_time_overtime: overtimeRequest?.in_time_overtime ?? null,
    out_time_overtime: overtimeRequest?.out_time_overtime ?? null,
    remark: overtimeRequest?.remark ?? null,
    shift_start: overtimeRequest?.shift_start ?? null,
    shift_end: overtimeRequest?.shift_end ?? null,
    slot_start: overtimeRequest?.slot_start ?? null,
    slot_end: overtimeRequest?.slot_end ?? null,
    is_work_day_valid: overtimeRequest?.is_work_day_valid ?? false,
    is_comment_required: false,
  };

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      title="Edit Overtime Request"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={onEditTCreateOTRequest}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <AddOvertimeRequestForm
        isEnabled={false}
        ref={formRef}
        loading={isRequestOtRequestPending}
        defaultValues={defaultValues}
        attendanceDetails={attendanceDetails}
        overtimeDetails={overtimeRequest}
        metaData={metaData}
      />
    </Dialog>
  );
};
