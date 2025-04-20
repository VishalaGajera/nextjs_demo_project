export const getRoundingLabel = (
  minutes: number,
  interval: number,
  method: "nearest" | "up" | "down"
) => {
  const calculateRoundedValue = (
    value: number,
    interval: number,
    method: "nearest" | "up" | "down"
  ) => {
    switch (method) {
      case "nearest":
        return Math.round(value / interval) * interval;

      case "up":
        return Math.ceil(value / interval) * interval;

      case "down":
        return Math.floor(value / interval) * interval;

      default:
        throw new Error("Invalid rounding method");
    }
  };

  const roundedValue = calculateRoundedValue(minutes, interval, method);

  // eslint-disable-next-line sonarjs/no-nested-template-literals
  return ` If the interval chosen is ${interval} minutes, a ${minutes}-minute entry will be rounded ${method === "nearest" ? "to the nearest" : ` ${method}`} to ${roundedValue} minutes.`;
};
