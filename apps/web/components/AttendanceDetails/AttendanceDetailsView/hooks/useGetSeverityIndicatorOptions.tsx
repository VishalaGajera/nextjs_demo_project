import {
  getColorByVariant,
  getStatusLabel,
  serverityOptions,
  type WorkDayType,
} from "@codezee/sixtify-brahma";

type SeverityIndicatorProps = {
  title: string;
  color: string;
};

type SeverityIndicatorOptionsProps = {
  customSeverityOptions: WorkDayType[] | null;
};

export const useGetSeverityIndicatorOptions = ({
  customSeverityOptions,
}: SeverityIndicatorOptionsProps) => {
  const options: SeverityIndicatorProps[] = (
    customSeverityOptions ?? (Object.keys(serverityOptions) as WorkDayType[])
  ).map((option) => ({
    color: getColorByVariant(option)!,
    title: getStatusLabel(option)!,
  }));

  return { options };
};
