import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../utils/errors";
import { EditAction } from "../../../../common/EditAction";
import type { SubDepartment } from "../SubDepartmentList/hooks/useGetSubDepartments";
import { useEditSubDepartment } from "./hooks/useEditSubDepartment";
import { useGetSubDepartment } from "./hooks/useGetSubDepartment";
import { type FormRef, SubDepartmentForm } from "./SubDepartmentForm";

type EditSubDepartmentDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  subDepartmentId: SubDepartment["id"];
};

export const EditSubDepartmentDialog = ({
  subDepartmentId,
  open,
  onClose,
  onEditSuccess,
}: EditSubDepartmentDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: subDepartment, isPending: isPendingSubDepartmentData } =
    useGetSubDepartment({
      subDepartmentId,
    });

  const { mutate, isPending } = useEditSubDepartment({
    subDepartmentId,
    options: {
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const onEditSubDepartment = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title="Edit Sub Department"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={onEditSubDepartment}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <SubDepartmentForm
        ref={formRef}
        departmentId={subDepartmentId}
        defaultValues={subDepartment}
        isLoading={isPendingSubDepartmentData}
      />
    </Dialog>
  );
};
