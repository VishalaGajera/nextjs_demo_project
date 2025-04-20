import { CheckBox } from "@codezee/sixtify-brahma";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  InputLabel,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { GenderAutocomplete } from "../../../../common/Autocomplete/GenderAutoComplete";
import { LeaveReasonAutocomplete } from "../../../../common/Autocomplete/LeaveReasonAutocomplete";
import { MaritalStatusAutocomplete } from "../../../../common/Autocomplete/MaritalStatusAutocomplete";
import type { LeaveTypeFormFieldValues } from "./LeaveTypeForm";

type OtherSettingsProps = {
  loading?: boolean;
  disabled?: boolean;
};

export const OtherSettings = ({
  loading = false,
  disabled = false,
}: OtherSettingsProps) => {
  const { t } = useTranslation();

  const {
    clearErrors,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useFormContext<LeaveTypeFormFieldValues>();

  const errorMessages = (messageKey?: string) => messageKey && t(messageKey);

  const isApplicableToGender = watch("isApplicableToGender");

  const isApplicableToMaritalStatus = watch("isApplicableToMaritalStatus");

  const isApplicableToLeaveReason = watch("isApplicableToLeaveReason");

  const GenderValue = watch("applicable_to_gender");

  const MaritalValue = watch("applicable_to_marital_status");

  const LeaveReasonValue = watch("leave_reasons");

  useEffect(() => {
    if (isApplicableToGender === false) {
      clearErrors("applicable_to_gender");
      setValue("applicable_to_gender", null, {
        shouldDirty: true,
      });
    } else if (GenderValue) {
      setValue("isApplicableToGender", true);
    }

    if (isApplicableToMaritalStatus === false) {
      clearErrors("applicable_to_marital_status");
      setValue("applicable_to_marital_status", null, {
        shouldDirty: true,
      });
    } else if (MaritalValue) {
      setValue("isApplicableToMaritalStatus", true);
    }

    if (isApplicableToLeaveReason === false) {
      clearErrors("leave_reasons");
      setValue("leave_reasons", null, {
        shouldDirty: true,
      });
    } else if (LeaveReasonValue) {
      setValue("isApplicableToLeaveReason", true);
    }
  }, [
    isApplicableToGender,
    isApplicableToMaritalStatus,
    isApplicableToLeaveReason,
    GenderValue,
    MaritalValue,
    LeaveReasonValue,
    setValue,
  ]);

  const [expanded, setExpanded] = useState(false);

  const handleAccordionToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <Accordion
      expanded={expanded}
      onChange={handleAccordionToggle}
      sx={{
        boxShadow: "none",
        "&:before": { display: "none" },
      }}
    >
      <AccordionSummary expandIcon={false} sx={{ padding: "0px" }}>
        {expanded ? (
          <ExpandLessIcon fontSize="medium" sx={{ marginRight: "5px" }} />
        ) : (
          <ExpandMoreIcon fontSize="medium" sx={{ marginRight: "5px" }} />
        )}
        <Typography variant="body1">Other Settings</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ padding: "0px 20px" }}>
        <Stack gap="10px">
          <Stack direction="row" gap="10px" alignItems="center">
            <CheckBox
              name="isApplicableToGender"
              size="small"
              disabled={disabled}
              control={control}
              loading={loading}
            />
            <InputLabel
              sx={{ display: "flex", alignItems: "center", border: "none" }}
            >
              <Typography variant="body1">
                Leave Type Applicable For Specific Gender
              </Typography>
            </InputLabel>
            <Box sx={{ width: "250px" }}>
              <GenderAutocomplete
                name="applicable_to_gender"
                hideLabel
                fullWidth
                control={control}
                loading={loading}
                error={!!errors.applicable_to_gender}
                helperText={errorMessages(errors.applicable_to_gender?.message)}
                disabled={!isApplicableToGender || disabled}
              />
            </Box>
          </Stack>

          <Stack direction="row" gap="10px" alignItems="center">
            <CheckBox
              name="isApplicableToMaritalStatus"
              size="small"
              disabled={disabled}
              control={control}
              loading={loading}
            />
            <InputLabel
              sx={{ display: "flex", alignItems: "center", border: "none" }}
            >
              <Typography variant="body1">
                Leave Type Applicable For Marital Status
              </Typography>
            </InputLabel>
            <Box sx={{ width: "250px" }}>
              <MaritalStatusAutocomplete
                name="applicable_to_marital_status"
                fullWidth
                hideLabel
                control={control}
                loading={loading}
                error={!!errors.applicable_to_marital_status}
                helperText={errorMessages(
                  errors.applicable_to_marital_status?.message
                )}
                disabled={!isApplicableToMaritalStatus || disabled}
              />
            </Box>
          </Stack>
          <Stack direction="row" gap="10px" alignItems="center">
            <CheckBox
              name="isApplicableToLeaveReason"
              size="small"
              control={control}
              disabled={disabled}
              loading={loading}
            />
            <InputLabel
              sx={{ display: "flex", alignItems: "center", border: "none" }}
            >
              <Typography variant="body1">Leave Type Reason</Typography>
            </InputLabel>
            <Box sx={{ width: "75%" }}>
              <LeaveReasonAutocomplete
                name="leave_reasons"
                multiple
                control={control}
                freeSolo
                loading={loading}
                disabled={!isApplicableToLeaveReason || disabled}
                error={!!errors.leave_reasons}
                helperText={errorMessages(errors.leave_reasons?.message)}
              />
            </Box>
          </Stack>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
};
