import {
  DatePicker,
  FormRow,
  RadioGroupField,
  TextField,
} from "@codezee/sixtify-brahma";
import { t } from "i18next";
import { DateTime } from "luxon";
import type { Control, FieldErrors } from "react-hook-form";
import { PayScheduleAutoComplete } from "../../../../../../../../common/Autocomplete/EmployeeFinance/PayScheduleAutoComplete";
import type { SalarySetupSchemaType } from "./AddSalarySetupForm";

type CalculationByType = "fixed" | "monthly" | "daily" | "hourly" | "others";

export type HourlyCalculationType =
  | "pay_schedule_wise"
  | "employee_wise"
  | "shift_wise";

type CalculationTypeFieldsProps = {
  calculationType: CalculationByType;
  control: Control<SalarySetupSchemaType>;
  errors: FieldErrors<SalarySetupSchemaType>;
  companyId?: string;
  hourlyCalculationType?: HourlyCalculationType;
  employeeJoiningDate: string;
};

export const CalculationTypeFields = ({
  calculationType,
  control,
  companyId = "",
  employeeJoiningDate,
  hourlyCalculationType = "pay_schedule_wise",
  errors,
}: CalculationTypeFieldsProps) => {
  const errorMessage = (messageKey?: string) => {
    return messageKey && t(messageKey);
  };

  const { effective_from, pay_schedule_group_id, salary, target_hours } =
    errors.salary_setup ?? {};

  if (["fixed", "others"].includes(calculationType)) {
    return (
      <FormRow>
        <DatePicker
          label="Effective from"
          control={control}
          helperText={errorMessage(effective_from?.message)}
          error={!!effective_from?.message}
          minDate={DateTime.fromISO(employeeJoiningDate)}
          name="salary_setup.effective_from"
          required
        />

        <TextField
          control={control}
          name="salary_setup.salary"
          label="Fixed Salary"
          type="number"
          required
          helperText={errorMessage(salary?.message)}
          error={!!salary?.message}
          placeholder="Fixed Salary"
        />
      </FormRow>
    );
  }

  if (["monthly", "daily"].includes(calculationType)) {
    return (
      <FormRow>
        <PayScheduleAutoComplete
          control={control}
          name="salary_setup.pay_schedule_group_id"
          label="Pay Schedule"
          helperText={errorMessage(pay_schedule_group_id?.message)}
          error={!!pay_schedule_group_id?.message}
          placeholder="Pay Schedule"
          companyId={companyId}
          required
        />

        <DatePicker
          label="Effective from"
          control={control}
          helperText={errorMessage(effective_from?.message)}
          error={!!effective_from?.message}
          minDate={DateTime.fromISO(employeeJoiningDate)}
          name="salary_setup.effective_from"
          required
        />

        <TextField
          control={control}
          name="salary_setup.salary"
          type="number"
          label={
            calculationType === "monthly" ? "Monthly Salary" : "Daily Salary"
          }
          helperText={errorMessage(salary?.message)}
          error={!!salary?.message}
          placeholder={
            calculationType === "monthly" ? "Monthly Salary" : "Daily Salary"
          }
          required
        />
      </FormRow>
    );
  }

  if (calculationType === "hourly") {
    return (
      <>
        <RadioGroupField
          control={control}
          name="salary_setup.hourly_calculation_type"
          options={[
            {
              label: "Pay Schedule Wise",
              values: "pay_schedule_wise",
              disabled: false,
            },
            {
              label: "Employee Wise",
              values: "employee_wise",
              disabled: false,
            },
            {
              label: "Shift Wise",
              values: "shift_wise",
              disabled: false,
            },
          ]}
        />

        {["pay_schedule_wise", "employee_wise"].includes(
          hourlyCalculationType
        ) && (
          <FormRow>
            {hourlyCalculationType === "employee_wise" ? (
              <TextField
                control={control}
                name="salary_setup.target_hours"
                label="Target Hours"
                type="number"
                required
                helperText={errorMessage(target_hours?.message)}
                error={!!target_hours?.message}
                placeholder="Target Hours"
              />
            ) : (
              <PayScheduleAutoComplete
                control={control}
                name="salary_setup.pay_schedule_group_id"
                label="Pay Schedule"
                helperText={errorMessage(pay_schedule_group_id?.message)}
                error={!!pay_schedule_group_id?.message}
                placeholder="Pay Schedule"
                companyId={companyId}
                required
              />
            )}

            <DatePicker
              label="Effective from"
              control={control}
              required
              helperText={errorMessage(effective_from?.message)}
              error={!!effective_from?.message}
              name="salary_setup.effective_from"
              minDate={DateTime.fromISO(employeeJoiningDate)}
            />

            <TextField
              control={control}
              name="salary_setup.salary"
              type="number"
              label="Monthly Salary"
              required
              helperText={errorMessage(salary?.message)}
              error={!!salary?.message}
              placeholder="Monthly Salary"
            />
          </FormRow>
        )}

        {hourlyCalculationType === "shift_wise" && (
          <FormRow>
            <DatePicker
              label="Effective from"
              control={control}
              required
              minDate={DateTime.fromISO(employeeJoiningDate)}
              helperText={errorMessage(effective_from?.message)}
              error={!!effective_from?.message}
              name="salary_setup.effective_from"
            />

            <TextField
              control={control}
              name="salary_setup.salary"
              type="number"
              label="Monthly Salary"
              required
              helperText={errorMessage(salary?.message)}
              error={!!salary?.message}
              placeholder="Monthly Salary"
            />
          </FormRow>
        )}
      </>
    );
  }
};
