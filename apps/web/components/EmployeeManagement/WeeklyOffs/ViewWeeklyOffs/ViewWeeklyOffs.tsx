import { Button } from "@codezee/sixtify-brahma";
import { Fragment, useMemo } from "react";

import { Box } from "@mui/material";
import { useRouter } from "next/navigation";
import type {
  DaysOfWeek,
  WeeklyOffsFormFieldValues,
} from "../AddWeeklyOffs/WeeklyOffsForm";
import { daysOfWeek, WeeklyOffsForm } from "../AddWeeklyOffs/WeeklyOffsForm";
import { useGetWeeklyOff } from "../EditWeeklyOffs/hooks/useGetWeeklyOff";

type ViewWeeklyOffsProps = {
  weeklyOffId: string;
};

export const ViewWeeklyOffs = ({ weeklyOffId }: ViewWeeklyOffsProps) => {
  const router = useRouter();

  const { data: weeklyOffsData, isPending: isPendingLatestweeklyOffsData } =
    useGetWeeklyOff({
      weeklyOffId,
    });

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

      const { company_id, weekly_off_type_name, description, configuration } =
        weeklyOffsData;

      const weeklyOffsFormFieldValues: WeeklyOffsFormFieldValues = {
        company_id,
        weekly_off_type_name,
        description,
        days,
        configuration,
      };

      return weeklyOffsFormFieldValues;
    }
  }, [weeklyOffsData]);

  return (
    <Fragment>
      <WeeklyOffsForm
        defaultValues={defaultValues}
        loading={isPendingLatestweeklyOffsData}
        disabled
      />

      <Box
        display="flex"
        justifyContent="flex-end"
        padding={{ paddingRight: "20px" }}
      >
        <Button
          variant="outlined"
          onClick={() => {
            router.push("/employee-management/weekly-offs");
          }}
        >
          Cancel
        </Button>
      </Box>
    </Fragment>
  );
};
