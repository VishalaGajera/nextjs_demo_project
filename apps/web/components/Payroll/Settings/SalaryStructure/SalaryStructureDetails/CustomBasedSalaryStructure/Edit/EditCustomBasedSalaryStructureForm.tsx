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
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import { useDisabledButtonsCache } from "../../../../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { useDialogActions } from "../../../../../../../hooks/useDialogActions";
import {
  submitButtonId,
  useEnableDisableButtonToggle,
} from "../../../../../../../hooks/useEnableDisableButtonToggle";
import { salaryStructureKeys } from "../../../../../../../queryKeysFactories/SalaryStructure";
import type { DialogRenderer } from "../../../../../../../types/dialogs";
import { EditAction } from "../../../../../../common/EditAction";
import { AddSalaryStructureComponentDialog } from "../../RangeBasedSalaryStructure/Add/SalaryRangeRightModule/Dialogs/AddSalaryStructureComponentDialog";
import { SalaryStructureComponentForm } from "../../RangeBasedSalaryStructure/Add/SalaryRangeRightModule/SalaryStructureComponent/SalaryStructureComponentForm";
import { useGetSalaryStructureComponentList } from "../../RangeBasedSalaryStructure/Add/SalaryRangeRightModule/SalaryStructureComponentList/Hooks/useGetSalaryComponentList";
import {
  customSalaryComponentAllocationsSchema,
  type CustomSalaryComponentAllocationsType,
} from "../Add/AddCustomBasedSalaryStructure";

import { onError } from "../../../../../../../utils/errors";
import {
  addCustomSalaryStructure,
  editCustomSalaryStructure,
  sortSalaryComponentsByOrder,
} from "../utils/helper";
import { useEditCustomSalaryComponent } from "./hook/useEditCustomSalaryComponent";

const HEADERS = [
  "Component Name",
  "Calculation Type",
  "Field Data",
  "Calculation On",
  "Action",
];

export type EditCustomBasedSalaryStructureFormProps = {
  defaultValues: CustomSalaryComponentAllocationsType;
  ssId: string;
  csId: string;
  isLoading: boolean;
};

export const EditCustomBasedSalaryStructureForm = ({
  defaultValues,
  ssId,
  isLoading,
  csId,
}: EditCustomBasedSalaryStructureFormProps) => {
  const theme = useTheme();

  const { t } = useTranslation();

  const router = useRouter();

  const { onDialogClose, onDialogOpen, openedDialog } = useDialogActions();

  const [isReset, setIsReset] = useState<boolean>(false);

  const [componentCodes, setComponentCodes] = useState<string[]>([]);

  const { iron, slate } = theme.palette.app.color;

  const searchParams = useSearchParams();

  const interval = searchParams.get("interval") ?? "";

  const tab = searchParams.get("tab") ?? "";

  const queryClient = useQueryClient();

  const [existingComponentCodes, setExistingComponentCodes] = useState<
    string[]
  >([]);

  const {
    data: { data: earningComponentList },
  } = useGetSalaryStructureComponentList();

  const formMethods = useForm<CustomSalaryComponentAllocationsType>({
    values: defaultValues,
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

  useEnableDisableButtonToggle({
    errors,
    isFormChanged: !!Object.keys(dirtyFields).length,
    buttonId: submitButtonId,
  });

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const selectedRows = watch("selectedRows");

  const salaryComponentAllocations = watch("salary_component_allocations");

  const savedSalaryComponent = useMemo(() => {
    return salaryComponentAllocations.map((component) => {
      return component.salary_component_code;
    });
  }, [defaultValues]);

  const isOnlyOneAdjustmentSelected =
    salaryComponentAllocations.filter(
      (component) => component.calculation_type === "adjustment"
    ).length === 1;

  const goBack = () => {
    router.push(
      `/payroll/settings/salary-structure/salary-structure-details/${ssId}?interval=${interval}&list=custom`
    );
  };

  const { fields, remove } = useFieldArray({
    name: "salary_component_allocations",
    control,
  });

  const { mutate, isPending } = useEditCustomSalaryComponent({
    csId,
    ssId,
    options: {
      onSuccess: (response) => {
        queryClient.invalidateQueries({
          queryKey: salaryStructureKeys.getSalaryComponentsList(
            ssId,
            interval,
            tab
          ),
        });

        toasts.success({
          title: response.message,
        });

        goBack();
      },
      onError: (error) => {
        onError(error, setError);
      },
    },
  });

  const onEditCustomBasedSalaryStructureForm = () => {
    handleSubmit((formValues) => {
      const finalPayload = editCustomSalaryStructure({
        defaultCustomSalaryAllocations:
          defaultValues.salary_component_allocations,
        dirtyFields,
        formValues,
      });

      if (finalPayload) {
        mutate(finalPayload);
      }
    })();
  };

  const handleRemoveRow = (index: number, removeRowsField: string) => {
    setExistingComponentCodes((previous) =>
      previous.filter((prev) => prev !== removeRowsField)
    );

    setValue("selectedRows", {
      ...selectedRows,
      [removeRowsField]: false,
    });

    remove(index);
  };

  useEffect(() => {
    const existingComponent = defaultValues.salary_component_allocations.map(
      (allocation) => allocation.salary_component_code
    );

    setExistingComponentCodes(existingComponent);
  }, [defaultValues]);

  const earningComponentCodes = useMemo(() => {
    return earningComponentList.map((item) => item.earning_component_code);
  }, [earningComponentList]);

  useMemo(() => {
    if (!selectedRows) {
      return [];
    }

    const selectedComponentCodes = Object.entries(selectedRows).map(
      ([key, value]) => {
        if (value) {
          return key;
        }
      }
    );

    const selectedComponentRows = selectedComponentCodes.filter(
      (codes) => codes !== undefined
    );

    setComponentCodes(selectedComponentRows);
  }, [JSON.stringify(selectedRows)]);

  const onAddSalaryStructureComponent = () => {
    const filteredSalaryComponentAllocations = addCustomSalaryStructure({
      earningComponentList,
      savedSalaryComponent,
      defaultCustomSalaryAllocationsValues: salaryComponentAllocations,
      componentCodes,
    });

    const sortedSalaryComponentAllocations = sortSalaryComponentsByOrder({
      earningComponentListOrder: earningComponentCodes,
      components: filteredSalaryComponentAllocations,
    });

    setValue("salary_component_allocations", sortedSalaryComponentAllocations);

    setIsReset(false);

    setComponentCodes([]);

    onDialogClose();
  };

  const dialogRenderer: DialogRenderer = {
    add: (
      <AddSalaryStructureComponentDialog
        open
        onAddSalaryStructureComponent={onAddSalaryStructureComponent}
        savedSalaryComponent={existingComponentCodes}
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
    const allSelectedRows: Record<string, boolean> = {};

    salaryComponentAllocations.forEach((allocations) => {
      allSelectedRows[allocations.salary_component_code] = true;
    });

    setValue("selectedRows", allSelectedRows);
  }, [salaryComponentAllocations]);

  const { salary_structure_name, description } = errors;

  return (
    <FormProvider {...formMethods}>
      <Stack gap="10px">
        <Box sx={{ borderRadius: "4px", background: iron[600] }}>
          <PadBox padding={{ padding: "15px" }}>
            <FormGridLayout columns={3}>
              <TextField
                control={control}
                label="Structure Name"
                placeholder="Structure Name"
                name="salary_structure_name"
                error={!!salary_structure_name}
                helperText={errorMessages(salary_structure_name?.message)}
                loading={isLoading}
              />

              <TextField
                control={control}
                label="Description"
                placeholder="Description"
                name="description"
                error={!!description}
                helperText={errorMessages(description?.message)}
                loading={isLoading}
              />
            </FormGridLayout>
          </PadBox>
        </Box>

        <Box sx={{ borderRadius: "4px", background: iron[600] }}>
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
                Edit Component
              </Button>
            </Stack>
          </PadBox>
        </Box>

        <Box
          sx={{
            maxHeight: "calc(95vh - 340px)",
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

            {fields.map((field, index) => {
              return (
                <SalaryStructureComponentForm
                  formType="custom"
                  isReset={isReset}
                  handleRemoveRow={() =>
                    handleRemoveRow(index, field.salary_component_code)
                  }
                  key={field.id}
                  setIsReset={setIsReset}
                  calculatedValues={{}}
                  index={index}
                  isOnlyOneAdjustmentSelected={isOnlyOneAdjustmentSelected}
                  isLoading={isLoading}
                />
              );
            })}
          </Table>
        </Box>

        <Stack direction="row" justifyContent="end" gap="5px">
          <Button variant="outlined" onClick={goBack}>
            Cancel
          </Button>

          <EditAction
            loading={isPending}
            disabled={isDisabled()}
            onClick={onEditCustomBasedSalaryStructureForm}
          />
        </Stack>
      </Stack>

      {openedDialog && dialogRenderer[openedDialog]}
    </FormProvider>
  );
};
