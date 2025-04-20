import type { Control, FieldErrors, FieldValues } from "react-hook-form";
import type { ButtonId } from "../app/context/DisabledButtonsCacheContext/buttonIds";
import { useDetectFormChange } from "./useDetectFormChange";
import { useEnableDisableButtonToggle } from "./useEnableDisableButtonToggle";

type useEnableDisableButtonProps<T extends FieldValues> = {
  control: Control<T>;
  defaultValues: T;
  errors: FieldErrors<T>;
  buttonId?: ButtonId;
};

export const useEnableDisableButton = <T extends FieldValues>({
  control,
  defaultValues,
  errors,
  buttonId,
}: useEnableDisableButtonProps<T>) => {
  const { isFormChanged } = useDetectFormChange(control, defaultValues);

  useEnableDisableButtonToggle({ errors, isFormChanged, buttonId });

  return { isFormChanged };
};
