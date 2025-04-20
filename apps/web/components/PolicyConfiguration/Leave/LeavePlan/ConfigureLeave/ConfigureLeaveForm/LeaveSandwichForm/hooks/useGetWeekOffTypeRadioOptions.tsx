import type { LeaveSandwichFormProps } from "../LeaveSandwichForm";

export function useGetWeekOffTypeRadioOptions({
  disabled = false,
}: LeaveSandwichFormProps) {
  const weekOffTypeRadioOptions = [
    {
      label: "Weekly Off is between 2 leave days",
      values: "between",
      disabled,
    },

    {
      label: "Weekly Off is right before a leave day",
      values: "before",
      disabled,
    },
    {
      label: "Weekly Off is right after a leave day",
      values: "after",
      disabled,
    },
    {
      label: "Weekly Off is before, after of between leave days",
      values: "anywhere",
      disabled,
    },
  ];

  const holidayOverlapTypeRadioOptions = [
    {
      label: "Holiday is between 2 leave days",
      values: "between",
      disabled,
    },

    {
      label: "Holiday is right before a leave day",
      values: "before",
      disabled,
    },
    {
      label: "Holiday is right after a leave day",
      values: "after",
      disabled,
    },
    {
      label: "Holiday is before, after of between leave days",
      values: "anywhere",
      disabled,
    },
  ];

  return { weekOffTypeRadioOptions, holidayOverlapTypeRadioOptions };
}
