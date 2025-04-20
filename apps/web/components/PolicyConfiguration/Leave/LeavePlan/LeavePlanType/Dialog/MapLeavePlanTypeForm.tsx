import { CheckBox } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputLabel, Stack } from "@mui/material";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useEnableDisableButton } from "../../../../../../hooks/useEnableDisableButton";
import type { LeaveTypeOptionIds } from "./hooks/useAddMapLeavePlanType";
import type { LeavePlanTypeOption } from "./hooks/useGetLeavePlanTypeOptions";
import { MapLeavePlanTypeSkeletonForm } from "./MapLeavePlanTypeSkeletonForm";

const MapLeavePlanTypeFormSchema = z.object({
  leave_type_ids: z.array(
    z.object({
      id: z.string().nullable(),
      value: z.boolean(),
      is_blocked: z.boolean(),
    })
  ),
});

export type MapLeavePlanTypeFormFieldValues = z.infer<
  typeof MapLeavePlanTypeFormSchema
>;

type MapLeavePlanTypeFormProps = {
  defaultValues?: MapLeavePlanTypeFormFieldValues;
  loading?: boolean;
  leaveTypeOptions: LeavePlanTypeOption[];
  leaveTypeOptionLoading: boolean;
};

export type FormRef = {
  submitForm: (onSubmit: (formValues: LeaveTypeOptionIds) => void) => void;
  setError: UseFormSetError<MapLeavePlanTypeFormFieldValues>;
};

const formDefaultValues: MapLeavePlanTypeFormFieldValues = {
  leave_type_ids: [{ id: null, value: false, is_blocked: false }],
};

export const MapLeavePlanTypeForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
      leaveTypeOptions,
      leaveTypeOptionLoading,
    }: MapLeavePlanTypeFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const {
      control,
      setValue,
      setError,
      formState: { errors },
      handleSubmit,
    } = useForm({
      values: defaultValues,
      resolver: zodResolver(MapLeavePlanTypeFormSchema),
      mode: "all",
    });

    useEnableDisableButton({ control, defaultValues, errors });

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          if (formValues.leave_type_ids) {
            const selectedLeaveOptionsIds = formValues.leave_type_ids
              // eslint-disable-next-line sonarjs/no-nested-functions
              .filter((item) => item.value && !item.is_blocked)
              // eslint-disable-next-line sonarjs/no-nested-functions
              .map((item) => item.id ?? "");

            const leaveTypeIdPayload: LeaveTypeOptionIds = {
              leave_type_ids: selectedLeaveOptionsIds,
            };

            onSubmit(leaveTypeIdPayload);
          }
        })();
      },
      setError,
    }));

    if (leaveTypeOptionLoading) {
      return <MapLeavePlanTypeSkeletonForm />;
    }

    return (
      <Stack flexDirection="row" flexWrap="wrap" gap={4}>
        {leaveTypeOptions.map((item, index) => {
          return (
            <Stack
              gap="10px"
              flexDirection="row"
              key={item.id}
              alignItems="center"
              width="45%"
            >
              <CheckBox
                name={`leave_type_ids.${index}.value`}
                control={control}
                loading={loading}
                size="small"
                disabled={item.is_blocked}
                onClick={() => {
                  setValue(`leave_type_ids.${index}.id`, item.id);
                }}
              />

              <InputLabel>{item.name}</InputLabel>
            </Stack>
          );
        })}
      </Stack>
    );
  }
);

MapLeavePlanTypeForm.displayName = "MapLeavePlanTypeForm";
