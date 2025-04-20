import { Button, Dialog, toasts } from "@codezee/sixtify-brahma";
import { Stack, Typography, useTheme } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { useCallback, useRef, useState } from "react";
import { bankHolidayYearKeys } from "../../../../../queryKeysFactories/bankHolidayGroup";
import { onError } from "../../../../../utils/errors";
import type { FormRef } from "./AddBankHolidayYearFrom";
import { AddBankHolidayYearForm } from "./AddBankHolidayYearFrom";
import { useAddBankHolidayYear } from "./hooks/useAddBankHolidayYear";

type AddBankHolidayYearDialogProps = {
  open: boolean;
  onClose: () => void;
  companyId: string;
};

export const AddBankHolidayYearDialog = ({
  open,
  onClose,
  companyId,
}: AddBankHolidayYearDialogProps) => {
  const formRef = useRef<FormRef | null>(null);

  const [bankHolidaysListLength, setBankHolidaysListLength] = useState(0);

  const theme = useTheme();

  const { red } = theme.palette.app.color;

  const queryClient = useQueryClient();

  const { mutate, isPending } = useAddBankHolidayYear({
    companyId,
    options: {
      onSuccess: (data) => {
        queryClient.invalidateQueries({
          queryKey: bankHolidayYearKeys.listing({ companyId }),
        });
        toasts.success({ title: data.message });
        onClose();
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const handleSubmit = () => {
    formRef.current?.submitForm((formValues) => {
      const bankHolidaysValues = formValues.selectBankHolidays || [];

      const selectedBankHolidays = bankHolidaysValues
        .filter((item) => item.value)
        .map((item) => item.id);

      const payload = {
        year: (formValues.year &&
          DateTime.fromISO(formValues.year).year) as number,
        holidays: selectedBankHolidays,
      };

      if (selectedBankHolidays.length === 0) {
        toasts.error({ title: "Please select at least one bank holiday." });
      } else {
        mutate(payload);
      }
    });
  };

  const setRef = useCallback(
    (node: FormRef | null) => {
      formRef.current = node;
      setBankHolidaysListLength(formRef.current?.bankHolidaysListLength ?? 0);
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
            {isPending && bankHolidaysListLength === 0 && (
              <Typography
                fontWeight={500}
                variant="body2"
                sx={{ color: red[900] }}
              >
                Could not find any bank holidays for this year.
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
              disabled={bankHolidaysListLength === 0}
            >
              Save
            </Button>
          </Stack>
        </Stack>
      }
    >
      <AddBankHolidayYearForm ref={setRef} companyId={companyId} />
    </Dialog>
  );
};
