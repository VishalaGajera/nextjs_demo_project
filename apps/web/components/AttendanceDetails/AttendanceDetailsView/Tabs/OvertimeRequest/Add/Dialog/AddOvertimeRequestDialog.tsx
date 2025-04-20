import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { isFunction } from "lodash";
import { useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../../../utils/errors";
import type { AttendanceDetailsMeta } from "../../../../../../Transactions/Attendance/AttendanceOverview/Dialogs/hooks/type";
import type { AttendanceDetails } from "../../../../../AttendanceSummary/hooks/type";
import {
  AddOvertimeRequestForm,
  type FormRef,
} from "../AddOvertimeRequestForm";
import { useAddOvertimeRequest } from "../hooks/useAddOvertimeRequest";

type AddOvertimeRequestDialogProps = {
  open: boolean;
  onClose: () => void;
  onAddSuccess: () => void;
  attendanceDetails: AttendanceDetails;
  metaData: AttendanceDetailsMeta;
};

export const AddOvertimeRequestDialog = ({
  open,
  onClose,
  onAddSuccess,
  attendanceDetails,
  metaData,
}: AddOvertimeRequestDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { mutate, isPending } = useAddOvertimeRequest({
    employeeId: attendanceDetails.id,
    options: {
      onSuccess: (data) => {
        onClose();

        if (isFunction(onAddSuccess)) {
          onAddSuccess();
        }

        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const onAddCreateOTRequest = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      title="Add Overtime Request"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <Button
            onClick={onAddCreateOTRequest}
            loading={isPending}
            disabled={isDisabled()}
          >
            Save
          </Button>
        </Stack>
      }
    >
      <AddOvertimeRequestForm
        ref={formRef}
        attendanceDetails={attendanceDetails}
        metaData={metaData}
      />
    </Dialog>
  );
};
