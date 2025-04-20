import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../../../utils/errors";
import { EditAction } from "../../../../../../common/EditAction";
import type { FormRef } from "./DirectorDetailsForm";
import { DirectorDetailForm } from "./DirectorDetailsForm";
import { useEditDirectorDetail } from "./hooks/useEditDirectorDetails";
import { useGetDirectorDetail } from "./hooks/useGetDirectorDetail";

type EditDirectorDetailDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  directorDetailId: string;
  companyId: string;
};
export const EditDirectorDetailDialog = ({
  directorDetailId,
  companyId,
  open,
  onClose,
  onEditSuccess,
}: EditDirectorDetailDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: latestDirectorData, isPending: isPendingDirectorData } =
    useGetDirectorDetail({
      companyId,
      directorDetailId,
    });

  const { mutate, isPending } = useEditDirectorDetail({
    companyId,
    directorDetailId,
    options: {
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const onEditDirectorDetail = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      title="Edit Director"
      actions={
        <Stack direction="row" gap="5px">
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>

          <EditAction
            onClick={onEditDirectorDetail}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <DirectorDetailForm
        ref={formRef}
        defaultValues={latestDirectorData}
        loading={isPendingDirectorData}
      />
    </Dialog>
  );
};
