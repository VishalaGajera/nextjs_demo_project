import {
  CheckBox,
  DatePicker,
  FormGridLayout,
  FormRow,
  PadBox,
  TextField,
} from "@codezee/sixtify-brahma";
import { Box, Stack, Typography, useTheme } from "@mui/material";
import { t } from "i18next";
import type { Control, FieldErrors, UseFormWatch } from "react-hook-form";
import { EPFGroupAutocomplete } from "../../../../../../../../common/Autocomplete/EPFGroupAutocomplete";
import { ESICGroupAutocomplete } from "../../../../../../../../common/Autocomplete/ESICGroupAutocomplete";
import { TaxRegimeAutoComplete } from "../../../../../../../../common/Autocomplete/TaxRegimeAutoComplete";
import type { SalarySetupSchemaType } from "./AddSalarySetupForm";

type StatutoryDetailsProps = {
  control: Control<SalarySetupSchemaType>;
  errors: FieldErrors<SalarySetupSchemaType>;
  watch: UseFormWatch<SalarySetupSchemaType>;
};

export const StatutoryDetails = ({
  control,
  watch,
  errors,
}: StatutoryDetailsProps) => {
  const theme = useTheme();

  const { slate, mirage, butterflyBlue } = theme.palette.app.color;

  const errorMessage = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  const {
    epf_group_id,
    esic_group_id,
    esic_joining_date,
    esic_no,
    pf_account_no,
    pf_joining_date,
    tax_regime_id,
    uan_no,
  } = errors.statutory_details ?? {};

  return (
    <Box border={`1px solid ${butterflyBlue[300]}`} borderRadius="4px">
      <PadBox padding={{ padding: "24px 30px" }}>
        <Stack gap="24px">
          <Typography variant="h6" color={mirage[900]} fontWeight={500}>
            Statutory Details
          </Typography>

          <Stack alignItems="center" flexDirection="row" gap="10px">
            <CheckBox
              name="statutory_details.pf_applicable"
              control={control}
            />

            <Typography variant="body2" color={slate[900]} fontWeight={500}>
              PF Applicable
            </Typography>
          </Stack>

          {watch("statutory_details.pf_applicable") && (
            <FormGridLayout columns={3}>
              <EPFGroupAutocomplete
                name="statutory_details.epf_group_id"
                control={control}
                required
                error={!!epf_group_id?.message}
                helperText={errorMessage(epf_group_id?.message)}
              />

              <TextField
                control={control}
                name="statutory_details.pf_account_no"
                label="PF Number"
                required
                placeholder="Enter PF Number"
                error={!!pf_account_no?.message}
                helperText={errorMessage(pf_account_no?.message)}
              />

              <DatePicker
                label="PF Join Date"
                control={control}
                required
                name="statutory_details.pf_joining_date"
                error={!!pf_joining_date?.message}
                helperText={errorMessage(pf_joining_date?.message)}
              />

              <TextField
                control={control}
                name="statutory_details.uan_no"
                error={!!uan_no?.message}
                helperText={errorMessage(uan_no?.message)}
                required
                label="UAN Number"
                placeholder="Enter PF Number"
              />
            </FormGridLayout>
          )}

          <Stack alignItems="center" flexDirection="row" gap="10px">
            <CheckBox
              name="statutory_details.esic_applicable"
              control={control}
            />

            <Typography variant="body2" color={slate[900]} fontWeight={500}>
              ESIC Applicable
            </Typography>
          </Stack>

          {watch("statutory_details.esic_applicable") && (
            <FormRow maxColumn={3}>
              <ESICGroupAutocomplete
                name="statutory_details.esic_group_id"
                control={control}
                required
                error={!!esic_group_id?.message}
                helperText={errorMessage(esic_group_id?.message)}
              />

              <TextField
                control={control}
                name="statutory_details.esic_no"
                label="ESIC Number"
                required
                error={!!esic_no?.message}
                helperText={errorMessage(esic_no?.message)}
                placeholder="Enter ESIC Number"
              />

              <DatePicker
                control={control}
                name="statutory_details.esic_joining_date"
                label="ESIC Join Date"
                required
                error={!!esic_joining_date?.message}
                helperText={errorMessage(esic_joining_date?.message)}
              />
            </FormRow>
          )}

          <Stack alignItems="center" flexDirection="row" gap="10px">
            <CheckBox
              name="statutory_details.tds_applicable"
              control={control}
            />

            <Typography variant="body2" color={slate[900]} fontWeight={500}>
              TDS Applicable
            </Typography>
          </Stack>

          {watch("statutory_details.tds_applicable") && (
            <FormRow>
              <TaxRegimeAutoComplete
                name="statutory_details.tax_regime_id"
                control={control}
                required
                error={!!tax_regime_id?.message}
                helperText={errorMessage(tax_regime_id?.message)}
              />
            </FormRow>
          )}

          <Stack alignItems="center" flexDirection="row" gap="10px">
            <CheckBox
              name="statutory_details.pt_applicable"
              control={control}
            />

            <Typography variant="body2" color={slate[900]} fontWeight={500}>
              PT Applicable
            </Typography>
          </Stack>

          <Stack alignItems="center" flexDirection="row" gap="10px">
            <CheckBox
              name="statutory_details.lwf_applicable"
              control={control}
            />

            <Typography variant="body2" color={slate[900]} fontWeight={500}>
              LWF Applicable
            </Typography>
          </Stack>
        </Stack>
      </PadBox>
    </Box>
  );
};
