import { DeleteAction, TextField } from "@codezee/sixtify-brahma";
import { Skeleton, TableBody, TableCell, TableRow } from "@mui/material";
import type { Dispatch, SetStateAction } from "react";
import { useFormContext } from "react-hook-form";
import { type SalaryComponentAllocationsType } from "../../RangeBasedSalaryStructure/Add/SalaryRangeRightModule/SalaryStructureRightModule";

type DefaultStructureComponentProps = {
  isLoading: boolean;
  index: number;
  handleRemoveRow?: (index: number, field?: string) => void;
  isReset?: boolean;
  setIsReset?: Dispatch<SetStateAction<boolean>>;
  pageType: "view" | "edit";
};

export const DefaultStructureComponentForm = ({
  isLoading = false,
  index,
  handleRemoveRow,
  pageType,
}: DefaultStructureComponentProps) => {
  const { control, watch } = useFormContext<SalaryComponentAllocationsType>();

  const salaryComponentAllocations = watch("salary_component_allocations");

  const indexedItem = salaryComponentAllocations[index];

  const isViewMode = pageType === "view";

  const isEditMode = pageType === "edit";

  return (
    <TableBody>
      <TableRow sx={{ verticalAlign: "baseline" }}>
        <TableCell
          sx={{
            verticalAlign: "top !important",
            width: "90%",
          }}
        >
          {isLoading ? (
            <Skeleton height={20} width={150} />
          ) : (
            <TextField
              loading={isLoading}
              control={control}
              disabled={isViewMode || isEditMode}
              name={`salary_component_allocations.${index}.salary_component_name`}
            />
          )}
        </TableCell>

        <TableCell
          sx={{
            verticalAlign: "top !important",
            width: "50%",
          }}
        >
          {indexedItem?.salary_component_code !== "BASIC" && (
            <DeleteAction
              disabled={isViewMode}
              onClick={() => handleRemoveRow && handleRemoveRow(index)}
            />
          )}
        </TableCell>
      </TableRow>
    </TableBody>
  );
};
