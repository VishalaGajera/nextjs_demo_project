import { TextField } from "@codezee/sixtify-brahma";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Avatar,
  Grid,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { capitalize, isEmpty } from "lodash";
import type { ForwardedRef } from "react";
import { forwardRef, useImperativeHandle } from "react";
import type { UseFormSetError } from "react-hook-form";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { useEnableDisableButtonToggle } from "../../../../../hooks/useEnableDisableButtonToggle";
import type { LeaveBalanceSummaryData } from "../LeaveBalanceSummaryList/hooks/useGetLeaveBalanceSummaryList";

const LeaveBalanceFormSchema = z.object({
  leave_balance: z
    .array(
      z.object({
        leave_balance_id: z.string().uuid().nullable(),
        available_balance: z.union([z.number().nonnegative(), z.null()]),
      })
    )
    .min(1),
});

export type LeaveBalanceFormFieldValues = z.infer<
  typeof LeaveBalanceFormSchema
>;

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<LeaveBalanceFormFieldValues>) => void
  ) => void;
  setError: UseFormSetError<LeaveBalanceFormFieldValues>;
};

type BankShiftFormProps = {
  defaultValues?: LeaveBalanceFormFieldValues;
  loading?: boolean;
  latestLeaveBalanceData?: LeaveBalanceSummaryData;
};

const defaultLeaveBalance = [
  { leave_balance_id: null, available_balance: null },
];

const formDefaultValues = {
  leave_balance: defaultLeaveBalance,
};

export const LeaveBalanceForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      loading = false,
      latestLeaveBalanceData,
    }: BankShiftFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const theme = useTheme();

    const { slate } = theme.palette.app.color;

    const { t } = useTranslation();

    const methods = useForm({
      values: defaultValues,
      resolver: zodResolver(LeaveBalanceFormSchema),
      mode: "all",
    });

    const {
      setError,
      control,
      formState: { errors, dirtyFields },
      handleSubmit,
    } = methods;

    useEnableDisableButtonToggle({
      errors,
      isFormChanged: !isEmpty(dirtyFields),
    });

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        handleSubmit((formValues) => {
          const payload = {
            leave_balance: (dirtyFields.leave_balance ?? [])
              // eslint-disable-next-line sonarjs/no-nested-functions
              .map((_, index) => {
                return {
                  leave_balance_id:
                    formValues?.leave_balance[index]?.leave_balance_id ?? null,
                  available_balance:
                    formValues.leave_balance?.[index]?.available_balance ??
                    null,
                };
              })
              .filter(Boolean),
          };

          onSubmit(payload);
        })();
      },
      setError,
    }));

    const errorMessages = (messageKey?: string) => messageKey && t(messageKey);

    return (
      <FormProvider {...methods}>
        <Grid container spacing={2}>
          <Grid
            item
            xs={12}
            sx={{
              padding: "15px",
              display: "flex",
              gap: "10px",
              alignItems: "center",
              bgcolor: `${slate[800]}`,
              borderRadius: "5px",
            }}
          >
            <Avatar
              src={latestLeaveBalanceData?.avatar ?? ""}
              alt="Employee Photo"
              sx={{ width: 60, height: 60 }}
            />

            {loading ? (
              <Stack gap="5px">
                <Skeleton sx={{ width: "200px" }} />

                <Skeleton sx={{ width: "300px" }} />
              </Stack>
            ) : (
              <Stack>
                <Typography variant="subtitle1" fontWeight={500}>
                  {latestLeaveBalanceData?.employee_name}
                </Typography>

                <Typography variant="subtitle2" color={slate[900]}>
                  {`(${latestLeaveBalanceData?.employee_code})`}
                </Typography>
              </Stack>
            )}
          </Grid>

          <Grid item xs={4}>
            <Typography fontWeight={500}>Designation :</Typography>

            {loading ? (
              <Skeleton sx={{ width: "200px" }} />
            ) : (
              <Typography color={slate[500]}>
                {capitalize(latestLeaveBalanceData?.designation_name)}
              </Typography>
            )}
          </Grid>

          <Grid item xs={4}>
            <Typography fontWeight={500}>Department :</Typography>

            {loading ? (
              <Skeleton sx={{ width: "200px" }} />
            ) : (
              <Typography color={slate[500]}>
                {capitalize(latestLeaveBalanceData?.department_name)}
              </Typography>
            )}
          </Grid>

          <Grid item xs={4}>
            <Typography fontWeight={500}>Sub Department :</Typography>

            {loading ? (
              <Skeleton sx={{ width: "200px" }} />
            ) : (
              <Typography color={slate[500]}>
                {capitalize(latestLeaveBalanceData?.sub_department_name)}
              </Typography>
            )}
          </Grid>

          {latestLeaveBalanceData?.leave_balance.map((item, index) => (
            <Grid
              key={item.leave_type_id}
              item
              xs={6}
              sx={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <TextField
                control={control}
                name={`leave_balance.${index}.available_balance`}
                label={item.leave_type_name}
                type="number"
                loading={loading}
                sx={{ minWidth: "240px" }}
                defaultValue={item.available_balance}
                error={!!errors.leave_balance?.[index]?.available_balance}
                helperText={errorMessages(
                  errors.leave_balance?.[index]?.available_balance?.message
                )}
              />

              <Typography
                variant="subtitle2"
                color={slate[900]}
                paddingTop="30px"
              >{`/${item.annual_quota} Days`}</Typography>
            </Grid>
          ))}
        </Grid>
      </FormProvider>
    );
  }
);

LeaveBalanceForm.displayName = "LeaveBalanceForm";
