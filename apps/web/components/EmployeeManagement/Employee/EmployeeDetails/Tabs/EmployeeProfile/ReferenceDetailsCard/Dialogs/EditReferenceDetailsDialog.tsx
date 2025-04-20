import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../../../../utils/errors";
import { EditAction } from "../../../../../../../common/EditAction";
import { useGetReferenceDetails } from "../hooks/useGetReferenceDetails";
import type {
  FormRef,
  ReferenceDetailsFormFieldValues,
} from "../ReferenceDetailsForm";
import { ReferenceDetailsForm } from "../ReferenceDetailsForm";
import { useEditReferenceDetails } from "./hooks/useEditReferenceDetails";

type EditReferenceDetailsDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: () => void;
  employeeId: string;
};

export const EditReferenceDetailsDialog = ({
  employeeId,
  open,
  onClose,
  onEditSuccess,
}: EditReferenceDetailsDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const {
    data: latesReferenceDetailsData,
    isPending: isPendingLatestReferenceDetailsData,
  } = useGetReferenceDetails({
    employeeId,
  });

  const { mutate, isPending } = useEditReferenceDetails({
    employeeId,
    options: {
      onSuccess: (data) => {
        onClose();
        onEditSuccess();
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const onEditReferenceDetails = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  const defaultValues = useMemo(() => {
    if (!latesReferenceDetailsData) {
      return;
    }

    const { first, second } = latesReferenceDetailsData || {};

    const referenceDetailsFormFieldValues: ReferenceDetailsFormFieldValues = {
      first: {
        reference_employee_id: first.reference_employee_id
          ? first.reference_employee_id
          : first.reference_name,
        reference_type: first.reference_type,
        reference_name: first.reference_employee_id
          ? null
          : first.reference_name,
        reference_mobile_no: first.reference_mobile_no,
        reference_address: first.reference_address,
      },
      second: {
        reference_employee_id: second?.reference_employee_id
          ? second?.reference_employee_id
          : second?.reference_name,
        reference_type: second?.reference_type,
        reference_name: second?.reference_employee_id
          ? null
          : second?.reference_name,
        reference_mobile_no: second?.reference_mobile_no,
        reference_address: second?.reference_address,
      },
    };

    return referenceDetailsFormFieldValues;
  }, [latesReferenceDetailsData]);

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      title="Edit Reference Details"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={onEditReferenceDetails}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <ReferenceDetailsForm
        companyId={latesReferenceDetailsData?.first.company_id ?? ""}
        ref={formRef}
        defaultValues={defaultValues}
        loading={isPendingLatestReferenceDetailsData}
      />
    </Dialog>
  );
};
