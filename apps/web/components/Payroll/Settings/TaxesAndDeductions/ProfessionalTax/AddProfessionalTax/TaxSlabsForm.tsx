import {
  CheckBox,
  DeleteAction,
  TextField,
  type TextFieldProps,
} from "@codezee/sixtify-brahma";
import { Box, Stack, TableCell, TableRow, useTheme } from "@mui/material";
import { t } from "i18next";
import { useEffect } from "react";
import { type FieldArrayWithId, useFormContext } from "react-hook-form";
import { MonthAutocomplete } from "../../../../../common/Autocomplete/MonthAutocomplete";
import { MONTH_LEBEL, type TaxConfigType } from "./ProfessionalTaxForms";

export type TaxSlabsFormProps = {
  field: FieldArrayWithId<TaxConfigType>;
  index: number;
  removeTaxSlab: (index: number) => void;
  removeMonthRow?: () => void;
  formType: "tax_slabs" | "male" | "female";
  headersLength: number;
  loading?: boolean;
  action: "view" | "update" | "add";
};

export const TaxSlabsForm = ({
  loading = false,
  index,
  field,
  action,
  removeTaxSlab,
  formType,
  headersLength,
}: Omit<TextFieldProps<TaxConfigType>, "name"> & TaxSlabsFormProps) => {
  const {
    control,
    watch,
    setValue,
    resetField,
    formState: { errors },
  } = useFormContext<TaxConfigType>();

  const getSlabs = watch(`slabs.${formType}.${index}`);

  const isVariesInMonth = getSlabs.is_varies_in_month;

  const selectedMonths = getSlabs.arrayMonth || [];

  useEffect(() => {
    const months = getSlabs.arrayMonth || [];

    const currentVariations = getSlabs.monthly_variations || [];

    const newVariations = months.map((month) => {
      const existing = currentVariations.find((v) => v?.month === month);

      return {
        ...(existing?.id && { id: existing?.id }),
        month,
        tax_amount: existing?.tax_amount ?? null,
      };
    });

    setValue(`slabs.${formType}.${index}.monthly_variations`, newVariations, {
      shouldDirty: isVariesInMonth,
    });
  }, [selectedMonths]);

  const errorMessage = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  useEffect(() => {
    if (!isVariesInMonth) {
      resetField(`slabs.${formType}.${index}.arrayMonth`);

      resetField(`slabs.${formType}.${index}.monthly_variations`);
    }
  }, [isVariesInMonth]);

  const monthlyVariationsErrors = (index: number, mIndex: number) => {
    const monthlyVariationsError = {
      isError:
        !!errors.slabs?.[formType]?.[index]?.monthly_variations?.[mIndex]
          ?.tax_amount?.message,
      message:
        errors.slabs?.[formType]?.[index]?.monthly_variations?.[mIndex]
          ?.tax_amount?.message,
    };

    return monthlyVariationsError;
  };

  const theme = useTheme();

  const { sapphireBlue, black } = theme.palette.app.color;

  const isValidHeaderLength = headersLength === 5;

  const isViewMode = action === "view";

  return (
    <TableRow sx={{ verticalAlign: "baseline" }} key={field?.id}>
      <TableCell sx={{ width: "215px" }}>
        <TextField
          control={control}
          type="number"
          loading={loading}
          disabled={isViewMode}
          sx={{ maxWidth: "100%" }}
          error={!!errors.slabs?.[formType]?.[index]?.start_amount?.message}
          helperText={errorMessage(
            errors.slabs?.[formType]?.[index]?.start_amount?.message
          )}
          name={`slabs.${formType}.${index}.start_amount`}
          placeholder="00"
        />
      </TableCell>

      <TableCell sx={{ width: "215px" }}>
        <TextField
          control={control}
          type="number"
          loading={loading}
          sx={{ maxWidth: "100%" }}
          disabled={isViewMode}
          error={!!errors.slabs?.[formType]?.[index]?.end_amount?.message}
          helperText={errorMessage(
            errors.slabs?.[formType]?.[index]?.end_amount?.message
          )}
          name={`slabs.${formType}.${index}.end_amount`}
          placeholder="00"
        />
      </TableCell>

      <TableCell sx={{ width: "215px" }}>
        <TextField
          control={control}
          loading={loading}
          disabled={isViewMode}
          type="number"
          sx={{ maxWidth: "100%" }}
          error={!!errors.slabs?.[formType]?.[index]?.tax_amount?.message}
          helperText={errorMessage(
            errors.slabs?.[formType]?.[index]?.tax_amount?.message
          )}
          name={`slabs.${formType}.${index}.tax_amount`}
          placeholder="00"
        />
      </TableCell>

      <TableCell sx={{ verticalAlign: "center" }} width={150}>
        <CheckBox
          loading={loading}
          name={`slabs.${formType}.${index}.is_varies_in_month`}
          control={control}
          disabled={isViewMode}
        />
      </TableCell>

      {!isValidHeaderLength &&
        (isVariesInMonth ? (
          <>
            <TableCell sx={{ verticalAlign: "top !important" }}>
              <Box
                sx={{
                  display: "flex",
                  overflowY: "auto",
                  maxHeight: "115px",
                  alignItems: "baseline",
                }}
              >
                <MonthAutocomplete
                  name={`slabs.${formType}.${index}.arrayMonth`}
                  control={control}
                  loading={loading}
                  disabled={!isVariesInMonth || isViewMode}
                  error={
                    !!errors.slabs?.[formType]?.[index]?.arrayMonth?.message
                  }
                  helperText={
                    isVariesInMonth
                      ? errorMessage(
                          errors.slabs?.[formType]?.[index]?.arrayMonth?.message
                        )
                      : ""
                  }
                  label=""
                  multiple
                  sx={{
                    width: "215px",
                    "& .MuiAutocomplete-tag": {
                      backgroundColor: sapphireBlue[300],
                      color: black[900],
                    },
                  }}
                />
              </Box>
            </TableCell>
            <TableCell>
              <Stack maxHeight="115px" gap="10px" sx={{ overflowY: "auto" }}>
                {isVariesInMonth && selectedMonths.length ? (
                  selectedMonths.map((month: number, mIndex: number) => {
                    return (
                      <TextField
                        key={month}
                        loading={loading}
                        size="small"
                        disabled={isViewMode}
                        type="number"
                        error={monthlyVariationsErrors(index, mIndex).isError}
                        control={control}
                        name={`slabs.${formType}.${index}.monthly_variations.${mIndex}.tax_amount`}
                        placeholder={`${MONTH_LEBEL[month]}`}
                      />
                    );
                  })
                ) : (
                  <TextField
                    control={control}
                    loading={loading}
                    size="small"
                    disabled={
                      !isVariesInMonth || !selectedMonths.length || isViewMode
                    }
                    name={`slabs.${formType}.${index}.monthly_variations.${0}.tax_amount`}
                    placeholder="00"
                    type="number"
                  />
                )}
              </Stack>
            </TableCell>
          </>
        ) : (
          <>
            <TableCell>-</TableCell>
            <TableCell>-</TableCell>
          </>
        ))}

      <TableCell>
        {watch(`slabs.${formType}`).length > 1 && (
          <DeleteAction
            onClick={() => removeTaxSlab(index)}
            disabled={isViewMode}
          />
        )}
      </TableCell>
    </TableRow>
  );
};
