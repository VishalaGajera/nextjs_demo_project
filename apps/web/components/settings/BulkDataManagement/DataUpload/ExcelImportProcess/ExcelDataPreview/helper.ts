import { toasts } from "@codezee/sixtify-brahma";
import type { FieldValues, UseFormReturn } from "react-hook-form";

type HasFormErrorsProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
};

export const hasFormErrors = <T extends FieldValues>({
  form,
}: HasFormErrorsProps<T>) => {
  const hasErrors = Object.keys(form.formState.errors ?? {}).length > 0;

  if (hasErrors) {
    toasts.error({
      title: "Please fix all errors before submitting",
    });
  }

  return hasErrors;
};
