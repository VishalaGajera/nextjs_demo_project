import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { isFunction } from "lodash";
import { useMemo, useRef } from "react";
import { onError } from "../../../../../../../utils/errors";
import { useGetOneOvertimeRequest } from "../../Add/hooks/useGetOneOvertimeRequest";
import { useStatusOvertimeRequest } from "../Hooks/useStatusOvertimeRequest";
import {
  type FormRef,
  RequestOtForm,
  type RequestOtFormFieldValues,
} from "./RequestOtForm";

type ApproveOvertimeDialogProps = {
  open: boolean;
  onClose: () => void;
  onApproveSuccess: () => void;
  otRequestId: string;
  employeeId: string;
};

export const ApproveOvertimeDialog = ({
  open,
  onClose,
  onApproveSuccess,
  otRequestId,
  employeeId,
}: ApproveOvertimeDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { data: requestOtRequest, isPending: isRequestOtRequest } =
    useGetOneOvertimeRequest({
      employeeId,
      otRequestId,
    });

  const { mutate, isPending } = useStatusOvertimeRequest({
    OTRequestId: otRequestId,
    employeeId,
    status: "approved",
    options: {
      onSuccess: (data) => {
        onClose();

        if (isFunction(onApproveSuccess)) {
          onApproveSuccess();
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

  const defaultValues = useMemo(() => {
    if (requestOtRequest) {
      const requestOtFormFieldValues: RequestOtFormFieldValues = {
        in_time_overtime: requestOtRequest.in_time_overtime ?? null,
        out_time_overtime: requestOtRequest.out_time_overtime ?? null,
        remark: null,
        status: "approved",
        shift_start: null,
        shift_end: null,
        slot_start: null,
        slot_end: null,
        is_work_day_valid: requestOtRequest.is_work_day_valid ?? "",
      };

      return requestOtFormFieldValues;
    }
  }, [requestOtRequest]);

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      title="Approve Overtime Request"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <Button onClick={onEditTCreateOTRequest} loading={isPending}>
            Confirm
          </Button>
        </Stack>
      }
    >
      <RequestOtForm
        defaultValues={defaultValues}
        ref={formRef}
        overtimeDetails={requestOtRequest}
        loading={isRequestOtRequest}
      />
    </Dialog>
  );
};
