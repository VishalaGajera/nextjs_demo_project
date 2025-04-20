import { PadBox, PhoneInputField } from "@codezee/sixtify-brahma";
import type { Control, FieldErrors, FieldValues, Path } from "react-hook-form";
import type { MasterCodeOptionValues } from "../constant";

type PhoneInputFieldCellRendererProps<T extends FieldValues> = {
  fieldName: keyof T; // Dynamically infer the key from the provided type
  node: { rowIndex: number };
  control: Control<T>; // Dynamically handle the control for the form
  error: FieldErrors<T>; // Dynamically handle the errors
  errorMessage: string;
  loading: boolean;
  masterCodeKey: MasterCodeOptionValues;
};

export const PhoneInputFieldCellRenderer = <T extends FieldValues>({
  node,
  error,
  errorMessage,
  loading,
  fieldName,
  control,
  masterCodeKey,
}: PhoneInputFieldCellRendererProps<T>) => {
  const index = node.rowIndex ?? 0;

  return (
    //TODO: manish, below padding use for manage Phone Input in cell its compulsory required
    <PadBox padding={{ paddingRight: "2px" }}>
      <PhoneInputField
        name={`${masterCodeKey}.${index}.${String(fieldName)}` as Path<T>}
        control={control}
        loading={loading}
        required
        disableDropdown
        error={!!error}
        helperText={errorMessage}
      />
    </PadBox>
  );
};
