import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../utils/errors";
import { EditAction } from "../../../../common/EditAction";
import type { SubCaste } from "../SubCasteList/hooks/useGetSubCastes";
import { useEditSubCaste } from "./hooks/useEditSubCaste";
import { useGetSubCaste } from "./hooks/useGetSubCaste";
import type { FormRef } from "./SubCasteForm";
import { SubCasteForm } from "./SubCasteForm";

type EditSubCasteDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  subCasteId: SubCaste["id"];
};

export const EditSubCasteDialog = ({
  subCasteId,
  open,
  onClose,
  onEditSuccess,
}: EditSubCasteDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: latestSubCasteData, isPending: isPendingLatestSubCasteData } =
    useGetSubCaste({
      subCasteId,
    });

  const { mutate, isPending } = useEditSubCaste({
    subCasteId,
    options: {
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const onEditSubCaste = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title="Edit Sub Caste"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={onEditSubCaste}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <SubCasteForm
        ref={formRef}
        defaultValues={latestSubCasteData}
        loading={isPendingLatestSubCasteData}
      />
    </Dialog>
  );
};
