import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../../../utils/errors";
import type { FormRef } from "./FamilyDetailsForm";
import { FamilyDetailsForm } from "./FamilyDetailsForm";
import { useAddFamilyDetails } from "./hooks/useAddFamilyDetails";

type AddFamilyDetailsDialogProps = {
  onClose: () => void;
  open: boolean;
  employeeId: string;
  onAddSuccess: () => void;
};

export const AddFamilyDetailsDialog = ({
  onClose,
  open,
  employeeId,
  onAddSuccess,
}: AddFamilyDetailsDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { mutate, isPending } = useAddFamilyDetails({
    employeeId,
    options: {
      onSuccess: (data) => {
        onAddSuccess();
        onClose();
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const addFamilyDetails = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      title="Add Family Details"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <Button
            onClick={addFamilyDetails}
            loading={isPending}
            disabled={isDisabled()}
          >
            Save
          </Button>
        </Stack>
      }
    >
      <FamilyDetailsForm ref={formRef} />
    </Dialog>
  );
};
