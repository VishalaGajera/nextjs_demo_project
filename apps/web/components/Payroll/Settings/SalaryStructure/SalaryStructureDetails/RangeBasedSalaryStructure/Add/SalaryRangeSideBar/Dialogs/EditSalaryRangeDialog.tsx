import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { useDisabledButtonsCache } from "../../../../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { editButtonId } from "../../../../../../../../../hooks/useEnableDisableButtonToggle";
import { salaryStructureKeys } from "../../../../../../../../../queryKeysFactories/SalaryStructure";
import { onError } from "../../../../../../../../../utils/errors";
import { type SalaryIntervals } from "../Hooks/useGetSalaryRangeList";
import {
  SalaryRangeForm,
  type SalaryRangeFormRef,
  type SalaryRangeType,
} from "../SalaryRangeForm";
import { useEditSalaryRange } from "./Hooks/useEditSalaryRange";

type EditSalaryRangeDialogProps = {
  open: boolean;
  onClose: () => void;
  interval: SalaryIntervals;
  ssId: string;
  title?: "Add" | "Edit";
};

export const EditSalaryRangeDialog = ({
  open,
  onClose,
  interval,
  ssId,
  title,
}: EditSalaryRangeDialogProps) => {
  const { isDisabled } = useDisabledButtonsCache(editButtonId);

  const formRef = useRef<SalaryRangeFormRef>(null);

  const queryClient = useQueryClient();

  const { mutate, isPending } = useEditSalaryRange({
    interval,
    ssId,
    options: {
      onSuccess: (success) => {
        queryClient.invalidateQueries({
          queryKey: salaryStructureKeys.rangeList(ssId, interval),
        });

        toasts.success({
          title: success.message,
        });

        onClose();
      },
      onError: (error) => {
        onError(error, formRef.current?.setError);
      },
    },
  });

  const onEditClick = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  const cachedData = queryClient.getQueryData<SalaryRangeType[]>(
    salaryStructureKeys.rangeList(ssId, interval)
  );

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      title={`${title} Salary Range`}
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <Button
            loading={isPending}
            disabled={isDisabled()}
            onClick={onEditClick}
          >
            {title}
          </Button>
        </Stack>
      }
    >
      <SalaryRangeForm
        ref={formRef}
        defaultValues={{
          salary_ranges: cachedData?.length
            ? cachedData
            : [
                {
                  from_range: null,
                  to_range: null,
                  action: "add",
                  description: "",
                  id: "",
                },
              ],
        }}
      />
    </Dialog>
  );
};
