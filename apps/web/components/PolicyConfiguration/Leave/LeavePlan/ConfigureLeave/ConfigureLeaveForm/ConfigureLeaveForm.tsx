import { zodResolver } from "@hookform/resolvers/zod";
import { merge } from "lodash";
import type { ForwardedRef } from "react";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import {
  type FieldErrors,
  FormProvider,
  useForm,
  type UseFormResetField,
  type UseFormSetError,
  type UseFormTrigger,
  type UseFormWatch,
} from "react-hook-form";
import { z } from "zod";
import { filterNestedChangedFormFields } from "../../../../../../utils/helper";
import {
  getLeaveAccrualOptions,
  getRemainingMonths,
  prepareLeaveApprovalTypeValues,
} from "../hooks/helper";
import type { LeaveConfigurePayload } from "../hooks/useSetupConfigureLeave";
import {
  LeaveAccrualForm,
  leaveAccrualFormDefaultValues,
  LeaveAccrualSchema,
  leaveQuotaSchema,
} from "./LeaveAccrualForm/LeaveAccrualForm";
import { LeaveAccrualProrateFormContainer } from "./LeaveAccrualProrateFormContainer/LeaveAccrualProrateFormContainer";
import {
  leaveProrateFirstMonthFormDefaultValues,
  LeaveProrateFirstMonthSchema,
  newJoinerRequestLeaveFromDefaultValues,
  NewJoinerRequestLeaveSchema,
} from "./LeaveAccrualProrateFormContainer/LeaveProrateFirstMonthForm/LeaveProrateFirstMonthForm";
import {
  leaveProrateLastMonthFormDefaultValues,
  LeaveProrateLastMonthFormSchema,
} from "./LeaveAccrualProrateFormContainer/LeaveProrateLastMonthForm/LeaveProrateLastMonthForm";
import { LeaveApplicationAndUsageFormContainer } from "./LeaveApplicationAndUsageFormContainer/LeaveApplicationAndUsageFormContainer";
import {
  leaveApplicationFormDefaultValues,
  LeaveApplicationInQuotaSchema,
  LeaveApplicationSchema,
} from "./LeaveApplicationAndUsageFormContainer/LeaveApplicationFom/LeaveApplicationFom";
import {
  leaveUsageFormDefaultValues,
  LeaveUsageSchema,
} from "./LeaveApplicationAndUsageFormContainer/LeaveUsageForm/LeaveUsageForm";
import {
  LeaveApprovalForm,
  LeaveApprovalFormDefaultValues,
  LeaveApprovalFormSchema,
} from "./LeaveApprovalForm/LeaveApprovalForm";
import {
  LeaveSandwichForm,
  LeaveSandwichFormDefaultValues,
  LeaveSandwichFormSchema,
} from "./LeaveSandwichForm/LeaveSandwichForm";
import {
  LeaveYearEndForm,
  LeaveYearEndFormDefaultValues,
  LeaveYearEndFormSchema,
} from "./LeaveYearEndForm/LeaveYearEndForm";

const ConfigureLeaveSchema = z
  .object({
    is_system_generated: z.boolean().optional(),
    leave_quota: z.intersection(
      leaveQuotaSchema,
      LeaveApplicationInQuotaSchema
    ),
    leave_accrual: LeaveAccrualSchema,
    leave_accrual_prorate: z.intersection(
      LeaveProrateFirstMonthSchema,
      LeaveProrateLastMonthFormSchema
    ),
    leave_application_and_usage: LeaveApplicationSchema,
    leave_restrictions: z.intersection(
      LeaveUsageSchema,
      NewJoinerRequestLeaveSchema
    ),
    leave_sandwich: LeaveSandwichFormSchema,
    leave_approval: LeaveApprovalFormSchema,
    year_end_processing: LeaveYearEndFormSchema,
  })
  .superRefine((data, ctx) => {
    const quotaLimit = data.leave_quota.quota_limit;

    const creditedLeaveExpiresDays =
      data.leave_accrual.credited_leave_expires_in_days;

    if (
      quotaLimit &&
      creditedLeaveExpiresDays &&
      quotaLimit < creditedLeaveExpiresDays
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["leave_accrual.credited_leave_expires_in_days"],
        message: "Days should not be for then quote limit.",
      });
    }
  });

export type ConfigureLeaveFormFieldValues = z.infer<
  typeof ConfigureLeaveSchema
>;

export type FormRef = {
  submitForm: (
    onSubmit: (formValues: Partial<LeaveConfigurePayload>) => void
  ) => void;
  setError: UseFormSetError<ConfigureLeaveFormFieldValues>;
  trigger: UseFormTrigger<ConfigureLeaveFormFieldValues>;
  errors: FieldErrors<Partial<ConfigureLeaveFormFieldValues>>;
  watch: UseFormWatch<ConfigureLeaveFormFieldValues>;
  resetField: UseFormResetField<ConfigureLeaveFormFieldValues>;
};

type ConfigurationFormProps = {
  selectedLeavePlanMonth: string;
  defaultValues?: Partial<ConfigureLeaveFormFieldValues>;
  configurationStep: string;
  leavePlanId: string;
  companyId: string;
  leaveTypeId: string;
  formType: string;
  disabled?: boolean;
};

const formDefaultValues: ConfigureLeaveFormFieldValues = {
  is_system_generated: false,
  leave_quota: {
    measure_unit: "day",
    quota_type: "unlimited",
    quota_limit: null,
    is_restrict_apply_leave_in_credited_year: false,
    has_restricted_leave_type_pairs: false,
    restricted_leave_type_ids: null,
  },
  leave_accrual: leaveAccrualFormDefaultValues,
  leave_accrual_prorate: {
    ...leaveProrateFirstMonthFormDefaultValues,
    ...leaveProrateLastMonthFormDefaultValues,
  },
  leave_application_and_usage: leaveApplicationFormDefaultValues,
  leave_restrictions: {
    ...leaveUsageFormDefaultValues,
    ...newJoinerRequestLeaveFromDefaultValues,
  },
  leave_sandwich: LeaveSandwichFormDefaultValues,
  leave_approval: LeaveApprovalFormDefaultValues,
  year_end_processing: LeaveYearEndFormDefaultValues,
};

export const ConfigureLeaveForm = forwardRef(
  (
    {
      defaultValues = formDefaultValues,
      configurationStep,
      selectedLeavePlanMonth,
      leavePlanId,
      companyId,
      leaveTypeId,
      formType,
      disabled = false,
    }: ConfigurationFormProps,
    ref: ForwardedRef<FormRef>
  ) => {
    const finalDefaultValues = merge({}, formDefaultValues, defaultValues);

    const formMethods = useForm({
      values: finalDefaultValues,
      resolver: zodResolver(ConfigureLeaveSchema),
      mode: "all",
    });

    const {
      setError,
      trigger,
      setValue,
      formState: { errors, dirtyFields },
      handleSubmit,
      watch,
      resetField,
    } = formMethods;

    useImperativeHandle(ref, () => ({
      submitForm(onSubmit) {
        // eslint-disable-next-line sonarjs/cognitive-complexity
        handleSubmit((formValues) => {
          const filterFormValues = filterNestedChangedFormFields(formValues, {
            ...dirtyFields,
            is_system_generated: formType == "edit" ? true : false,
            leave_quota: {
              ...dirtyFields.leave_quota,
              // Leave Accrual
              measure_unit: true,
              quota_type: true,
              is_restrict_apply_leave_in_credited_year: true,
              quota_limit:
                formValues.leave_quota?.quota_type === "limited" ? true : false,
              // leave Applications
              has_restricted_leave_type_pairs: true,
              restricted_leave_type_ids:
                formValues.leave_quota?.has_restricted_leave_type_pairs === true
                  ? true
                  : false,
            },
            leave_accrual: {
              ...dirtyFields.leave_accrual,
              accrual_type:
                formValues.leave_quota?.quota_type === "limited" ? true : false,
              accrual_frequency:
                formValues.leave_accrual?.accrual_type === "periodically" &&
                formValues.leave_quota?.quota_type === "limited"
                  ? true
                  : false,
              initial_accrual_start_day:
                formValues.leave_accrual?.accrual_type === "periodically" &&
                formValues.leave_quota?.quota_type === "limited"
                  ? true
                  : false,
              is_unevenly_accrued:
                formValues.leave_accrual?.accrual_type === "periodically" &&
                formValues.leave_quota?.quota_type === "limited"
                  ? true
                  : false,

              is_credited_leave_expires:
                formValues.leave_quota?.quota_type === "limited" ? true : false,
              credited_leave_expires_in_days: formValues.leave_accrual
                ?.is_credited_leave_expires
                ? true
                : false,
              is_accrual_stopped_in_long_leave:
                formValues.leave_accrual?.accrual_type === "periodically" &&
                formValues.leave_quota?.quota_type === "limited"
                  ? true
                  : false,
              total_long_leaves_limit_in_days: formValues.leave_accrual
                ?.is_accrual_stopped_in_long_leave
                ? true
                : false,
              long_leave_type_ids: formValues.leave_accrual
                ?.is_accrual_stopped_in_long_leave
                ? true
                : false,
              uneven_accrual_rates:
                formValues.leave_quota?.quota_type === "limited" &&
                formValues.leave_accrual?.is_unevenly_accrued &&
                formValues.leave_accrual?.accrual_frequency !== "yearly" &&
                formValues.leave_accrual?.accrual_type === "periodically"
                  ? true
                  : false,
              is_accrual_balance_capped:
                formValues.leave_accrual?.accrual_type === "periodically" &&
                formValues.leave_quota?.quota_type === "limited"
                  ? true
                  : false,
              max_accrual_balance_days: formValues.leave_accrual
                ?.is_accrual_balance_capped
                ? true
                : false,
              is_pro_rated:
                formValues.leave_quota?.quota_type === "limited" ? true : false,
              joined_on_or_before_day: formValues.leave_accrual?.is_pro_rated
                ? true
                : false,
            },
            ...(formValues.leave_quota?.quota_type === "limited" && {
              leave_accrual_prorate: {
                ...dirtyFields.leave_accrual_prorate,
                // first month form
                // eslint-disable-next-line sonarjs/no-nested-conditional
                is_prorate_in_first_month: formValues.leave_accrual
                  ?.is_unevenly_accrued
                  ? // eslint-disable-next-line sonarjs/no-nested-conditional
                    formValues.leave_accrual?.is_unevenly_accrued &&
                    formValues.leave_accrual?.accrual_type === "immediately"
                    ? true
                    : false
                  : true,
                joining_prorate_quota: formValues.leave_accrual_prorate
                  ?.is_prorate_in_first_month
                  ? true
                  : false,
                joining_prorated_credit_rules:
                  formValues.leave_accrual_prorate.joining_prorate_quota ===
                  "range_of_joining_date"
                    ? true
                    : false,
                is_leave_accrual_during_probation:
                  formValues.leave_accrual?.accrual_type === "periodically"
                    ? true
                    : false,
                leave_accrual_start_after_probation_quota:
                  formValues.leave_accrual?.accrual_type === "immediately" ||
                  formValues.leave_accrual_prorate
                    ?.is_leave_accrual_during_probation
                    ? false
                    : true,
                probation_end_prorate_quota:
                  formValues.leave_accrual?.accrual_type === "immediately" ||
                  formValues.leave_accrual_prorate
                    ?.is_leave_accrual_during_probation
                    ? false
                    : true,
                leave_accrual_during_probation_quota:
                  formValues.leave_accrual_prorate
                    ?.is_leave_accrual_during_probation &&
                  formValues.leave_accrual?.accrual_type === "periodically"
                    ? true
                    : false,
                days_to_start_accrual_after_joining:
                  formValues.leave_accrual_prorate
                    ?.leave_accrual_during_probation_quota == "after_days"
                    ? true
                    : false,
                days_to_start_accrual_after_probation:
                  formValues.leave_accrual_prorate
                    ?.leave_accrual_start_after_probation_quota == "after_days"
                    ? true
                    : false,
                probation_end_prorated_credit_rules:
                  formValues.leave_accrual_prorate
                    ?.probation_end_prorate_quota == "range_of_probation_end"
                    ? true
                    : false,
                // last month form
                allowed_leave_accrual_during_notice_period: true,
                exiting_leave_accrual_prorate_quota: formValues
                  .leave_accrual_prorate
                  ?.allowed_leave_accrual_during_notice_period
                  ? true
                  : false,
                exiting_prorated_credit_rules:
                  formValues.leave_accrual_prorate
                    ?.exiting_leave_accrual_prorate_quota ==
                  "based_on_range_of_date"
                    ? true
                    : false,
                leave_balance_round_off_type: true,
              },
            }),
            leave_application_and_usage: {
              ...dirtyFields.leave_application_and_usage,
              //leave application and usage > Application
              allow_half_day: true,
              is_document_required: true,
              document_required_after_days: formValues
                .leave_application_and_usage?.is_document_required
                ? true
                : false,
              // document_required_after_days;
              is_prior_notice_required: true,
              prior_notice_ranges: formValues.leave_application_and_usage
                ?.is_prior_notice_required
                ? true
                : false,
              is_enable_applying_previous_leaves: true,
              is_allow_applying_previous_leaves: formValues
                .leave_application_and_usage?.is_enable_applying_previous_leaves
                ? true
                : false,
              max_allowed_days_for_previous_leave: formValues
                .leave_application_and_usage?.is_allow_applying_previous_leaves
                ? true
                : false,
              is_require_max_prior_notice: true,
              max_prior_notice_days: formValues.leave_application_and_usage
                ?.is_require_max_prior_notice
                ? true
                : false,
              is_note_required: true,
            },
            leave_restrictions: {
              ...dirtyFields.leave_restrictions,
              // leave Prorate > first month form
              restrict_leave_before_days: true,
              days_after_leave_allowed: formValues.leave_restrictions
                ?.restrict_leave_before_days
                ? true
                : false,
              restriction_based_on: formValues.leave_restrictions
                ?.restrict_leave_before_days
                ? true
                : false,
              limit_leave_days_in_probation: true,
              max_leave_days_in_probation: formValues.leave_restrictions
                ?.limit_leave_days_in_probation
                ? true
                : false,
              // leave application and usage > usage form
              has_consecutive_days_limit: true,
              max_consecutive_days_allowed: formValues.leave_restrictions
                ?.has_consecutive_days_limit
                ? true
                : false,
              has_monthly_consumption_limit: true,
              max_leave_consumption_per_month_days: formValues
                .leave_restrictions?.has_monthly_consumption_limit
                ? true
                : false,
              restrict_month_end_leave: true,
              month_end_restrict_from_day: formValues.leave_restrictions
                ?.restrict_month_end_leave
                ? true
                : false,
              require_gap_between_leave_requests: true,
              min_gap_days: formValues.leave_restrictions
                ?.require_gap_between_leave_requests
                ? true
                : false,
              has_monthly_frequency_limit: true,
              max_instances_per_month: formValues.leave_restrictions
                ?.has_monthly_frequency_limit
                ? true
                : false,
              has_yearly_frequency_limit: true,
              max_instances_per_year: formValues.leave_restrictions
                ?.has_yearly_frequency_limit
                ? true
                : false,
            },
            leave_sandwich: {
              ...dirtyFields.leave_sandwich,
              include_weekly_off_in_leave: true,
              weekly_off_exceed_threshold_days: formValues.leave_sandwich
                ?.include_weekly_off_in_leave
                ? true
                : false,
              weekly_off_leave_days_consideration_type: formValues
                .leave_sandwich?.include_weekly_off_in_leave
                ? true
                : false,
              weekly_off_overlap_type: formValues.leave_sandwich
                ?.include_weekly_off_in_leave
                ? true
                : false,
              ignore_half_day_leave_for_weekly_off: formValues.leave_sandwich
                ?.include_weekly_off_in_leave
                ? true
                : false,
              include_holiday_in_leave: true,
              holiday_exceed_threshold_days: formValues.leave_sandwich
                ?.include_holiday_in_leave
                ? true
                : false,
              holiday_leave_days_consideration_type: formValues.leave_sandwich
                ?.include_holiday_in_leave
                ? true
                : false,
              holiday_overlap_type: formValues.leave_sandwich
                ?.include_holiday_in_leave
                ? true
                : false,
              ignore_half_day_leave_for_holiday: formValues.leave_sandwich
                ?.include_holiday_in_leave
                ? true
                : false,
              club_with_other_leave_type_penalization: true,
            },
            leave_approval: {
              ...dirtyFields.leave_approval,
              approval_levels: formValues.leave_approval.is_approval_required
                ? true
                : false,
            },
            year_end_processing: {
              ...dirtyFields.year_end_processing,
              year_end_processing_type: true,
              does_carryover_leave_expire: true,
              carryover_leaves_expire_in_days: formValues.year_end_processing
                .does_carryover_leave_expire
                ? true
                : false,
              year_around_encashment_ranges:
                formValues.year_end_processing?.year_end_processing_type ==
                  "carry_forward_than_encash" ||
                formValues.year_end_processing?.year_end_processing_type ==
                  "encash_than_carry_forward"
                  ? true
                  : false,
            },
          });

          const LeaveAndApprovalTypeValues =
            prepareLeaveApprovalTypeValues(filterFormValues);

          const payload = {
            ...filterFormValues,
            leave_approval: {
              ...filterFormValues.leave_approval,
              is_approval_required:
                formValues.leave_approval?.is_approval_required ?? false,
              ...(formValues.leave_approval?.is_approval_required && {
                skip_if_approver_does_not_exist:
                  formValues.leave_approval?.skip_if_approver_does_not_exist ??
                  false,
              }),
              approval_levels: LeaveAndApprovalTypeValues,
            },
          };

          onSubmit(payload);
        })();
      },
      setError,
      trigger,
      errors,
      watch,
      resetField,
    }));

    const formComponents: Record<string, JSX.Element> = {
      accrual: (
        <LeaveAccrualForm
          selectedLeavePlanMonth={selectedLeavePlanMonth}
          leavePlanId={leavePlanId}
          leaveTypeId={leaveTypeId}
          disabled={disabled || formType === "edit"}
        />
      ),
      "accrual-prorate": (
        <LeaveAccrualProrateFormContainer
          disabled={disabled}
          formType={formType}
        />
      ),
      "application-usage": (
        <LeaveApplicationAndUsageFormContainer
          leavePlanId={leavePlanId}
          leaveTypeId={leaveTypeId}
          disabled={disabled}
        />
      ),
      sandwich: <LeaveSandwichForm disabled={disabled} />,
      approval: <LeaveApprovalForm companyId={companyId} disabled={disabled} />,
      "year-end": <LeaveYearEndForm disabled={disabled} />,
    };

    const formRenderer = () =>
      formComponents[configurationStep] || formComponents["accrual"];

    const unevenAccrualRates =
      watch("leave_accrual.uneven_accrual_rates") ?? [];

    const hasValueRates = unevenAccrualRates.every((value) => value === null);

    const accrualRate = watch("leave_accrual.accrual_frequency") ?? "";

    const isUnevenlyAccrued = watch("leave_accrual.is_unevenly_accrued");

    const modifyLeavePlanMonth = selectedLeavePlanMonth.split(" - ")[0] ?? "";

    const months = getRemainingMonths(modifyLeavePlanMonth);

    useEffect(() => {
      if (accrualRate && isUnevenlyAccrued && hasValueRates) {
        const updatedUnevenAccrualRatesArray = Array(
          getLeaveAccrualOptions(accrualRate, months).length
        ).fill(null);

        return setValue(
          "leave_accrual.uneven_accrual_rates",
          updatedUnevenAccrualRatesArray
        );
      }
    }, [accrualRate, isUnevenlyAccrued]);

    return <FormProvider {...formMethods}>{formRenderer()}</FormProvider>;
  }
);

ConfigureLeaveForm.displayName = "ConfigureLeaveForm";
