import { Button, PadBox, toasts } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Add } from "@mui/icons-material";
import {
  Box,
  Skeleton,
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
import { omit as _omit, sum, uniqBy } from "lodash";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { useDisabledButtonsCache } from "../../../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { useDialogActions } from "../../../../../../../../hooks/useDialogActions";
import { useEnableDisableButton } from "../../../../../../../../hooks/useEnableDisableButton";
import { submitButtonId } from "../../../../../../../../hooks/useEnableDisableButtonToggle";
import { salaryStructureKeys } from "../../../../../../../../queryKeysFactories/SalaryStructure";
import { type DialogRenderer } from "../../../../../../../../types/dialogs";
import { onError } from "../../../../../../../../utils/errors";
import {
  digitMaxLimit,
  formatToIndianNumber,
  toRoundNumber,
} from "../../../../../../../../utils/helper";
import {
  getFilterSalaryComponentAllocations,
  getSelectedComponentAllocations,
} from "../../../CustomBasedSalaryStructure/utils/helper";
import { type SalaryRangeType } from "../SalaryRangeSideBar/SalaryRangeForm";
import { AddSalaryStructureComponentDialog } from "./Dialogs/AddSalaryStructureComponentDialog";
import {
  useGetSalaryComponentsList,
  type SalaryIntervals,
} from "./Dialogs/Hooks/useGetSalaryComponentsList";
import { useUpdateSalaryComponent } from "./SalaryStructureComponent/Hooks/useUpdateSalaryComponent";
import { SalaryStructureComponentForm } from "./SalaryStructureComponent/SalaryStructureComponentForm";
import { Skeleton as TableSkeleton } from "./SalaryStructureComponent/Skeleton";
import { useGetSalaryStructureComponentList } from "./SalaryStructureComponentList/Hooks/useGetSalaryComponentList";
import { calculateDependedPercentage } from "./utils/calculateDependedPercentage";

type SalaryStructureRightModuleProps = {
  interval: SalaryIntervals;
  ssId: string;
  salaryRangeId: string;
  list: string;
  salaryRanges?: SalaryRangeType[];
  isLoading?: boolean;
};

const HEADERS = [
  "Component Name",
  "Calculation Type",
  "Field Data",
  "Calculation On",
  "Cal.Value",
  "Action",
];

const salaryComponentAllocationsSchema = z
  .object({
    selectedRows: z.record(z.boolean().optional()).nullable().optional(),
    salary_component_allocations: z.array(
      z.object({
        action: z.string().optional(),
        id: z.string().optional().nullable(),
        salary_component_id: z
          .string()
          .nullable()
          .refine((value) => !!value, {
            message: "common.required",
          })
          .optional(),
        salary_component_name: z.string().optional().nullable(),
        salary_component_code: z.string().optional().nullable(),
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
        depends_on_salary_component_id: z.string().optional().nullable(),
      })
    ),
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

export type SalaryComponentAllocationsType = z.infer<
  typeof salaryComponentAllocationsSchema
>;

export const SalaryStructureRightModule = ({
  interval,
  salaryRangeId,
  ssId,
  list,
  isLoading = false,
  salaryRanges,
}: SalaryStructureRightModuleProps) => {
  const theme = useTheme();

  const { slate, iron } = theme.palette.app.color;

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const [savedSalaryComponent, setSavedSalaryComponent] = useState<string[]>(
    []
  );

  const [isReset, setIsReset] = useState(true);

  const router = useRouter();

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const salaryRange = salaryRanges?.find((range) => range.id === salaryRangeId);

  const [rangeExistingComponentCodes, setRangeExistingComponentCodes] =
    useState<string[]>([]);

  const range =
    // eslint-disable-next-line sonarjs/prefer-nullish-coalescing
    salaryRange?.from_range || salaryRange?.to_range
      ? `${formatToIndianNumber(salaryRange?.from_range)} - ${formatToIndianNumber(salaryRange?.to_range)}`
      : "";

  const {
    data: salaryComponentsList = [],
    isFetching: isComponentListPending,
  } = useGetSalaryComponentsList({
    interval,
    salaryRangeId,
    ssId,
  });

  const {
    data: { data: earningComponentList },
  } = useGetSalaryStructureComponentList();

  const initialValues = useMemo(() => {
    return salaryComponentsList.map((component) => {
      return {
        action: "",
        id: component.id ?? null,
        salary_component_id: component.salary_component_id,
        calculation_type: component.calculation_type,
        percentage_value: component.percentage_value ?? null,
        salary_component_name: component.salary_component.component_name,
        fixed_amount: component.fixed_amount ?? null,
        depends_on_salary_component_id:
          component.salary_component.component_code === "BASIC"
            ? "gross"
            : component.depends_on_salary_component_id,
        salary_component_code: component.salary_component.component_code,
      };
    });
  }, [salaryComponentsList]);

  const sortSalaryComponentsList = (
    salaryComponents: SalaryComponentAllocationsType["salary_component_allocations"]
  ) => {
    const defaultSalaryComponentsOrder = earningComponentList.map(
      (list) => list.earning_component_code
    );

    return salaryComponents.sort((a, b) => {
      return (
        defaultSalaryComponentsOrder.indexOf(a.salary_component_code ?? "") -
        defaultSalaryComponentsOrder.indexOf(b.salary_component_code ?? "")
      );
    });
  };

  const selectedInitialRows = salaryComponentsList.reduce(
    (acc, component) => {
      acc[component.salary_component.component_code] = true;

      return acc;
    },
    {} as Record<string, boolean>
  );

  const sortedDefaultRangeSalary = sortSalaryComponentsList(initialValues);

  const values = {
    salary_component_allocations: sortedDefaultRangeSalary,
    selectedRows: selectedInitialRows,
    checkAll: false,
  };

  const formMethods = useForm({
    values,
    mode: "all",
    resolver: zodResolver(salaryComponentAllocationsSchema),
  });

  const {
    watch,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = formMethods;

  useEnableDisableButton({ control, defaultValues: values, errors });

  const { fields, remove } = useFieldArray({
    name: "salary_component_allocations",
    control,
  });

  const selectedRows = watch("selectedRows");

  useEffect(() => {
    const savedComponents = salaryComponentsList.map((component) => {
      return component.salary_component.component_code;
    });

    setSavedSalaryComponent(savedComponents);
  }, [salaryComponentsList]);

  const componentIds = useMemo(() => {
    return (
      Object.entries(selectedRows ?? {})
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        .filter(([_, value]) => value === true)
        .map(([key]) => key) || []
    );
  }, [Object.values(selectedRows || {})]);

  const onAddSalaryStructureComponent = () => {
    const selectedComponents = earningComponentList.filter(
      (selectedComponent) => {
        return componentIds.includes(selectedComponent.earning_component_code);
      }
    );

    const selectedSalaryComponentAllocations = getSelectedComponentAllocations<
      SalaryComponentAllocationsType["salary_component_allocations"]
    >({
      selectedComponents,
    });

    const filterSalaryComponentAllocations =
      getFilterSalaryComponentAllocations<
        SalaryComponentAllocationsType["salary_component_allocations"]
      >({
        selectedSalaryComponentAllocations,
        savedSalaryComponent,
      });

    const allSalaryComponentAllocations = [
      ...watch("salary_component_allocations"),
      ...filterSalaryComponentAllocations.map((allocation) => ({
        action: allocation.action ?? "add",
        id: allocation.id ?? "",
        salary_component_id: allocation.salary_component_id ?? "",
        calculation_type: allocation.calculation_type,
        percentage_value: allocation.percentage_value ?? null,
        salary_component_name: allocation.salary_component_name ?? "",
        fixed_amount: allocation.fixed_amount ?? null,
        depends_on_salary_component_id:
          allocation.depends_on_salary_component_id ?? null,
        salary_component_code: allocation.salary_component_code ?? "",
      })),
    ];

    const filteredAllRangeSalaryComponentAllocations = uniqBy(
      allSalaryComponentAllocations,
      "salary_component_code"
    );

    setValue(
      "salary_component_allocations",
      sortSalaryComponentsList(filteredAllRangeSalaryComponentAllocations)
    );

    setIsReset(false);

    onDialogClose();
  };

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddSalaryStructureComponentDialog
        salaryRange={range}
        open
        onAddSalaryStructureComponent={onAddSalaryStructureComponent}
        formType="range"
        savedSalaryComponent={savedSalaryComponent}
        onClose={onDialogClose}
      />
    ),
  };

  const toRange = salaryRange?.to_range ?? 0;

  const fromRange = salaryRange?.from_range ?? 0;

  const isOnlyOneAdjustmentSelected =
    watch("salary_component_allocations").filter(
      (component) => component.calculation_type === "adjustment"
    ).length === 1;

  const filterPayLoad = (formValues: SalaryComponentAllocationsType) => {
    const filteredFormValues = _omit(formValues, "selectedRows");

    const getDeletedComponentsList = (
      components: SalaryComponentAllocationsType["salary_component_allocations"]
    ) => {
      return components
        .filter((component) =>
          rangeExistingComponentCodes?.includes(
            component.salary_component_code ?? ""
          )
        )
        .map((component) => ({
          calculation_type: component.calculation_type,
          id: component.id,
          salary_component_id: component.salary_component_id,
          action: "delete",
        }));
    };

    const restFormValues = filteredFormValues.salary_component_allocations.map(
      (component) => {
        const isActionUpdate = savedSalaryComponent.includes(
          component.salary_component_code ?? ""
        );

        const itemsToOmit = ["salary_component_code", "salary_component_name"];

        if (component.calculation_type === "fixed") {
          itemsToOmit.push("percentage_value");
        } else {
          itemsToOmit.push("fixed_amount");
        }

        if (component.calculation_type === "adjustment") {
          itemsToOmit.push("percentage_value");

          itemsToOmit.push("fixed_amount");
        }

        if (
          component.calculation_type !== "percentage" ||
          component.salary_component_code === "BASIC"
        ) {
          itemsToOmit.push("depends_on_salary_component_id");
        }

        const filteredItems = _omit(component, itemsToOmit);

        return {
          ...filteredItems,
          calculation_type: filteredItems.calculation_type ?? "fixed",
          action: isActionUpdate ? "update" : "add",
        };
      }
    );

    const deletedComponents = getDeletedComponentsList(initialValues);

    return [...restFormValues, ...deletedComponents];
  };

  const queryClient = useQueryClient();

  const goBack = () => {
    router.push(
      `/payroll/settings/salary-structure/salary-structure-details/${ssId}?tab=${salaryRangeId}&interval=${interval}&list=${list}`
    );
  };

  const { mutate, isPending } = useUpdateSalaryComponent({
    salaryRangeId,
    ssId,
    options: {
      onSuccess: (message) => {
        queryClient.invalidateQueries({
          queryKey: salaryStructureKeys.getSalaryComponentsList(
            ssId,
            interval,
            salaryRangeId
          ),
        });

        toasts.success({
          title: message.message,
        });

        goBack();
      },
      onError: (error) => {
        onError(error);
      },
    },
  });

  const { totalSum, calculatedValues, errorMessage, isDependencySelected } =
    calculateDependedPercentage({
      payLoad: {
        salary_component_allocations: watch("salary_component_allocations"),
      },
      totalValue: toRange,
      isOnlyOneAdjustmentSelected,
    });

  const handleRemoveRow = (index: number, removeRowsfield?: string) => {
    if (removeRowsfield) {
      setRangeExistingComponentCodes((prevs) => [...prevs, removeRowsfield]);

      setSavedSalaryComponent((prevs) => {
        return prevs.filter((prev) => prev !== removeRowsfield);
      });

      setValue("selectedRows", {
        ...selectedRows,
        [removeRowsfield]: false,
      });

      remove(index);
    }
  };

  const handleSave = () => {
    handleSubmit((formValues) => {
      const payLoad = filterPayLoad(formValues);

      const sumOfAdjustment = () => {
        if (isOnlyOneAdjustmentSelected) {
          const totalValues = Object.values(calculatedValues);

          return sum(totalValues);
        }

        return 0;
      };

      const isAdjustmentCorrect =
        sumOfAdjustment() < toRange && isDependencySelected;

      const result = totalSum === toRange && totalSum > fromRange;

      if (result || (isOnlyOneAdjustmentSelected && isAdjustmentCorrect)) {
        mutate({ salary_component_allocations: payLoad });
      } else {
        toasts.error({
          title: errorMessage,
        });
      }
    })();
  };

  return (
    <FormProvider {...formMethods}>
      <Stack gap="20px" width="100%">
        <Box sx={{ width: "100%", borderRadius: "4px", background: iron[600] }}>
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
                disabled={salaryRanges?.length === 0}
                onClick={() => onDialogOpen("add")}
              >
                Edit Component
              </Button>
            </Stack>
          </PadBox>
        </Box>

        {isLoading ? (
          <Skeleton height={30} animation="wave" variant="rounded" />
        ) : (
          <Typography variant="h6" sx={{ color: slate[300] }}>
            {range ?? "No Salary Range Found."}
          </Typography>
        )}

        {salaryRange && (
          <>
            <Stack
              gap="20px"
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
                    {HEADERS.map((header) => (
                      <TableCell key={uuidv4()}>{header}</TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                {isComponentListPending
                  ? Array.from({ length: 8 }, () => (
                      <TableSkeleton key={uuidv4()} />
                    ))
                  : fields.map((field, index) => {
                      return (
                        <SalaryStructureComponentForm
                          key={field.id}
                          salaryRange={salaryRange}
                          calculatedValues={calculatedValues}
                          index={index}
                          isReset={isReset}
                          setIsReset={setIsReset}
                          isLoading={isComponentListPending}
                          isOnlyOneAdjustmentSelected={
                            isOnlyOneAdjustmentSelected
                          }
                          handleRemoveRow={() =>
                            handleRemoveRow(
                              index,
                              field.salary_component_code ?? ""
                            )
                          }
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
                {salaryRangeId ? "Update" : "Save"}
              </Button>
            </Stack>
          </>
        )}
      </Stack>

      {openedDialog && dialogRenderer[openedDialog]}
    </FormProvider>
  );
};
