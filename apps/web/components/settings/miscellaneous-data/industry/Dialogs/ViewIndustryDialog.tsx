import { Button, Dialog } from "@codezee/sixtify-brahma";
import type { Industry } from "../IndustryList/hooks/useGetIndustries";
import { IndustryForm } from "./IndustryForm";
import { useGetIndustry } from "./hooks/useGetIndustry";

type ViewIndustryDialogProps = {
  open: boolean;
  onClose: () => void;
  industryId: Industry["id"];
};

export const ViewIndustryDialog = ({
  industryId,
  open,
  onClose,
}: ViewIndustryDialogProps) => {
  const { data: industry, isPending: isPendingLatestIndustryData } =
    useGetIndustry({
      industryId,
    });

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title="View Industry"
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <IndustryForm
        defaultValues={industry}
        loading={isPendingLatestIndustryData}
        disabled
      />
    </Dialog>
  );
};
