import {
  DeleteAction,
  ListItemButton,
  TextField,
} from "@codezee/sixtify-brahma";
import { Skeleton, TableBody, TableCell, TableRow } from "@mui/material";
import { t } from "i18next";
import { capitalize, isFunction, sum } from "lodash";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { CalculationOnAutoComplete } from "../../../../../../../../common/Autocomplete/CalculationOnAutoComplete";
import { CalculationTypeAutoComplete } from "../../../../../../../../common/Autocomplete/CalculationTypeAutoComplete";
import { useGetCalculationTypeOptions } from "../../../../../../../../common/Autocomplete/hooks/useGetCalculationTypeOptions";
import { type StructureTypeOptions } from "../../../../../../../../common/Autocomplete/hooks/useGetStructureTypeOptionsV2";
import { type SalaryRangeType } from "../../SalaryRangeSideBar/SalaryRangeForm";
import { type SalaryComponentAllocationsType } from "../SalaryStructureRightModule";

type SalaryStructureComponentFormProps = {
  isLoading?: boolean;
  disabled?: boolean;
  isOnlyOneAdjustmentSelected: boolean;
  salaryRange?: SalaryRangeType;
  formType?: StructureTypeOptions;
  index: number;
  handleRemoveRow?: (index: number, field?: string) => void;
  calculatedValues: Record<string, number>;
  isReset?: boolean;
  setIsReset?: (isReset: boolean) => void;
};

export const SalaryStructureComponentForm = ({
  isLoading = false,
  disabled = false,
  index,
  isReset = true,
  setIsReset,
  calculatedValues,
  salaryRange,
  formType = "range",
  isOnlyOneAdjustmentSelected,
  handleRemoveRow,
}: SalaryStructureComponentFormProps) => {
  const {
    control,
    watch,
    setValue,
    clearErrors,
    formState: { errors, dirtyFields },
  } = useFormContext<SalaryComponentAllocationsType>();

  const calculationType = watch(
    `salary_component_allocations.${index}.calculation_type`
  );

  const item = watch("salary_component_allocations");

  const indexedItem = item[index];

  const getOptions = (index: number) => {
    if (index !== 0) {
      const skippedComponents = item.slice(0, index);

      const options = skippedComponents.map((component) => {
        return {
          value: component.salary_component_id ?? "",
          label: capitalize(component.salary_component_name ?? "") ?? "",
        };
      });

      return options;
    }

    return [];
  };

  const isDisabledCalculationOn = calculationType !== "percentage";

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  const { calculationTypeOptions } = useGetCalculationTypeOptions();

  const refineCalculationTypeOptions = (
    isAdjustMentSelected: boolean,
    componentCode?: string | null
  ) => {
    return calculationTypeOptions.filter((option) => {
      return !(
        (option.value === "adjustment" &&
          !isAdjustMentSelected &&
          isOnlyOneAdjustmentSelected) ||
        (componentCode === "BASIC" && option.value === "adjustment")
      );
    });
  };

  useEffect(() => {
    if (!isReset && isFunction(setIsReset)) {
      setIsReset(true);

      return;
    }

    if (dirtyFields.salary_component_allocations?.[index]?.calculation_type) {
      setValue(`salary_component_allocations.${index}.percentage_value`, null);

      setValue(
        `salary_component_allocations.${index}.depends_on_salary_component_id`,
        null
      );

      setValue(`salary_component_allocations.${index}.fixed_amount`, null);

      clearErrors(`salary_component_allocations.${index}.fixed_amount`);

      clearErrors(
        `salary_component_allocations.${index}.depends_on_salary_component_id`
      );

      clearErrors(`salary_component_allocations.${index}.percentage_value`);
    }
  }, [watch(`salary_component_allocations.${index}.calculation_type`)]);

  const fieldPlaceHolder = {
    percentage: "Enter Percentage",
    fixed: "Enter Amount",
    adjustment: "Adjustment",
  };

  const calculationOnPlaceHolderTitle = {
    adjustment: "N/A",
    percentage: "Select Calculation On",
    fixed: "N/A",
  };

  const basicCalculationOnPlaceHolder =
    indexedItem?.calculation_type === "fixed" ? "N/A" : "Gross";

  const calculationOnPlaceHolder =
    indexedItem?.salary_component_code === "BASIC"
      ? basicCalculationOnPlaceHolder
      : calculationOnPlaceHolderTitle[
          indexedItem?.calculation_type ?? "adjustment"
        ];

  const calValue =
    calculatedValues[indexedItem?.salary_component_id ?? ""] ?? 0;

  const adjustmentCount =
    (salaryRange?.to_range ?? 0) - sum(Object.values(calculatedValues ?? {}));

  return (
    <TableBody>
      <TableRow sx={{ verticalAlign: "baseline" }}>
        <TableCell
          sx={{
            verticalAlign: "top !important",
            width: "400px",
          }}
        >
          <TextField
            loading={isLoading}
            control={control}
            disabled
            name={`salary_component_allocations.${index}.salary_component_name`}
          />
        </TableCell>

        <TableCell
          width={230}
          sx={{
            verticalAlign: "top !important",
          }}
        >
          <CalculationTypeAutoComplete
            control={control}
            loading={isLoading}
            clearIcon={false}
            options={refineCalculationTypeOptions(
              item[index]?.calculation_type === "adjustment",
              item[index]?.salary_component_code
            )}
            error={
              !!errors.salary_component_allocations?.[index]?.calculation_type
            }
            helperText={errorMessages(
              errors.salary_component_allocations?.[index]?.calculation_type
                ?.message
            )}
            name={`salary_component_allocations.${index}.calculation_type`}
            fullWidth
            disabled={disabled}
          />
        </TableCell>

        <TableCell
          sx={{
            width: "200px",
            verticalAlign: "top !important",
          }}
        >
          {["fixed", "adjustment"].includes(calculationType) && (
            <TextField
              control={control}
              type="number"
              placeholder={
                indexedItem && fieldPlaceHolder[indexedItem.calculation_type]
              }
              disabled={
                disabled || indexedItem?.calculation_type === "adjustment"
              }
              loading={isLoading}
              name={`salary_component_allocations.${index}.fixed_amount`}
              error={
                !!errors.salary_component_allocations?.[index]?.fixed_amount
              }
              helperText={errorMessages(
                errors.salary_component_allocations?.[index]?.fixed_amount
                  ?.message
              )}
            />
          )}

          {calculationType === "percentage" && (
            <TextField
              control={control}
              type="number"
              placeholder={
                indexedItem && fieldPlaceHolder[indexedItem?.calculation_type]
              }
              loading={isLoading}
              disabled={disabled}
              name={`salary_component_allocations.${index}.percentage_value`}
              error={
                !!errors.salary_component_allocations?.[index]?.percentage_value
              }
              helperText={errorMessages(
                errors.salary_component_allocations?.[index]?.percentage_value
                  ?.message
              )}
            />
          )}
        </TableCell>

        <TableCell
          sx={{
            width: "400px",
            verticalAlign: "top !important",
          }}
        >
          <CalculationOnAutoComplete
            options={getOptions(index)}
            control={control}
            placeholder={calculationOnPlaceHolder}
            loading={isLoading}
            disabled={isDisabledCalculationOn || !index || disabled}
            error={
              !!errors.salary_component_allocations?.[index]
                ?.depends_on_salary_component_id
            }
            helperText={errorMessages(
              errors.salary_component_allocations?.[index]
                ?.depends_on_salary_component_id?.message
            )}
            name={`salary_component_allocations.${index}.depends_on_salary_component_id`}
          />
        </TableCell>

        {formType === "range" && (
          <TableCell
            sx={{
              width: "100px",
              verticalAlign: "top !important",
            }}
          >
            {isLoading ? (
              <Skeleton height={20} width={150} />
            ) : (
              <ListItemButton
                disabled
                label={
                  indexedItem?.calculation_type === "adjustment"
                    ? `${adjustmentCount.toFixed(2)}`
                    : `${calValue.toFixed(2)}`
                }
              />
            )}
          </TableCell>
        )}

        <TableCell
          sx={{
            verticalAlign: "top !important",
          }}
        >
          {indexedItem?.salary_component_code !== "BASIC" && (
            <DeleteAction
              disabled={disabled}
              onClick={() => handleRemoveRow && handleRemoveRow(index)}
            />
          )}
        </TableCell>
      </TableRow>
    </TableBody>
  );
};
