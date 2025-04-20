import { Button, Dialog } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import type { PageTypes } from "../../../../TypeBasedSalaryStructureBreadCrumbs";
import { SalaryStructureComponentList } from "../SalaryStructureComponentList/SalaryStructureComponentList";

type AddSalaryStructureComponentDialogProps = {
  open: boolean;
  onClose: () => void;
  salaryRange?: string;
  savedSalaryComponent: string[];
  formType?: string;
  pageType?: PageTypes;
  onAddSalaryStructureComponent: () => void;
};

export const AddSalaryStructureComponentDialog = ({
  open,
  onClose,
  salaryRange,
  savedSalaryComponent,
  formType,
  pageType = "Add",
  onAddSalaryStructureComponent,
}: AddSalaryStructureComponentDialogProps) => {
  const salaryStructureButtonLabel =
    pageType === "Edit" || formType === "range" ? "Update" : "Save";

  return (
    <Dialog
      maxWidth="xl"
      onClose={onClose}
      open={open}
      title={
        formType === "range"
          ? `Edit Component For ${salaryRange}`
          : `${pageType} Component`
      }
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <Button onClick={onAddSalaryStructureComponent}>
            {salaryStructureButtonLabel}
          </Button>
        </Stack>
      }
    >
      <SalaryStructureComponentList
        savedSalaryComponent={savedSalaryComponent}
      />
    </Dialog>
  );
};
