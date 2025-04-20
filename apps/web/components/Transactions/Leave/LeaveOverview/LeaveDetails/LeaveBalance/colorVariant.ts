import { useTheme } from "@mui/material";

export type LeaveType =
  | "paid"
  | "unpaid"
  | "earned_leave"
  | "sick_leave"
  | "casual_leave"
  | "maternity_leave"
  | "paternity_leave";

export type StatusType = "approved" | "rejected" | "cancelled" | "pending";

export const optionsShortHands: Record<string, string> = {
  present: "P",
  holiday: "HO",
  weekly_off: "WO",
  absent: "A",
  weekly_off_present: "WOP",
  holiday_preset: "HOP",
};

export const getColorByVariant = (
  variant: string,
  type: "light" | "dark" = "dark"
) => {
  const theme = useTheme();

  const {
    darkMint,
    darkOrange,
    butterflyBlue,
    red,
    sapphireBlue,
    lipstickRed,
  } = theme.palette.app.color;

  const index = type === "light" ? 600 : 900;

  switch (variant) {
    case "approved":
      return darkMint[index];

    case "rejected":
      return red[index];

    case "cancelled":
      return butterflyBlue[index];

    case "pending":
      return darkOrange[index];

    case "present":
      return darkMint[index];

    case "working":
      return darkMint[index];

    case "holiday":
      return sapphireBlue[index];

    case "weekly_off":
      return darkOrange[index];

    case "absent":
      return lipstickRed[index];

    case "weekly_off_present":
      return darkOrange[index];

    case "holiday_preset":
      return sapphireBlue[index];

    default:
      return butterflyBlue[index];
  }
};

export const getStatusLabel = (status: string) => {
  switch (status) {
    case "earned_leave":
      return "Earned Leave";

    case "sick_leave":
      return "Sick Leave";

    case "casual_leave":
      return "Casual Leave";

    case "maternity_leave":
      return "Maternity Leave";

    case "paternity_leave":
      return "Paternity Leave";

    case "present":
      return "Present";

    case "absent":
      return "Absent";

    case "weekly_off":
      return "Weekly Off";

    case "holiday":
      return "Holiday";

    case "weekly_off_present":
      return "Weekly Off Present";

    case "holiday_preset":
      return "Holiday Present";

    default:
      return "Earned Leave";
  }
};
