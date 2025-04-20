import { Button, DeleteAction, TextField } from "@codezee/sixtify-brahma";
import { Add } from "@mui/icons-material";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { t } from "i18next";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import { CustomDayAutoComplete } from "../../../../../../../common/Autocomplete/CustomDayAutocomplete";
import type { ConfigureLeaveFormFieldValues } from "../../ConfigureLeaveForm";

type leaveRuleFormProps = {
  leaveCategory: "leave_accrual_prorate";
  leaveSubCategory:
    | "joining_prorated_credit_rules"
    | "probation_end_prorated_credit_rules";
  buttonLabel: string;
  disabled: boolean;
};

export const LeaveRulesFormSchema = z
  .array(
    z
      .object({
        from_date: z.number().nullable(),
        to_date: z.number().nullable(),
        rate: z
          .number()
          .max(365, { message: "Days should not be more then 365" })
          .nullable(),
      })
      .optional()
  )
  .nullable();

export type LeaveRulesFormFieldValues = z.infer<typeof LeaveRulesFormSchema>;

export const LeaveRulesForm = ({
  leaveCategory,
  leaveSubCategory,
  buttonLabel,
  disabled = false,
}: leaveRuleFormProps) => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ConfigureLeaveFormFieldValues>();

  const leaveRuleFormArray =
    watch(`${leaveCategory}.${leaveSubCategory}`) ?? [];

  const handleAddRangeOfProbation = () => {
    const newLeaveRuleFormArray = [
      ...leaveRuleFormArray,
      {
        from_date: null,
        to_date: null,
        rate: null,
      },
    ];

    setValue(`${leaveCategory}.${leaveSubCategory}`, newLeaveRuleFormArray);
  };

  const handleRemoveRangeOfProbation = (index: number) => {
    if (leaveRuleFormArray.length) {
      const updatedArray = leaveRuleFormArray.filter(
        (_, i: number) => i !== index
      );

      setValue(`${leaveCategory}.${leaveSubCategory}`, updatedArray);
    }
  };

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  return (
    <Stack gap="15px">
      <Stack gap="30px">
        {
          // used index in key, having issues in input filed focus while using uuidv4
          leaveRuleFormArray.map((item, index) => {
            return (
              <Stack
                flexDirection="row"
                gap="10px"
                // eslint-disable-next-line sonarjs/no-array-index-key
                key={index}
              >
                <Typography paddingTop="7px">
                  {leaveSubCategory == "probation_end_prorated_credit_rules"
                    ? "If the probation end date falls between the"
                    : "If the joining date falls between the"}
                </Typography>

                <CustomDayAutoComplete
                  sx={{ width: "155px" }}
                  required
                  name={`${leaveCategory}.${leaveSubCategory}.${index}.from_date`}
                  control={control}
                  error={
                    !!errors[leaveCategory]?.[leaveSubCategory]?.[index]
                      ?.from_date
                  }
                  helperText={errorMessages(
                    errors[leaveCategory]?.[leaveSubCategory]?.[index]
                      ?.from_date?.message
                  )}
                  disabled={disabled}
                />

                <Typography paddingTop="7px"> and</Typography>

                <CustomDayAutoComplete
                  sx={{ width: "155px" }}
                  required
                  name={`${leaveCategory}.${leaveSubCategory}.${index}.to_date`}
                  control={control}
                  error={
                    !!errors[leaveCategory]?.[leaveSubCategory]?.[index]
                      ?.to_date
                  }
                  helperText={errorMessages(
                    errors[leaveCategory]?.[leaveSubCategory]?.[index]?.to_date
                      ?.message
                  )}
                  disabled={disabled}
                />

                <Typography paddingTop="7px">of the month, allocate</Typography>

                <TextField
                  type="number"
                  name={`${leaveCategory}.${leaveSubCategory}.${index}.rate`}
                  control={control}
                  sx={{ width: "140px" }}
                  error={
                    !!errors[leaveCategory]?.[leaveSubCategory]?.[index]?.rate
                  }
                  helperText={errorMessages(
                    errors[leaveCategory]?.[leaveSubCategory]?.[index]?.rate
                      ?.message
                  )}
                  disabled={disabled}
                />

                <Typography paddingTop="7px">day of leave.</Typography>

                {!!index && (
                  <Box>
                    <DeleteAction
                      onClick={() => handleRemoveRangeOfProbation(index)}
                      disabled={disabled}
                    />
                  </Box>
                )}
              </Stack>
            );
          })
        }

        <Divider>
          <Button
            startIcon={<Add />}
            onClick={() => handleAddRangeOfProbation()}
            disabled={!!errors?.[leaveCategory]?.[leaveSubCategory] || disabled}
          >
            {buttonLabel}
          </Button>
        </Divider>
      </Stack>
    </Stack>
  );
};
