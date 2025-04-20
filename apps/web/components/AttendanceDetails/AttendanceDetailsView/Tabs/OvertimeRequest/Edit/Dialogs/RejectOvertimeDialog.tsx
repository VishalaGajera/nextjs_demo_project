import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { isFunction } from "lodash";
import { useMemo, useRef } from "react";
import { onError } from "../../../../../../../utils/errors";
import { useGetOneOvertimeRequest } from "../../Add/hooks/useGetOneOvertimeRequest";
import {
  type FormRef,
  RequestOtForm,
  type RequestOtFormFieldValues,
} from "./RequestOtForm";
import { useStatusOvertimeRequest } from "../Hooks/useStatusOvertimeRequest";

type RejectOvertimeDialogProps = {
  open: boolean;
  onClose: () => void;
  onRejectSuccess: () => void;
  otRequestId: string;
  employeeId: string;
};

export const RejectOvertimeDialog = ({
  open,
  onClose,
  onRejectSuccess,
  otRequestId,
  employeeId,
}: RejectOvertimeDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { data: requestOtRequest, isPending: isRequestOtRequest } =
    useGetOneOvertimeRequest({
      employeeId,
      otRequestId,
    });

  const { mutate, isPending } = useStatusOvertimeRequest({
    OTRequestId: otRequestId,
    employeeId,
    status: "rejected",
    options: {
      onSuccess: (data) => {
        onClose();

        if (isFunction(onRejectSuccess)) {
          onRejectSuccess();
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
        in_time_overtime: requestOtRequest.in_time_overtime,
        out_time_overtime: requestOtRequest.out_time_overtime,
        status: "rejected",
        remark: null,
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
      title="Reject Overtime Request"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <Button onClick={onEditTCreateOTRequest} loading={isPending}>
            Reject
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
