import { CheckBox, type Option } from "@codezee/sixtify-brahma";
import { Typography, useTheme } from "@mui/material";
import type { Control, FieldErrors, FieldValues, Path } from "react-hook-form";
import type { MasterCodeOptionValues } from "../constant";

type CheckBoxCellRendererProps<T extends FieldValues> = {
  fieldName: keyof T; // Dynamically infer the key from the provided type
  node: { rowIndex: number };
  control: Control<T>; // Dynamically handle the control for the form
  error: FieldErrors<T>; // Dynamically handle the errors
  errorMessage: string;
  loading: boolean;
  options: Option[];
  masterCodeKey: MasterCodeOptionValues;
};

export const CheckBoxCellRenderer = <T extends FieldValues>({
  node,
  error,
  errorMessage,
  loading,
  fieldName,
  control,
  masterCodeKey,
}: CheckBoxCellRendererProps<T>) => {
  const index = node.rowIndex ?? 0;

  const theme = useTheme();

  const { red } = theme.palette.app.color;

  return (
    <>
      <CheckBox
        name={`${masterCodeKey}.${index}.${String(fieldName)}` as Path<T>}
        control={control}
        size="small"
        loading={loading}
      />

      {error && (
        <Typography
          variant="caption"
          sx={{
            color: `${red[900]}`,
            whiteSpace: "pre",
            textWrap: "wrap",
          }}
        >
          {errorMessage}
        </Typography>
      )}
    </>
  );
};
