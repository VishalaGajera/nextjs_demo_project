import { CheckBox, PadBox } from "@codezee/sixtify-brahma";
import {
  Box,
  Grid,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { DateTime } from "luxon";
import { useEffect } from "react";
import type { Control, UseFormSetValue } from "react-hook-form";
import { z } from "zod";
import { dateFormat } from "../../../../utils/date";
import type { HolidaysList } from "./hooks/useGetHolidaysList";

export const HolidayListFormSchema = z.object({
  selectHolidays: z
    .array(z.object({ id: z.string(), value: z.boolean() }))
    .nullable()
    .optional(),
});

export type HolidayListFormFieldValues = z.infer<typeof HolidayListFormSchema>;
type HolidayGroupListFormProps = {
  control: Control<HolidayListFormFieldValues>;
  loading?: boolean;
  setValue: UseFormSetValue<HolidayListFormFieldValues>;
  holidaysList: HolidaysList[];
  isHolidayListLoading: boolean;
};
export const HolidayListForm = ({
  control,
  loading,
  setValue,
  holidaysList,
  isHolidayListLoading,
}: HolidayGroupListFormProps) => {
  const theme = useTheme();

  const { slate } = theme.palette.app.color;

  useEffect(() => {
    holidaysList?.forEach((_, index) => {
      if (holidaysList[index]) {
        const recommendedValue = holidaysList[index].is_recommended || false;

        const holidayListId = holidaysList[index].id;

        setValue(`selectHolidays.${index}.value`, recommendedValue);
        setValue(
          `selectHolidays.${index}.id`,
          recommendedValue === true ? holidayListId : ""
        );
      }
    });
  }, [holidaysList]);

  if (isHolidayListLoading) {
    return (
      <Stack gap="15px" marginTop="20px">
        <Skeleton
          height="40px"
          sx={{
            transform: "scale(1)",
          }}
          animation="wave"
        />
        <Skeleton
          height="40px"
          sx={{
            transform: "scale(1)",
          }}
          animation="wave"
        />
        <Skeleton
          height="40px"
          sx={{
            transform: "scale(1)",
          }}
          animation="wave"
        />
      </Stack>
    );
  }

  if (holidaysList?.length === 0) {
    return;
  }

  return (
    <>
      <PadBox padding={{ paddingTop: "10px" }}>
        <Typography sx={{ fontSize: "20px", fontWeight: 500 }}>
          Holidays
        </Typography>
      </PadBox>
      <Box
        sx={{
          border: "1px solid",
          borderRadius: "4px",
          borderColor: slate[700],
        }}
      >
        <Box
          sx={{
            backgroundColor: slate[700],
            borderRadius: "4px",
            p: 2,
          }}
        >
          <Grid container width="80%" marginX="auto" alignItems="center">
            <Grid item xs={8}>
              <Typography variant="body1" fontWeight="500">
                Holiday Name
              </Typography>
            </Grid>
            <Grid item xs={4} textAlign="center">
              <Typography variant="body1" fontWeight="500">
                Holiday Date
              </Typography>
            </Grid>
          </Grid>
        </Box>
        <Box sx={{ overflowY: "auto", maxHeight: "490px" }}>
          {holidaysList?.map((holiday, index) => (
            <Stack
              key={holiday.id}
              direction="row"
              width="90%"
              sx={{ p: 2 }}
              marginX="auto"
            >
              <CheckBox
                name={`selectHolidays.${index}.value`}
                control={control}
                size="small"
                loading={loading}
                onClick={() => {
                  setValue(`selectHolidays.${index}.id`, holiday.id);
                }}
              />
              <Grid container width="85%" marginX="auto" alignItems="center">
                <Grid item xs={8}>
                  <Typography>{holiday.name}</Typography>
                </Grid>
                <Grid item xs={4} textAlign="left">
                  <Typography>
                    {dateFormat(holiday.date, true)}
                    {` (${DateTime.fromISO(holiday.date).toFormat("cccc")})`}
                  </Typography>
                </Grid>
              </Grid>
            </Stack>
          ))}
        </Box>
      </Box>
    </>
  );
};
