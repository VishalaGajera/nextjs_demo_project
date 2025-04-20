import { isEmpty, sum } from "lodash";
import { DateTime } from "luxon";
import type {
  ConfigureLeaveFormFieldValues,
  FormRef,
} from "../ConfigureLeaveForm/ConfigureLeaveForm";
import type { LeaveConfigurePayload } from "./useSetupConfigureLeave";

type stepperLabelType =
  | "Leave Accrual"
  | "Leave Accrual Prorate"
  | "Leave Application & Usage"
  | "Leave Sandwich"
  | "Leave Approval"
  | "Leave Year end";

export const configurationFormSteps = (steps: string) => {
  switch (steps) {
    case "accrual":
      return "Leave Accrual";

    case "accrual-prorate":
      return "Leave Accrual Prorate";

    case "application-usage":
      return "Leave Application & Usage";

    case "sandwich":
      return "Leave Sandwich";

    case "approval":
      return "Leave Approval";

    case "year-end":
      return "Leave Year end";

    default:
      return "Leave Accrual";
  }
};

export const stepperLabel: stepperLabelType[] = [
  "Leave Accrual",
  "Leave Accrual Prorate",
  "Leave Application & Usage",
  "Leave Sandwich",
  "Leave Approval",
  "Leave Year end",
];

export const getStepperLabel = (leaveLimitType: string) => {
  const label =
    leaveLimitType == "limited"
      ? stepperLabel
      : stepperLabel.filter((label) => label !== "Leave Accrual Prorate");

  return label;
};

export const accrualRateLabel = (steps: string) => {
  switch (steps) {
    case "monthly":
      return "Month";

    case "quarterly":
      return "Quarterly";

    case "half_yearly":
      return "Half Yearly";

    case "yearly":
      return "Yearly";

    default:
      return "Month";
  }
};

export const accrualRateLabelV2 = (steps: string) => {
  switch (steps) {
    case "monthly":
      return "Month";

    case "quarterly":
      return "Quarter";

    case "half_yearly":
      return "Half Year";

    case "yearly":
      return "Year";

    default:
      return "Month";
  }
};

export const getLeaveAccrualOptions = (
  accrualRate: string,
  months: string[]
) => {
  switch (accrualRate) {
    case "monthly":
      return months;

    case "quarterly":
      return [
        "First Quarter",
        "Second Quarter",
        "Third Quarter",
        "Fourth Quarter",
      ];

    case "half_yearly":
      return ["First Half", "Second Half"];

    default:
      return [];
  }
};

export const getRemainingMonths = (month: string) => {
  const months = Array.from({ length: 12 }, (_, i) =>
    DateTime.local()
      .set({ month: i + 1 })
      .toFormat("MMMM")
  );

  const monthAbbreviations: { [key: string]: string } = {
    jan: "January",
    feb: "February",
    mar: "March",
    apr: "April",
    may: "May",
    jun: "June",
    jul: "July",
    aug: "August",
    sep: "September",
    oct: "October",
    nov: "November",
    dec: "December",
  };

  const fullMonth =
    monthAbbreviations[month.toLowerCase()] ?? month.toLowerCase();

  const getMonthIndex = months.indexOf(fullMonth);

  const formattedMonth = [
    ...months.slice(getMonthIndex),
    ...months.slice(0, getMonthIndex),
  ];

  return formattedMonth;
};

// eslint-disable-next-line sonarjs/no-identical-functions
export const getLeaveAccrualDifference = (accrualRate: string, months?: []) => {
  switch (accrualRate) {
    case "monthly":
      return months;

    case "quarterly":
      return [
        "First Quarter",
        "Second Quarter",
        "Third Quarter",
        "Fourth Quarter",
      ];

    case "half_yearly":
      return ["First Half", "Second Half"];

    default:
      return [];
  }
};

export const prepareLeaveApprovalTypeValues = (
  formData: Partial<ConfigureLeaveFormFieldValues>
) => {
  const modifiedFormData = formData.leave_approval;

  if (modifiedFormData) {
    const { approval_levels } = modifiedFormData;

    return approval_levels?.map((item) => {
      return {
        ...item,
        is_auto_approve_days_enabled:
          item.is_auto_approve_days_enabled || false,
        level_approvers: item.level_approvers?.map((level_approvers) => {
          return {
            approver_type: "by_employee",
            employee_id: level_approvers,
          };
        }),
      };
    });
  }
};

export const onSetupConfigureLeave = async (
  configurationStep: string,
  formRef: React.RefObject<FormRef>,
  handleFormSteps: (step: string) => void,
  mutate: (formValues: LeaveConfigurePayload) => void,
  setLeaveLimitType: (type: string) => void
  // eslint-disable-next-line sonarjs/cognitive-complexity
) => {
  if (configurationStep == "accrual") {
    await formRef.current?.trigger([
      "leave_accrual",
      "leave_quota.quota_limit",
      "leave_quota.quota_type",
    ]);

    const leaveLimitType =
      formRef.current?.watch("leave_quota.quota_type") ?? "";

    const unevenAccrualRates =
      formRef.current?.watch("leave_accrual.uneven_accrual_rates") ?? [];

    const unevenAccrualRatesTotal = sum(
      unevenAccrualRates.map((rate) => rate ?? 0)
    );

    const quotaLimit = formRef.current?.watch("leave_quota.quota_limit");

    const isRateTotalToQuotaLimit =
      unevenAccrualRatesTotal > 0 && unevenAccrualRatesTotal != quotaLimit;

    if (leaveLimitType === "limited") {
      if (!isRateTotalToQuotaLimit) {
        handleFormSteps("accrual-prorate");
      }
    } else {
      handleFormSteps("application-usage");
      formRef.current?.resetField("leave_accrual_prorate");
      formRef.current?.resetField("year_end_processing");
    }

    setLeaveLimitType(leaveLimitType);
  }

  if (configurationStep == "accrual-prorate") {
    await formRef.current?.trigger([
      "leave_accrual_prorate",
      "leave_restrictions.days_after_leave_allowed",
      "leave_restrictions.max_leave_days_in_probation",
    ]);

    handleFormSteps("application-usage");
  }

  if (
    configurationStep == "application-usage" &&
    isEmpty(formRef.current?.errors)
  ) {
    await formRef.current?.trigger([
      "leave_application_and_usage",
      "leave_quota.is_restrict_apply_leave_in_credited_year",
      "leave_quota.has_restricted_leave_type_pairs",
      "leave_quota.restricted_leave_type_ids",
      "leave_restrictions",
    ]);

    handleFormSteps("sandwich");
  }

  if (configurationStep == "sandwich" && isEmpty(formRef.current?.errors)) {
    await formRef.current?.trigger(["leave_sandwich"]);

    handleFormSteps("approval");
  }

  if (configurationStep == "approval" && isEmpty(formRef.current?.errors)) {
    await formRef.current?.trigger(["leave_approval"]);

    handleFormSteps("year-end");
  }

  if (configurationStep == "year-end" && isEmpty(formRef.current?.errors)) {
    await formRef.current?.trigger(["year_end_processing"]);

    if (isEmpty(formRef.current?.errors)) {
      return formRef.current?.submitForm((formValues) => {
        mutate?.(formValues as LeaveConfigurePayload);
      });
    }
  }
};

export const handlePreviousStep = async (
  configurationStep: string,
  formRef: React.RefObject<FormRef>,
  handleFormSteps: (step: string) => void
) => {
  if (configurationStep == "accrual-prorate") {
    await formRef.current?.trigger([
      "leave_accrual_prorate",
      "leave_restrictions.max_leave_days_in_probation",
    ]);

    handleFormSteps("accrual");
  }

  if (
    configurationStep == "application-usage" &&
    isEmpty(formRef.current?.errors)
  ) {
    await formRef.current?.trigger([
      "leave_application_and_usage",
      "leave_quota.is_restrict_apply_leave_in_credited_year",
      "leave_quota.has_restricted_leave_type_pairs",
      "leave_quota.restricted_leave_type_ids",
      "leave_restrictions",
    ]);

    const leaveLimitType =
      formRef.current?.watch("leave_quota.quota_type") ?? "";

    if (leaveLimitType === "limited") {
      handleFormSteps("accrual-prorate");
    } else {
      handleFormSteps("accrual");
    }
  }

  if (configurationStep == "sandwich" && isEmpty(formRef.current?.errors)) {
    await formRef.current?.trigger(["leave_sandwich"]);

    handleFormSteps("application-usage");
  }

  if (configurationStep == "approval" && isEmpty(formRef.current?.errors)) {
    await formRef.current?.trigger(["leave_approval"]);

    handleFormSteps("sandwich");
  }

  if (configurationStep == "year-end" && isEmpty(formRef.current?.errors)) {
    await formRef.current?.trigger(["year_end_processing"]);

    handleFormSteps("approval");
  }
};
