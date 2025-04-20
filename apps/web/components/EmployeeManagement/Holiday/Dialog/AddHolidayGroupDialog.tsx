import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack, Typography, useTheme } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { useCallback, useRef, useState } from "react";
import { useDisabledButtonsCache } from "../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../hooks/useEnableDisableButtonToggle";
import { holidayGroupKeys } from "../../../../queryKeysFactories/holiday";
import { onError } from "../../../../utils/errors";
import type { FormRef } from "./HolidayGroupForm";
import { HolidayGroupForm } from "./HolidayGroupForm";
import { useAddHolidaysGroup } from "./hooks/useAddHolidaysGroup";

type AddHolidayGroupDialogProps = {
  open: boolean;
  onClose: () => void;
};

export const AddHolidayGroupDialog = ({
  open,
  onClose,
}: AddHolidayGroupDialogProps) => {
  const formRef = useRef<FormRef | null>(null);

  const queryClient = useQueryClient();

  const theme = useTheme();

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { red } = theme.palette.app.color;

  const [holidaysListLength, setHolidaysListLength] = useState<
    number | undefined
  >();

  const { mutate, isPending } = useAddHolidaysGroup({
    options: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: holidayGroupKeys.listing(),
        });
        toasts.success({ title: data.message });
        onClose();
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const handleSubmit = () => {
    formRef.current?.submitForm((formValues) => {
      const holidaysValues = formValues.selectHolidays || [];

      const selectedHolidays = holidaysValues
        .filter((item) => item.value)
        .map((item) => item.id);

      const payload = {
        year: (formValues.year &&
          DateTime.fromISO(formValues.year).year) as number,
        company_id: formValues.company_id,
        holiday_group_name: formValues.holiday_group_name,
        holidays: selectedHolidays,
      };

      if (selectedHolidays.length === 0) {
        toasts.error({ title: "Please select at least one holiday." });
      } else {
        mutate(payload);
      }
    });
  };

  const setRef = useCallback(
    (node: FormRef | null) => {
      formRef.current = node;
      setHolidaysListLength(node?.holidaysListLength);
    },
    [formRef.current?.holidaysListLength]
  );

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      title="Add Holiday Group"
      actions={
        <Stack direction="row" justifyContent="space-between" width="100%">
          <Stack direction="row" alignItems="center">
            {!holidaysListLength && (
              <Typography
                fontWeight={500}
                variant="body2"
                sx={{ color: red[900] }}
              >
                Could not find any holidays for this year.
              </Typography>
            )}
          </Stack>

          <Stack gap="5px" direction="row" sx={{ alignSelf: "flex-end" }}>
            <Button onClick={onClose} variant="outlined">
              Cancel
            </Button>

            <Button
              onClick={handleSubmit}
              loading={isPending}
              disabled={!holidaysListLength || isDisabled()}
            >
              Save
            </Button>
          </Stack>
        </Stack>
      }
    >
      <HolidayGroupForm ref={setRef} />
    </Dialog>
  );
};
