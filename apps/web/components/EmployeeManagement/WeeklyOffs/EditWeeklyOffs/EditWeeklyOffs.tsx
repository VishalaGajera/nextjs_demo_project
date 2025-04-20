import { Button, PadBox, toasts } from "@codezee/sixtify-brahma";
import { Stack } from "@mui/material";
import { Fragment, useMemo, useRef } from "react";

import { useRouter } from "next/navigation";
import { useDisabledButtonsCache } from "../../../../app/context/DisabledButtonsCacheContext/DisabledButtonsCacheContext";
import { submitButtonId } from "../../../../hooks/useEnableDisableButtonToggle";
import { onError } from "../../../../utils/errors";
import { EditAction } from "../../../common/EditAction";
import type {
  DaysOfWeek,
  FormRef,
  WeeklyOffsFormFieldValues,
} from "../AddWeeklyOffs/WeeklyOffsForm";
import { daysOfWeek, WeeklyOffsForm } from "../AddWeeklyOffs/WeeklyOffsForm";
import { useEditWeeklyOffs } from "./hooks/useEditWeeklyOffs";
import { useGetWeeklyOff } from "./hooks/useGetWeeklyOff";

type EditWeeklyOffsProps = {
  weeklyOffId: string;
};

export const EditWeeklyOffs = ({ weeklyOffId }: EditWeeklyOffsProps) => {
  const router = useRouter();

  const formRef = useRef<FormRef>(null);

  const { isDisabled } = useDisabledButtonsCache(submitButtonId);

  const { data: weeklyOffsData, isPending: isPendingLatestweeklyOffsData } =
    useGetWeeklyOff({
      weeklyOffId,
    });

  const { mutate, isPending } = useEditWeeklyOffs({
    weeklyOffId,
    options: {
      onSuccess: (data) => {
        toasts.success({ title: data.message });
        router.push("/employee-management/weekly-offs");
      },
      onError: (error) => onError(error, formRef.current?.setError),
    },
  });

  const onEditWeeklyOffs = () => {
    formRef.current?.submitForm((formValues) => {
      mutate(formValues);
    });
  };

  const defaultValues = useMemo(() => {
    if (weeklyOffsData) {
      const days: DaysOfWeek = { ...daysOfWeek };

      Object.keys(weeklyOffsData.configuration).forEach((day) => {
        const dayKey = day as keyof typeof weeklyOffsData.configuration;

        const hasNonNullConfig = Object.values(
          weeklyOffsData.configuration[dayKey]
        ).some((value) => value !== null);

        if (hasNonNullConfig) {
          days[dayKey] = true;
        }
      });

      const weeklyOffsFormFieldValues: WeeklyOffsFormFieldValues = {
        company_id: weeklyOffsData.company_id,
        weekly_off_type_name: weeklyOffsData.weekly_off_type_name,
        description: weeklyOffsData.description,
        days,
        configuration: weeklyOffsData.configuration,
      };

      return weeklyOffsFormFieldValues;
    }
  }, [weeklyOffsData]);

  return (
    <Fragment>
      <WeeklyOffsForm
        ref={formRef}
        defaultValues={defaultValues}
        loading={isPendingLatestweeklyOffsData}
      />
      <PadBox padding={{ paddingRight: "20px" }}>
        <Stack direction="row" justifyContent="end" gap="10px">
          <Button
            variant="outlined"
            onClick={() => {
              router.push("/employee-management/weekly-offs");
            }}
          >
            Cancel
          </Button>

          <EditAction
            onClick={onEditWeeklyOffs}
            loading={isPending}
            disabled={isDisabled()}
          />
        </Stack>
      </PadBox>
    </Fragment>
  );
};
