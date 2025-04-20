import { useMemo } from "react";
import type { FieldErrors } from "react-hook-form";
import { useDisabledButtonsCache } from "../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import {
  type ButtonId,
  buttonIds,
} from "../app/context/DisabledButtonsCacheContext/buttonIds";

type useEnableDisableButtonToggleProps = {
  errors: FieldErrors;
  isFormChanged: boolean;
  buttonId?: ButtonId;
};

export const submitButtonId = buttonIds.onSubmit;

export const editButtonId = buttonIds.onEdit;

export const useEnableDisableButtonToggle = ({
  errors,
  isFormChanged,
  buttonId = submitButtonId,
}: useEnableDisableButtonToggleProps) => {
  const { enable, disable, isDisabled } = useDisabledButtonsCache(buttonId);

  useMemo(() => {
    const hasErrors = Object.keys(errors ?? {}).length > 0;

    if (!hasErrors && isFormChanged && isDisabled()) {
      enable();
    } else if ((hasErrors || !isFormChanged) && !isDisabled()) {
      disable();
    }
  }, [errors, isFormChanged, isDisabled, enable, disable]);
};
