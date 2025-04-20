import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { isFunction } from "lodash";
import { useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../../../../utils/errors";
import { useAddInsuranceDetail } from "./hooks/useAddInsuranceDetails";
import type { FormRef } from "./InsuranceDetailForm";
import { InsuranceDetailForm } from "./InsuranceDetailForm";

type AddInsuranceDetailDialogProps = {
  open: boolean;
  onClose: () => void;
  onAddSuccess: () => void;
  employeeId: string;
};

export const AddInsuranceDetailDialog = ({
  open,
  onClose,
  onAddSuccess,
  employeeId,
}: AddInsuranceDetailDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { mutate, isPending } = useAddInsuranceDetail({
    employeeId,
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

  const onCreateInsuranceDetail = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      title="Add Insurance Details"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <Button
            onClick={onCreateInsuranceDetail}
            loading={isPending}
            disabled={isDisabled()}
          >
            Save
          </Button>
        </Stack>
      }
    >
      <InsuranceDetailForm ref={formRef} />
    </Dialog>
  );
};
