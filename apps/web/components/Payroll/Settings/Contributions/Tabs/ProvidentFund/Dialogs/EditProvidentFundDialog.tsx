import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../../../utils/errors";
import { EditAction } from "../../../../../../common/EditAction";
import { useEditProvidentFund } from "./hooks/useEditProvidentFund";
import { useGetProvidentFund } from "./hooks/useGetProvidentFund";
import type { FormRef } from "./ProvidentFundForm";
import { ProvidentFundForm } from "./ProvidentFundForm";

type EditProvidentFundDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  providentFundId: string;
};

export const EditProvidentFundDialog = ({
  providentFundId,
  open,
  onEditSuccess,
  onClose,
}: EditProvidentFundDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: providentFundData, isPending: isPendingProvidentFundData } =
    useGetProvidentFund({
      providentFundId,
    });

  const { mutate, isPending } = useEditProvidentFund({
    providentFundId,
    options: {
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const onEditProvidentFund = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="lg"
      onClose={onClose}
      open={open}
      title="Edit Provident Fund"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={onEditProvidentFund}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <ProvidentFundForm
        ref={formRef}
        defaultValues={providentFundData}
        loading={isPendingProvidentFundData}
        dialogType="edit"
      />
    </Dialog>
  );
};
