import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useMemo, useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../../../../utils/errors";
import { MALE } from "../../../../../../common/Autocomplete/hooks/constant";
import { EditAction } from "../../../../../../common/EditAction";
import {
  FamilyDetailsForm,
  type FamilyDetailsFormFieldValues,
  type FormRef,
} from "./FamilyDetailsForm";
import { useEditFamilyDetails } from "./hooks/useEditFamilyDetails";
import { useGetFamilyDetails } from "./hooks/useGetFamilyDetails";

type EditFamilyDetailsDialogProps = {
  onClose: () => void;
  open: boolean;
  familyId: string;
  employeeId: string;
  onEditSuccess: () => void;
};

export const EditFamilyDetailsDialog = ({
  onClose,
  open,
  familyId,
  employeeId,
  onEditSuccess,
}: EditFamilyDetailsDialogProps) => {
  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: familyDetails, isPending: isFamilyDetailsDataLoading } =
    useGetFamilyDetails({ employeeId, familyId });

  const defaultValues = useMemo(() => {
    if (familyDetails) {
      const familyDetailsFormFieldValues: FamilyDetailsFormFieldValues = {
        name: familyDetails.name,
        date_of_birth: familyDetails.date_of_birth,
        relation: familyDetails.relation ?? "brother",
        profession: familyDetails.profession,
        gender: familyDetails.gender ?? MALE,
        address: familyDetails.address,
        nationality: familyDetails.nationality ?? "indian",
        blood_group: familyDetails.blood_group,
      };

      return familyDetailsFormFieldValues;
    }
  }, [familyDetails]);

  const { mutate, isPending } = useEditFamilyDetails({
    employeeId,
    familyDetailsId: familyId,
    options: {
      onSuccess: (data) => {
        onEditSuccess();
        onClose();
        toasts.success({ title: data.message });
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const editFamilyDetails = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      title="Edit Family Details"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={editFamilyDetails}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      }
    >
      <FamilyDetailsForm
        ref={formRef}
        defaultValues={defaultValues}
        loading={isFamilyDetailsDataLoading}
      />
    </Dialog>
  );
};
