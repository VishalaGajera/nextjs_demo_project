import { Button, Dialog } from "@codezee/sixtify-brahma";
import { useMemo } from "react";
import type { PastWorkEmploymentSchemaFormFieldValues } from "./PastWorkEmploymentForm";
import { PastWorkEmploymentForm } from "./PastWorkEmploymentForm";

import { useGetPastWorkEmployment } from "./hooks/useGetPastWorkEmployment";

type ViewPastWorkEmploymentDialogProps = {
  open: boolean;
  onClose: () => void;
  pastWorkEmploymentId: string;
  employeeId: string;
};

export const ViewPastWorkEmploymentDialog = ({
  pastWorkEmploymentId,
  open,
  onClose,
  employeeId,
}: ViewPastWorkEmploymentDialogProps) => {
  const {
    data: pastWorkEmploymentData,
    isPending: isPendingLatestPastWorkEmployment,
  } = useGetPastWorkEmployment({
    employeeId,
    pastWorkEmploymentId,
  });

  const defaultValues = useMemo(() => {
    if (pastWorkEmploymentData) {
      const pastWorkEmploymentSchemaFormFieldValues: PastWorkEmploymentSchemaFormFieldValues =
        {
          company_name: pastWorkEmploymentData.company_name,
          designation: pastWorkEmploymentData.designation,
          from_date: pastWorkEmploymentData.from_date,
          to_date: pastWorkEmploymentData.to_date,
          address: pastWorkEmploymentData.address,
          leaving_reason: pastWorkEmploymentData.leaving_reason,
        };

      return pastWorkEmploymentSchemaFormFieldValues;
    }
  }, [pastWorkEmploymentData]);

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      title="View Past work Employment"
      actions={
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      }
    >
      <PastWorkEmploymentForm
        defaultValues={defaultValues}
        loading={isPendingLatestPastWorkEmployment}
        disabled
      />
    </Dialog>
  );
};
