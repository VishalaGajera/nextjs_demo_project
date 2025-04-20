export const getDisplayText = (value: boolean | null) => {
  switch (value) {
    case true:
      return "Yes";

    case false:
      return "No";

    default:
      return "-";
  }
};
