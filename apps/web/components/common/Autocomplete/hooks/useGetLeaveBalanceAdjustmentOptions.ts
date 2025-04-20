export function useGetLeaveBalanceAdjustmentOptions() {
  const leaveBalanceAdjustmentOptions = [
    { label: "Reset Balance", value: "reset" },
    { label: "Encash All", value: "encash_all" },
    { label: "Carry Forward All", value: "carry_forward_all" },
    {
      label: "Carry Forward First, Pay Remainder",
      value: "carry_forward_than_encash",
    },
    {
      label: "Pay First, Carry Forward Remainder",
      value: "encash_than_carry_forward",
    },
  ];

  return { leaveBalanceAdjustmentOptions };
}
