import { Button, Dialog, FormRow, TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { Stack } from "@mui/material";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { EditAction } from "../../../../../common/EditAction";
import type { ExcelTemplateFields } from "../../ExcelTemplateConfigurationForm";

const EditExcelTemplateFieldSchema = z.object({
  id: z.string(),
  field_name: z.string(),
  required: z.boolean(),
  selected: z.boolean(),
  template_field_name: z
    .string()
    .trim()
    .nullable()
    .refine((value) => !!value, {
      message: "common.required",
    }),
});

export type EditExcelTemplateFieldValues = z.infer<
  typeof EditExcelTemplateFieldSchema
>;

type EditExcelTemplateFieldDialogProps = {
  open: boolean;
  onClose: () => void;
  onEditSuccess: (values: ExcelTemplateFields[number]) => void;
  currentField: ExcelTemplateFields[number];
};

export const EditExcelTemplateFieldDialog = ({
  open,
  onClose,
  onEditSuccess,
  currentField,
}: EditExcelTemplateFieldDialogProps) => {
  const { t } = useTranslation();

  const {
    control,
    formState: { errors, dirtyFields },
    handleSubmit,
  } = useForm({
    values: currentField,
    resolver: zodResolver(EditExcelTemplateFieldSchema),
    mode: "all",
  });

  const errorMessages = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  const onSubmit = (formValues: ExcelTemplateFields[number]) => {
    onEditSuccess({ ...currentField, ...formValues });
  };

  return (
    <Dialog
      maxWidth="sm"
      onClose={onClose}
      open={open}
      title="Edit Industry"
      actions={
        <Stack direction="row" gap="5px">
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>

          <EditAction
            onClick={() => {
              handleSubmit(onSubmit)();
            }}
            disabled={
              Object.keys(errors ?? {}).length > 0 ||
              Object.keys(dirtyFields ?? {}).length === 0
            }
          />
        </Stack>
      }
    >
      <FormRow maxColumn={2}>
        <TextField
          name="field_name"
          control={control}
          label="Default Field Name"
          disabled
        />

        <TextField
          name="template_field_name"
          control={control}
          label="Template Field Name"
          required
          error={!!errors.template_field_name}
          helperText={errorMessages(errors.template_field_name?.message)}
        />
      </FormRow>
    </Dialog>
  );
};
