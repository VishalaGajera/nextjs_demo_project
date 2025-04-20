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
import { dateFormat } from "../../../../../utils/date";
import type { HolidaysList } from "../../../../EmployeeManagement/Holiday/Dialog/hooks/useGetHolidaysList";
import type { AddBankHolidayYearFormFieldValues } from "./AddBankHolidayYearFrom";

type BankHolidayYearFormProps = {
  control: Control<AddBankHolidayYearFormFieldValues>;
  loading?: boolean;
  setValue: UseFormSetValue<AddBankHolidayYearFormFieldValues>;
  bankHolidaysList: HolidaysList[];
  isBankHolidayListLoading: boolean;
};

export const BankHolidayYearForm = ({
  control,
  loading,
  setValue,
  bankHolidaysList,
  isBankHolidayListLoading,
}: BankHolidayYearFormProps) => {
  const theme = useTheme();

  const { slate } = theme.palette.app.color;

  useEffect(() => {
    bankHolidaysList?.forEach((_, index) => {
      if (bankHolidaysList[index]) {
        const recommendedValue =
          bankHolidaysList[index].is_recommended || false;

        const bankHolidayListId = bankHolidaysList[index].id;

        setValue(`selectBankHolidays.${index}.value`, recommendedValue);
        setValue(
          `selectBankHolidays.${index}.id`,
          recommendedValue === true ? bankHolidayListId : ""
        );
      }
    });
  }, [bankHolidaysList]);

  if (isBankHolidayListLoading) {
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

  if (bankHolidaysList?.length === 0) {
    return;
  }

  return (
    <>
      <PadBox padding={{ paddingTop: "10px" }}>
        <Typography sx={{ fontSize: "20px", fontWeight: 500 }}>
          Bank Holidays
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
                Bank Holiday Name
              </Typography>
            </Grid>

            <Grid item xs={4} textAlign="center">
              <Typography variant="body1" fontWeight="500">
                Bank Holiday Date
              </Typography>
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ overflowY: "auto", maxHeight: "490px" }}>
          {bankHolidaysList?.map((bankHoliday, index) => (
            <Stack
              key={bankHoliday.id}
              direction="row"
              width="90%"
              sx={{ p: 2 }}
              marginX="auto"
            >
              <CheckBox
                name={`selectBankHolidays.${index}.value`}
                control={control}
                size="small"
                loading={loading}
                onClick={() => {
                  setValue(`selectBankHolidays.${index}.id`, bankHoliday.id);
                }}
              />

              <Grid container width="85%" marginX="auto" alignItems="center">
                <Grid item xs={8}>
                  <Typography>{bankHoliday.name}</Typography>
                </Grid>

                <Grid item xs={4} textAlign="left">
                  <Typography>
                    {dateFormat(bankHoliday.date, true)}

                    {` (${DateTime.fromISO(bankHoliday.date).toFormat("cccc")})`}
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
