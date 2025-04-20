import { Button, Dialog } from "@codezee/sixtify-brahma";
import { SalaryComponentForm } from "../../SalaryComponentForm";
import { useGetContribution } from "./hooks/useGetContribution";

type ViewContributionDialogProps = {
  open: boolean;
  onClose: () => void;
  contributionId: string;
};

export const ViewContributionDialog = ({
  open,
  onClose,
  contributionId,
}: ViewContributionDialogProps) => {
  const { data: contributionData, isPending: isPendingContributionData } =
    useGetContribution({
      contributionId,
    });

  return (
    <Dialog
      title="View Contribution"
      maxWidth="md"
      open={open}
      onClose={onClose}
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <SalaryComponentForm
        defaultValues={contributionData}
        loading={isPendingContributionData}
        dialogType="view"
        type="contribution"
      />
    </Dialog>
  );
};
