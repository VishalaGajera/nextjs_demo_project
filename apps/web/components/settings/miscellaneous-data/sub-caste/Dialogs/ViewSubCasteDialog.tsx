import { Button, Dialog } from "@codezee/sixtify-brahma";
import type { SubCaste } from "../SubCasteList/hooks/useGetSubCastes";
import { useGetSubCaste } from "./hooks/useGetSubCaste";
import { SubCasteForm } from "./SubCasteForm";

type ViewSubCasteDialogProps = {
  open: boolean;
  onClose: () => void;
  subCasteId: SubCaste["id"];
};

export const ViewSubCasteDialog = ({
  subCasteId,
  open,
  onClose,
}: ViewSubCasteDialogProps) => {
  const { data: latestSubCasteData, isPending: isPendingLatestSubCasteData } =
    useGetSubCaste({
      subCasteId,
    });

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title="View Sub Caste"
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <SubCasteForm
        defaultValues={latestSubCasteData}
        loading={isPendingLatestSubCasteData}
        disabled
      />
    </Dialog>
  );
};
