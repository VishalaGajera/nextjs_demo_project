import {
  Button,
  FormGridLayout,
  PadBox,
  TextField,
  toasts,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Add } from "@mui/icons-material";
import {
  Box,
  Stack,
  Table,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useTheme,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { t } from "i18next";
import { capitalize, uniqBy } from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { useDisabledButtonsCache } from "../../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { useDialogActions } from "../../../../../../../hooks/useDialogActions";
import { useEnableDisableButton } from "../../../../../../../hooks/useEnableDisableButton";
import { submitButtonId } from "../../../../../../../hooks/useEnableDisableButtonToggle";
import { salaryStructureKeys } from "../../../../../../../queryKeysFactories/SalaryStructure";
import type { DialogRenderer } from "../../../../../../../types/dialogs";
import { onError } from "../../../../../../../utils/errors";
import {
  digitMaxLimit,
  filterNestedChangedFormFields,
  toRoundNumber,
} from "../../../../../../../utils/helper";
import { AddSalaryStructureComponentDialog } from "../../RangeBasedSalaryStructure/Add/SalaryRangeRightModule/Dialogs/AddSalaryStructureComponentDialog";
import { SalaryStructureComponentForm } from "../../RangeBasedSalaryStructure/Add/SalaryRangeRightModule/SalaryStructureComponent/SalaryStructureComponentForm";
import { useGetSalaryStructureComponentList } from "../../RangeBasedSalaryStructure/Add/SalaryRangeRightModule/SalaryStructureComponentList/Hooks/useGetSalaryComponentList";
import { calculateDependedPercentage } from "../../RangeBasedSalaryStructure/Add/SalaryRangeRightModule/utils/calculateDependedPercentage";
import type { SalaryIntervals } from "../../RangeBasedSalaryStructure/Add/SalaryRangeSideBar/Hooks/useGetSalaryRangeList";
import { customCalculateDependedPercentage } from "../utils/customCalculateDependedPercentage";
import {
  getFilterSalaryComponentAllocations,
  getSelectedComponentAllocations,
} from "../utils/helper";
import { useAddCustomSalaryComponent } from "./hooks/useAddCustomSalaryComponent";

export const CUSTOMSALARYHEADERS = [
  "Component Name",
  "Calculation Type",
  "Field Data",
  "Calculation On",
  "Action",
];

type AddCustomBasedSalaryStructureProps = {
  ssId: string;
};

const SalaryIntervalTypeSchema = z
  .enum(["monthly", "annually", "daily", "hourly"])
  .nullable();

export const customSalaryComponentAllocationsSchema = z
  .object({
    selectedRows: z.record(z.boolean().optional()).nullable().optional(),
    salary_component_allocations: z.array(
      z.object({
        action: z.string().optional(),
        id: z.string().optional().nullable(),
        salary_component_id: z.string().refine((value) => !!value, {
          message: "common.required",
        }),
        salary_component_name: z.string(),
        salary_component_code: z.string(),
        calculation_type: z
          .enum(["percentage", "fixed", "adjustment"])
          .nullable()
          .refine((value) => !!value, {
            message: "common.required",
          }),
        percentage_value: z
          .number()
          .int({
            message: "common.invalidNumber",
          })
          .transform((value) => toRoundNumber(value))
          .nullable()
          .optional(),
        fixed_amount: z
          .number()
          .int({
            message: "common.invalidNumber",
          })
          .transform((value) => toRoundNumber(value))
          .nullable()
          .optional(),
        depends_on_salary_component_id: z.string().nullable(),
      })
    ),
    salary_structure_name: z.string().refine((value) => !!value, {
      message: "common.required",
    }),
    description: z.string().max(255, "common.maxLength").nullable().optional(),
    salary_interval: SalaryIntervalTypeSchema,
  })
  .superRefine((data, ctx) => {
    // eslint-disable-next-line sonarjs/cognitive-complexity
    data.salary_component_allocations.forEach((component, index) => {
      if (component.calculation_type === "fixed") {
        if (!component.fixed_amount && component.fixed_amount !== 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "common.required",
            path: ["salary_component_allocations", index, "fixed_amount"],
          });
        }

        if (component.fixed_amount && component.fixed_amount > digitMaxLimit) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("value.maximum.allowedLimit", {
              maxLimit: 999999999,
            }),
            path: ["salary_component_allocations", index, "fixed_amount"],
          });
        }
      }

      if (component.calculation_type === "percentage") {
        if (!component.percentage_value && component.percentage_value !== 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "common.required",
            path: ["salary_component_allocations", index, "percentage_value"],
          });
        }

        if (component.percentage_value && component.percentage_value > 100) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: t("value.maximum.allowedLimit", {
              maxLimit: 100,
            }),
            path: ["salary_component_allocations", index, "percentage_value"],
          });
        }
      }
    });
  });

export type CustomSalaryComponentAllocationsType = z.infer<
  typeof customSalaryComponentAllocationsSchema
>;

export const AddCustomBasedSalaryStructure = ({
  ssId,
}: AddCustomBasedSalaryStructureProps) => {
  const theme = useTheme();

  const { t } = useTranslation();

  const router = useRouter();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const { iron, slate } = theme.palette.app.color;

  const searchParams = useSearchParams();

  const interval = searchParams.get("interval") as SalaryIntervals;

  const tab = searchParams.get("tab") as SalaryIntervals;

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const {
    data: { data: earningComponentList },
  } = useGetSalaryStructureComponentList();

  const defaultSalaryComponent: CustomSalaryComponentAllocationsType["salary_component_allocations"] =
    [
      {
        action: "",
        id: null,
        salary_component_id: earningComponentList[0]?.id ?? "",
        calculation_type: "percentage",
        percentage_value: null,
        salary_component_name: "Basic",
        fixed_amount: null,
        depends_on_salary_component_id: "gross",
        salary_component_code: "BASIC",
      },
    ];

  const selectedInitialRows = { BASIC: true };

  const values = {
    salary_component_allocations: defaultSalaryComponent,
    selectedRows: selectedInitialRows,
    salary_structure_name: "",
    description: null,
    salary_interval: null,
  };

  const formMethods = useForm<CustomSalaryComponentAllocationsType>({
    values,
    mode: "all",
    resolver: zodResolver(customSalaryComponentAllocationsSchema),
  });

  const {
    watch,
    handleSubmit,
    setValue,
    control,
    setError,
    formState: { errors, dirtyFields },
  } = formMethods;

  useEnableDisableButton({
    control,
    defaultValues: values,
    errors,
  });

  const salaryComponentAllocations = watch("salary_component_allocations");

  const savedSalaryComponent = useMemo(() => {
    return watch("salary_component_allocations").map((component) => {
      return component.salary_component_code ?? "";
    });
  }, []);

  const isOnlyOneAdjustmentSelected =
    watch("salary_component_allocations").filter(
      (component) => component.calculation_type === "adjustment"
    ).length === 1;

  const { calculatedValues } = calculateDependedPercentage({
    payLoad: {
      salary_component_allocations: watch("salary_component_allocations"),
    },
    totalValue: 0,
    isOnlyOneAdjustmentSelected,
  });

  const queryClient = useQueryClient();

  const goBack = () => {
    router.push(
      `/payroll/settings/salary-structure/salary-structure-details/${ssId}?interval=${interval}&list=custom`
    );
  };

  const { fields, remove } = useFieldArray({
    name: "salary_component_allocations",
    control,
  });

  const { mutate, isPending } = useAddCustomSalaryComponent({
    ssId,
    options: {
      onSuccess: (message) => {
        queryClient.invalidateQueries({
          queryKey: salaryStructureKeys.getSalaryComponentsList(
            ssId,
            interval,
            tab
          ),
        });

        toasts.success({
          title: message.message,
        });

        goBack();
      },
      onError: (error) => {
        onError(error, setError);
      },
    },
  });

  const handleSave = () => {
    handleSubmit((formValues) => {
      const { customDependedPercentage } = customCalculateDependedPercentage({
        payload: {
          salary_component_allocations: formValues.salary_component_allocations,
        },
      });

      if (!customDependedPercentage) {
        return;
      }

      const payload = filterNestedChangedFormFields(formValues, {
        ...dirtyFields,
        salary_component_allocations:
          dirtyFields.salary_component_allocations?.map((dirtyField) => {
            return {
              ...dirtyField,
              salary_component_id: true,
              calculation_type: true,
            };
          }),
        selectedRows: {},
        salary_interval: true,
      });

      mutate({
        ...payload,
        salary_interval: interval,
      });
    })();
  };

  const selectedRows = watch("selectedRows");

  const componentIds = useMemo(() => {
    return (
      Object.entries(selectedRows ?? {})
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, value]) => value === true)
        .map(([key]) => key) || []
    );
  }, [Object.values(selectedRows || {})]);

  const onAddCustomBasedSalaryStructure = () => {
    const selectedComponents = earningComponentList.filter(
      (selectedComponent) => {
        return componentIds.includes(selectedComponent.earning_component_code);
      }
    );

    const selectedSalaryComponentAllocations = getSelectedComponentAllocations<
      CustomSalaryComponentAllocationsType["salary_component_allocations"]
    >({
      selectedComponents,
    });

    const filterSalaryComponentAllocations =
      getFilterSalaryComponentAllocations<
        CustomSalaryComponentAllocationsType["salary_component_allocations"]
      >({
        selectedSalaryComponentAllocations,
        savedSalaryComponent,
      });

    const allSalaryComponentAllocations = [
      ...(salaryComponentAllocations ? salaryComponentAllocations : []),
      ...(filterSalaryComponentAllocations
        ? filterSalaryComponentAllocations
        : []),
    ];

    const filteredAllCustomSalaryComponentAllocations = uniqBy(
      allSalaryComponentAllocations,
      "salary_component_code"
    );

    setValue(
      "salary_component_allocations",
      filteredAllCustomSalaryComponentAllocations
    );

    onDialogClose();
  };

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddSalaryStructureComponentDialog
        open
        savedSalaryComponent={savedSalaryComponent}
        onClose={onDialogClose}
        onAddSalaryStructureComponent={onAddCustomBasedSalaryStructure}
        formType="custom"
      />
    ),
  };

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  const handleRemoveRow = (index: number, removeRowsfield?: string) => {
    if (removeRowsfield) {
      setValue("selectedRows", {
        ...selectedRows,
        [removeRowsfield]: false,
      });
      remove(index);
    }
  };

  return (
    <>
      <Box bgcolor={iron[600]} borderRadius="4px">
        <PadBox padding={{ padding: "15px" }}>
          <Typography color={iron[400]} variant="h6">
            Add {capitalize(interval)} Custom Based Salary Structure
          </Typography>
        </PadBox>
      </Box>

      <FormProvider {...formMethods}>
        <Stack gap="10px" width="100%">
          <Box
            sx={{ width: "100%", borderRadius: "4px", background: iron[600] }}
          >
            <PadBox padding={{ padding: "15px" }}>
              <FormGridLayout columns={3}>
                <TextField
                  control={control}
                  label="Structure Name"
                  placeholder="Structure Name"
                  required
                  name="salary_structure_name"
                  error={!!errors.salary_structure_name}
                  helperText={errorMessages(
                    errors.salary_structure_name?.message
                  )}
                />

                <TextField
                  control={control}
                  label="Description"
                  placeholder="Description"
                  name="description"
                  error={!!errors.description}
                  helperText={errorMessages(errors.description?.message)}
                />
              </FormGridLayout>
            </PadBox>
          </Box>

          <Box
            sx={{ width: "100%", borderRadius: "4px", background: iron[600] }}
          >
            <PadBox padding={{ padding: "10px" }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6" sx={{ color: slate[900] }}>
                  Earnings
                </Typography>

                <Button
                  variant="outlined"
                  startIcon={<Add />}
                  onClick={() => onDialogOpen("add")}
                >
                  Add Component
                </Button>
              </Stack>
            </PadBox>
          </Box>

          <Stack
            gap="10px"
            sx={{
              maxHeight: "calc(95vh - 340px)",
              width: "100%",
              overflowY: "auto",
              borderRadius: "4px",
              background: iron[600],
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: slate[700] }}>
                  {CUSTOMSALARYHEADERS.map((header) => (
                    <TableCell key={uuidv4()}>{header}</TableCell>
                  ))}
                </TableRow>
              </TableHead>

              {fields.map((field, index) => {
                return (
                  <SalaryStructureComponentForm
                    formType="custom"
                    handleRemoveRow={(index) =>
                      handleRemoveRow(index, field.salary_component_code)
                    }
                    key={field.id}
                    isReset={false}
                    calculatedValues={calculatedValues}
                    index={index}
                    isOnlyOneAdjustmentSelected={isOnlyOneAdjustmentSelected}
                  />
                );
              })}
            </Table>
          </Stack>

          <Stack direction="row" width="100%" justifyContent="end" gap="5px">
            <Button variant="outlined" onClick={goBack}>
              Cancel
            </Button>

            <Button
              loading={isPending}
              disabled={isDisabled()}
              onClick={() => handleSave()}
            >
              Save
            </Button>
          </Stack>
        </Stack>

        {openedDialog && dialogRenderer[openedDialog]}
      </FormProvider>
    </>
  );
};
