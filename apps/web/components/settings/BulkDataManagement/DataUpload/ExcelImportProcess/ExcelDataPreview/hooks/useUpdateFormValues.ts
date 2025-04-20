import { type Option } from "@codezee/sixtify-brahma";
import { useEffect, useRef } from "react";
import type {
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
  UseFormWatch,
} from "react-hook-form";
import type { ExcelRowsData } from "../../ExcelImportProcess";
import type { MasterCodeOptionValues } from "../constant";

type UseUpdateFormValuesProps<T extends FieldValues> = {
  excelRowsData: ExcelRowsData;
  watch: UseFormWatch<T>;
  setValue: UseFormSetValue<T>;
  options: Option[];
  field: string;
  loading?: boolean;
  masterCodeKey: MasterCodeOptionValues;
};

export const useUpdateFormValues = <T extends FieldValues>({
  excelRowsData,
  watch,
  setValue,
  options,
  field,
  loading,
  masterCodeKey,
}: UseUpdateFormValuesProps<T>) => {
  const previousOptionsRef = useRef<Option[]>();

  useEffect(() => {
    if (loading) {
      return;
    }

    // Skip if options haven't changed
    if (
      JSON.stringify(previousOptionsRef.current) === JSON.stringify(options)
    ) {
      return;
    }

    previousOptionsRef.current = options;

    // Only run if we have both data and options
    if (!excelRowsData.length) {
      return;
    }

    // Update all rows at once
    excelRowsData.forEach((_, index) => {
      const fieldPath = `${masterCodeKey}.${index}.${field}` as Path<T>;

      const currentValue = watch(fieldPath);

      if (currentValue && typeof currentValue === "string") {
        const matchingOption = options.find(
          (option) => option.label.toLowerCase() === currentValue.toLowerCase()
        );

        setValue(
          fieldPath,
          (matchingOption?.value ?? null) as PathValue<T, Path<T>>,
          { shouldValidate: true }
        );
      }
    });
  }, [options, setValue, excelRowsData.length, loading]); // Removed watch from dependencies
};
