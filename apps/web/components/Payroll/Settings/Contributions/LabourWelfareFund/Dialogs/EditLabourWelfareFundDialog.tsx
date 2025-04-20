import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../../utils/errors";
import { EditAction } from "../../../../../common/EditAction";
import {
  LabourWelfareFundForm,
  type FormRef,
} from "../LabourWelfareFundForm/LabourWelfareFundForm";
import { useEditLabourWelfareFund } from "./hooks/useEditLabourWelfareFund";
import { useGetLabourWelfareFund } from "./hooks/useGetLabourWelfareFund";

type EditLabourWelfareFundDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  lwfGroupId: string;
};

export const EditLabourWelfareFundDialog = ({
  lwfGroupId,
  open,
  onEditSuccess,
  onClose,
}: EditLabourWelfareFundDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { mutate, isPending } = useEditLabourWelfareFund({
    lwfGroupId,
    options: {
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const { data, isLoading } = useGetLabourWelfareFund({
    lwfGroupId,
  });

  const onEditLabourWelfareFund = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="lg"
      onClose={onClose}
      open={open}
      title="Edit Labour Welfare Fund"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={onEditLabourWelfareFund}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <LabourWelfareFundForm
        type="edit"
        defaultValues={data}
        ref={formRef}
        loading={isLoading}
      />
    </Dialog>
  );
};
