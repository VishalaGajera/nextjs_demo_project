import { Button, Dialog } from "@codezee/sixtify-brahma";
import { TaxSectionsForm } from "./TaxSectionsForm";
import { useGetTaxSections } from "./hooks/useGetTaxSections";

type ViewTaxSectionsDialogProps = {
  open: boolean;
  onClose: () => void;
  taxSectionsId: string;
};

export const ViewTaxSectionsDialog = ({
  open,
  onClose,
  taxSectionsId,
}: ViewTaxSectionsDialogProps) => {
  const { data: taxSectionsData, isPending: isPendingTaxSectionsData } =
    useGetTaxSections({ taxSectionsId });

  return (
    <Dialog
      title="View Tax Sections"
      maxWidth="md"
      open={open}
      onClose={onClose}
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <TaxSectionsForm
        defaultValues={taxSectionsData}
        loading={isPendingTaxSectionsData}
        disabled
      />
    </Dialog>
  );
};
