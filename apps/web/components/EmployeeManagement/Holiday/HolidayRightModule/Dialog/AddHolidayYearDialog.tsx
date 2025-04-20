import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack, Typography, useTheme } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { useCallback, useRef, useState } from "react";
import { holidayYearKeys } from "../../../../../queryKeysFactories/holiday";
import { onError } from "../../../../../utils/errors";
import { AddHolidayYearForm, type FormRef } from "./AddHolidayYearFrom";
import { useAddHolidayYear } from "./hooks/useAddHolidayYear";

type AddHolidayDialogProps = {
  open: boolean;
  onClose: () => void;
  holidayGroupId: string;
};

export const AddHolidayYearDialog = ({
  open,
  onClose,
  holidayGroupId,
}: AddHolidayDialogProps) => {
  const formRef = useRef<FormRef | null>(null);

  const [holidaysListLength, setHolidaysListLength] = useState(0);

  const theme = useTheme();

  const { red } = theme.palette.app.color;

  const queryClient = useQueryClient();

  const { mutate, isPending } = useAddHolidayYear({
    holidayGroupId,
    options: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: holidayYearKeys.listing({ holidayGroupId }),
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
      setHolidaysListLength(formRef.current?.holidaysListLength ?? 0);
    },
    [formRef.current]
  );

  return (
    <Dialog
      maxWidth="md"
      onClose={onClose}
      open={open}
      title="Add Year"
      actions={
        <Stack direction="row" justifyContent="space-between" width="100%">
          <Stack direction="row" alignItems="center">
            {holidaysListLength === 0 && (
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
              disabled={holidaysListLength === 0}
            >
              Save
            </Button>
          </Stack>
        </Stack>
      }
    >
      <AddHolidayYearForm ref={setRef} holidayGroupId={holidayGroupId} />
    </Dialog>
  );
};
