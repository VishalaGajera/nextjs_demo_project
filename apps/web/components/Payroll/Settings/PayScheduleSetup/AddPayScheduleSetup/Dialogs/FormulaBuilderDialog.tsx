import {
  Button,
  DeleteAction,
  Dialog,
  TextField,
} from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  InputAdornment,
  InputLabel,
  Stack,
  Typography,
} from "@mui/material";
import { isEmpty } from "lodash";
import { type ForwardedRef, forwardRef, useImperativeHandle } from "react";
import {
  FormProvider,
  useForm,
  type UseFormGetValues,
  type UseFormSetError,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { v4 as uuidv4 } from "uuid";
import { z } from "zod";
import { validateFormula } from "../../../../../../utils/formulaValidate";
import { filterChangedFormFields } from "../../../../../../utils/helper";
import {
  getColorByVariant,
  getStatusLabel,
  optionsShortHands,
} from "../../../../../Transactions/Leave/LeaveOverview/LeaveDetails/LeaveBalance/colorVariant";
import { FormulaInstructionCard } from "./FormulaInstructionCard";

export const formulaBuilderSchema = (placeHoldersShortTypes: string[]) =>
  z.object({
    formula: z
      .string()
      .trim()
      .nullable()
      .superRefine((value, ctx) => {
        if (!value) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "common.required",
          });
        } else if (!validateFormula(value, placeHoldersShortTypes)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "common.invalidFormula",
          });
        }
      }),
  });

export type FormulaBuilderSchemaValues = z.infer<
  ReturnType<typeof formulaBuilderSchema>
>;

type FormulaBuilderDialogProps = {
  open: boolean;
  loading?: boolean;
  placeHolders: string[];
  placeHoldersShortTypes: string[];
  onClose: () => void;
  onCreateFormula: () => void;
  defaultValues?: FormulaBuilderSchemaValues;
};

export type FormulaBuilderRef = {
  getValues: UseFormGetValues<FormulaBuilderSchemaValues>;
  submitForm: (
    onSubmit: (formValues: Partial<FormulaBuilderSchemaValues>) => void
  ) => void;
  setError: UseFormSetError<FormulaBuilderSchemaValues>;
};

const formDefaultValues: FormulaBuilderSchemaValues = {
  formula: null,
};

export const FormulaBuilderDialog = forwardRef(
  (
    {
      open,
      onClose,
      placeHolders,
      onCreateFormula,
      placeHoldersShortTypes,
      defaultValues = formDefaultValues,
      loading = false,
    }: FormulaBuilderDialogProps,
    ref: ForwardedRef<FormulaBuilderRef>
  ) => {
    const { t } = useTranslation();

    const methods = useForm({
      values: defaultValues,
      resolver: zodResolver(formulaBuilderSchema(placeHoldersShortTypes)),
      mode: "all",
    });

    const {
      watch,
      setValue,
      setError,
      getValues,
      control,
      formState: { errors, dirtyFields },
      handleSubmit,
    } = methods;

    const formula = watch("formula");

    const errorMessages = (messageKey?: string) => {
      return messageKey && t(messageKey);
    };

    const handleFormulaUpdate = (value: string) => {
      const newFormula = `${formula ?? ""} ${value}`;

      setValue("formula", newFormula, {
        shouldDirty: true,
        shouldValidate: true,
      });
    };

    const handleDeleteFormula = () => {
      setValue("formula", "", {
        shouldDirty: true,
        shouldValidate: true,
      });
    };

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const filterFormValues = filterChangedFormFields(
            formValues,
            dirtyFields
          );

          onSubmit(filterFormValues);
        })();
      },
      setError,
      getValues,
    }));

    return (
      <Dialog
        maxWidth="md"
        onClose={onClose}
        open={open}
        isHideDividers
        title="Payable Days Calculation Config"
        actions={
          <Stack direction="row" gap="5px">
            <Button onClick={onClose} variant="outlined">
              Cancel
            </Button>

            <Button
              loading={loading}
              onClick={onCreateFormula}
              disabled={!isEmpty(errors) || isEmpty(dirtyFields)}
            >
              Save
            </Button>
          </Stack>
        }
      >
        <Stack gap="16px" direction="row">
          <Stack gap="10px" width="282px">
            <InputLabel>Daily Status Types</InputLabel>

            {placeHolders.map((placeHolder) => (
              <Box
                key={uuidv4()}
                sx={{
                  height: "50px",
                  display: "flex",
                  alignItems: "center",
                  border: `1px solid ${getColorByVariant(placeHolder)}`,
                  bgcolor: `${getColorByVariant(placeHolder, "light")}`,
                  borderRadius: "5px",
                  paddingX: "15px",
                  cursor: "pointer",
                }}
                onClick={() =>
                  handleFormulaUpdate(`[${optionsShortHands[placeHolder]}]`)
                }
              >
                <Typography variant="body2">{`${optionsShortHands[placeHolder]}  -  ${getStatusLabel(placeHolder)}`}</Typography>
              </Box>
            ))}
          </Stack>

          <Stack justifyContent="space-between" paddingBottom="10px">
            <FormProvider {...methods}>
              <TextField
                name="formula"
                control={control}
                label="Daily Status Types"
                loading={loading}
                required
                error={!!errors.formula}
                helperText={errorMessages(errors.formula?.message)}
                multiline
                sx={{ minWidth: "550px" }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <DeleteAction
                        size="small"
                        onClick={handleDeleteFormula}
                        disabled={!formula}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </FormProvider>

            <FormulaInstructionCard />
          </Stack>
        </Stack>
      </Dialog>
    );
  }
);

FormulaBuilderDialog.displayName = "FormulaBuilderDialog";
