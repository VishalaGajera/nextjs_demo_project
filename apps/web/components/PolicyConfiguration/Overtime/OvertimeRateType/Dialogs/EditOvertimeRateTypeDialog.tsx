import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../utils/errors";
import { EditAction } from "../../../../common/EditAction";
import { useEditOvertimeRateType } from "./hooks/useEditOvertimeRateType";
import { useGetOvertimeRateType } from "./hooks/useGetOvertimeRateType";
import { type FormRef, OvertimeRateTypeForm } from "./OvertimeRateTypeForm";

type EditOvertimeRateTypeDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  overtimeRateTypeId: string;
};

export const EditOvertimeRateTypeDialog = ({
  overtimeRateTypeId,
  open,
  onEditSuccess,
  onClose,
}: EditOvertimeRateTypeDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const {
    data: latestOvertimeRateTypeData,
    isPending: isPendingOvertimeRateType,
  } = useGetOvertimeRateType({
    overtimeRateTypeId,
  });

  const { mutate, isPending } = useEditOvertimeRateType({
    overtimeRateTypeId,
    options: {
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const onEditOvertimeRateType = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="lg"
      onClose={onClose}
      open={open}
      title="Edit Overtime Rate Type"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={onEditOvertimeRateType}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <OvertimeRateTypeForm
        ref={formRef}
        defaultValues={latestOvertimeRateTypeData}
        loading={isPendingOvertimeRateType}
      />
    </Dialog>
  );
};
