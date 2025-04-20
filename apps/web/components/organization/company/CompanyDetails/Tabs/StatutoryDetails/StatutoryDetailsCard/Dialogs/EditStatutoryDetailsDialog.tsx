import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../../../../utils/errors";
import { EditAction } from "../../../../../../../common/EditAction";
import { useGetStatutoryDetails } from "../hooks/useGetStatutoryDetails";
import type { FormRef } from "./StatutoryDetailsForm";
import { StatutoryDetailsForm } from "./StatutoryDetailsForm";
import { useEditStatutoryDetails } from "./hooks/useEditStatutoryDetails";

type EditStatutoryDetailsDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  companyId: string;
};
export const EditStatutoryDetailsDialog = ({
  companyId,
  open,
  onClose,
  onEditSuccess,
}: EditStatutoryDetailsDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: latestStatutoryData, isPending: isPendingStatutoryData } =
    useGetStatutoryDetails({
      companyId,
    });

  const { mutate, isPending } = useEditStatutoryDetails({
    companyId,
    options: {
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const onEditStatutoryDetails = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="lg"
      onClose={onClose}
      open={open}
      title="Edit Statutory Details"
      actions={
        <Stack direction="row" gap="5px">
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <EditAction
            onClick={onEditStatutoryDetails}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <StatutoryDetailsForm
        ref={formRef}
        defaultValues={latestStatutoryData}
        loading={isPendingStatutoryData}
      />
    </Dialog>
  );
};
