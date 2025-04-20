import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useMemo, useRef } from "react";
import { onError } from "../../../../../../../../utils/errors";
import type {
  FormRef,
  PastWorkEmploymentSchemaFormFieldValues,
} from "./PastWorkEmploymentForm";
import { PastWorkEmploymentForm } from "./PastWorkEmploymentForm";

import { useDisabledButtonsCache } from "../../../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../../../hooks/useEnableDisableButtonToggle";
import { EditAction } from "../../../../../../../common/EditAction";
import { useEditPastWorkEmployment } from "./hooks/useEditPastWorkEmployment";
import { useGetPastWorkEmployment } from "./hooks/useGetPastWorkEmployment";

type EditPastWorkEmploymentDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  pastWorkEmploymentId: string;
  employeeId: string;
};

export const EditPastWorkEmploymentDialog = ({
  pastWorkEmploymentId,
  open,
  onEditSuccess,
  onClose,
  employeeId,
}: EditPastWorkEmploymentDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const {
    data: pastWorkEmploymentData,
    isPending: isPendingLatestPastWorkEmployment,
  } = useGetPastWorkEmployment({
    employeeId,
    pastWorkEmploymentId,
  });

  const { mutate, isPending } = useEditPastWorkEmployment({
    employeeId,
    pastWorkEmploymentId,
    options: {
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const onEditPastWorkEmployment = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  const defaultValues = useMemo(() => {
    if (pastWorkEmploymentData) {
      const pastWorkEmploymentSchemaFormFieldValues: PastWorkEmploymentSchemaFormFieldValues =
        {
          company_name: pastWorkEmploymentData.company_name,
          designation: pastWorkEmploymentData.designation,
          from_date: pastWorkEmploymentData.from_date,
          to_date: pastWorkEmploymentData.to_date,
          address: pastWorkEmploymentData.address,
          leaving_reason: pastWorkEmploymentData.leaving_reason,
        };

      return pastWorkEmploymentSchemaFormFieldValues;
    }
  }, [pastWorkEmploymentData]);

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      title="Edit Past work Employment"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={onEditPastWorkEmployment}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <PastWorkEmploymentForm
        defaultValues={defaultValues}
        ref={formRef}
        loading={isPendingLatestPastWorkEmployment}
      />
    </Dialog>
  );
};
