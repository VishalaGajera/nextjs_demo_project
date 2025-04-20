import { Button, Dialog } from "@codezee/sixtify-brahma";
import { useMemo } from "react";
import { MALE } from "../../../../../../common/Autocomplete/hooks/constant";
import {
  FamilyDetailsForm,
  type FamilyDetailsFormFieldValues,
} from "./FamilyDetailsForm";
import { useGetFamilyDetails } from "./hooks/useGetFamilyDetails";

type ViewFamilyDetailsDialogProps = {
  onClose: () => void;
  open: boolean;
  familyId: string;
  employeeId: string;
};

export const ViewFamilyDetailsDialog = ({
  onClose,
  open,
  familyId,
  employeeId,
}: ViewFamilyDetailsDialogProps) => {
  const { data: familyDetails, isPending: isFamilyDetailsDataLoading } =
    useGetFamilyDetails({ employeeId, familyId });

  const defaultValues = useMemo(() => {
    if (familyDetails) {
      const {
        name,
        date_of_birth,
        relation,
        profession,
        gender,
        address,
        nationality,
        blood_group,
      } = familyDetails;

      const familyDetailsFormFieldValues: FamilyDetailsFormFieldValues = {
        name,
        date_of_birth,
        relation: relation ?? "brother",
        profession,
        gender: gender ?? MALE,
        address,
        nationality: nationality ?? "indian",
        blood_group,
      };

      return familyDetailsFormFieldValues;
    }
  }, [familyDetails]);

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      title="View Family Details"
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <FamilyDetailsForm
        defaultValues={defaultValues}
        loading={isFamilyDetailsDataLoading}
        disabled
      />
    </Dialog>
  );
};
