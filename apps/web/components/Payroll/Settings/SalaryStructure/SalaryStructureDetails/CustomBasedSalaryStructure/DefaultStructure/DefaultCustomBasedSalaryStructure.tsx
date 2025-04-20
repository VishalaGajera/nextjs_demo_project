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
import { capitalize } from "lodash";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { useDisabledButtonsCache } from "../../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { useDialogActions } from "../../../../../../../hooks/useDialogActions";
import {
  submitButtonId,
  useEnableDisableButtonToggle,
} from "../../../../../../../hooks/useEnableDisableButtonToggle";
import { salaryStructureKeys } from "../../../../../../../queryKeysFactories/SalaryStructure";
import type { DialogRenderer } from "../../../../../../../types/dialogs";
import { onError } from "../../../../../../../utils/errors";
import { EditAction } from "../../../../../../common/EditAction";
import { AddSalaryStructureComponentDialog } from "../../RangeBasedSalaryStructure/Add/SalaryRangeRightModule/Dialogs/AddSalaryStructureComponentDialog";
import { useGetSalaryStructureComponentList } from "../../RangeBasedSalaryStructure/Add/SalaryRangeRightModule/SalaryStructureComponentList/Hooks/useGetSalaryComponentList";
import { DefaultStructureComponentForm } from "../DefaultStructure/DefaultStructureComponentForm";
import { useDefaultUpdateCustomSalaryComponent } from "../Edit/hook/useDefaultUpdateCustomSalaryComponent";
import { useGetCustomSalaryStructureById } from "../Edit/hook/useGetCustomSalaryStructureById";
import { getDefaultSortedSalaryComponentAllocations } from "./helper";

const defaultCustomTableHeaders = ["Component Name", "Action"];

type DefaultCustomBasedSalaryStructureProps = {
  ssId: string;
  csId: string;
  pageType: "view" | "edit";
};

export const defaultCustomSalaryComponentAllocationsSchema = z.object({
  selectedRows: z.record(z.boolean().optional()).nullable().optional(),
  salary_component_allocations: z.array(
    z.object({
      id: z.string().optional().nullable(),
      salary_component_id: z.string().refine((value) => !!value, {
        message: "common.required",
      }),
      salary_component_code: z.string(),
    })
  ),
  salary_structure_name: z
    .string()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
  description: z.string().max(255, "common.maxLength").nullable().optional(),
});

export type DefaultCustomSalaryComponentAllocationsType = z.infer<
  typeof defaultCustomSalaryComponentAllocationsSchema
>;

export const DefaultCustomBasedSalaryStructure = ({
  ssId,
  csId,
  pageType,
}: DefaultCustomBasedSalaryStructureProps) => {
  const theme = useTheme();

  const { t } = useTranslation();

  const router = useRouter();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const [isReset, setIsReset] = useState<boolean>(true);

  const { iron, slate } = theme.palette.app.color;

  const searchParams = useSearchParams();

  const interval = searchParams.get("interval") ?? "";

  const tab = searchParams.get("tab") ?? "";

  const {
    data: { data: earningComponentList },
  } = useGetSalaryStructureComponentList();

  const { data: customSalaryDetailsById, isLoading } =
    useGetCustomSalaryStructureById({ ssId, csId });

  const {
    salary_structure_name: salaryStructureName,
    salary_component_allocations: defaultSalaryComponentAllocations = [],
    description: salaryStructureDescription,
  } = customSalaryDetailsById ?? {};

  const defaultCustomSalaryAllocations = defaultSalaryComponentAllocations?.map(
    (component) => {
      return {
        id: component.id,
        salary_component_id: component.salary_component_id,
        salary_component_name: component.salary_component.component_name,
        salary_component_code: component.salary_component.component_code,
      };
    }
  );

  const earningComponentDefaultOrder = useMemo(() => {
    return earningComponentList.map((list) => list.earning_component_code);
  }, [earningComponentList]);

  const sortedDefaultCustomSalary = getDefaultSortedSalaryComponentAllocations({
    salaryComponentAllocations: defaultCustomSalaryAllocations,
    earningComponentDefaultOrder,
  });

  const values = {
    salary_component_allocations: sortedDefaultCustomSalary,
    salary_structure_name: salaryStructureName ?? null,
    salaryStructureDescription,
  };

  const formMethods = useForm<DefaultCustomSalaryComponentAllocationsType>({
    values,
    mode: "all",
    resolver: zodResolver(defaultCustomSalaryComponentAllocationsSchema),
  });

  const {
    watch,
    handleSubmit,
    setValue,
    control,
    formState: { errors, dirtyFields },
  } = formMethods;

  useEnableDisableButtonToggle({
    errors,
    isFormChanged: !!Object.keys(dirtyFields).length,
    buttonId: submitButtonId,
  });

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const selectedRows = watch("selectedRows") ?? {};

  const salaryComponentAllocations = watch("salary_component_allocations");

  const queryClient = useQueryClient();

  const goBack = () => {
    router.push(
      `/payroll/settings/salary-structure/salary-structure-details/${ssId}?interval=${interval}`
    );
  };

  const { fields, remove } = useFieldArray({
    name: "salary_component_allocations",
    control,
  });

  const { mutate, isPending } = useDefaultUpdateCustomSalaryComponent({
    csId,
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
        onError(error);
      },
    },
  });

  const onEditDefaultCustomBasedSalaryStructure = () => {
    handleSubmit((formValues) => {
      const filteredAddSalaryComponentIds =
        formValues.salary_component_allocations.filter(
          (item) => item.salary_component_id
        );

      const addSalaryComponentIds = filteredAddSalaryComponentIds.map(
        (filteredAddSalaryComponent) =>
          filteredAddSalaryComponent.salary_component_id
      );

      const defaultSalaryStructurePayload = {
        salary_component_ids: addSalaryComponentIds,
      };

      if (defaultSalaryStructurePayload) {
        mutate(defaultSalaryStructurePayload);
      }
    })();
  };

  const handleRemoveRow = (index: number, removeRowsField?: string) => {
    if (removeRowsField) {
      setValue("selectedRows", {
        ...selectedRows,
        [removeRowsField]: false,
      });

      remove(index);
    }
  };

  const existingComponent = useMemo(() => {
    return defaultSalaryComponentAllocations.map(
      (allocation) => allocation.salary_component.component_code
    );
  }, [customSalaryDetailsById]);

  const componentCodes = useMemo(() => {
    const filteredRows = Object.entries(selectedRows).filter(
      ([, value]) => value === true
    );

    return filteredRows.map(([key]) => key);
  }, [Object.values(selectedRows), salaryComponentAllocations]);

  const onAddSalaryStructureComponent = () => {
    const selectedComponents = earningComponentList.filter(
      (selectedComponent) => {
        return componentCodes.includes(
          selectedComponent.earning_component_code
        );
      }
    );

    const selectedSalaryComponentAllocations: DefaultCustomSalaryComponentAllocationsType["salary_component_allocations"] =
      selectedComponents.map((selectedComponent) => {
        return {
          salary_component_code: selectedComponent.earning_component_code,
          salary_component_id: selectedComponent.id,
          salary_component_name: selectedComponent.earning_component_name,
        };
      });

    const filterSalaryComponentAllocations =
      selectedSalaryComponentAllocations.filter(
        (filterSalaryComponentAllocation) => {
          return !existingComponent.includes(
            filterSalaryComponentAllocation.salary_component_code
          );
        }
      );

    const allSalaryComponentAllocations = [
      ...(defaultCustomSalaryAllocations.length
        ? defaultCustomSalaryAllocations
        : []),
      ...(filterSalaryComponentAllocations.length
        ? filterSalaryComponentAllocations
        : []),
    ];

    setValue("salary_component_allocations", allSalaryComponentAllocations);

    onDialogClose();
  };

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddSalaryStructureComponentDialog
        open
        onAddSalaryStructureComponent={onAddSalaryStructureComponent}
        savedSalaryComponent={existingComponent}
        onClose={onDialogClose}
        formType="custom"
        pageType="Edit"
      />
    ),
  };

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  useEffect(() => {
    const selectedAllRows: Record<string, boolean> = {};

    defaultSalaryComponentAllocations.forEach((component) => {
      selectedAllRows[component.salary_component.component_code] = true;
    });

    setValue("selectedRows", selectedAllRows);
  }, [customSalaryDetailsById]);

  const { salary_structure_name, description } = errors;

  const pageTitle = `${pageType === "view" ? "View" : "Edit"} ${capitalize(interval)}`;

  return (
    <>
      <Box bgcolor={iron[600]} borderRadius="4px">
        <PadBox padding={{ padding: "15px" }}>
          <Typography color={iron[400]} variant="h6">
            {pageTitle} Custom Based Salary Structure
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
                  name="salary_structure_name"
                  error={!!salary_structure_name}
                  helperText={errorMessages(salary_structure_name?.message)}
                  disabled
                  loading={isLoading}
                />

                <TextField
                  control={control}
                  label="Description"
                  placeholder="Description"
                  name="description"
                  error={!!description}
                  helperText={errorMessages(description?.message)}
                  disabled
                  loading={isLoading}
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
                  disabled={pageType === "view"}
                  startIcon={<Add />}
                  onClick={() => onDialogOpen("add")}
                >
                  Edit Component
                </Button>
              </Stack>
            </PadBox>
          </Box>

          <Box
            sx={{
              width: "100%",
              overflowY: "auto",
              borderRadius: "4px",
              background: iron[600],
            }}
          >
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: slate[700] }}>
                  {defaultCustomTableHeaders.map((header) => (
                    <TableCell key={uuidv4()}>{header}</TableCell>
                  ))}
                </TableRow>
              </TableHead>

              {fields.map((field, index) => {
                return (
                  <DefaultStructureComponentForm
                    isReset={isReset}
                    pageType={pageType}
                    handleRemoveRow={() =>
                      handleRemoveRow(index, field.salary_component_code)
                    }
                    key={field.id}
                    setIsReset={setIsReset}
                    index={index}
                    isLoading={isLoading}
                  />
                );
              })}
            </Table>
          </Box>

          <Stack direction="row" width="100%" justifyContent="end" gap="5px">
            <Button variant="outlined" onClick={goBack}>
              Cancel
            </Button>

            <EditAction
              loading={isPending}
              disabled={isDisabled()}
              onClick={onEditDefaultCustomBasedSalaryStructure}
            />
          </Stack>
        </Stack>

        {openedDialog && dialogRenderer[openedDialog]}
      </FormProvider>
    </>
  );
};
