import { Button, Dialog } from "@codezee/sixtify-brahma";
import { EducationForm } from "./EducationForm";
import { useGetEducation } from "./hooks/useGetEducation";

type ViewEducationDialogProps = {
  open: boolean;
  employeeId: string;
  onClose: () => void;
  educationDetailId: string;
};
export const ViewEducationDialog = ({
  educationDetailId,
  open,
  employeeId,
  onClose,
}: ViewEducationDialogProps) => {
  const { data: latestCompanyData, isPending: isPendingLatestCompanyData } =
    useGetEducation({
      employeeId,
      educationDetailId,
    });

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      title="View Education"
      actions={
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
      }
    >
      <EducationForm
        defaultValues={latestCompanyData}
        loading={isPendingLatestCompanyData}
        disabled
      />
    </Dialog>
  );
};
