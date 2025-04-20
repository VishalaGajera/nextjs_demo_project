import { Button, DeleteAction, TextField } from "@codezee/sixtify-brahma";
import { Add } from "@mui/icons-material";
import { Box, Divider, Stack, Typography } from "@mui/material";
import { t } from "i18next";
import { useFormContext } from "react-hook-form";
import { z } from "zod";
import type { ConfigureLeaveFormFieldValues } from "../ConfigureLeaveForm";

type CarryForwardPolicyFormProps = {
  leaveCategory: "year_end_processing";
  leaveSubCategory: "year_around_encashment_ranges";
  buttonLabel: string;
  disabled: boolean;
};

export const yearAroundEncashmentRangesSchema = z.object({
  balance_exceeds: z.number().nullable(),
  payable_or_carry_forward_days: z.number().nullable(),
  max_payable_or_carry_forward_days: z.number().nullable(),
});

export type CarryForwardPolicyFormFieldValues = z.infer<
  typeof yearAroundEncashmentRangesSchema
>;

export const CarryForwardPolicyForm = ({
  leaveCategory,
  leaveSubCategory,
  buttonLabel,
  disabled = false,
}: CarryForwardPolicyFormProps) => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<ConfigureLeaveFormFieldValues>();

  const yearAroundEncashmentEanges =
    watch(`${leaveCategory}.${leaveSubCategory}`) ?? [];

  const yearEndProcessingType = watch(
    "year_end_processing.year_end_processing_type"
  );

  const handleAddRangeOfProbation = () => {
    const newLeaveRuleFormArray = [
      ...yearAroundEncashmentEanges,
      {
        balance_exceeds: null,
        payable_or_carry_forward_days: null,
        max_payable_or_carry_forward_days: null,
      },
    ];

    setValue(`${leaveCategory}.${leaveSubCategory}`, newLeaveRuleFormArray);
  };

  const handleRemoveRangeOfProbation = (index: number) => {
    if (yearAroundEncashmentEanges.length) {
      const updatedArray = yearAroundEncashmentEanges.filter(
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
          yearAroundEncashmentEanges.map((item, index) => {
            return (
              <Stack
                flexDirection="row"
                gap="10px"
                alignItems="baseline"
                // eslint-disable-next-line sonarjs/no-array-index-key
                key={index}
              >
                <Typography>If the balance exceeds</Typography>

                <TextField
                  type="number"
                  name={`${leaveCategory}.${leaveSubCategory}.${index}.balance_exceeds`}
                  control={control}
                  sx={{ width: "140px" }}
                  error={
                    !!errors[leaveCategory]?.[leaveSubCategory]?.[index]
                      ?.balance_exceeds
                  }
                  helperText={errorMessages(
                    errors[leaveCategory]?.[leaveSubCategory]?.[index]
                      ?.balance_exceeds?.message
                  )}
                  disabled={disabled}
                />

                <Typography>
                  {yearEndProcessingType == "carry_forward_than_encash"
                    ? "days, carry forward"
                    : "days, pay"}
                </Typography>

                <TextField
                  type="number"
                  name={`${leaveCategory}.${leaveSubCategory}.${index}.payable_or_carry_forward_days`}
                  control={control}
                  sx={{ width: "140px" }}
                  error={
                    !!errors[leaveCategory]?.[leaveSubCategory]?.[index]
                      ?.payable_or_carry_forward_days
                  }
                  helperText={errorMessages(
                    errors[leaveCategory]?.[leaveSubCategory]?.[index]
                      ?.payable_or_carry_forward_days?.message
                  )}
                  disabled={disabled}
                />

                <Typography>
                  {yearEndProcessingType == "carry_forward_than_encash"
                    ? "days and pay the remaining"
                    : "days and carry forward the remaining"}
                </Typography>

                <TextField
                  type="number"
                  name={`${leaveCategory}.${leaveSubCategory}.${index}.max_payable_or_carry_forward_days`}
                  control={control}
                  sx={{ width: "140px" }}
                  error={
                    !!errors[leaveCategory]?.[leaveSubCategory]?.[index]
                      ?.max_payable_or_carry_forward_days
                  }
                  helperText={errorMessages(
                    errors[leaveCategory]?.[leaveSubCategory]?.[index]
                      ?.max_payable_or_carry_forward_days?.message
                  )}
                  disabled={disabled}
                />

                <Typography>days.</Typography>

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
