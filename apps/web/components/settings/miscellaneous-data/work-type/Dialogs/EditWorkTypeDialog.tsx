import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../utils/errors";
import { EditAction } from "../../../../common/EditAction";
import type { WorkType } from "../WorkTypeList/hooks/useGetWorkTypes";
import { useEditWorkType } from "./hooks/useEditWorkType";
import { useGetWorkType } from "./hooks/useGetWorkType";
import { type FormRef, WorkTypeForm } from "./WorkTypeForm";

type EditWorkTypeDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  workTypeId: WorkType["id"];
};

export const EditWorkTypeDialog = ({
  workTypeId,
  open,
  onClose,
  onEditSuccess,
}: EditWorkTypeDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: workType, isPending: isPendingWorkTypeData } = useGetWorkType({
    workTypeId,
  });

  const { mutate, isPending } = useEditWorkType({
    workTypeId,
    options: {
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const onEditWorkType = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title="Edit Work Type"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={onEditWorkType}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <WorkTypeForm
        ref={formRef}
        defaultValues={workType}
        loading={isPendingWorkTypeData}
      />
    </Dialog>
  );
};
