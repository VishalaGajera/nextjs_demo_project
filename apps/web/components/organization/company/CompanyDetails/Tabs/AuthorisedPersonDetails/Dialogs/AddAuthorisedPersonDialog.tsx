import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { isFunction } from "lodash";
import { useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../../../utils/errors";
import type { FormRef } from "./AuthorisedPersonForm";
import { AuthorisedPersonForm } from "./AuthorisedPersonForm";
import { useAddAuthorisedPerson } from "./hooks/useAddAuthorisedPerson";

type AddAuthorisedPersonProps = {
  open: boolean;
  onClose: () => void;
  onAddSuccess: () => void;
  companyId: string;
};
export const AddAuthorisedPersonDialog = ({
  open,
  onClose,
  onAddSuccess,
  companyId,
}: AddAuthorisedPersonProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { mutate, isPending } = useAddAuthorisedPerson({
    companyId,
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

  const onCreateAuthorisedPerson = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      title="Add Authorised Person"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <Button
            onClick={onCreateAuthorisedPerson}
            loading={isPending}
            disabled={isDisabled()}
          >
            Save
          </Button>
        </Stack>
      }
    >
      <AuthorisedPersonForm ref={formRef} />
    </Dialog>
  );
};
