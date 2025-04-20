import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../../utils/errors";
import { EditAction } from "../../../../../common/EditAction";
import {
  type FormRef,
  type SalaryComponent,
  SalaryComponentForm,
} from "../../SalaryComponentForm";
import { useEditContribution } from "./hooks/useEditContribution";
import { useGetContribution } from "./hooks/useGetContribution";

type EditContributionDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  contributionId: SalaryComponent["id"];
};

export const EditContributionDialog = ({
  contributionId,
  open,
  onEditSuccess,
  onClose,
}: EditContributionDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: contribution, isPending: isPendingLatestContributionData } =
    useGetContribution({
      contributionId,
    });

  const { mutate, isPending } = useEditContribution({
    contributionId,
    options: {
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const onEditContribution = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      title="Edit Contribution"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={onEditContribution}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <SalaryComponentForm
        ref={formRef}
        defaultValues={contribution}
        loading={isPendingLatestContributionData}
        type="contribution"
        dialogType="edit"
      />
    </Dialog>
  );
};
