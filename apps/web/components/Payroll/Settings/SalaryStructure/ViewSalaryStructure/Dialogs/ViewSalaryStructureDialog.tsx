import { Button, Dialog } from "@codezee/sixtify-brahma";
import { useRef } from "react";
import {
  SalaryStructureForm,
  type FormRef,
} from "../../AddSalaryStructure/SalaryStructureForm";
import { useGetSalaryStructureById } from "../../EditSalaryStructure/Dialogs/Hooks/useGetSalaryStructureById";

type ViewSalaryStructureDialogProps = {
  open: boolean;
  onClose: () => void;
  ssId: string;
};

export const ViewSalaryStructureDialog = ({
  onClose,
  open,
  ssId,
}: ViewSalaryStructureDialogProps) => {
  const salaryStructureFormRef = useRef<FormRef>(null);

  const { data, isLoading } = useGetSalaryStructureById({ ssId });

  return (
    <Dialog
      title="View Salary Structure"
      maxWidth="md"
      open={open}
      onClose={onClose}
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <SalaryStructureForm
        loading={isLoading}
        formType="view"
        ref={salaryStructureFormRef}
        defaultValues={data}
      />
    </Dialog>
  );
};
