import { TextField } from "@codezee/sixtify-brahma";
import { Box, Stack, Typography } from "@mui/material";
import { t } from "i18next";
import { useFormContext } from "react-hook-form";
import type { ConfigureLeaveFormFieldValues } from "../../ConfigureLeaveForm";

type DocumentRequiredRadioOptions = {
  disabled?: boolean;
};
export function useGetDocumentRequiredRadioOptions({
  disabled = false,
}: DocumentRequiredRadioOptions) {
  const {
    control,
    formState: { errors },
    watch,
  } = useFormContext<ConfigureLeaveFormFieldValues>();

  const { document_required_after_days } =
    errors.leave_application_and_usage ?? {};

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  const isDocumentRequired = watch(
    "leave_application_and_usage.is_document_required"
  );

  const documentRequiredRadioOptions = [
    {
      label: (
        <Box>
          <Typography variant="body1" paddingTop="9px">
            No, do not require a Document Proof attachment for a leave.
          </Typography>
        </Box>
      ),
      values: false,
      disabled,
    },
    {
      label: (
        <Stack gap="10px" alignItems="baseline" direction="row">
          <Typography variant="body1">
            Yes, Require a Document Proof if the leave days exceeds
          </Typography>

          <TextField
            sx={{ maxWidth: "150px" }}
            type="number"
            name="leave_application_and_usage.document_required_after_days"
            control={control}
            label=""
            disabled={!isDocumentRequired || disabled}
            error={!!document_required_after_days}
            helperText={errorMessages(document_required_after_days?.message)}
          />

          <Typography variant="body1">Calender days.</Typography>
        </Stack>
      ),
      values: true,
      disabled,
    },
  ];

  return { documentRequiredRadioOptions };
}
